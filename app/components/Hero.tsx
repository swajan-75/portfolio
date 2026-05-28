"use client";
import { motion, useReducedMotion } from "motion/react";
import { useProfile } from "../hooks/useProfile";
import TerminalText from "./TerminalText";
import SplitText from "./SplitText";

export default function Hero() {
  const { profile, loading } = useProfile();
  const shouldReduceMotion = useReducedMotion();

  if (loading) return null; // Or a skeleton

  const yOffset = shouldReduceMotion ? 0 : 40;
  const smallYOffset = shouldReduceMotion ? 0 : 20;

  return (
    <header className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-12 pb-12">
      <div className="z-10 w-full max-w-7xl px-5 sm:px-8 mx-auto flex flex-col items-center min-h-[inherit] justify-center -mt-16 md:-mt-24 text-center">
        <div className="w-full p-8 sm:p-12 md:p-16 relative overflow-hidden flex flex-col items-center">
          
        <motion.div
          initial={{ opacity: 0, y: yOffset }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.3 : 1, ease: "easeOut" }}
          className="py-2 relative z-10"
        >
          <SplitText
            tag="h1"
            text={`Hi, I'm ${profile?.name || "Swajan"}`}
            className="text-[clamp(2.5rem,10vw,5.5rem)] font-bold text-white leading-[1.1] tracking-tight text-center"
            delay={40}
            duration={1}
            ease="power3.out"
            splitType="words,chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            textAlign="center"
          />

          <p className="mt-6 text-[clamp(1.125rem,4vw,1.5rem)] text-sky-200 font-medium max-w-2xl mx-auto text-center">
            {profile?.subtitle || "Software Developer • Android • Web"}
          </p>

          <div className="mt-4 text-white/65 flex justify-center w-full">
            <TerminalText />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: smallYOffset }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: shouldReduceMotion ? 0 : 0.8, duration: shouldReduceMotion ? 0.3 : 0.8, ease: "easeOut" }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full"
        >
          <a
            href="#projects"
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-white hover:bg-gray-200 transition-colors text-black font-medium text-base text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 shadow-lg shadow-black/10"
          >
            View Projects
          </a>

          <a
            href="#contact"
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-black/30 backdrop-blur-md border border-white/20 hover:bg-black/40 transition-colors text-white font-medium text-base text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            Contact Me
          </a>
        </motion.div>
        
        </div>
      </div>
    </header>
  );
}