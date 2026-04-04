"use client";

import { useEffect, useRef } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Skip on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;
    // Skip if user prefers reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dot = dotRef.current!;
    const wrapper = wrapperRef.current!;
    const inner = innerRef.current!;

    // Activate cursor-none mode
    document.documentElement.dataset.customCursor = "true";

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let rafId: number;
    let hovering = false;
    let visible = false;

    function show() {
      if (!visible) {
        visible = true;
        dot.style.opacity = "1";
        wrapper.style.opacity = "1";
      }
    }

    function onMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Dot follows instantly
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      show();
    }

    function onOver(e: MouseEvent) {
      if (hovering) return;
      const el = (e.target as HTMLElement).closest(
        'a, button, [role="button"], label, select, input, textarea'
      );
      if (el) {
        hovering = true;
        inner.style.width = "48px";
        inner.style.height = "48px";
        inner.style.backgroundColor = "color-mix(in oklch, var(--primary) 12%, transparent)";
        inner.style.borderColor = "color-mix(in oklch, var(--primary) 70%, transparent)";
        dot.style.opacity = "0";
      }
    }

    function onOut(e: MouseEvent) {
      if (!hovering) return;
      const el = (e.target as HTMLElement).closest(
        'a, button, [role="button"], label, select, input, textarea'
      );
      if (el) {
        hovering = false;
        inner.style.width = "24px";
        inner.style.height = "24px";
        inner.style.backgroundColor = "transparent";
        inner.style.borderColor = "";
        dot.style.opacity = "1";
      }
    }

    function tick() {
      // Lerp ring position (lagged)
      ringX += (mouseX - ringX) * 0.1;
      ringY += (mouseY - ringY) * 0.1;
      wrapper.style.transform = `translate(${ringX}px, ${ringY}px)`;
      rafId = requestAnimationFrame(tick);
    }

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    rafId = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      cancelAnimationFrame(rafId);
      delete document.documentElement.dataset.customCursor;
    };
  }, []);

  return (
    <>
      {/* Dot — instant follow */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: "var(--primary)",
          opacity: 0,
          pointerEvents: "none",
          zIndex: 9999,
          transform: "translate(0px, 0px)",
          marginLeft: -3,
          marginTop: -3,
          transition: "opacity 0.2s",
          willChange: "transform",
        }}
      />

      {/* Ring — lagged follow with lerp */}
      <div
        ref={wrapperRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          opacity: 0,
          pointerEvents: "none",
          zIndex: 9998,
          transform: "translate(0px, 0px)",
          willChange: "transform",
        }}
      >
        <div
          ref={innerRef}
          style={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            border: "1px solid color-mix(in oklch, var(--primary) 50%, transparent)",
            backgroundColor: "transparent",
            marginLeft: -12,
            marginTop: -12,
            transition: "width 0.25s ease, height 0.25s ease, background-color 0.25s ease, border-color 0.25s ease, opacity 0.2s",
          }}
        />
      </div>
    </>
  );
}
