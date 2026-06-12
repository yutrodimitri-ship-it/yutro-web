import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/shared/Container";
import { FeaturedBadge } from "@/components/casting/FeaturedBadge";
import {
  getPublicTalentBySlug,
  resolvePublicImage,
} from "@/lib/talents-public";
import { createMetadata } from "@/lib/metadata";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.yutro.cl";

// Dinamica a proposito: la ficha lee de la BD (visibilidad/curaduria cambian
// sin redeploy) y getTranslations usa APIs de request — prerender estatico
// tiraba DYNAMIC_SERVER_USAGE en produccion.
export const dynamic = "force-dynamic";

const CATEGORY_LABELS: Record<string, { es: string; en: string }> = {
  corporativo: { es: "Corporativo", en: "Corporate" },
  lifestyle: { es: "Lifestyle", en: "Lifestyle" },
  familiar: { es: "Familiar", en: "Family" },
  urbano: { es: "Urbano", en: "Urban" },
  senior: { es: "Senior", en: "Senior" },
  oficios: { es: "Oficios", en: "Trades" },
  artistico: { es: "Artístico", en: "Artistic" },
  profesional: { es: "Profesional", en: "Professional" },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale: "es" | "en" = rawLocale === "en" ? "en" : "es";
  const talent = await getPublicTalentBySlug(slug);
  if (!talent) {
    return { title: "Casting · Yutro" };
  }
  const name = locale === "en" ? talent.nameEn : talent.nameEs;
  const shortDesc = locale === "en" ? talent.shortDescEn : talent.shortDescEs;
  const categoryLabel =
    CATEGORY_LABELS[talent.category]?.[locale] ?? talent.category;
  const description =
    locale === "en"
      ? `${name} — ${shortDesc} Digital talent by Yutro for advertising campaigns in LATAM.`
      : `${name} — ${shortDesc} Talento digital de Yutro para campañas publicitarias en LATAM.`;

  return createMetadata({
    title: `${name} · Casting`,
    description,
    path: `/casting/${slug}`,
    locale,
    image: `/api/og?title=${encodeURIComponent(name)}&subtitle=${encodeURIComponent(categoryLabel)}&locale=${locale}`,
  });
}

