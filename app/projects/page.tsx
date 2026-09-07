"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FiArrowLeft,
  FiArrowUpRight,
  FiGithub,
  FiExternalLink,
  FiFolder,
} from "react-icons/fi";
import { motion, AnimatePresence } from "motion/react";
import api from "@/lib/axios";
import { resolveIconSmart } from "@/app/lib/resolveIcon";

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  tech_stack: string[];
  github_url?: string;
  live_url?: string;
  image_link?: string;
  rank?: number;
  created_at?: number;
}

// ─── helpers ─────────────────────────────────────────────────────────────────

function formatDate(epochMs?: number): string {
  if (!epochMs) return "";
  const d = new Date(epochMs);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function categoryColor(category: string): { bg: string; text: string } {
  const map: Record<string, { bg: string; text: string }> = {
    FRONTEND:   { bg: "rgba(108,92,231,0.12)", text: "#a78bfa" },
    BACKEND:    { bg: "rgba(14,165,233,0.12)",  text: "#38bdf8" },
    FULLSTACK:  { bg: "rgba(142,247,212,0.12)", text: "#6ee7b7" },
    WEB_APP:    { bg: "rgba(251,146,60,0.12)",  text: "#fb923c" },
    MOBILE:     { bg: "rgba(232,121,249,0.12)", text: "#e879f9" },
    AI_ML:      { bg: "rgba(250,204,21,0.12)",  text: "#facc15" },
    API:        { bg: "rgba(34,211,238,0.12)",  text: "#22d3ee" },
    CLI_TOOL:   { bg: "rgba(74,222,128,0.12)",  text: "#4ade80" },
    LIBRARY:    { bg: "rgba(248,113,113,0.12)", text: "#f87171" },
    OTHER:      { bg: "rgba(148,163,184,0.12)", text: "#94a3b8" },
  };
  return map[category?.toUpperCase()] ?? map.OTHER;
}

function prettyCategory(category: string): string {
  return category
    ?.replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase()) ?? category;
}

// ─── skeletons ───────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="card-dark rounded-3xl overflow-hidden flex flex-col sm:flex-row animate-pulse">
      <div className="w-full sm:w-[220px] shrink-0 h-44 sm:h-auto bg-white/[0.06]" />
      <div className="flex-1 p-6 flex flex-col gap-4">
        <div className="h-5 w-2/3 rounded-lg bg-white/[0.07]" />
        <div className="h-3 w-full rounded bg-white/[0.05]" />
        <div className="h-3 w-4/5 rounded bg-white/[0.05]" />
        <div className="flex gap-2 mt-auto">
          <div className="h-7 w-7 rounded-full bg-white/[0.06]" />
          <div className="h-7 w-7 rounded-full bg-white/[0.06]" />
          <div className="h-7 w-7 rounded-full bg-white/[0.06]" />
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-white/[0.06]">
          <div className="h-5 w-20 rounded-full bg-white/[0.07]" />
          <div className="h-4 w-24 rounded bg-white/[0.05]" />
        </div>
      </div>
    </div>
  );
}

