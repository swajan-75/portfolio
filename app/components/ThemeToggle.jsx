"use client";
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeToggle({ className = "" }) {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);

    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // Prevent hydration mismatch on initial render
  if (!mounted) return <div className={`w-10 h-10 ${className}`} />;

  return (
    <button
      onClick={toggleTheme}
      className={`relative w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 transition-colors focus-visible:ring-2 focus-visible:ring-purple-500 overflow-hidden ${className}`}
      aria-label="Toggle theme"
    >
      <motion.div
        animate={{ y: isDark ? 30 : 0, opacity: isDark ? 0 : 1, rotate: isDark ? 90 : 0 }}
        transition={{ duration: 0.2 }}
        className="absolute"
      >
        <FiSun className="text-lg text-yellow-500" />
      </motion.div>

      <motion.div
        animate={{ y: isDark ? 0 : -30, opacity: isDark ? 1 : 0, rotate: isDark ? 0 : -90 }}
        transition={{ duration: 0.2 }}
        className="absolute"
      >
        <FiMoon className="text-lg text-cyan-200" />
      </motion.div>
    </button>
  );
}
