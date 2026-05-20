"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Check, Home, Layers, Loader2 } from "lucide-react";
import { useCasting } from "@/lib/talent/casting-context";
import { useToast } from "./Toast";
import { ConfirmSubmitModal } from "./ConfirmSubmitModal";
import type { Locale, ProjectConfig } from "@/types/talent";

type SubmitState = "idle" | "submitting" | "submitted" | "error";

interface LicenseTermsProps {
  project: ProjectConfig;
  locale: Locale;
  /** Href del hub general (post-submit nav). Default: /{locale}/studio */
  backHref?: string;
  /** Href del catalogo del proyecto (post-submit nav). */
  catalogHref?: string;
}

/**
 * Panel "Terminos de licencia" — sticky en desktop.
 *
 * 100% read-only: market, duration, exclusivityMode vienen del PROJECT_CONFIG
 * y no son editables por el cliente. El boton submit dispara un toast con
 * el resumen — Fase 2 lo conecta a un endpoint real.
 */
export function LicenseTerms({
  project,
  locale,
  backHref,
  catalogHref,
}: LicenseTermsProps) {
  const tCasting = useTranslations("studio.talent.casting");
  const tCommon = useTranslations("studio.talent.common");
  const { state, limits } = useCasting();
  const toast = useToast();
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Hidrata estado submitted desde sessionStorage para sobrevivir reload.
  // Key: casting:submitted:${slug}
  const submittedKey = `casting:submitted:${project.slug}`;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const flag = window.sessionStorage.getItem(submittedKey);
    if (flag === "true") setSubmitState("submitted");
  }, [submittedKey]);

  const exclusivityValue = exclusivityModeLabel(project, locale, tCasting);
  const helpText = exclusivityHelpText(project, locale, tCasting);

  const selectedCount = state.shortlist.length;
  const exclusiveCount = state.exclusives.size;

  function handleClickSubmit() {
    if (selectedCount === 0) {
      toast.show(tCasting("toast.needAtLeastOne"));
      return;
    }
    if (submitState === "submitting" || submitState === "submitted") return;
    setConfirmOpen(true);
  }

  async function actuallySubmit() {
    setConfirmOpen(false);
    setSubmitState("submitting");
    try {
      const res = await fetch("/api/studio/talent/castings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectSlug: project.slug,
          shortlist: state.shortlist,
          exclusives: Array.from(state.exclusives),
        }),
      });
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(err.error ?? `HTTP ${res.status}`);
      }
      setSubmitState("submitted");
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(submittedKey, "true");
      }
      toast.show(
        tCasting("toast.submitSuccess", {
          selected: selectedCount,
          exclusive: exclusiveCount,
        })
      );
    } catch (err) {
      console.error("[casting:submit]", err);
      setSubmitState("error");
      toast.show(tCasting("toast.submitError"));
    }
  }

  const buttonLabel =
    submitState === "submitting"
      ? tCasting("actions.submitting")
      : submitState === "submitted"
        ? tCasting("submitted.title")
        : tCasting("actions.submit");
  const buttonDisabled =
    submitState === "submitting" || submitState === "submitted";

  const resolvedBackHref = backHref ?? `/${locale}/studio`;
  const resolvedCatalogHref =
    catalogHref ?? `/${locale}/studio/talent/${project.slug}/catalog`;

  return (
    <aside
      className="self-start p-8 lg:sticky lg:top-12"
      style={{
        background: "var(--talent-bg-elev)",
        border: "1px solid var(--talent-line)",
      }}
    >
      <h2
        className="mb-2"
        style={{
          color: "var(--talent-ink)",
          fontFamily: "var(--font-heading)",
          fontWeight: 800,
          fontSize: "clamp(20px, 2.5vw, 28px)",
          letterSpacing: "-0.025em",
          lineHeight: 1.05,
        }}
      >
        {renderTitleItalic(tCasting("license.title"))}
      </h2>

      {/* Tag "Configurado por Yutro Estudio" con dot dorado */}
      <span
        className="mb-7 inline-flex items-center gap-2 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.1em]"
        style={{
          color: "var(--talent-ink-mute)",
          border: "1px solid var(--talent-line)",
          background: "var(--talent-bg-elev-2)",
        }}
      >
        <span
          aria-hidden
          className="block h-1.5 w-1.5 rounded-full"
          style={{ background: "var(--accent)" }}
        />
        {tCasting("license.configuredBy")}
      </span>

      {/* Grid 2 cols: market + duration */}
      <div className="mb-5 grid gap-5 sm:grid-cols-2">
        <ReadOnlyField
          label={tCasting("license.market")}
          value={project.market}
        />
        <ReadOnlyField
          label={tCasting("license.duration")}
          value={formatRightsDuration(project.rightsDurationMonths, locale)}
        />
      </div>

      {/* Exclusividad */}
      <div className="mb-5">
        <ReadOnlyField
          label={tCasting("license.exclusivity")}
          value={exclusivityValue}
        />
      </div>

      {/* Help contextual con borde-l accent */}
      <div
        className="mb-7 flex gap-2.5 px-4 py-3 text-[11px] leading-relaxed"
        style={{
          color: "var(--talent-ink-dim)",
          background: "var(--talent-bg-elev-2)",
          borderLeft: "2px solid var(--accent)",
        }}
      >
        <span
          aria-hidden
          className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full"
          style={{ background: "var(--accent)" }}
        />
        <span>{helpText}</span>
      </div>

      {/* Resumen */}
      <div
        className="mb-7 space-y-2 px-4 py-4"
        style={{ background: "var(--talent-bg-elev-2)" }}
      >
        <SummaryRow
          label={tCasting("summary.selected")}
          value={`${selectedCount} / ${limits.maxTalents}`}
        />
        <SummaryRow
          label={tCasting("summary.exclusive")}
          value={`${exclusiveCount} / ${limits.maxExclusive}`}
        />
      </div>

      {/* Submit */}
      <button
        type="button"
        onClick={handleClickSubmit}
        disabled={buttonDisabled}
        className="flex w-full items-center justify-center gap-2 px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-90"
        style={{
          background:
            submitState === "submitted" ? "#0d2a1a" : "var(--accent)",
          color:
            submitState === "submitted"
              ? "#7dd3a3"
              : "var(--accent-foreground)",
          border:
            submitState === "submitted"
              ? "1px solid #1e5a3a"
              : "none",
        }}
      >
        {submitState === "submitting" && (
          <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2} />
        )}
        {submitState === "submitted" && (
          <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
        )}
        {buttonLabel}
      </button>

      {submitState === "submitted" && (
        <>
          <p className="mt-3 text-[12px] leading-relaxed" style={{ color: "var(--talent-ink-dim)" }}>
            {tCasting("submitted.body")}
          </p>
          {/* Post-submit nav: cliente puede volver al hub o al catalogo */}
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Link
              href={resolvedCatalogHref}
              className="inline-flex flex-1 items-center justify-center gap-2 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors"
              style={{
                color: "var(--talent-ink-dim)",
                border: "1px solid var(--talent-line)",
              }}
            >
              <Layers className="h-3.5 w-3.5" strokeWidth={1.75} />
              {tCommon("backToCatalog")}
            </Link>
            <Link
              href={resolvedBackHref}
              className="inline-flex flex-1 items-center justify-center gap-2 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors"
              style={{
                color: "var(--talent-ink-dim)",
                border: "1px solid var(--talent-line)",
              }}
            >
              <Home className="h-3.5 w-3.5" strokeWidth={1.75} />
              {tCommon("backToHub")}
            </Link>
          </div>
        </>
      )}

      <ConfirmSubmitModal
        open={confirmOpen}
        selectedCount={selectedCount}
        exclusiveCount={exclusiveCount}
        projectName={project.name}
        rightsDuration={formatRightsDuration(project.rightsDurationMonths, locale)}
        onConfirm={actuallySubmit}
        onCancel={() => setConfirmOpen(false)}
        labels={{
          title: tCasting("confirm.title"),
          body: tCasting("confirm.body"),
          summarySelected: tCasting("confirm.summarySelected"),
          summaryExclusive: tCasting("confirm.summaryExclusive"),
          summaryDuration: tCasting("confirm.summaryDuration"),
          summaryProject: tCasting("confirm.summaryProject"),
          cancel: tCasting("confirm.cancel"),
          confirm: tCasting("confirm.confirm"),
          irreversible: tCasting("confirm.irreversible"),
        }}
      />
    </aside>
  );
}

