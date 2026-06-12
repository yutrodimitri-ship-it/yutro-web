/**
 * Publica retrato + cuerpo entero de las 3 featured (YE-F01..03) generados
 * el 2026-06-11 y aprobados por el usuario:
 *   1. Procesa (sharp 1600px q85, sin EXIF) y sube al bucket privado.
 *   2. Actualiza image_profile_key / image_charsheet_key (galerías intactas).
 *   3. Quita de la galería de YE-F03 la foto con cigarrillo (sofi/07,
 *      ya en cuarentena local).
 *
 * Uso: npx tsx scripts/publish-featured-casting.ts
 */

import { readFile } from "fs/promises";
import path from "path";
import sharp from "sharp";
import postgres from "postgres";
import { createClient } from "@supabase/supabase-js";

const STAGING = "A:/Proyectos Claude/Yutro Catalogo Comfy AUT/_quarantine/featured_casting";
const CODES = ["YE-F01", "YE-F02", "YE-F03"] as const;
const BUCKET = "talents";

async function loadEnv(): Promise<Record<string, string>> {
  const raw = await readFile(path.join(process.cwd(), ".env.local"), "utf-8");
  const vars: Record<string, string> = {};
  for (const line of raw.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#") || !t.includes("=")) continue;
    const [k, ...rest] = t.split("=");
    vars[k.trim()] = rest.join("=").trim().replace(/^["']|["']$/g, "");
  }
  return vars;
}

async function main() {
  const env = await loadEnv();
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const sql = postgres(env.DATABASE_URL, { prepare: false });

  try {
    for (const code of CODES) {
      const keys: Record<string, string> = {};
      for (const variant of ["profile", "charsheet"] as const) {
        const src = path.join(STAGING, code, `${variant}.png`);
        const processed = await sharp(await readFile(src))
          .rotate()
          .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
          .jpeg({ quality: 85, mozjpeg: true })
          .withMetadata({ orientation: undefined })
          .toBuffer();
        const { error } = await supabase.storage
          .from(BUCKET)
          .upload(`${code}/${variant}.jpg`, processed, { contentType: "image/jpeg", upsert: true });
        if (error) throw new Error(`${code}/${variant}: ${error.message}`);
        keys[variant] = `${BUCKET}/${code}/${variant}.jpg`;
        console.log(`⬆️  ${code}/${variant}.jpg (${(processed.length / 1024).toFixed(0)} KB)`);
      }
      await sql`
        UPDATE talents SET
          image_profile_key   = ${keys.profile},
          image_charsheet_key = ${keys.charsheet},
          updated_at          = now()
        WHERE code = ${code}`;
      console.log(`✅ ${code}: keys actualizadas (galería intacta)`);
    }

    // Paso 3: sacar la foto con cigarrillo de la galería de Sofi
    const [row] = await sql`
      UPDATE talents SET gallery_keys = (
        SELECT COALESCE(jsonb_agg(k), '[]'::jsonb)
        FROM jsonb_array_elements(gallery_keys) AS k
        WHERE k::text NOT LIKE '%sofi/07%'
      ), updated_at = now()
      WHERE code = 'YE-F03'
      RETURNING jsonb_array_length(gallery_keys) AS galerias`;
    console.log(`✅ YE-F03: foto con cigarrillo fuera de galería (quedan ${row.galerias})`);
  } finally {
    await sql.end();
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
