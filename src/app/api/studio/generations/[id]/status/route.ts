import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { generations, generationImages } from "@/db/schema";
import { requireAuth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    const [gen] = await db
      .select({
        id: generations.id,
        status: generations.status,
        gender: generations.gender,
        ageRange: generations.ageRange,
        ethnicity: generations.ethnicity,
        wardrobePreset: generations.wardrobePreset,
        errorMessage: generations.errorMessage,
        startedAt: generations.startedAt,
        completedAt: generations.completedAt,
        createdAt: generations.createdAt,
      })
      .from(generations)
      .where(and(eq(generations.id, id), eq(generations.userId, session.userId)))
      .limit(1);

    if (!gen) return NextResponse.json({ error: "Not found" }, { status: 404 });

    let images: { step: number; publicUrl: string; filename: string }[] = [];
    if (gen.status === "completed") {
      images = await db
        .select({
          step: generationImages.step,
          publicUrl: generationImages.publicUrl,
          filename: generationImages.filename,
        })
        .from(generationImages)
        .where(eq(generationImages.generationId, id));
    }

    return NextResponse.json({ ...gen, images });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error";
    if (msg === "Unauthorized") return NextResponse.json({ error: msg }, { status: 401 });
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
