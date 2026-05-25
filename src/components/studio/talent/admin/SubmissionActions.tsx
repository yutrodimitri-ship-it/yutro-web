"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Mail, X } from "lucide-react";

interface SubmissionActionsProps {
  submissionId: string;
  currentStatus: string;
  adminNotes: string;
}

export function SubmissionActions({
  submissionId,
  currentStatus,
  adminNotes: initialNotes,
}: SubmissionActionsProps) {
  const router = useRouter();
  const [notes, setNotes] = useState(initialNotes);
  const [busy, setBusy] = useState<"none" | "confirm" | "reject" | "resend" | "save">("none");
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [, startTransition] = useTransition();

  async function changeStatus(status: "confirmed" | "rejected") {
    setBusy(status === "confirmed" ? "confirm" : "reject");
    setMessage(null);
    try {
      const res = await fetch(`/api/studio/talent/admin/submissions/${submissionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      setMessage({
        type: "ok",
        text: status === "confirmed" ? "Marcado como confirmado." : "Marcado como rechazado.",
      });
      startTransition(() => router.refresh());
    } catch (err) {
      setMessage({ type: "err", text: (err as Error).message });
    } finally {
      setBusy("none");
    }
  }

  async function saveNotes() {
    setBusy("save");
    setMessage(null);
    try {
      const res = await fetch(`/api/studio/talent/admin/submissions/${submissionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNotes: notes }),
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      setMessage({ type: "ok", text: "Notas guardadas." });
    } catch (err) {
      setMessage({ type: "err", text: (err as Error).message });
    } finally {
      setBusy("none");
    }
  }

  async function resendEmail() {
    setBusy("resend");
    setMessage(null);
    try {
      const res = await fetch(
        `/api/studio/talent/admin/submissions/${submissionId}/resend`,
        { method: "POST" }
      );
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      setMessage({ type: "ok", text: "Email reenviado." });
      startTransition(() => router.refresh());
    } catch (err) {
      setMessage({ type: "err", text: (err as Error).message });
    } finally {
      setBusy("none");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => changeStatus("confirmed")}
          disabled={busy !== "none" || currentStatus === "confirmed"}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.12em] disabled:opacity-50"
          style={{
            background: currentStatus === "confirmed" ? "#0d2a1a" : "var(--accent)",
            color:
              currentStatus === "confirmed"
                ? "#7dd3a3"
                : "var(--accent-foreground)",
            border:
              currentStatus === "confirmed" ? "1px solid #1e5a3a" : "none",
          }}
        >
          {busy === "confirm" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Check className="h-3.5 w-3.5" />
          )}
          Confirmar
        </button>
        <button
          type="button"
          onClick={() => changeStatus("rejected")}
          disabled={busy !== "none" || currentStatus === "rejected"}
          className="inline-flex items-center justify-center gap-2 border border-red-500/40 bg-red-500/5 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.12em] text-red-300 disabled:opacity-50"
        >
          {busy === "reject" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <X className="h-3.5 w-3.5" />
          )}
          Rechazar
        </button>
        <button
          type="button"
          onClick={resendEmail}
          disabled={busy !== "none"}
          className="inline-flex items-center justify-center gap-2 border border-white/[0.08] bg-[#0a0a0a] px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.12em] text-white/70 disabled:opacity-50 hover:text-white"
        >
          {busy === "resend" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Mail className="h-3.5 w-3.5" />
          )}
          Reenviar email
        </button>
      </div>

      <div>
        <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.1em] text-white/40">
          Notas internas
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={5}
          className="w-full bg-[#0a0a0a] border border-white/[0.08] px-3 py-2.5 text-[13px] text-white placeholder:text-white/30 focus:border-[var(--accent)]/60 focus:outline-none"
          placeholder="Notas privadas para el equipo Yutro…"
        />
        <button
          type="button"
          onClick={saveNotes}
          disabled={busy !== "none" || notes === initialNotes}
          className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-white/55 disabled:opacity-50 hover:text-white"
        >
          {busy === "save" && <Loader2 className="h-3 w-3 animate-spin" />}
          Guardar notas
        </button>
      </div>

      {message && (
        <p
          className={`text-[12px] ${
            message.type === "ok" ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
