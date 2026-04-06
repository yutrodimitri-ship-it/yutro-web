"use client";

import { createContext, useContext, useRef, useState, useEffect } from "react";

type Direction = "up" | "down";
const ScrollDirectionContext = createContext<Direction>("down");

export function ScrollDirectionProvider({ children }: { children: React.ReactNode }) {
  const [direction, setDirection] = useState<Direction>("down");
  const prev = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - prev.current) > 2) {
        setDirection(y > prev.current ? "down" : "up");
        prev.current = y;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <ScrollDirectionContext.Provider value={direction}>
      {children}
    </ScrollDirectionContext.Provider>
  );
}

export const useScrollDirection = () => useContext(ScrollDirectionContext);
