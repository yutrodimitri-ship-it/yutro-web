import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { TalentCardPublic } from "@/components/casting/TalentCardPublic";
import { getFeaturedTalents } from "@/lib/talents-public";

/**
 * Seccion "El Casting" en home — bloque editorial que presenta el
 * Casting como producto y empuja al lookbook publico.
 *
 * Server component: lee los talentos Featured reales de la DB via
 * getFeaturedTalents() y los renderiza con TalentCardPublic (foto
 * perfil real, no placeholders). Reemplaza al antiguo StudioBanner.
 */
export async function CastingPreview() {
  const rawLocale = await getLocale();
  const locale: "es" | "en" = rawLocale === "en" ? "en" : "es";
  const t = await getTranslations("home.casting");

  // Featured reales — Camila, Antonia, Sofi. Slice a 3 por si en el
  // futuro hay mas (el layout del home esta pensado para 3).
  const featured = (await getFeaturedTalents()).slice(0, 3);

  return (
    <section className="relative bg-background px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto max-w-7xl">
        {/* Eyebrow editorial */}
        <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/40">
          {t("eyebrow")}
        </p>

        {/* Headline + descripcion en grid */}
        <div className="grid gap-8 pb-12 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <h2
            className="font-heading font-extrabold leading-[0.95] text-foreground"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
              letterSpacing: "-0.03em",
              maxWidth: "16ch",
            }}
          >
            {t("title")}{" "}
            <em className="italic text-primary font-extrabold not-italic-fallback">
              {t("titleAccent")}
            </em>
          </h2>

          <p
            className="text-base leading-relaxed text-foreground/60 sm:text-lg"
            style={{ maxWidth: "42ch" }}
          >
            {t("description")}
          </p>
        </div>

        {/* Grid de talentos Featured reales */}
        {featured.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
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

        {/* CTA bloque editorial */}
        <div className="mt-14 flex flex-col items-start gap-4 border-t border-foreground/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p
            className="font-heading text-2xl font-bold text-foreground sm:text-3xl"
            style={{ letterSpacing: "-0.02em", maxWidth: "20ch" }}
          >
            {t("ctaPrompt")}
          </p>
          <Link
            href="/casting"
            className="group inline-flex items-center gap-3 bg-primary px-7 py-4 font-mono text-[11px] uppercase tracking-[0.14em] text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t("cta")}
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
