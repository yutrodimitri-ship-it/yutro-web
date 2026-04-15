"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Generation {
  id: string;
  gender: string;
  wardrobePreset: string;
  status: string;
  createdAt: string;
}

const STATUS_CONFIG: Record<string, { label: string; dot: string }> = {
  completed: { label: "Completado", dot: "bg-emerald-500" },
  failed: { label: "Error", dot: "bg-red-500" },
  pending: { label: "En cola", dot: "bg-amber-500 animate-pulse" },
  step1: { label: "Paso 1/3", dot: "bg-blue-500 animate-pulse" },
  step2: { label: "Paso 2/3", dot: "bg-blue-500 animate-pulse" },
  step3: { label: "Paso 3/3", dot: "bg-blue-500 animate-pulse" },
};

export function GenerationList({ generations, locale }: { generations: Generation[]; locale: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(e: React.MouseEvent, id: string) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("¿Eliminar esta generación?")) return;
    setDeleting(id);
    const res = await fetch(`/api/studio/generations/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
    setDeleting(null);
  }

  return (
    <div className="divide-y divide-[#222] overflow-hidden rounded-xl border border-[#222] bg-[#1a1a1a]">
      {generations.map((gen) => {
        const status = STATUS_CONFIG[gen.status] || STATUS_CONFIG.pending;
        return (
          <Link
            key={gen.id}
            href={`/${locale}/studio/history/${gen.id}`}
            className="group flex items-center justify-between px-5 py-4 transition-colors hover:bg-white/[0.03]"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${status.dot}`} />
                <span className="text-xs text-white/40 w-20">{status.label}</span>
              </div>
              <div>
                <p className="text-sm font-medium">{gen.gender} &middot; {gen.wardrobePreset}</p>
                <p className="text-xs text-white/40">
                  {new Date(gen.createdAt).toLocaleDateString("es-CL", {
                    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
                  })}
                </p>
              </div>
            </div>

            <button
              onClick={(e) => handleDelete(e, gen.id)}
              disabled={deleting === gen.id}
              className="rounded-md p-1.5 text-white/30 opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100 disabled:opacity-50"
              title="Eliminar"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </Link>
        );
      })}
    </div>
  );
}
