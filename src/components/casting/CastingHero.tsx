import { getTranslations } from "next-intl/server";

/**
 * Hero editorial de /casting (lookbook publico). Eyebrow + H1 + intro.
 * Server component — toma el locale por param para no usar hooks.
 */
export async function CastingHero({
  locale,
  totalCount,
}: {
  locale: string;
  totalCount?: number;
}) {
  const t = await getTranslations({ locale, namespace: "casting.hero" });

  return (
    <section className="border-b border-foreground/10 pt-32 pb-16 sm:pt-40 sm:pb-20">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        {/* Eyebrow editorial */}
        <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/40">
          {t("eyebrow")}
        </p>

        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-16">
          {/* Headline */}
          <h1
            className="font-heading font-extrabold leading-[0.92] text-foreground"
            style={{
              fontSize: "clamp(3rem, 8vw, 7.5rem)",
              letterSpacing: "-0.04em",
              maxWidth: "14ch",
            }}
          >
            {t("title")}{" "}
            <em className="italic text-primary not-italic-fallback">
              {t("titleAccent")}
            </em>
          </h1>

          {/* Intro + meta */}
          <div className="space-y-5">
            <p
              className="text-base leading-relaxed text-foreground/65 sm:text-lg"
              style={{ maxWidth: "44ch" }}
            >
              {t("intro")}
            </p>
            {totalCount !== undefined && (
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/40">
                {locale === "es"
                  ? `${totalCount} talentos · edición actual`
                  : `${totalCount} talents · current edition`}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
