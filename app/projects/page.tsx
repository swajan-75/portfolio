"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "motion/react";
import { FiArrowLeft } from "react-icons/fi";
import api from "@/lib/axios";
import ProjectFilters from "./_components/ProjectFilters";
import ProjectGrid from "./_components/ProjectGrid";
import ProjectDetails from "./_components/ProjectDetails";
import { ProjectsEmpty, ProjectsError, ProjectsSkeleton } from "./_components/ProjectStates";
import {
  ALL_CATEGORIES,
  categoryKey,
  countByCategory,
  normalizeProjects,
  padNumber,
  type Project,
} from "./_components/projectModel";

type LoadStatus = "loading" | "ready" | "error";

/** How long the cards take to settle into the single column (matches the grid's layout animation). */
const LAYOUT_SETTLE_MS = 460;

interface Selection {
  id: Project["id"];
  /** "open" = the panel just appeared (focus moves into it); "switch" = another card was picked while open. */
  source: "open" | "switch";
}

/** Puts keyboard focus back on the "Read more" button that opened the details. */
function focusProjectTrigger(id: Project["id"]) {
  requestAnimationFrame(() => {
    document
      .querySelector<HTMLElement>(`[data-project-trigger="${CSS.escape(String(id))}"]`)
      ?.focus();
  });
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [status, setStatus] = useState<LoadStatus>("loading");
  const [attempt, setAttempt] = useState(0);
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES);
  const [selection, setSelection] = useState<Selection | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const controller = new AbortController();
    api
      .get("/projects", { signal: controller.signal })
      .then(({ data }) => {
        // Server returns projects in the admin's drag-and-drop order.
        setProjects(normalizeProjects(data));
        setStatus("ready");
      })
      .catch((err) => {
        if (err?.name === "CanceledError") return;
        console.error("Failed to load projects:", err);
        setStatus("error");
      });

    return () => controller.abort();
  }, [attempt]);

  const categories = useMemo(() => countByCategory(projects), [projects]);

  const numberById = useMemo(
    () => new Map(projects.map((project, i) => [project.id, i + 1])),
    [projects],
  );

  const visibleProjects = useMemo(
    () =>
      activeCategory === ALL_CATEGORIES
        ? projects
        : projects.filter((project) => categoryKey(project.category) === activeCategory),
    [projects, activeCategory],
  );

  const selectedProject = selection
    ? projects.find((project) => project.id === selection.id) ?? null
    : null;

  const selectProject = useCallback(
    (id: Project["id"]) => setSelection((current) => ({ id, source: current ? "switch" : "open" })),
    [],
  );

  // Once the cards have narrowed into one column, bring the clicked card back into view beside the panel.
  const selectedId = selection?.id;
  useEffect(() => {
    if (selectedId === undefined) return;
    const timer = window.setTimeout(() => {
      document
        .querySelector(`[data-project-card="${CSS.escape(String(selectedId))}"]`)
        ?.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth", block: "nearest" });
    }, shouldReduceMotion ? 0 : LAYOUT_SETTLE_MS);
    return () => window.clearTimeout(timer);
  }, [selectedId, shouldReduceMotion]);

  const closeDetails = useCallback(() => {
    if (!selection) return;
    setSelection(null);
    focusProjectTrigger(selection.id);
  }, [selection]);

  const retry = () => {
    setStatus("loading");
    setAttempt((value) => value + 1);
  };

  const numberOf = (project: Project) => numberById.get(project.id) ?? 0;
  const isReady = status === "ready" && projects.length > 0;

  return (
    <main className="min-h-screen w-full bg-bg px-4 pt-10 pb-32 sm:px-6 sm:pt-14 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-2 rounded-lg text-sm font-bold text-white/55
                     transition-colors hover:text-accent-light focus-visible:outline-none focus-visible:ring-2
                     focus-visible:ring-accent"
        >
          <FiArrowLeft aria-hidden="true" /> Back to home
        </Link>

        <header className="mb-10 flex flex-col gap-6 sm:mb-12 lg:flex-row lg:items-end lg:justify-between">
          <h1 className="flex items-start gap-3 text-[clamp(2.75rem,8vw,5rem)] font-black leading-[0.9] tracking-tighter text-white">
            Projects
            {isReady && (
              <span className="mt-1.5 rounded-full border border-border-strong px-2.5 py-1 font-mono text-xs font-semibold tracking-normal text-white/55">
                <span aria-hidden="true">{padNumber(projects.length)}</span>
                <span className="sr-only">{projects.length} projects</span>
              </span>
            )}
          </h1>

          {isReady && categories.length > 1 && (
            <ProjectFilters
              categories={categories}
              total={projects.length}
              active={activeCategory}
              onChange={setActiveCategory}
            />
          )}
        </header>

        {status === "loading" && <ProjectsSkeleton />}
        {status === "error" && <ProjectsError onRetry={retry} />}
        {status === "ready" && projects.length === 0 && <ProjectsEmpty />}
        {isReady && (
          <div
            className={
              selectedProject
                ? "md:grid md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:items-start md:gap-6"
                : ""
            }
          >
            <ProjectGrid
              projects={visibleProjects}
              numberOf={numberOf}
              onSelect={selectProject}
              selectedId={selectedProject?.id}
            />
            {selectedProject && (
              <ProjectDetails
                key={selectedProject.id}
                project={selectedProject}
                number={numberOf(selectedProject)}
                focusOnMount={selection?.source === "open"}
                onClose={closeDetails}
              />
            )}
          </div>
        )}
      </div>
    </main>
  );
}
