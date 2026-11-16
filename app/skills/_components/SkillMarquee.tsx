"use client";
import { motion, useReducedMotion } from "motion/react";
import type { SkillItem } from "@/app/hooks/useProfile";
import { resolveIconSmart } from "@/app/lib/resolveIcon";

/** Seconds each skill adds to one loop, so speed stays the same however many skills there are. */
const SECONDS_PER_SKILL = 1.8;

/** Decorative scrolling strip of every skill. Static when the visitor prefers reduced motion. */
export default function SkillMarquee({ skills }: { skills: SkillItem[] }) {
  const shouldReduceMotion = useReducedMotion();
  if (skills.length === 0) return null;

  // Two copies back to back; sliding by exactly half loops seamlessly.
  const loop = [...skills, ...skills];

  return (
    <div
      aria-hidden="true"
      className="relative -mx-4 mb-10 overflow-hidden py-1 sm:mx-0"
      style={{ maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)" }}
    >
      <motion.ul
        className="flex w-max"
        animate={shouldReduceMotion ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: skills.length * SECONDS_PER_SKILL, ease: "linear", repeat: Infinity }}
      >
        {loop.map((skill, i) => (
          // Spacing lives inside each item (pr-3) so both halves are exactly equal width.
          <li key={`${skill.name}-${i}`} className="pr-3">
            <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-border bg-surface-tint px-3.5 py-2 text-sm font-medium text-white/60">
              {resolveIconSmart(skill.icon, skill.name, { size: 15 })}
              {skill.name}
            </span>
          </li>
        ))}
      </motion.ul>
    </div>
  );
}
