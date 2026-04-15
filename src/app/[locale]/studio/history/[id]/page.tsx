"use client";

/* eslint-disable @next/next/no-img-element */

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Loader2, Download, Check, XCircle, Clock, X, ZoomIn, ArrowLeft } from "lucide-react";
import Link from 'next/link';
import { ImageLightbox } from '@/components/studio/ImageLightbox';
import { downloadImage } from '@/lib/download';
import { GenerationLoader } from "@/components/studio/GenerationLoader";

interface Generation {
  id: string;
  status: string;
  gender: string;
  wardrobePreset: string;
  ageRange: string;
  ethnicity: string;
  errorMessage?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  images: { step: number; publicUrl: string; filename: string }[];
}

const STEP_NAMES: Record<number, string> = {
  1: "Retrato",
  2: "Vestuario",
  3: "Sesión",
};

export default function GenerationDetailPage() {
  const params = useParams();
  const locale = params.locale as string;
  const id = params.id as string;

  const [gen, setGen] = useState<Generation | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxSrc, setLightboxSrc] = useState("");

  const fetchStatus = useCallback(async () => {
    const res = await fetch(`/api/studio/generations/${id}/status`);
    if (res.ok) {
      const data = await res.json();
      setGen(data);
      return data.status;
    }
    return null;
  }, [id]);

  useEffect(() => {
    fetchStatus().then(() => setLoading(false));
  }, [fetchStatus]);

  useEffect(() => {
    if (!gen || gen.status === "completed" || gen.status === "failed") return;
    const interval = setInterval(async () => {
      const status = await fetchStatus();
      if (status === "completed" || status === "failed") clearInterval(interval);
    }, 5000);
    return () => clearInterval(interval);
  }, [gen?.status, fetchStatus]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-5 w-5 animate-spin text-white/40" />
      </div>
    );
  }

  if (!gen) {
    return <div className="py-20 text-center text-white/40">Generación no encontrada</div>;
  }

  const isProcessing = !["completed", "failed"].includes(gen.status);
  const sortedImages = gen.images.sort((a, b) => a.step - b.step);
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href={`/${locale}/studio/history`}
            className="rounded-lg p-1.5 text-white/40 hover:bg-[#1e1e1e] hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              {gen.gender} &middot; {gen.wardrobePreset}
            </h1>
            <p className="text-xs text-white/40">
              {gen.ethnicity} &middot; {gen.ageRange} &middot;{" "}
              {new Date(gen.createdAt).toLocaleDateString("es-CL", {
                day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Processing */}
      {isProcessing && (
        <GenerationLoader
          title={gen.status === "pending" ? "En cola..." : `Procesando paso ${gen.status.replace("step", "")}/3`}
          duration={90}
          messages={["Procesando...", "Esto puede tomar unos minutos..."]}
        />
      )}

      {/* Error */}
      {gen.status === "failed" && (
        <div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
          <XCircle className="h-4 w-4 text-destructive" />
          <div>
            <p className="text-sm font-medium text-destructive">Error en la generación</p>
            <p className="text-xs text-white/40">{gen.errorMessage || "Error desconocido"}</p>
          </div>
        </div>
      )}

      {/* Completed — same grid as generate flow */}
      {gen.status === "completed" && sortedImages.length > 0 && (
        <>
          <div className="flex items-center gap-3 rounded-lg border border-green-800 bg-green-900/20 px-4 py-3">
            <Check className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-300">Avatar completado</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {sortedImages.map((img) => (
              <div
                key={img.step}
                className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl border border-[#222] bg-black"
                onClick={() => setLightboxSrc(img.publicUrl)}
              >
                <img
                  src={img.publicUrl}
                  alt={STEP_NAMES[img.step] || `Paso ${img.step}`}
                  className={`absolute inset-0 h-full w-full object-cover ${img.step === 2 ? "object-top" : "object-center"}`}
                />
                <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent px-3 pb-2.5 pt-10">
                  <span className="text-xs font-medium text-white">
                    {STEP_NAMES[img.step] || `Paso ${img.step}`}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); setLightboxSrc(img.publicUrl); }}
                      className="rounded-md p-1.5 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
                      title="Ampliar"
                    >
                      <ZoomIn className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); downloadImage(img.publicUrl, img.filename); }}
                      className="rounded-md p-1.5 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
                      title="Descargar"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Pending */}
      {gen.status === "pending" && (
        <div className="flex items-center gap-3 rounded-lg border border-[#222] px-4 py-6">
          <Clock className="h-4 w-4 text-white/40" />
          <span className="text-sm text-white/40">Esperando que el sistema esté disponible...</span>
        </div>
      )}

      {/* Lightbox */}
      {lightboxSrc && (
        <ImageLightbox src={lightboxSrc} onClose={() => setLightboxSrc("")} />
      )}
    </div>
  );
}
