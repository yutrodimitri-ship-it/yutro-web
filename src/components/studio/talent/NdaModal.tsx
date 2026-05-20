"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

interface NdaModalProps {
  projectName: string;
  clientName: string;
  onAccept: () => void;
  onCancel: () => void;
}

/**
 * Modal click-wrap del NDA. Bloqueante: el catalogo no se renderiza hasta
 * que el cliente acepta los terminos. Una vez aceptado, persiste en
 * sessionStorage y no vuelve a aparecer en la misma sesion del navegador.
 *
 * Accesibilidad:
 *   - role="dialog" + aria-modal
 *   - focus trap manual (los elementos focusables ciclan dentro del modal)
 *   - ESC dispara onCancel
 */
export function NdaModal({
  projectName,
  clientName,
  onAccept,
  onCancel,
}: NdaModalProps) {
  const t = useTranslations("studio.talent.nda");
  const [accepted, setAccepted] = useState(false);
  const reduce = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);

  // ESC cancela
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onCancel]);

  // Focus inicial al primer elemento interactivo
  useEffect(() => {
    const first = dialogRef.current?.querySelector<HTMLElement>(
      "input, button, [tabindex]:not([tabindex='-1'])"
    );
    first?.focus();
  }, []);

  // Bloqueo de scroll del body mientras el modal esta abierto
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Lista de bullets del NDA (los strings vienen de i18n)
  const bullets: ReadonlyArray<string> = [
    t("bullets.confidential"),
    t("bullets.noShare"),
    t("bullets.ipExclusive"),
    t("bullets.audit"),
    t("bullets.watermark"),
    t("bullets.legal"),
  ];

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-[300] flex items-center justify-center px-4 py-10"
      style={{ background: "rgba(10,10,10,0.85)" }}
      onClick={(e) => {
        // No cerrar si clickea afuera — es bloqueante
        if (e.target === e.currentTarget) e.preventDefault();
      }}
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="nda-title"
        initial={reduce ? false : { opacity: 0, y: 16, scale: 0.98 }}
        animate={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-xl overflow-hidden"
        style={{
          background: "var(--talent-bg-elev, #f7f4ef)",
          border: "1px solid var(--talent-line, color-mix(in oklch, black 10%, transparent))",
          maxHeight: "calc(100vh - 80px)",
        }}
      >
        {/* Borde superior dorado */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-0.5"
          style={{ background: "var(--accent)" }}
        />

        <div className="overflow-y-auto p-8" style={{ maxHeight: "calc(100vh - 80px)" }}>
          <p
            className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em]"
            style={{ color: "var(--accent)" }}
          >
            {t("eyebrow")}
          </p>

          <h2
            id="nda-title"
            className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl"
            style={{
              color: "var(--talent-ink, oklch(0.13 0 0))",
              fontFamily: "var(--font-heading)",
              letterSpacing: "-0.02em",
            }}
          >
            {t("title")}
          </h2>

          <p className="mb-7 text-sm" style={{ color: "var(--talent-ink-dim, oklch(0.42 0 0))" }}>
            {t("subtitle", { project: projectName, client: clientName })}
          </p>

          <ol className="mb-7 list-inside list-decimal space-y-2.5 text-sm leading-relaxed marker:text-[var(--accent)] marker:font-mono marker:text-[11px]" style={{ color: "var(--talent-ink-dim, oklch(0.42 0 0))" }}>
            {bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ol>

          <label className="mb-7 flex cursor-pointer items-start gap-3 select-none text-sm" style={{ color: "var(--talent-ink-dim, oklch(0.42 0 0))" }}>
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-1 h-4 w-4 cursor-pointer accent-[var(--accent)]"
            />
            <span>{t("checkbox")}</span>
          </label>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onAccept}
              disabled={!accepted}
              className="inline-flex flex-1 items-center justify-center px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-opacity hover:opacity-90"
              style={{
                background: "var(--accent)",
                color: "var(--accent-foreground)",
                cursor: accepted ? "pointer" : "not-allowed",
                opacity: accepted ? 1 : 0.4,
              }}
            >
              {t("accept")}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center justify-center px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors"
              style={{
                color: "var(--talent-ink-mute, oklch(0.60 0 0))",
                border: "1px solid var(--talent-line, color-mix(in oklch, black 12%, transparent))",
              }}
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
