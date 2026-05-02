import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { talents } from "@/db/schema";
import { verifySession } from "@/lib/auth";
import {
  buildKey,
  isValidVariant,
  uploadImage,
  type ImageVariant,
} from "@/lib/talent/r2-client";
import { processUpload } from "@/lib/talent/watermark";
import { logAuditEventServer } from "@/lib/talent/audit-log-server";

/**
 * POST /api/studio/talent/admin/talents/[code]/images
 *
 * Recibe FormData con multiples files. Cada file debe llamarse con la variant
 * (ej. `profile`, `studio-1`). Por cada uno: valida → procesa con sharp →
 * sube a R2 → actualiza columnas de DB.
 *
 *   401  sin sesion
 *   403  no admin
 *   404  talent no existe
 *   422  payload invalido
 *   200  { uploaded: ImageVariant[] }
 *
 * Limites por archivo:
 *   - tamano max: 12MB original (post-process queda <500kb)
 *   - tipos aceptados: image/jpeg, image/png, image/webp
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 12 * 1024 * 1024;
const ACCEPTED = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { code } = await params;
  const [talent] = await db
    .select({ code: talents.code })
    .from(talents)
    .where(eq(talents.code, code))
    .limit(1);
  if (!talent) {
    return NextResponse.json({ error: "Talent not found" }, { status: 404 });
  }

  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ error: "Invalid form data" }, { status: 422 });
  }

  const uploaded: ImageVariant[] = [];
  const errors: { variant: string; reason: string }[] = [];
  const dbUpdates: Partial<typeof talents.$inferInsert> = {};
  const galleryToAppend: string[] = [];

  for (const [variantRaw, value] of formData.entries()) {
    if (!(value instanceof File)) continue;
    const variantStr = variantRaw.trim();
    if (!isValidVariant(variantStr)) {
      errors.push({ variant: variantStr, reason: "invalid variant" });
      continue;
    }

    if (!ACCEPTED.has(value.type)) {
      errors.push({ variant: variantStr, reason: `unsupported mime ${value.type}` });
      continue;
    }
    if (value.size > MAX_BYTES) {
      errors.push({ variant: variantStr, reason: "file > 12MB" });
      continue;
    }

    const buffer = Buffer.from(await value.arrayBuffer());
    const processed = await processUpload(buffer);
    const key = buildKey(code, variantStr);
    await uploadImage(key, processed, "image/jpeg");

    if (variantStr === "profile") {
      dbUpdates.imageProfileKey = key;
    } else if (variantStr === "charsheet") {
      dbUpdates.imageCharsheetKey = key;
    } else {
      galleryToAppend.push(key);
    }

    uploaded.push(variantStr);
  }

  // Update DB. Galeria: merge sin duplicados.
  if (Object.keys(dbUpdates).length > 0 || galleryToAppend.length > 0) {
    const [current] = await db
      .select({ galleryKeys: talents.galleryKeys })
      .from(talents)
      .where(eq(talents.code, code))
      .limit(1);
    const mergedGallery = current
      ? Array.from(
          new Set([...(current.galleryKeys ?? []), ...galleryToAppend])
        )
      : galleryToAppend;

    await db
      .update(talents)
      .set({
        ...dbUpdates,
        galleryKeys: mergedGallery,
        updatedAt: new Date(),
      })
      .where(eq(talents.code, code));
  }

  await logAuditEventServer("admin_talent_updated", {
    userEmail: session.email,
    projectSlug: "*",
    talentCode: code,
    payload: { uploaded, errors },
  });

  return NextResponse.json({ uploaded, errors });
}
