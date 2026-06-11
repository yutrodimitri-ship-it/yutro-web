import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { verifySession } from "@/lib/auth";
import {
  buildKey,
  getImageBuffer,
  isValidVariant,
} from "@/lib/talent/r2-client";

/**
 * GET /api/studio/talent/admin/images/[code]/[variant]
 *
 * Endpoint admin-only que sirve la imagen raw de R2 (SIN watermark)
 * para preview en el admin panel: bulk upload existing previews,
 * submission detail thumbnails. NUNCA exponer al cliente.
 *
 * Cache mas largo que el endpoint del cliente (24h) porque las
 * imagenes raw no cambian salvo re-upload manual.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ code: string; variant: string }> }
) {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { code, variant } = await params;
  if (!isValidVariant(variant)) {
    return NextResponse.json({ error: "Invalid variant" }, { status: 400 });
  }

  const key = buildKey(code, variant);
  let buffer: Buffer;
  try {
    buffer = await getImageBuffer(key);
  } catch (err) {
    if (
      err instanceof Error &&
      /NoSuchKey|NotFound|404/.test(err.message)
    ) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }
    Sentry.captureException(err, {
      tags: { module: "talent", flow: "r2-fetch-admin" },
      extra: { code, variant, key },
    });
    return NextResponse.json({ error: "R2 fetch failed" }, { status: 502 });
  }

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "private, max-age=86400",
      "X-Content-Type-Options": "nosniff",
      "Content-Length": String(buffer.length),
    },
  });
}
