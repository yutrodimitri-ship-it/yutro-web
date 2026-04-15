import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { generations, generationImages, creditTransactions } from "@/db/schema";
import { requireAuth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    // Verify ownership
    const [gen] = await db
      .select({ id: generations.id })
      .from(generations)
      .where(and(eq(generations.id, id), eq(generations.userId, session.userId)))
      .limit(1);

    if (!gen) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Delete related records first
    await db.delete(generationImages).where(eq(generationImages.generationId, id));
    await db.delete(creditTransactions).where(eq(creditTransactions.generationId, id));
    await db.delete(generations).where(eq(generations.id, id));

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error";
    if (msg === "Unauthorized") return NextResponse.json({ error: msg }, { status: 401 });
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