export default async function CastingDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale: "es" | "en" = rawLocale === "en" ? "en" : "es";
  const talent = await getPublicTalentBySlug(slug);
  if (!talent) notFound();

  const t = await getTranslations({ locale, namespace: "casting.detail" });

  const name = locale === "es" ? talent.nameEs : talent.nameEn;
  const shortDesc = locale === "es" ? talent.shortDescEs : talent.shortDescEn;
  const phenotype = locale === "es" ? talent.phenotypeEs : talent.phenotypeEn;
  const tone = locale === "es" ? talent.toneCommercialEs : talent.toneCommercialEn;
  const bio = locale === "es" ? talent.publicBioEs : talent.publicBioEn;
  const categoryLabel =
    CATEGORY_LABELS[talent.category]?.[locale] ?? talent.category;

  const heroImage = resolvePublicImage(talent.imageProfileKey);
  const gallery = (talent.galleryKeys || [])
    .map((k) => resolvePublicImage(k))
    .filter((src): src is string => Boolean(src))
    .slice(0, 4);

  const isFeatured = talent.tier === "featured";

  // Schema.org Person — JSON-LD para SEO enriquecido
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    description: shortDesc,
    image: heroImage ? `${SITE_URL}${heroImage}` : undefined,
    url: `${SITE_URL}/${locale}/casting/${slug}`,
    nationality: { "@type": "Country", name: "Chile" },
    knowsAbout: talent.suggestedUses.map((u) => u[locale]),
  };

  return (
    <main className="bg-background pt-32 pb-24 sm:pt-40 text-foreground">
      <Container>
        {/* Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />

        {/* Breadcrumb */}
        <nav className="mb-12 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/40">
          <Link href="/casting" className="hover:text-primary">
            {locale === "es" ? "Casting" : "Casting"}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground/70">{name}</span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          {/* ── Columna izquierda — galeria editorial ────────── */}
          <div>
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-foreground/5">
              {heroImage ? (
                <Image
                  src={heroImage}
                  alt={name}
                  fill
                  sizes="(max-width:1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-foreground/15 to-foreground/5" />
              )}
              <span
                className="pointer-events-none absolute right-3 bottom-3 font-mono text-[9px] uppercase tracking-[0.18em] text-white/40 mix-blend-overlay"
                aria-hidden
              >
                Yutro · Vol. 01
              </span>
            </div>

            {gallery.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-3">
                {gallery.map((src, i) => (
                  <div
                    key={i}
                    className="relative aspect-square overflow-hidden bg-foreground/5"
                  >
                    <Image
                      src={src}
                      alt={`${name} — ${i + 1}`}
                      fill
                      sizes="(max-width:1024px) 33vw, 16vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Columna derecha — ficha tipografica ─────────── */}
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/40">
              {t("eyebrowProfile")}
              {String((slug.charCodeAt(0) + slug.length) % 100).padStart(2, "0")}
              {isFeatured && (
                <FeaturedBadge locale={locale} className="ml-3 align-middle" />
              )}
            </p>

            <h1
              className="mt-3 font-heading font-extrabold leading-[0.95] text-foreground"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 5rem)",
                letterSpacing: "-0.035em",
              }}
            >
              {name}
            </h1>

            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/50">
              {categoryLabel} · {talent.ageRange} · {talent.market.join(" · ")}
            </p>

            {/* Bloque de ficha */}
            <dl className="mt-10 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
              <FichaRow label={t("fields.phenotype")}>{phenotype}</FichaRow>
              <FichaRow label={t("fields.tone")}>{tone}</FichaRow>
              <FichaRow label={t("fields.ageRange")}>
                {talent.ageRange}{" "}
                <span className="text-foreground/40">{t("fields.ageNote")}</span>
              </FichaRow>
              <FichaRow label={t("fields.category")}>{categoryLabel}</FichaRow>
              <FichaRow label={t("fields.market")}>
                {talent.market.join(", ")}
              </FichaRow>
            </dl>

            {/* Bio publica */}
            {bio && (
              <p className="mt-10 text-base leading-relaxed text-foreground/70 sm:text-lg" style={{ maxWidth: "52ch" }}>
                {bio}
              </p>
            )}

            {/* Bloque Instagram solo para featured */}
            {isFeatured && talent.instagramFollowers && (
              <div className="mt-10 border border-foreground/10 p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/40">
                  {t("instagram.label")}
                </p>
                <p className="mt-2 font-heading text-2xl font-bold">
                  {talent.instagramHandle ? `@${talent.instagramHandle}` : `@${name.toLowerCase()}`}
                </p>
                <p className="mt-1 text-sm text-foreground/60">
                  {t("instagram.followers", { count: formatFollowers(talent.instagramFollowers) })}
                </p>
                {talent.instagramHandle && (
                  <a
                    href={`https://instagram.com/${talent.instagramHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-primary hover:underline"
                  >
                    {t("instagram.viewProfile")} →
                  </a>
                )}
              </div>
            )}

            {/* CTA bottom */}
            <div className="mt-12 border-t border-foreground/10 pt-8">
              <p
                className="font-heading text-2xl font-bold leading-tight sm:text-3xl"
                style={{ letterSpacing: "-0.02em", maxWidth: "20ch" }}
              >
                {t("ctaTitle", { name })}
              </p>
              <Link
                href="/casting/solicitar-acceso"
                className="mt-5 inline-flex items-center gap-3 bg-primary px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.14em] text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {t("ctaButton")}
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Volver al casting */}
        <div className="mt-20 border-t border-foreground/10 pt-8">
          <Link
            href="/casting"
            className="font-mono text-[11px] uppercase tracking-[0.14em] text-foreground/50 hover:text-primary"
          >
            {t("back")}
          </Link>
        </div>
      </Container>
    </main>
  );
}

function FichaRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="mb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/40">
        {label}
      </dt>
      <dd className="text-base text-foreground/80">{children}</dd>
    </div>
  );
}

function formatFollowers(n: number): string {
  if (n >= 1000) {
    const k = n / 1000;
    return `${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}K`;
  }
  return String(n);
}
