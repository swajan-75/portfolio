"use client";
import { useEffect, useId, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { FiX } from "react-icons/fi";
import ProjectCover from "./ProjectCover";
import { CategoryBadge, FOCUS_RING, ProjectLinks, TechChip } from "./ProjectBits";
import { formatMonthYear, padNumber, splitTitle, type Project } from "./projectModel";

/** Below the `md` breakpoint the panel covers the whole screen instead of sitting beside the list. */
const FULLSCREEN_QUERY = "(max-width: 767.98px)";
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

interface ProjectDetailsProps {
  project: Project;
  number: number;
  /** Move focus into the panel when it opens from the grid (not when switching from the list). */
  focusOnMount: boolean;
  onClose: () => void;
}

export default function ProjectDetails({ project, number, focusOnMount, onClose }: ProjectDetailsProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const shouldReduceMotion = useReducedMotion();

  useCloseOnEscape(onClose);
  useFullscreenScrollLock();

  useEffect(() => {
    if (focusOnMount) closeRef.current?.focus({ preventScroll: true });
  }, [focusOnMount]);

  const { name, subtitle } = splitTitle(project.title);
  const description = project.description?.trim() || "No description provided.";
  const techStack = Array.isArray(project.tech_stack) ? project.tech_stack : [];
  const date = formatMonthYear(project.created_at);

  return (
    <motion.aside
      aria-labelledby={titleId}
      initial={shouldReduceMotion ? false : { opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
      className="custom-scrollbar fixed inset-0 z-[60] overflow-y-auto bg-bg
                 md:sticky md:inset-auto md:top-6 md:z-auto md:max-h-[calc(100vh-8rem)]
                 md:rounded-[24px] md:border md:border-border md:bg-surface"
    >
      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-border bg-bg/90 px-5 py-3 backdrop-blur-md md:bg-surface/90">
        <div className="flex min-w-0 items-center gap-3">
          <CategoryBadge category={project.category} />
          <span className="truncate font-mono text-xs text-white/40">
            {padNumber(number)}
            {date && ` · ${date}`}
          </span>
        </div>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close details"
          className={`flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border-strong bg-surface-tint text-white/70 transition-colors duration-200 hover:bg-surface-tint-hover hover:text-white ${FOCUS_RING}`}
        >
          <FiX size={18} aria-hidden="true" />
        </button>
      </div>

      <div className="p-5 sm:p-7">
        <ProjectCover project={project} className="aspect-[2/1] w-full rounded-2xl lg:aspect-[3/1]" />

        <h2 id={titleId} className="mt-6 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">
          {name}
        </h2>
        {subtitle && <p className="mt-2 text-base font-medium text-white/55">{subtitle}</p>}

        <ProjectLinks project={project} className="mt-5" />

        <section className="mt-8">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.08em] text-accent-light">About</h3>
          <p className="whitespace-pre-line text-[15px] leading-relaxed text-white/75">{description}</p>
        </section>

        {techStack.length > 0 && (
          <section className="mt-8">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.08em] text-accent-light">Tech stack</h3>
            <ul className="flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <TechChip key={tech} name={tech} />
              ))}
            </ul>
          </section>
        )}
      </div>
    </motion.aside>
  );
}

function useCloseOnEscape(onClose: () => void) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);
}

/** Stop the page behind the full-screen (phone) panel from scrolling. */
function useFullscreenScrollLock() {
  useEffect(() => {
    const query = window.matchMedia(FULLSCREEN_QUERY);
    const apply = () => {
      document.body.style.overflow = query.matches ? "hidden" : "";
    };
    apply();
    query.addEventListener("change", apply);
    return () => {
      query.removeEventListener("change", apply);
      document.body.style.overflow = "";
    };
  }, []);
}
