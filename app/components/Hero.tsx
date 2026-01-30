"use client";
import { motion } from "motion/react";
import TerminalText from "./TerminalText";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl top-1/4 left-1/3"></div>

      <div className="z-10 text-center max-w-3xl px-6">

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-7xl font-bold text-white"
        >
          Hi, I'm <span className="text-purple-400">Swajan</span> 
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="mt-6 text-xl text-gray-400"
        >
          Software Developer • Android • Web 
        </motion.p>
        <TerminalText />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-10 flex justify-center gap-6"
        >
          <a
            href="#projects"
            className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition text-white font-semibold"
          >
            View Projects
          </a>

          <a
            href="#contact"
            className="px-6 py-3 rounded-xl border border-gray-600 hover:border-purple-500 transition text-white"
          >
            Contact Me
          </a>
        </motion.div>

      </div>
    </section>
  );
}
