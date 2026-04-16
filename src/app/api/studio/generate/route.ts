import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, generations, creditTransactions } from "@/db/schema";
import { requireAuth } from "@/lib/auth";
import { eq, and, sql } from "drizzle-orm";
import { z } from "zod";
import { checkRateLimit } from "@/lib/rate-limit";

const generateSchema = z.object({
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
  wardrobePreset: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const data = generateSchema.parse(body);

    // Rate limit: max 3 generations per 5 minutes per user
    const rl = await checkRateLimit(`studio-gen:${session.userId}`, 3, 5 * 60 * 1000);
    if (!rl.allowed) {
      return NextResponse.json({ error: "Demasiadas generaciones. Espera unos minutos." }, { status: 429 });
    }

    // Atomic credit deduction — prevents race condition
    const [updated] = await db
      .update(users)
      .set({ credits: sql`${users.credits} - 1`, updatedAt: new Date() })
      .where(and(eq(users.id, session.userId), sql`${users.credits} >= 1`))
      .returning({ credits: users.credits });

    if (!updated) {
      return NextResponse.json({ error: "No tienes creditos suficientes" }, { status: 402 });
    }

    // Create generation record
    const [generation] = await db.insert(generations).values({
      userId: session.userId,
      status: "pending",
      gender: data.gender,
      ageRange: data.ageRange,
      ethnicity: data.ethnicity,
      hairTexture: data.hairTexture || null,
      hairCut: data.hairCut || null,
      hairLength: data.hairLength || null,
      hairColor: data.hairColor || null,
      eyeShape: data.eyeShape || null,
      eyeColor: data.eyeColor || null,
      skinTone: data.skinTone || null,
      skinSubtone: data.skinSubtone || null,
      wardrobePreset: data.wardrobePreset,
      startedAt: new Date(),
    }).returning({ id: generations.id });

    // Log credit transaction
    await db.insert(creditTransactions).values({
      userId: session.userId,
      amount: -1,
      reason: "generation",
      generationId: generation.id,
    });

    return NextResponse.json({ generationId: generation.id }, { status: 202 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error";
    if (msg === "Unauthorized") return NextResponse.json({ error: msg }, { status: 401 });
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.issues }, { status: 400 });
    console.error("Generate error:", e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
