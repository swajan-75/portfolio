"use client";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { FiCpu, FiAward, FiArrowUpRight } from "react-icons/fi";
import { resolveIconSmart } from "@/app/lib/resolveIcon";
import { useProfile } from "../../../hooks/useProfile";
import { CardHeader, CardBody, Skeleton } from "./primitives";

const SKILL_TILE_LAYOUT = [
  { top: "10%", left: "12%", size: 56, rotate: -12 },
  { top: "6%", left: "58%", size: 46, rotate: 9 },
  { top: "38%", left: "4%", size: 58, rotate: 6 },
  { top: "32%", left: "62%", size: 50, rotate: -8 },
  { top: "64%", left: "22%", size: 52, rotate: 13 },
  { top: "60%", left: "58%", size: 48, rotate: -10 },
];

const FALLBACK_SKILL_TAGS = ["TypeScript", "Next.js", "NestJS", "PostgreSQL", "Docker", "Python"];


export function SkillsCard() {
  const router = useRouter();
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const { profile } = useProfile();
  const tags = (profile?.tech_tags?.length ? profile.tech_tags : FALLBACK_SKILL_TAGS).slice(
    0,
    SKILL_TILE_LAYOUT.length,
  );

  return (
    <button
      onPointerDown={(e) => { pointerStart.current = { x: e.clientX, y: e.clientY }; }}
      onPointerUp={(e) => {
        if (!pointerStart.current) return;
        const dx = e.clientX - pointerStart.current.x;
        const dy = e.clientY - pointerStart.current.y;
        pointerStart.current = null;
        if (Math.sqrt(dx * dx + dy * dy) > 8) return;
        router.push("/skills");
      }}
      aria-label="View all skills"
      className="bento-interactive group/skills relative flex h-full w-full min-h-[280px] flex-col justify-end overflow-hidden cursor-grab active:cursor-grabbing
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
    >
      <div
        className="bento-topo absolute inset-0 opacity-[0.12]"
        style={{ backgroundImage: "var(--topo-pattern)", backgroundSize: "240px 240px" }}
        aria-hidden="true"
      />

      <div className="absolute inset-0" aria-hidden="true">
        {tags.map((tag, i) => {
          const layout = SKILL_TILE_LAYOUT[i % SKILL_TILE_LAYOUT.length];
          return (
            <span
              key={tag}
              className="bento-tile absolute flex items-center justify-center rounded-2xl bg-[#fff] text-[#0a0a0f] shadow-lg
                         transition-transform duration-500 group-hover/skills:scale-95"
              style={{
                top: layout.top,
                left: layout.left,
                width: layout.size,
                height: layout.size,
                transform: `rotate(${layout.rotate}deg)`,
              }}
            >
              {resolveIconSmart(undefined, tag, { size: 22 }) ?? <FiCpu size={22} />}
            </span>
          );
        })}
      </div>

      <div
        className="bento-overlay absolute inset-0 flex items-center justify-center bg-black/55 opacity-0 backdrop-blur-[2px]
                   transition-opacity duration-300 group-hover/skills:opacity-100"
        aria-hidden="true"
      >
        <span className="text-2xl font-bold tracking-tight text-white">Skills</span>
      </div>

      <span
        className="bento-arrow relative z-10 m-4 flex h-10 w-10 items-center justify-center self-start rounded-full bg-[#fff]
                   text-[#0a0a0f] shadow-md transition-transform duration-300 group-hover/skills:scale-110"
        aria-hidden="true"
      >
        <FiArrowUpRight />
      </span>
    </button>
  );
}

export function HighlightsCard() {
  const { profile, loading } = useProfile();
  const highlights = profile?.highlights ?? [];

  return (
    <CardBody>
      <CardHeader icon={<FiAward />} title="Achievement" />
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {highlights.map((highlight, i) => (
            <div key={i} className="card-inset p-4 rounded-2xl">
              <div className="text-xs font-medium text-white/70 mb-1.5">{highlight.title}</div>
              <div className="text-xl font-bold text-accent-light mb-0.5">{highlight.value}</div>
              {highlight.subtext && (
                <div className="text-[11px] font-bold text-white/50">{highlight.subtext}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </CardBody>
  );
}
