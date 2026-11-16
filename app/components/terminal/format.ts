import type { Line, Segment, Tone } from "./types";

export function seg(text: string, tone?: Tone, href?: string): Segment {
  return { text, tone, href };
}

/** Multi-line text as plain output lines. */
export function plain(text: string, tone?: Tone): Line[] {
  return text.split("\n").map((row) => [seg(row, tone)]);
}

export function error(message: string): Line[] {
  return [[seg(message, "error")]];
}

export const BLANK: Line = [];

const URL_PATTERN = /(https?:\/\/[^\s)]+|mailto:[^\s)]+)/g;

/** Splits text so URLs become clickable segments. */
export function linkify(text: string, tone?: Tone): Line {
  return text
    .split(URL_PATTERN)
    .filter((part) => part !== "")
    .map((part) => (/^(https?:|mailto:)/.test(part) ? seg(displayUrl(part), "dir", part) : seg(part, tone)));
}

export function displayUrl(url: string): string {
  return url.replace(/^mailto:/, "");
}

/** Aligned "key   value" rows. */
export function keyValues(rows: Array<[string, Segment | string]>, indent = 0): Line[] {
  const width = Math.max(...rows.map(([key]) => key.length)) + 2;
  return rows.map(([key, value]) => [
    seg(" ".repeat(indent)),
    seg(key.padEnd(width), "key"),
    typeof value === "string" ? seg(value) : value,
  ]);
}

/** Fixed-width columns; the last column is left unpadded. */
export function table(headers: string[], rows: Segment[][]): Line[] {
  const widths = headers.map((header, col) =>
    Math.max(header.length, ...rows.map((row) => row[col]?.text.length ?? 0)),
  );
  const pad = (text: string, col: number) => (col === headers.length - 1 ? text : text.padEnd(widths[col] + 2));
  const head: Line = headers.map((header, col) => seg(pad(header, col), "muted"));
  const body = rows.map((row) => row.map((cell, col) => ({ ...cell, text: pad(cell.text, col) })));
  return [head, ...body];
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const SIX_MONTHS_MS = 182 * 24 * 60 * 60 * 1000;

const two = (n: number) => String(n).padStart(2, "0");

/** `ls -l` style: "Nov 16 14:02" for recent files, "Nov 16  2025" for older ones. */
export function lsDate(date: Date, now = new Date()): string {
  const day = String(date.getDate()).padStart(2, " ");
  const isRecent = Math.abs(now.getTime() - date.getTime()) < SIX_MONTHS_MS;
  const tail = isRecent ? `${two(date.getHours())}:${two(date.getMinutes())}` : ` ${date.getFullYear()}`;
  return `${MONTHS[date.getMonth()]} ${day} ${tail}`;
}

/** "Mon Nov 16 14:02:11" as printed by login and date. */
export function longDate(date: Date): string {
  const time = `${two(date.getHours())}:${two(date.getMinutes())}:${two(date.getSeconds())}`;
  return `${WEEKDAYS[date.getDay()]} ${MONTHS[date.getMonth()]} ${String(date.getDate()).padStart(2, " ")} ${time}`;
}

export function monthYear(date: Date): string {
  return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}
