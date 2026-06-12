import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CastingHero } from "@/components/casting/CastingHero";
import { TalentCardPublic } from "@/components/casting/TalentCardPublic";
import { getPublicTalents } from "@/lib/talents-public";

/**
 * /casting — Index lookbook editorial.
 *
 * Estructura por brief:
 *   - Hero editorial (eyebrow + H1 + intro)
 *   - Seccion Featured Talent (3-5 cards con IG embed)
 *   - Seccion Casting estandar (grid 4-col del resto)
 *   - Bloque CTA "Solicitar acceso"
 */
export default async function CastingIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale === "en" ? "en" : "es";
  const t = await getTranslations({ locale, namespace: "casting" });

  const talents = await getPublicTalents();
  const featured = talents.filter((t) => t.tier === "featured");
  const standard = talents.filter((t) => t.tier === "standard");

  return (
    <main className="bg-background pb-32 text-foreground">
      <CastingHero locale={locale} totalCount={talents.length} />

      {/* ── Featured Talent ──────────────────────────────────── */}
      <section className="border-b border-foreground/10 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <div className="mb-10 grid gap-6 lg:grid-cols-[1fr_2fr] lg:gap-12">
            <h2
              className="font-heading text-3xl font-extrabold leading-tight sm:text-4xl"
              style={{ letterSpacing: "-0.02em" }}
            >
              {t("sections.featuredTitle")}
            </h2>
            <p className="text-base leading-relaxed text-foreground/60 sm:text-lg" style={{ maxWidth: "52ch" }}>
              {t("sections.featuredIntro")}
            </p>
          </div>

          {featured.length === 0 ? (
            <EmptyState message={t("sections.featuredEmpty")} />
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

      {/* ── Casting estandar ─────────────────────────────────── */}
      <section className="border-b border-foreground/10 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <div className="mb-10 grid gap-6 lg:grid-cols-[1fr_2fr] lg:gap-12">
            <h2
              className="font-heading text-3xl font-extrabold leading-tight sm:text-4xl"
              style={{ letterSpacing: "-0.02em" }}
            >
              {t("sections.standardTitle")}
            </h2>
            <p className="text-base leading-relaxed text-foreground/60 sm:text-lg" style={{ maxWidth: "52ch" }}>
              {t("sections.standardIntro")}
            </p>
          </div>

          {standard.length === 0 ? (
            <EmptyState message={t("sections.standardEmpty")} />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {standard.map((talent) => (
                <TalentCardPublic
                  key={talent.slug}
                  talent={talent}
                  variant="standard"
                  locale={locale}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA solicitar acceso ─────────────────────────────── */}
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
          <div>
            <Link
              href="/casting/solicitar-acceso"
              className="group inline-flex items-center gap-3 bg-primary px-7 py-4 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {t("cta.button")}
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="border border-dashed border-foreground/15 px-6 py-12 text-center">
      <p className="text-base text-foreground/50 italic" style={{ maxWidth: "48ch", margin: "0 auto" }}>
        {message}
      </p>
    </div>
  );
}
