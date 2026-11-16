import { FiArrowUpRight, FiGithub } from "react-icons/fi";
import { resolveIconSmart } from "@/app/lib/resolveIcon";
import { TC, themeColorStyle } from "@/app/lib/themeColor";
import { categoryColor, categoryLabel, hasLink, type Project } from "./projectModel";

export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

export function CategoryBadge({ category }: { category?: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-tint px-3 py-1 text-xs font-semibold text-white/75">
      <span
        aria-hidden="true"
        className="theme-color h-2 w-2 rounded-full"
        style={themeColorStyle(categoryColor(category), { background: TC, boxShadow: `0 0 10px ${TC}` })}
      />
      {categoryLabel(category)}
    </span>
  );
}

export function TechChip({ name }: { name: string }) {
  const icon = resolveIconSmart(undefined, name, { size: 13 });
  return (
    <li className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-tint px-2.5 py-1 text-xs font-medium text-white/75">
      {icon && <span aria-hidden="true" className="text-white/60">{icon}</span>}
      {name}
    </li>
  );
}

/** "Live site" and "Code" buttons; renders nothing when the project has neither. */
export function ProjectLinks({ project, className = "" }: { project: Project; className?: string }) {
  const hasLive = hasLink(project.live_url);
  const hasCode = hasLink(project.github_url);
  if (!hasLive && !hasCode) return null;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {hasLive && (
        <a
          href={project.live_url}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex min-h-10 items-center gap-1.5 rounded-full bg-accent px-4 text-sm font-semibold text-[#fff] transition-colors duration-200 hover:bg-accent-light ${FOCUS_RING}`}
        >
          Live site <FiArrowUpRight aria-hidden="true" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      )}
      {hasCode && (
        <a
          href={project.github_url}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex min-h-10 items-center gap-1.5 rounded-full border border-border-strong bg-surface-tint px-4 text-sm font-semibold text-white/85 transition-colors duration-200 hover:bg-surface-tint-hover hover:text-white ${FOCUS_RING}`}
        >
          <FiGithub aria-hidden="true" /> Code
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      )}
    </div>
  );
}
