import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { talents } from "@/db/schema";
import {
  buildKey,
  getImageBuffer,
  isValidVariant,
} from "@/lib/talent/storage-client";

/**
 * GET /api/casting/image/[code]/[variant]
 *
 * Imagenes del lookbook PUBLICO (vitrina /casting). Sin auth — deliberado:
 * solo sirve talentos con `public_visible = true`, en resolucion preview
 * (max 1200px), nunca el material completo ni el charsheet tecnico.
 * El catalogo gateado (studio) usa la ruta protegida con watermark.
 *
 *   400  variant invalido o charsheet (privado)
 *   404  talent no existe, no es publico, o no tiene la imagen
 *   200  JPG preview, cache publico de 1 dia (CDN-friendly)
 */
export const runtime = "nodejs";

const PUBLIC_MAX_PX = 1200;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string; variant: string }> }
) {
  const { code, variant } = await params;

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

  let original: Buffer;
  try {
    original = await getImageBuffer(buildKey(code, variant));
  } catch (err) {
    if (err instanceof Error && /NoSuchKey|NotFound|404/.test(err.message)) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }
    Sentry.captureException(err, {
      tags: { module: "casting", flow: "storage-fetch" },
      extra: { code, variant },
    });
    return NextResponse.json({ error: "Storage fetch failed" }, { status: 502 });
  }

  let preview: Buffer;
  try {
    const sharp = (await import("sharp")).default;
    preview = await sharp(original)
      .resize({
        width: PUBLIC_MAX_PX,
        height: PUBLIC_MAX_PX,
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer();
  } catch (err) {
    Sentry.captureException(err, {
      tags: { module: "casting", flow: "sharp-preview" },
      extra: { code, variant },
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
