"use client";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { Theme } from "@/app/hooks/useTheme";
import { displayPath } from "./filesystem";
import PromptInput from "./PromptInput";
import TerminalOutput from "./TerminalOutput";
import { useShell } from "./useShell";

interface TerminalWindowProps {
  isMinimized: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onNavigate: (section: string) => void;
  theme: Theme;
  onSetTheme: (theme: Theme) => void;
}

function openUrl(url: string) {
  if (url.startsWith("mailto:")) window.location.href = url;
  else window.open(url, "_blank", "noopener,noreferrer");
}

export default function TerminalWindow({
  isMinimized,
  onClose,
  onMinimize,
  onNavigate,
  theme,
  onSetTheme,
}: TerminalWindowProps) {
  const [isMaximized, setIsMaximized] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const reduceMotion = useReducedMotion();

  const actions = useMemo(
    () => ({ close: onClose, openUrl, navigate: onNavigate, setTheme: onSetTheme, theme }),
    [onClose, onNavigate, onSetTheme, theme],
  );
  const shell = useShell(actions);

  // Keep the prompt in view as output arrives.
  useLayoutEffect(() => {
    const body = bodyRef.current;
    if (body) body.scrollTop = body.scrollHeight;
  }, [shell.entries, shell.isBusy]);

  useEffect(() => {
    if (!isMinimized) inputRef.current?.focus();
  }, [isMinimized, shell.isBusy]);

  useEffect(() => {
    if (isMinimized) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMinimized, onClose]);

  // Clicking the body focuses the prompt, unless the visitor is selecting text to copy.
  const focusPrompt = useCallback(() => {
    if (!window.getSelection()?.toString()) inputRef.current?.focus();
  }, []);

  const handleBackdrop = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onMinimize();
  };

  const size = isMaximized
    ? "h-[92dvh] max-w-[min(1200px,96vw)]"
    : "h-[min(540px,82dvh)] max-w-[780px]";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      onMouseDown={handleBackdrop}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#000]/45 p-2 sm:p-6 ${isMinimized ? "hidden" : ""}`}
    >
      <motion.section
        role="dialog"
        aria-modal="true"
        aria-label="Terminal"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 8 }}
        transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
        className={`term-window flex w-full flex-col overflow-hidden rounded-[10px] border border-[#3a3b3f] bg-[#121314] transition-[max-width,height] duration-200 ${size}`}
      >
        <TitleBar
          title={`guest@swajan: ${displayPath(shell.cwd)} — zsh`}
          isMaximized={isMaximized}
          onClose={onClose}
          onMinimize={onMinimize}
          onToggleMaximize={() => setIsMaximized((value) => !value)}
        />

        <div
          ref={bodyRef}
          onClick={focusPrompt}
          className="term-scroll flex-1 overflow-y-auto px-3.5 py-3 font-[family-name:var(--font-geist-mono)] text-[12.5px] leading-[1.6] text-[#d7dae0] sm:text-[13px]"
        >
          <TerminalOutput entries={shell.entries} />
          {shell.isBusy ? (
            <span aria-hidden="true" className="term-cursor inline-block w-[1ch] bg-[#d7dae0]">
              {" "}
            </span>
          ) : (
            <PromptInput
              ref={inputRef}
              cwd={shell.cwd}
              history={shell.history}
              onSubmit={shell.execute}
              onComplete={shell.complete}
              onInterrupt={shell.interrupt}
              onClearScreen={shell.clearScreen}
            />
          )}
        </div>
      </motion.section>
    </motion.div>
  );
}

interface TitleBarProps {
  title: string;
  isMaximized: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onToggleMaximize: () => void;
}

/** macOS-style traffic lights; their glyphs appear when the group is hovered. */
function TitleBar({ title, isMaximized, onClose, onMinimize, onToggleMaximize }: TitleBarProps) {
  const lights = [
    { label: "Close terminal", color: "bg-[#ff5f57]", glyph: "×", onClick: onClose },
    { label: "Minimize terminal", color: "bg-[#febc2e]", glyph: "−", onClick: onMinimize },
    { label: isMaximized ? "Restore terminal size" : "Maximize terminal", color: "bg-[#28c840]", glyph: isMaximized ? "↙" : "+", onClick: onToggleMaximize },
  ];

  return (
    <div
      onDoubleClick={onToggleMaximize}
      className="relative flex h-9 shrink-0 select-none items-center border-b border-[#000]/60 bg-gradient-to-b from-[#2e2f33] to-[#26272a] px-3"
    >
      <div className="group/lights z-10 flex items-center gap-2">
        {lights.map((light) => (
          <button
            key={light.label}
            type="button"
            aria-label={light.label}
            onClick={light.onClick}
            onDoubleClick={(event) => event.stopPropagation()}
            className={`flex h-3 w-3 cursor-default items-center justify-center rounded-full ${light.color} text-[9px] font-bold leading-none text-[#000]/0 ring-1 ring-[#000]/25 transition-colors group-hover/lights:text-[#000]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fff]/70`}
          >
            <span aria-hidden="true">{light.glyph}</span>
          </button>
        ))}
      </div>
      <p className="pointer-events-none absolute inset-x-20 truncate text-center text-[12.5px] font-medium text-[#a1a4aa]">
        {title}
      </p>
    </div>
  );
}
