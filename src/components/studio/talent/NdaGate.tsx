"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { NdaModal } from "./NdaModal";
import { useTalentSession } from "@/lib/talent/talent-session-context";
import { logAuditEvent } from "@/lib/talent/audit-log";

interface NdaGateProps {
  projectName: string;
  clientName: string;
  hubHref: string;
  children: React.ReactNode;
}

/**
 * Gate del NDA — fuente de verdad: DB.
 *
 * Flujo:
 *   1. Al montar, GET /api/studio/talent/nda?projectSlug=...
 *      sessionStorage actua como cache rapido para evitar el flash en
 *      navegaciones intra-proyecto, pero la DB es la fuente.
 *   2. Si DB dice `accepted: true` → no muestra modal, persiste cache.
 *   3. Si DB dice `accepted: false` → muestra modal.
 *   4. Al aceptar: POST /api/studio/talent/nda + cache + audit event.
 *   5. Al cancelar: navega al hub.
 */
export function NdaGate({
  projectName,
  clientName,
  hubHref,
  children,
}: NdaGateProps) {
  const session = useTalentSession();
  const router = useRouter();
  // Estado: null = aun no resuelto, true = aceptado, false = mostrar modal
  const [accepted, setAccepted] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let aborted = false;

    const cacheKey = `nda:accepted:${session.projectSlug}`;
    const cachedHit = window.sessionStorage.getItem(cacheKey);
    if (cachedHit) {
      // Optimistic: skipea modal mientras la DB confirma
      setAccepted(true);
    }

    const url = `/api/studio/talent/nda?projectSlug=${encodeURIComponent(
      session.projectSlug
    )}`;
    fetch(url, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : { accepted: false }))
      .then((data: { accepted?: boolean }) => {
        if (aborted) return;
        const dbAccepted = Boolean(data.accepted);
        if (dbAccepted) {
          window.sessionStorage.setItem(cacheKey, new Date().toISOString());
        } else {
          window.sessionStorage.removeItem(cacheKey);
        }
        setAccepted(dbAccepted);
      })
      .catch(() => {
        if (aborted) return;
        // Fallback: si el endpoint falla y NO hay cache, mostrar modal
        // (preferir falso-positivo de pedir el NDA que falso-negativo de saltarlo).
        if (!cachedHit) setAccepted(false);
      });

    return () => {
      aborted = true;
    };
  }, [session.projectSlug]);

  async function handleAccept() {
    const cacheKey = `nda:accepted:${session.projectSlug}`;

    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(cacheKey, new Date().toISOString());
    }
    setAccepted(true);
    logAuditEvent("nda_accepted", session);

    try {
      await fetch("/api/studio/talent/nda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectSlug: session.projectSlug }),
      });
    } catch {
      // El audit event ya disparo. La proxima carga reconciliara con DB.
    }
  }

  function handleCancel() {
    router.push(hubHref);
  }

  return (
    <>
      {children}
      {accepted === false && (
        <NdaModal
          projectName={projectName}
          clientName={clientName}
          onAccept={handleAccept}
          onCancel={handleCancel}
        />
      )}
    </>
  );
}
