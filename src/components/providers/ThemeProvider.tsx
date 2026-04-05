"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/** Returns "dark" between 19:00–06:59 and "light" between 07:00–18:59 */
function getThemeByHour(): Theme {
  const hour = new Date().getHours();
  return hour >= 7 && hour < 19 ? "light" : "dark";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [manualOverride, setManualOverride] = useState(false);

  // Initial theme: manual > time-based
  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    const wasManual = localStorage.getItem("theme-manual") === "true";

    let initial: Theme;
    if (stored && wasManual) {
      // User explicitly chose a theme — respect it
      initial = stored;
      setManualOverride(true);
    } else {
      // Auto mode: use time of day
      initial = getThemeByHour();
    }

    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  // Auto-update theme when the hour changes (if no manual override)
  useEffect(() => {
    if (manualOverride) return;

    const interval = setInterval(() => {
      const timeTheme = getThemeByHour();
      setTheme((prev) => {
        if (prev !== timeTheme) {
          document.documentElement.classList.toggle("dark", timeTheme === "dark");
          return timeTheme;
        }
        return prev;
      });
    }, 60_000); // check every minute

    return () => clearInterval(interval);
  }, [manualOverride]);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    setManualOverride(true);
    localStorage.setItem("theme", next);
    localStorage.setItem("theme-manual", "true");
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
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
