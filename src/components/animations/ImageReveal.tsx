"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface ImageRevealProps {
  children: React.ReactNode;
  direction?: "left" | "right" | "up" | "down";
  delay?: number;
  className?: string;
}

export function ImageReveal({
  children,
  direction = "left",
  delay = 0,
  className,
}: ImageRevealProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced || !wrapperRef.current || !maskRef.current || !contentRef.current)
      return;

    gsap.registerPlugin(ScrollTrigger);

    // Initial states based on direction
    const maskFrom: gsap.TweenVars = {};
    const maskTo: gsap.TweenVars = {};
    const contentFrom: gsap.TweenVars = { scale: 1.3 };
    const contentTo: gsap.TweenVars = { scale: 1 };

    switch (direction) {
      case "left":
        maskFrom.clipPath = "inset(0 100% 0 0)";
        maskTo.clipPath = "inset(0 0% 0 0)";
        break;
      case "right":
        maskFrom.clipPath = "inset(0 0 0 100%)";
        maskTo.clipPath = "inset(0 0 0 0%)";
        break;
      case "up":
        maskFrom.clipPath = "inset(100% 0 0 0)";
        maskTo.clipPath = "inset(0% 0 0 0)";
        break;
      case "down":
        maskFrom.clipPath = "inset(0 0 100% 0)";
        maskTo.clipPath = "inset(0 0 0% 0)";
        break;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapperRef.current,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });

    tl.fromTo(maskRef.current, maskFrom, {
      ...maskTo,
      duration: 1,
      delay,
      ease: "power3.inOut",
    }).fromTo(
      contentRef.current,
      contentFrom,
      {
        ...contentTo,
        duration: 1.2,
        ease: "power2.out",
      },
      0
    );

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [direction, delay]);

  return (
    <div ref={wrapperRef} className={className}>
      <div ref={maskRef} className="overflow-hidden" style={{ clipPath: "inset(0 100% 0 0)" }}>
        <div ref={contentRef}>{children}</div>
      </div>
    </div>
  );
}
