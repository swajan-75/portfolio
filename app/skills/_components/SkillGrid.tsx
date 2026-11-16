"use client";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { bentoItemClass, computeLayouts } from "@/app/lib/bentoLayout";
import SkillCategoryCard from "./SkillCategoryCard";
import type { VisibleCategory } from "./skillModel";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
const ENTER_DURATION_S = 0.45;
const STAGGER_S = 0.06;

interface SkillGridProps {
  categories: VisibleCategory[];
  query: string;
}

export default function SkillGrid({ categories, query }: SkillGridProps) {
  const shouldReduceMotion = useReducedMotion();
  const layouts = computeLayouts(categories.length);

  return (
    <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      <AnimatePresence mode="popLayout" initial={!shouldReduceMotion}>
        {categories.map((visible, i) => (
          <motion.li
            key={visible.category.title}
            layout={!shouldReduceMotion}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            transition={{
              duration: ENTER_DURATION_S,
              ease: EASE_OUT_EXPO,
              delay: shouldReduceMotion ? 0 : i * STAGGER_S,
              layout: { duration: ENTER_DURATION_S, ease: EASE_OUT_EXPO },
            }}
            className={`rounded-[24px] ${bentoItemClass(layouts[i])}`}
          >
            <SkillCategoryCard visible={visible} query={query} />
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
