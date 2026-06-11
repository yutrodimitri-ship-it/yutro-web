// Recomprime las imágenes de /public a WebP (máx 1920px, q80).
// Uso: node scripts/optimize-images.mjs [--dry-run]
// Requiere sharp: npm install --no-save sharp
import sharp from "sharp";
import { readdir, readFile, stat, rename, unlink } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..", "public");
// Solo carpetas de contenido; logos, icons y hero-frames ya son ligeros
const DIRS = ["projects", "influencers", "services", "blog"];
const SKIP_DIRS = new Set(["logos"]);
const MIN_BYTES = 350 * 1024; // por debajo de esto no vale la pena tocar
const MAX_WIDTH = 1920;
const QUALITY = 80;
const dryRun = process.argv.includes("--dry-run");

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) yield* walk(full);
    } else {
      yield full;
    }
  }
}

let before = 0;
let after = 0;
let count = 0;

for (const dir of DIRS) {
  for await (const file of walk(path.join(ROOT, dir))) {
    const ext = path.extname(file).toLowerCase();
    if (![".webp", ".png", ".jpg", ".jpeg"].includes(ext)) continue;

    const { size } = await stat(file);
    const isPng = ext === ".png";
    if (size < MIN_BYTES && !isPng) continue;

    const target = file.replace(/\.(png|jpe?g)$/i, ".webp");
    const tmp = target + ".tmp";

    // Buffer en vez de ruta: en Windows el handle abierto impide sobrescribir
    const img = sharp(await readFile(file));
    const meta = await img.metadata();
    await img
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 6 })
      .toFile(tmp);

    const { size: newSize } = await stat(tmp);
    const sameFile = target === file;

    // Si no es conversión de formato y no ahorra nada, conservar el original
    if (sameFile && newSize >= size * 0.95) {
      await unlink(tmp);
      continue;
    }

    if (dryRun) {
      await unlink(tmp);
    } else {
      await rename(tmp, target);
      if (!sameFile) await unlink(file);
    }

    before += size;
    after += newSize;
    count++;
    console.log(
      `${path.relative(ROOT, file)} ${meta.width}px ${(size / 1024) | 0}KB -> ${(newSize / 1024) | 0}KB${sameFile ? "" : " (webp)"}`
    );
  }
}

console.log(
  `\n${count} imágenes: ${(before / 1048576).toFixed(1)}MB -> ${(after / 1048576).toFixed(1)}MB (ahorro ${((1 - after / Math.max(before, 1)) * 100).toFixed(0)}%)${dryRun ? " [dry-run]" : ""}`
);
