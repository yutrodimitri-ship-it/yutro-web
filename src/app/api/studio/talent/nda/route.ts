import { NextResponse } from "next/server";
import { z } from "zod";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { ndaAcceptances, talentProjectAccess } from "@/db/schema";
import { verifySession } from "@/lib/auth";

/**
 * NDA endpoints — fuente de verdad legal.
 *
 *   GET  /api/studio/talent/nda?projectSlug=...
 *        → { accepted: boolean }
 *
 *   POST /api/studio/talent/nda
 *        body: { projectSlug }
 *        → { ok: true }
 *
 * El cliente consulta GET al cargar el modal — si DB ya tiene aceptacion
 * vigente, NdaGate skipea el modal directamente. POST persiste la
 * aceptacion con IP + UA para trazabilidad.
 */
export const dynamic = "force-dynamic";

const projectSchema = z.object({
  projectSlug: z.string().min(1).max(64),
});

export async function GET(request: Request) {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const parsed = projectSchema.safeParse({
    projectSlug: url.searchParams.get("projectSlug"),
  });
  if (!parsed.success) {
    return NextResponse.json({ accepted: false });
  }

  const userEmail = session.email.toLowerCase();
  const { projectSlug } = parsed.data;

  const [row] = await db
    .select({ id: ndaAcceptances.id })
    .from(ndaAcceptances)
    .where(
      and(
        eq(ndaAcceptances.projectSlug, projectSlug),
        eq(ndaAcceptances.userEmail, userEmail),
        isNull(ndaAcceptances.revokedAt)
      )
    )
    .limit(1);

  return NextResponse.json(
    { accepted: Boolean(row) },
    { headers: { "Cache-Control": "private, no-store" } }
  );
}

export async function POST(request: Request) {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid" }, { status: 422 });
  }

  const userEmail = session.email.toLowerCase();
  const { projectSlug } = parsed.data;

  // Ownership
  const [access] = await db
    .select({ id: talentProjectAccess.id })
    .from(talentProjectAccess)
    .where(
      and(
        eq(talentProjectAccess.projectSlug, projectSlug),
        eq(talentProjectAccess.userEmail, userEmail),
        isNull(talentProjectAccess.revokedAt)
      )
    )
    .limit(1);
  if (!access) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const ua = request.headers.get("user-agent") ?? null;

  // Si ya existe row (activa o revocada), actualizamos: limpiar revokedAt
  // y refrescar acceptedAt + IP/UA. Esto permite re-aceptacion despues de
  // que un admin revoque el NDA. La unique index (projectSlug, userEmail)
  // garantiza que solo hay una row por (proyecto, email).
  const [existing] = await db
    .select({ id: ndaAcceptances.id })
    .from(ndaAcceptances)
    .where(
      and(
        eq(ndaAcceptances.projectSlug, projectSlug),
        eq(ndaAcceptances.userEmail, userEmail)
      )
    )
    .limit(1);

  if (existing) {
    await db
      .update(ndaAcceptances)
      .set({
        acceptedAt: new Date(),
        revokedAt: null,
        revokedBy: null,
        ipAddress: ip,
        userAgent: ua,
      })
      .where(eq(ndaAcceptances.id, existing.id));
  } else {
    await db.insert(ndaAcceptances).values({
      projectSlug,
      userEmail,
      ipAddress: ip,
      userAgent: ua,
    });
  }

  return NextResponse.json({ ok: true });
}
