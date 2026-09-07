import { useCallback, useEffect, useLayoutEffect, useState } from "react";

const STORAGE_KEY = "bento-layout-v1";

// useLayoutEffect warns during SSR; fall back to useEffect on the server so the
// saved order is applied before paint on the client without a hydration warning.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function readStoredOrder(): string[] | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed.filter((id): id is string => typeof id === "string");
  } catch {
    // Private mode, cleared storage, or corrupt JSON — fall back to defaults.
    return null;
  }
}

/**
 * Reconciles a saved order against the cards that currently exist: drops ids
 * that were removed from the registry and appends cards added since the visitor
 * last saved, so a stale layout never hides new content.
 */
function reconcile(saved: string[], defaultOrder: string[]): string[] {
  const valid = new Set(defaultOrder);
  const kept = saved.filter((id) => valid.has(id));
  const seen = new Set(kept);
  const added = defaultOrder.filter((id) => !seen.has(id));
  return [...kept, ...added];
}

export function useBentoLayout(defaultOrder: string[]) {
  // Server and first client render both use the default order so hydration
  // matches; the stored order is applied below, before the browser paints.
  const [order, setOrder] = useState<string[]>(defaultOrder);
  const [isCustomized, setIsCustomized] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const saved = readStoredOrder();
    if (!saved) return;
    const next = reconcile(saved, defaultOrder);
    setOrder(next);
    setIsCustomized(next.join() !== defaultOrder.join());
    // defaultOrder is a module-level constant; intentionally read once on mount.
  }, []);

  const persist = useCallback(
    (next: string[]) => {
      setOrder(next);
      setIsCustomized(next.join() !== defaultOrder.join());
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Storage unavailable — the layout still works for this session.
      }
    },
    [defaultOrder],
  );

  const reset = useCallback(() => {
    setOrder(defaultOrder);
    setIsCustomized(false);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Nothing to clean up if storage is unavailable.
    }
  }, [defaultOrder]);

  return { order, persist, reset, isCustomized };
}
