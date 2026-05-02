"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCasting } from "@/lib/talent/casting-context";
import type { Locale } from "@/types/talent";

interface ProjectStatsProps {
  available: number;
  /** Locale + projectSlug para construir el href "Ver mi casting". */
  locale: Locale;
  projectSlug: string;
}

/**
 * 3 contadores horizontales que LEEN del CastingContext en vivo.
 *
 * Cuando el shortlist > 0, aparece un Link "Ver mi casting" alineado al
 * final que navega a la pantalla de confirmacion (Sprint 3).
 */
export function ProjectStats({
  available,
  locale,
  projectSlug,
}: ProjectStatsProps) {
  const t = useTranslations("studio.talent.catalog");
  const { state, limits } = useCasting();

  const showCastingLink = state.shortlist.length > 0;
  const castingHref = `/${locale}/studio/talent/${projectSlug}/casting`;

  return (
    <div className="flex flex-wrap items-end gap-x-12 gap-y-6">
      <Stat value={available} label={t("stats.available")} />
      <Stat
        value={state.shortlist.length}
        max={limits.maxTalents}
        label={t("stats.shortlist")}
      />
      <Stat
        value={state.exclusives.size}
        max={limits.maxExclusive}
        label={t("stats.exclusive")}
      />

      {showCastingLink && (
        <Link
          href={castingHref}
          className="ml-auto inline-flex items-center gap-2 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors"
          style={{
            background: "var(--accent)",
            color: "var(--accent-foreground)",
          }}
        >
          {t("viewCasting")}
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
        </Link>
      )}
    </div>
  );
}

interface StatProps {
  value: number;
  max?: number;
  label: string;
}

function Stat({ value, max, label }: StatProps) {
  return (
    <div>
      <div
        className="text-[28px] leading-none"
        style={{
          fontFamily: "var(--font-heading)",
          fontWeight: 400,
          color: "var(--accent)",
        }}
      >
        {value}
        {typeof max === "number" && (
          <>
            <span className="text-white/30" style={{ fontWeight: 300 }}>
              {" / "}
            </span>
            {max}
          </>
        )}
      </div>
      <div className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-white/40">
        {label}
      </div>
    </div>
  );
}
