"use client";
import { motion, useReducedMotion } from "motion/react";
import { useProfile } from "../hooks/useProfile";
import TerminalText from "./TerminalText";

export default function Hero() {
  const { profile } = useProfile();
  const shouldReduceMotion = useReducedMotion();

  const yOffset = shouldReduceMotion ? 0 : 40;
  const smallYOffset = shouldReduceMotion ? 0 : 20;

  return (
    <header id="hero" className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-12 pb-12">
      <div className="z-10 w-full max-w-7xl px-5 sm:px-8 mx-auto flex flex-col items-center min-h-[inherit] justify-center -mt-16 md:-mt-24 text-center">
        <div className="w-full p-8 sm:p-12 md:p-16 relative overflow-hidden flex flex-col items-center">
          
        <motion.div
          initial={{ opacity: 0, y: yOffset }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.3 : 1, ease: "easeOut" }}
          className="py-2 relative z-10"
        >
          <h1 className="text-[clamp(2rem,6vw,4rem)] font-bold text-white leading-[1.1] tracking-tight text-center">
            Hi, I&apos;m {profile?.name || "Swajan Barua"}
          </h1>

          <p className="mt-3 text-[clamp(0.9rem,3vw,1.125rem)] text-accent-light font-medium max-w-2xl mx-auto text-center whitespace-nowrap">
            {profile?.subtitle || "NestJS • Next.js • FastAPI"}
          </p>

          <div className="flex justify-center w-full text-white/65">
            <TerminalText />
          </div>
        </motion.div>

          <motion.div
            initial={{ opacity: 0, y: smallYOffset }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: shouldReduceMotion ? 0 : 0.8, duration: shouldReduceMotion ? 0.3 : 0.8, ease: "easeOut" }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full"
          >
          <a
            href="#projects"
            className="btn-primary w-full sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            View Projects
          </a>

          <a
            href="#contact"
            className="btn-secondary w-full sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            Contact Me
          </a>
        </motion.div>
        
        </div>
      </div>
    </header>
  );
}