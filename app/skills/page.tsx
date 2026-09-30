"use client";
import Link from "next/link";
import { FiArrowLeft, FiCpu } from "react-icons/fi";
import { resolveIconSmart } from "@/app/lib/resolveIcon";
import { Skeleton } from "@/app/components/bento/cards/primitives";
import { useProfile, type SkillCategory, type SkillItem } from "@/app/hooks/useProfile";

const SKELETON_SECTIONS = 3;
const SKELETON_TILES = 5;

export default function SkillsPage() {
  const { profile, loading } = useProfile();
  const categories = (profile?.skill_categories ?? []).filter((c) => (c.skills ?? []).length > 0);

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

        <header className="mb-12">
          <span className="eyebrow mb-2 block">What I work with</span>
          <h1 className="text-[clamp(2rem,5vw,3rem)] font-bold tracking-tight text-white">Skills</h1>
          <p className="mt-3 max-w-2xl font-medium text-white/65">
            The languages, frameworks, and tools I reach for day to day.
          </p>
        </header>

        {loading ? (
          <div className="flex flex-col gap-12">
            {Array.from({ length: SKELETON_SECTIONS }).map((_, i) => (
              <div key={i}>
                <Skeleton className="mb-5 h-8 w-64 rounded-xl" />
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                  {Array.from({ length: SKELETON_TILES }).map((__, j) => (
                    <Skeleton key={j} className="h-28 rounded-2xl" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <p className="py-16 text-center text-sm font-medium text-white/50">No skills to show yet.</p>
        ) : (
          <div className="flex flex-col gap-14">
            {categories.map((category, i) => (
              <CategorySection key={`${category.title}-${i}`} category={category} index={i} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function CategorySection({ category, index }: { category: SkillCategory; index: number }) {
  const headingId = `skill-category-${index}`;

  return (
    <section aria-labelledby={headingId}>
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/15 text-accent-light">
          {resolveIconSmart(category.icon, category.title, { size: 22 }) ?? <FiCpu size={22} />}
        </div>
        <div className="min-w-0">
          <h2 id={headingId} className="flex flex-wrap items-baseline gap-x-3 text-xl font-bold tracking-tight text-white sm:text-2xl">
            {category.title}
            <span className="text-sm font-semibold text-white/40">
              {category.skills.length} {category.skills.length === 1 ? "skill" : "skills"}
            </span>
          </h2>
          {category.description && (
            <p className="mt-1 max-w-3xl text-sm leading-relaxed text-white/60">{category.description}</p>
          )}
        </div>
      </div>

      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {category.skills.map((skill, i) => (
          <SkillTile key={`${skill.name}-${i}`} skill={skill} />
        ))}
      </ul>
    </section>
  );
}

function SkillTile({ skill }: { skill: SkillItem }) {
  return (
    <li className="card-dark card-dark-hover flex flex-col items-center justify-center gap-3 rounded-2xl p-5 text-center">
      <span className="text-3xl text-white/85" aria-hidden="true">
        {resolveIconSmart(skill.icon, skill.name, { size: 30 }) ?? <FiCpu size={30} />}
      </span>
      <span className="text-sm font-bold text-white">{skill.name}</span>
    </li>
  );
}
