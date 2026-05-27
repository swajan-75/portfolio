"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion, Variants } from "motion/react";
import { FiMenu, FiX, FiHome, FiUser, FiBox, FiCpu, FiMail, FiFileText } from "react-icons/fi";
import api from "@/lib/axios";

const navLinks = [
  { href: "#home", label: "Home", icon: <FiHome /> },
  { href: "#about", label: "About", icon: <FiUser /> },
  { href: "#projects", label: "Projects", icon: <FiBox /> },
  { href: "#skills", label: "Skills", icon: <FiCpu /> },
  { href: "#contact", label: "Contact", icon: <FiMail /> },
];

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    api.get("/cv/active")
      .then((res) => setCvUrl(res.data?.url ?? null))
      .catch(() => setCvUrl(null));
  }, []);

  // Trap focus & escape key
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
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open mobile menu"
        aria-expanded={isOpen}
        className="fixed top-6 right-6 z-50 p-3 glass-nav rounded-full text-white shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
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
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black/60"
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.nav
              variants={drawerVariants}
              initial="closed"
              animate="open"
              exit="closed"
              style={{ backdropFilter: 'blur(40px) saturate(180%)', WebkitBackdropFilter: 'blur(40px) saturate(180%)', background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.25)' }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[80%] max-w-sm flex flex-col p-6 rounded-l-3xl border-r-0"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
            >
              <div className="flex justify-end items-center mb-8">
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close mobile menu"
                  className="p-3 text-white/75 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-full"
                >
                  <FiX size={24} />
                </button>
              </div>

              <ul className="flex flex-col gap-2 flex-1 m-0 p-0 list-none">
                {navLinks.map((link) => (
                  <motion.li key={link.href} variants={shouldReduceMotion ? undefined : itemVariants}>
                    <button
                      onClick={() => handleLinkClick(link.href)}
                      className="w-full flex items-center gap-4 p-4 text-left text-[clamp(1rem,4vw,1.25rem)] font-medium text-white/75 hover:text-white hover:bg-white/10 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                    >
                      <span className="text-white">{link.icon}</span>
                      {link.label}
                    </button>
                  </motion.li>
                ))}
              </ul>

              <motion.div variants={shouldReduceMotion ? undefined : itemVariants} className="mt-auto pt-4">
                <button
                  onClick={handleResume}
                  disabled={!cvUrl}
                  className="w-full flex items-center justify-center gap-3 p-4 bg-white hover:bg-white/90 disabled:bg-white/30 disabled:text-gray-500 disabled:cursor-not-allowed text-gray-900 rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                >
                  <FiFileText size={20} />
                  View Resume
                </button>
              </motion.div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
