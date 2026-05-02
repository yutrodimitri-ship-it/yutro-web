"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowLeft, AlertTriangle } from "lucide-react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Error boundary scoped al proyecto Talent. Muestra un mensaje generico al
 * cliente sin exponer detalles tecnicos. El digest queda visible en console
 * para debug pero no se renderiza al cliente.
 */
export default function ProjectErrorPage({ error, reset }: ErrorPageProps) {
  const t = useTranslations("studio.talent.error");
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? "es";
  const hubHref = `/${locale}/studio`;

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("[talent:error]", error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-xl flex-col items-start gap-6 py-20">
      <div
        className="inline-flex h-12 w-12 items-center justify-center rounded-lg"
        style={{
          background: "color-mix(in oklch, oklch(0.65 0.13 25) 12%, transparent)",
          color: "oklch(0.65 0.13 25)",
        }}
      >
        <AlertTriangle className="h-6 w-6" strokeWidth={1.5} />
      </div>

      <div className="space-y-3">
        <h1
          className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
          style={{
            fontFamily: "var(--font-heading)",
            letterSpacing: "-0.02em",
          }}
        >
          {t("title")}
        </h1>
        <p className="max-w-md text-base leading-relaxed text-white/55">
          {t("body")}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center justify-center px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-opacity hover:opacity-90"
          style={{
            background: "var(--accent)",
            color: "var(--accent-foreground)",
          }}
        >
          {t("retry")}
        </button>
        <Link
          href={hubHref}
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.12em] text-white/55 transition-colors hover:text-white"
          style={{
            border: "1px solid color-mix(in oklch, white 12%, transparent)",
          }}
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
          {t("backToHub")}
        </Link>
      </div>
    </div>
  );
}
