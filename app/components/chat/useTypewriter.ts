import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

/** Base reveal speed, close to how fast streamed model output arrives. */
const CHARS_PER_SECOND = 180;
/** Long answers speed up so no reply takes longer than this to finish typing. */
const MAX_DURATION_MS = 1200;

/**
 * Reveals `text` progressively, paced by elapsed time rather than frame count
 * so the speed is the same on 60Hz and 120Hz screens. When disabled, or when
 * the user prefers reduced motion, the full text shows at once and `onDone`
 * fires immediately.
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

    const charsPerMs = Math.max(CHARS_PER_SECOND / 1000, chars.length / MAX_DURATION_MS);
    let start: number | null = null;
    let frame = 0;

    const step = (now: number) => {
      start ??= now;
      const shown = Math.min(chars.length, Math.ceil((now - start) * charsPerMs));
      setCount(shown);
      if (shown >= chars.length) {
        onDoneRef.current?.();
        return;
      }
      frame = window.requestAnimationFrame(step);
    };
    frame = window.requestAnimationFrame(step);

    return () => window.cancelAnimationFrame(frame);
  }, [chars, shouldType, isEnabled]);

  const visibleCount = shouldType ? count : chars.length;
  return {
    visibleText: chars.slice(0, visibleCount).join(""),
    isTyping: visibleCount < chars.length,
  };
}
