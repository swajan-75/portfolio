import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

const TICK_MS = 16;
/** Long answers speed up so no reply takes longer than this to finish typing. */
const MAX_DURATION_MS = 2500;
const MIN_CHARS_PER_TICK = 1;

/**
 * Reveals `text` a few characters per frame. When disabled, or when the user
 * prefers reduced motion, the full text shows at once and `onDone` fires immediately.
 */
export function useTypewriter(text: string, isEnabled: boolean, onDone?: () => void) {
  const reduceMotion = useReducedMotion();
  const shouldType = isEnabled && !reduceMotion;
  // Array.from keeps emoji and other surrogate pairs whole.
  const chars = useMemo(() => Array.from(text), [text]);
  const [count, setCount] = useState(shouldType ? 0 : chars.length);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    if (!shouldType) {
      if (isEnabled) onDoneRef.current?.();
      return;
    }

    const perTick = Math.max(MIN_CHARS_PER_TICK, Math.ceil((chars.length * TICK_MS) / MAX_DURATION_MS));
    let shown = 0;
    const timer = window.setInterval(() => {
      shown = Math.min(chars.length, shown + perTick);
      setCount(shown);
      if (shown >= chars.length) {
        window.clearInterval(timer);
        onDoneRef.current?.();
      }
    }, TICK_MS);

    return () => window.clearInterval(timer);
  }, [chars, shouldType, isEnabled]);

  const visibleCount = shouldType ? count : chars.length;
  return {
    visibleText: chars.slice(0, visibleCount).join(""),
    isTyping: visibleCount < chars.length,
  };
}
