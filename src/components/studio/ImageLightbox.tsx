"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect } from "react";
import { X, Download } from "lucide-react";
import { downloadImage } from "@/lib/download";

interface ImageLightboxProps {
  src: string;
  onClose: () => void;
  filename?: string;
}

export function ImageLightbox({ src, onClose, filename = "yutro-avatar.png" }: ImageLightboxProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Vista previa de imagen"
    >
      <button
        onClick={onClose}
        className="absolute right-5 top-5 z-10 rounded-full bg-white/10 p-2 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
        aria-label="Cerrar"
      >
        <X className="h-5 w-5" />
      </button>
      <img
        src={src}
        alt="Preview"
        className="max-h-[92vh] max-w-[92vw] object-contain"
        onClick={(e) => e.stopPropagation()}
      />
      <button
        onClick={(e) => { e.stopPropagation(); downloadImage(src, filename); }}
        className="absolute bottom-6 z-10 inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/20 hover:text-white"
        aria-label="Descargar imagen"
      >
        <Download className="h-4 w-4" />
        Descargar
      </button>
    </div>
  );
}
