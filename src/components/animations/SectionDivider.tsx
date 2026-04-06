"use client";

import { motion, useReducedMotion } from "framer-motion";

export function SectionDivider({ className }: { className?: string }) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return (
      <div className={`mx-auto h-px w-full max-w-xs bg-border/40 ${className ?? ""}`} />
    );
  }

  return (
    <div className={`relative flex items-center justify-center py-2 ${className ?? ""}`}>
      <motion.div
        className="h-px origin-right bg-gradient-to-l from-primary/60 to-transparent"
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: false, margin: "-40px" }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: "min(40vw, 300px)" }}
      />
      <motion.div
        className="mx-3 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: false, margin: "-40px" }}
        transition={{ duration: 0.4, delay: 0.5, ease: "easeOut" }}
      />
      <motion.div
        className="h-px origin-left bg-gradient-to-r from-primary/60 to-transparent"
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: false, margin: "-40px" }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: "min(40vw, 300px)" }}
      />
    </div>
  );
}