// ─── project card ─────────────────────────────────────────────────────────────

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const color = categoryColor(project.category);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
      className="card-dark card-dark-hover group rounded-3xl overflow-hidden flex flex-col sm:flex-row"
    >
      {/* ── Thumbnail ── */}
      <div className="relative w-full sm:w-[220px] shrink-0 overflow-hidden">
        {/* aspect-ratio for mobile, full height on desktop */}
        <div className="aspect-[4/3] sm:aspect-auto sm:h-full">
          {project.image_link ? (
            <img
              src={project.image_link}
              alt={`${project.title} preview`}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${color.bg} 0%, rgba(255,255,255,0.02) 100%)`,
              }}
            >
              <FiFolder size={36} style={{ color: color.text }} className="opacity-40" />
            </div>
          )}
          {/* subtle gradient overlay on bottom of thumbnail */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to right, transparent 80%, rgba(21,21,28,0.6) 100%)",
            }}
          />
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 p-6 flex flex-col min-w-0">
        {/* Title */}
        <h2 className="text-xl font-bold text-white mb-2 leading-tight">
          {project.title}
        </h2>

        {/* Description */}
        <p className="text-sm leading-relaxed text-white/65 line-clamp-3 mb-5 flex-1">
          {project.description || "No description provided."}
        </p>

        {/* Tech-stack icons */}
        {project.tech_stack && project.tech_stack.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-5">
            {project.tech_stack.slice(0, 6).map((tech) => {
              const icon = resolveIconSmart(undefined, tech, { size: 18 });
              return icon ? (
                <span
                  key={tech}
                  title={tech}
                  className="flex items-center justify-center w-8 h-8 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.7)" }}
                >
                  {icon}
                </span>
              ) : (
                <span
                  key={tech}
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-lg"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    color: "rgba(255,255,255,0.55)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  {tech}
                </span>
              );
            })}
          </div>
        )}

        {/* Bottom row: links + category + date */}
        <div
          className="flex items-center justify-between gap-3 pt-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          {/* Link buttons */}
          <div className="flex items-center gap-2">
            {/* External link */}
            {project.live_url && project.live_url !== "#" && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${project.title} live demo`}
                className="flex items-center justify-center w-8 h-8 rounded-xl transition-all hover:scale-110"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.6)",
                }}
                title="Live demo"
              >
                <FiArrowUpRight size={15} />
              </a>
            )}
            {/* GitHub */}
            {project.github_url && project.github_url !== "#" && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} on GitHub`}
                className="flex items-center justify-center w-8 h-8 rounded-xl transition-all hover:scale-110"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.6)",
                }}
                title="GitHub"
              >
                <FiGithub size={15} />
              </a>
            )}
          </div>

          {/* Right side: category + date */}
          <div className="flex items-center gap-3 shrink-0">
            <span
              className="text-xs font-bold px-3 py-1 rounded-full"
              style={{
                background: color.bg,
                color: color.text,
                border: `1px solid ${color.text}33`,
              }}
            >
              {prettyCategory(project.category)}
            </span>
            {project.created_at && (
              <span className="text-xs font-medium text-white/35 whitespace-nowrap">
                {formatDate(project.created_at)}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

const SKELETON_COUNT = 6;

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    api
      .get("/projects", { signal: controller.signal })
      .then(({ data }) => {
        const list: Project[] = Array.isArray(data)
          ? data
          : Object.values(data ?? {});
        const sorted = [...list].sort((a, b) => {
          const ra = a.rank || Number.MAX_SAFE_INTEGER;
          const rb = b.rank || Number.MAX_SAFE_INTEGER;
          if (ra !== rb) return ra - rb;
          return (b.created_at ?? 0) - (a.created_at ?? 0);
        });
        setProjects(sorted);
      })
      .catch((err) => {
        if (err?.name !== "CanceledError") console.error("Failed to load projects:", err);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  return (
    <main className="min-h-screen w-full bg-bg px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Back link */}
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-2 rounded-lg text-sm font-bold text-white/50
                     transition-colors hover:text-accent-light focus-visible:outline-none focus-visible:ring-2
                     focus-visible:ring-accent"
        >
          <FiArrowLeft aria-hidden="true" /> Back to home
        </Link>

        {/* Header */}
        <header className="mb-12">
          <span className="eyebrow mb-2 block">What I've built</span>
          <h1 className="text-[clamp(2rem,5vw,3rem)] font-bold tracking-tight text-white">
            Projects
          </h1>
          <p className="mt-3 max-w-2xl text-sm font-medium text-white/60 leading-relaxed">
            A complete list of my technical projects, side experiments, and design work.
          </p>
        </header>

        {/* Grid */}
        {loading ? (
          <div className="flex flex-col gap-5">
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="py-24 text-center">
            <FiFolder size={40} className="mx-auto mb-4 text-white/20" />
            <p className="text-sm font-medium text-white/40">No projects to show yet.</p>
          </div>
        ) : (
          <AnimatePresence>
            <div className="flex flex-col gap-5">
              {projects.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </main>
  );
}
