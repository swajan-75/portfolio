import { forwardRef } from "react";
import Image from "next/image";
import { FiX } from "react-icons/fi";
import avatar from "../../images/logo.jpg";
import ChatComposer from "./ChatComposer";
import ChatMessages from "./ChatMessages";
import type { useChat } from "./useChat";

export const CHAT_TITLE_ID = "chat-panel-title";

interface ChatPanelProps {
  chat: ReturnType<typeof useChat>;
  onClose: () => void;
}

/** Header, message log and composer. The caller owns chat state, positioning and animation. */
const ChatPanel = forwardRef<HTMLTextAreaElement, ChatPanelProps>(function ChatPanel({ chat, onClose }, composerRef) {
  const { messages, isSending, isTyping, send, markTyped, hasUserMessages } = chat;

  return (
    <>
      <header className="flex shrink-0 items-center gap-3 border-b border-border px-4 py-3.5">
        <div className="relative shrink-0">
          <Image
            src={avatar}
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 rounded-full object-cover ring-1 ring-border-strong"
          />
          <span
            aria-hidden="true"
            className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-surface bg-emerald-500"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h2 id={CHAT_TITLE_ID} className="truncate text-sm font-semibold leading-tight text-white">
            Mr. Meeseeks
          </h2>
          <p className="truncate text-xs text-white/50">Assistant for Swajan&apos;s portfolio</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat"
          className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-white/60 transition-colors duration-150 hover:bg-surface-tint-hover hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <FiX size={18} aria-hidden="true" />
        </button>
      </header>

      <ChatMessages
        messages={messages}
        isSending={isSending}
        showSuggestions={!hasUserMessages && !isTyping}
        onSuggestion={send}
        onTyped={markTyped}
      />

      <ChatComposer ref={composerRef} isSending={isSending} onSend={send} />
    </>
  );
});

export default ChatPanel;
