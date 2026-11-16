import { forwardRef, useState, type KeyboardEvent, type SyntheticEvent } from "react";
import { PromptLabel } from "./TerminalOutput";
import type { Completion } from "./useShell";

interface PromptInputProps {
  cwd: string;
  /** Most recent first. */
  history: string[];
  onSubmit: (value: string) => void;
  onComplete: (value: string) => Completion;
  onInterrupt: (value: string) => void;
  onClearScreen: () => void;
}

/** Pasted text arrives as one command line, like a shell with bracketed paste. */
const toSingleLine = (text: string) => text.replace(/\r?\n/g, " ");

/**
 * The live prompt line. A transparent native field handles typing, IME and
 * mobile keyboards; the visible text and block cursor are drawn on top of it.
 * It is a one-row textarea rather than an <input>: Safari ignores
 * autocomplete="off" and offers iCloud Passwords on inputs it guesses are
 * login fields, but never on textareas.
 */
const PromptInput = forwardRef<HTMLTextAreaElement, PromptInputProps>(function PromptInput(
  { cwd, history, onSubmit, onComplete, onInterrupt, onClearScreen },
  ref,
) {
  const [value, setValue] = useState("");
  const [caret, setCaret] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [draft, setDraft] = useState("");

  const isAtEnd = caret === value.length;
  // zsh-autosuggestions: complete from the most recent matching command.
  const ghost = value && isAtEnd ? (history.find((entry) => entry.startsWith(value) && entry !== value)?.slice(value.length) ?? "") : "";

  const update = (next: string, nextCaret = next.length) => {
    setValue(next);
    setCaret(nextCaret);
  };

  const syncCaret = (event: SyntheticEvent<HTMLTextAreaElement>) => {
    setCaret(event.currentTarget.selectionStart ?? event.currentTarget.value.length);
  };

  const browseHistory = (direction: 1 | -1) => {
    const nextIndex = Math.max(-1, Math.min(history.length - 1, historyIndex + direction));
    if (nextIndex === historyIndex) return;
    if (historyIndex === -1) setDraft(value);
    setHistoryIndex(nextIndex);
    update(nextIndex === -1 ? draft : history[nextIndex]);
  };

  const reset = () => {
    update("");
    setHistoryIndex(-1);
    setDraft("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.nativeEvent.isComposing) return;
    const key = event.key;
    const ctrl = event.ctrlKey && !event.metaKey && !event.altKey;

    if (key === "Enter") {
      event.preventDefault();
      onSubmit(value);
      reset();
    } else if (key === "Tab") {
      event.preventDefault();
      update(onComplete(value).value);
    } else if (key === "ArrowUp" || key === "ArrowDown") {
      event.preventDefault();
      browseHistory(key === "ArrowUp" ? 1 : -1);
    } else if ((key === "ArrowRight" || key === "End") && ghost) {
      event.preventDefault();
      update(value + ghost);
    } else if (ctrl && key === "c" && !window.getSelection()?.toString()) {
      event.preventDefault();
      onInterrupt(value);
      reset();
    } else if (ctrl && key === "l") {
      event.preventDefault();
      onClearScreen();
    } else if (ctrl && key === "u") {
      event.preventDefault();
      update(value.slice(caret), 0);
    }
  };

  const before = value.slice(0, caret);
  const atCursor = value[caret] ?? " ";
  const after = value.slice(caret + 1);

  return (
    <div className="flex flex-wrap">
      <PromptLabel cwd={cwd} />
      <span className="relative min-w-[2ch] flex-1">
        <span aria-hidden="true" className="whitespace-pre-wrap break-all text-[#d7dae0]">
          {before}
          <span className={isFocused ? "term-cursor bg-[#d7dae0] text-[#121314]" : "outline outline-1 -outline-offset-1 outline-[#d7dae0]/70"}>
            {atCursor}
          </span>
          {after}
          <span className="text-[#5c6370]">{ghost}</span>
        </span>
        <textarea
          ref={ref}
          rows={1}
          value={value}
          onChange={(event) => {
            const next = toSingleLine(event.target.value);
            update(next, Math.min(event.target.selectionStart ?? next.length, next.length));
            setHistoryIndex(-1);
          }}
          onSelect={syncCaret}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-label="Terminal command"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="send"
          // Opt out of password-manager extensions (1Password, LastPass, Dashlane).
          data-1p-ignore=""
          data-lpignore="true"
          data-form-type="other"
          className="absolute inset-0 h-full w-full cursor-text resize-none overflow-hidden bg-transparent text-base text-transparent caret-transparent opacity-0 outline-none md:text-[13px]"
        />
      </span>
    </div>
  );
});

export default PromptInput;
