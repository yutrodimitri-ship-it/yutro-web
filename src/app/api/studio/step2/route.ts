import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { verifyGenerationOwnership, handleApiError, requireEnvSecret } from "@/lib/api-utils";
import { checkRateLimit } from "@/lib/rate-limit";
import { z } from "zod";

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

    const tunnelUrl = process.env.COMFY_TUNNEL_URL || "https://comfy.yutro.cl";
    const tunnelSecret = requireEnvSecret("COMFY_TUNNEL_SECRET");

    const res = await fetch(`${tunnelUrl}/step2`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(tunnelSecret ? { "X-Tunnel-Secret": tunnelSecret } : {}) },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(300000),
    });

    const result = await res.json();
    return NextResponse.json(result, { status: res.ok ? 200 : 500 });
  } catch (e) {
    return handleApiError(e);
  }
}
