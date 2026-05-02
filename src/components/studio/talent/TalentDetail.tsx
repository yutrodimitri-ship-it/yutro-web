"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowLeft, Plus, Check } from "lucide-react";
import { TalentImage } from "./TalentImage";
import { WatermarkOverlay } from "./WatermarkOverlay";
import { TalentGallery } from "./TalentGallery";
import { useCasting } from "@/lib/talent/casting-context";
import { useTalentSession } from "@/lib/talent/talent-session-context";
import { logAuditEvent } from "@/lib/talent/audit-log";
import { useToast } from "./Toast";
import type { Locale, Talent } from "@/types/talent";

interface TalentDetailProps {
  talent: Talent;
  locale: Locale;
  projectSlug: string;
  clientName: string;
  watermarkDate: string;
}

/**
 * Pantalla 3 — Detalle de un talento.
 *
 * Layout 60/40:
 *   - Izquierda: hero 3:4 + galeria estudio (3 cuadradas) + galeria lifestyle (3 cuadradas)
 *   - Derecha: codigo + nombre + spec grid 2 columnas + tags + boton principal + boton volver
 *
 * El boton principal tiene 3 estados:
 *   - Talento NO en shortlist + cupo libre → "+ Agregar al casting" (primary dorado)
 *   - Talento ya en shortlist             → "✓ Ya en tu casting" (variant outline, click quita)
 *   - Cupo lleno + NO en shortlist        → "Cupo completo" (disabled)
 */
