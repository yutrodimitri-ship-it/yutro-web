import { NextResponse } from "next/server";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { ndaAcceptances } from "@/db/schema";
import { verifySession } from "@/lib/auth";
import { logAuditEventServer } from "@/lib/talent/audit-log-server";

export const dynamic = "force-dynamic";

/**
 * POST /api/studio/talent/admin/projects/[slug]/nda/[email]/revoke
 *
 * Revoca el NDA aceptado del email para el proyecto. La proxima vez que el
 * cliente entre, NdaGate vera `accepted: false` y volvera a mostrar el modal.
 */
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ slug: string; email: string }> }
) {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { slug, email } = await params;
  const decoded = decodeURIComponent(email).toLowerCase();

  await db
    .update(ndaAcceptances)
    .set({ revokedAt: new Date(), revokedBy: session.userId })
    .where(
      and(
        eq(ndaAcceptances.projectSlug, slug),
        eq(ndaAcceptances.userEmail, decoded),
        isNull(ndaAcceptances.revokedAt)
      )
    );

  await logAuditEventServer("admin_nda_revoked", {
    userEmail: session.email,
    projectSlug: slug,
    payload: { ndaRevokedFor: decoded },
  });

  return NextResponse.json({ ok: true });
}
