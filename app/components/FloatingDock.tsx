"use client";
import { useCallback, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FiHome, FiTerminal, FiBox, FiFileText,
  FiGithub, FiCpu, FiMail, FiSun, FiMoon
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { useRouter } from "next/navigation";
import logo from "../images/logo.jpg";
import { navigateToSection } from "../lib/navigateToSection";
import { useActiveCv } from "../hooks/useActiveCv";
import { useTheme, type Theme } from "../hooks/useTheme";
import TerminalWindow from "./terminal/TerminalWindow";

type TerminalState = "closed" | "open" | "minimized";

interface DockEntry {
  id: string;
  label: string;
  icon?: ReactNode;
  href?: string;
  type?: "avatar";
  img?: string;
}
const dockItems: DockEntry[] = [
  { icon: <FiHome />, label: "Home", id: "home" },
  { icon: <FiCpu />, label: "Skills", id: "skills" },
  { icon: <FiBox />, label: "Projects", id: "projects" },

  { icon: <FaWhatsapp />, label: "WhatsApp", id: "whatsapp", href: "https://wa.me/8801742227504" },
    { type: "avatar", img: logo.src, label: "Profile", id: "profile" },
  { icon: <FiMail />, label: "Contact", id: "contact" },
  { icon: <FiTerminal />, label: "Console", id: "console" },
  { icon: <FiFileText />, label: "Resume", id: "resume" },
  { icon: <FiGithub />, label: "GitHub", id: "github", href: "https://github.com/swajan-75" },
  { icon: <FiSun />, label: "Theme", id: "theme" },
];

export default function FloatingDock() {
  const [terminalState, setTerminalState] = useState<TerminalState>("closed");
  const cvUrl = useActiveCv();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  // FIX: wrapped in useCallback so DockItem children don't re-render on unrelated state changes
  const handleItemClick = useCallback((item: DockEntry) => {
    switch (item.id) {
      case "console": setTerminalState("open"); break;
      case "theme": toggleTheme(); break;
      case "home":
        navigateToSection("hero", router.push);
        break;
      case "profile": window.scrollTo({ top: 0, behavior: "smooth" }); break;
      case "skills":
      case "projects":
      case "contact":
        navigateToSection(item.id, router.push);
        break;
      case "resume":
        if (cvUrl) window.open(cvUrl, "_blank", "noopener,noreferrer");
        break;
      case "github":
      case "whatsapp":
        if (item.href) window.open(item.href, "_blank", "noopener,noreferrer");
        break;
      case "back":
        window.history.back();
        break;
    }
  }, [cvUrl, toggleTheme, router]);

  const closeTerminal = useCallback(() => setTerminalState("closed"), []);
  const minimizeTerminal = useCallback(() => setTerminalState("minimized"), []);
  const navigateFromTerminal = useCallback((section: string) => {
    setTerminalState("closed");
    navigateToSection(section === "home" ? "hero" : section, router.push);
  }, [router]);
  const setThemeFromTerminal = useCallback((next: Theme) => {
    if (next !== theme) toggleTheme();
  }, [theme, toggleTheme]);

  return (
    <>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0, type: "spring", stiffness: 500, damping: 25 }}
          className="flex items-center gap-3 px-4 py-2 rounded-full shadow-2xl bg-surface/95 border border-border-strong"
        >
          {dockItems.map((item) => (
            <DockItem
              key={item.id}
              item={item}
              theme={theme}
              onClick={() => handleItemClick(item)}
              disabled={item.id === "resume" && !cvUrl}
            />
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {terminalState !== "closed" && (
          <TerminalWindow
            isMinimized={terminalState === "minimized"}
            onClose={closeTerminal}
            onMinimize={minimizeTerminal}
            onNavigate={navigateFromTerminal}
            theme={theme}
            onSetTheme={setThemeFromTerminal}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function DockItem({
  item,
  theme,
  onClick,
  disabled,
}: {
  item: DockEntry;
  theme: "dark" | "light";
  onClick: () => void;
  disabled: boolean;
}) {
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

  const isThemeItem = item.id === "theme";
  const icon = isThemeItem ? (theme === "dark" ? <FiSun /> : <FiMoon />) : item.icon;
  const label = isThemeItem ? (theme === "dark" ? "Light mode" : "Dark mode") : item.label;

  return (
    <motion.div
      whileHover={!disabled ? { scale: 1.2 } : {}}
      whileTap={!disabled ? { scale: 0.9 } : {}}
      transition={ultraFast}
      onClick={!disabled ? onClick : undefined}
      className={`${baseClass} w-8 h-8 rounded-full ${disabled ? "text-white/30 cursor-not-allowed" : "text-white/75 hover:text-white hover:bg-white/10 transition-colors"}`}
    >
      <div className="text-lg">{icon}</div>
      <Tooltip label={disabled ? "No CV uploaded" : label} />
    </motion.div>
  );
}

function Tooltip({ label }: { label: string }) {
  return (
    <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-75 pointer-events-none whitespace-nowrap shadow-lg bg-surface-2 border border-border-strong">
      {label}
    </span>
  );
}