export function TalentDetail({
  talent,
  locale,
  projectSlug,
  clientName,
  watermarkDate,
}: TalentDetailProps) {
  const tDetail = useTranslations("studio.talent.detail");
  const tCommon = useTranslations("studio.talent.common");
  const tCatalog = useTranslations("studio.talent.catalog");
  const reduce = useReducedMotion();
  const { isInShortlist, isFull, add, remove, limits } = useCasting();
  const session = useTalentSession();
  const toast = useToast();

  const inShortlist = isInShortlist(talent.code);
  const isCapFull = isFull && !inShortlist;
  const catalogHref = `/${locale}/studio/talent/${projectSlug}`;

  // Audit: log que el cliente vio este detalle (una sola vez por mount)
  useEffect(() => {
    logAuditEvent("talent_viewed", session, { talentCode: talent.code });
  }, [session, talent.code]);

  function handlePrimaryClick() {
    if (inShortlist) {
      remove(talent.code);
      logAuditEvent("talent_removed", session, {
        talentCode: talent.code,
        source: "detail",
      });
      return;
    }
    if (isCapFull) {
      toast.show(
        tCatalog("toast.fullCapacity", { max: limits.maxTalents })
      );
      return;
    }
    if (add(talent.code)) {
      logAuditEvent("talent_added", session, {
        talentCode: talent.code,
        source: "detail",
      });
    }
  }

  // Subtitulo: gender · age · phenotype
  const genderLabel =
    talent.gender === "f"
      ? locale === "en" ? "Woman" : "Mujer"
      : locale === "en" ? "Man" : "Hombre";
  const subtitle = `${genderLabel} · ${talent.ageRange} · ${talent.phenotype[locale]}`;

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-12"
    >
      {/* Boton volver — siempre arriba */}
      <Link
        href={catalogHref}
        className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.1em] text-white/40 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
        {tDetail("back")}
      </Link>

      <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
        {/* ─── Columna izquierda: imagenes ─── */}
        <div className="space-y-12">
          {/* Hero 3:4 */}
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.98 }}
            animate={reduce ? undefined : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden bg-[#131313]"
            style={{ aspectRatio: "3 / 4" }}
          >
            <TalentImage talent={talent} variant="profile" />
            <WatermarkOverlay
              clientName={clientName}
              talentCode={talent.code}
              date={watermarkDate}
              confidential
              confidentialLabel={tCommon("confidential").toUpperCase()}
            />
          </motion.div>

          <TalentGallery
            talent={talent}
            variant="studio"
            title={tDetail("gallery.studio")}
            clientName={clientName}
            watermarkDate={watermarkDate}
          />

          <TalentGallery
            talent={talent}
            variant="lifestyle"
            title={tDetail("gallery.lifestyle")}
            clientName={clientName}
            watermarkDate={watermarkDate}
          />
        </div>

        {/* ─── Columna derecha: info ─── */}
        <div className="space-y-10 lg:sticky lg:top-12 lg:self-start">
          <div>
            <p
              className="mb-3 font-mono text-[11px] uppercase tracking-[0.1em]"
              style={{ color: "var(--accent)" }}
            >
              {talent.code}
            </p>
            <h1
              className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
              style={{
                fontFamily: "var(--font-heading)",
                letterSpacing: "-0.02em",
                lineHeight: 1.05,
              }}
            >
              {renderNameWithItalic(talent.name[locale])}
            </h1>
            <p className="mt-3 text-base text-white/55">{subtitle}</p>
          </div>

          {/* Spec grid 2 cols */}
          <dl
            className="grid grid-cols-1 gap-x-8 gap-y-6 border-y py-7 sm:grid-cols-2"
            style={{
              borderColor: "color-mix(in oklch, white 8%, transparent)",
            }}
          >
            <SpecItem
              label={tDetail("spec.phenotype")}
              value={talent.phenotype[locale]}
            />
            <SpecItem
              label={tDetail("spec.ageRange")}
              value={`${talent.ageRange} ${locale === "en" ? "yrs" : "años"}`}
            />
            <SpecItem
              label={tDetail("spec.archetype")}
              value={talent.archetype[locale]}
            />
            <SpecItem
              label={tDetail("spec.tone")}
              value={talent.toneCommercial[locale]}
            />
            <SpecItem
              label={tDetail("spec.market")}
              value={talent.market.join(" · ")}
            />
            <SpecItem
              label={tDetail("spec.status")}
              value={
                <span
                  className="inline-flex items-center gap-1.5"
                  style={{ color: statusColor(talent.status) }}
                >
                  ●{" "}
                  <span style={{ color: "white" }}>
                    {tDetail(`status.${talent.status === "in-campaign" ? "inCampaign" : talent.status}` as `status.${"available" | "inCampaign" | "reserved"}`)}
                  </span>
                </span>
              }
            />
          </dl>

          {/* Usos sugeridos */}
          <div>
            <p
              className="mb-3 font-mono text-[11px] uppercase tracking-[0.1em] text-white/40"
            >
              {tDetail("suggestedUses")}
            </p>
            <ul className="flex flex-wrap gap-2">
              {talent.suggestedUses.map((use, idx) => (
                <li
                  key={`${idx}-${use[locale]}`}
                  className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em]"
                  style={{
                    background: "var(--accent-soft)",
                    color: "var(--accent)",
                  }}
                >
                  {use[locale]}
                </li>
              ))}
            </ul>
          </div>

          {/* Botones */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handlePrimaryClick}
              disabled={isCapFull}
              className="inline-flex flex-1 items-center justify-center gap-2 px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-all"
              style={{
                background: inShortlist
                  ? "transparent"
                  : isCapFull
                  ? "color-mix(in oklch, white 6%, transparent)"
                  : "var(--accent)",
                color: inShortlist
                  ? "var(--accent)"
                  : isCapFull
                  ? "rgba(255,255,255,0.4)"
                  : "var(--accent-foreground)",
                border: `1px solid ${
                  isCapFull
                    ? "color-mix(in oklch, white 12%, transparent)"
                    : "var(--accent)"
                }`,
                cursor: isCapFull ? "not-allowed" : "pointer",
                opacity: isCapFull ? 0.5 : 1,
              }}
            >
              {inShortlist ? (
                <>
                  <Check className="h-4 w-4" strokeWidth={2.5} />
                  {tDetail("actions.alreadyIn")}
                </>
              ) : isCapFull ? (
                tDetail("actions.full")
              ) : (
                <>
                  <Plus className="h-4 w-4" strokeWidth={2} />
                  {tDetail("actions.add")}
                </>
              )}
            </button>

            <Link
              href={catalogHref}
              className="inline-flex items-center justify-center px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.12em] text-white/55 transition-colors hover:text-white"
              style={{
                border: "1px solid color-mix(in oklch, white 12%, transparent)",
              }}
            >
              {tDetail("actions.back")}
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────── helpers internos ─────────────── */

interface SpecItemProps {
  label: string;
  value: React.ReactNode;
}

function SpecItem({ label, value }: SpecItemProps) {
  return (
    <div>
      <dt className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-white/40">
        {label}
      </dt>
      <dd
        className="text-base text-white"
        style={{ fontFamily: "var(--font-heading)", fontWeight: 400 }}
      >
        {value}
      </dd>
    </div>
  );
}

function statusColor(status: Talent["status"]): string {
  switch (status) {
    case "available":
      return "var(--talent-success, #7fa67c)";
    case "in-campaign":
      return "var(--accent)";
    case "reserved":
      return "var(--talent-danger, #c97164)";
    default:
      return "white";
  }
}

function renderNameWithItalic(name: string) {
  const trimmed = name.trim();
  const i = trimmed.lastIndexOf(" ");
  if (i === -1) return name;
  const body = trimmed.slice(0, i);
  const last = trimmed.slice(i + 1);
  return (
    <>
      {body}{" "}
      <em
        style={{
          fontStyle: "italic",
          fontWeight: 400,
          color: "var(--accent)",
        }}
      >
        {last}
      </em>
    </>
  );
}
