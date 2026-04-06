"use client";
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
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

  return (
    <motion.button
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      onClick={toggleTheme}
      className="fixed top-6 right-6 z-50 p-3 rounded-full bg-white/80 dark:bg-neutral-900/40 backdrop-blur-xl border border-gray-200 dark:border-white/10 shadow-xl cursor-pointer text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors ring-1 ring-gray-200 dark:ring-white/5 group"
      aria-label="Toggle theme"
    >
      <div className="relative w-6 h-6 flex items-center justify-center overflow-hidden">
        {/* Sun Icon (shows in Light mode) */}
        <motion.div
          animate={{ y: isDark ? 30 : 0, opacity: isDark ? 0 : 1, rotate: isDark ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          className="absolute"
        >
          <FiSun className="text-xl text-yellow-500" />
        </motion.div>

        {/* Moon Icon (shows in Dark mode) */}
        <motion.div
          animate={{ y: isDark ? 0 : -30, opacity: isDark ? 1 : 0, rotate: isDark ? 0 : -90 }}
          transition={{ duration: 0.2 }}
          className="absolute"
        >
          <FiMoon className="text-xl text-cyan-200" />
        </motion.div>
      </div>
    </motion.button>
  );
}
