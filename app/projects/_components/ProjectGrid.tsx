"use client";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import ProjectCard from "./ProjectCard";
import { computeLayouts, layoutClasses, SINGLE_COLUMN_LAYOUT } from "./projectLayout";
import type { Project } from "./projectModel";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
const ENTER_DURATION_S = 0.45;
const STAGGER_S = 0.06;

interface ProjectGridProps {
  projects: Project[];
  /** Position in the full, unfiltered list, so numbering stays stable while filtering. */
  numberOf: (project: Project) => number;
  onSelect: (id: Project["id"]) => void;
  /** When set, the grid narrows to one column beside the details panel. */
  selectedId?: Project["id"];
}

export default function ProjectGrid({ projects, numberOf, onSelect, selectedId }: ProjectGridProps) {
  const shouldReduceMotion = useReducedMotion();
  const isSplit = selectedId !== undefined;
  const layouts = isSplit ? projects.map(() => SINGLE_COLUMN_LAYOUT) : computeLayouts(projects.length);

  return (
    <ul
      className={
        isSplit
          ? "grid grid-cols-1 gap-5"
          : "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
      }
    >
      <AnimatePresence mode="popLayout" initial={!shouldReduceMotion}>
        {projects.map((project, index) => (
          <motion.li
            key={project.id}
            data-project-card={String(project.id)}
            layout={!shouldReduceMotion}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            transition={{
              duration: ENTER_DURATION_S,
              ease: EASE_OUT_EXPO,
              delay: shouldReduceMotion ? 0 : index * STAGGER_S,
              layout: { duration: ENTER_DURATION_S, ease: EASE_OUT_EXPO },
            }}
            className={`rounded-[24px] motion-safe:transition-[translate,box-shadow] motion-safe:duration-300 motion-safe:hover:-translate-y-1 hover:shadow-[0_24px_60px_-28px_rgba(108,92,231,0.55)] ${layoutClasses(layouts[index]).item}`}
          >
            <ProjectCard
              project={project}
              number={numberOf(project)}
              layout={layouts[index]}
              isSelected={project.id === selectedId}
              onSelect={onSelect}
            />
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
