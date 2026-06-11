import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { talentProjects, talents } from "@/db/schema";
import { verifySession } from "@/lib/auth";
import {
  buildKey,
  getImageBuffer,
  isValidVariant,
} from "@/lib/talent/r2-client";
import { applyWatermark } from "@/lib/talent/watermark";
import { logAuditEventServer } from "@/lib/talent/audit-log-server";
import { hasProjectAccess } from "@/lib/talent/access-check";

/**
 * GET /api/studio/talent/image/[code]/[variant]
 *
 * Sirve la imagen real del talent con watermark dinamico (cliente · fecha · code).
 * Bajo NINGUNA circunstancia se exponen las URLs de R2 al cliente.
 *
 *   401  sin sesion
 *   400  variant invalido
 *   403  no tiene acceso a este proyecto (header `x-project-slug`)
 *   404  talent o proyecto no existe / R2 no tiene la imagen
 *   200  binary JPG con watermark, cache-control: private, max-age=600
 *
 * El header `x-project-slug` es necesario para construir el watermark
 * (cliente + fecha del proyecto). Lo pasa el componente TalentImage.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string; variant: string }> }
) {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { code, variant } = await params;
  if (!isValidVariant(variant)) {
    return NextResponse.json({ error: "Invalid variant" }, { status: 400 });
  }

  const projectSlug = request.headers.get("x-project-slug");
  if (!projectSlug) {
    return NextResponse.json(
      { error: "Missing x-project-slug header" },
      { status: 400 }
    );
  }

  // Ownership check: usuario tiene acceso vigente a este proyecto
  // (admin bypassea por rol — coherente con TalentLayout).
  if (!(await hasProjectAccess(session, projectSlug))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [project] = await db
    .select()
    .from(talentProjects)
    .where(eq(talentProjects.slug, projectSlug))
    .limit(1);
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const [talent] = await db
    .select()
    .from(talents)
    .where(eq(talents.code, code))
    .limit(1);
  if (!talent) {
    return NextResponse.json({ error: "Talent not found" }, { status: 404 });
  }

  // Bajar imagen original de R2
  const key = buildKey(code, variant);
  let originalBuffer: Buffer;
  try {
    originalBuffer = await getImageBuffer(key);
  } catch (err) {
    // 404 esperado si no se subio aun (no hace ruido en Sentry)
    if (
      err instanceof Error &&
      /NoSuchKey|NotFound|404/.test(err.message)
    ) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }
    Sentry.captureException(err, {
      tags: { module: "talent", flow: "r2-fetch" },
      extra: { code, variant, key },
    });
    return NextResponse.json({ error: "R2 fetch failed" }, { status: 502 });
  }

  // Resolver dimensiones + aplicar watermark
  let watermarked: Buffer;
  try {
    const sharp = (await import("sharp")).default;
    const meta = await sharp(originalBuffer).metadata();
    const clientName =
      project.client.split(" ")[0]?.toUpperCase() ?? project.client.toUpperCase();
    const date = formatWatermarkDate(project.startDate);
    const text = `YUTRO ESTUDIO · ${clientName} · ${date} · ${code}`;

    watermarked = await applyWatermark({
      buffer: originalBuffer,
      text,
      width: meta.width ?? 1200,
      height: meta.height ?? 1600,
    });
  } catch (err) {
    Sentry.captureException(err, {
      tags: { module: "talent", flow: "sharp-watermark" },
      extra: { code, variant, key },
    });
    return NextResponse.json(
      { error: "Image processing failed" },
      { status: 500 }
    );
  }

  // Audit log async (no bloqueamos response)
  void logAuditEventServer("talent_image_viewed", {
    userEmail: session.email,
    projectSlug,
    talentCode: code,
    payload: { variant },
  });

  return new NextResponse(new Uint8Array(watermarked), {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "private, max-age=600, must-revalidate",
      "X-Content-Type-Options": "nosniff",
      "Content-Length": String(watermarked.length),
    },
  });
}

function formatWatermarkDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}·${m}·${y.slice(2)}`;
}
