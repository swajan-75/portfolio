import type { SkillCategory, SkillItem } from "@/app/hooks/useProfile";
import type { ThemeColor } from "@/app/lib/themeColor";

/**
 * One accent per category, assigned by position so colors stay stable while searching.
 * Bright shades for the dark theme; deeper ones keep contrast on white.
 */
const CATEGORY_PALETTE: readonly ThemeColor[] = [
  { dark: "#8b7cf6", light: "#6d28d9" },
  { dark: "#38bdf8", light: "#0369a1" },
  { dark: "#34d399", light: "#047857" },
  { dark: "#fb923c", light: "#c2410c" },
  { dark: "#e879f9", light: "#a21caf" },
  { dark: "#facc15", light: "#a16207" },
];

export interface VisibleCategory {
  category: SkillCategory;
  /** Position in the full list (drives the number and color). */
  index: number;
  color: ThemeColor;
  /** Skills left after the search filter. */
  skills: SkillItem[];
}

export function categoryColorAt(index: number): ThemeColor {
  return CATEGORY_PALETTE[index % CATEGORY_PALETTE.length];
}

/** Drops categories and skills the API sent without usable names. */
export function normalizeCategories(categories: SkillCategory[] | undefined): SkillCategory[] {
  if (!Array.isArray(categories)) return [];
  return categories
    .map((category) => ({
      ...category,
      skills: (Array.isArray(category.skills) ? category.skills : []).filter(
        (skill) => typeof skill?.name === "string" && skill.name.trim() !== "",
      ),
    }))
    .filter((category) => typeof category.title === "string" && category.skills.length > 0);
}

/** A category whose title matches keeps all its skills; otherwise only matching skills stay. */
export function filterCategories(categories: SkillCategory[], query: string): VisibleCategory[] {
  const needle = query.trim().toLowerCase();

  return categories
    .map((category, index) => {
      const titleMatches = !needle || category.title.toLowerCase().includes(needle);
      const skills = titleMatches
        ? category.skills
        : category.skills.filter((skill) => skill.name.toLowerCase().includes(needle));
      return { category, index, color: categoryColorAt(index), skills };
    })
    .filter((visible) => visible.skills.length > 0);
}

export function uniqueSkills(categories: SkillCategory[]): SkillItem[] {
  const seen = new Set<string>();
  return categories
    .flatMap((category) => category.skills)
    .filter((skill) => {
      const key = skill.name.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

/** Badge text for skills without an icon: "REST API Design" → "RA", "Regex" → "Re". */
export function monogramOf(name: string): string {
  const words = name.replace(/[^A-Za-z0-9 ]+/g, " ").split(/\s+/).filter(Boolean);
  if (words.length >= 2) return `${words[0][0]}${words[1][0]}`.toUpperCase();
  const word = words[0] ?? "?";
  return word.charAt(0).toUpperCase() + word.slice(1, 2).toLowerCase();
}

/** Splits text around the first case-insensitive match so the match can be highlighted. */
export function splitOnMatch(text: string, query: string) {
  const needle = query.trim().toLowerCase();
  const start = needle ? text.toLowerCase().indexOf(needle) : -1;
  if (start === -1) return null;
  return {
    before: text.slice(0, start),
    match: text.slice(start, start + needle.length),
    after: text.slice(start + needle.length),
  };
}

export function padNumber(value: number): string {
  return String(value).padStart(2, "0");
}
