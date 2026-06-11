"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NdaModal } from "./NdaModal";
import { useTalentSession } from "@/lib/talent/talent-session-context";
import { logAuditEvent } from "@/lib/talent/audit-log";

interface NdaGateProps {
  projectName: string;
  clientName: string;
  hubHref: string;
  children: React.ReactNode;
  /** Estado NDA resuelto server-side — elimina el flash de cliente. */
  initialAccepted: boolean;
}

/**
 * Gate del NDA.
 *
 * El estado inicial viene del server (layout.tsx query la DB antes de renderizar).
 * No hay estado null ni flash: el contenido o el modal se muestran directamente.
 * Al aceptar, POST al endpoint y actualiza estado local + sessionStorage cache.
 */
export function NdaGate({
  projectName,
  clientName,
  hubHref,
  children,
  initialAccepted,
}: NdaGateProps) {
  const session = useTalentSession();
  const router = useRouter();
  const [accepted, setAccepted] = useState(initialAccepted);

  async function handleAccept() {
    if (typeof window !== "undefined") {
      const cacheKey = `nda:accepted:${session.projectSlug}`;
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
      {!accepted && (
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
