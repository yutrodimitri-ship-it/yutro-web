import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { verifyGenerationOwnership, handleApiError, requireEnvSecret } from "@/lib/api-utils";
import { checkRateLimit } from "@/lib/rate-limit";
import { z } from "zod";

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

    const tunnelUrl = process.env.COMFY_TUNNEL_URL || "https://comfy.yutro.cl";
    const tunnelSecret = requireEnvSecret("COMFY_TUNNEL_SECRET");

    const res = await fetch(`${tunnelUrl}/step1`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(tunnelSecret ? { "X-Tunnel-Secret": tunnelSecret } : {}) },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(120000),
    });

    const result = await res.json();
    return NextResponse.json(result, { status: res.ok ? 200 : 500 });
  } catch (e) {
    return handleApiError(e);
  }
}
