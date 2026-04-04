"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface TextRevealProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
}

export function TextReveal({
  text,
  className,
  style,
  as: Tag = "h1",
  delay = 0,
}: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !containerRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const chars = containerRef.current.querySelectorAll(".char");

    gsap.set(chars, { opacity: 0, y: 50 });

    gsap.to(chars, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.03,
      delay,
      ease: "power3.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        once: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === containerRef.current) st.kill();
      });
    };
  }, [text, delay]);

  const words = text.split(" ");

  return (
    <div ref={containerRef} className="overflow-hidden">
      <Tag className={className} style={style}>
        {words.map((word, wordIdx) => (
          <span key={wordIdx} className="inline-block whitespace-nowrap">
            {word.split("").map((char, charIdx) => (
              <span key={charIdx} className="char inline-block">
                {char}
              </span>
            ))}
            {wordIdx < words.length - 1 && (
              <span className="char inline-block">&nbsp;</span>
            )}
          </span>
        ))}
      </Tag>
    </div>
  );
}
