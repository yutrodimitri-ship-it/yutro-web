"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

interface ThemeState {
  theme: Theme;
  manual: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/** Returns "dark" between 19:00–06:59 and "light" between 07:00–18:59 */
function getThemeByHour(): Theme {
  const hour = new Date().getHours();
  return hour >= 7 && hour < 19 ? "light" : "dark";
}

/**
 * SSR-safe initial read. `app/layout.tsx` sets `suppressHydrationWarning`
 * on <html>, so any client/server mismatch on the first paint won't warn.
 */
function readInitialState(): ThemeState {
  if (typeof window === "undefined") {
    return { theme: "light", manual: false };
  }
  const stored = localStorage.getItem("theme") as Theme | null;
  const wasManual = localStorage.getItem("theme-manual") === "true";
  if (stored && wasManual) return { theme: stored, manual: true };
  return { theme: getThemeByHour(), manual: false };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Lazy initializer — runs once, before paint. Avoids the
  // set-state-in-effect anti-pattern for reading from localStorage.
  const [state, setState] = useState<ThemeState>(readInitialState);

  // Sync the <html class="dark"> with the chosen theme — this is the
  // legitimate "sync external system" use of useEffect.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", state.theme === "dark");
  }, [state.theme]);

  // Auto-update theme when the hour changes (if no manual override).
  useEffect(() => {
    if (state.manual) return;
    const interval = setInterval(() => {
      const timeTheme = getThemeByHour();
      setState((prev) =>
        prev.theme === timeTheme ? prev : { ...prev, theme: timeTheme }
      );
    }, 60_000);
    return () => clearInterval(interval);
  }, [state.manual]);

  const toggleTheme = () => {
    const next: Theme = state.theme === "light" ? "dark" : "light";
    setState({ theme: next, manual: true });
    localStorage.setItem("theme", next);
    localStorage.setItem("theme-manual", "true");
  };

  return (
    <ThemeContext.Provider value={{ theme: state.theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
