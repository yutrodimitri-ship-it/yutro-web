"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/studio/ConfirmDialog";

interface NdaRow {
  id: string;
  email: string;
  acceptedAt: string;
  ipAddress: string | null;
  revokedAt: string | null;
}

export function ProjectNdaManager({
  slug,
  ndas,
}: {
  slug: string;
  ndas: NdaRow[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingNda, setPendingNda] = useState<string | null>(null);

  async function executeRevokeNda(email: string) {
    setPendingNda(null);
    const res = await fetch(
      `/api/studio/talent/admin/projects/${slug}/nda/${encodeURIComponent(email)}/revoke`,
      { method: "POST" }
    );
    if (res.ok) startTransition(() => router.refresh());
  }

  if (ndas.length === 0) {
    return (
      <section>
        <h2 className="mb-4 font-mono text-[11px] uppercase tracking-[0.1em] text-white/40">
          NDAs aceptados
        </h2>
        <p className="text-[13px] text-white/40">
          Ningún cliente ha aceptado el NDA todavía.
        </p>
      </section>
    );
  }

  return (
    <section>
      <h2 className="mb-4 font-mono text-[11px] uppercase tracking-[0.1em] text-white/40">
        NDAs aceptados ({ndas.length})
      </h2>

      <ul className="divide-y divide-white/[0.04] border border-white/[0.08] bg-[#0a0a0a]">
        {ndas.map((n) => (
          <li
            key={n.id}
            className="flex items-center justify-between gap-4 px-4 py-3 text-[13px]"
          >
            <div className="flex flex-col gap-0.5">
              <span
                className={
                  n.revokedAt ? "text-white/40 line-through" : "text-white"
                }
              >
                {n.email}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/40">
                Aceptado: {new Date(n.acceptedAt).toLocaleString()}
                {n.ipAddress && <> · IP {n.ipAddress}</>}
              </span>
              {n.revokedAt && (
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-red-400">
                  Revocado: {new Date(n.revokedAt).toLocaleString()}
                </span>
              )}
            </div>
            {!n.revokedAt && (
              <button
                type="button"
                onClick={() => setPendingNda(n.email)}
                disabled={isPending}
                className="font-mono text-[10px] uppercase tracking-[0.1em] text-red-300 hover:text-red-200 disabled:opacity-50"
              >
                Revocar NDA
              </button>
            )}
          </li>
        ))}
      </ul>

      <ConfirmDialog
        open={!!pendingNda}
        message={`¿Revocar el NDA de ${pendingNda ?? ""}? El cliente tendrá que volver a aceptarlo en su próximo acceso.`}
        onConfirm={() => { if (pendingNda) void executeRevokeNda(pendingNda); }}
        onCancel={() => setPendingNda(null)}
        danger
        confirmLabel="Revocar NDA"
      />
    </section>
  );
}
