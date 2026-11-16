import type { Profile, SkillCategory } from "@/app/hooks/useProfile";
import { categoryLabel, hasLink, splitTitle, type Project } from "@/app/projects/_components/projectModel";
import { BLANK, displayUrl, keyValues, linkify, monthYear, seg } from "./format";
import type { Line, Segment } from "./types";

/** Text shown by both the portfolio commands and the matching files under ~. */

export function aboutLines(profile: Profile): Line[] {
  return [
    [seg(profile.name, "heading")],
    [seg(`${profile.title} · ${profile.subtitle}`, "muted")],
    BLANK,
    ...keyValues([
      ["Location", profile.location],
      ["Education", profile.education_info?.degree ?? profile.education],
      ...(profile.education_info?.institution ? ([["", profile.education_info.institution]] as Array<[string, string]>) : []),
    ]),
    BLANK,
    linkify(profile.bio),
  ];
}

export function contactLines(profile: Profile): Line[] {
  const rows = profile.socials
    .filter((social) => hasLink(social.url))
    .map((social): [string, Segment] => [
      social.platform.toLowerCase(),
      seg(displayUrl(social.url), "dir", social.url),
    ]);
  return rows.length ? keyValues(rows) : [[seg("No contact links published yet.", "muted")]];
}

export function educationLines(profile: Profile): Line[] {
  const info = profile.education_info;
  return [
    [seg(info?.degree ?? profile.education, "heading")],
    ...(info?.institution ? [[seg(info.institution, "muted")]] : []),
  ];
}

export function achievementLines(profile: Profile): Line[] {
  const highlights = profile.highlights ?? [];
  if (!highlights.length) return [[seg("No achievements listed yet.", "muted")]];
  return highlights.flatMap((item, index) => [
    ...(index > 0 ? [BLANK] : []),
    [seg(item.title, "heading"), seg(`  ${item.value}`, "accent")],
    ...(item.subtext ? [[seg(item.subtext, "muted")]] : []),
  ]);
}

export function skillCategoryLines(category: SkillCategory): Line[] {
  return [
    [seg(category.title, "heading")],
    ...(category.description ? [[seg(category.description, "muted")]] : []),
    [seg(category.skills.map((skill) => skill.name).join(", "))],
  ];
}

export function projectLines(project: Project): Line[] {
  const { name, subtitle } = splitTitle(project.title);
  const date = project.created_at ? monthYear(new Date(project.created_at)) : null;
  const meta = [categoryLabel(project.category), date].filter(Boolean).join(" · ");
  const details: Array<[string, Segment | string]> = [];
  if (project.tech_stack?.length) details.push(["Stack", project.tech_stack.join(", ")]);
  if (hasLink(project.live_url)) details.push(["Live", seg(project.live_url, "dir", project.live_url)]);
  if (hasLink(project.github_url)) details.push(["Code", seg(project.github_url, "dir", project.github_url)]);

  return [
    [seg(name, "heading")],
    ...(subtitle ? [[seg(subtitle)]] : []),
    [seg(meta, "muted")],
    ...(project.description ? [BLANK, linkify(project.description)] : []),
    ...(details.length ? [BLANK, ...keyValues(details)] : []),
  ];
}
