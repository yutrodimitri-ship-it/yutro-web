/**
 * Capa de datos del Casting publico (yutro.cl/casting).
 *
 * Esta capa SOLO lee del subset publico de la tabla talents — los
 * campos `public_*` y los que el lookbook necesita renderizar. Nunca
 * expone:
 *   - code interno (YE-W01, YE-F01) — para eso esta public_slug
 *   - status / market interno completo
 *   - notas privadas del roster
 *
 * Todas las funciones son server-only. Se usan desde Server Components
 * de /casting/*; nunca importar desde un client component.
 */

import "server-only";
import { db } from "@/db";
import { talents } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";

export type PublicTalentTier = "featured" | "standard";

/** Shape minimo que el lookbook publico necesita. */
export interface PublicTalentCard {
  slug: string;
  nameEs: string;
  nameEn: string;
  category: string;
  ageRange: string;
  ageBucket: string;
  market: string[];
  tier: PublicTalentTier;
  imageProfileKey: string | null;
  instagramHandle: string | null;
  instagramFollowers: number | null;
}

/** Shape extendido para la ficha individual /casting/[slug]. */
export interface PublicTalentDetail extends PublicTalentCard {
  shortDescEs: string;
  shortDescEn: string;
  phenotypeEs: string;
  phenotypeEn: string;
  toneCommercialEs: string;
  toneCommercialEn: string;
  publicBioEs: string | null;
  publicBioEn: string | null;
  galleryKeys: string[];
  suggestedUses: { es: string; en: string }[];
}

/**
 * Lista todos los talentos publicos ordenados con featured primero y
 * luego por nombre. Usado por:
 *   /casting             (index lookbook)
 *   /home CastingPreview (si Sprint 2 lo reescribe sobre data real)
 */
export async function getPublicTalents(): Promise<PublicTalentCard[]> {
  const rows = await db
    .select({
      slug: talents.publicSlug,
      nameEs: talents.nameEs,
      nameEn: talents.nameEn,
      category: talents.category,
      ageRange: talents.ageRange,
      ageBucket: talents.ageBucket,
      market: talents.market,
      tier: talents.tier,
      imageProfileKey: talents.imageProfileKey,
      instagramHandle: talents.instagramHandle,
      instagramFollowers: talents.instagramFollowers,
    })
    .from(talents)
    .where(
      and(
        eq(talents.publicVisible, true),
        eq(talents.isActive, true),
        sql`${talents.publicSlug} IS NOT NULL`
      )
    )
    // featured primero, luego standard, luego alfabetico por nombre
    .orderBy(sql`CASE WHEN ${talents.tier} = 'featured' THEN 0 ELSE 1 END`, talents.nameEs);

  // El filtro WHERE garantiza que publicSlug no es null; el cast es seguro.
  return rows.map((r) => ({
    ...r,
    slug: r.slug as string,
    tier: r.tier as PublicTalentTier,
  }));
}

/** Solo featured. Usado por /casting/featured y para previews en home. */
export async function getFeaturedTalents(): Promise<PublicTalentCard[]> {
  const all = await getPublicTalents();
  return all.filter((t) => t.tier === "featured");
}

/**
 * Ficha individual por slug publico. Devuelve undefined si no existe o
 * si el talento no esta publico (404 desde la ruta).
 */
export async function getPublicTalentBySlug(
  slug: string
): Promise<PublicTalentDetail | undefined> {
  const [row] = await db
    .select({
      slug: talents.publicSlug,
      nameEs: talents.nameEs,
      nameEn: talents.nameEn,
      category: talents.category,
      ageRange: talents.ageRange,
      ageBucket: talents.ageBucket,
      market: talents.market,
      tier: talents.tier,
      imageProfileKey: talents.imageProfileKey,
      instagramHandle: talents.instagramHandle,
      instagramFollowers: talents.instagramFollowers,
      shortDescEs: talents.shortDescEs,
      shortDescEn: talents.shortDescEn,
      phenotypeEs: talents.phenotypeEs,
      phenotypeEn: talents.phenotypeEn,
      toneCommercialEs: talents.toneCommercialEs,
      toneCommercialEn: talents.toneCommercialEn,
      publicBioEs: talents.publicBioEs,
      publicBioEn: talents.publicBioEn,
      galleryKeys: talents.galleryKeys,
      suggestedUses: talents.suggestedUses,
    })
    .from(talents)
    .where(
      and(
        eq(talents.publicSlug, slug),
        eq(talents.publicVisible, true),
        eq(talents.isActive, true)
      )
    )
    .limit(1);

  if (!row) return undefined;

  return {
    ...row,
    slug: row.slug as string,
    tier: row.tier as PublicTalentTier,
  };
}

/** Devuelve todos los slugs publicos. Usado por generateStaticParams. */
export async function getAllPublicSlugs(): Promise<string[]> {
  const rows = await db
    .select({ slug: talents.publicSlug })
    .from(talents)
    .where(
      and(
        eq(talents.publicVisible, true),
        eq(talents.isActive, true),
        sql`${talents.publicSlug} IS NOT NULL`
      )
    );
  return rows.map((r) => r.slug as string);
}

/** Helper: resuelve la URL final para un image_profile_key o gallery key.
 *
 * Los talentos featured (Camila/Antonia/Sofi) tienen rutas absolutas a
 * `/public/influencers/*` — esas se sirven tal cual. Los talentos
 * standard tienen R2 storage keys (sin slash inicial); para ellos
 * generamos la URL via /api/studio/talent/image/[code]/[variant]... no,
 * espera — eso es el flujo PRIVADO con auth. Para publicos necesitamos
 * un endpoint sin auth o servir directo.
 *
 * Por ahora: si el key empieza con "/" tratarlo como path absoluto del
 * /public; sino devolver placeholder. En un commit posterior agregamos
 * un endpoint publico /api/casting/image que firma URLs de R2.
 */
export function resolvePublicImage(key: string | null): string | null {
  if (!key) return null;
  if (key.startsWith("/")) return key;
  if (key.startsWith("http")) return key;
  // Keys de storage (`talents/{code}/{variant}.jpg`) se sirven via el
  // endpoint publico de vitrina (preview 1200px, solo public_visible).
  const m = key.match(/^talents\/([^/]+)\/([^/]+)\.jpg$/);
  if (m) return `/api/casting/image/${m[1]}/${m[2]}`;
  return null;
}
