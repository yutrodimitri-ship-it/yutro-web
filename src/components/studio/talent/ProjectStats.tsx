"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useCasting } from "@/lib/talent/casting-context";
import type { Locale } from "@/types/talent";

interface ProjectStatsProps {
  available: number;
  locale: Locale;
  projectSlug: string;
}

export function ProjectStats({ available, locale, projectSlug }: ProjectStatsProps) {
  const t = useTranslations("studio.talent.catalog");
  const { state, limits } = useCasting();

  const castingHref = `/${locale}/studio/talent/${projectSlug}/casting`;
  const hasCasting = state.shortlist.length > 0;

  return (
    <div className="flex items-center gap-5 font-mono text-[12px] uppercase tracking-[0.1em]" style={{ color: "var(--talent-ink-mute)" }}>
      <span>
        <span style={{ color: "var(--talent-ink-dim)" }}>{available}</span> {t("stats.available")}
      </span>
      <span style={{ color: "var(--talent-line)" }}>·</span>
      <span>
        <span style={{ color: "var(--talent-ink-dim)" }}>{state.shortlist.length}</span>
        <span>/{limits.maxTalents}</span>{" "}
        {t("stats.shortlist")}
      </span>
      <span style={{ color: "var(--talent-line)" }}>·</span>
      <span>
        <span style={{ color: "var(--talent-ink-dim)" }}>{state.exclusives.size}</span>
        <span>/{limits.maxExclusive}</span>{" "}
        {t("stats.exclusive")}
      </span>

      {hasCasting && (
        <>
          <span style={{ color: "var(--talent-line)" }}>·</span>
          <Link
            href={castingHref}
            className="transition-colors"
            style={{ color: "var(--accent)" }}
          >
            {t("viewCasting")} →
          </Link>
        </>
      )}
    </div>
  );
}
