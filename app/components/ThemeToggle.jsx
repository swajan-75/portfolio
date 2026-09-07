"use client";
import React from "react";
import { motion } from "motion/react";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../hooks/useTheme";

export default function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme, mounted } = useTheme();
  const isDark = theme === "dark";

  // Prevent hydration mismatch on initial render
  if (!mounted) return <div className={`w-10 h-10 ${className}`} />;

  return (
    <button
      onClick={toggleTheme}
      className={`relative w-10 h-10 flex items-center justify-center rounded-full bg-surface-2 hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent overflow-hidden ${className}`}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      <motion.div
        animate={{ y: isDark ? 30 : 0, opacity: isDark ? 0 : 1, rotate: isDark ? 90 : 0 }}
        transition={{ duration: 0.2 }}
        className="absolute"
      >
        <FiSun className="text-lg text-yellow-500" aria-hidden="true" />
      </motion.div>

      <motion.div
        animate={{ y: isDark ? 0 : -30, opacity: isDark ? 1 : 0, rotate: isDark ? 0 : -90 }}
        transition={{ duration: 0.2 }}
        className="absolute"
      >
        <FiMoon className="text-lg text-accent-light" aria-hidden="true" />
      </motion.div>
    </button>
  );
}
