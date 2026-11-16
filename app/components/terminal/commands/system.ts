import { HOME } from "../filesystem";
import { error, longDate, seg } from "../format";
import type { Command, ShellContext } from "../types";

const SECTIONS = ["home", "skills", "projects", "contact"] as const;
const THEMES = ["dark", "light"] as const;

function variables(ctx: ShellContext): Record<string, string> {
  return { USER: "guest", HOME, SHELL: "/bin/zsh", PWD: ctx.cwd, TERM: "xterm-256color" };
}

const clear: Command = {
  name: "clear",
  summary: "Clear the screen (Ctrl+L)",
  group: "System",
  run: (_args, ctx) => ctx.actions.clear(),
};

const history: Command = {
  name: "history",
  summary: "Show command history",
  group: "System",
  run: (_args, ctx) =>
    [...ctx.history].reverse().map((entry, i) => [seg(String(i + 1).padStart(5), "muted"), seg(`  ${entry}`)]),
};

const echo: Command = {
  name: "echo",
  summary: "Print text ($USER, $HOME, $PWD expand)",
  usage: "echo [text]",
  group: "System",
  run(args, ctx) {
    const vars = variables(ctx);
    const text = args.join(" ").replace(/\$(\w+)/g, (_match, name: string) => vars[name] ?? "");
    return [[seg(text)]];
  },
};

const whoami: Command = {
  name: "whoami",
  summary: "Print the current user",
  group: "System",
  run: () => [[seg("guest")]],
};

const date: Command = {
  name: "date",
  summary: "Print the date and time",
  group: "System",
  run() {
    const now = new Date();
    const zone = new Intl.DateTimeFormat("en-US", { timeZoneName: "short" })
      .formatToParts(now)
      .find((part) => part.type === "timeZoneName")?.value;
    return [[seg(`${longDate(now)} ${zone ?? ""} ${now.getFullYear()}`.replace(/\s+/g, " "))]];
  },
};

const goto: Command = {
  name: "goto",
  summary: "Jump to a section of the site",
  usage: `goto <${SECTIONS.join(" | ")}>`,
  group: "Navigation",
  run(args, ctx) {
    const section = args[0]?.toLowerCase();
    if (!section || !SECTIONS.includes(section as (typeof SECTIONS)[number])) {
      return error(`usage: goto <${SECTIONS.join(" | ")}>`);
    }
    ctx.actions.navigate(section);
  },
  complete: () => [...SECTIONS],
};

const theme: Command = {
  name: "theme",
  summary: "Switch the site theme",
  usage: "theme [dark | light]",
  group: "Navigation",
  run(args, ctx) {
    const requested = args[0]?.toLowerCase();
    if (!requested) return [[seg(`Current theme: ${ctx.actions.theme}`)]];
    if (!THEMES.includes(requested as (typeof THEMES)[number])) return error("usage: theme [dark | light]");
    ctx.actions.setTheme(requested as (typeof THEMES)[number]);
    return [[seg(`Theme set to ${requested}.`, "muted")]];
  },
  complete: () => [...THEMES],
};

const exit: Command = {
  name: "exit",
  summary: "Close the terminal",
  group: "System",
  run: (_args, ctx) => ctx.actions.close(),
};

const sudo: Command = {
  name: "sudo",
  summary: "Run as administrator",
  group: "System",
  hidden: true,
  run: () => error("guest is not in the sudoers file.  This incident will be reported."),
};

const hostname: Command = {
  name: "hostname",
  summary: "Print the host name",
  group: "System",
  run: () => [[seg("swajan")]],
};

export const SYSTEM_COMMANDS: Command[] = [clear, history, echo, whoami, hostname, date, goto, theme, exit, sudo];
