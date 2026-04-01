"use client";

import { useRef, useState, useCallback } from "react";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number; // pixels of magnetic pull (default 20)
}

export function MagneticButton({
  children,
  className,
  strength = 20,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("translate3d(0, 0, 0)");

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReduced) return;

      const rect = ref.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const pullX = (x / rect.width) * strength;
      const pullY = (y / rect.height) * strength;

      setTransform(`translate3d(${pullX}px, ${pullY}px, 0)`);
    },
    [strength]
  );

  const handleMouseLeave = useCallback(() => {
    setTransform("translate3d(0, 0, 0)");
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transition: transform === "translate3d(0, 0, 0)" ? "transform 0.5s cubic-bezier(0.33, 1, 0.68, 1)" : "transform 0.15s ease-out",
        display: "inline-block",
      }}
    >
      {children}
    </div>
  );
}
