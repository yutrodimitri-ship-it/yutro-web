"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X } from "lucide-react";

interface ConfirmSubmitModalProps {
  open: boolean;
  selectedCount: number;
  exclusiveCount: number;
  projectName: string;
  rightsDuration: string;
  onConfirm: () => void;
  onCancel: () => void;
  /** Labels i18n. */
  labels: {
    title: string;
    body: string;
    summarySelected: string;
    summaryExclusive: string;
    summaryDuration: string;
    summaryProject: string;
    cancel: string;
    confirm: string;
    irreversible: string;
  };
}

/**
 * Modal de confirmacion previo al submit del casting.
 *
 * Muestra resumen visible (talents, exclusivos, proyecto, duracion) +
 * mensaje de irreversibilidad. Cumple el bar de "double-confirm" para
 * acciones de alto valor economico.
 */
export function ConfirmSubmitModal({
  open,
  selectedCount,
  exclusiveCount,
  projectName,
  rightsDuration,
  onConfirm,
  onCancel,
  labels,
}: ConfirmSubmitModalProps) {
  // Esc cierra
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md border border-white/[0.08] bg-[#131313] p-7"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              onClick={onCancel}
              aria-label={labels.cancel}
              className="absolute right-4 top-4 text-white/40 transition-colors hover:text-white"
            >
              <X className="h-4 w-4" strokeWidth={1.75} />
            </button>

            <div
              className="mb-5 inline-flex h-10 w-10 items-center justify-center"
              style={{
                background: "var(--accent-soft)",
                color: "var(--accent)",
              }}
            >
              <AlertCircle className="h-5 w-5" strokeWidth={1.75} />
            </div>

            <h2
              className="mb-2 text-2xl text-white"
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 500,
                letterSpacing: "-0.01em",
              }}
            >
              {labels.title}
            </h2>
            <p className="mb-6 text-[14px] leading-relaxed text-white/55">
              {labels.body}
            </p>

            <div
              className="mb-5 space-y-2 px-4 py-4"
              style={{ background: "#0a0a0a" }}
            >
              <SummaryRow
                label={labels.summaryProject}
                value={projectName}
              />
              <SummaryRow
                label={labels.summarySelected}
                value={String(selectedCount)}
              />
              <SummaryRow
                label={labels.summaryExclusive}
                value={String(exclusiveCount)}
              />
              <SummaryRow
                label={labels.summaryDuration}
                value={rightsDuration}
              />
            </div>

            <p
              className="mb-6 px-3 py-2 text-[11px] leading-relaxed text-white/55"
              style={{
                background: "color-mix(in oklch, var(--accent) 6%, transparent)",
                borderLeft: "2px solid var(--accent)",
              }}
            >
              {labels.irreversible}
            </p>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onCancel}
                className="px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.12em] text-white/55 transition-colors hover:text-white"
                style={{
                  border: "1px solid color-mix(in oklch, white 12%, transparent)",
                }}
              >
                {labels.cancel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-opacity hover:opacity-90"
                style={{
                  background: "var(--accent)",
                  color: "var(--accent-foreground)",
                }}
              >
                {labels.confirm}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-[13px] text-white/55">
      <span>{label}</span>
      <strong className="font-normal text-white">{value}</strong>
    </div>
  );
}
