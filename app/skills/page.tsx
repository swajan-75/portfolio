"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FiArrowLeft, FiArrowUpRight, FiCpu } from "react-icons/fi";
import api from "@/lib/axios";
import { resolveIconSmart } from "@/app/lib/resolveIcon";
import { Skeleton } from "@/app/components/bento/cards/primitives";

interface Skill {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  url?: string;
  proficiency: number;
  featured: boolean;
}

const SKELETON_COUNT = 6;

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    api
      .get("/skills", { signal: controller.signal })
      .then(({ data }) => setSkills(Array.isArray(data) ? data : []))
      .catch((err) => {
        if (err?.name !== "CanceledError") console.error("Failed to fetch skills:", err);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  return (
    <main className="min-h-screen w-full bg-bg px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 rounded-lg text-sm font-bold text-white/60
                     transition-colors hover:text-accent-light focus-visible:outline-none focus-visible:ring-2
                     focus-visible:ring-accent"
        >
          <FiArrowLeft aria-hidden="true" /> Back to home
        </Link>

        <header className="mb-10">
          <span className="eyebrow mb-2 block">What I work with</span>
          <h1 className="text-[clamp(2rem,5vw,3rem)] font-bold tracking-tight text-white">Skills</h1>
          <p className="mt-3 max-w-2xl font-medium text-white/65">
            The languages, frameworks, and tools I reach for day to day.
          </p>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-3xl" />
            ))}
          </div>
        ) : skills.length === 0 ? (
          <p className="py-16 text-center text-sm font-medium text-white/50">No skills to show yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {skills.map((skill) => (
              <SkillTile key={skill.id} skill={skill} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function SkillTile({ skill }: { skill: Skill }) {
  return (
    <article className="card-dark card-dark-hover flex h-full flex-col rounded-3xl p-6">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/15 text-3xl text-accent-light">
        {resolveIconSmart(skill.icon, skill.name, { size: 28 }) ?? <FiCpu size={28} />}
      </div>

      <h2 className="mb-2 text-lg font-bold text-white">{skill.name}</h2>
      <p className="flex-1 text-sm leading-relaxed text-white/65">
        {skill.description || "No description yet."}
      </p>

      {skill.url && (
        <a
          href={skill.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Learn more about ${skill.name}`}
          className="mt-5 flex h-9 w-9 items-center justify-center self-start rounded-full bg-white/10
                     text-white/70 transition-colors hover:bg-accent hover:text-white
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <FiArrowUpRight aria-hidden="true" />
        </a>
      )}
    </article>
  );
}
