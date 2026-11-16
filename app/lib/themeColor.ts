import type { CSSProperties } from "react";

/** A color with a separate, deeper shade for the light theme. */
export interface ThemeColor {
  dark: string;
  light: string;
}

/**
 * Inline style exposing a ThemeColor to CSS. Pair it with the `theme-color`
 * class (globals.css), which resolves `var(--tc)` to the right shade for the
 * active theme — so components never need to know which theme is on.
 */
export function themeColorStyle(color: ThemeColor, style: CSSProperties = {}): CSSProperties {
  return { "--tc-dark": color.dark, "--tc-light": color.light, ...style } as CSSProperties;
}

/** The active theme's shade (use inside an element with the `theme-color` class). */
export const TC = "var(--tc)";

/** The active theme's shade at a given opacity, e.g. for tints and glows. */
export function tcAlpha(percent: number): string {
  return `color-mix(in srgb, var(--tc) ${percent}%, transparent)`;
}
