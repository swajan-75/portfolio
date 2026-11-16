import type { SkillItem } from "@/app/hooks/useProfile";
import { resolveIconSmart } from "@/app/lib/resolveIcon";
import { monogramOf, padNumber, splitOnMatch, type VisibleCategory } from "./skillModel";

interface SkillCategoryCardProps {
  visible: VisibleCategory;
  query: string;
}

export default function SkillCategoryCard({ visible, query }: SkillCategoryCardProps) {
  const { category, index, color, skills } = visible;
  const number = index + 1;

  return (
    <article className="card-dark card-dark-hover relative flex h-full flex-col overflow-hidden p-6 sm:p-7">
      {/* Category glow and oversized number (decorative) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: `radial-gradient(80% 60% at 0% 0%, ${color}26 0%, transparent 60%)` }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-8 -right-2 select-none text-[8rem] font-black leading-none tracking-tighter"
        style={{ color, opacity: 0.08 }}
      >
        {padNumber(number)}
      </span>

      <header className="relative mb-5">
        <h2 className="text-xl font-bold leading-tight tracking-tight text-white sm:text-2xl">{category.title}</h2>
        {category.description && (
          <p className="mt-1.5 text-sm leading-relaxed text-white/60">{category.description}</p>
        )}
      </header>

      <ul aria-label={`${category.title} skills`} className="relative flex flex-wrap gap-2">
        {skills.map((skill) => (
          <SkillTile key={skill.name} skill={skill} color={color} query={query} />
        ))}
      </ul>
    </article>
  );
}

function SkillTile({ skill, color, query }: { skill: SkillItem; color: string; query: string }) {
  const icon = resolveIconSmart(skill.icon, skill.name, { size: 17 });

  return (
    // Pills size to their text and wrap only at spaces, so names never split mid-word.
    // Near-solid background keeps the card's oversized number behind them.
    <li className="group/tile inline-flex max-w-full items-center gap-2.5 rounded-xl border border-border bg-surface/90 py-1.5 pl-1.5 pr-3.5 transition-colors duration-200 hover:border-border-strong hover:bg-surface-2">
      <span
        aria-hidden="true"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover/tile:scale-110"
        style={{ background: `${color}1f`, color }}
      >
        {icon ?? <span className="text-[10px] font-black tracking-tight">{monogramOf(skill.name)}</span>}
      </span>
      <span className="min-w-0 text-sm font-semibold leading-snug text-white/85">
        <HighlightedText text={skill.name} query={query} />
      </span>
    </li>
  );
}

function HighlightedText({ text, query }: { text: string; query: string }) {
  const parts = splitOnMatch(text, query);
  if (!parts) return <>{text}</>;
  return (
    <>
      {parts.before}
      <mark className="rounded bg-accent/30 px-0.5 text-white">{parts.match}</mark>
      {parts.after}
    </>
  );
}
