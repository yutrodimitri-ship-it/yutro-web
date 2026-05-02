"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Upload, X } from "lucide-react";
import { VARIANTS, type ImageVariant } from "@/lib/talent/r2-client";

type SlotState =
  | { status: "empty" }
  | { status: "queued"; file: File; previewUrl: string }
  | { status: "uploading"; file: File; previewUrl: string }
  | { status: "done"; previewUrl: string }
  | { status: "error"; reason: string };

const VARIANT_LABELS: Record<ImageVariant, string> = {
  profile: "Profile (3:4)",
  charsheet: "Charsheet (3:4)",
  "studio-1": "Studio 1 (1:1)",
  "studio-2": "Studio 2 (1:1)",
  "studio-3": "Studio 3 (1:1)",
  "lifestyle-1": "Lifestyle 1 (1:1)",
  "lifestyle-2": "Lifestyle 2 (1:1)",
  "lifestyle-3": "Lifestyle 3 (1:1)",
};

interface BulkUploadProps {
  code: string;
  /** Keys ya en DB para mostrar las que ya existen como `done`. */
  existing: { profile: boolean; charsheet: boolean; gallery: ImageVariant[] };
  redirectTo: string;
}

export function BulkUpload({ code, existing, redirectTo }: BulkUploadProps) {
  const router = useRouter();
  const initial = buildInitialSlots(existing);
  const [slots, setSlots] = useState<Record<ImageVariant, SlotState>>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  function setSlot(variant: ImageVariant, next: SlotState) {
    setSlots((s) => ({ ...s, [variant]: next }));
  }

  // Carga previews reales de los slots ya subidos (estado "done" sin previewUrl).
  useEffect(() => {
    const created: string[] = [];
    let aborted = false;

    const slotsToFetch = (Object.entries(initial) as [
      ImageVariant,
      SlotState
    ][]).filter(([, s]) => s.status === "done" && !("previewUrl" in s && s.previewUrl));

    Promise.all(
      slotsToFetch.map(async ([variant]) => {
        try {
          const res = await fetch(
            `/api/studio/talent/admin/images/${encodeURIComponent(code)}/${encodeURIComponent(variant)}`
          );
          if (!res.ok) return;
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          if (!aborted) {
            created.push(url);
            setSlot(variant, { status: "done", previewUrl: url });
          }
        } catch {
          // ignore — el slot queda en done con check verde sin preview
        }
      })
    );

    return () => {
      aborted = true;
      created.forEach((u) => URL.revokeObjectURL(u));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  function attachFile(variant: ImageVariant, file: File) {
    const previewUrl = URL.createObjectURL(file);
    setSlot(variant, { status: "queued", file, previewUrl });
  }

  function clearSlot(variant: ImageVariant) {
    const slot = slots[variant];
    if (
      (slot.status === "queued" ||
        slot.status === "uploading" ||
        slot.status === "done") &&
      "previewUrl" in slot
    ) {
      URL.revokeObjectURL(slot.previewUrl);
    }
    setSlot(variant, { status: "empty" });
  }

  /** Maneja drop/select de varios archivos, los matchea por nombre a slots. */
  function ingestFiles(files: FileList | File[]) {
    Array.from(files).forEach((file) => {
      const matched = matchVariant(file.name);
      if (!matched) {
        setGlobalError(
          `No pude inferir la variante de ${file.name}. Renómbralo (ej. profile.jpg, studio-1.jpg).`
        );
        return;
      }
      attachFile(matched, file);
    });
  }

  async function handleSubmitAll() {
    setSubmitting(true);
    setGlobalError(null);

    const queued = (Object.entries(slots) as [ImageVariant, SlotState][])
      .filter(([, s]) => s.status === "queued")
      .map(([v, s]) => [v, (s as Extract<SlotState, { status: "queued" }>).file] as const);

    if (queued.length === 0) {
      setGlobalError("No hay archivos pendientes para subir.");
      setSubmitting(false);
      return;
    }

    const formData = new FormData();
    queued.forEach(([variant, file]) => formData.append(variant, file, file.name));

    queued.forEach(([variant]) => {
      const current = slots[variant];
      if (current.status === "queued") {
        setSlot(variant, {
          status: "uploading",
          file: current.file,
          previewUrl: current.previewUrl,
        });
      }
    });

    try {
      const res = await fetch(
        `/api/studio/talent/admin/talents/${code}/images`,
        { method: "POST", body: formData }
      );
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      const data = (await res.json()) as {
        uploaded: ImageVariant[];
        errors: { variant: string; reason: string }[];
      };
      // Marcar uploaded como done
      data.uploaded.forEach((v) => {
        const current = slots[v];
        const previewUrl =
          (current as Extract<SlotState, { status: "uploading" }>).previewUrl ??
          "";
        setSlot(v, { status: "done", previewUrl });
      });
      data.errors.forEach((e) => {
        if (isImageVariant(e.variant)) {
          setSlot(e.variant, { status: "error", reason: e.reason });
        }
      });
      router.refresh();
    } catch (err) {
      setGlobalError((err as Error).message);
      // Revertir uploading → queued
      queued.forEach(([variant]) => {
        const current = slots[variant];
        if (current.status === "uploading") {
          setSlot(variant, {
            status: "queued",
            file: current.file,
            previewUrl: current.previewUrl,
          });
        }
      });
    } finally {
      setSubmitting(false);
    }
  }

  const queuedCount = Object.values(slots).filter(
    (s) => s.status === "queued"
  ).length;

  return (
    <div className="space-y-6">
      {/* Drop zone */}
      <DropZone onFiles={ingestFiles} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {VARIANTS.map((variant) => (
          <SlotCard
            key={variant}
            variant={variant}
            slot={slots[variant]}
            onPickFile={(file) => attachFile(variant, file)}
            onClear={() => clearSlot(variant)}
          />
        ))}
      </div>

      {globalError && (
        <div className="border border-red-500/40 bg-red-500/10 px-4 py-3 text-[13px] text-red-300">
          {globalError}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSubmitAll}
          disabled={submitting || queuedCount === 0}
          className="inline-flex items-center gap-2 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.12em] disabled:opacity-50"
          style={{
            background: "var(--accent)",
            color: "var(--accent-foreground)",
          }}
        >
          {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          Subir {queuedCount} {queuedCount === 1 ? "archivo" : "archivos"}
        </button>
        <a
          href={redirectTo}
          className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/40 hover:text-white"
        >
          Volver
        </a>
      </div>
    </div>
  );
}

function DropZone({ onFiles }: { onFiles: (files: File[]) => void }) {
  const [over, setOver] = useState(false);
  return (
    <label
      className="flex cursor-pointer flex-col items-center justify-center gap-3 border-2 border-dashed bg-[#0a0a0a] px-6 py-10 text-center transition-colors"
      style={{
        borderColor: over ? "var(--accent)" : "rgba(255,255,255,0.08)",
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        if (e.dataTransfer.files.length) {
          onFiles(Array.from(e.dataTransfer.files));
        }
      }}
    >
      <Upload className="h-6 w-6 text-white/40" strokeWidth={1.5} />
      <p className="text-[13px] text-white/70">
        Arrastra los 8 archivos o haz click para seleccionar
      </p>
      <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/40">
        profile.jpg · charsheet.jpg · studio-1..3.jpg · lifestyle-1..3.jpg
      </p>
      <input
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) onFiles(Array.from(e.target.files));
          e.target.value = "";
        }}
      />
    </label>
  );
}

function SlotCard({
  variant,
  slot,
  onPickFile,
  onClear,
}: {
  variant: ImageVariant;
  slot: SlotState;
  onPickFile: (file: File) => void;
  onClear: () => void;
}) {
  const aspect = variant.startsWith("studio") || variant.startsWith("lifestyle") ? "1 / 1" : "3 / 4";
  return (
    <div className="border border-white/[0.08] bg-[#131313] p-3">
      <div
        className="relative mb-3 overflow-hidden bg-[#0a0a0a]"
        style={{ aspectRatio: aspect }}
      >
        {slot.status !== "empty" && "previewUrl" in slot && slot.previewUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={slot.previewUrl}
            alt={variant}
            className="h-full w-full object-cover"
          />
        )}
        {slot.status === "uploading" && (
          <div className="absolute inset-0 grid place-items-center bg-black/60">
            <Loader2 className="h-6 w-6 animate-spin text-[var(--accent)]" />
          </div>
        )}
        {slot.status === "done" && (
          <div className="absolute right-2 top-2 grid h-7 w-7 place-items-center bg-emerald-500 text-emerald-950">
            <Check className="h-4 w-4" strokeWidth={2.5} />
          </div>
        )}
        {slot.status === "error" && (
          <div className="absolute inset-0 grid place-items-center bg-red-500/30 text-red-200">
            <span className="text-[11px]">{slot.reason}</span>
          </div>
        )}
        {slot.status === "empty" && (
          <label className="absolute inset-0 flex cursor-pointer items-center justify-center text-white/30 hover:text-white/60">
            <Upload className="h-5 w-5" strokeWidth={1.5} />
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onPickFile(f);
                e.target.value = "";
              }}
            />
          </label>
        )}
      </div>

      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/55">
          {VARIANT_LABELS[variant]}
        </p>
        {slot.status !== "empty" && slot.status !== "uploading" && (
          <button
            type="button"
            onClick={onClear}
            className="text-white/30 hover:text-red-300"
            title="Quitar"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

function buildInitialSlots(
  existing: BulkUploadProps["existing"]
): Record<ImageVariant, SlotState> {
  const initial: Record<ImageVariant, SlotState> = {
    profile: existing.profile ? { status: "done", previewUrl: "" } : { status: "empty" },
    charsheet: existing.charsheet ? { status: "done", previewUrl: "" } : { status: "empty" },
    "studio-1": existing.gallery.includes("studio-1") ? { status: "done", previewUrl: "" } : { status: "empty" },
    "studio-2": existing.gallery.includes("studio-2") ? { status: "done", previewUrl: "" } : { status: "empty" },
    "studio-3": existing.gallery.includes("studio-3") ? { status: "done", previewUrl: "" } : { status: "empty" },
    "lifestyle-1": existing.gallery.includes("lifestyle-1") ? { status: "done", previewUrl: "" } : { status: "empty" },
    "lifestyle-2": existing.gallery.includes("lifestyle-2") ? { status: "done", previewUrl: "" } : { status: "empty" },
    "lifestyle-3": existing.gallery.includes("lifestyle-3") ? { status: "done", previewUrl: "" } : { status: "empty" },
  };
  return initial;
}

function matchVariant(filename: string): ImageVariant | null {
  const base = filename
    .toLowerCase()
    .replace(/\.[^.]+$/, "") // strip ext
    .replace(/[^a-z0-9-]/g, "");
  if (isImageVariant(base)) return base;
  return null;
}

function isImageVariant(s: string): s is ImageVariant {
  return (VARIANTS as readonly string[]).includes(s);
}
