"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * Toast custom — sin libreria externa.
 *
 * Renderiza un mensaje temporal en bottom-center con el accent dorado.
 * Auto-dismiss a los 2.8s. Si llega un toast nuevo mientras hay uno visible,
 * se reemplaza el contenido y se reinicia el timer.
 */

interface ToastContextValue {
  show: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_DURATION = 2800;

interface ToastEntry {
  id: number;
  message: string;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastEntry | null>(null);
  const idRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const reduce = useReducedMotion();

  const show = useCallback((message: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    idRef.current += 1;
    setToast({ id: idRef.current, message });
    timerRef.current = setTimeout(() => {
      setToast(null);
    }, TOAST_DURATION);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed inset-x-0 bottom-8 z-[200] flex justify-center px-4"
      >
        <AnimatePresence mode="wait">
          {toast && (
            <motion.div
              key={toast.id}
              role="status"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-sm px-5 py-3.5 text-center text-sm shadow-[0_12px_32px_rgba(0,0,0,0.15)]"
              style={{
                color: "var(--talent-ink, oklch(0.13 0 0))",
                background: "var(--talent-bg-elev, #1a1a1a)",
                border: "1px solid var(--accent)",
                borderLeftWidth: "3px",
              }}
            >
              {toast.message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used inside <ToastProvider>");
  }
  return ctx;
}