/* ──────────────── helpers ──────────────── */

interface ReadOnlyFieldProps {
  label: string;
  value: string;
}

function ReadOnlyField({ label, value }: ReadOnlyFieldProps) {
  return (
    <div>
      <p className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.1em]" style={{ color: "var(--talent-ink-mute)" }}>
        {label}
      </p>
      <div
        className="py-2 text-[15px]"
        style={{
          color: "var(--talent-ink)",
          borderBottom: "1px solid var(--talent-line)",
        }}
      >
        {value}
      </div>
    </div>
  );
}

interface SummaryRowProps {
  label: string;
  value: string;
}

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between text-[13px]" style={{ color: "var(--talent-ink-dim)" }}>
      <span>{label}</span>
      <strong className="font-normal" style={{ color: "var(--talent-ink)" }}>{value}</strong>
    </div>
  );
}

function exclusivityModeLabel(
  project: ProjectConfig,
  locale: Locale,
  // useTranslations type — castea a callable
  t: ReturnType<typeof useTranslations>
): string {
  void locale;
  const fn = t as unknown as (key: string, vars?: Record<string, string>) => string;
  return fn("license.modes.category", { category: project.categoryEs });
}

function exclusivityHelpText(
  project: ProjectConfig,
  locale: Locale,
  t: ReturnType<typeof useTranslations>
): string {
  void locale;
  const fn = t as unknown as (key: string, vars?: Record<string, string>) => string;
  return fn("license.helpCategory", { category: project.categoryEs });
}

function formatRightsDuration(months: number, locale: Locale): string {
  return locale === "en" ? `${months} months` : `${months} meses`;
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
          color: "var(--accent)",
        }}
      >
        {trimmed.slice(i + 1)}
      </em>
    </>
  );
}
