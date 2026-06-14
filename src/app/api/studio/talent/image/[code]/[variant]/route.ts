import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { talentProjects, talents } from "@/db/schema";
import { verifySession } from "@/lib/auth";
import { buildKey, isValidVariant } from "@/lib/talent/storage-client";
import {
  getStudioDerivative,
  watermarkHash,
} from "@/lib/talent/image-derivatives";
import { parseSize } from "@/lib/talent/image-variants";
import { logAuditEventServer } from "@/lib/talent/audit-log-server";
import { hasProjectAccess } from "@/lib/talent/access-check";

/**
 * GET /api/studio/talent/image/[code]/[variant]
 *
 * Sirve la imagen real del talent con watermark dinamico (cliente · fecha · code).
 * Bajo NINGUNA circunstancia se exponen las URLs de R2 al cliente.
 *
 *   401  sin sesion
 *   400  variant invalido / falta slug de proyecto
 *   403  no tiene acceso a este proyecto
 *   404  talent o proyecto no existe / storage no tiene la imagen
 *   200  binary JPG con watermark, cache-control: private, max-age=3600
 *
 * El slug del proyecto (necesario para el watermark con cliente + fecha) se
 * recibe por header `x-project-slug` o query `?p=`. El `?size=` elige el
 * derivado (thumb|preview). El resultado se genera UNA vez y se persiste en
 * `_derived/...` (ver image-derivatives.ts); las visitas siguientes no
 * reprocesan con sharp.
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

  const url = new URL(request.url);
  const size = parseSize(url.searchParams.get("size"));
  // Slug del proyecto: por header (fetch) o por query `?p=` (img nativo).
  const projectSlug =
    request.headers.get("x-project-slug") ?? url.searchParams.get("p");
  if (!projectSlug) {
    return NextResponse.json(
      { error: "Missing project slug" },
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

  // Derivado con watermark: se genera una vez por (talento, proyecto, variant,
  // size) y se persiste; visitas siguientes lo leen directo (sin sharp).
  const key = buildKey(code, variant);
  const clientName =
    project.client.split(" ")[0]?.toUpperCase() ?? project.client.toUpperCase();
  const date = formatWatermarkDate(project.startDate);
  const text = `YUTRO ESTUDIO · ${clientName} · ${date} · ${code}`;
  // wmHash namespacea por contenido del watermark: si cambia cliente/fecha del
  // proyecto, cambia el hash y el derivado se regenera solo.
  const wmHash = watermarkHash(`${project.client}|${project.startDate}`);

  let watermarked: Buffer;
  try {
    watermarked = await getStudioDerivative({
      originalKey: key,
      code,
      variant,
      size,
      watermarkText: text,
      wmHash,
    });
  } catch (err) {
    // 404 esperado si no se subio aun (no hace ruido en Sentry)
    if (err instanceof Error && /NoSuchKey|NotFound|404|empty body/i.test(err.message)) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }
    Sentry.captureException(err, {
      tags: { module: "talent", flow: "derivative" },
      extra: { code, variant, key, size },
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
      // Privado (lleva watermark del cliente) pero el navegador puede reusarlo
      // dentro de la sesión: el derivado es estable, no hay que revalidar.
      "Cache-Control": "private, max-age=3600",
      "X-Content-Type-Options": "nosniff",
      "Content-Length": String(watermarked.length),
    },
  });
}

function formatWatermarkDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}·${m}·${y.slice(2)}`;
}
