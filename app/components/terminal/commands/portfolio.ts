import type { Profile } from "@/app/hooks/useProfile";
import { categoryLabel, hasLink, splitTitle, type Project } from "@/app/projects/_components/projectModel";
import { aboutLines, achievementLines, contactLines, educationLines, projectLines, skillCategoryLines } from "../content";
import { BLANK, error, seg, slugify, table } from "../format";
import { getNode, resolvePath } from "../filesystem";
import type { Command, CommandResult, Line, ShellContext } from "../types";

const STACK_PREVIEW = 3;

function withProfile(ctx: ShellContext, name: string, render: (profile: Profile) => CommandResult): CommandResult {
  if (ctx.data.profile) return render(ctx.data.profile);
  return error(ctx.data.isLoading ? `${name}: still loading, try again in a moment` : `${name}: profile unavailable`);
}

function projectSlug(project: Project): string {
  return slugify(splitTitle(project.title).name);
}

/** Finds a project by list number, slug or name prefix. */
export function findProject(projects: Project[], query: string): Project | undefined {
  const index = Number(query);
  if (Number.isInteger(index) && index >= 1) return projects[index - 1];
  const needle = slugify(query);
  return projects.find((p) => projectSlug(p) === needle) ?? projects.find((p) => projectSlug(p).startsWith(needle));
}

function projectList(projects: Project[]): Line[] {
  const rows = projects.map((project, i) => {
    const stack = project.tech_stack ?? [];
    const more = stack.length > STACK_PREVIEW ? ` +${stack.length - STACK_PREVIEW}` : "";
    return [
      seg(String(i + 1), "muted"),
      seg(projectSlug(project), "dir"),
      seg(categoryLabel(project.category), "accent"),
      seg(stack.slice(0, STACK_PREVIEW).join(", ") + more),
    ];
  });
  return [
    ...table(["#", "NAME", "TYPE", "STACK"], rows),
    BLANK,
    [seg("Run "), seg("projects <name|#>", "exec"), seg(" for details.", "default")],
  ];
}

const about: Command = {
  name: "about",
  summary: "Who Swajan is",
  group: "Portfolio",
  run: (_args, ctx) => withProfile(ctx, "about", aboutLines),
};

const projects: Command = {
  name: "projects",
  summary: "List projects, or show one in detail",
  usage: "projects [name | #]",
  group: "Portfolio",
  run(args, ctx) {
    const list = ctx.data.projects;
    if (!list.length) return error(ctx.data.isLoading ? "projects: still loading, try again in a moment" : "projects: none found");
    if (!args.length) return projectList(list);
    const project = findProject(list, args.join(" "));
    return project ? projectLines(project) : error(`projects: no project matches '${args.join(" ")}'`);
  },
  complete: (_args, ctx) => ctx.data.projects.map(projectSlug),
};

const skills: Command = {
  name: "skills",
  summary: "Skills by category, or filter by name",
  usage: "skills [category | skill]",
  group: "Portfolio",
  run(args, ctx) {
    return withProfile(ctx, "skills", (profile) => {
      const categories = profile.skill_categories ?? [];
      const query = args.join(" ").toLowerCase();
      const matches = !query
        ? categories
        : categories
            .map((category) =>
              slugify(category.title).startsWith(slugify(query))
                ? category
                : { ...category, description: "", skills: category.skills.filter((s) => s.name.toLowerCase().includes(query)) },
            )
            .filter((category) => category.skills.length);
      if (!matches.length) return error(`skills: nothing matches '${query}'`);
      return matches.flatMap((category, i) => [...(i > 0 ? [BLANK] : []), ...skillCategoryLines(category)]);
    });
  },
  complete: (_args, ctx) => (ctx.data.profile?.skill_categories ?? []).map((c) => slugify(c.title)),
};

const education: Command = {
  name: "education",
  summary: "Degree and university",
  group: "Portfolio",
  run: (_args, ctx) => withProfile(ctx, "education", educationLines),
};

const achievements: Command = {
  name: "achievements",
  summary: "Awards and contest results",
  group: "Portfolio",
  run: (_args, ctx) => withProfile(ctx, "achievements", achievementLines),
};

