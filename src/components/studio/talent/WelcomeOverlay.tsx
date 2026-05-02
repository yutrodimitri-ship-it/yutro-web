"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { Locale, ProjectConfig } from "@/types/talent";

interface WelcomeOverlayProps {
  project: ProjectConfig;
  locale: Locale;
  onDismiss: () => void;
}

const AUTO_DISMISS_MS = 3500;

/**
 * Splash de bienvenida del proyecto. Cubre la pantalla completa con un fade
 * de entrada elegante, muestra el cliente + nombre del proyecto + meta
 * (categoria/duracion), y se auto-oculta a los 3.5s. Tambien hay un boton
 * "continuar" para skip inmediato.
 */
export function WelcomeOverlay({
  project,
  locale,
  onDismiss,
}: WelcomeOverlayProps) {
  const t = useTranslations("studio.talent.welcome");
  const reduce = useReducedMotion();
  const dismissedRef = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (dismissedRef.current) return;
      dismissedRef.current = true;
      onDismiss();
    }, AUTO_DISMISS_MS);
    return () => window.clearTimeout(timer);
  }, [onDismiss]);

  function handleSkip() {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    onDismiss();
  }

  // Linea meta — depende del modo de exclusividad
  const exclusivityLine =
    project.exclusivityMode === "category" && project.exclusivityCategory
      ? project.exclusivityCategory[locale]
      : project.exclusivityMode === "total"
      ? t("totalExclusive")
      : t("noExclusive");

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={t("ariaLabel")}
      initial={reduce ? false : { opacity: 0 }}
      animate={reduce ? undefined : { opacity: 1 }}
      exit={reduce ? undefined : { opacity: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[250] flex items-center justify-center px-6"
      style={{ background: "#0a0a0a" }}
    >
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 20 }}
        animate={reduce ? undefined : { opacity: 1, y: 0 }}
        transition={{
          duration: 0.7,
          ease: [0.16, 1, 0.3, 1],
          delay: 0.15,
        }}
        className="max-w-xl text-center"
      >
        <p
          className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em]"
          style={{ color: "var(--accent)" }}
        >
          {t("eyebrow", { client: project.client })}
        </p>

        <h1
          className="mb-3 text-4xl tracking-tight text-white sm:text-5xl lg:text-6xl"
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 300,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
          }}
        >
          {renderItalicLast(project.name)}
        </h1>

        <p className="mb-8 text-sm text-white/55 sm:text-base">
          {t("subtitle")}
        </p>

        <p className="mb-10 font-mono text-[11px] uppercase tracking-[0.12em] text-white/40">
          {t("metaTalent")} ·{" "}
          <span style={{ color: "var(--accent)" }}>
            {project.rightsDuration[locale]}
          </span>{" "}
          ·{" "}
          <span style={{ color: "var(--accent)" }}>{exclusivityLine}</span>
        </p>

        <button
          type="button"
          onClick={handleSkip}
          className="inline-flex items-center gap-2 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-white/55 transition-colors hover:text-white"
          style={{
            border: "1px solid color-mix(in oklch, white 12%, transparent)",
          }}
        >
          {t("continue")}
        </button>
      </motion.div>
    </motion.div>
  );
}

function renderItalicLast(name: string) {
  const trimmed = name.trim();
  const i = trimmed.lastIndexOf(" ");
  if (i === -1) return name;
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
