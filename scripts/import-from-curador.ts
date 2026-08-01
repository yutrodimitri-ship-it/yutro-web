/**
 * import-from-curador.ts — Puente Curador (MASTER CASTING) → DB de talentos.
 *
 * Lee el `publish_manifest.json` que exporta el curador, y por cada talento
 * marcado "Publicar":
 *   1. Mapea los datos de la ficha → columnas de la tabla `talents` y hace
 *      UPSERT (public_visible=true, public_slug, datos comerciales). NO toca
 *      hue/sat/age_bucket si la fila ya existe (preserva el seed).
 *   2. Escribe `scripts/talent-publish-manifest.json` (variante → ruta absoluta
 *      de la foto) para que `publish-talents.ts` suba las imágenes.
 *
 * NO sube imágenes (de eso se encarga publish-talents.ts). NO escribe bio pública
 * (decisión: las fichas públicas van sin bio).
 *
 * Uso (desde la raíz de yutro-web):
 *   npx tsx scripts/import-from-curador.ts --dry-run
 *   npx tsx scripts/import-from-curador.ts                       # escribe DB + manifiesto
 *   npx tsx scripts/import-from-curador.ts --talent YE-M01       # solo uno
 *   npx tsx scripts/import-from-curador.ts --manifest "RUTA"     # manifiesto del curador
 *
 * Luego: npx tsx scripts/publish-talents.ts --all   (sube las imágenes)
 */

import { readFile, writeFile, rename, stat } from "fs/promises";
import path from "path";
import postgres from "postgres";

const ROOT = process.cwd();
const DEFAULT_CURADOR_MANIFEST =
  "A:/Proyectos Claude/MASTER CASTING/curador/publish_manifest.json";
const PUBLISH_MANIFEST = path.join(ROOT, "scripts", "talent-publish-manifest.json");

const GALLERY_SLOTS = 8;

// ── helpers de mapeo ───────────────────────────────────────────────────────
const stripAccents = (s: string) =>
  (s || "").normalize("NFD").replace(/[̀-ͯ]/g, "");
