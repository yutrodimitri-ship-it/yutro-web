/**
 * Etiqueta editorial pequeña que identifica un talento como destacado.
 * Se usa en TalentCardPublic y en la ficha individual.
 */
export function FeaturedBadge({
  locale = "es",
  className = "",
}: {
  locale?: "es" | "en";
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 bg-primary px-2 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-primary-foreground ${className}`}
    >
      <span className="h-1 w-1 rounded-full bg-current" aria-hidden />
      {locale === "es" ? "Destacado" : "Featured"}
    </span>
  );
}
