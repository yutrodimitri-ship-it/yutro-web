import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, creditTransactions } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

const addCreditsSchema = z.object({
  amount: z.number().int().min(1),
  reason: z.string().default("admin_grant"),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const data = addCreditsSchema.parse(body);

    const [user] = await db
      .select({ id: users.id, credits: users.credits })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Add credits and log transaction
    const [updated] = await db
      .update(users)
      .set({
        credits: sql`${users.credits} + ${data.amount}`,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning({ id: users.id, credits: users.credits });

    await db.insert(creditTransactions).values({
      userId: id,
      amount: data.amount,
      reason: data.reason,
      adminId: session.userId,
    });

    return NextResponse.json({
      userId: updated.id,
      credits: updated.credits,
      added: data.amount,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error";
    if (msg === "Unauthorized") return NextResponse.json({ error: msg }, { status: 401 });
    if (msg === "Forbidden") return NextResponse.json({ error: msg }, { status: 403 });
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.issues }, { status: 400 });
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
