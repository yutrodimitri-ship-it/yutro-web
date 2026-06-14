/**
 * Constantes de variantes de imagen — SAFE para client components.
 *
 * Se extraen aqui (separadas de r2-client.ts) para que client components
 * puedan importar `VARIANTS` / `ImageVariant` sin arrastrar el cliente R2
 * de AWS-SDK al bundle del browser. r2-client.ts es server-only.
 */

export const VARIANTS = [
  "profile",
  "charsheet",
  "gallery-1",
  "gallery-2",
  "gallery-3",
  "gallery-4",
  "gallery-5",
  "gallery-6",
  "gallery-7",
  "gallery-8",
] as const;

export type ImageVariant = (typeof VARIANTS)[number];

export function isValidVariant(v: string): v is ImageVariant {
  return (VARIANTS as readonly string[]).includes(v);
}

/**
 * Tamaños de derivado servidos al cliente. Se generan UNA vez y se persisten
 * en storage (`_derived/...`), nunca se reprocesan por request.
 *   - thumb   → grilla de catálogo (cards pequeñas)
 *   - preview → ficha de detalle / vitrina pública
 * El original (subido por admin) llega a 1600px; estos nunca lo agrandan.
 */
export const DERIVATIVE_SIZES = {
  thumb: 600,
  preview: 1280,
} as const;

export type DerivativeSize = keyof typeof DERIVATIVE_SIZES;

/** Normaliza el query `?size=` a un tamaño válido (default `preview`). */
export function parseSize(v: string | null | undefined): DerivativeSize {
  return v === "thumb" ? "thumb" : "preview";
}

/** R2 key convention: `talents/{code}/{variant}.jpg` */
export function buildKey(code: string, variant: ImageVariant): string {
  return `talents/${code}/${variant}.jpg`;
}
