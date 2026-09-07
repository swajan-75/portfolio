"use client";
import { useCallback, useLayoutEffect, useEffect, useState } from "react";

export type Theme = "dark" | "light";

const STORAGE_KEY = "theme";

// useLayoutEffect warns during SSR; fall back to useEffect on the server so
// reading the already-applied data-theme attribute happens before paint on
// the client without a hydration warning (same pattern as useBentoLayout).
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

function applyTheme(theme: Theme) {
  if (theme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
}

/**
 * Dark is the default (no attribute); light is opt-in via [data-theme="light"]
 * on <html>, matching the inline no-flash script in layout.tsx that applies
 * a stored choice before hydration.
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    setThemeState(isLight ? "light" : "dark");
    setMounted(true);
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    applyTheme(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage unavailable — theme still applies for this session.
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return { theme, setTheme, toggleTheme, mounted };
}
