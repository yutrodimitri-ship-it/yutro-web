"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";

/**
 * Seccion "El Casting" en home — bloque editorial que presenta el
 * Casting como producto y empuja al lookbook publico.
 *
 * Reemplaza al antiguo StudioBanner. Por ahora muestra 3 placeholders
 * editoriales; en Sprint 2 se conectara a getFeaturedTalents() y los
 * placeholders se reemplazan por talentos reales con foto perfil.
 */
export function CastingPreview() {
  const t = useTranslations("home.casting");

  // TODO Sprint 2: reemplazar con datos reales de getFeaturedTalents().
  // El layout esta pensado para 3 cards; si en el futuro hay mas, se
  // limita el slice a 3 en home y se ve el resto en /casting/featured.
  const placeholders = [
    { name: "Personaje N°01", category: "Lifestyle", hue: 6 },
    { name: "Personaje N°02", category: "Corporativo", hue: 200 },
    { name: "Personaje N°03", category: "Urbano", hue: 340 },
  ];

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

        {/* Grid de 3 placeholders editoriales */}
        <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
          {placeholders.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group relative overflow-hidden"
            >
              {/* Placeholder visual — gradiente con tinte segun hue.
                  En Sprint 2 esto pasa a ser una <Image> de la foto perfil
                  del talento. */}
              <div
                className="aspect-[3/4] w-full"
                style={{
                  background: `linear-gradient(180deg, hsl(${p.hue}, 35%, 25%), hsl(${p.hue}, 25%, 12%))`,
                }}
              />

              {/* Overlay editorial bottom — eyebrow + nombre */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/50">
                  N°{String(i + 1).padStart(2, "0")} · {p.category}
                </p>
                <p
                  className="mt-1 font-heading text-xl font-bold text-white"
                  style={{ letterSpacing: "-0.015em" }}
                >
                  {p.name}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

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
