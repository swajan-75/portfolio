"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion, Variants } from "motion/react";
import { FiMenu, FiX, FiHome, FiUser, FiBox, FiCpu, FiMail, FiFileText } from "react-icons/fi";
import { useActiveCv } from "../hooks/useActiveCv";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { href: "#home", label: "Home", icon: <FiHome /> },
  { href: "#about", label: "About", icon: <FiUser /> },
  { href: "#projects", label: "Projects", icon: <FiBox /> },
  { href: "#skills", label: "Skills", icon: <FiCpu /> },
  { href: "#contact", label: "Contact", icon: <FiMail /> },
];

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const cvUrl = useActiveCv();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleLinkClick = (href: string) => {
    setIsOpen(false);
    const element = document.querySelector(href);
    if (element) {
      setTimeout(() => element.scrollIntoView({ behavior: "smooth" }), 300);
    } else if (href === "#home") {
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 300);
    }
  };

  const handleResume = () => {
    setIsOpen(false);
    if (cvUrl) window.open(cvUrl, "_blank", "noopener,noreferrer");
  };

  const drawerVariants: Variants = {
    closed: { x: "100%", transition: { type: "tween", duration: 0.3 } },
    open: { x: 0, transition: { type: "tween", duration: 0.3, staggerChildren: 0.05, delayChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    closed: { opacity: 0, x: 20 },
    open: { opacity: 1, x: 0 },
  };

  return (
    <div className="md:hidden">
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open mobile menu"
        aria-expanded={isOpen}
        className="fixed top-6 right-6 z-50 p-3 rounded-full text-white bg-surface/90 border border-border-strong shadow-xl"
      >
        <FiMenu size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[998] bg-neutral-950/40"
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.div
              variants={drawerVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed inset-y-0 right-0 w-72 max-w-[85vw] z-[999] shadow-2xl"
              style={{
                borderRadius: '1.5rem 0 0 1.5rem',
                background: 'linear-gradient(155deg, var(--color-surface) 8%, var(--color-surface-2) 92%)',
                borderLeft: '1px solid var(--color-border)',
                boxShadow: '-20px 0 60px rgba(0,0,0,0.45)',
              }}
            >

              {/* Content layer */}
              <nav
                className="relative z-10 flex flex-col h-full p-6"
                role="dialog"
                aria-modal="true"
                aria-label="Mobile navigation"
              >
                <div className="flex justify-between items-center mb-8">
                  <ThemeToggle />
                  <button
                    onClick={() => setIsOpen(false)}
                    aria-label="Close mobile menu"
                    className="p-3 text-white/60 hover:text-white hover:bg-white/5 transition-colors rounded-full"
                  >
                    <FiX size={24} />
                  </button>
                </div>

                <ul className="flex flex-col gap-2 flex-1 m-0 p-0 list-none">
                  {navLinks.map((link) => (
                    <motion.li key={link.href} variants={shouldReduceMotion ? undefined : itemVariants}>
                      <button
                        onClick={() => handleLinkClick(link.href)}
                        className="w-full flex items-center gap-4 p-4 text-left text-[clamp(1rem,4vw,1.15rem)] font-semibold text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                      >
                        <span className="text-white/40">{link.icon}</span>
                        {link.label}
                      </button>
                    </motion.li>
                  ))}
                </ul>

                <motion.div
                  variants={shouldReduceMotion ? undefined : itemVariants}
                  className="mt-auto pt-4 mb-8"
                >
                  <button
                    onClick={handleResume}
                    disabled={!cvUrl}
                    className="btn-primary w-full flex items-center justify-center gap-3 p-4 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                  >
                    <FiFileText size={20} />
                    View Resume
                  </button>
                </motion.div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}