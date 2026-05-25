"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, X } from "lucide-react";
import { ConfirmDialog } from "@/components/studio/ConfirmDialog";

interface AccessRow {
  id: string;
  email: string;
  grantedAt: string;
  revokedAt: string | null;
}

export function ProjectAccessManager({
  slug,
  accesses,
}: {
  slug: string;
  accesses: AccessRow[];
}) {
  const router = useRouter();
  const [newEmail, setNewEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [pendingRevoke, setPendingRevoke] = useState<string | null>(null);

  async function handleGrant(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!newEmail.trim()) return;

    const res = await fetch(`/api/studio/talent/admin/projects/${slug}/access`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: newEmail.trim() }),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setError(data.error ?? `HTTP ${res.status}`);
      return;
    }
    setNewEmail("");
    startTransition(() => router.refresh());
  }

  async function executeRevoke(email: string) {
    setPendingRevoke(null);
    const res = await fetch(`/api/studio/talent/admin/projects/${slug}/access`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (res.ok) startTransition(() => router.refresh());
  }

  const active = accesses.filter((a) => !a.revokedAt);
  const revoked = accesses.filter((a) => a.revokedAt);

  return (
    <section>
      <h2 className="mb-4 font-mono text-[11px] uppercase tracking-[0.1em] text-white/40">
        Accesos al proyecto
      </h2>

      <form onSubmit={handleGrant} className="mb-6 flex gap-3 max-w-2xl">
        <input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="email@cliente.cl"
          className="flex-1 bg-[#0a0a0a] border border-white/[0.08] px-3 py-2.5 text-[13px] text-white placeholder:text-white/30 focus:border-[var(--accent)]/60 focus:outline-none"
          required
        />
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.12em] disabled:opacity-50"
          style={{
            background: "var(--accent)",
            color: "var(--accent-foreground)",
          }}
        >
          {isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Plus className="h-3.5 w-3.5" />
          )}
          Otorgar
        </button>
      </form>

      {error && (
        <p className="mb-4 text-[12px] text-red-400">{error}</p>
      )}

      {active.length === 0 && revoked.length === 0 && (
        <p className="text-[13px] text-white/40">
          Sin accesos otorgados todavía.
        </p>
      )}

      {active.length > 0 && (
        <ul className="mb-4 divide-y divide-white/[0.04] border border-white/[0.08] bg-[#0a0a0a]">
          {active.map((a) => (
            <li
              key={a.id}
              className="flex items-center justify-between px-4 py-2.5 text-[13px]"
            >
              <span className="flex items-center gap-3 text-white">
                <span className="block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {a.email}
              </span>
              <button
                type="button"
                onClick={() => setPendingRevoke(a.email)}
                className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-red-300 hover:text-red-200"
              >
                <X className="h-3 w-3" />
                Revocar
              </button>
            </li>
          ))}
        </ul>
      )}

      {revoked.length > 0 && (
        <details className="text-[12px] text-white/40">
          <summary className="cursor-pointer">
            Revocados ({revoked.length})
          </summary>
          <ul className="mt-2 divide-y divide-white/[0.04] border border-white/[0.04]">
            {revoked.map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between px-4 py-2 text-white/40 line-through"
              >
                <span>{a.email}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.1em]">
                  {new Date(a.revokedAt!).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </details>
      )}
      <ConfirmDialog
        open={!!pendingRevoke}
        message={`¿Revocar acceso de ${pendingRevoke ?? ""}?`}
        onConfirm={() => { if (pendingRevoke) void executeRevoke(pendingRevoke); }}
        onCancel={() => setPendingRevoke(null)}
        danger
        confirmLabel="Revocar"
      />
    </section>
  );
}
