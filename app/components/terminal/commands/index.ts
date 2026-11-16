import { BLANK, error, seg } from "../format";
import type { Command, CommandGroup, Line } from "../types";
import { FILE_COMMANDS } from "./files";
import { PORTFOLIO_COMMANDS } from "./portfolio";
import { SYSTEM_COMMANDS } from "./system";
import { UTILITY_COMMANDS } from "./utilities";

const GROUP_ORDER: CommandGroup[] = ["Portfolio", "Navigation", "Files", "Utilities", "System"];

/** Shorthands expanded before lookup: `ll` → `ls -l`. */
export const ALIASES: Record<string, string[]> = {
  ll: ["ls", "-l"],
  la: ["ls", "-a"],
  cv: ["resume"],
  man: ["help"],
  logout: ["exit"],
  whois: ["about"],
};

const help: Command = {
  name: "help",
  summary: "List commands, or explain one",
  usage: "help [command]",
  group: "System",
  run(args) {
    if (args[0]) return helpFor(args[0]);
    const visible = COMMANDS.filter((command) => !command.hidden);
    const width = Math.max(...visible.map((command) => command.name.length)) + 3;
    const groups = GROUP_ORDER.flatMap((group, index): Line[] => {
      const members = visible.filter((command) => command.group === group);
      return [
        ...(index > 0 ? [BLANK] : []),
        [seg(group, "heading")],
        ...members.map((command): Line => [seg(`  ${command.name.padEnd(width)}`, "exec"), seg(command.summary)]),
      ];
    });
    return [
      ...groups,
      BLANK,
      [seg("Tab completes commands and paths. ↑/↓ browse history. Ctrl+L clears.", "muted")],
    ];
  },
  complete: () => COMMANDS.map((command) => command.name),
};

function helpFor(name: string): Line[] {
  const command = findCommand(name);
  if (!command) return error(`help: no help topics match '${name}'`);
  return [
    [seg(command.name, "exec"), seg(` — ${command.summary}`)],
    [seg("usage: ", "muted"), seg(command.usage ?? command.name)],
  ];
}

export const COMMANDS: Command[] = [
  ...PORTFOLIO_COMMANDS,
  ...SYSTEM_COMMANDS.filter((command) => command.group === "Navigation"),
  ...FILE_COMMANDS,
  ...UTILITY_COMMANDS,
  help,
  ...SYSTEM_COMMANDS.filter((command) => command.group !== "Navigation"),
];

export function findCommand(name: string): Command | undefined {
  return COMMANDS.find((command) => command.name === name);
}

/** Every name the shell recognizes, for completion. */
export const COMMAND_NAMES: string[] = [...COMMANDS.map((command) => command.name), ...Object.keys(ALIASES)].sort();

/** Splits a command line into words, honoring single and double quotes. */
export function tokenize(input: string): string[] {
  const tokens = input.match(/"[^"]*"|'[^']*'|\S+/g) ?? [];
  return tokens.map((token) => token.replace(/^(["'])(.*)\1$/, "$2"));
}

export function expandAlias(tokens: string[]): string[] {
  const [name, ...rest] = tokens;
  const alias = name ? ALIASES[name] : undefined;
  return alias ? [...alias, ...rest] : tokens;
}
