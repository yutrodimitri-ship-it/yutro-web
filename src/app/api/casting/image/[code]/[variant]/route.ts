import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { talents } from "@/db/schema";
import { buildKey, isValidVariant } from "@/lib/talent/storage-client";
import { getPublicDerivative } from "@/lib/talent/image-derivatives";
import { parseSize } from "@/lib/talent/image-variants";

/**
 * GET /api/casting/image/[code]/[variant]
 *
 * Imagenes del lookbook PUBLICO (vitrina /casting). Sin auth — deliberado:
 * solo sirve talentos con `public_visible = true`, en resolucion derivada
 * (`?size=` thumb|preview), nunca el material completo ni el charsheet tecnico.
 * El derivado se genera UNA vez y se persiste (ver image-derivatives.ts);
 * las visitas siguientes no reprocesan con sharp.
 * El catalogo gateado (studio) usa la ruta protegida con watermark.
 *
 *   400  variant invalido o charsheet (privado)
 *   404  talent no existe, no es publico, o no tiene la imagen
 *   200  JPG, cache publico de 1 dia (CDN-friendly)
 */
export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string; variant: string }> }
) {
  const { code, variant } = await params;
  const size = parseSize(new URL(request.url).searchParams.get("size"));

  // charsheet es material tecnico interno — solo via studio autenticado
  if (!isValidVariant(variant) || variant === "charsheet") {
    return NextResponse.json({ error: "Invalid variant" }, { status: 400 });
  }

  const [talent] = await db
    .select({ code: talents.code })
    .from(talents)
    .where(
      and(
        eq(talents.code, code),
        eq(talents.publicVisible, true),
        eq(talents.isActive, true)
      )
    )
    .limit(1);
  if (!talent) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let preview: Buffer;
  try {
    preview = await getPublicDerivative(buildKey(code, variant), code, variant, size);
  } catch (err) {
    if (err instanceof Error && /NoSuchKey|NotFound|404|empty body/i.test(err.message)) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }
    Sentry.captureException(err, {
      tags: { module: "casting", flow: "derivative" },
      extra: { code, variant, size },
    });
    return NextResponse.json({ error: "Image processing failed" }, { status: 500 });
  }

  return new NextResponse(new Uint8Array(preview), {
    headers: {
      "Content-Type": "image/jpeg",
      // Publico a proposito: es la vitrina. CDN cachea 1 dia.
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      "X-Content-Type-Options": "nosniff",
      "Content-Length": String(preview.length),
    },
  });
}
