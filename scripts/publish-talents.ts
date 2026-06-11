/**
 * Comando "publish" — puente pipeline → catálogo.
 *
 * Lee el manifiesto de curaduría (qué archivo fuente corresponde a cada
 * variante de cada talento), procesa cada imagen con sharp (resize 1600px,
 * JPG q85, sin EXIF — idéntico a processUpload del módulo watermark), la sube
 * al bucket privado `talents` de Supabase Storage y actualiza las keys en la
 * tabla `talents`. Migración reversible: si algo falla, las keys locales
 * (`/talents-webp/...`) siguen en BD y la web sigue funcionando.
 *
 * Uso:
 *   npx tsx scripts/publish-talents.ts --gen-manifest      # genera manifiesto desde public/talents/
 *   npx tsx scripts/publish-talents.ts --talent YE-M01     # publica un talento
 *   npx tsx scripts/publish-talents.ts --all               # publica todos los del manifiesto
 *   npx tsx scripts/publish-talents.ts --all --dry-run     # muestra qué haría sin subir nada
 *
 * El manifiesto (scripts/talent-publish-manifest.json) es la documentación
 * viva de la curaduría: para reemplazar un shot (ej. regeneración por QC),
 * apuntar la variante al archivo nuevo (path absoluto permitido) y re-publicar.
 */

import { readFile, writeFile, readdir, stat } from "fs/promises";
import path from "path";
import sharp from "sharp";
import postgres from "postgres";
import { createClient } from "@supabase/supabase-js";

const ROOT = process.cwd();
const MANIFEST_PATH = path.join(ROOT, "scripts", "talent-publish-manifest.json");
const SOURCES_DIR = path.join(ROOT, "public", "talents");
const BUCKET = "talents";

const VARIANTS = [
  "profile", "charsheet",
  "gallery-1", "gallery-2", "gallery-3", "gallery-4",
  "gallery-5", "gallery-6", "gallery-7", "gallery-8",
] as const;
type Variant = (typeof VARIANTS)[number];

interface TalentManifest {
  // variante → path del archivo fuente (relativo a la raíz del repo, o absoluto)
  [variant: string]: string;
}
interface Manifest {
  _comment: string;
  generated_at: string;
  talents: Record<string, TalentManifest>;
}

// ── Entorno (.env.local, sin dotenv para no sumar dependencias) ─────────────
async function loadEnv(): Promise<Record<string, string>> {
  const raw = await readFile(path.join(ROOT, ".env.local"), "utf-8");
  const vars: Record<string, string> = {};
  for (const line of raw.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#") || !t.includes("=")) continue;
    const [k, ...rest] = t.split("=");
    vars[k.trim()] = rest.join("=").trim().replace(/^["']|["']$/g, "");
  }
  return vars;
}

// Mismo procesamiento que processUpload (src/lib/talent/watermark.ts)
async function processImage(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .rotate()
    .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 85, mozjpeg: true })
    .withMetadata({ orientation: undefined })
    .toBuffer();
}

