"use client";
import { FiArrowRight, FiEye } from "react-icons/fi";
import ProjectCover from "./ProjectCover";
import { CategoryBadge, FOCUS_RING, ProjectLinks, TechChip } from "./ProjectBits";
import { layoutClasses, type CardLayout } from "./projectLayout";
import { formatMonthYear, padNumber, splitTitle, type Project } from "./projectModel";

const MAX_VISIBLE_TECH = 5;

interface ProjectCardProps {
  project: Project;
  number: number;
  layout: CardLayout;
  /** This card's details are open in the side panel. */
  isSelected: boolean;
  onSelect: (id: Project["id"]) => void;
}

export default function ProjectCard({ project, number, layout, isSelected, onSelect }: ProjectCardProps) {
  const classes = layoutClasses(layout);
  const { name, subtitle } = splitTitle(project.title);
  const description = project.description?.trim() || "No description provided.";
  const techStack = Array.isArray(project.tech_stack) ? project.tech_stack : [];
  const visibleTech = techStack.slice(0, MAX_VISIBLE_TECH);
  const hiddenTechCount = techStack.length - visibleTech.length;
  const clampClass = classes.isWide ? "line-clamp-4 lg:line-clamp-6" : "line-clamp-4";
  const date = formatMonthYear(project.created_at);

  // The whole card opens the details; keyboard users get the same action from the "Read more" button.
  const handleCardClick = (event: React.MouseEvent<HTMLElement>) => {
    if (isSelected) return;
    const target = event.target as HTMLElement;
    if (target.closest("a, button")) return; // Live site / Code / Read more handle their own clicks
    if (window.getSelection()?.toString()) return; // the visitor was selecting text, not clicking
    onSelect(project.id);
  };

  return (
    <article
      onClick={handleCardClick}
      className={`card-dark card-dark-hover group flex h-full overflow-hidden ${classes.card} ${isSelected ? "ring-2 ring-accent" : "cursor-pointer"}`}
    >
      <ProjectCover project={project} className={classes.cover} />

      <div className="flex min-w-0 flex-1 flex-col gap-4 p-6 sm:p-7">
        <div className="flex items-center justify-between gap-3">
          <CategoryBadge category={project.category} />
          <span className="font-mono text-xs text-white/40">
            {padNumber(number)}
            {date && <span className="text-white/30"> · {date}</span>}
          </span>
        </div>

        <div>
          <h2 className="text-xl font-bold leading-tight tracking-tight text-white sm:text-2xl">{name}</h2>
          {subtitle && <p className="mt-1 text-sm font-medium text-white/55">{subtitle}</p>}
        </div>

        <p className={`text-[15px] leading-relaxed text-white/70 ${clampClass}`}>{description}</p>

        {techStack.length > 0 && (
          <ul aria-label="Tech stack" className="flex flex-wrap gap-1.5">
            {visibleTech.map((tech) => (
              <TechChip key={tech} name={tech} />
            ))}
            {hiddenTechCount > 0 && (
              <li className="inline-flex items-center rounded-lg px-2 py-1 text-xs font-medium text-white/45">
                +{hiddenTechCount} more
              </li>
            )}
          </ul>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-border pt-4">
          <ProjectLinks project={project} />
          {isSelected ? (
            <span
              data-project-trigger={String(project.id)}
              tabIndex={-1}
              aria-current="true"
              className="ml-auto inline-flex min-h-10 items-center gap-1.5 rounded-full bg-accent/15 px-3 text-sm font-semibold text-accent-light outline-none"
            >
              <FiEye aria-hidden="true" /> Viewing
            </span>
          ) : (
            <button
              type="button"
              data-project-trigger={String(project.id)}
              onClick={() => onSelect(project.id)}
              className={`group/more ml-auto inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-accent-light transition-colors duration-200 hover:text-white ${FOCUS_RING}`}
            >
              Read more<span className="sr-only"> about {name}</span>
              <FiArrowRight
                aria-hidden="true"
                className="motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover/more:translate-x-0.5"
              />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
