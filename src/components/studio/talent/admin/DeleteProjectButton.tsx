"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";

interface DeleteProjectButtonProps {
  slug: string;
  name: string;
  submissionCount: number;
}

type State = "idle" | "confirm" | "deleting";

export function DeleteProjectButton({
  slug,
  name,
  submissionCount,
}: DeleteProjectButtonProps) {
  const router = useRouter();
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    setState("deleting");
    setError(null);
    try {
      const res = await fetch(
        `/api/studio/talent/admin/projects/${encodeURIComponent(slug)}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar");
      setState("idle");
    }
  }

  if (state === "confirm") {
    return (
      <div
        className="flex flex-col gap-2 rounded px-3 py-2 text-[12px]"
        style={{ background: "rgba(200,50,30,0.12)", border: "1px solid rgba(200,50,30,0.25)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {submissionCount > 0 && (
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em]"
            style={{ color: "rgba(255,160,80,0.9)" }}>
            <AlertTriangle className="h-3 w-3 shrink-0" />
            {submissionCount} submission(s) se eliminarán
          </div>
        )}
        <p className="text-white/70">
          ¿Eliminar <span className="font-semibold text-white">{name}</span>? Esta acción no se puede deshacer.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 rounded px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-white transition-colors"
            style={{ background: "rgba(200,50,30,0.7)" }}
          >
            Eliminar
          </button>
          <button
            type="button"
            onClick={() => setState("idle")}
            className="flex-1 rounded px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-white/60 transition-colors hover:text-white"
            style={{ border: "1px solid rgba(255,255,255,0.1)" }}
          >
            Cancelar
          </button>
        </div>
        {error && (
          <p className="text-[11px]" style={{ color: "rgba(255,100,80,0.9)" }}>
            {error}
          </p>
        )}
      </div>
    );
  }

  if (state === "deleting") {
    return (
      <div className="flex items-center gap-2 px-3 py-2 font-mono text-[11px] text-white/40"
        onClick={(e) => e.stopPropagation()}>
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        Eliminando…
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        setState("confirm");
      }}
      title={`Eliminar proyecto ${slug}`}
      className="flex items-center gap-1.5 rounded px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] transition-colors"
      style={{ color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.08)" }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,100,80,0.9)";
        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(200,50,30,0.4)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.35)";
        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.08)";
      }}
    >
      <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
      Borrar
    </button>
  );
}
