import { FiAlertTriangle, FiFolder } from "react-icons/fi";
import { Skeleton } from "@/app/components/bento/cards/primitives";
import { computeLayouts, layoutClasses } from "./projectLayout";

const SKELETON_COUNT = 6;

/** Placeholder cards laid out exactly like the real grid, so nothing jumps when data arrives. */
export function ProjectsSkeleton() {
  const layouts = computeLayouts(SKELETON_COUNT);

  return (
    <ul aria-busy="true" aria-label="Loading projects" className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      {layouts.map((layout, i) => {
        const classes = layoutClasses(layout);
        return (
          <li key={i} className={classes.item}>
            <div className={`card-dark flex h-full overflow-hidden ${classes.card}`}>
              <Skeleton className={`rounded-none ${classes.cover}`} />
              <div className="flex flex-1 flex-col gap-4 p-6 sm:p-7">
                <Skeleton className="h-6 w-28 rounded-full" />
                <Skeleton className="h-7 w-2/3 rounded-lg" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-3.5 w-full rounded" />
                  <Skeleton className="h-3.5 w-11/12 rounded" />
                  <Skeleton className="h-3.5 w-4/5 rounded" />
                </div>
                <div className="mt-auto flex gap-2 pt-4">
                  <Skeleton className="h-10 w-28 rounded-full" />
                  <Skeleton className="h-10 w-24 rounded-full" />
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function ProjectsError({ onRetry }: { onRetry: () => void }) {
  return (
    <div role="alert" className="card-dark flex flex-col items-center gap-3 px-6 py-16 text-center">
      <FiAlertTriangle size={28} aria-hidden="true" className="text-white/40" />
      <p className="text-base font-semibold text-white">Couldn&apos;t load projects.</p>
      <p className="text-sm text-white/55">Check your connection and try again.</p>
      <button type="button" onClick={onRetry} className="btn-secondary mt-2 cursor-pointer text-sm">
        Try again
      </button>
    </div>
  );
}

export function ProjectsEmpty() {
  return (
    <div className="py-24 text-center">
      <FiFolder size={40} aria-hidden="true" className="mx-auto mb-4 text-white/20" />
      <p className="text-sm font-medium text-white/50">No projects to show yet.</p>
    </div>
  );
}
