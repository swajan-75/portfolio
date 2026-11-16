import { useCallback, useEffect, useRef } from "react";
import type { ChatMessage } from "./useChat";
import { useTypewriter } from "./useTypewriter";

/** Within this many px of the bottom counts as "following" new text. */
const STICK_THRESHOLD_PX = 48;

const SUGGESTIONS = [
  "What has Swajan built?",
  "What's his tech stack?",
  "How can I contact him?",
] as const;

interface ChatMessagesProps {
  messages: ChatMessage[];
  isSending: boolean;
  showSuggestions: boolean;
  onSuggestion: (text: string) => void;
  onTyped: (id: number) => void;
}

export default function ChatMessages({
  messages,
  isSending,
  showSuggestions,
  onSuggestion,
  onTyped,
}: ChatMessagesProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isPinnedRef = useRef(true);

  const handleScroll = () => {
    const list = listRef.current;
    if (!list) return;
    isPinnedRef.current =
      list.scrollHeight - list.scrollTop - list.clientHeight <
      STICK_THRESHOLD_PX;
  };

  // Follow the conversation as it grows (new messages and typing text) unless
  // the reader has scrolled up. Scrolls only the list, never the page behind it.
  useEffect(() => {
    const list = listRef.current;
    const content = contentRef.current;
    if (!list || !content) return;
    const observer = new ResizeObserver(() => {
      if (isPinnedRef.current) list.scrollTop = list.scrollHeight;
    });
    observer.observe(content);
    return () => observer.disconnect();
  }, []);

  // Sending always jumps back to the latest message.
  useEffect(() => {
    if (isSending) isPinnedRef.current = true;
  }, [isSending]);

  return (
    <div
      ref={listRef}
      onScroll={handleScroll}
      role="log"
      aria-live="polite"
      aria-relevant="additions"
      className="custom-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-5"
    >
      <div ref={contentRef} className="flex flex-col gap-2.5">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} onTyped={onTyped} />
        ))}

        {isSending && <TypingIndicator />}

        {showSuggestions && !isSending && (
          <div className="mt-2 flex flex-col items-start gap-2">
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => onSuggestion(suggestion)}
                className="cursor-pointer rounded-full border border-border-strong bg-transparent px-3.5 py-1.5 text-left text-[13px] font-medium text-white/75 transition-colors duration-150 hover:border-accent/50 hover:bg-accent/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  onTyped,
}: {
  message: ChatMessage;
  onTyped: (id: number) => void;
}) {
  const isUser = message.role === "user";
  const handleDone = useCallback(
    () => onTyped(message.id),
    [onTyped, message.id],
  );
  const { visibleText, isTyping } = useTypewriter(
    message.text,
    message.isTyping,
    handleDone,
  );

  return (
    <div
      className={`max-w-[85%] whitespace-pre-wrap break-words px-3.5 py-2.5 text-sm leading-relaxed ${
        isUser
          ? "self-end rounded-2xl rounded-br-md bg-accent text-[#fff]"
          : "self-start rounded-2xl rounded-bl-md border border-border bg-surface-tint text-white/85"
      }`}
    >
      {/* Screen readers get the whole message at once; the typed copy is visual only. */}
      <span className="sr-only">
        {isUser ? "You: " : "Assistant: "}
        {message.text}
      </span>
      <span aria-hidden="true">
        {visibleText}
        {isTyping && (
          <span className="chat-caret ml-px inline-block h-[1.1em] w-[2px] translate-y-[3px] rounded-full bg-accent-light" />
        )}
      </span>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 self-start rounded-2xl rounded-bl-md border border-border bg-surface-tint px-3.5 py-3.5">
      <span className="sr-only">Assistant is typing</span>
      {[0, 1, 2].map((dot) => (
        <span
          key={dot}
          aria-hidden="true"
          className="chat-typing-dot h-1.5 w-1.5 rounded-full bg-white/45"
          style={{ animationDelay: `${dot * 160}ms` }}
        />
      ))}
    </div>
  );
}
