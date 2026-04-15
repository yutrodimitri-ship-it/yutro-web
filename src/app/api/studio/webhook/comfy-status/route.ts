import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { generations, generationImages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { safeCompare } from "@/lib/api-utils";

const webhookSchema = z.object({
  generationId: z.string().uuid(),
  status: z.enum(["step1", "step2", "step3", "completed", "failed"]),
  error: z.string().max(500).optional(),
  images: z.array(z.object({
    step: z.number().int().min(1).max(3),
    storagePath: z.string().regex(/^[a-zA-Z0-9_.\/-]+$/),
    publicUrl: z.string(),
    filename: z.string().regex(/^[a-zA-Z0-9_.-]+\.png$/),
  })).optional(),
});

export async function POST(request: NextRequest) {
  const secret = process.env.STUDIO_WEBHOOK_SECRET;
  if (!secret) {
    console.error("STUDIO_WEBHOOK_SECRET not configured");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const provided = request.headers.get("x-webhook-secret") || "";
  if (!safeCompare(provided, secret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = webhookSchema.parse(body);

    // Verify generation exists
    const [gen] = await db.select({ id: generations.id }).from(generations).where(eq(generations.id, data.generationId)).limit(1);
    if (!gen) return NextResponse.json({ error: "Generation not found" }, { status: 404 });

    const updateData: Record<string, unknown> = { status: data.status };
    if (data.status === "completed") updateData.completedAt = new Date();
    if (data.status === "failed") {
      updateData.completedAt = new Date();
      updateData.errorMessage = data.error || "Unknown error";
    }

    await db.update(generations).set(updateData).where(eq(generations.id, data.generationId));

    if (data.status === "completed" && data.images?.length) {
      await db.insert(generationImages).values(
        data.images.map(img => ({
          generationId: data.generationId,
          step: img.step,
          storagePath: img.storagePath,
          publicUrl: img.publicUrl,
          filename: img.filename,
        }))
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    console.error("Webhook error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
