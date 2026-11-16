import { error, lsDate, seg } from "../format";
import { displayPath, getNode, resolvePath, type FsDir, type FsNode } from "../filesystem";
import type { Command, Line, Segment, ShellContext } from "../types";

const OWNER = "swajan";
const GROUP = "staff";

function parseFlags(args: string[]) {
  const flags = new Set(args.filter((arg) => arg.startsWith("-")).flatMap((arg) => arg.slice(1).split("")));
  const operands = args.filter((arg) => !arg.startsWith("-"));
  return { flags, operands };
}

function nameSegment(node: FsNode): Segment {
  return seg(node.name, node.kind === "dir" ? "dir" : "default");
}

function longListing(nodes: FsNode[]): Line[] {
  const sizes = nodes.map((node) => String(node.kind === "dir" ? 64 + node.children.length * 32 : node.size));
  const width = Math.max(...sizes.map((size) => size.length));
  return [
    [seg(`total ${nodes.length * 8}`)],
    ...nodes.map((node, i): Line => {
      const mode = node.kind === "dir" ? "drwxr-xr-x" : "-rw-r--r--";
      const links = node.kind === "dir" ? node.children.length + 2 : 1;
      return [
        seg(`${mode}  ${String(links).padStart(2)} ${OWNER}  ${GROUP}  ${sizes[i].padStart(width)} ${lsDate(node.modified)} `),
        nameSegment(node),
      ];
    }),
  ];
}

function shortListing(nodes: FsNode[]): Line[] {
  if (!nodes.length) return [];
  return [nodes.flatMap((node, i) => (i === 0 ? [nameSegment(node)] : [seg("  "), nameSegment(node)]))];
}

const ls: Command = {
  name: "ls",
  summary: "List directory contents",
  usage: "ls [-la] [path]",
  group: "Files",
  run(args, ctx) {
    const { flags, operands } = parseFlags(args);
    const target = operands[0] ?? ".";
    const node = getNode(ctx.fs, resolvePath(ctx.cwd, target));
    if (!node) return error(`ls: ${target}: No such file or directory`);
    if (node.kind === "file") return flags.has("l") ? longListing([node]).slice(1) : [[nameSegment(node)]];

    const showHidden = flags.has("a");
    const nodes = node.children.filter((child) => showHidden || !child.name.startsWith("."));
    return flags.has("l") ? longListing(nodes) : shortListing(nodes);
  },
};

const cd: Command = {
  name: "cd",
  summary: "Change directory",
  usage: "cd [path | - | ~]",
  group: "Files",
  run(args, ctx) {
    const target = args[0] ?? "~";
    const path = target === "-" ? ctx.previousCwd : resolvePath(ctx.cwd, target);
    const node = getNode(ctx.fs, path);
    if (!node) return error(`cd: no such file or directory: ${target}`);
    if (node.kind !== "dir") return error(`cd: not a directory: ${target}`);
    ctx.setCwd(path);
    return target === "-" ? [[seg(displayPath(path))]] : undefined;
  },
  complete: (args, ctx) => directoryCandidates(args.at(-1) ?? "", ctx),
};

const pwd: Command = {
  name: "pwd",
  summary: "Print working directory",
  group: "Files",
  run: (_args, ctx) => [[seg(ctx.cwd)]],
};

const cat: Command = {
  name: "cat",
  summary: "Print file contents",
  usage: "cat <file>...",
  group: "Files",
  run(args, ctx) {
    if (!args.length) return error("usage: cat <file>...");
    return args.flatMap((target): Line[] => {
      const node = getNode(ctx.fs, resolvePath(ctx.cwd, target));
      if (!node) return error(`cat: ${target}: No such file or directory`);
      if (node.kind === "dir") return error(`cat: ${target}: Is a directory`);
      if (node.url) return error(`cat: ${target}: binary file, try \`open ${target}\``);
      return node.read();
    });
  },
};

function treeLines(dir: FsDir, prefix: string): { lines: Line[]; dirs: number; files: number } {
  return dir.children.reduce(
    (acc, child, i) => {
      const isLast = i === dir.children.length - 1;
      const line: Line = [seg(`${prefix}${isLast ? "└── " : "├── "}`, "muted"), nameSegment(child)];
      if (child.kind === "file") return { ...acc, lines: [...acc.lines, line], files: acc.files + 1 };
      const sub = treeLines(child, `${prefix}${isLast ? "    " : "│   "}`);
      return { lines: [...acc.lines, line, ...sub.lines], dirs: acc.dirs + 1 + sub.dirs, files: acc.files + sub.files };
    },
    { lines: [] as Line[], dirs: 0, files: 0 },
  );
}

const tree: Command = {
  name: "tree",
  summary: "Show the directory tree",
  usage: "tree [path]",
  group: "Files",
  run(args, ctx) {
    const target = args[0] ?? ".";
    const node = getNode(ctx.fs, resolvePath(ctx.cwd, target));
    if (!node || node.kind !== "dir") return error(`${target} [error opening dir]`);
    const { lines, dirs, files } = treeLines(node, "");
    const summary = `${dirs} ${dirs === 1 ? "directory" : "directories"}, ${files} ${files === 1 ? "file" : "files"}`;
    return [[seg(target, "dir")], ...lines, [], [seg(summary)]];
  },
  complete: (args, ctx) => directoryCandidates(args.at(-1) ?? "", ctx),
};

/** Writes are not allowed: answer the way a read-only mount would. */
const READ_ONLY = ["rm", "rmdir", "mkdir", "touch", "mv", "cp", "chmod"];
const readOnly: Command[] = READ_ONLY.map((name) => ({
  name,
  summary: "Read-only file system",
  group: "Files",
  hidden: true,
  run: (args) => {
    const target = args.find((arg) => !arg.startsWith("-"));
    return error(target ? `${name}: ${target}: Read-only file system` : `${name}: Read-only file system`);
  },
}));

export function pathCandidates(partial: string, ctx: ShellContext, onlyDirs = false): string[] {
  const slash = partial.lastIndexOf("/");
  const dirPart = slash === -1 ? "" : partial.slice(0, slash + 1);
  const base = partial.slice(slash + 1);
  const node = getNode(ctx.fs, resolvePath(ctx.cwd, dirPart || "."));
  if (!node || node.kind !== "dir") return [];
  return node.children
    .filter((child) => child.name.startsWith(base) && (base.startsWith(".") || !child.name.startsWith(".")))
    .filter((child) => !onlyDirs || child.kind === "dir")
    .map((child) => `${dirPart}${child.name}${child.kind === "dir" ? "/" : ""}`);
}

function directoryCandidates(partial: string, ctx: ShellContext): string[] {
  return pathCandidates(partial, ctx, true);
}

export const FILE_COMMANDS: Command[] = [ls, cd, pwd, cat, tree, ...readOnly];
