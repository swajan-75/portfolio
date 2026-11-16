"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { useProfile } from "@/app/hooks/useProfile";
import SkillGrid from "./_components/SkillGrid";
import SkillMarquee from "./_components/SkillMarquee";
import SkillSearch from "./_components/SkillSearch";
import { NoSkillMatch, SkillsEmpty, SkillsError, SkillsSkeleton } from "./_components/SkillStates";
import { filterCategories, normalizeCategories, padNumber, uniqueSkills } from "./_components/skillModel";

export default function SkillsPage() {
  const { profile, loading, error } = useProfile();
  const [query, setQuery] = useState("");

  const categories = useMemo(() => normalizeCategories(profile?.skill_categories), [profile]);
  const allSkills = useMemo(() => uniqueSkills(categories), [categories]);
  const visibleCategories = useMemo(() => filterCategories(categories, query), [categories, query]);
  const matchCount = visibleCategories.reduce((sum, visible) => sum + visible.skills.length, 0);

  const isReady = !loading && !error && categories.length > 0;
  const isSearching = query.trim() !== "";

  return (
    <main className="min-h-screen w-full overflow-x-clip bg-bg px-4 pt-10 pb-32 sm:px-6 sm:pt-14 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-2 rounded-lg text-sm font-bold text-white/55
                     transition-colors hover:text-accent-light focus-visible:outline-none focus-visible:ring-2
                     focus-visible:ring-accent"
        >
          <FiArrowLeft aria-hidden="true" /> Back to home
        </Link>

        <header className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <h1 className="flex items-start gap-3 text-[clamp(2.75rem,8vw,5rem)] font-black leading-[0.9] tracking-tighter text-white">
            Skills
            {isReady && (
              <span className="mt-1.5 rounded-full border border-border-strong px-2.5 py-1 font-mono text-xs font-semibold tracking-normal text-white/55">
                <span aria-hidden="true">{padNumber(allSkills.length)}</span>
                <span className="sr-only">{allSkills.length} skills</span>
              </span>
            )}
          </h1>
          {isReady && <SkillSearch value={query} onChange={setQuery} />}
        </header>

        {isReady && <SkillMarquee skills={allSkills} />}

        <p aria-live="polite" className="sr-only">
          {isReady && isSearching ? `${matchCount} ${matchCount === 1 ? "skill matches" : "skills match"}` : ""}
        </p>

        {loading && <SkillsSkeleton />}
        {!loading && error && <SkillsError />}
        {!loading && !error && categories.length === 0 && <SkillsEmpty />}
        {isReady && visibleCategories.length === 0 && <NoSkillMatch query={query} onClear={() => setQuery("")} />}
        {isReady && visibleCategories.length > 0 && (
          <SkillGrid categories={visibleCategories} query={query} />
        )}
      </div>
    </main>
  );
}
