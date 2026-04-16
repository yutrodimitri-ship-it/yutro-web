export const dynamic = "force-dynamic";
export const maxDuration = 180;

import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { verifyGenerationOwnership, handleApiError } from "@/lib/api-utils";
import { checkRateLimit } from "@/lib/rate-limit";
import { z } from "zod";
import { buildWardrobePrompt } from "@/lib/studio/prompts";
import { enrichPrompt, generateWithNB2 } from "@/lib/studio/gemini";
import { getCachedImage, cacheImage } from "@/lib/studio/image-cache";

const step2Schema = z.object({
  generationId: z.string().uuid(),
  inputImage: z.string().regex(/^[a-zA-Z0-9_.-]+\.png$/),
  wardrobePreset: z.string().min(1),
  gender: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const data = step2Schema.parse(body);

    const rl = await checkRateLimit(`studio-step:${session.userId}`, 10, 5 * 60 * 1000);
    if (!rl.allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

    const gen = await verifyGenerationOwnership(data.generationId, session.userId);
    if (!gen) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Get step1 image from cache
    const refBuffer = await getCachedImage(data.inputImage);
    if (!refBuffer) {
      return NextResponse.json(
        { error: "Imagen de referencia no encontrada. Regenera el retrato." },
        { status: 404 }
      );
    }
    const refBase64 = refBuffer.toString("base64");

    // Gemini Flash enriches the wardrobe prompt by analyzing the reference image
    const basePrompt = buildWardrobePrompt(data.wardrobePreset, data.gender);
    console.log(`[Step2] Enriching prompt for ${data.wardrobePreset}...`);
    const enrichedPrompt = await enrichPrompt(basePrompt, refBase64);

    // NB2 generates the wardrobe image
    console.log(`[Step2] Generating with NB2...`);
    const resultBase64 = await generateWithNB2(enrichedPrompt, refBase64);

    // Decode and cache
    const imageBuffer = Buffer.from(resultBase64, "base64");
    const shortId = data.generationId.replace(/-/g, "").slice(0, 8);
    const filename = `gen_${shortId}_step2.png`;
    await cacheImage(filename, imageBuffer);

    console.log(`[Step2] Cached as ${filename} (${imageBuffer.length} bytes)`);
    return NextResponse.json({ success: true, image: filename });
  } catch (e) {
    return handleApiError(e);
  }
}
