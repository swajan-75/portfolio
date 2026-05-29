"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FiHome, FiTerminal, FiBox, FiFileText,
  FiGithub, FiArrowLeft
} from "react-icons/fi";
import logo from "../images/logo.jpg";
import api from "../../lib/axios";
const dockItems = [
  { icon: <FiHome />, label: "Home", id: "home" },
  { icon: <FiTerminal />, label: "Console", id: "console" },
  { icon: <FiBox />, label: "Projects", id: "projects" },
  { type: "avatar", img: logo.src, label: "Profile", id: "profile" },
  { icon: <FiFileText />, label: "Resume", id: "resume" },
  { icon: <FiGithub />, label: "GitHub", id: "github", href: "https://github.com/swajan-75" },
  { icon: <FiArrowLeft />, label: "Back", id: "back" },
];

// FIX: All dynamic command prefixes listed here so autocomplete can suggest them
const DYNAMIC_COMMAND_PREFIXES = [
  "calc",
  "uuid",
  "password",
  "base64 encode",
  "base64 decode",
  "hash",
  "random",
  "upper",
  "lower",
  "reverse",
  "count",
  "timestamp",
  "urlencode",
  "urldecode",
];

export default function FloatingDock() {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [cvUrl, setCvUrl] = useState<string | null>(null);

  useEffect(() => {
    api.get("/cv/active")
      .then((res) => setCvUrl(res.data?.url ?? null))
      .catch(() => setCvUrl(null));
  }, []);

  // FIX: wrapped in useCallback so DockItem children don't re-render on unrelated state changes
  const handleItemClick = useCallback((item: typeof dockItems[number]) => {
    switch (item.id) {
      case "console": setIsTerminalOpen(true); break;
      case "home":
      case "profile": window.scrollTo({ top: 0, behavior: "smooth" }); break;
      case "projects":
        document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
        break;
      case "resume":
        if (cvUrl) window.open(cvUrl, "_blank", "noopener,noreferrer");
        break;
      case "github":
        if ("href" in item && item.href) window.open(item.href, "_blank", "noopener,noreferrer");
        break;
      case "back":
        window.history.back();
        break;
    }
  }, [cvUrl]);

  return (
    <>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0, type: "spring", stiffness: 500, damping: 25 }}
          style={{ backdropFilter: 'blur(150px) saturate(200%)', WebkitBackdropFilter: 'blur(150px) saturate(200%)', background: 'rgba(255,255,255,0.22)', border: '1px solid rgba(255,255,255,0.25)' }}
          className="flex items-center gap-3 px-4 py-2 rounded-full shadow-2xl"
        >
          {dockItems.map((item) => (
            <DockItem
              key={item.id}
              item={item}
              onClick={() => handleItemClick(item)}
              disabled={item.id === "resume" && !cvUrl}
            />
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {isTerminalOpen && (
          <TerminalWindow onClose={() => setIsTerminalOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

function DockItem({ item, onClick, disabled }: { item: any; onClick: () => void; disabled: boolean }) {
  const baseClass = "relative flex items-center justify-center cursor-pointer group";
  const ultraFast = { duration: 0.1 };

  if (item.type === "avatar") {
    return (
      <motion.div
        whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} transition={ultraFast}
        onClick={onClick}
        className={`${baseClass} w-10 h-10 rounded-full bg-cyan-400 overflow-hidden border-2 border-neutral-800`}
      >
        <img src={item.img} alt="Avatar" className="w-full h-full object-cover" />
        <Tooltip label={item.label} />
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={!disabled ? { scale: 1.2 } : {}}
      whileTap={!disabled ? { scale: 0.9 } : {}}
      transition={ultraFast}
      onClick={!disabled ? onClick : undefined}
      className={`${baseClass} w-8 h-8 rounded-full ${disabled ? "text-white/30 cursor-not-allowed" : "text-white/75 hover:text-white hover:bg-white/10 transition-colors"}`}
    >
      <div className="text-lg">{item.icon}</div>
      <Tooltip label={disabled ? "No CV uploaded" : item.label} />
    </motion.div>
  );
}

function Tooltip({ label }: { label: string }) {
  return (
    <span style={{ backdropFilter: 'blur(150px) saturate(200%)', WebkitBackdropFilter: 'blur(150px) saturate(200%)', background: 'rgba(255,255,255,0.22)', border: '1px solid rgba(255,255,255,0.25)' }} className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-75 pointer-events-none whitespace-nowrap shadow-lg">
      {label}
    </span>
  );
}

// --- HELPERS ---
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

function generatePassword(length = 16) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function fakeHash(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  const extra = generateUUID().replace(/-/g, '').slice(0, 24);
  return (hex + extra).slice(0, 32);
}

// --- COMMANDS ---
const COMMANDS: Record<string, () => string> = {
  help: () => `AVAILABLE COMMANDS
─────────────────────────────
  System    : whoami, hostname, uname, uptime, date, clear
  Files     : ls, ls -la, cat <file>, pwd
  Tools     : calc, uuid, password, base64, hash, random, upper, lower, reverse, count, timestamp, urlencode, urldecode
  Fun       : sudo, hack, fortune, coffee`,

  // --- SYSTEM ---
  whoami: () => "guest@portfolio",
  hostname: () => "swajan-portfolio-os",
  uname: () => "PortfolioOS 1.0.0 (based on Arch Linux) x86_64 GNU/Linux",
  uptime: () => {
    const hrs = Math.floor(Math.random() * 12) + 1;
    const min = Math.floor(Math.random() * 59);
    return `up ${hrs} hours, ${min} minutes, 1 user, load average: 0.12, 0.08, 0.05`;
  },
  date: () => new Date().toString(),
  pwd: () => "/home/guest/portfolio",

  // --- FILES ---
  ls: () => "about.txt  skills.json  projects/  contact.txt  .secret  resume.pdf",
  "ls -la": () =>
`total 48
drwxr-xr-x  6 swajan swajan 4096 Apr 07 09:00 .
drwxr-xr-x 18 swajan swajan 4096 Apr 07 08:55 ..
-rw-r--r--  1 swajan swajan  420 Apr 07 09:00 about.txt
-rw-r--r--  1 swajan swajan 1024 Apr 07 09:00 skills.json
drwxr-xr-x  2 swajan swajan 4096 Apr 07 09:00 projects/
-rw-r--r--  1 swajan swajan  312 Apr 07 09:00 contact.txt
-rw-------  1 swajan swajan   88 Apr 07 09:00 .secret
-rw-r--r--  1 swajan swajan 2048 Apr 07 09:00 resume.pdf`,

  "cat about.txt": () =>
`Name    : Swajan Barua
Role    : Full-Stack Developer
Location: Dhaka, Bangladesh
Edu     : BSc CS (Software Engineering) — AIUB
Status  : Open to opportunities `,

  "cat skills.json": () =>
`{
  "languages": ["Go", "C#", "Kotlin", "Python", "JavaScript", "PHP", "C++"],
  "frameworks": ["NestJS", "Next.js", "Gin", ".NET Core"],
  "databases": ["PostgreSQL", "MySQL", "Firebase"],
  "tools": ["Docker", "Git", "REST APIs", "Firebase Auth"]
}`,

  "cat contact.txt": () =>
`Email    : swajanbarua09@gmail.com
GitHub   : https://github.com/swajan-75
LinkedIn : https://linkedin.com/in/swajan-barua09
WhatsApp : +8801742227504
Facebook : https://facebook.com/swajan.09`,

  "cat .secret": () => "Why are you snooping around? 👀\nFine...\nI once spent 6 hours debugging a missing semicolon.",
  "cat resume.pdf": () => "Binary file detected. Use the Resume button in the dock to download it 📄",
  "ls projects/": () => "ArkPlayZone/  AIUB-API/  codeforces-tracker/  bkash-tracker/",

  "cat projects/arkplayzone": () =>
`ArkPlayZone — Booking System
Stack : NestJS, PostgreSQL
Auth  : JWT + OTP Verification
Desc  : Scalable backend for managing arena/play zone bookings`,

  "cat projects/aiub-api": () =>
`AIUB API — Open Source REST API
Stack : NestJS
Desc  : Publicly exposes AIUB university data
Repo  : https://github.com/swajan-75`,

  "cat projects/codeforces-tracker": () =>
`Codeforces Tracker — CLI Tool
Stack : Go + Telegram Bot API
Desc  : Tracks competitive programming stats and sends alerts via Telegram`,

  "cat projects/bkash-tracker": () =>
`Bkash Tracker — Full-Stack System
Features: Automated transaction tracking, SMS parsing and data extraction`,

}
  // --- DYNAMIC TOOL HANDLERS ---
function handleDynamicCommand(raw: string): string | null {
  const cmd = raw.trim().toLowerCase();
  const parts = raw.trim().split(/\s+/);

  // calc
  if (cmd.startsWith("calc ")) {
    const expr = raw.slice(5).trim();
    try {
      if (!/^[0-9+\-*/.() %sqrt\s]+$/i.test(expr)) return "calc: invalid expression";
      const sanitized = expr.replace(/sqrt\(([^)]+)\)/g, (_, n) => String(Math.sqrt(parseFloat(n))));
      const result = Function(`"use strict"; return (${sanitized})`)();
      return `${expr} = ${result}`;
    } catch {
      return `calc: cannot evaluate "${expr}"`;
    }
  }

  // uuid
  if (cmd === "uuid") return generateUUID();

  // password
  if (cmd.startsWith("password")) {
    const len = parseInt(parts[1]) || 16;
    if (len < 4 || len > 128) return "password: length must be between 4 and 128";
    return `Generated password (${len} chars):\n${generatePassword(len)}`;
  }

  // base64 encode
  if (cmd.startsWith("base64 encode ")) {
    const text = raw.slice(14).trim();
    if (!text) return "Usage: base64 encode <text>";
    return `Encoded:\n${btoa(unescape(encodeURIComponent(text)))}`;
  }

  // base64 decode
  if (cmd.startsWith("base64 decode ")) {
    const text = raw.slice(14).trim();
    try {
      return `Decoded:\n${decodeURIComponent(escape(atob(text)))}`;
    } catch {
      return "base64: invalid encoded string";
    }
  }

  // hash
  if (cmd.startsWith("hash ")) {
    const text = raw.slice(5).trim();
    if (!text) return "Usage: hash <text>";
    return `SHA-256 (simulated):\n${fakeHash(text)}`;
  }

  // random
  if (cmd.startsWith("random")) {
    const min = parseInt(parts[1] ?? "1");
    const max = parseInt(parts[2] ?? "100");
    if (isNaN(min) || isNaN(max) || min >= max) return "Usage: random <min> <max>";
    return `Random (${min}-${max}): ${Math.floor(Math.random() * (max - min + 1)) + min}`;
  }

  // upper
  if (cmd.startsWith("upper ")) return raw.slice(6).toUpperCase();

  // lower
  if (cmd.startsWith("lower ")) return raw.slice(6).toLowerCase();

  // reverse
  if (cmd.startsWith("reverse ")) return raw.slice(8).split("").reverse().join("");

  // count
  if (cmd.startsWith("count ")) {
    const text = raw.slice(6);
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const chars = text.length;
    const lines = text.split("\n").length;
    return `Characters : ${chars}\nWords      : ${words}\nLines      : ${lines}`;
  }

  // timestamp
  if (cmd === "timestamp") {
    const now = Date.now();
    return `Unix timestamp : ${Math.floor(now / 1000)}\nMilliseconds   : ${now}\nISO 8601       : ${new Date().toISOString()}`;
  }

  if (cmd.startsWith("timestamp ")) {
    const ts = parseInt(parts[1]);
    if (isNaN(ts)) return "timestamp: invalid value";
    const d = new Date(ts < 1e12 ? ts * 1000 : ts);
    return `Converted: ${d.toString()}`;
  }

  // urlencode
  if (cmd.startsWith("urlencode ")) {
    const text = raw.slice(10).trim();
    return `Encoded:\n${encodeURIComponent(text)}`;
  }

  // urldecode
  if (cmd.startsWith("urldecode ")) {
    try {
      return `Decoded:\n${decodeURIComponent(raw.slice(10).trim())}`;
    } catch {
      return "urldecode: invalid encoded string";
    }
  }

  return null;
}

// --- TERMINAL WINDOW ---

type HistoryLine = { type: "command" | "output"; content: string; id: string };

function makeId() {
  return Math.random().toString(36).slice(2, 9);
}

function TerminalWindow({ onClose }: { onClose: () => void }) {
  const [input, setInput] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [history, setHistory] = useState<HistoryLine[]>([
    { type: "output", content: "Welcome to PortfolioOS v1.0.0", id: makeId() },
    { type: "output", content: "Type 'help' to see available commands.", id: makeId() },
  ]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [cmdHistoryIndex, setCmdHistoryIndex] = useState(-1);
  const [busy, setBusy] = useState(false);
  const [sudoMode, setSudoMode] = useState(false);
  const [sudoAttempt, setSudoAttempt] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Combined command list for autocomplete (static + dynamic prefixes)
  // FIX: both handleTabComplete and suggestion useEffect use this merged list
  const allCommandKeys = [...Object.keys(COMMANDS), ...DYNAMIC_COMMAND_PREFIXES];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  // FIX: Tab complete now includes dynamic commands
  const handleTabComplete = () => {
    if (sudoMode) return;
    const match = allCommandKeys.find(
      (c) => c.startsWith(input.toLowerCase()) && c !== input.toLowerCase()
    );
    if (match) { setInput(match); setSuggestion(""); }
  };

  // FIX: Ghost-text suggestion now includes dynamic commands
  useEffect(() => {
    if (!input || sudoMode) { setSuggestion(""); return; }
    const match = allCommandKeys.find(
      (c) => c.startsWith(input.toLowerCase()) && c !== input.toLowerCase()
    );
    setSuggestion(match ? match.slice(input.length) : "");
  }, [input, sudoMode]);

  const pushLines = (lines: string[], base: HistoryLine[]) => {
    setHistory([...base, ...lines.map((content) => ({ type: "output" as const, content, id: makeId() }))]);
  };

  const streamLines = (lines: string[], currentHistory: HistoryLine[], delay = 600, onDone?: () => void) => {
    setBusy(true);
    setHistory([...currentHistory, { type: "output", content: lines[0], id: makeId() }]);
    lines.slice(1).forEach((line, i) => {
      setTimeout(() => {
        setHistory((prev) => [...prev, { type: "output", content: line, id: makeId() }]);
        if (i === lines.length - 2) { setBusy(false); onDone?.(); }
      }, (i + 1) * delay);
    });
  }; 

  const runPing = (target: string, currentHistory: HistoryLine[]) => {
    const ip = `${Math.floor(Math.random()*220)+10}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*254)+1}`;
    const t = () => (Math.random() * 8 + 9).toFixed(1);
    const t1 = t(), t2 = t(), t3 = t();
    streamLines([
      `PING ${target} (${ip}): 56 data bytes`,
      `64 bytes from ${ip}: icmp_seq=0 ttl=55 time=${t1} ms`,
      `64 bytes from ${ip}: icmp_seq=1 ttl=55 time=${t2} ms`,
      `64 bytes from ${ip}: icmp_seq=2 ttl=55 time=${t3} ms`,
      `--- ${target} ping statistics ---`,
      `3 packets transmitted, 3 received, 0% packet loss`,
      `round-trip min/avg/max = ${Math.min(+t1,+t2,+t3).toFixed(1)}/${((+t1+ +t2+ +t3)/3).toFixed(1)}/${Math.max(+t1,+t2,+t3).toFixed(1)} ms`,
    ], currentHistory, 800);
  };

  const runHack = (currentHistory: HistoryLine[]) => {
    streamLines([
      "Initializing hack sequence...",
      "Scanning target system...",
      "[░░░░░░░░░░] 0%  — Locating vulnerabilities...",
      "[██░░░░░░░░] 20% — Bypassing firewall...",
      "[████░░░░░░] 40% — Injecting payload...",
      "[██████░░░░] 60% — Decrypting mainframe...",
      "[████████░░] 80% — Escalating privileges...",
      "[██████████] 100% — Access granted. Welcome, root.",
      "",
      "root@mainframe:~# ls /classified",
      "  swajan_secrets.txt  world_domination.sh  budget.xlsx",
      "",
      "root@mainframe:~# cat swajan_secrets.txt",
      "  > Once pushed to main without testing. It worked. Never told anyone.",
      "  > Debugged for 4 hours. The bug was a missing comma.",
      "  > Uses dark mode. Obviously.",
      "",
      "Just kidding. I build things, I don't break them 😄",
    ], currentHistory, 350);
  };

  const runSudo = (currentHistory: HistoryLine[]) => {
    setHistory([...currentHistory, { type: "output", content: "[sudo] password for guest:", id: makeId() }]);
    setSudoMode(true);
    setSudoAttempt(0);
  };

  // FIX: setSudoMode(false) no longer called prematurely in handleCommand.
  // It's only set inside this function, eliminating the flicker/race condition.
  const handleSudoInput = (currentHistory: HistoryLine[]) => {
    const attempt = sudoAttempt + 1;
    setSudoAttempt(attempt);
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      if (attempt < 3) {
        setHistory((prev) => [
          ...prev,
          { type: "output", content: "Sorry, try again.", id: makeId() },
          { type: "output", content: "[sudo] password for guest:", id: makeId() },
        ]);
        setSudoMode(true);
      } else {
        setSudoMode(false);
        setSudoAttempt(0);
        setHistory((prev) => [
          ...prev,
          { type: "output", content: "Sorry, try again.", id: makeId() },
          { type: "output", content: "sudo: 3 incorrect password attempts", id: makeId() },
          { type: "output", content: "Access denied. You have no power here. 🚫", id: makeId() },
        ]);
      }
    }, 1200);
  };

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") { e.preventDefault(); handleTabComplete(); return; }
    if (!sudoMode) {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        const newIndex = Math.min(cmdHistoryIndex + 1, cmdHistory.length - 1);
        setCmdHistoryIndex(newIndex);
        setInput(cmdHistory[newIndex] ?? "");
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const newIndex = Math.max(cmdHistoryIndex - 1, -1);
        setCmdHistoryIndex(newIndex);
        setInput(newIndex === -1 ? "" : cmdHistory[newIndex]);
        return;
      }
    }

    if (e.key !== "Enter" || busy) return;
    const raw = input.trim();
    const cmd = raw.toLowerCase();
    setInput("");
    setSuggestion("");

    if (sudoMode) {
      // FIX: don't flip sudoMode off here — handleSudoInput manages it
      const currentHistory: HistoryLine[] = [...history, { type: "command", content: "••••••••", id: makeId() }];
      setHistory(currentHistory);
      handleSudoInput(currentHistory);
      return;
    }

    if (!cmd) return;
    const newHistory: HistoryLine[] = [...history, { type: "command", content: raw, id: makeId() }];
    setCmdHistory((prev) => [raw, ...prev]);
    setCmdHistoryIndex(-1);

    if (cmd === "clear") { setHistory([]); return; }
    if (cmd === "sudo" || cmd.startsWith("sudo ")) { runSudo(newHistory); return; }
    if (cmd === "hack") { runHack(newHistory); return; }
    if (cmd.startsWith("ping")) {
      runPing(raw.slice(4).trim() || "swajan.vercel.app", newHistory);
      return;
    }
    if (cmd.startsWith("cat ")) {
      const handler = COMMANDS[cmd];
      const response = handler ? handler() : `cat: ${raw.slice(4).trim()}: No such file or directory`;
      pushLines([response], newHistory);
      return;
    }

    // Try dynamic tools
    const toolResult = handleDynamicCommand(raw);
    if (toolResult !== null) {
      pushLines([toolResult], newHistory);
      return;
    }

    const handler = COMMANDS[cmd];
    const response = handler ? handler() : `Command not found: ${cmd}. Type 'help' for available commands.`;
    pushLines([response], newHistory);
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.1, ease: "easeOut" }}
        className="w-full max-w-2xl bg-[#1e1e1e] rounded-lg shadow-2xl border border-gray-700 overflow-hidden font-mono text-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#2d2d2d] px-4 py-2 flex items-center justify-between border-b border-gray-700">
          <div className="flex gap-2">
            <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="text-gray-400 text-xs">guest@portfolio:~</div>
          <div className="w-10" />
        </div>

        <div
          className="p-4 h-80 overflow-y-auto text-green-400 custom-scrollbar"
          onClick={() => inputRef.current?.focus()}
        >
          {history.map((line) => (
            // FIX: use stable unique id as key instead of array index
            <div key={line.id} className={`mb-1 ${line.type === "command" ? "text-white" : "text-green-400"}`}>
              {line.type === "command" ? (
                <span><span className="text-blue-400">➜</span> ~ {line.content}</span>
              ) : (
                <div className="whitespace-pre-wrap">{line.content}</div>
              )}
            </div>
          ))}

          {busy && <div className="text-yellow-400 animate-pulse text-xs">...</div>}

          <div className="flex items-center gap-2 mt-2">
            <span className="text-blue-400">➜</span>
            <span className="text-white">~</span>
            <div className="relative flex-1 h-5">
              {!sudoMode && (
                <div className="absolute inset-0 pointer-events-none font-mono text-base md:text-sm flex items-center">
                  <span className="text-white whitespace-pre">{input}</span>
                  <span className="text-gray-500 whitespace-pre">{suggestion}</span>
                </div>
              )}
              <input
                ref={inputRef}
                type={sudoMode ? "password" : "text"}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleCommand}
                autoFocus
                disabled={busy}
                className={`absolute inset-0 w-full bg-transparent border-none outline-none font-mono caret-white text-base md:text-sm disabled:cursor-wait ${sudoMode ? "text-white" : "text-transparent"}`}
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          </div>
          <div ref={bottomRef} />
        </div>
      </motion.div>
    </div>
  );
}