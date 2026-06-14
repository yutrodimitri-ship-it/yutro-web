import "server-only";
import { createHash } from "node:crypto";
import {
  getImageBuffer,
  removeByPrefix,
  uploadImage,
} from "./storage-client";
import { applyWatermark } from "./watermark";
import { DERIVATIVE_SIZES, type DerivativeSize } from "./image-variants";

/**
 * Capa de derivados de imagen "genera-una-vez-y-persiste".
 *
 * El problema original: ambas rutas que sirven imágenes (vitrina pública y
 * catálogo studio) descargaban el ORIGINAL completo desde storage y lo
 * reprocesaban con sharp (resize / watermark) en CADA request. Con grillas de
 * decenas de talentos, eso son decenas de descargas + reencodes simultáneos
 * por cada visita, sin cache efectiva.
 *
 * Solución: el resultado procesado es determinista, así que la primera vez se
 * genera y se guarda en el mismo bucket bajo `_derived/...`. Las visitas
 * siguientes leen directamente ese derivado (sin descargar el original, sin
 * sharp). Se invalida borrando el prefijo cuando el admin re-sube la imagen.
 *
 * Convención de keys de derivado (dentro del bucket `talents`):
 *   público:  `_derived/pub/{code}/{variant}/{size}.jpg`
 *   studio:   `_derived/wm/{code}/{wmHash}/{variant}/{size}.jpg`
 * El `wmHash` namespacea por proyecto (cliente + fecha) — si cambian, el hash
 * cambia y el watermark se regenera solo.
 */

function isNotFound(err: unknown): boolean {
  return (
    err instanceof Error && /NoSuchKey|NotFound|404|empty body/i.test(err.message)
  );
}

/** Lee el derivado cacheado, o `null` si aún no existe. */
async function readCached(key: string): Promise<Buffer | null> {
  try {
    return await getImageBuffer(key);
  } catch (err) {
    if (isNotFound(err)) return null;
    throw err;
  }
}

/** Escribe el derivado best-effort: si falla el cache write, no rompe la respuesta. */
async function writeCached(key: string, buffer: Buffer): Promise<void> {
  try {
    await uploadImage(key, buffer, "image/jpeg");
  } catch {
    // Cache write best-effort: la imagen ya se devuelve igual al cliente.
  }
}

/** Hash corto y estable para namespacear el watermark por proyecto. */
export function watermarkHash(parts: string): string {
  return createHash("sha1").update(parts).digest("hex").slice(0, 12);
}

/**
 * Vitrina pública (sin watermark): resize a `size` con mozjpeg.
 * `originalKey` es la key del original en storage (`talents/{code}/{variant}.jpg`).
 * Lanza si el original no existe (la ruta lo traduce a 404).
 */
export async function getPublicDerivative(
  originalKey: string,
  code: string,
  variant: string,
  size: DerivativeSize
): Promise<Buffer> {
  const derivKey = `_derived/pub/${code}/${variant}/${size}.jpg`;
  const cached = await readCached(derivKey);
  if (cached) return cached;

  const original = await getImageBuffer(originalKey);
  const sharp = (await import("sharp")).default;
  const out = await sharp(original)
    .resize({
      width: DERIVATIVE_SIZES[size],
      height: DERIVATIVE_SIZES[size],
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();

  await writeCached(derivKey, out);
  return out;
}

/**
 * Catálogo studio (con watermark dinámico): resize a `size` y compone el
 * watermark proporcional al tamaño servido. Persistido por proyecto vía wmHash.
 */
export async function getStudioDerivative(opts: {
  originalKey: string;
  code: string;
  variant: string;
  size: DerivativeSize;
  watermarkText: string;
  wmHash: string;
}): Promise<Buffer> {
  const { originalKey, code, variant, size, watermarkText, wmHash } = opts;
  const derivKey = `_derived/wm/${code}/${wmHash}/${variant}/${size}.jpg`;
  const cached = await readCached(derivKey);
  if (cached) return cached;

  const original = await getImageBuffer(originalKey);
  const sharp = (await import("sharp")).default;
  const px = DERIVATIVE_SIZES[size];
  const resized = await sharp(original)
    .resize({ width: px, height: px, fit: "inside", withoutEnlargement: true })
    .toBuffer();
  const meta = await sharp(resized).metadata();
  const out = await applyWatermark({
    buffer: resized,
    text: watermarkText,
    width: meta.width ?? px,
    height: meta.height ?? px,
  });

  await writeCached(derivKey, out);
  return out;
}

/**
 * Invalida TODOS los derivados de un talento (público + todos los proyectos).
 * Se llama tras re-subir una imagen, para que el cambio se vea de inmediato.
 * Best-effort: un fallo aquí no debe romper el upload.
 */
export async function purgeDerivatives(code: string): Promise<void> {
  await Promise.allSettled([
    removeByPrefix(`_derived/pub/${code}`),
    removeByPrefix(`_derived/wm/${code}`),
  ]);
}
