// YUTRO Studio — Gemini API client
// Gemini Flash for prompt enrichment
// NB2 (gemini-3.1-flash-image-preview) for wardrobe generation
// NB Pro (gemini-3-pro-image-preview) for contact sheet generation

const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

interface GeminiPart {
  text?: string;
  inlineData?: { mimeType: string; data: string };
}

interface GeminiResponse {
  candidates?: Array<{
    content: { parts: GeminiPart[] };
    finishReason?: string;
  }>;
  error?: { message: string; code?: number };
}

function getApiKey(): string {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY not configured");
  return key;
}

async function callGemini(
  model: string,
  parts: GeminiPart[],
  responseModalities: string[],
  systemInstruction?: string
): Promise<GeminiPart[]> {
  const body: Record<string, unknown> = {
    contents: [{ role: "user", parts }],
    generationConfig: { responseModalities },
  };

  if (systemInstruction) {
    body.systemInstruction = { parts: [{ text: systemInstruction }] };
  }

  const res = await fetch(
    `${GEMINI_BASE}/${model}:generateContent?key=${getApiKey()}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini ${model} error ${res.status}: ${text.substring(0, 300)}`);
  }

  const data = (await res.json()) as GeminiResponse;

  if (data.error) throw new Error(`Gemini error: ${data.error.message}`);
  if (!data.candidates?.length) throw new Error("Gemini returned no candidates");

  const candidate = data.candidates[0];
  if (candidate.finishReason === "SAFETY") {
    throw new Error("Content blocked by Gemini safety filters");
  }

  return candidate.content.parts;
}

/**
 * Gemini Flash — analyze image and enrich prompt
 */
export async function enrichPrompt(
  userPrompt: string,
  imageBase64?: string
): Promise<string> {
  const parts: GeminiPart[] = [];

  if (imageBase64) {
    parts.push({
      inlineData: { mimeType: "image/png", data: imageBase64 },
    });
  }
  parts.push({ text: userPrompt });

  const responseParts = await callGemini(
    "gemini-3-flash-preview",
    parts,
    ["TEXT"]
  );

  const textPart = responseParts.find((p) => p.text);
  if (!textPart?.text) throw new Error("Gemini Flash returned no text");
  return textPart.text.trim();
}

/**
 * NB2 — generate image with wardrobe applied
 */
export async function generateWithNB2(
  prompt: string,
  referenceBase64?: string
): Promise<string> {
  const parts: GeminiPart[] = [];

  if (referenceBase64) {
    parts.push({
      inlineData: { mimeType: "image/png", data: referenceBase64 },
    });
  }
  parts.push({ text: prompt });

  const responseParts = await callGemini(
    "gemini-3.1-flash-image-preview",
    parts,
    ["IMAGE", "TEXT"]
  );

  const imagePart = responseParts.find((p) => p.inlineData);
  if (!imagePart?.inlineData?.data) throw new Error("NB2 returned no image");
  return imagePart.inlineData.data;
}

/**
 * NB Pro — generate contact sheet 3x3
 */
export async function generateWithNBPro(
  prompt: string,
  referenceBase64?: string
): Promise<string> {
  const parts: GeminiPart[] = [];

  if (referenceBase64) {
    parts.push({
      inlineData: { mimeType: "image/png", data: referenceBase64 },
    });
  }
  parts.push({ text: prompt });

  const responseParts = await callGemini(
    "gemini-3-pro-image-preview",
    parts,
    ["IMAGE", "TEXT"]
  );

  const imagePart = responseParts.find((p) => p.inlineData);
  if (!imagePart?.inlineData?.data) throw new Error("NB Pro returned no image");
  return imagePart.inlineData.data;
}

/**
 * Test connection to Gemini API
 */
export async function testConnection(): Promise<{ ok: boolean; message: string }> {
  try {
    getApiKey();
    const parts: GeminiPart[] = [{ text: "Say OK" }];
    const response = await callGemini(
      "gemini-3-flash-preview",
      parts,
      ["TEXT"]
    );
    const text = response.find((p) => p.text)?.text;
    return { ok: true, message: `Gemini Flash responding: ${text?.substring(0, 50)}` };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Unknown error" };
  }
}
