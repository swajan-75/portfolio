"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowUpRight, FiFolder } from "react-icons/fi";
import api from "@/lib/axios";

interface Project {
  id: string | number;
  title: string;
  image_link?: string;
  rank?: number;
  created_at?: number;
}

// Fixed layout positions for the floating project thumbnails — mirroring
// the same scattered approach as SkillsCard's floating icon tiles.
const THUMB_LAYOUT = [
  { top: "6%",  left: "5%",  w: 140, h: 88,  rotate: -6 },
  { top: "5%",  left: "52%", w: 130, h: 82,  rotate: 7  },
  { top: "44%", left: "2%",  w: 148, h: 90,  rotate: 5  },
  { top: "42%", left: "54%", w: 135, h: 85,  rotate: -8 },
  { top: "74%", left: "22%", w: 138, h: 86,  rotate: 4  },
];

function sortProjects(list: Project[]): Project[] {
  return [...list].sort((a, b) => {
    const ra = a.rank || Number.MAX_SAFE_INTEGER;
    const rb = b.rank || Number.MAX_SAFE_INTEGER;
    if (ra !== rb) return ra - rb;
    return (b.created_at ?? 0) - (a.created_at ?? 0);
  });
}

export function ProjectsCard() {
  const router = useRouter();
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    api
      .get("/projects", { signal: controller.signal })
      .then(({ data }) => {
        const list: Project[] = Array.isArray(data) ? data : Object.values(data ?? {});
        setProjects(sortProjects(list));
      })
      .catch((err) => {
        if (err?.name !== "CanceledError") console.error("Failed to fetch projects:", err);
      });
    return () => controller.abort();
  }, []);

  // Pick the top projects that have a thumbnail; fall back to any project
  const withImages = projects.filter((p) => p.image_link);
  const tiles = withImages.length >= THUMB_LAYOUT.length
    ? withImages.slice(0, THUMB_LAYOUT.length)
    : projects.slice(0, THUMB_LAYOUT.length);

  return (
    <button
      onPointerDown={(e) => { pointerStart.current = { x: e.clientX, y: e.clientY }; }}
      onPointerUp={(e) => {
        if (!pointerStart.current) return;
        const dx = e.clientX - pointerStart.current.x;
        const dy = e.clientY - pointerStart.current.y;
        pointerStart.current = null;
        if (Math.sqrt(dx * dx + dy * dy) > 8) return;
        router.push("/projects");
      }}
      aria-label="View all projects"
      className="bento-interactive group/projects relative flex h-full w-full min-h-[280px] flex-col justify-end overflow-hidden cursor-grab active:cursor-grabbing
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
    >
      {/* Topo background pattern — same as SkillsCard */}
      <div
        className="bento-topo absolute inset-0 opacity-[0.12]"
        style={{ backgroundImage: "var(--topo-pattern)", backgroundSize: "240px 240px" }}
        aria-hidden="true"
      />

      {/* Floating project thumbnails */}
      <div className="absolute inset-0" aria-hidden="true">
        {tiles.map((project, i) => {
          const layout = THUMB_LAYOUT[i];
          return (
            <span
              key={project.id}
              className="bento-tile absolute overflow-hidden rounded-2xl shadow-xl border border-white/10
                         transition-transform duration-500 group-hover/projects:scale-95"
              style={{
                top: layout.top,
                left: layout.left,
                width: layout.w,
                height: layout.h,
                transform: `rotate(${layout.rotate}deg)`,
              }}
            >
              {project.image_link ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={project.image_link}
                  alt=""
                  aria-hidden="true"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-accent/40 to-mint/20 flex items-center justify-center">
                  <FiFolder size={22} className="text-white/30" />
                </div>
              )}
            </span>
          );
        })}

        {/* Fallback pattern when no projects yet */}
        {tiles.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <FiFolder size={80} className="text-white" />
          </div>
        )}
      </div>

      {/* Hover overlay — same pattern as SkillsCard */}
      <div
        className="bento-overlay absolute inset-0 flex items-center justify-center bg-black/55 opacity-0 backdrop-blur-[2px]
                   transition-opacity duration-300 group-hover/projects:opacity-100"
        aria-hidden="true"
      >
        <span className="text-2xl font-bold tracking-tight text-white">Projects</span>
      </div>

      {/* Arrow button — bottom-left, same as SkillsCard */}
      <span
        className="bento-arrow relative z-10 m-4 flex h-10 w-10 items-center justify-center self-start rounded-full bg-[#fff]
                   text-[#0a0a0f] shadow-md transition-transform duration-300 group-hover/projects:scale-110"
        aria-hidden="true"
      >
        <FiArrowUpRight />
      </span>
    </button>
  );
}
