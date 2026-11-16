import { error, seg } from "../format";
import type { Command } from "../types";

const PASSWORD_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*-_=+";
const PASSWORD_DEFAULT = 20;
const PASSWORD_MIN = 8;
const PASSWORD_MAX = 128;
/** Digits, whitespace, decimal points, parentheses and + - * / % only. */
const ARITHMETIC = /^[\d\s.()+\-*/%]+$/;

const calc: Command = {
  name: "calc",
  summary: "Evaluate arithmetic",
  usage: "calc <expression>",
  group: "Utilities",
  run(args) {
    const expression = args.join(" ");
    if (!expression) return error("usage: calc <expression>");
    if (!ARITHMETIC.test(expression)) return error("calc: only numbers and + - * / % ( ) are allowed");
    try {
      // Safe: the pattern above rules out identifiers, so nothing but arithmetic can run.
      const value: unknown = Function(`"use strict"; return (${expression});`)();
      if (typeof value !== "number" || !Number.isFinite(value)) return error("calc: result is not a finite number");
      return [[seg(String(Number(value.toPrecision(15))))]];
    } catch {
      return error(`calc: parse error in '${expression}'`);
    }
  },
};

const uuidgen: Command = {
  name: "uuidgen",
  summary: "Generate a UUID",
  group: "Utilities",
  run: () => [[seg(crypto.randomUUID().toUpperCase())]],
};

const base64: Command = {
  name: "base64",
  summary: "Encode or decode Base64 (-d to decode)",
  usage: "base64 [-d] <text>",
  group: "Utilities",
  run(args) {
    const decode = args[0] === "-d" || args[0] === "--decode";
    const text = (decode ? args.slice(1) : args).join(" ");
    if (!text) return error("usage: base64 [-d] <text>");
    if (!decode) {
      const bytes = new TextEncoder().encode(text);
      return [[seg(btoa(String.fromCharCode(...bytes)))]];
    }
    try {
      const bytes = Uint8Array.from(atob(text), (char) => char.charCodeAt(0));
      return [[seg(new TextDecoder().decode(bytes))]];
    } catch {
      return error("base64: invalid input");
    }
  },
};

const sha256sum: Command = {
  name: "sha256sum",
  summary: "SHA-256 hash of text",
  usage: "sha256sum <text>",
  group: "Utilities",
  async run(args) {
    const text = args.join(" ");
    if (!text) return error("usage: sha256sum <text>");
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    const hex = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
    return [[seg(`${hex}  -`)]];
  },
};

const pwgen: Command = {
  name: "pwgen",
  summary: "Generate a strong password",
  usage: `pwgen [length ${PASSWORD_MIN}-${PASSWORD_MAX}]`,
  group: "Utilities",
  run(args) {
    const length = args[0] ? Number(args[0]) : PASSWORD_DEFAULT;
    if (!Number.isInteger(length) || length < PASSWORD_MIN || length > PASSWORD_MAX) {
      return error(`pwgen: length must be ${PASSWORD_MIN}-${PASSWORD_MAX}`);
    }
    const random = crypto.getRandomValues(new Uint32Array(length));
    return [[seg(Array.from(random, (n) => PASSWORD_CHARS[n % PASSWORD_CHARS.length]).join(""))]];
  },
};

export const UTILITY_COMMANDS: Command[] = [calc, uuidgen, base64, sha256sum, pwgen];
