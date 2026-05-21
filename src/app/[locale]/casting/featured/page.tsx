import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CastingHero } from "@/components/casting/CastingHero";
import { TalentCardPublic } from "@/components/casting/TalentCardPublic";
import { getFeaturedTalents } from "@/lib/talents-public";
import { createMetadata } from "@/lib/metadata";

const meta: Record<string, { title: string; description: string }> = {
  es: {
    title: "Featured Talent · Casting",
    description:
      "Personajes Yutro con presencia social propia. Identidad narrativa, audiencia y embajadores de marca.",
  },
  en: {
    title: "Featured Talent · Casting",
    description:
      "Yutro characters with their own social presence. Narrative identity, audience and brand ambassadors.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const m = meta[locale] ?? meta.es;
  return createMetadata({
    title: m.title,
    description: m.description,
    path: "/casting/featured",
    locale,
  });
}

/**
 * /casting/featured — vista filtrada al tier Featured. Sirve como
 * destino del redirect desde /influencer y como link compartible para
 * destacar el tier premium del Casting.
 */
export default async function CastingFeaturedPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: "es" | "en" = rawLocale === "en" ? "en" : "es";
  const t = await getTranslations({ locale, namespace: "casting" });

  const featured = await getFeaturedTalents();

  return (
    <main className="bg-background pb-32 text-foreground">
      <CastingHero locale={locale} totalCount={featured.length} />

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <div className="mb-10 grid gap-6 lg:grid-cols-[1fr_2fr] lg:gap-12">
            <h2
              className="font-heading text-3xl font-extrabold leading-tight sm:text-4xl"
              style={{ letterSpacing: "-0.02em" }}
            >
              {t("sections.featuredTitle")}
            </h2>
            <p
              className="text-base leading-relaxed text-foreground/60 sm:text-lg"
              style={{ maxWidth: "52ch" }}
            >
              {t("sections.featuredIntro")}
            </p>
          </div>

          {featured.length === 0 ? (
            <div className="border border-dashed border-foreground/15 px-6 py-16 text-center">
              <p
                className="mx-auto text-base italic text-foreground/50"
                style={{ maxWidth: "48ch" }}
              >
                {t("sections.featuredEmpty")}
              </p>
              <Link
                href="/casting"
                className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-primary hover:underline"
              >
                {locale === "es" ? "Ver roster completo" : "See full roster"} →
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((talent, i) => (
                <TalentCardPublic
                  key={talent.slug}
                  talent={talent}
                  variant="featured"
                  locale={locale}
                  priority={i < 2}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA solicitar acceso (mismo que index) */}
      <section className="bg-primary/[0.06] py-20 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 sm:px-10 lg:grid-cols-[1.5fr_1fr] lg:items-end lg:gap-16">
          <div>
            <h2
              className="font-heading text-3xl font-extrabold leading-tight text-foreground sm:text-5xl"
              style={{ letterSpacing: "-0.025em", maxWidth: "16ch" }}
            >
              {t("cta.title")}
            </h2>
            <p
              className="mt-5 text-base leading-relaxed text-foreground/60 sm:text-lg"
              style={{ maxWidth: "52ch" }}
            >
              {t("cta.body")}
            </p>
          </div>
          <Link
            href="/casting/solicitar-acceso"
            className="group inline-flex items-center gap-3 self-start bg-primary px-7 py-4 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t("cta.button")}
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
