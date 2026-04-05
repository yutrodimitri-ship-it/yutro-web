"use client";

import { motion, useReducedMotion } from "framer-motion";

type AnimationVariant =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "fade-scale"
  | "fade-blur"
  | "slide-left"
  | "slide-right";

interface FadeInOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  variant?: AnimationVariant;
  duration?: number;
}

const directionOffset = {
  up: { y: 60, x: 0 },
  down: { y: -60, x: 0 },
  left: { x: 60, y: 0 },
  right: { x: -60, y: 0 },
};

function getInitial(variant: AnimationVariant) {
  switch (variant) {
    case "fade-scale":
      return { opacity: 0, scale: 0.85, y: 30 };
    case "fade-blur":
      return { opacity: 0, filter: "blur(12px)", y: 20 };
    case "slide-left":
      return { opacity: 0, x: 120 };
    case "slide-right":
      return { opacity: 0, x: -120 };
    case "fade-up":
      return { opacity: 0, ...directionOffset.up };
    case "fade-down":
      return { opacity: 0, ...directionOffset.down };
    case "fade-left":
      return { opacity: 0, ...directionOffset.left };
    case "fade-right":
      return { opacity: 0, ...directionOffset.right };
  }
}

function getAnimate(variant: AnimationVariant) {
  switch (variant) {
    case "fade-scale":
      return { opacity: 1, scale: 1, y: 0 };
    case "fade-blur":
      return { opacity: 1, filter: "blur(0px)", y: 0 };
    case "slide-left":
    case "slide-right":
      return { opacity: 1, x: 0 };
    default:
      return { opacity: 1, x: 0, y: 0 };
  }
}

export function FadeInOnScroll({
  children,
  className,
  delay = 0,
  direction = "up",
  variant,
  duration = 0.6,
}: FadeInOnScrollProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  // If no variant specified, use legacy direction-based behavior
  const resolvedVariant = variant ?? (`fade-${direction}` as AnimationVariant);

  return (
    <motion.div
      className={className}
      initial={getInitial(resolvedVariant)}
      whileInView={getAnimate(resolvedVariant)}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}
