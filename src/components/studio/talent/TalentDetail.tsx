"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowLeft, Plus, Check } from "lucide-react";
import { TalentImage } from "./TalentImage";
import { WatermarkOverlay } from "./WatermarkOverlay";
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
  adjacentTalents?: Talent[];
}

export function TalentDetail({
  talent,
  locale,
  projectSlug,
  clientName,
  watermarkDate,
  adjacentTalents = [],
}: TalentDetailProps) {
  const tDetail = useTranslations("studio.talent.detail");
  const tCatalog = useTranslations("studio.talent.catalog");
  const tCommon = useTranslations("studio.talent.common");
  const reduce = useReducedMotion();
  const { isInShortlist, isFull, add, remove, limits } = useCasting();
  const session = useTalentSession();
  const toast = useToast();

  const inShortlist = isInShortlist(talent.code);
  const isCapFull = isFull && !inShortlist;
  const catalogHref = `/${locale}/studio/talent/${projectSlug}/catalog`;
  const profileNum = talent.code.replace(/\D/g, "").padStart(3, "0");

  useEffect(() => {
    logAuditEvent("talent_viewed", session, { talentCode: talent.code });
  }, [session, talent.code]);

  function handlePrimaryClick() {
    if (inShortlist) {
      remove(talent.code);
      logAuditEvent("talent_removed", session, { talentCode: talent.code, source: "detail" });
      return;
    }
    if (isCapFull) {
      toast.show(tCatalog("toast.fullCapacity", { max: limits.maxTalents }));
      return;
    }
    if (add(talent.code)) {
      logAuditEvent("talent_added", session, { talentCode: talent.code, source: "detail" });
    }
  }

  const bioText = talent.bio?.[locale]?.trim() || talent.bio?.es?.trim() || talent.bio?.en?.trim() || "";

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="px-6 pb-10 pt-8 sm:px-10 sm:pt-10"
    >
      {/* ── Breadcrumb ── */}
      <div
        className="flex flex-wrap items-center gap-2.5 pb-5 font-mono text-[11px] uppercase tracking-[0.18em]"
        style={{ color: "var(--talent-ink-mute)" }}
      >
        <Link
          href={catalogHref}
          className="flex items-center gap-1.5"
          style={{ color: "var(--talent-ink)", borderBottom: "2px solid var(--accent)", paddingBottom: 2 }}
        >
          <ArrowLeft className="h-3 w-3" strokeWidth={1.75} />
          {tDetail("back")}
        </Link>
        <span>/</span>
        <span>{talent.category}</span>
        <span>/</span>
        <span style={{ color: "var(--talent-ink)" }}>{talent.code} · {talent.name[locale]}</span>
        <span className="hidden sm:block" style={{ marginLeft: "auto" }}>
          {locale === "es" ? "Perfil N°" : "Profile N°"}{profileNum}
        </span>
      </div>

      {/* ── DETAIL HEAD — 2-col editorial layout ── */}
      <section
        className="grid grid-cols-1 lg:grid-cols-2"
        style={{
          borderTop: "1px solid var(--talent-ink)",
          borderBottom: "1px solid var(--talent-ink)",
        }}
      >
        {/* Left — eyebrow + headline + handle + bio + CTAs */}
        <div
          className="flex flex-col justify-between gap-5 py-8 lg:pr-6 talent-detail-left"
          style={{ minHeight: 320 }}
        >
          <div>
            <span
              className="font-mono text-[12px] uppercase tracking-[0.18em]"
              style={{ color: "var(--accent)" }}
            >
              {locale === "es" ? "Perfil N°" : "Profile N°"}{profileNum}
            </span>
            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 800,
                fontSize: "clamp(40px, 5.5vw, 80px)",
                lineHeight: 0.88,
                letterSpacing: "-0.035em",
                margin: "8px 0 0",
                color: "var(--talent-ink)",
              }}
            >
              {renderItalicLast(talent.name[locale])}
            </h1>
            <div
              className="mt-3 font-mono text-[12px] uppercase tracking-[0.18em]"
              style={{ color: "var(--talent-ink-mute)" }}
            >
              {talent.code} · {talent.category} · {talent.ageRange}{" "}
              {locale === "en" ? "yrs" : "años"}
            </div>
          </div>

          <p
            className="text-base leading-relaxed"
            style={{ color: "var(--talent-ink-dim)", maxWidth: "44ch" }}
          >
            {talent.shortDesc[locale]}
          </p>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handlePrimaryClick}
              disabled={isCapFull}
              className="inline-flex items-center gap-2 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.12em] transition-all"
              style={{
                background: inShortlist
                  ? "transparent"
                  : isCapFull
                    ? "color-mix(in oklch, black 6%, transparent)"
                    : "var(--accent)",
                color: inShortlist
                  ? "var(--accent)"
                  : isCapFull
                    ? "rgba(0,0,0,0.35)"
                    : "var(--accent-foreground)",
                border: `1px solid ${
                  isCapFull
                    ? "color-mix(in oklch, black 12%, transparent)"
                    : "var(--accent)"
                }`,
                cursor: isCapFull ? "not-allowed" : "pointer",
                opacity: isCapFull ? 0.5 : 1,
              }}
            >
              {inShortlist ? (
                <Check className="h-4 w-4" strokeWidth={2.5} />
              ) : (
                <Plus className="h-4 w-4" strokeWidth={2} />
              )}
              {inShortlist
                ? tDetail("actions.alreadyIn")
                : isCapFull
                  ? tDetail("actions.full")
                  : tDetail("actions.add")}
            </button>
            <Link
              href={catalogHref}
              className="inline-flex items-center px-5 py-3 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors"
              style={{
                color: "var(--talent-ink-mute)",
                border: "1px solid color-mix(in oklch, black 12%, transparent)",
              }}
            >
              {tDetail("actions.back")}
            </Link>
          </div>
        </div>

        {/* Right — spec grid 2×3 */}
        <div className="py-8 lg:pl-6 talent-detail-right">
          <div className="grid grid-cols-2 gap-x-6 gap-y-0">
            <SpecDisplayItem
              label={tDetail("spec.archetype")}
              value={talent.archetype[locale]}
              sub={locale === "es" ? "Registro de estilo" : "Style register"}
            />
            <SpecDisplayItem
              label={tDetail("spec.ageRange")}
              value={talent.ageRange}
              sub={locale === "es" ? "Ajustable ±2 años" : "Tunable ±2 years"}
            />
            <SpecDisplayItem
              label={tDetail("spec.tone")}
              value={talent.toneCommercial[locale]}
              sub={locale === "es" ? "Perfil comercial" : "Commercial tone"}
            />
            <SpecDisplayItem
              label={tDetail("spec.market")}
              value={talent.market.join(" · ")}
              sub={locale === "es" ? "Territorios" : "Territories"}
            />
            <SpecDisplayItem
              label={tDetail("spec.status")}
              value={tDetail(
                `status.${
                  talent.status === "in-campaign" ? "inCampaign" : talent.status
                }` as `status.${"available" | "inCampaign" | "reserved"}`
              )}
              sub={locale === "es" ? "Disponibilidad actual" : "Current availability"}
              dotColor={statusColor(talent.status)}
            />
            <SpecDisplayItem
              label={tDetail("spec.origin")}
              value={talent.phenotype[locale]}
              sub={locale === "es" ? "Origen físico" : "Physical origin"}
            />
          </div>
        </div>
      </section>

      {/* ── GALLERY — profile (big left) + 4 thumbnails (2×2 right) ── */}

      {/* Mobile: 2-col flat grid */}
      <div className="grid grid-cols-2 gap-3 pt-6 lg:hidden">
        {(["profile", "charsheet", "studio-1", "studio-2"] as const).map((v, i) => (
          <div
            key={v}
            className="relative overflow-hidden"
            style={{ aspectRatio: "3/4", background: "var(--talent-bg-elev-2)" }}
          >
            <TalentImage talent={talent} variant={v} portraitVariant={i} />
            {v === "profile" ? (
              <WatermarkOverlay
                clientName={clientName}
                talentCode={talent.code}
                date={watermarkDate}
                confidential
                confidentialLabel={tCommon("confidential").toUpperCase()}
              />
            ) : (
              <WatermarkOverlay clientName={clientName} talentCode={talent.code} date={watermarkDate} />
            )}
          </div>
        ))}
      </div>

      {/* Desktop: profile (3:4) + charsheet alto (9:16) + 2 editoriales apiladas */}
      <div
        className="hidden pt-6 lg:grid gap-3.5"
        style={{ gridTemplateColumns: "2fr 1.2fr 1fr" }}
      >
        {/* Profile portrait — ocupa 2 filas */}
        <div
          className="row-span-2 relative overflow-hidden"
          style={{ aspectRatio: "3/4", background: "var(--talent-bg-elev-2)" }}
        >
          <TalentImage talent={talent} variant="profile" className="h-full w-full" />
          <WatermarkOverlay
            clientName={clientName}
            talentCode={talent.code}
            date={watermarkDate}
            confidential
            confidentialLabel={tCommon("confidential").toUpperCase()}
          />
        </div>
        {/* Charsheet full body — su aspect ratio nativo 9:16, columna alta */}
        <div
          className="row-span-2 relative overflow-hidden"
          style={{ background: "var(--talent-bg-elev-2)" }}
        >
          <TalentImage talent={talent} variant="charsheet" className="h-full w-full" />
          <WatermarkOverlay clientName={clientName} talentCode={talent.code} date={watermarkDate} />
        </div>
        {/* Primeras 2 imágenes editoriales apiladas en la 3ra columna */}
        {[0, 1].map((idx) => (
          <div
            key={idx}
            className="relative overflow-hidden"
            style={{ aspectRatio: "3/4", background: "var(--talent-bg-elev-2)" }}
          >
            <TalentImage
              talent={talent}
              variant={`gallery-${idx}` as const}
              portraitVariant={idx + 2}
            />
            <WatermarkOverlay clientName={clientName} talentCode={talent.code} date={watermarkDate} />
          </div>
        ))}
      </div>

      {/* Desktop: editorial completa + bio inline ocupando los huecos sobrantes de la última fila */}
      {(() => {
        const total = talent.galleryKeys?.length ?? 0;
        const restantes = Array.from({ length: Math.max(0, total - 2) }, (_, i) => i + 2);
        if (restantes.length === 0) return null;
        const COLS = 4;
        const sobran = restantes.length % COLS;
        const bioSpan = sobran === 0 ? COLS : COLS - sobran;
        return (
          <div className="hidden pt-3.5 lg:grid gap-3.5 grid-cols-4">
            {restantes.map((idx, i) => (
              <div
                key={idx}
                className="relative overflow-hidden"
                style={{ aspectRatio: "3/4", background: "var(--talent-bg-elev-2)" }}
              >
                <TalentImage
                  talent={talent}
                  variant={`gallery-${idx}` as const}
                  portraitVariant={i + 4}
                />
                <WatermarkOverlay clientName={clientName} talentCode={talent.code} date={watermarkDate} />
              </div>
            ))}
            {/* Bio inline al lado de la última imagen */}
            <div
              className="flex flex-col justify-center px-2"
              style={{ gridColumn: `span ${bioSpan}` }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 800,
                  fontSize: "clamp(20px, 2vw, 28px)",
                  lineHeight: 1,
                  letterSpacing: "-0.03em",
                  margin: 0,
                  color: "var(--talent-ink)",
                }}
              >
                {locale === "es" ? (
                  <>
                    Su <em style={{ color: "var(--accent)", fontStyle: "italic" }}>bio.</em>
                  </>
                ) : (
                  <>
                    Their <em style={{ color: "var(--accent)", fontStyle: "italic" }}>bio.</em>
                  </>
                )}
              </h2>
              {bioText ? (
                <div
                  className="mt-4 leading-relaxed"
                  style={{
                    fontSize: "clamp(13px, 1vw, 15px)",
                    color: "var(--talent-ink)",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {bioText}
                </div>
              ) : (
                <p
                  className="mt-4 italic"
                  style={{
                    fontSize: 14,
                    color: "var(--talent-ink-mute)",
                  }}
                >
                  {locale === "es"
                    ? "Bio en preparación. Próximamente."
                    : "Bio in preparation. Coming soon."}
                </p>
              )}
            </div>
          </div>
        );
      })()}

      {/* ── SUGGESTED USES ── */}
      {talent.suggestedUses.length > 0 && (
        <div
          className="border-t pt-6 mt-6"
          style={{ borderColor: "var(--talent-line)" }}
        >
          <p
            className="mb-3 font-mono text-[11px] uppercase tracking-[0.1em]"
            style={{ color: "var(--talent-ink-mute)" }}
          >
            {tDetail("suggestedUses")}
          </p>
          <ul className="flex flex-wrap gap-2">
            {talent.suggestedUses.map((use, idx) => (
              <li
                key={`${idx}-${use[locale]}`}
                className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em]"
                style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
              >
                {use[locale]}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── ADJACENT TALENTS ── */}
      {adjacentTalents.length > 0 && (
        <section
          className="grid grid-cols-1 gap-8 border-t pt-9 mt-9 lg:grid-cols-[280px_1fr]"
          style={{ borderColor: "var(--talent-line)" }}
        >
          <div>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 800,
                fontSize: "clamp(24px, 3vw, 36px)",
                lineHeight: 1,
                letterSpacing: "-0.03em",
                margin: 0,
                color: "var(--talent-ink)",
              }}
            >
              {locale === "es" ? (
                <>
                  Talentos{" "}
                  <em style={{ color: "var(--accent)", fontStyle: "italic" }}>similares.</em>
                </>
              ) : (
                <>
                  Adjacent{" "}
                  <em style={{ color: "var(--accent)", fontStyle: "italic" }}>talents.</em>
                </>
              )}
            </h2>
            <p
              className="mt-3 text-sm leading-relaxed"
              style={{ color: "var(--talent-ink-dim)", maxWidth: "32ch" }}
            >
              {locale === "es"
                ? `Si estás evaluando a ${talent.name[locale].split(" ")[0]}, estos perfiles también suelen considerarse:`
                : `If you're casting ${talent.name[locale].split(" ")[0]}, the room often considers:`}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3.5">
            {adjacentTalents.map((adj) => (
              <Link
                key={adj.code}
                href={`/${locale}/studio/talent/${projectSlug}/talent/${adj.code}`}
                className="group block"
              >
                <div
                  className="relative overflow-hidden"
                  style={{ aspectRatio: "4/5", background: "var(--talent-bg-elev-2)" }}
                >
                  <TalentImage talent={adj} variant="profile" />
                </div>
                <div
                  className="grid items-baseline gap-2 pt-2.5"
                  style={{ gridTemplateColumns: "1fr auto" }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontWeight: 800,
                        fontSize: 16,
                        letterSpacing: "-0.02em",
                        lineHeight: 1.1,
                        color: "var(--talent-ink)",
                      }}
                    >
                      {adj.name[locale]}
                    </div>
                    <div
                      className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em]"
                      style={{ color: "var(--talent-ink-mute)" }}
                    >
                      {adj.code} · {adj.category}
                    </div>
                  </div>
                  <span
                    className="font-mono text-[12px]"
                    style={{ color: "var(--talent-ink-mute)" }}
                  >
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </motion.div>
  );
}

/* ── helpers ── */

function SpecDisplayItem({
  label,
  value,
  sub,
  dotColor,
}: {
  label: string;
  value: string;
  sub?: string;
  dotColor?: string;
}) {
  return (
    <div
      className="pt-2.5"
      style={{ borderTop: "1px solid var(--talent-line)" }}
    >
      <span
        className="block mb-1 font-mono text-[10px] uppercase tracking-[0.16em]"
        style={{ color: "var(--talent-ink-mute)" }}
      >
        {label}
      </span>
      <div
        style={{
          fontFamily: "var(--font-heading)",
          fontWeight: 800,
          fontSize: "clamp(15px, 1.8vw, 22px)",
          lineHeight: 1.05,
          letterSpacing: "-0.025em",
          color: "var(--talent-ink)",
        }}
      >
        {dotColor && (
          <span className="inline-block mr-1.5" style={{ color: dotColor }}>
            ●
          </span>
        )}
        {value}
      </div>
      {sub && (
        <div
          className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em]"
          style={{ color: "var(--talent-ink-mute)" }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}

function statusColor(status: Talent["status"]): string {
  switch (status) {
    case "available":   return "var(--talent-success, #7fa67c)";
    case "in-campaign": return "var(--accent)";
    case "reserved":    return "var(--talent-danger, #c97164)";
    default:            return "var(--talent-ink)";
  }
}

function renderItalicLast(name: string) {
  const trimmed = name.trim();
  const i = trimmed.lastIndexOf(" ");
  if (i === -1) return name;
  return (
    <>
      {trimmed.slice(0, i)}{" "}
      <em style={{ fontStyle: "italic", fontWeight: 800, color: "var(--accent)" }}>
        {trimmed.slice(i + 1)}
      </em>
    </>
  );
}
