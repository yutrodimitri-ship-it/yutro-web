import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { generations, generationImages } from "@/db/schema";
import { requireAuth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

// Only allow valid forward transitions
const VALID_TRANSITIONS: Record<string, string[]> = {
  pending: ["step1", "failed"],
  step1: ["step2", "completed", "failed"],
  step2: ["step3", "completed", "failed"],
  step3: ["completed", "failed"],
};

const updateSchema = z.object({
  status: z.enum(["step1", "step2", "step3", "completed", "failed"]),
  imageUrl: z.string().optional(),
  imageStep: z.number().min(1).max(3).optional(),
  imageFilename: z.string().regex(/^[a-zA-Z0-9_.-]+\.png$/).optional(),
  errorMessage: z.string().max(500).optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const data = updateSchema.parse(body);

    // Verify ownership and get current status
    const [gen] = await db
      .select({ id: generations.id, status: generations.status })
      .from(generations)
      .where(and(eq(generations.id, id), eq(generations.userId, session.userId)))
      .limit(1);

    if (!gen) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Validate state transition
    const allowed = VALID_TRANSITIONS[gen.status];
    if (!allowed || !allowed.includes(data.status)) {
      return NextResponse.json({ error: "Invalid status transition" }, { status: 400 });
    }

    // Update status
    const updateData: Record<string, unknown> = { status: data.status };
    if (data.status === "completed") updateData.completedAt = new Date();
    if (data.status === "failed") {
      updateData.completedAt = new Date();
      updateData.errorMessage = data.errorMessage || "Error desconocido";
    }

    await db.update(generations).set(updateData).where(eq(generations.id, id));

    // Save image if provided (only with valid filename)
    if (data.imageFilename && data.imageStep) {
      await db.insert(generationImages).values({
        generationId: id,
        step: data.imageStep,
        storagePath: data.imageFilename,
        publicUrl: `/api/studio/images/${data.imageFilename}`,
        filename: data.imageFilename,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error";
    if (msg === "Unauthorized") return NextResponse.json({ error: msg }, { status: 401 });
    if (e instanceof z.ZodError) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    console.error("Update generation error:", e);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
