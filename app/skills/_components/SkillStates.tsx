import { FiAlertTriangle, FiCpu, FiSearch } from "react-icons/fi";
import { Skeleton } from "@/app/components/bento/cards/primitives";
import { bentoItemClass, computeLayouts } from "@/app/lib/bentoLayout";

const SKELETON_CATEGORIES = 6;
const SKELETON_TILES = 6;

/** Placeholder cards laid out exactly like the real grid, so nothing jumps when data arrives. */
export function SkillsSkeleton() {
  return (
    <ul aria-busy="true" aria-label="Loading skills" className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      {computeLayouts(SKELETON_CATEGORIES).map((layout, i) => (
        <li key={i} className={bentoItemClass(layout)}>
          <div className="card-dark flex h-full flex-col gap-5 p-6 sm:p-7">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-3.5 w-16 rounded" />
              <Skeleton className="h-7 w-2/3 rounded-lg" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: SKELETON_TILES }).map((_, j) => (
                <Skeleton key={j} className="h-14 rounded-xl" />
              ))}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function SkillsError() {
  return (
    <div role="alert" className="card-dark flex flex-col items-center gap-3 px-6 py-16 text-center">
      <FiAlertTriangle size={28} aria-hidden="true" className="text-white/40" />
      <p className="text-base font-semibold text-white">Couldn&apos;t load skills.</p>
      <p className="text-sm text-white/55">Check your connection and try again.</p>
      <button type="button" onClick={() => window.location.reload()} className="btn-secondary mt-2 cursor-pointer text-sm">
        Try again
      </button>
    </div>
  );
}

export function SkillsEmpty() {
  return (
    <div className="py-24 text-center">
      <FiCpu size={40} aria-hidden="true" className="mx-auto mb-4 text-white/20" />
      <p className="text-sm font-medium text-white/50">No skills to show yet.</p>
    </div>
  );
}

export function NoSkillMatch({ query, onClear }: { query: string; onClear: () => void }) {
  return (
    <div className="card-dark flex flex-col items-center gap-3 px-6 py-16 text-center">
      <FiSearch size={28} aria-hidden="true" className="text-white/35" />
      <p className="text-base font-semibold text-white">No skills match &ldquo;{query.trim()}&rdquo;.</p>
      <button type="button" onClick={onClear} className="btn-secondary mt-2 cursor-pointer text-sm">
        Clear search
      </button>
    </div>
  );
}
