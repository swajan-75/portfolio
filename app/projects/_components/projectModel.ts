import type { ThemeColor } from "@/app/lib/themeColor";

export interface Project {
  id: string | number;
  title: string;
  category?: string;
  description?: string;
  tech_stack?: string[];
  github_url?: string;
  live_url?: string;
  image_link?: string;
  rank?: number;
  created_at?: number;
}

export interface CategoryCount {
  key: string;
  label: string;
  count: number;
}

export const ALL_CATEGORIES = "ALL";

const FALLBACK_CATEGORY = "OTHER";

/** Bright shades read well on the dark theme; deeper ones keep contrast on white. */
const CATEGORY_COLORS: Record<string, ThemeColor> = {
  FRONTEND: { dark: "#a78bfa", light: "#7c3aed" },
  BACKEND: { dark: "#38bdf8", light: "#0369a1" },
  FULLSTACK: { dark: "#34d399", light: "#047857" },
  WEB_APP: { dark: "#fb923c", light: "#c2410c" },
  MOBILE: { dark: "#e879f9", light: "#a21caf" },
  AI_ML: { dark: "#facc15", light: "#a16207" },
  API: { dark: "#22d3ee", light: "#0e7490" },
  CLI_TOOL: { dark: "#4ade80", light: "#15803d" },
  LIBRARY: { dark: "#f87171", light: "#b91c1c" },
  OTHER: { dark: "#94a3b8", light: "#475569" },
};

const CATEGORY_LABELS: Record<string, string> = {
  FULLSTACK: "Full-stack",
  WEB_APP: "Web app",
  AI_ML: "AI / ML",
  CLI_TOOL: "CLI tool",
  API: "API",
};

/** Splits "Rosee – Full-Stack B2C Platform" into a name and a subtitle. */
const TITLE_SEPARATOR = /\s+[–—-]\s+/;

function isProject(value: unknown): value is Project {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  const hasId = typeof candidate.id === "string" || typeof candidate.id === "number";
  return hasId && typeof candidate.title === "string";
}

/** The API returns either an array or an id-keyed object; drop anything malformed. */
export function normalizeProjects(data: unknown): Project[] {
  const list = Array.isArray(data)
    ? data
    : data && typeof data === "object"
      ? Object.values(data)
      : [];
  return list.filter(isProject);
}

export function categoryKey(category?: string): string {
  return category?.trim() ? category.trim().toUpperCase() : FALLBACK_CATEGORY;
}

export function categoryColor(category?: string): ThemeColor {
  return CATEGORY_COLORS[categoryKey(category)] ?? CATEGORY_COLORS[FALLBACK_CATEGORY];
}

export function categoryLabel(category?: string): string {
  const key = categoryKey(category);
  if (CATEGORY_LABELS[key]) return CATEGORY_LABELS[key];
  return key
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());
}

/** Categories in the order they first appear, so the admin's ranking drives the filter order. */
export function countByCategory(projects: Project[]): CategoryCount[] {
  const counts = projects.reduce<Map<string, number>>((acc, project) => {
    const key = categoryKey(project.category);
    return new Map(acc).set(key, (acc.get(key) ?? 0) + 1);
  }, new Map());

  return [...counts.entries()].map(([key, count]) => ({ key, label: categoryLabel(key), count }));
}

export function splitTitle(title: string): { name: string; subtitle?: string } {
  const [name, ...rest] = title.split(TITLE_SEPARATOR);
  const subtitle = rest.join(" – ").trim();
  return { name: name.trim(), subtitle: subtitle || undefined };
}

/** "Career Leo" → "CL", "ArkPlayZone" → "AP", "AI Poster Maker" → "AI", "Rosee" → "Ro". */
export function initialsOf(title: string): string {
  const { name } = splitTitle(title);
  const firstWord = name.split(/\s+/)[0] ?? "";
  if (/^[A-Z0-9]{2,3}$/.test(firstWord)) return firstWord;

  const words = name
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(/\s+/)
    .filter(Boolean);
  if (words.length >= 2) return `${words[0][0]}${words[1][0]}`.toUpperCase();
  const word = words[0] ?? "?";
  return word.charAt(0).toUpperCase() + word.slice(1, 2).toLowerCase();
}

export function formatMonthYear(epochMs?: number): string {
  if (!epochMs) return "";
  return new Date(epochMs).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function hasLink(url?: string): url is string {
  return Boolean(url && url !== "#");
}

export function padNumber(value: number): string {
  return String(value).padStart(2, "0");
}
