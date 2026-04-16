export const dynamic = "force-dynamic";
export const maxDuration = 120;

import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { verifyGenerationOwnership, handleApiError } from "@/lib/api-utils";
import { checkRateLimit } from "@/lib/rate-limit";
import { z } from "zod";
import { buildPortraitPrompt } from "@/lib/studio/prompts";
import { generatePortrait } from "@/lib/studio/comfycloud";
import { cacheImage } from "@/lib/studio/image-cache";

const step1Schema = z.object({
  generationId: z.string().uuid(),
  gender: z.string().min(1),
  ageRange: z.string().min(1),
  ethnicity: z.string().min(1),
  hairTexture: z.string().optional(),
  hairCut: z.string().optional(),
  hairLength: z.string().optional(),
  hairColor: z.string().optional(),
  eyeShape: z.string().optional(),
  eyeColor: z.string().optional(),
  skinTone: z.string().optional(),
  skinSubtone: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const data = step1Schema.parse(body);

    const rl = await checkRateLimit(`studio-step:${session.userId}`, 10, 5 * 60 * 1000);
    if (!rl.allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

    const gen = await verifyGenerationOwnership(data.generationId, session.userId);
    if (!gen) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Build prompt from params
    const promptText = buildPortraitPrompt(data);

    // Generate via ComfyCloud (submit + WebSocket wait + fetch image)
    console.log(`[Step1] Starting ComfyCloud generation...`);
    const imageBuffer = await generatePortrait(promptText);
    console.log(`[Step1] Generation complete`);

    // Cache with a filename the frontend can reference
    const shortId = data.generationId.replace(/-/g, "").slice(0, 8);
    const filename = `gen_${shortId}_step1.png`;
    cacheImage(filename, imageBuffer);

    console.log(`[Step1] Cached as ${filename} (${imageBuffer.length} bytes)`);
    return NextResponse.json({ success: true, image: filename });
  } catch (e) {
    return handleApiError(e);
  }
}
