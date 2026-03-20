"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FiHome, FiTerminal, FiBox, FiFileText, 
  FiGithub, FiArrowLeft
} from "react-icons/fi";
import logo from "../images/logo.jpg";
import api from "@/lib/axios";

// --- 1. CONFIGURATION ---
const dockItems = [
  { icon: <FiHome />, label: "Home", id: "home" },
  { icon: <FiTerminal />, label: "Console", id: "console" }, 
  { icon: <FiBox />, label: "Projects", id: "projects" }, 
  { 
    type: "avatar", 
    img: logo.src,
    label: "Profile",
    id: "profile"
  },
  { 
    icon: <FiFileText />, 
    label: "Resume", 
    id: "resume", 
  },
  { 
    icon: <FiGithub />, 
    label: "GitHub", 
    id: "github", 
    href: "https://github.com/swajan-75" 
  },
  { icon: <FiArrowLeft />, label: "Back", id: "back" },
];

export default function FloatingDock() {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [cvUrl, setCvUrl] = useState(null);

  useEffect(() => {
    api.get("/cv/active")
      .then((res) => setCvUrl(res.data?.url ?? null))
      .catch(() => setCvUrl(null));
  }, []);

  const handleItemClick = (item) => {
    switch (item.id) {
      case "console":
        setIsTerminalOpen(true);
        break;
      case "home":
      case "profile":
        window.scrollTo({ top: 0, behavior: "smooth" });
        break;
      case "projects":
        const projectsSection = document.getElementById("projects");
        if (projectsSection) {
          projectsSection.scrollIntoView({ behavior: "smooth" });
        }
        break;
      case "resume":
        if (cvUrl) {
          window.open(cvUrl, "_blank", "noopener,noreferrer");
        }
        break;
      case "github":
        if (item.href) {
          window.open(item.href, "_blank", "noopener,noreferrer");
        }
        break;
      case "back":
        if (typeof window !== "undefined") {
          window.history.back();
        }
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0, type: "spring", stiffness: 500, damping: 25 }}
          className="flex items-center gap-3 px-4 py-2 bg-neutral-900/40 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl"
        >
          {dockItems.map((item, index) => (
            <DockItem 
              key={index} 
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

// --- 2. DOCK ITEM COMPONENT ---
function DockItem({ item, onClick, disabled }) {
  const baseClass = "relative flex items-center justify-center cursor-pointer group"; 
  const ultraFast = { duration: 0.1 };

  if (item.type === "avatar") {
    return (
      <motion.div 
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        transition={ultraFast}
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
      whileHover={!disabled ? { scale: 1.2, backgroundColor: "rgba(255, 255, 255, 0.1)" } : {}}
      whileTap={!disabled ? { scale: 0.9 } : {}}
      transition={ultraFast}
      onClick={!disabled ? onClick : undefined}
      className={`${baseClass} w-8 h-8 rounded-full ${
        disabled ? "text-neutral-700 cursor-not-allowed" : "text-neutral-400 hover:text-white"
      }`}
    >
      <div className="text-lg">{item.icon}</div>
      <Tooltip label={disabled ? "No CV uploaded" : item.label} />
    </motion.div>
  );
}

function Tooltip({ label }) {
  return (
    <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-neutral-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-75 pointer-events-none whitespace-nowrap border border-white/10">
      {label}
    </span>
  );
}

// --- 3. TERMINAL WINDOW COMPONENT ---
function TerminalWindow({ onClose }) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([
    { type: "output", content: "Welcome to PortfolioOS v1.0.0" },
    { type: "output", content: "Type 'help' to see available commands." },
  ]);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = (e) => {
    if (e.key === "Enter") {
      const cmd = input.trim().toLowerCase();
      const newHistory = [...history, { type: "command", content: input }];
      
      let response = "";
      
      switch (cmd) {
        case "help":
          response = "Available commands: about, skills, contact, clear, hack, sudo, coffee, whoami";
          break;
        case "whoami":
          response = "You are a curious visitor... or a spy? 🕵️‍♂️";
          break;
        case "sudo":
          response = "Nice try. You have no power here! 🚫";
          break;
        case "hack":
          response = "Hacking NASA... [||||||||||] 100% ... Just kidding. I'm a frontend dev, not a hacker.";
          break;
        case "coffee":
          response = "☕ Here's a virtual coffee. Careful, it's hot!";
          break;
        case "clear":
          setHistory([]);
          setInput("");
          return;
        case "ls":
          response = "secret_plans.txt  world_domination.sh  resume.pdf";
          break;
        case "cat secret_plans.txt":
          response = "1. Learn React\n2. ???\n3. Profit";
          break;
        default:
          response = `Command not found: ${cmd}. Type 'help' for assistance.`;
      }

      setHistory([...newHistory, { type: "output", content: response }]);
      setInput("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.1, ease: "easeOut" }}
        className="w-full max-w-2xl bg-[#1e1e1e] rounded-lg shadow-2xl border border-gray-700 overflow-hidden font-mono text-sm"
      >
        <div className="bg-[#2d2d2d] px-4 py-2 flex items-center justify-between border-b border-gray-700">
          <div className="flex gap-2">
            <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="text-gray-400 text-xs">guest@portfolio:~</div>
          <div className="w-10"></div>
        </div>

        <div className="p-4 h-80 overflow-y-auto text-green-400 custom-scrollbar" onClick={() => document.getElementById('terminal-input').focus()}>
          {history.map((line, i) => (
            <div key={i} className={`mb-1 ${line.type === "command" ? "text-white" : "text-green-400"}`}>
              {line.type === "command" ? (
                <span><span className="text-blue-400">➜</span> ~ {line.content}</span>
              ) : (
                <div className="whitespace-pre-wrap">{line.content}</div>
              )}
            </div>
          ))}
          
          <div className="flex items-center gap-2 mt-2">
            <span className="text-blue-400">➜</span>
            <span className="text-white">~</span>
            <input
              id="terminal-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleCommand}
              autoFocus
              className="flex-1 bg-transparent border-none outline-none text-white font-mono caret-white"
              autoComplete="off"
            />
          </div>
          <div ref={bottomRef} />
        </div>
      </motion.div>
    </div>
  );
}