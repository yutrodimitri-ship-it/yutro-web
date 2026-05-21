/**
 * Etiqueta editorial pequeña que identifica un talento como Featured.
 * Se usa en TalentCardPublic y en la ficha individual.
 */
export function FeaturedBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 bg-primary px-2 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-primary-foreground ${className}`}
    >
      <span className="h-1 w-1 rounded-full bg-current" aria-hidden />
      Featured
    </span>
  );
}
