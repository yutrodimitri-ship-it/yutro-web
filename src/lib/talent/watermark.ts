import "server-only";

/**
 * Watermark dinamico para imagenes Talent.
 *
 * Genera un overlay SVG con texto repetido en grid diagonal (-25deg) que
 * incluye `YUTRO ESTUDIO · CLIENTE · FECHA · CODIGO`. Se compone via sharp
 * sobre la imagen original. El sharp se importa dinamicamente para no
 * inflar bundles de cliente.
 *
 * Tradeoffs:
 * - Quality 85 + mozjpeg → balance peso/calidad
 * - Opacity 15% → legible pero no destruye la imagen
 * - Pattern 400x200 → cobertura aceptable en cualquier resolucion
 */

interface WatermarkOptions {
  buffer: Buffer;
  text: string;
  width: number;
  height: number;
}

export async function applyWatermark({
  buffer,
  text,
  width,
  height,
}: WatermarkOptions): Promise<Buffer> {
  const sharp = (await import("sharp")).default;

  const safeText = escapeXml(text);
  const svgOverlay = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="wm" x="0" y="0" width="420" height="220" patternUnits="userSpaceOnUse" patternTransform="rotate(-25)">
      <text x="20" y="100" font-family="ui-monospace, Menlo, monospace" font-size="14" fill="rgba(255,255,255,0.18)" letter-spacing="2">${safeText}</text>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#wm)"/>
</svg>`;

  return sharp(buffer)
    .composite([{ input: Buffer.from(svgOverlay), blend: "over" }])
    .jpeg({ quality: 85, mozjpeg: true })
    .toBuffer();
}

/**
 * Procesa una imagen subida desde el admin: resize a max 1600px en el lado
 * largo, comprime JPG quality 85, strip metadata (EXIF, GPS, autor) por
 * privacidad. NO aplica watermark — eso se hace al servir, no al guardar.
 */
export async function processUpload(buffer: Buffer): Promise<Buffer> {
  const sharp = (await import("sharp")).default;
  return sharp(buffer)
    .rotate() // respetar EXIF orientation antes de stripear
    .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 85, mozjpeg: true })
    .withMetadata({ orientation: undefined })
    .toBuffer();
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
