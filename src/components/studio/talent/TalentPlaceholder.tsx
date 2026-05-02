import Link from "next/link";
import { ArrowLeft, Sparkle } from "lucide-react";

interface TalentPlaceholderProps {
  eyebrow?: string;
  title: string;
  body: string;
  backHref: string;
  backLabel: string;
}

/**
 * Pantalla placeholder neutral para rutas de Talent que aun no se construyen
 * (Sprint 2/3). Comparte tipografia y dorado con el resto del modulo.
 */
export function TalentPlaceholder({
  eyebrow,
  title,
  body,
  backHref,
  backLabel,
}: TalentPlaceholderProps) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-start py-16 sm:py-20">
      {eyebrow && (
        <p
          className="mb-4 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--accent)]"
          style={{ fontFamily: "ui-monospace, monospace" }}
        >
          {eyebrow}
        </p>
      )}
      <div
        className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg"
        style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
      >
        <Sparkle className="h-6 w-6" strokeWidth={1.5} />
      </div>
      <h1
        className="mb-3 text-3xl font-bold tracking-tight text-white sm:text-4xl"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {title}
      </h1>
      <p className="mb-10 text-base leading-relaxed text-white/55 sm:text-lg">
        {body}
      </p>
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-white/50 transition-colors hover:text-white"
        style={{ fontFamily: "ui-monospace, monospace" }}
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
        {backLabel}
      </Link>
    </div>
  );
}
