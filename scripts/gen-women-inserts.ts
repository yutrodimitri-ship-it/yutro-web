/**
 * Lee las fichas YE-W*.json y genera SQL INSERT para los 25 talents mujeres.
 * Uso: npx tsx scripts/gen-women-inserts.ts > /tmp/women.sql
 */
import { readFile, readdir } from "fs/promises";
import path from "path";

const FICHAS_DIR = "A:/Proyectos Claude/Yutro Catalogo Comfy AUT/04_fichas";
const PUBLIC_DIR = path.resolve(process.cwd(), "public/talents-webp");

interface Ficha {
  talent_id: string;
  archetype: string;
  bio: string;
  site_profile: {
    nombre: string;
    apellido: string;
    chip_descriptor: string;
    arquetipo_display: string;
    tono_comercial: string;
    rango_etario_display: string;
    origen_display: string;
    usos_sugeridos: string[];
    mercado: string;
  };
}

const ARCHETYPE_TO_CATEGORY: Record<string, string> = {
  corporativo: "corporativo",
  lifestyle: "lifestyle",
  familiar: "familiar",
  urbano: "urbano",
  senior: "senior",
  oficios: "oficios",
  artistico: "artistico",
  "artístico": "artistico",
  profesional: "profesional",
};

function ageBucket(range: string): string {
  // range = "28-32" → toma el medio
  const [a, b] = range.split("-").map(Number);
  const mid = (a + b) / 2;
  if (mid < 25) return "20s";
  if (mid < 35) return "30s";
  if (mid < 45) return "40s";
  return "50s";
}

function parseMarket(market: string): string[] {
  return market.split("·").map((s) => s.trim()).filter(Boolean);
}

function sqlString(s: string): string {
  return "E'" + s.replace(/\\/g, "\\\\").replace(/'/g, "''").replace(/\n/g, "\\n") + "'";
}

async function countGallery(code: string): Promise<number> {
  try {
    const files = await readdir(path.join(PUBLIC_DIR, code));
    return files.filter((f) => /^gallery-\d+\.webp$/.test(f)).length;
  } catch {
    return 0;
  }
}

async function main() {
  const files = (await readdir(FICHAS_DIR))
    .filter((f) => /^YE-W\d+\.json$/.test(f))
    .sort();

  const values: string[] = [];

  for (const f of files) {
    const raw = await readFile(path.join(FICHAS_DIR, f), "utf-8");
    const ficha: Ficha = JSON.parse(raw);
    const code = ficha.talent_id;
    const sp = ficha.site_profile;
    const name = `${sp.nombre} ${sp.apellido}`;
    const archetypeKey = ficha.archetype.toLowerCase();
    const category = ARCHETYPE_TO_CATEGORY[archetypeKey] ?? "lifestyle";
    const market = parseMarket(sp.mercado);
    const galleryCount = await countGallery(code);
    const galleryKeys = Array.from(
      { length: galleryCount },
      (_, i) => `/talents-webp/${code}/gallery-${i + 1}.webp`
    );

    const usos = sp.usos_sugeridos.map((u) => {
      const es = u.charAt(0).toUpperCase() + u.slice(1).toLowerCase();
      return { es, en: es };
    });

    const row = `(
  '${code}',
  ${sqlString(name)}, ${sqlString(name)},
  ${sqlString(sp.chip_descriptor)}, ${sqlString(sp.chip_descriptor)},
  ${sqlString(sp.origen_display)}, ${sqlString(sp.origen_display)},
  ${sqlString(sp.arquetipo_display)}, ${sqlString(sp.arquetipo_display)},
  ${sqlString(sp.tono_comercial)}, ${sqlString(sp.tono_comercial)},
  ${sqlString(ficha.bio)}, ${sqlString(ficha.bio)},
  'f', '${sp.rango_etario_display}', '${ageBucket(sp.rango_etario_display)}', '${category}', 'available',
  '${JSON.stringify(market)}'::jsonb,
  '${JSON.stringify(usos)}'::jsonb,
  0, 30,
  '/talents-webp/${code}/profile.webp', '/talents-webp/${code}/charsheet.webp',
  '${JSON.stringify(galleryKeys)}'::jsonb,
  true
)`;
    values.push(row);
  }

  const sql = `
INSERT INTO talents (
  code, name_es, name_en, short_desc_es, short_desc_en,
  phenotype_es, phenotype_en, archetype_es, archetype_en,
  tone_commercial_es, tone_commercial_en, bio_es, bio_en,
  gender, age_range, age_bucket, category, status,
  market, suggested_uses, hue, sat,
  image_profile_key, image_charsheet_key, gallery_keys, is_active
) VALUES
${values.join(",\n")}
ON CONFLICT (code) DO UPDATE SET
  name_es = EXCLUDED.name_es, name_en = EXCLUDED.name_en,
  short_desc_es = EXCLUDED.short_desc_es, short_desc_en = EXCLUDED.short_desc_en,
  phenotype_es = EXCLUDED.phenotype_es, phenotype_en = EXCLUDED.phenotype_en,
  archetype_es = EXCLUDED.archetype_es, archetype_en = EXCLUDED.archetype_en,
  tone_commercial_es = EXCLUDED.tone_commercial_es, tone_commercial_en = EXCLUDED.tone_commercial_en,
  bio_es = EXCLUDED.bio_es, bio_en = EXCLUDED.bio_en,
  gender = EXCLUDED.gender, age_range = EXCLUDED.age_range,
  age_bucket = EXCLUDED.age_bucket, category = EXCLUDED.category,
  status = EXCLUDED.status, market = EXCLUDED.market,
  suggested_uses = EXCLUDED.suggested_uses,
  image_profile_key = EXCLUDED.image_profile_key,
  image_charsheet_key = EXCLUDED.image_charsheet_key,
  gallery_keys = EXCLUDED.gallery_keys,
  is_active = true, updated_at = now();
`;

  process.stdout.write(sql);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