const slugify = (s: string) =>
  stripAccents(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const ageLabel = (ar: string) => {
  const m = (ar || "").match(/(\d+)\s*-\s*(\d+)/);
  return m ? `${m[1]}-${m[2]}` : ar || "";
};
const ageStart = (ar: string) => {
  const m = (ar || "").match(/(\d+)/);
  return m ? +m[1] : 99;
};
const ageBucket = (ar: string) => {
  const s = ageStart(ar);
  return s < 25 ? "20s" : s < 35 ? "30s" : s < 45 ? "40s" : "50s";
};
const genderCode = (g: string) => ((g || "").toLowerCase().includes("mujer") ? "f" : "m");
const splitMarket = (m: string) =>
  (m || "CL")
    .split(/[·,/|]/)
    .map((x) => x.trim())
    .filter(Boolean);
const categoryOf = (arquetipo: string) => stripAccents(arquetipo || "").toLowerCase().trim() || "lifestyle";
// hue determinista por code (para inserts nuevos; en updates se preserva el seed)
const hueOf = (code: string) => {
  let h = 0;
  for (const c of code) h = (h * 31 + c.charCodeAt(0)) % 360;
  return h;
};

interface CuradorTalent {
  code: string;
  slug: string;
  publish: boolean;
  images: { profile: string | null; charsheet: string | null; gallery: string[] };
  profile: Record<string, any>;
}

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

function buildRow(e: CuradorTalent) {
  const p = e.profile || {};
  const g = genderCode(p.gender);
  const ar = ageLabel(p.age_range);
  const cat = categoryOf(p.arquetipo);
  const name = p.nombre || e.code;
  const genWordEs = g === "f" ? "Mujer" : "Hombre";
  const genWordEn = g === "f" ? "Woman" : "Man";
  const arqDisplay = (p.arquetipo || cat).replace(/^\w/, (c: string) => c.toUpperCase());
  const uses = (p.usos || []).map((u: string) => ({ es: u, en: u }));
  return {
    code: e.code,
    nameEs: name,
    nameEn: name,
    shortDescEs: `${genWordEs} · ${ar} · ${arqDisplay}`,
    shortDescEn: `${genWordEn} · ${ar} · ${arqDisplay}`,
    phenotypeEs: p.origen || "",
    phenotypeEn: p.origen || "",
    toneEs: p.tono || "",
    toneEn: p.tono || "",
    gender: g,
    ageRange: ar,
    ageBucket: ageBucket(p.age_range),
    category: cat,
    status: (p.estado || "").toLowerCase().includes("disp") ? "available" : "available",
    market: splitMarket(p.mercado),
    uses,
    hue: hueOf(e.code),
    sat: 28,
    slug: e.slug || slugify(name),
    tier: "standard",
  };
}

async function main(): Promise<number> {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const mIdx = args.indexOf("--manifest");
  const curManifestPath = mIdx !== -1 && args[mIdx + 1] ? args[mIdx + 1] : DEFAULT_CURADOR_MANIFEST;
  const tIdx = args.indexOf("--talent");
  const onlyTalent = tIdx !== -1 ? args[tIdx + 1] : null;

  let cur: { talents: CuradorTalent[] };
  try {
    cur = JSON.parse(await readFile(curManifestPath, "utf-8"));
  } catch {
    console.error(`❌ No pude leer el manifiesto del curador en:\n   ${curManifestPath}\n   (exportalo desde el curador con "Descargar manifiesto" y guardalo ahí, o pasá --manifest <ruta>)`);
    return 1;
  }

  let talents = (cur.talents || []).filter((t) => t.publish);
  if (onlyTalent) talents = talents.filter((t) => t.code === onlyTalent);
  if (!talents.length) {
    console.error("No hay talentos marcados 'Publicar' en el manifiesto (o no coincide --talent).");
    return 1;
  }

  console.log(`\n${dryRun ? "🧪 DRY-RUN — " : ""}Procesando ${talents.length} talento(s)\n`);

  // 1) Manifiesto de imágenes (variante → ruta absoluta)
  const imgManifest: Record<string, Record<string, string>> = {};
  for (const t of talents) {
    const entry: Record<string, string> = {};
    if (t.images.profile) entry["profile"] = t.images.profile;
    if (t.images.charsheet) entry["charsheet"] = t.images.charsheet;
    (t.images.gallery || []).slice(0, GALLERY_SLOTS).forEach((src, i) => {
      if (src) entry[`gallery-${i + 1}`] = src;
    });
    imgManifest[t.code] = entry;
  }

  // 2) Filas mapeadas
  const rows = talents.map(buildRow);
  for (const r of rows) {
    console.log(`  ${r.code}  →  ${r.nameEs}  [${r.gender}·${r.ageRange}·${r.category}]  slug=${r.slug}  market=${JSON.stringify(r.market)}  fotos=${Object.keys(imgManifest[r.code]).length}`);
  }

  if (dryRun) {
    console.log(`\n🧪 DRY-RUN: no se escribió nada. Revisá el mapeo arriba.`);
    console.log(`   (en real: UPSERT de ${rows.length} filas + manifiesto de imágenes + luego publish-talents.ts)`);
    return 0;
  }

  // 3) Escribir manifiesto de imágenes (backup del existente)
  try {
    await stat(PUBLISH_MANIFEST);
    await rename(PUBLISH_MANIFEST, PUBLISH_MANIFEST + ".bak");
    console.log(`\n📑 Backup del manifiesto anterior → talent-publish-manifest.json.bak`);
  } catch {/* no existía */}
  await writeFile(
    PUBLISH_MANIFEST,
    JSON.stringify(
      { _comment: "Generado por import-from-curador.ts", generated_at: new Date().toISOString(), talents: imgManifest },
      null, 2
    ),
    "utf-8"
  );
  console.log(`📑 Manifiesto de imágenes escrito (${Object.keys(imgManifest).length} talentos)`);

  // 4) UPSERT de filas
  const env = await loadEnv();
  if (!env.DATABASE_URL) {
    console.error("Falta DATABASE_URL en .env.local");
    return 1;
  }
  const sql = postgres(env.DATABASE_URL, { prepare: false });
  try {
    for (const r of rows) {
      await sql`
        INSERT INTO talents (
          code, name_es, name_en, short_desc_es, short_desc_en,
          phenotype_es, phenotype_en, tone_commercial_es, tone_commercial_en,
          gender, age_range, age_bucket, category, status,
          market, suggested_uses, hue, sat,
          public_visible, tier, public_slug, public_bio_es, public_bio_en, is_active
        ) VALUES (
          ${r.code}, ${r.nameEs}, ${r.nameEn}, ${r.shortDescEs}, ${r.shortDescEn},
          ${r.phenotypeEs}, ${r.phenotypeEn}, ${r.toneEs}, ${r.toneEn},
          ${r.gender}, ${r.ageRange}, ${r.ageBucket}, ${r.category}, ${r.status},
          ${sql.json(r.market)}, ${sql.json(r.uses)}, ${r.hue}, ${r.sat},
          ${true}, ${r.tier}, ${r.slug}, ${null}, ${null}, ${true}
        )
        ON CONFLICT (code) DO UPDATE SET
          name_es=EXCLUDED.name_es, name_en=EXCLUDED.name_en,
          short_desc_es=EXCLUDED.short_desc_es, short_desc_en=EXCLUDED.short_desc_en,
          phenotype_es=EXCLUDED.phenotype_es, phenotype_en=EXCLUDED.phenotype_en,
          tone_commercial_es=EXCLUDED.tone_commercial_es, tone_commercial_en=EXCLUDED.tone_commercial_en,
          gender=EXCLUDED.gender, age_range=EXCLUDED.age_range, category=EXCLUDED.category,
          status=EXCLUDED.status, market=EXCLUDED.market, suggested_uses=EXCLUDED.suggested_uses,
          public_visible=EXCLUDED.public_visible, tier=EXCLUDED.tier, public_slug=EXCLUDED.public_slug,
          public_bio_es=NULL, public_bio_en=NULL,
          is_active=true, updated_at=now()`;
      console.log(`  ✅ UPSERT ${r.code}`);
    }
  } finally {
    await sql.end();
  }

  console.log(`\n✅ ${rows.length} fila(s) en DB con public_visible=true.`);
  console.log(`👉 Siguiente paso (sube las imágenes):  npx tsx scripts/publish-talents.ts --all`);
  return 0;
}

main().then((c) => process.exit(c)).catch((e) => { console.error(e); process.exit(1); });
