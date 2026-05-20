/**
 * Convierte todas las imágenes PNG de public/talents/ a WebP en public/talents-webp/.
 * Mantiene la misma estructura de carpetas y nombres (solo cambia extensión).
 * Conserva los PNG originales por si hay que hacer rollback.
 *
 * Uso: npx tsx scripts/convert-talents-to-webp.ts
 */
import { readdir, mkdir, stat } from "fs/promises";
import path from "path";
import sharp from "sharp";

const SRC_ROOT = path.resolve(process.cwd(), "public/talents");
const DST_ROOT = path.resolve(process.cwd(), "public/talents-webp");
const QUALITY = 82;

async function ensureDir(p: string) {
  await mkdir(p, { recursive: true });
}

function fmt(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function main() {
  await ensureDir(DST_ROOT);
  const entries = await readdir(SRC_ROOT, { withFileTypes: true });
  const talentDirs = entries.filter((e) => e.isDirectory()).map((e) => e.name).sort();

  let totalPng = 0;
  let totalWebp = 0;
  let count = 0;

  for (const dir of talentDirs) {
    const srcDir = path.join(SRC_ROOT, dir);
    const dstDir = path.join(DST_ROOT, dir);
    await ensureDir(dstDir);

    const files = await readdir(srcDir);
    const pngs = files.filter((f) => f.toLowerCase().endsWith(".png"));

    let dirPng = 0;
    let dirWebp = 0;
    for (const f of pngs) {
      const srcPath = path.join(srcDir, f);
      const dstName = f.replace(/\.png$/i, ".webp");
      const dstPath = path.join(dstDir, dstName);

      const srcStat = await stat(srcPath);
      dirPng += srcStat.size;
      totalPng += srcStat.size;

      await sharp(srcPath).webp({ quality: QUALITY, effort: 5 }).toFile(dstPath);

      const dstStat = await stat(dstPath);
      dirWebp += dstStat.size;
      totalWebp += dstStat.size;
      count++;
    }

    const ratio = dirPng > 0 ? ((1 - dirWebp / dirPng) * 100).toFixed(0) : "0";
    // eslint-disable-next-line no-console
    console.log(`${dir}: ${pngs.length} files · ${fmt(dirPng)} → ${fmt(dirWebp)} (-${ratio}%)`);
  }

  const totalRatio = totalPng > 0 ? ((1 - totalWebp / totalPng) * 100).toFixed(0) : "0";
  // eslint-disable-next-line no-console
  console.log(`\n✅  ${count} archivos convertidos`);
  // eslint-disable-next-line no-console
  console.log(`    Total: ${fmt(totalPng)} → ${fmt(totalWebp)} (-${totalRatio}%)`);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
