"use client";

import { useState } from "react";
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
  clientName: string;
  watermarkDate: string;
  projectSlug: string;
  isExclusiveBlocked?: boolean;
  isAssigned?: boolean;
}

export function TalentCard({
  talent,
  locale,
  clientName,
  watermarkDate,
  projectSlug,
  isExclusiveBlocked = false,
  isAssigned = false,
}: TalentCardProps) {
  const tCard = useTranslations("studio.talent.catalog.card");
  const tToast = useTranslations("studio.talent.catalog.toast");
  const reduce = useReducedMotion();
  const { isInShortlist, isFull, add, remove, limits } = useCasting();
  const session = useTalentSession();
  const toast = useToast();
  const [hovered, setHovered] = useState(false);

  const inShortlist = isInShortlist(talent.code);
  const isDisabled = isFull && !inShortlist;
  const detailHref = `/${locale}/studio/talent/${projectSlug}/talent/${talent.code}`;

  if (isExclusiveBlocked || isAssigned) {
    const label = isAssigned ? "Asignado" : "Exclusivo";
    return (
      <div className="group flex flex-col" style={{ opacity: 0.45, pointerEvents: "none" }}>
        <div className="relative overflow-hidden" style={{ aspectRatio: "3 / 4", background: "var(--talent-bg-elev-2, oklch(0.91 0.012 77))", filter: "grayscale(100%)" }}>
          <TalentImage talent={talent} variant="profile" disabled />
          <WatermarkOverlay clientName={clientName} talentCode={talent.code} date={watermarkDate} />
          <div
            className="absolute inset-0 z-[5] flex flex-col items-center justify-center gap-2"
            style={{ background: "rgba(0,0,0,0.55)" }}
          >
            <span
              className="font-mono text-[9px] uppercase tracking-[0.18em] px-2 py-0.5"
              style={{
                background: isAssigned ? "var(--accent)" : "rgba(0,0,0,0.7)",
                color: isAssigned ? "var(--accent-foreground)" : "rgba(255,255,255,0.7)",
                border: isAssigned ? "1px solid var(--accent)" : "1px solid rgba(255,255,255,0.2)",
              }}
            >
              {label}
            </span>
          </div>
        </div>
        <div className="px-2 pt-2.5 pb-3">
          <div
            className="truncate text-[15px] leading-tight"
            style={{ fontFamily: "var(--font-heading)", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--talent-ink)" }}
          >
            {talent.name[locale]}
          </div>
          <div className="mt-1 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.1em]" style={{ color: "var(--talent-ink-mute)" }}>
            <span>{talent.code}</span>
            <span style={{ color: "var(--talent-line)" }}>·</span>
            <span style={{ color: "var(--talent-ink-dim)" }}>{talent.category}</span>
          </div>
        </div>
      </div>
    );
  }

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
        hidden: { opacity: 0 },
        show: { opacity: 1 },
      }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group flex flex-col"
    >
      {/* ── Imagen ── */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "3 / 4", background: "var(--talent-bg-elev-2, oklch(0.91 0.012 77))" }}>
        {/* Link de navegación */}
        <Link
          href={detailHref}
          aria-label={talent.name[locale]}
          className="absolute inset-0 z-[1] block"
        />

        <TalentImage talent={talent} variant="profile" disabled={isDisabled} />
        <WatermarkOverlay clientName={clientName} talentCode={talent.code} date={watermarkDate} />

        {/* Overlay hover: gradiente + botón */}
        <motion.div
          animate={{ opacity: hovered && !reduce ? 1 : 0 }}
          transition={{ duration: 0.18 }}
          className="pointer-events-none absolute inset-0 z-[3]"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)",
          }}
        />

        {/* Botón +/✓ — esquina superior derecha, aparece en hover */}
        {!isDisabled && (
          <motion.button
            type="button"
            onClick={handleToggle}
            aria-label={inShortlist ? tCard("removeFromCasting") : tCard("addToCasting")}
            animate={{ opacity: hovered || inShortlist ? 1 : 0 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-auto absolute right-2.5 top-2.5 z-[6] flex h-7 w-7 cursor-pointer items-center justify-center rounded-full"
            style={
              inShortlist
                ? { background: "var(--accent)", color: "var(--accent-foreground)" }
                : {
                    background: "rgba(0,0,0,0.45)",
                    border: "1px solid rgba(255,255,255,0.25)",
                    backdropFilter: "blur(6px)",
                    color: "rgba(255,255,255,0.9)",
                  }
            }
          >
            {inShortlist
              ? <Check className="h-3 w-3" strokeWidth={2.5} />
              : <Plus className="h-3 w-3" strokeWidth={2} />
            }
          </motion.button>
        )}

        {/* Badge "cupo completo" */}
        {isDisabled && (
          <div
            className="absolute bottom-0 left-0 right-0 z-[5] px-3 py-2 font-mono text-[9px] uppercase tracking-[0.1em]"
            style={{
              background: "rgba(0,0,0,0.65)",
              color: "rgba(255,255,255,0.75)",
            }}
          >
            {tCard("fullCapacity")}
          </div>
        )}
      </div>

      {/* ── Info debajo de imagen ── */}
      <div className="px-2 pt-2.5 pb-3">
        <div
          className="truncate text-[15px] leading-tight"
          style={{ fontFamily: "var(--font-heading)", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--talent-ink)" }}
        >
          {talent.name[locale]}
        </div>
        <div className="mt-1 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.1em]" style={{ color: "var(--talent-ink-mute)" }}>
          <span>{talent.code}</span>
          <span style={{ color: "var(--talent-line)" }}>·</span>
          <span style={{ color: "var(--talent-ink-dim)" }}>{talent.category}</span>
        </div>
      </div>
    </motion.div>
  );
}
