import { forwardRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { FiArrowUp } from "react-icons/fi";

const MAX_LENGTH = 1000;

interface ChatComposerProps {
  isSending: boolean;
  onSend: (text: string) => void;
}

/** Enter sends, Shift+Enter adds a line. */
const ChatComposer = forwardRef<HTMLTextAreaElement, ChatComposerProps>(function ChatComposer(
  { isSending, onSend },
  ref,
) {
  const [draft, setDraft] = useState("");
  const canSend = draft.trim() !== "" && !isSending;

  const submit = () => {
    if (!canSend) return;
    onSend(draft);
    setDraft("");
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    submit();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="shrink-0 border-t border-border px-3 pb-3 pt-3">
      <div className="flex items-end gap-2 rounded-2xl border border-border-strong bg-surface-tint py-1.5 pl-4 pr-1.5 transition-colors focus-within:border-accent/70">
        <label htmlFor="chat-composer" className="sr-only">
          Message
        </label>
        <textarea
          id="chat-composer"
          ref={ref}
          rows={1}
          value={draft}
          maxLength={MAX_LENGTH}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question…"
          className="field-sizing-content max-h-28 min-h-9 flex-1 resize-none bg-transparent py-2 text-base text-white outline-none placeholder:text-white/35 md:text-sm"
        />
        <button
          type="submit"
          disabled={!canSend}
          aria-label="Send message"
          className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-accent text-[#fff] transition-colors duration-150 hover:bg-accent-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/35"
        >
          <FiArrowUp size={18} aria-hidden="true" />
        </button>
      </div>
      <p className="mt-2 text-center text-[11px] text-white/35">Answers are AI-generated and may be inaccurate.</p>
    </form>
  );
});

export default ChatComposer;
