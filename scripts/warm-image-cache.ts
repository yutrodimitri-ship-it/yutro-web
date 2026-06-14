/**
 * Warm-up del cache de imágenes del catálogo PÚBLICO (/casting).
 *
 * Pre-genera y persiste los derivados (`_derived/pub/...`) de todas las
 * imágenes públicas, para que el PRIMER visitante tras un deploy no pague el
 * costo de generar miniaturas/preview on-the-fly (descargar original + sharp).
 *
 * Uso:
 *   npm run warm:images
 *
 * (El script npm arranca Node con `--conditions=react-server` para que el
 * paquete `server-only` —usado por la capa de datos/storage— sea un no-op
 * fuera de Next. Requiere `.env.local` con DATABASE_URL + credenciales Supabase
 * y acceso de red al pooler de Postgres, igual que la app.)
 *
 * Idempotente y seguro de re-correr: si el derivado ya existe, `getPublicDerivative`
 * lo devuelve sin regenerar. Solo escribe objetos bajo `_derived/`, nunca toca
 * los originales ni la base de datos.
 *
 * Nota: warmea SOLO la vitrina pública. El catálogo Studio lleva watermark por
 * proyecto (cliente + fecha), así que sus derivados se generan la primera vez
 * que un admin/cliente abre cada proyecto — no hay un set fijo que pre-generar.
 */
import { config } from "dotenv";
import path from "node:path";

// Cargar .env.local antes de importar la capa de datos/storage.
config({ path: path.resolve(process.cwd(), ".env.local") });

import {
  getPublicTalents,
  getPublicTalentBySlug,
} from "../src/lib/talents-public";
import { getPublicDerivative } from "../src/lib/talent/image-derivatives";
import type { DerivativeSize } from "../src/lib/talent/image-variants";

// La vitrina pública sirve los originales en resolución `preview` (la grilla vía
// next/image y la ficha de detalle). No usa `thumb`, así que solo warmeamos eso.
const SIZE: DerivativeSize = "preview";
const CONCURRENCY = 5;

const STORAGE_KEY = /^talents\/([^/]+)\/([^/]+)\.jpg$/;

interface Job {
  originalKey: string;
  code: string;
  variant: string;
}

/** Convierte una key de storage en un job; descarta keys locales (`/...`). */
function toJob(key: string | null | undefined): Job | null {
  if (!key) return null;
  const m = key.match(STORAGE_KEY);
  if (!m) return null; // local (/public) o formato desconocido → ya es estático
  return { originalKey: key, code: m[1], variant: m[2] };
}

/** Ejecuta `worker` sobre `items` con un pool de tamaño fijo. */
async function pool<T>(
  items: T[],
  size: number,
  worker: (item: T) => Promise<void>
): Promise<void> {
  let i = 0;
  const runners = Array.from({ length: Math.min(size, items.length) }, async () => {
    while (i < items.length) {
      const item = items[i++];
      await worker(item);
    }
  });
  await Promise.all(runners);
}

async function main() {
  console.log("→ Listando talentos públicos…");
  const cards = await getPublicTalents();
  console.log(`  ${cards.length} talentos públicos.`);

  // 1) Perfiles (grilla + LCP de cada ficha).
  const jobs = new Map<string, Job>(); // dedup por originalKey
  for (const c of cards) {
    const j = toJob(c.imageProfileKey);
    if (j) jobs.set(j.originalKey, j);
  }

  // 2) Galerías de cada ficha de detalle.
  console.log("→ Recolectando galerías de las fichas…");
  await pool(cards, CONCURRENCY, async (c) => {
    const detail = await getPublicTalentBySlug(c.slug);
    for (const key of detail?.galleryKeys ?? []) {
      const j = toJob(key);
      if (j) jobs.set(j.originalKey, j);
    }
  });

  const allJobs = [...jobs.values()];
  console.log(`→ ${allJobs.length} imágenes a warmear (size=${SIZE})…\n`);

  let ok = 0;
  let fail = 0;
  await pool(allJobs, CONCURRENCY, async (job) => {
    try {
      await getPublicDerivative(job.originalKey, job.code, job.variant, SIZE);
      ok++;
      process.stdout.write(`  ✓ ${job.code}/${job.variant}\n`);
    } catch (err) {
      fail++;
      const msg = err instanceof Error ? err.message : String(err);
      process.stdout.write(`  ✗ ${job.code}/${job.variant} — ${msg}\n`);
    }
  });

  console.log(`\n✔ Listo. Warmeadas: ${ok} · fallidas: ${fail} · total: ${allJobs.length}`);
  // Salida limpia: la conexión postgres-js mantiene el proceso vivo si no.
  process.exit(fail > 0 && ok === 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("Warm-up falló:", err);
  process.exit(1);
});
