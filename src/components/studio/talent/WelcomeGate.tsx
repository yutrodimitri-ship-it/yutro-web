"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { WelcomeOverlay } from "./WelcomeOverlay";
import { useTalentSession } from "@/lib/talent/talent-session-context";
import { logAuditEvent } from "@/lib/talent/audit-log";
import type { Locale, ProjectConfig } from "@/types/talent";

interface WelcomeGateProps {
  project: ProjectConfig;
  locale: Locale;
  children: React.ReactNode;
}

/**
 * Gate de la pantalla de bienvenida. Solo aparece la primera vez por
 * sesion del navegador. Persiste flag en sessionStorage al ver:
 *
 *   sessionStorage[`welcome:seen:${projectSlug}`] = ISO timestamp
 *
 * Mientras el overlay esta visible, los hijos siguen montados detras.
 * Cuando el overlay se oculta (auto-dismiss o skip), el contenido queda
 * visible sin saltos.
 */
export function WelcomeGate({ project, locale, children }: WelcomeGateProps) {
  const session = useTalentSession();
  // null = SSR/inicial; true = ver welcome; false = ya visto
  const [shouldShow, setShouldShow] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const key = `welcome:seen:${session.projectSlug}`;
    const seen = window.sessionStorage.getItem(key);
    setShouldShow(!seen);
  }, [session.projectSlug]);

  function handleDismiss() {
    if (typeof window !== "undefined") {
      const key = `welcome:seen:${session.projectSlug}`;
      window.sessionStorage.setItem(key, new Date().toISOString());
    }
    logAuditEvent("welcome_seen", session);
    setShouldShow(false);
  }

  return (
    <>
      {children}
      <AnimatePresence>
        {shouldShow === true && (
          <WelcomeOverlay
            key="welcome"
            project={project}
            locale={locale}
            onDismiss={handleDismiss}
          />
        )}
      </AnimatePresence>
    </>
  );
}
