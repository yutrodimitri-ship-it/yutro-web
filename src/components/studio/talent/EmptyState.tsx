import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
}

/**
 * Empty state con borde dashed para usar en /casting cuando shortlist === [].
 * Tipografia editorial coherente con el resto del modulo.
 */
export function EmptyState({
  title,
  description,
  ctaLabel,
  ctaHref,
}: EmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center gap-5 px-8 py-20 text-center"
      style={{
        border: "1px dashed color-mix(in oklch, black 14%, transparent)",
      }}
    >
      <h3
        className="text-2xl"
        style={{
          color: "var(--talent-ink)",
          fontFamily: "var(--font-heading)",
          fontWeight: 300,
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h3>
      <p className="max-w-md text-sm" style={{ color: "var(--talent-ink-dim)" }}>{description}</p>
      <Link
        href={ctaHref}
        className="mt-2 inline-flex items-center px-6 py-3 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors"
        style={{
          color: "var(--talent-ink)",
          border: "1px solid color-mix(in oklch, black 12%, transparent)",
        }}
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
