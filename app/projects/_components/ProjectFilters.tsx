import { TC, themeColorStyle } from "@/app/lib/themeColor";
import { ALL_CATEGORIES, categoryColor, type CategoryCount } from "./projectModel";

interface ProjectFiltersProps {
  categories: CategoryCount[];
  total: number;
  active: string;
  onChange: (key: string) => void;
}

export default function ProjectFilters({ categories, total, active, onChange }: ProjectFiltersProps) {
  const options: CategoryCount[] = [{ key: ALL_CATEGORIES, label: "All", count: total }, ...categories];

  return (
    <div role="group" aria-label="Filter projects by category" className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isActive = option.key === active;
        return (
          <button
            key={option.key}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option.key)}
            className={`inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full border px-4 text-sm font-semibold
                        transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2
                        focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg
                        ${isActive
                          ? "border-accent bg-accent text-[#fff]"
                          : "border-border-strong bg-surface-tint text-white/70 hover:bg-surface-tint-hover hover:text-white"}`}
          >
            {option.key !== ALL_CATEGORIES && (
              <span
                aria-hidden="true"
                className={`h-2 w-2 rounded-full ${isActive ? "bg-[#fff]" : "theme-color"}`}
                style={isActive ? undefined : themeColorStyle(categoryColor(option.key), { background: TC })}
              />
            )}
            {option.label}
            <span className={`font-mono text-xs ${isActive ? "text-[#fff]/75" : "text-white/40"}`}>{option.count}</span>
          </button>
        );
      })}
    </div>
  );
}
