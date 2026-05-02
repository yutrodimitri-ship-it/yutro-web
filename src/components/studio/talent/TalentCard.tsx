"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Plus, Check } from "lucide-react";
import { TalentImage } from "./TalentImage";
import { WatermarkOverlay } from "./WatermarkOverlay";
import { useCasting } from "@/lib/talent/casting-context";
import { useTalentSession } from "@/lib/talent/talent-session-context";
import { logAuditEvent } from "@/lib/talent/audit-log";
import { useToast } from "./Toast";
import type { Locale, Talent } from "@/types/talent";

interface TalentCardProps {
  talent: Talent;
  locale: Locale;
  /** Cliente en uppercase para el watermark (ej. "BBDO"). */
  clientName: string;
  /** Fecha formateada compact (ej. "30·04·26"). */
  watermarkDate: string;
  /** Slug del proyecto para construir el href de detalle. */
  projectSlug: string;
}

/**
 * Card del catalogo. Aspect ratio 3:4 obligatorio.
 *
 * Estados:
 *   - Normal: hover lift -4px, accion `+` en hover top-right
 *   - En shortlist: badge `✓` permanente top-right (clickeable para quitar)
 *   - Disabled (cupo lleno y no en shortlist): grayscale + badge "Cupo completo" rojo
 *
 * Click en card → navega a /studio/talent/[projectSlug]/talent/[code]
 * Click en boton +/✓ → toggle shortlist (no propaga al Link)
 */
export function TalentCard({
  talent,
  locale,
  clientName,
  watermarkDate,
  projectSlug,
}: TalentCardProps) {
  const tCard = useTranslations("studio.talent.catalog.card");
  const tToast = useTranslations("studio.talent.catalog.toast");
  const reduce = useReducedMotion();
  const { isInShortlist, isFull, add, remove, limits } = useCasting();
  const session = useTalentSession();
  const toast = useToast();

  const inShortlist = isInShortlist(talent.code);
  const isDisabled = isFull && !inShortlist;
  const detailHref = `/${locale}/studio/talent/${projectSlug}/talent/${talent.code}`;

  function handleToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (inShortlist) {
      remove(talent.code);
      logAuditEvent("talent_removed", session, { talentCode: talent.code, source: "catalog" });
      return;
    }
    if (add(talent.code)) {
      logAuditEvent("talent_added", session, { talentCode: talent.code, source: "catalog" });
    } else {
      toast.show(tToast("fullCapacity", { max: limits.maxTalents }));
    }
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 12 },
        show: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      whileHover={reduce ? undefined : { y: -4 }}
      className="group relative block overflow-hidden bg-[#131313]"
      style={{ aspectRatio: "3 / 4" }}
    >
      {/* Toda la card es Link al detalle (incluso disabled — exploracion permitida) */}
      <Link
        href={detailHref}
        aria-label={talent.name[locale]}
        className="absolute inset-0 z-[1] block"
      />

      {/* Imagen real (con watermark dinamico) o fallback al SVG placeholder */}
      <TalentImage
        talent={talent}
        variant="profile"
        disabled={isDisabled}
      />

      <WatermarkOverlay
        clientName={clientName}
        talentCode={talent.code}
        date={watermarkDate}
      />

      {/* Code badge top-left */}
      <span
        className="absolute left-4 top-4 z-[6] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.1em] backdrop-blur-md"
        style={{
          background: "rgba(10,10,10,0.7)",
          color: "var(--accent)",
        }}
      >
        {talent.code}
      </span>

      {/* "Cupo completo" badge top-right cuando disabled */}
      {isDisabled && (
        <span
          className="absolute right-4 top-4 z-[6] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.1em] backdrop-blur-md"
          style={{
            background: "color-mix(in oklch, oklch(0.65 0.13 25) 15%, transparent)",
            color: "oklch(0.65 0.13 25)",
            border: "1px solid color-mix(in oklch, oklch(0.65 0.13 25) 40%, transparent)",
          }}
        >
          {tCard("fullCapacity")}
        </span>
      )}

      {/* Boton +/✓ — siempre top-right cuando NO disabled */}
      {!isDisabled && (
        <button
          type="button"
          onClick={handleToggle}
          aria-label={
            inShortlist ? tCard("removeFromCasting") : tCard("addToCasting")
          }
          title={
            inShortlist ? tCard("removeFromCasting") : tCard("addToCasting")
          }
          className={`absolute right-4 top-4 z-[7] grid h-9 w-9 cursor-pointer place-items-center backdrop-blur-md transition-all duration-200 ${
            inShortlist
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100"
          }`}
          style={{
            background: inShortlist
              ? "var(--accent)"
              : "rgba(10,10,10,0.7)",
            border: `1px solid ${
              inShortlist
                ? "var(--accent)"
                : "color-mix(in oklch, white 20%, transparent)"
            }`,
            color: inShortlist
              ? "var(--accent-foreground)"
              : "white",
          }}
        >
          {inShortlist ? (
            <Check className="h-4 w-4" strokeWidth={2.5} />
          ) : (
            <Plus className="h-4 w-4" strokeWidth={2} />
          )}
        </button>
      )}

      {/* Bottom gradient overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          background:
            "linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.4) 50%, rgba(10,10,10,0) 100%)",
        }}
      />

      {/* Bottom info */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-[3] p-5">
        <div className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.1em]" style={{ color: "var(--accent)" }}>
          {talent.code}
        </div>
        <div
          className="mb-1 text-lg leading-tight text-white"
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 400,
          }}
        >
          {talent.name[locale]}
        </div>
        <div className="text-xs text-white/55">
          {talent.shortDesc[locale]}
        </div>
      </div>
    </motion.div>
  );
}
