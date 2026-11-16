import { useCallback, useMemo, useRef, useState } from "react";
import { COMMAND_NAMES, expandAlias, findCommand, tokenize } from "./commands";
import { pathCandidates } from "./commands/files";
import { buildFileSystem, HOME } from "./filesystem";
import { error, longDate, seg } from "./format";
import { usePortfolioData } from "./usePortfolioData";
import type { Line, ShellActions, ShellContext } from "./types";

export type Entry =
  | { id: number; kind: "prompt"; cwd: string; input: string; isInterrupted?: boolean }
  | { id: number; kind: "line"; line: Line };

/** Scrollback limit, like a terminal's buffer size. */
const MAX_ENTRIES = 600;
const MAX_HISTORY = 200;
const LAST_LOGIN_KEY = "terminal:last-login";

let entryId = 0;
const nextId = () => ++entryId;

function toEntries(lines: Line[]): Entry[] {
  return lines.map((line) => ({ id: nextId(), kind: "line", line }));
}

/** "Last login" uses this visitor's previous session when we have one. */
function loginBanner(): Entry[] {
  let previous: Date | null = null;
  try {
    const stored = Number(localStorage.getItem(LAST_LOGIN_KEY));
    if (stored > 0) previous = new Date(stored);
    localStorage.setItem(LAST_LOGIN_KEY, String(Date.now()));
  } catch {
    // Storage blocked (private mode); fall back to now.
  }
  return toEntries([
    [seg(`Last login: ${longDate(previous ?? new Date())} on ttys001`)],
    [seg("Type "), seg("help", "exec"), seg(" to see what you can do here.")],
  ]);
}

function commonPrefix(values: string[]): string {
  return values.reduce((prefix, value) => {
    let i = 0;
    while (i < prefix.length && prefix[i] === value[i]) i++;
    return prefix.slice(0, i);
  });
}

export interface Completion {
  value: string;
  /** Shown under the prompt when the match is ambiguous, like zsh's menu. */
  candidates: string[];
}

export function useShell(actions: Omit<ShellActions, "clear">) {
  const data = usePortfolioData();
  const fs = useMemo(() => buildFileSystem(data), [data]);
  const [cwd, setCwd] = useState(HOME);
  const previousCwd = useRef(HOME);
  const [entries, setEntries] = useState<Entry[]>(loginBanner);
  const [history, setHistory] = useState<string[]>([]);
  const [isBusy, setIsBusy] = useState(false);

  const push = useCallback((added: Entry[]) => {
    setEntries((prev) => [...prev, ...added].slice(-MAX_ENTRIES));
  }, []);

  const makeContext = useCallback(
    (overrides: Partial<ShellContext> = {}): ShellContext => ({
      cwd,
      previousCwd: previousCwd.current,
      setCwd: (path) => {
        previousCwd.current = cwd;
        setCwd(path);
      },
      fs,
      data,
      history,
      actions: { ...actions, clear: () => undefined },
      ...overrides,
    }),
    [cwd, fs, data, history, actions],
  );

  const execute = useCallback(
    async (input: string) => {
      push([{ id: nextId(), kind: "prompt", cwd, input }]);
      const trimmed = input.trim();
      if (!trimmed) return;

      const nextHistory = history[0] === trimmed ? history : [trimmed, ...history].slice(0, MAX_HISTORY);
      setHistory(nextHistory);

      const [name, ...args] = expandAlias(tokenize(trimmed));
      const command = findCommand(name);
      if (!command) {
        push(toEntries(error(`zsh: command not found: ${name}`)));
        return;
      }

      let shouldClear = false;
      const ctx = makeContext({
        history: nextHistory,
        actions: { ...actions, clear: () => (shouldClear = true) },
      });

      try {
        const pending = command.run(args, ctx);
        if (pending instanceof Promise) setIsBusy(true);
        const lines = await pending;
        if (shouldClear) setEntries([]);
        else if (lines?.length) push(toEntries(lines));
      } catch (err: unknown) {
        push(toEntries(error(`${name}: ${err instanceof Error ? err.message : "command failed"}`)));
      } finally {
        setIsBusy(false);
      }
    },
    [actions, cwd, history, makeContext, push],
  );

  /** Ctrl+C: keep the typed line, mark it interrupted, start a fresh prompt. */
  const interrupt = useCallback(
    (input: string) => push([{ id: nextId(), kind: "prompt", cwd, input, isInterrupted: true }]),
    [cwd, push],
  );

  const clearScreen = useCallback(() => setEntries([]), []);

  const complete = useCallback(
    (input: string): Completion => {
      const tokens = tokenize(input);
      const endsWithSpace = /\s$/.test(input);
      if (!tokens.length) return { value: input, candidates: [] };

      const partial = endsWithSpace ? "" : (tokens.at(-1) ?? "");
      const isCommandWord = tokens.length === 1 && !endsWithSpace;
      const ctx = makeContext();
      const command = isCommandWord ? undefined : findCommand(expandAlias([tokens[0]])[0]);
      const options = isCommandWord
        ? COMMAND_NAMES.filter((name) => name.startsWith(partial))
        : (command?.complete?.(tokens.slice(1), ctx).filter((option) => option.startsWith(partial)) ??
          pathCandidates(partial, ctx));

      if (!options.length) return { value: input, candidates: [] };
      const head = input.slice(0, input.length - partial.length);
      if (options.length === 1) {
        const [only] = options;
        return { value: `${head}${only}${only.endsWith("/") ? "" : " "}`, candidates: [] };
      }
      const prefix = commonPrefix(options);
      const showMenu = prefix.length <= partial.length;
      const names = options.map((option) => option.replace(/\/$/, "").split("/").pop() + (option.endsWith("/") ? "/" : ""));
      if (showMenu) push(toEntries([[seg(names.join("  "))]]));
      return { value: head + prefix, candidates: showMenu ? names : [] };
    },
    [makeContext, push],
  );

  return { cwd, entries, history, isBusy, execute, interrupt, clearScreen, complete };
}
