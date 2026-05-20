"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, AlertCircle } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  /** Pregunta o descripción de la acción a confirmar. */
  message: string;
  title?: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  /** true → icono rojo + botón rojo (acciones destructivas). */
  danger?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
}

/**
 * Modal de confirmación genérico. Reemplaza window.confirm() con UI
 * coherente con el design system: fondo oscuro, backdrop blur, sin border-radius.
 *
 * Cierra con Esc o click fuera del panel.
 */
export function ConfirmDialog({
  open,
  message,
  title,
  onConfirm,
  onCancel,
  danger = false,
  confirmLabel = danger ? "Eliminar" : "Confirmar",
  cancelLabel = "Cancelar",
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onCancel]);

  const iconColor = danger ? "oklch(0.65 0.13 25)" : "var(--accent)";
  const iconBg = danger
    ? "color-mix(in oklch, oklch(0.65 0.13 25) 12%, transparent)"
    : "var(--accent-soft)";
  const confirmBg = danger ? "oklch(0.55 0.14 25)" : "var(--accent)";
  const confirmFg = danger ? "white" : "var(--accent-foreground)";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[200] flex items-center justify-center px-4 backdrop-blur-sm"
          style={{ background: "rgba(0,0,0,0.72)" }}
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-sm border border-white/[0.08] bg-[#131313] p-7"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Icono */}
            <div
              className="mb-5 inline-flex h-10 w-10 items-center justify-center"
              style={{ background: iconBg, color: iconColor }}
            >
              {danger ? (
                <AlertTriangle className="h-5 w-5" strokeWidth={1.75} />
              ) : (
                <AlertCircle className="h-5 w-5" strokeWidth={1.75} />
              )}
            </div>

            {/* Título opcional */}
            {title && (
              <h2
                className="mb-2 text-xl text-white"
                style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 500,
                  letterSpacing: "-0.01em",
                }}
              >
                {title}
              </h2>
            )}

            {/* Mensaje */}
            <p className="mb-7 text-[14px] leading-relaxed text-white/60">
              {message}
            </p>

            {/* Botones */}
            <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onCancel}
                className="px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.12em] text-white/55 transition-colors hover:text-white"
                style={{
                  border: "1px solid color-mix(in oklch, white 12%, transparent)",
                }}
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={() => { void onConfirm(); }}
                className="px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-opacity hover:opacity-90"
                style={{ background: confirmBg, color: confirmFg }}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
