import { splitTitle } from "@/app/projects/_components/projectModel";
import {
  aboutLines,
  achievementLines,
  contactLines,
  projectLines,
  skillCategoryLines,
} from "./content";
import { slugify } from "./format";
import type { Line, PortfolioData } from "./types";

export const HOME = "/home/guest";

export interface FsFile {
  kind: "file";
  name: string;
  modified: Date;
  size: number;
  read: () => Line[];
  /** Binary files can't be printed; `open` sends the visitor to this URL instead. */
  url?: string;
}

export interface FsDir {
  kind: "dir";
  name: string;
  modified: Date;
  children: FsNode[];
}

export type FsNode = FsFile | FsDir;

function byteSize(lines: Line[]): number {
  return lines.reduce((total, line) => total + line.reduce((sum, part) => sum + part.text.length, 0) + 1, 0);
}

function file(name: string, lines: Line[], modified: Date): FsFile {
  return { kind: "file", name, modified, size: byteSize(lines), read: () => lines };
}

/** Children are kept sorted by name, as `ls` prints them. */
function dir(name: string, children: FsNode[], modified: Date): FsDir {
  const sorted = [...children].sort((a, b) => a.name.localeCompare(b.name));
  return { kind: "dir", name, modified, children: sorted };
}

/** Builds the visitor's home directory from live portfolio data. */
export function buildFileSystem(data: PortfolioData, now = new Date()): FsDir {
  const { profile, projects, cvUrl } = data;
  const home: FsNode[] = [];

  if (profile) {
    home.push(file("about.md", aboutLines(profile), now), file("contact.md", contactLines(profile), now));
    if (profile.highlights?.length) home.push(file("achievements.md", achievementLines(profile), now));

    const categories = profile.skill_categories ?? [];
    home.push(
      dir(
        "skills",
        categories.map((category) => file(`${slugify(category.title)}.txt`, skillCategoryLines(category), now)),
        now,
      ),
    );
  }

  home.push(
    dir(
      "projects",
      projects.map((project) => {
        const modified = project.created_at ? new Date(project.created_at) : now;
        return dir(slugify(splitTitle(project.title).name), [file("README.md", projectLines(project), modified)], modified);
      }),
      now,
    ),
  );

  if (cvUrl) home.push({ kind: "file", name: "resume.pdf", modified: now, size: 184_320, read: () => [], url: cvUrl });

  return dir("/", [dir("home", [dir("guest", home, now)], now)], now);
}

/** Normalizes `input` against `cwd`, handling ~, ., .. and absolute paths. */
export function resolvePath(cwd: string, input = ""): string {
  const expanded = input === "~" || input.startsWith("~/") ? HOME + input.slice(1) : input;
  const base = expanded.startsWith("/") ? [] : cwd.split("/").filter(Boolean);
  const parts = expanded.split("/").filter(Boolean).reduce<string[]>((acc, part) => {
    if (part === ".") return acc;
    if (part === "..") return acc.slice(0, -1);
    return [...acc, part];
  }, base);
  return `/${parts.join("/")}`;
}

export function getNode(root: FsDir, path: string): FsNode | null {
  return path
    .split("/")
    .filter(Boolean)
    .reduce<FsNode | null>((node, name) => {
      if (!node || node.kind !== "dir") return null;
      return node.children.find((child) => child.name === name) ?? null;
    }, root);
}

/** "/home/guest/projects" → "~/projects". */
export function displayPath(path: string): string {
  if (path === HOME) return "~";
  return path.startsWith(`${HOME}/`) ? `~${path.slice(HOME.length)}` : path;
}
