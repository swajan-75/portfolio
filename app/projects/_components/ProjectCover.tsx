import { TC, tcAlpha, themeColorStyle, type ThemeColor } from "@/app/lib/themeColor";
import { categoryColor, initialsOf, type Project } from "./projectModel";

interface ProjectCoverProps {
  project: Project;
  className: string;
}

/** Screenshot when the project has one; otherwise a generated cover in the category's color. */
export default function ProjectCover({ project, className }: ProjectCoverProps) {
  return (
    <div className={`relative shrink-0 overflow-hidden ${className}`}>
      {project.image_link ? (
        <>
          <img
            src={project.image_link}
            alt={`${project.title} screenshot`}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out motion-safe:group-hover:scale-105"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent"
          />
        </>
      ) : (
        <GeneratedCover title={project.title} color={categoryColor(project.category)} />
      )}
    </div>
  );
}

function GeneratedCover({ title, color }: { title: string; color: ThemeColor }) {
  return (
    <div
      aria-hidden="true"
      className="theme-color absolute inset-0 bg-surface-2"
      style={themeColorStyle(color, {
        backgroundImage: `radial-gradient(120% 90% at 12% 8%, ${tcAlpha(30)} 0%, transparent 55%), radial-gradient(90% 80% at 100% 100%, ${tcAlpha(16)} 0%, transparent 60%)`,
      })}
    >
      {/* Dot texture */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: "radial-gradient(var(--color-border-strong) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
          maskImage: "linear-gradient(to bottom right, black 20%, transparent 85%)",
        }}
      />
      <span
        className="absolute bottom-3 left-5 select-none text-[clamp(4.5rem,10vw,7.5rem)] font-black leading-none tracking-tighter motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:translate-x-1.5"
        style={{ color: TC, opacity: 0.9 }}
      >
        {initialsOf(title)}
      </span>
    </div>
  );
}
