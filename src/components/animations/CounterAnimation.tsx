"use client";

import { useEffect, useRef, useState } from "react";
import {
  useMotionValue,
  useSpring,
  useInView,
  useReducedMotion,
} from "framer-motion";

interface CounterProps {
  /** Numeric target value */
  value: number;
  /** Text appended after the number (e.g. "+", "%") */
  suffix?: string;
  className?: string;
  /** Spring stiffness — lower = slower count (default 40) */
  stiffness?: number;
}

export function Counter({
  value,
  suffix = "",
  className,
  stiffness = 40,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });
  const prefersReduced = useReducedMotion();
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, {
    stiffness,
    damping: 30,
    mass: 1,
  });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  useEffect(() => {
    if (prefersReduced) {
      setDisplay(String(value));
      return;
    }
    const unsubscribe = spring.on("change", (v) => {
      setDisplay(String(Math.round(v)));
    });
    return unsubscribe;
  }, [spring, prefersReduced, value]);

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
}
