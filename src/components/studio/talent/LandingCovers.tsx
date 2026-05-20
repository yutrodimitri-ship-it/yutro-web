"use client";

import Link from "next/link";
import { TalentImage } from "./TalentImage";
import type { Locale, Talent } from "@/types/talent";

interface LandingCoversProps {
  talents: Talent[];
  locale: Locale;
  projectSlug: string;
  catalogHref: string;
}

/**
 * Grid de 6 portadas de la landing del proyecto.
 * Client component para poder usar TalentImage (fetch autenticado con watermark).
 */
export function LandingCovers({
  talents,
  locale,
  projectSlug,
  catalogHref,
}: LandingCoversProps) {
  if (talents.length === 0) {
    return (
      <Link
        href={catalogHref}
        className="block border py-12 text-center font-mono text-[11px] uppercase tracking-[0.14em] transition-colors hover:border-talent-ink"
        style={{
          borderColor: "var(--talent-line)",
          color: "var(--talent-ink-mute)",
        }}
      >
        Ver catálogo →
      </Link>
    );
  }

  return (
    <div
      className="grid gap-px"
      style={{
        gridTemplateColumns: `repeat(${Math.min(talents.length, 6)}, 1fr)`,
        background: "var(--talent-line)",
      }}
    >
      {talents.map((talent, i) => (
        <Link
          key={talent.code}
          href={`/${locale}/studio/talent/${projectSlug}/talent/${talent.code}`}
          className="group relative block overflow-hidden"
          style={{
            aspectRatio: "3/4",
            background: "var(--talent-bg)",
          }}
        >
          <TalentImage
            talent={talent}
            variant="profile"
            portraitVariant={i}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />

          {/* Hover overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: "color-mix(in oklch, var(--talent-ink) 20%, transparent)" }}
          />

          {/* Code badge */}
          <div
            className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-[0.18em] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background: "var(--talent-bg)",
              color: "var(--talent-ink)",
              padding: "4px 8px",
              border: "1px solid var(--talent-line)",
            }}
          >
            {talent.code}
          </div>
        </Link>
      ))}
    </div>
  );
}
