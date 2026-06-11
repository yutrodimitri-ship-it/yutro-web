"use client";

import { createContext, useContext, useMemo } from "react";
import type { AuditContext } from "./audit-log";

/**
 * Provee `userEmail` + `projectSlug` a los componentes client del modulo
 * Talent para que puedan loguear eventos de auditoria sin pasar props
 * por todo el arbol.
 */

const TalentSessionContext = createContext<AuditContext | null>(null);

interface TalentSessionProviderProps {
  userEmail: string;
  projectSlug: string;
  children: React.ReactNode;
}

export function TalentSessionProvider({
  userEmail,
  projectSlug,
  children,
}: TalentSessionProviderProps) {
  const value = useMemo<AuditContext>(
    () => ({ userEmail, projectSlug }),
    [userEmail, projectSlug]
  );
  return (
    <TalentSessionContext.Provider value={value}>
      {children}
    </TalentSessionContext.Provider>
  );
}

export function useTalentSession(): AuditContext {
  const ctx = useContext(TalentSessionContext);
  if (!ctx) {
    throw new Error(
      "useTalentSession must be used inside <TalentSessionProvider>"
    );
  }
  return ctx;
}
