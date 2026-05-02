import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { talents } from "@/db/schema";
import { verifySession } from "@/lib/auth";
import { talentInputSchema } from "@/lib/talent/admin-schemas";
import { logAuditEventServer } from "@/lib/talent/audit-log-server";

export const dynamic = "force-dynamic";

async function requireAdminSession() {
  const session = await verifySession();
  if (!session) return { error: "Unauthorized" as const, status: 401 };
  if (session.role !== "admin") {
    return { error: "Forbidden" as const, status: 403 };
  }
  return { session };
}

/** GET — lista paginada (50 por pagina). */
export async function GET() {
  const guard = await requireAdminSession();
  if ("error" in guard) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }

  const rows = await db.select().from(talents);
  return NextResponse.json(rows);
}

/** POST — crear talent. */
export async function POST(request: Request) {
  const guard = await requireAdminSession();
  if ("error" in guard) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }

  const body = await request.json().catch(() => null);
  const parsed = talentInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 422 }
    );
  }

  // Code unique check
  const existing = await db
    .select({ code: talents.code })
    .from(talents)
    .where(eq(talents.code, parsed.data.code))
    .limit(1);
  if (existing.length > 0) {
    return NextResponse.json(
      { error: "Talent code already exists" },
      { status: 409 }
    );
  }

  const data = parsed.data;
  await db.insert(talents).values({
    code: data.code,
    nameEs: data.nameEs,
    nameEn: data.nameEn,
    shortDescEs: data.shortDescEs,
    shortDescEn: data.shortDescEn,
    phenotypeEs: data.phenotypeEs,
    phenotypeEn: data.phenotypeEn,
    archetypeEs: data.archetypeEs,
    archetypeEn: data.archetypeEn,
    toneCommercialEs: data.toneCommercialEs,
    toneCommercialEn: data.toneCommercialEn,
    gender: data.gender,
    ageRange: data.ageRange,
    ageBucket: data.ageBucket,
    category: data.category,
    status: data.status,
    market: data.market,
    suggestedUses: data.suggestedUses,
    hue: data.hue,
    sat: data.sat,
    isActive: data.isActive,
  });

  await logAuditEventServer("admin_talent_created", {
    userEmail: guard.session.email,
    projectSlug: "*",
    talentCode: data.code,
    payload: { name: data.nameEs },
  });

  return NextResponse.json({ ok: true, code: data.code }, { status: 201 });
}
