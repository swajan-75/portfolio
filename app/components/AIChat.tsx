"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { FiChevronDown, FiMessageCircle } from "react-icons/fi";
import ChatPanel, { CHAT_TITLE_ID } from "./chat/ChatPanel";
import { useChat } from "./chat/useChat";

/**
 * Floating assistant. On phones the panel fills the screen; from md up it
 * opens above the launcher. The conversation survives closing and reopening.
 */
export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const chat = useChat();
  const launcherRef = useRef<HTMLButtonElement>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const reduceMotion = useReducedMotion();

  const close = useCallback(() => {
    setIsOpen(false);
    launcherRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    composerRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, close]);

  const panelMotion = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 16, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 12, scale: 0.98 },
      };

  return (
    // While open, sit above the mobile menu button (also z-50) so it can't cover the close button.
    <div
      className={`fixed bottom-24 right-4 flex flex-col items-end sm:bottom-6 sm:right-6 md:right-8 lg:bottom-8 ${isOpen ? "z-[60]" : "z-50"}`}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.section
            key="chat-panel"
            role="dialog"
            aria-labelledby={CHAT_TITLE_ID}
            {...panelMotion}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: "bottom right" }}
            className="chat-panel fixed inset-0 flex h-dvh flex-col overflow-hidden bg-surface pb-[env(safe-area-inset-bottom)]
                       md:static md:mb-4 md:h-[min(560px,calc(100dvh-9rem))] md:w-[380px] md:rounded-2xl md:border md:border-border-strong md:pb-0"
          >
            <ChatPanel ref={composerRef} chat={chat} onClose={close} />
          </motion.section>
        )}
      </AnimatePresence>

      <button
        ref={launcherRef}
        type="button"
        onClick={() => (isOpen ? close() : setIsOpen(true))}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        aria-expanded={isOpen}
        className={`${isOpen ? "hidden md:flex" : "flex"} chat-launcher h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-accent text-[#fff] transition-[background-color,transform] duration-200 hover:bg-accent-light motion-safe:hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg`}
      >
        {isOpen ? <FiChevronDown size={24} aria-hidden="true" /> : <FiMessageCircle size={24} aria-hidden="true" />}
      </button>
    </div>
  );
}
