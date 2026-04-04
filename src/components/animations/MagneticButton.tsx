"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

export function MagneticButton({
  children,
  className,
  strength = 20,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  // useMotionValue keeps transforms out of the React render cycle
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Spring physics — premium feel per skill §4
  const x = useSpring(rawX, { stiffness: 150, damping: 18, mass: 0.5 });
  const y = useSpring(rawY, { stiffness: 150, damping: 18, mass: 0.5 });

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = ref.current.getBoundingClientRect();
    const cx = e.clientX - rect.left - rect.width / 2;
    const cy = e.clientY - rect.top - rect.height / 2;

    rawX.set((cx / rect.width) * strength);
    rawY.set((cy / rect.height) * strength);
  }

  function onMouseLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  return (
    <motion.div
      ref={ref}
      style={{ x, y, display: "inline-block" }}
      className={className}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </motion.div>
  );
}
