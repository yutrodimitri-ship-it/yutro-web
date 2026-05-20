"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface Submission {
  id: string;
  userEmail: string;
  shortlist: string[];
  exclusives: string[];
  status: string;
  submittedAt: string;
  adminNotes: string | null;
}

interface ProjectSubmissionsPanelProps {
  submissions: Submission[];
  projectSlug: string;
}

export function ProjectSubmissionsPanel({
  submissions,
  projectSlug,
}: ProjectSubmissionsPanelProps) {
  void projectSlug;

  if (submissions.length === 0) {
    return (
      <p className="text-[13px] text-white/40">
        No hay envíos para este proyecto todavía.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {submissions.map((sub) => (
        <SubmissionRow key={sub.id} submission={sub} />
      ))}
    </div>
  );
}

function SubmissionRow({ submission }: { submission: Submission }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"confirmed" | "rejected" | null>(null);
  const [notes, setNotes] = useState(submission.adminNotes ?? "");
  const [error, setError] = useState<string | null>(null);

  const isPending = submission.status === "pending";

  async function patch(status: "confirmed" | "rejected") {
    setLoading(status);
    setError(null);
    try {
      const res = await fetch(`/api/studio/talent/admin/submissions/${submission.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, adminNotes: notes || null }),
      });
      if (!res.ok) {
        const d = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(d.error ?? `HTTP ${res.status}`);
      }
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(null);
    }
  }

  const statusColor =
    submission.status === "confirmed"
      ? "var(--accent)"
      : submission.status === "rejected"
      ? "#ef4444"
      : "rgba(255,255,255,0.35)";

  const date = new Date(submission.submittedAt).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="border border-white/[0.07] bg-[#111] p-5 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[13px] font-medium text-white/80">{submission.userEmail}</p>
          <p className="mt-0.5 font-mono text-[10px] text-white/30">{date}</p>
        </div>
        <span
          className="font-mono text-[10px] uppercase tracking-[0.1em] px-2 py-0.5"
          style={{ color: statusColor, border: `1px solid ${statusColor}` }}
        >
          {submission.status}
        </span>
      </div>

      {/* Shortlist */}
      <div>
        <p className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
          Shortlist ({submission.shortlist.length})
        </p>
        <div className="flex flex-wrap gap-1.5">
          {submission.shortlist.map((code) => (
            <span
              key={code}
              className="font-mono text-[11px] px-1.5 py-0.5"
              style={{
                background: submission.exclusives.includes(code)
                  ? "color-mix(in oklch, var(--accent) 20%, transparent)"
                  : "rgba(255,255,255,0.05)",
                color: submission.exclusives.includes(code)
                  ? "var(--accent)"
                  : "rgba(255,255,255,0.6)",
                border: submission.exclusives.includes(code)
                  ? "1px solid color-mix(in oklch, var(--accent) 40%, transparent)"
                  : "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {code}
              {submission.exclusives.includes(code) && (
                <span className="ml-1 text-[8px] opacity-70">EXCL</span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Notes + Actions */}
      {isPending && (
        <div className="space-y-3">
          <label className="block">
            <span className="mb-1 block font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
              Notas admin (opcional)
            </span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full bg-[#0a0a0a] border border-white/[0.08] px-3 py-2 text-[12px] text-white placeholder:text-white/25 focus:border-white/20 focus:outline-none resize-none"
              placeholder="Motivo de rechazo, condiciones, etc."
            />
          </label>

          {error && (
            <p className="text-[12px] text-red-400">{error}</p>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => patch("confirmed")}
              disabled={loading !== null}
              className="inline-flex items-center gap-1.5 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.1em] disabled:opacity-50"
              style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}
            >
              {loading === "confirmed" && <Loader2 className="h-3 w-3 animate-spin" />}
              Aprobar
            </button>
            <button
              onClick={() => patch("rejected")}
              disabled={loading !== null}
              className="inline-flex items-center gap-1.5 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.1em] border border-white/[0.12] text-white/50 hover:text-white disabled:opacity-50"
            >
              {loading === "rejected" && <Loader2 className="h-3 w-3 animate-spin" />}
              Rechazar
            </button>
          </div>
        </div>
      )}

      {/* Liberar casting completo cuando ya está confirmado */}
      {submission.status === "confirmed" && (
        <div className="space-y-2">
          {error && <p className="text-[12px] text-red-400">{error}</p>}
          <button
            onClick={() => {
              if (confirm("¿Liberar todos los talentos de este casting? Los talentos volverán a estar disponibles en el catálogo.")) {
                patch("rejected");
              }
            }}
            disabled={loading !== null}
            className="inline-flex items-center gap-1.5 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.1em] border border-white/[0.12] text-white/50 hover:border-[var(--accent)]/40 hover:text-[var(--accent)] disabled:opacity-50"
          >
            {loading === "rejected" && <Loader2 className="h-3 w-3 animate-spin" />}
            Liberar todos los talentos
          </button>
        </div>
      )}

      {!isPending && submission.adminNotes && (
        <p className="text-[12px] text-white/40 italic">&ldquo;{submission.adminNotes}&rdquo;</p>
      )}
    </div>
  );
}
