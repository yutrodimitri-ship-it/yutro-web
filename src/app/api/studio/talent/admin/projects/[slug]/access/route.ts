import { NextResponse } from "next/server";
import { z } from "zod";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { talentProjectAccess } from "@/db/schema";
import { verifySession } from "@/lib/auth";
import { logAuditEventServer } from "@/lib/talent/audit-log-server";

export const dynamic = "force-dynamic";

const grantSchema = z.object({
  email: z.email().max(254),
});

const revokeSchema = z.object({
  email: z.email().max(254),
});

async function requireAdminSession() {
  const session = await verifySession();
  if (!session) return { error: "Unauthorized" as const, status: 401 };
  if (session.role !== "admin") {
    return { error: "Forbidden" as const, status: 403 };
  }
  return { session };
}

/** POST — otorgar acceso (idempotente: re-grant reactiva si estaba revoked). */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const guard = await requireAdminSession();
  if ("error" in guard) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }

  const { slug } = await params;
  const body = await request.json().catch(() => null);
  const parsed = grantSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email" }, { status: 422 });
  }
  const email = parsed.data.email.toLowerCase();

  // Si existe row revoked, reactivar
  const [existing] = await db
    .select()
    .from(talentProjectAccess)
    .where(
      and(
        eq(talentProjectAccess.projectSlug, slug),
        eq(talentProjectAccess.userEmail, email)
      )
    )
    .limit(1);

  if (existing) {
    if (existing.revokedAt) {
      await db
        .update(talentProjectAccess)
        .set({ revokedAt: null, grantedAt: new Date() })
        .where(eq(talentProjectAccess.id, existing.id));
    }
  } else {
    await db.insert(talentProjectAccess).values({
      projectSlug: slug,
      userEmail: email,
      grantedBy: guard.session.userId,
    });
  }

  await logAuditEventServer("admin_access_granted", {
    userEmail: guard.session.email,
    projectSlug: slug,
    payload: { grantedTo: email },
  });

  return NextResponse.json({ ok: true });
}

/** DELETE — revocar acceso (soft: setea revokedAt). */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const guard = await requireAdminSession();
  if ("error" in guard) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }

  const { slug } = await params;
  const body = await request.json().catch(() => null);
  const parsed = revokeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email" }, { status: 422 });
  }
  const email = parsed.data.email.toLowerCase();

  await db
    .update(talentProjectAccess)
    .set({ revokedAt: new Date() })
    .where(
      and(
        eq(talentProjectAccess.projectSlug, slug),
        eq(talentProjectAccess.userEmail, email),
        isNull(talentProjectAccess.revokedAt)
      )
    );

  await logAuditEventServer("admin_access_revoked", {
    userEmail: guard.session.email,
    projectSlug: slug,
    payload: { revokedFrom: email },
  });

  return NextResponse.json({ ok: true });
}
