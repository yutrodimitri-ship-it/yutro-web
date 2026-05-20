"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCasting } from "@/lib/talent/casting-context";
import { useTalentSession } from "@/lib/talent/talent-session-context";
import { logAuditEvent } from "@/lib/talent/audit-log";
import { useToast } from "./Toast";
import { SelectedItem } from "./SelectedItem";
import { LicenseTerms } from "./LicenseTerms";
import { EmptyState } from "./EmptyState";
import type { Locale, ProjectConfig, Talent } from "@/types/talent";

interface CastingPageClientProps {
  project: ProjectConfig;
  locale: Locale;
  /**
   * Catalogo del proyecto serializado desde el server component. El client lo
   * usa para resolver `code → Talent` al renderizar el shortlist guardado en
   * sessionStorage.
   */
  catalog: Talent[];
}

/**
 * Client wrapper que:
 *   - Lee shortlist + exclusives del CastingContext
 *   - Resuelve cada code → Talent completo
 *   - Renderiza header + (lista | empty state) + panel terms
 */
export function CastingPageClient({ project, locale, catalog }: CastingPageClientProps) {
  const tCasting = useTranslations("studio.talent.casting");
  const tCommon = useTranslations("studio.talent.common");
  const reduce = useReducedMotion();
  const {
    state,
    limits,
    isExclusive,
    isExclusiveFull,
    remove,
    toggleExclusive,
  } = useCasting();
  const session = useTalentSession();
  const toast = useToast();
  const catalogHref = `/${locale}/studio/talent/${project.slug}/catalog`;

  // Mapea codes a talents completos preservando el orden de seleccion
  const selectedTalents = useMemo(
    () =>
      state.shortlist
        .map((code) => catalog.find((t) => t.code === code))
        .filter((t): t is NonNullable<typeof t> => Boolean(t)),
    [state.shortlist, catalog]
  );

  function handleToggleExclusive(code: string) {
    const wasExclusive = isExclusive(code);
    const ok = toggleExclusive(code);
    if (!ok) {
      toast.show(
        tCasting("toast.exclusiveFull", { max: limits.maxExclusive })
      );
      return;
    }
    logAuditEvent("exclusive_toggled", session, {
      talentCode: code,
      isExclusive: !wasExclusive,
    });
  }

  function handleRemove(code: string) {
    remove(code);
    logAuditEvent("talent_removed", session, {
      talentCode: code,
      source: "casting",
    });
  }

  const containerVariants = reduce
    ? undefined
    : {
        hidden: {},
        show: {
          transition: { staggerChildren: 0.05 },
        },
      };

  return (
    <div>
      {/* ── sl-head ── */}
      <div
        className="grid items-end gap-6 border-b pb-5"
        style={{
          gridTemplateColumns: "1fr auto",
          borderColor: "var(--talent-ink)",
        }}
      >
        <div>
          <span
            className="font-mono text-[11px] uppercase tracking-[0.18em]"
            style={{ color: "var(--accent)" }}
          >
            {tCasting("subtitle")}
          </span>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 800,
              margin: 0,
              fontSize: "clamp(48px, 7vw, 96px)",
              lineHeight: 0.92,
              letterSpacing: "-0.035em",
              color: "var(--talent-ink)",
            }}
          >
            {renderTitleItalic(tCasting("title"))}
          </h1>
        </div>
        <div
          className="text-right font-mono text-[11px] uppercase tracking-[0.18em] shrink-0"
          style={{ color: "var(--talent-ink-mute)" }}
        >
          {locale === "es" ? "Selección" : "Talents"}
          <strong
            className="block"
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 800,
              fontSize: "clamp(36px, 5vw, 56px)",
              lineHeight: 1,
              color: "var(--talent-ink)",
              letterSpacing: "-0.03em",
            }}
          >
            {String(state.shortlist.length).padStart(2, "0")}
          </strong>
        </div>
      </div>

      {/* Volver al catálogo */}
      <div className="pt-5 pb-2">
        <Link
          href={catalogHref}
          className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors"
          style={{ color: "var(--talent-ink-mute)" }}
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
          {tCommon("backToCatalog")}
        </Link>
      </div>

      {/* ── sl-body — list + side panel ── */}
      <div className="flex flex-col gap-10 pt-6 lg:grid lg:gap-12" style={{ gridTemplateColumns: "minmax(0,1fr) 340px" }}>
        {/* Lista — orden 2 en mobile, 1 en desktop */}
        <div className="order-2 min-w-0 lg:order-1">
          {selectedTalents.length === 0 ? (
            <EmptyState
              title={tCasting("empty.title")}
              description={tCasting("empty.description")}
              ctaLabel={tCasting("empty.cta")}
              ctaHref={`/${locale}/studio/talent/${project.slug}/catalog`}
            />
          ) : (
            <motion.ul
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="flex flex-col gap-1"
            >
              {selectedTalents.map((talent) => {
                const exclusive = isExclusive(talent.code);
                const disabled = isExclusiveFull && !exclusive;
                return (
                  <SelectedItem
                    key={talent.code}
                    talent={talent}
                    locale={locale}
                    isExclusive={exclusive}
                    isExclusiveDisabled={disabled}
                    onToggleExclusive={() => handleToggleExclusive(talent.code)}
                    onRemove={() => handleRemove(talent.code)}
                  />
                );
              })}
            </motion.ul>
          )}
        </div>

        {/* Panel terms — orden 1 en mobile (arriba del CTA), 2 en desktop */}
        <div className="order-1 lg:order-2">
          <LicenseTerms
            project={project}
            locale={locale}
            backHref={`/${locale}/studio`}
            catalogHref={catalogHref}
          />
        </div>
      </div>
    </div>
  );
}

function renderTitleItalic(title: string) {
  const trimmed = title.trim();
  const i = trimmed.lastIndexOf(" ");
  if (i === -1) return title;
  return (
    <>
      {trimmed.slice(0, i)}{" "}
      <em
        style={{
          fontStyle: "italic",
          fontWeight: 400,
          color: "var(--accent)",
        }}
      >
        {trimmed.slice(i + 1)}
      </em>
    </>
  );
}
