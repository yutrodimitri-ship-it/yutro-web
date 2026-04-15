import { NextResponse } from "next/server";
import { db } from "@/db";
import { generations } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { timingSafeEqual } from "crypto";

export const uuidSchema = z.string().uuid();

export function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

export async function verifyGenerationOwnership(generationId: string, userId: string) {
  if (!uuidSchema.safeParse(generationId).success) return null;
  const [gen] = await db
    .select({ id: generations.id })
    .from(generations)
    .where(and(eq(generations.id, generationId), eq(generations.userId, userId)))
    .limit(1);
  return gen;
}

export function handleApiError(e: unknown): NextResponse {
  const msg = e instanceof Error ? e.message : "Error";
  if (msg === "Unauthorized") return NextResponse.json({ error: msg }, { status: 401 });
  if (msg === "Forbidden") return NextResponse.json({ error: msg }, { status: 403 });
  if (e instanceof z.ZodError) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  console.error("API error:", e);
  return NextResponse.json({ error: "Error interno" }, { status: 500 });
}

export function requireEnvSecret(name: string): string {
  const val = process.env[name];
  if (!val) {
    if (process.env.NODE_ENV === "production") throw new Error(`${name} not configured`);
    console.warn(`WARNING: ${name} not set`);
    return "";
  }
  return val;
}