const contact: Command = {
  name: "contact",
  summary: "Email and social links",
  group: "Portfolio",
  run: (_args, ctx) =>
    withProfile(ctx, "contact", (profile) => [
      ...contactLines(profile),
      BLANK,
      [seg("Run "), seg("open email", "exec"), seg(" to write to Swajan, or "), seg("open github", "exec"), seg(".")],
    ]),
};

const resume: Command = {
  name: "resume",
  summary: "Open the CV (PDF)",
  group: "Portfolio",
  run(_args, ctx) {
    if (!ctx.data.cvUrl) return error("resume: no CV is published right now");
    ctx.actions.openUrl(ctx.data.cvUrl);
    return [[seg("Opening resume.pdf in a new tab…", "muted")]];
  },
};

/** Where `open <target>` should go, or null when nothing matches. */
function resolveOpenTarget(target: string, ctx: ShellContext): string | null {
  if (/^(https?:\/\/|mailto:)/.test(target)) return target;
  const key = target.toLowerCase();
  if (["resume", "cv", "resume.pdf"].includes(key)) return ctx.data.cvUrl;

  const social = ctx.data.profile?.socials.find((s) => s.platform.toLowerCase() === key || (key === "mail" && s.platform.toLowerCase() === "email"));
  if (social && hasLink(social.url)) return social.url;

  const node = getNode(ctx.fs, resolvePath(ctx.cwd, target));
  if (node?.kind === "file" && node.url) return node.url;

  const project = findProject(ctx.data.projects, target.replace(/\/$/, "").split("/").pop() ?? target);
  if (project) return hasLink(project.live_url) ? project.live_url : hasLink(project.github_url) ? project.github_url : null;
  return null;
}

const open: Command = {
  name: "open",
  summary: "Open a link, project, social profile or the CV",
  usage: "open <url | project | github | linkedin | email | resume>",
  group: "Portfolio",
  run(args, ctx) {
    const target = args[0];
    if (!target) return error("usage: open <url | project | github | linkedin | email | resume>");
    const url = resolveOpenTarget(target, ctx);
    if (!url) return error(`The file ${resolvePath(ctx.cwd, target)} does not exist.`);
    ctx.actions.openUrl(url);
    return [[seg(`Opening ${url.replace(/^mailto:/, "")}…`, "muted")]];
  },
  complete: (_args, ctx) => [
    "resume",
    ...(ctx.data.profile?.socials.map((s) => s.platform.toLowerCase()) ?? []),
    ...ctx.data.projects.map(projectSlug),
  ],
};

const PALETTE = ["#1f2328", "#f47067", "#57d68d", "#e5c07b", "#61afef", "#c678dd", "#56b6c2", "#d7dae0"];

const neofetch: Command = {
  name: "neofetch",
  summary: "Summary card",
  group: "Portfolio",
  run: (_args, ctx) =>
    withProfile(ctx, "neofetch", (profile) => {
      const skillCount = new Set(profile.skills.map((s) => s.toLowerCase())).size;
      const rows: Array<[string, string]> = [
        ["Name", profile.name],
        ["Role", profile.title],
        ["Stack", profile.subtitle],
        ["Location", profile.location],
        ["Education", profile.education_info?.institution ?? profile.education],
        ["Projects", String(ctx.data.projects.length)],
        ["Skills", String(skillCount)],
        ["Shell", "zsh (web)"],
        ["Theme", ctx.actions.theme],
      ];
      return [
        [seg("guest", "exec"), seg("@"), seg("swajan", "exec")],
        [seg("-".repeat("guest@swajan".length), "muted")],
        ...rows.map(([key, value]): Line => [seg(`${key}: `, "key"), seg(value)]),
        BLANK,
        PALETTE.map((color) => ({ text: "███", color })),
      ];
    }),
};

export const PORTFOLIO_COMMANDS: Command[] = [
  about,
  projects,
  skills,
  education,
  achievements,
  contact,
  resume,
  open,
  neofetch,
];
