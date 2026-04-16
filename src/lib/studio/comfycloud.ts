// YUTRO Studio — ComfyCloud API client
// Handles Step 1: Z-Image Turbo portrait generation in the cloud
// Uses native WebSocket (Node 20+) for job completion tracking

const COMFYCLOUD_BASE = "https://cloud.comfy.org/api";
const COMFYCLOUD_WS = "wss://cloud.comfy.org/ws";

/**
 * Build the Z-Image Turbo workflow JSON
 * Node IDs match the verified workflow from pipeline-runner.js
 */
function buildZImageWorkflow(promptText: string): Record<string, unknown> {
  return {
    "9": {
      class_type: "SaveImage",
      inputs: { filename_prefix: "retrato_yutro", images: ["57:8", 0] },
    },
    "57:30": {
      class_type: "CLIPLoader",
      inputs: { clip_name: "qwen_3_4b.safetensors", type: "lumina2", device: "default" },
    },
    "57:29": {
      class_type: "VAELoader",
      inputs: { vae_name: "ae.safetensors" },
    },
    "57:33": {
      class_type: "ConditioningZeroOut",
      inputs: { conditioning: ["57:27", 0] },
    },
    "57:8": {
      class_type: "VAEDecode",
      inputs: { samples: ["57:3", 0], vae: ["57:29", 0] },
    },
    "57:28": {
      class_type: "UNETLoader",
      inputs: { unet_name: "z_image_turbo_bf16.safetensors", weight_dtype: "default" },
    },
    "57:27": {
      class_type: "CLIPTextEncode",
      inputs: { text: promptText, clip: ["57:30", 0] },
    },
    "57:13": {
      class_type: "EmptySD3LatentImage",
      inputs: { width: 1088, height: 1344, batch_size: 1 },
    },
    "57:11": {
      class_type: "ModelSamplingAuraFlow",
      inputs: { shift: 3, model: ["57:28", 0] },
    },
    "57:3": {
      class_type: "KSampler",
      inputs: {
        seed: Math.floor(Math.random() * 2_000_000_000),
        steps: 9,
        cfg: 1,
        sampler_name: "res_multistep",
        scheduler: "simple",
        denoise: 1,
        model: ["57:11", 0],
        positive: ["57:27", 0],
        negative: ["57:33", 0],
        latent_image: ["57:13", 0],
      },
    },
  };
}

function getApiKey(): string {
  const key = process.env.COMFYCLOUD_API_KEY;
  if (!key) {
    if (process.env.NODE_ENV === "production") throw new Error("COMFYCLOUD_API_KEY not configured");
    console.warn("WARNING: COMFYCLOUD_API_KEY not set");
    return "";
  }
  return key;
}

interface OutputImage {
  filename: string;
  subfolder?: string;
  type?: string;
}

/**
 * Submit a job and wait for completion via native WebSocket
 * Returns the image as a Buffer
 */
export async function generatePortrait(promptText: string, timeoutMs = 100_000): Promise<Buffer> {
  const apiKey = getApiKey();
  const workflow = buildZImageWorkflow(promptText);

  // Submit the job
  const submitRes = await fetch(`${COMFYCLOUD_BASE}/prompt`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt: workflow }),
  });

  if (!submitRes.ok) {
    const text = await submitRes.text();
    throw new Error(`ComfyCloud submit failed ${submitRes.status}: ${text.substring(0, 300)}`);
  }

  const { prompt_id } = (await submitRes.json()) as { prompt_id: string };
  if (!prompt_id) throw new Error("ComfyCloud did not return prompt_id");
  console.log(`[ComfyCloud] Job submitted: ${prompt_id}`);

  // Wait for completion via WebSocket
  const output = await waitViaWebSocket(prompt_id, apiKey, timeoutMs);

  // Fetch the output image via /view
  const imageUrl = `${COMFYCLOUD_BASE}/view?filename=${encodeURIComponent(output.filename)}&subfolder=${encodeURIComponent(output.subfolder || "")}&type=${output.type || "output"}`;
  const imgRes = await fetch(imageUrl, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  if (!imgRes.ok) {
    throw new Error(`Failed to fetch image: ${imgRes.status}`);
  }

  return Buffer.from(await imgRes.arrayBuffer());
}

function waitViaWebSocket(
  promptId: string,
  apiKey: string,
  timeoutMs: number
): Promise<OutputImage> {
  return new Promise((resolve, reject) => {
    // Use native WebSocket (available in Node 20+ and Vercel runtime)
    const ws = new WebSocket(`${COMFYCLOUD_WS}?token=${apiKey}`);

    const timer = setTimeout(() => {
      ws.close();
      reject(new Error("ComfyCloud job timed out"));
    }, timeoutMs);

    ws.addEventListener("error", (event) => {
      clearTimeout(timer);
      reject(new Error(`WebSocket error: ${String(event)}`));
    });

    ws.addEventListener("message", (event) => {
      try {
        const msg = JSON.parse(String(event.data)) as {
          type: string;
          data: {
            prompt_id?: string;
            output?: { images?: OutputImage[] };
            exception_message?: string;
          };
        };

        if (msg.type === "executed" && msg.data?.prompt_id === promptId) {
          const images = msg.data.output?.images;
          if (images?.length) {
            clearTimeout(timer);
            ws.close();
            resolve(images[0]);
            return;
          }
        }

        if (msg.type === "execution_error" && msg.data?.prompt_id === promptId) {
          clearTimeout(timer);
          ws.close();
          reject(new Error(msg.data.exception_message || "ComfyCloud execution error"));
        }
      } catch {
        // Ignore non-JSON messages
      }
    });

    ws.addEventListener("close", () => {
      clearTimeout(timer);
    });
  });
}

/**
 * Test connection to ComfyCloud API
 */
export async function testConnection(): Promise<{ ok: boolean; message: string }> {
  try {
    const apiKey = getApiKey();
    const res = await fetch(`${COMFYCLOUD_BASE}/prompt`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = (await res.json()) as { exec_info?: { queue_remaining?: number } };
    return {
      ok: true,
      message: `ComfyCloud connected — queue: ${data.exec_info?.queue_remaining ?? "unknown"}`,
    };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Unknown error" };
  }
}
