import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { z } from "zod";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import {
  castingSubmissions,
  talentProjectAccess,
  talentProjects,
} from "@/db/schema";
import { verifySession } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { castingIdempotencyKey } from "@/lib/talent/idempotency";
import { sendCastingNotification } from "@/lib/talent/email";
import { logAuditEventServer } from "@/lib/talent/audit-log-server";

/**
 * POST /api/studio/talent/castings
 *
 * Confirma la seleccion de casting del cliente. Persiste en
 * `casting_submissions` con idempotencia por hash (project + sortedShortlist
 * + sortedExclusives + minuto), y dispara email transaccional a Yutro.
 *
 *   401  sin sesion
 *   403  sin acceso al proyecto
 *   404  proyecto no existe
 *   422  payload invalido / caps excedidos / exclusives ⊄ shortlist
 *   429  rate limit (10 submits/hora/email)
 *   200  { submissionId, deduplicated }
 *
 * Si el email falla, el submission YA esta en DB — el error de email no
 * rompe el flujo (admin puede reenviar manual desde Sprint 7).
 */
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  projectSlug: z.string().min(1).max(64),
  shortlist: z.array(z.string().max(16)).min(1).max(20),
  exclusives: z.array(z.string().max(16)).max(10),
});

export async function POST(request: Request) {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const { allowed } = await checkRateLimit(
    `casting-submit:${session.email}`,
    10,
    60 * 60_000
  );
  if (!allowed) {
    return NextResponse.json({ error: "Rate limit" }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
      { status: 422 }
    );
  }

  const { projectSlug, shortlist, exclusives } = parsed.data;
  const userEmail = session.email.toLowerCase();

  // Acceso al proyecto
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

  // Exclusivos ⊆ shortlist
  if (!exclusives.every((c) => shortlist.includes(c))) {
    return NextResponse.json(
      { error: "Exclusives must be subset of shortlist" },
      { status: 422 }
    );
  }

  // Cargar proyecto + caps
  const [project] = await db
    .select()
    .from(talentProjects)
    .where(eq(talentProjects.slug, projectSlug))
    .limit(1);
  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (shortlist.length > project.maxTalents) {
    return NextResponse.json(
      { error: "Exceeds maxTalents" },
      { status: 422 }
    );
  }
  if (exclusives.length > project.maxExclusive) {
    return NextResponse.json(
      { error: "Exceeds maxExclusive" },
      { status: 422 }
    );
  }

  // Idempotencia
  const idempotencyKey = castingIdempotencyKey(
    projectSlug,
    shortlist,
    exclusives
  );
  const [existing] = await db
    .select({ id: castingSubmissions.id })
    .from(castingSubmissions)
    .where(eq(castingSubmissions.idempotencyKey, idempotencyKey))
    .limit(1);
  if (existing) {
    return NextResponse.json({
      submissionId: existing.id,
      deduplicated: true,
    });
  }

  // Insert
  const [submission] = await db
    .insert(castingSubmissions)
    .values({
      projectSlug,
      userEmail,
      shortlist,
      exclusives,
      idempotencyKey,
    })
    .returning({
      id: castingSubmissions.id,
      submittedAt: castingSubmissions.submittedAt,
    });

  // Audit (server-side, va directo a DB)
  await logAuditEventServer("casting_submitted", {
    userEmail: session.email,
    projectSlug,
    payload: {
      submissionId: submission.id,
      selectedCount: shortlist.length,
      exclusiveCount: exclusives.length,
    },
    ipAddress: ip,
  });

  // Email — non-blocking del response. Si falla, el submission ya esta en DB.
  try {
    await sendCastingNotification({
      projectName: project.name,
      projectClient: project.client,
      projectSlug,
      contactEmail: session.email,
      contactName: project.contactName,
      shortlist,
      exclusives,
      market: project.market,
      rightsDuration: project.rightsDurationEs,
      exclusivityMode: project.exclusivityMode,
      submissionId: submission.id,
      submittedAt: submission.submittedAt,
    });
  } catch (err) {
    console.error("[casting:email-failed]", err);
    Sentry.captureException(err, {
      tags: { module: "talent", flow: "casting-submit-email" },
      extra: { submissionId: submission.id, projectSlug },
    });
    // Marcar email como fallido (admin puede reenviar desde panel)
    try {
      await db
        .update(castingSubmissions)
        .set({ emailDeliveryStatus: "failed" })
        .where(eq(castingSubmissions.id, submission.id));
    } catch {
      // ignore: el submission ya esta en DB con submissionId
    }
  }

  return NextResponse.json({
    submissionId: submission.id,
    deduplicated: false,
  });
}
