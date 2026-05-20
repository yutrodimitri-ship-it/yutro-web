import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { talents } from "@/db/schema";
import { verifySession } from "@/lib/auth";
import { talentUpdateSchema } from "@/lib/talent/admin-schemas";
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

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const guard = await requireAdminSession();
  if ("error" in guard) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }

  const { code } = await params;
  const [row] = await db
    .select()
    .from(talents)
    .where(eq(talents.code, code))
    .limit(1);
  if (!row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(row);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const guard = await requireAdminSession();
  if ("error" in guard) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }

  const { code } = await params;
  const body = await request.json().catch(() => null);
  const parsed = talentUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 422 }
    );
  }

  // code es immutable
  const { code: _ignore, ...updates } = parsed.data;
  void _ignore;

  await db
    .update(talents)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(talents.code, code));

  await logAuditEventServer("admin_talent_updated", {
    userEmail: guard.session.email,
    projectSlug: "*",
    talentCode: code,
    payload: { fields: Object.keys(updates) },
  });

  return NextResponse.json({ ok: true });
}

/** DELETE — soft delete (isActive = false). */
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const guard = await requireAdminSession();
  if ("error" in guard) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }

  const { code } = await params;
  await db
    .update(talents)
    .set({ isActive: false, updatedAt: new Date() })
    .where(eq(talents.code, code));

  await logAuditEventServer("admin_talent_deactivated", {
    userEmail: guard.session.email,
    projectSlug: "*",
    talentCode: code,
  });

  return NextResponse.json({ ok: true });
}