function fmt(bytes: number): string {
  return bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(0)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

// ── Generación de manifiesto desde la curaduría actual ──────────────────────
async function genManifest(): Promise<void> {
  const talentDirs = (await readdir(SOURCES_DIR, { withFileTypes: true }))
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();

  const talents: Record<string, TalentManifest> = {};
  for (const code of talentDirs) {
    const files = await readdir(path.join(SOURCES_DIR, code));
    const entry: TalentManifest = {};
    for (const v of VARIANTS) {
      const png = `${v}.png`;
      if (files.includes(png)) {
        entry[v] = path.join("public", "talents", code, png).replace(/\\/g, "/");
      }
    }
    if (Object.keys(entry).length > 0) talents[code] = entry;
  }

  const manifest: Manifest = {
    _comment:
      "Manifiesto de curaduría: variante → archivo fuente. Para reemplazar un " +
      "shot, apuntar la variante al archivo nuevo (path absoluto OK) y correr " +
      "publish-talents.ts --talent <code>. Las variantes ausentes no se publican.",
    generated_at: new Date().toISOString(),
    talents,
  };
  await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf-8");
  const total = Object.values(talents).reduce((n, t) => n + Object.keys(t).length, 0);
  console.log(`✅ Manifiesto generado: ${Object.keys(talents).length} talentos, ${total} imágenes`);
  console.log(`   ${MANIFEST_PATH}`);
}

// ── Publicación ──────────────────────────────────────────────────────────────
async function publish(codes: string[], dryRun: boolean): Promise<number> {
  const env = await loadEnv();
  const supaUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
  const dbUrl = env.DATABASE_URL;
  if (!supaUrl || !serviceKey || !dbUrl) {
    console.error("Faltan NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY / DATABASE_URL en .env.local");
    return 1;
  }

  const manifest: Manifest = JSON.parse(await readFile(MANIFEST_PATH, "utf-8"));
  const supabase = createClient(supaUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  // prepare:false — obligatorio con el pooler de Supabase en modo transacción
  const sql = postgres(dbUrl, { prepare: false });

  let failed = 0;
  try {
    for (const code of codes) {
      const entry = manifest.talents[code];
      if (!entry) {
        console.error(`❌ ${code}: no está en el manifiesto`);
        failed++;
        continue;
      }

      console.log(`\n📦 ${code} — ${Object.keys(entry).length} variantes`);
      const keys: Partial<Record<Variant, string>> = {};
      let srcTotal = 0;
      let outTotal = 0;
      let talentFailed = false;

      for (const [variant, srcRel] of Object.entries(entry)) {
        const srcPath = path.isAbsolute(srcRel) ? srcRel : path.join(ROOT, srcRel);
        const key = `${BUCKET}/${code}/${variant}.jpg`;
        try {
          const srcStat = await stat(srcPath);
          const processed = await processImage(await readFile(srcPath));
          srcTotal += srcStat.size;
          outTotal += processed.length;
          if (!dryRun) {
            const { error } = await supabase.storage
              .from(BUCKET)
              .upload(`${code}/${variant}.jpg`, processed, {
                contentType: "image/jpeg",
                upsert: true,
              });
            if (error) throw new Error(error.message);
          }
          keys[variant as Variant] = key;
          console.log(`   ${dryRun ? "(dry)" : "⬆️ "} ${variant}: ${fmt(srcStat.size)} → ${fmt(processed.length)}`);
        } catch (err) {
          console.error(`   ❌ ${variant}: ${(err as Error).message}`);
          talentFailed = true;
        }
      }

      if (talentFailed) {
        // No actualizamos BD si alguna variante falló: el talento queda
        // íntegro en su estado anterior (keys locales o publicación previa).
        console.error(`   ⚠️  ${code}: BD NO actualizada (hubo fallas de upload)`);
        failed++;
        continue;
      }

      const galleryKeys: string[] = VARIANTS.filter((v) => v.startsWith("gallery-"))
        .map((v) => keys[v])
        .filter((k): k is string => Boolean(k));
      if (!dryRun) {
        await sql`
          UPDATE talents SET
            image_profile_key   = ${keys["profile"] ?? null},
            image_charsheet_key = ${keys["charsheet"] ?? null},
            gallery_keys        = ${sql.json(galleryKeys)},
            updated_at          = now()
          WHERE code = ${code}`;
      }
      console.log(`   ✅ ${code}: ${Object.keys(keys).length} subidas (${fmt(srcTotal)} → ${fmt(outTotal)})${dryRun ? " [dry-run]" : " + BD actualizada"}`);
    }
  } finally {
    await sql.end();
  }
  return failed > 0 ? 1 : 0;
}

// ── CLI ──────────────────────────────────────────────────────────────────────
async function main(): Promise<number> {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");

  if (args.includes("--gen-manifest")) {
    await genManifest();
    return 0;
  }

  const talentIdx = args.indexOf("--talent");
  if (talentIdx !== -1 && args[talentIdx + 1]) {
    return publish([args[talentIdx + 1]], dryRun);
  }
  if (args.includes("--all")) {
    const manifest: Manifest = JSON.parse(await readFile(MANIFEST_PATH, "utf-8"));
    return publish(Object.keys(manifest.talents).sort(), dryRun);
  }

  console.log("Uso: --gen-manifest | --talent <code> [--dry-run] | --all [--dry-run]");
  return 1;
}

main().then((code) => process.exit(code)).catch((err) => {
  console.error(err);
  process.exit(1);
});
