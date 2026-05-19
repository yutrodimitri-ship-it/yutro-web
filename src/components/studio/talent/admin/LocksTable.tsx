"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ExternalLink } from "lucide-react";

interface LockItem {
  submissionId: string;
  talentCode: string;
  talentName: string | null;
  isExclusive: boolean;
  projectSlug: string;
  projectName: string;
  projectCategory: string;
  submitterEmail: string;
  submittedAt: string;
  rightsDurationMonths: number;
  projectStartDate: string;
}

interface LocksTableProps {
  items: LockItem[];
}

export function LocksTable({ items }: LocksTableProps) {
  const router = useRouter();
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function release(item: LockItem) {
    const key = `${item.submissionId}:${item.talentCode}`;
    if (!confirm(`¿Liberar ${item.talentName ?? item.talentCode} (${item.talentCode}) del proyecto "${item.projectName}"?`)) {
      return;
    }
    setLoadingKey(key);
    setError(null);
    try {
      const res = await fetch(`/api/studio/talent/admin/submissions/${item.submissionId}/release-talent`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ talentCode: item.talentCode }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoadingKey(null);
    }
  }

  if (items.length === 0) {
    return (
      <div className="border border-white/[0.08] bg-[#111] p-10 text-center">
        <p className="text-[14px] text-white/40">No hay talentos comprometidos en este momento.</p>
        <p className="mt-2 text-[12px] text-white/25">
          Cuando un casting se apruebe, sus talentos aparecerán acá.
        </p>
      </div>
    );
  }

  // Agrupar por submission para clarity visual
  const bySubmission = new Map<string, LockItem[]>();
  for (const item of items) {
    const list = bySubmission.get(item.submissionId) ?? [];
    list.push(item);
    bySubmission.set(item.submissionId, list);
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="border border-red-500/40 bg-red-500/10 px-4 py-3 text-[13px] text-red-300">
          {error}
        </div>
      )}

      {Array.from(bySubmission.entries()).map(([submissionId, group]) => {
        const head = group[0];
        const submittedDate = new Date(head.submittedAt).toLocaleDateString("es-CL", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
        return (
          <div key={submissionId} className="border border-white/[0.07] bg-[#111]">
            {/* Header del casting */}
            <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-white/[0.07] px-5 py-3">
              <div>
                <Link
                  href={`/es/studio/talent/admin/projects/${head.projectSlug}`}
                  className="flex items-center gap-1.5 text-[14px] font-semibold text-white/90 hover:text-[var(--accent)]"
                >
                  {head.projectName}
                  <ExternalLink className="h-3 w-3" />
                </Link>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/30">
                  {head.projectCategory} · {head.rightsDurationMonths} meses · inicio {head.projectStartDate}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[12px] text-white/50">{head.submitterEmail}</p>
                <p className="font-mono text-[10px] text-white/30">{submittedDate}</p>
              </div>
            </div>

            {/* Lista de talentos */}
            <div className="divide-y divide-white/[0.05]">
              {group.map((item) => {
                const key = `${item.submissionId}:${item.talentCode}`;
                const isLoading = loadingKey === key;
                return (
                  <div key={key} className="flex items-center justify-between gap-3 px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[12px] text-white/80">{item.talentCode}</span>
                      <span className="text-[13px] text-white/60">
                        {item.talentName ?? <em className="text-white/30">(talento no existe en catálogo actual)</em>}
                      </span>
                      {item.isExclusive ? (
                        <span
                          className="font-mono text-[9px] uppercase tracking-[0.14em] px-1.5 py-0.5"
                          style={{
                            background: "color-mix(in oklch, var(--accent) 20%, transparent)",
                            color: "var(--accent)",
                            border: "1px solid color-mix(in oklch, var(--accent) 40%, transparent)",
                          }}
                        >
                          Exclusivo
                        </span>
                      ) : (
                        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/30 border border-white/[0.1] px-1.5 py-0.5">
                          Normal
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => release(item)}
                      disabled={isLoading}
                      className="inline-flex items-center gap-1.5 border border-white/[0.12] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-white/60 transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--accent)] disabled:opacity-50"
                    >
                      {isLoading && <Loader2 className="h-3 w-3 animate-spin" />}
                      Liberar
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
