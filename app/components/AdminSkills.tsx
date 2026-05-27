"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import api from "@/lib/axios";
import { resolveIcon, searchIcons } from "@/app/lib/resolveIcon";
import {
  FiPlus, FiTrash2, FiEdit2, FiCheck, FiX,
  FiChevronDown, FiChevronUp, FiCpu, FiSearch,
} from "react-icons/fi";

// ─── Curated skill suggestions ────────────────────────────────────────────────
// Format: { name: "Human Readable", icon: "ReactIconsKey" }
const SKILL_SUGGESTIONS = [
  { name: "React", icon: "SiReact" },
  { name: "Next.js", icon: "SiNextdotjs" },
  { name: "Vue.js", icon: "SiVuedotjs" },
  { name: "Angular", icon: "SiAngular" },
  { name: "Svelte", icon: "SiSvelte" },
  { name: "TypeScript", icon: "SiTypescript" },
  { name: "JavaScript", icon: "SiJavascript" },
  { name: "HTML", icon: "SiHtml5" },
  { name: "CSS", icon: "SiCss3" },
  { name: "Tailwind CSS", icon: "SiTailwindcss" },
  { name: "SASS", icon: "SiSass" },
  { name: "Bootstrap", icon: "SiBootstrap" },
  { name: "Go", icon: "SiGo" },
  { name: "Python", icon: "SiPython" },
  { name: "Node.js", icon: "SiNodedotjs" },
  { name: "NestJS", icon: "SiNestjs" },
  { name: ".NET Core", icon: "SiDotnet" },
  { name: "C++", icon: "SiCplusplus" },
  { name: "C#", icon: "SiSharp" },
  { name: "Java", icon: "FaJava" },
  { name: "Rust", icon: "SiRust" },
  { name: "PHP", icon: "SiPhp" },
  { name: "Ruby", icon: "SiRuby" },
  { name: "Kotlin", icon: "SiKotlin" },
  { name: "Swift", icon: "SiSwift" },
  { name: "Dart", icon: "SiDart" },
  { name: "Scala", icon: "SiScala" },
  { name: "Elixir", icon: "SiElixir" },
  { name: "Express", icon: "SiExpress" },
  { name: "FastAPI", icon: "SiFastapi" },
  { name: "Django", icon: "SiDjango" },
  { name: "Flask", icon: "SiFlask" },
  { name: "Spring Boot", icon: "SiSpringboot" },
  { name: "Laravel", icon: "SiLaravel" },
  { name: "Rails", icon: "SiRubyonrails" },
  { name: "GraphQL", icon: "SiGraphql" },
  { name: "REST API", icon: "SiSwagger" },
  { name: "gRPC", icon: "FiCode" },
  { name: "PostgreSQL", icon: "SiPostgresql" },
  { name: "MySQL", icon: "SiMysql" },
  { name: "MongoDB", icon: "SiMongodb" },
  { name: "Firebase", icon: "SiFirebase" },
  { name: "Redis", icon: "SiRedis" },
  { name: "SQLite", icon: "SiSqlite" },
  { name: "Supabase", icon: "SiSupabase" },
  { name: "Elasticsearch", icon: "SiElasticsearch" },
  { name: "DynamoDB", icon: "SiAmazondynamodb" },
  { name: "Prisma", icon: "SiPrisma" },
  { name: "Docker", icon: "SiDocker" },
  { name: "Kubernetes", icon: "SiKubernetes" },
  { name: "AWS", icon: "SiAmazonwebservices" },
  { name: "Google Cloud", icon: "SiGooglecloud" },
  { name: "Azure", icon: "TbBrandAzure" },
  { name: "Vercel", icon: "SiVercel" },
  { name: "Netlify", icon: "SiNetlify" },
  { name: "Linux", icon: "SiLinux" },
  { name: "Nginx", icon: "SiNginx" },
  { name: "Terraform", icon: "SiTerraform" },
  { name: "GitHub Actions", icon: "SiGithubactions" },
  { name: "Git", icon: "SiGit" },
  { name: "GitHub", icon: "SiGithub" },
  { name: "GitLab", icon: "SiGitlab" },
  { name: "Android", icon: "SiAndroid" },
  { name: "Flutter", icon: "SiFlutter" },
  { name: "React Native", icon: "SiReact" },
  { name: "TensorFlow", icon: "SiTensorflow" },
  { name: "PyTorch", icon: "SiPytorch" },
  { name: "Pandas", icon: "SiPandas" },
  { name: "NumPy", icon: "SiNumpy" },
  { name: "OpenAI", icon: "SiOpenai" },
  { name: "Hugging Face", icon: "SiHuggingface" },
  { name: "Jupyter", icon: "SiJupyter" },
  { name: "Figma", icon: "SiFigma" },
  { name: "Storybook", icon: "SiStorybook" },
  { name: "Vite", icon: "SiVite" },
  { name: "Webpack", icon: "SiWebpack" },
  { name: "ESLint", icon: "SiEslint" },
  { name: "Jest", icon: "SiJest" },
  { name: "Vitest", icon: "SiVitest" },
  { name: "Cypress", icon: "SiCypress" },
  { name: "Postman", icon: "SiPostman" },
  { name: "Bash", icon: "SiGnubash" },
  { name: "Machine Learning", icon: "FaBrain" },
  { name: "Database", icon: "FaDatabase" },
  { name: "API", icon: "FaCode" },
  { name: "Mobile", icon: "FaMobileAlt" },
  { name: "Security", icon: "FiShield" },
  { name: "Server", icon: "FiServer" },
];

function matchSuggestions(query: string) {
  if (!query || query.length < 1) return [];
  const q = query.toLowerCase();
  return SKILL_SUGGESTIONS.filter(
    (s) => s.name.toLowerCase().includes(q) || s.icon.toLowerCase().includes(q)
  ).slice(0, 8);
}

// Renders children into document.body using a fixed rect, bypassing overflow:hidden
function PortalDropdown({
  anchorRef,
  children,
  open,
  width,
}: {
  anchorRef: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
  open: boolean;
  width?: number | string;
}) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (open && anchorRef.current) {
      setRect(anchorRef.current.getBoundingClientRect());
      
      const handleUpdate = () => {
        if (anchorRef.current) {
          setRect(anchorRef.current.getBoundingClientRect());
        }
      };
      
      // Update position on scroll or resize to keep it perfectly attached
      window.addEventListener("scroll", handleUpdate, true);
      window.addEventListener("resize", handleUpdate, true);
      
      return () => {
        window.removeEventListener("scroll", handleUpdate, true);
        window.removeEventListener("resize", handleUpdate, true);
      };
    }
  }, [open, anchorRef]);

  if (!open || !rect) return null;

  // Decide whether to open upward or downward
  const spaceBelow = window.innerHeight - rect.bottom;
  const openUp = spaceBelow < 260;

  // Calculate actual width
  let dropdownWidth: number;
  if (typeof width === "number") {
    dropdownWidth = width;
  } else if (typeof width === "string") {
    dropdownWidth = parseInt(width, 10) || 280;
  } else {
    dropdownWidth = Math.max(rect.width, 280);
  }

  // Adjust left positioning to prevent overflow off the right side of the screen
  let left = rect.left;
  if (left + dropdownWidth > window.innerWidth) {
    left = Math.max(16, rect.right - dropdownWidth);
  }

  const style: React.CSSProperties = {
    position: "fixed",
    left: left,
    width: dropdownWidth,
    zIndex: 9999,
    ...(openUp
      ? { bottom: window.innerHeight - rect.top + 4 }
      : { top: rect.bottom + 4 }),
  };

  return createPortal(
    <div style={style}>{children}</div>,
    document.body
  );
}

// ─── Smart Skill Input ────────────────────────────────────────────────────────
// Single input that autocompletes both name + icon from SKILL_SUGGESTIONS
function SmartSkillInput({
  nameValue,
  iconValue,
  onNameChange,
  onIconChange,
}: {
  nameValue: string;
  iconValue: string;
  onNameChange: (v: string) => void;
  onIconChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const anchorRef = useRef<HTMLDivElement>(null);
  const suggestions = matchSuggestions(nameValue);

  useEffect(() => {
    setActiveIndex(0);
  }, [nameValue]);

  const select = (s: { name: string; icon: string }) => {
    onNameChange(s.name);
    onIconChange(s.icon);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(prev => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (suggestions[activeIndex]) {
        select(suggestions[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className="flex gap-2">
      {/* Name field with autocomplete */}
      <div className="flex-1 relative" ref={anchorRef as React.RefObject<HTMLDivElement>}>
        <div className="flex items-center gap-2 bg-black/40 border border-white/[0.07] rounded-xl px-3 py-2 focus-within:border-purple-500/50 transition-colors">
          {iconValue && (
            <span className="text-base text-gray-300 shrink-0">
              {resolveIcon(iconValue, { size: 16 }) ?? <FiCpu size={16} />}
            </span>
          )}
          <input
            value={nameValue}
            onChange={(e) => { onNameChange(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            onKeyDown={handleKeyDown}
            placeholder="Skill name (e.g. Python)"
            className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 focus:outline-none"
          />
        </div>

        <PortalDropdown anchorRef={anchorRef as React.RefObject<HTMLElement>} open={open && suggestions.length > 0}>
          <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-black">
            {suggestions.map((s, idx) => (
              <button
                key={s.icon}
                type="button"
                onMouseDown={() => select(s)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 transition-colors text-left ${
                  idx === activeIndex ? "bg-purple-600/30" : "hover:bg-purple-600/10"
                }`}
              >
                <span className="text-lg text-gray-300 shrink-0 w-6 flex items-center justify-center">
                  {resolveIcon(s.icon, { size: 18 }) ?? <FiCpu size={18} />}
                </span>
                <span className="text-sm text-gray-200">{s.name}</span>
                <span className="text-xs text-gray-600 ml-auto">{s.icon}</span>
              </button>
            ))}
          </div>
        </PortalDropdown>
      </div>

      {/* Manual icon override */}
      <IconPicker value={iconValue} onChange={onIconChange} compact />
    </div>
  );
}

// ─── Icon Picker ──────────────────────────────────────────────────────────────
function IconPicker({
  value,
  onChange,
  compact = false,
}: {
  value: string;
  onChange: (name: string) => void;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const anchorRef = useRef<HTMLDivElement>(null);

  // Search SKILL_SUGGESTIONS + raw icon names
  const suggestions = query.length >= 2
    ? (() => {
        const curatedIcons = new Set(SKILL_SUGGESTIONS.map(s => s.icon));
        const curated = SKILL_SUGGESTIONS.filter(s =>
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.icon.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);
        const raw = searchIcons(query, 20)
          .filter(k => !curatedIcons.has(k))
          .slice(0, 5)
          .map(icon => ({ name: icon.replace(/^(Si|Fa|Fi|Md|Io|Bi)/, ""), icon }));
        return [...curated, ...raw].slice(0, 8);
      })()
    : [];

  useEffect(() => {
    setActiveIndex(0);
  }, [query, open]);

  const select = (iconName: string, displayName?: string) => {
    onChange(iconName);
    if (displayName) setQuery(displayName);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(prev => (suggestions.length ? (prev + 1) % suggestions.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(prev => (suggestions.length ? (prev - 1 + suggestions.length) % suggestions.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (suggestions.length > 0 && suggestions[activeIndex]) {
        select(suggestions[activeIndex].icon, suggestions[activeIndex].name);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  if (compact) {
    return (
      <div ref={anchorRef}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 h-full px-3 py-2 bg-black/40 border border-white/[0.07] rounded-xl text-gray-400 hover:border-purple-500/50 hover:text-white transition-colors text-xs whitespace-nowrap"
          title="Override icon"
        >
          {value ? (
            <span className="text-base text-gray-200">
              {resolveIcon(value, { size: 16 }) ?? <FiCpu size={16} />}
            </span>
          ) : (
            <FiSearch size={14} />
          )}
          <span>Icon</span>
        </button>

        <PortalDropdown anchorRef={anchorRef as React.RefObject<HTMLElement>} open={open} width={320}>
          <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-black">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10">
              <FiSearch className="text-gray-500 shrink-0" size={14} />
              <input
                autoFocus
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search icon…"
                className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 focus:outline-none"
              />
              <button onClick={() => setOpen(false)} className="text-gray-600 hover:text-white">
                <FiX size={14} />
              </button>
            </div>
            {suggestions.length > 0 ? (
              suggestions.map((s, idx) => (
                <button
                  key={s.icon}
                  type="button"
                  onMouseDown={() => select(s.icon, s.name)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 transition-colors text-left ${
                    idx === activeIndex ? "bg-purple-600/30" : "hover:bg-purple-600/10"
                  }`}
                >
                  <span className="text-base text-gray-300 shrink-0 w-6 flex items-center justify-center">
                    {resolveIcon(s.icon, { size: 18 }) ?? <FiCpu size={18} />}
                  </span>
                  <span className="text-sm text-gray-200">{s.name}</span>
                  <span className="text-xs text-gray-600 ml-auto">{s.icon}</span>
                </button>
              ))
            ) : query.length >= 2 ? (
              <div className="px-3 py-4 text-center text-xs text-gray-600">
                No results for &quot;{query}&quot;
              </div>
            ) : (
              <div className="px-3 py-4 text-center text-xs text-gray-600">
                Type to search icons…
              </div>
            )}
          </div>
        </PortalDropdown>
      </div>
    );
  }

  // Full-width icon picker (used in category edit)
  return (
    <div ref={anchorRef} className="relative">
      <div className="flex items-center gap-2 bg-black/40 border border-white/[0.07] rounded-xl px-3 py-2 focus-within:border-purple-500/50 transition-colors cursor-pointer" onClick={() => setOpen(true)}>
        <FiSearch className="text-gray-500 shrink-0" size={14} />
        <input
          value={query || value}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={handleKeyDown}
          placeholder="Search icon (e.g. FaCode, SiGo…)"
          className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 focus:outline-none"
        />
        {value && (
          <span className="text-base text-gray-300 shrink-0">
            {resolveIcon(value, { size: 16 }) ?? <FiCpu size={16} />}
          </span>
        )}
      </div>

      <PortalDropdown anchorRef={anchorRef as React.RefObject<HTMLElement>} open={open && suggestions.length > 0}>
        <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-black">
          {suggestions.map((s, idx) => (
            <button
              key={s.icon}
              type="button"
              onMouseDown={() => select(s.icon, s.name)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 transition-colors text-left ${
                idx === activeIndex ? "bg-purple-600/30" : "hover:bg-purple-600/10"
              }`}
            >
              <span className="text-base text-gray-300 shrink-0 w-6 flex items-center justify-center">
                {resolveIcon(s.icon, { size: 18 }) ?? <FiCpu size={18} />}
              </span>
              <span className="text-sm text-gray-200">{s.name}</span>
              <span className="text-xs text-gray-600 ml-auto">{s.icon}</span>
            </button>
          ))}
        </div>
      </PortalDropdown>
    </div>
  );
}

// ─── Interfaces ───────────────────────────────────────────────────────────────
interface SkillItem {
  name: string;
  icon: string;
}

interface SkillCategory {
  title: string;
  description: string;
  icon: string;
  col_span: number;
  skills: SkillItem[];
}

// ─── Skill Item Row ───────────────────────────────────────────────────────────
function SkillRow({
  skill, catIndex, skillIndex, onDeleted, onUpdated,
}: {
  skill: SkillItem; catIndex: number; skillIndex: number;
  onDeleted: () => void; onUpdated: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(skill.name);
  const [icon, setIcon] = useState(skill.icon);

  const save = async () => {
    await api.put(`/admin/profile/skill-categories/${catIndex}/skills/${skillIndex}`, { name, icon });
    setEditing(false);
    onUpdated();
  };

  const del = async () => {
    if (!confirm(`Delete "${skill.name}"?`)) return;
    await api.delete(`/admin/profile/skill-categories/${catIndex}/skills/${skillIndex}`);
    onDeleted();
  };

  if (editing) {
    return (
      <div className="flex flex-col gap-2 p-3 bg-black/30 border border-purple-500/30 rounded-xl">
        <SmartSkillInput
          nameValue={name}
          iconValue={icon}
          onNameChange={setName}
          onIconChange={setIcon}
        />
        <div className="flex gap-2">
          <button onClick={save} className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 text-xs">
            <FiCheck /> Save
          </button>
          <button onClick={() => setEditing(false)} className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-gray-500/20 text-gray-400 rounded-lg hover:bg-gray-500/30 text-xs">
            <FiX /> Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex items-center justify-between px-3 py-2 bg-white/5 border border-white/5 rounded-xl hover:bg-white/[0.08] transition-colors">
      <div className="flex items-center gap-2.5">
        <span className="text-lg text-gray-300">
          {resolveIcon(skill.icon, { size: 16 }) ?? <FiCpu size={16} />}
        </span>
        <span className="text-sm text-gray-300">{skill.name}</span>
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => setEditing(true)} className="p-1.5 bg-white/5 hover:bg-white/10 text-gray-400 rounded-lg">
          <FiEdit2 size={12} />
        </button>
        <button onClick={del} className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg">
          <FiTrash2 size={12} />
        </button>
      </div>
    </div>
  );
}

// ─── Add Skill Form ───────────────────────────────────────────────────────────
function AddSkillForm({ catIndex, onAdded }: { catIndex: number; onAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await api.post(`/admin/profile/skill-categories/${catIndex}/skills`, {
      name: name.trim(), icon: icon.trim(),
    });
    setName(""); setIcon(""); setOpen(false);
    onAdded();
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-1.5 py-2 border border-dashed border-white/10 hover:border-purple-500/40 rounded-xl text-xs text-gray-600 hover:text-purple-400 transition-colors"
      >
        <FiPlus size={12} /> Add skill
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2 p-3 bg-black/30 border border-white/10 rounded-xl">
      <p className="text-xs text-gray-500">Type a name — suggestions appear automatically</p>
      <SmartSkillInput
        nameValue={name}
        iconValue={icon}
        onNameChange={setName}
        onIconChange={setIcon}
      />
      <div className="flex gap-2">
        <button type="submit" className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-purple-600/30 text-purple-300 rounded-lg hover:bg-purple-600/50 text-xs">
          <FiCheck /> Add
        </button>
        <button type="button" onClick={() => setOpen(false)} className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-gray-500/20 text-gray-400 rounded-lg hover:bg-gray-500/30 text-xs">
          <FiX /> Cancel
        </button>
      </div>
    </form>
  );
}

// ─── Category Card ────────────────────────────────────────────────────────────
function CategoryCard({
  cat, catIndex, onRefresh, onDelete,
}: {
  cat: SkillCategory; catIndex: number; onRefresh: () => void; onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(cat.title);
  const [desc, setDesc] = useState(cat.description);
  const [icon, setIcon] = useState(cat.icon);
  const [colSpan, setColSpan] = useState(cat.col_span || 1);

  const save = async () => {
    await api.put(`/admin/profile/skill-categories/${catIndex}`, {
      title, description: desc, icon, col_span: colSpan, skills: cat.skills,
    });
    setEditing(false);
    onRefresh();
  };

  const del = async () => {
    if (!confirm(`Delete "${cat.title}" and all its skills?`)) return;
    await api.delete(`/admin/profile/skill-categories/${catIndex}`);
    onDelete();
  };

  return (
    <div className="border border-white/[0.07] rounded-2xl bg-neutral-900/40">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-neutral-900/60 rounded-t-2xl">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xl text-gray-400 shrink-0">
            {resolveIcon(cat.icon, { size: 18 }) ?? <FiCpu size={18} />}
          </span>
          <div className="min-w-0">
            <h3 className="font-semibold text-white truncate">{cat.title}</h3>
            <p className="text-xs text-gray-500 truncate">{cat.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-3">
          <span className="text-xs text-gray-600 bg-white/5 px-2 py-0.5 rounded-md">
            {cat.col_span || 1}col
          </span>
          <button onClick={() => setEditing(!editing)} className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 rounded-lg transition-colors">
            <FiEdit2 size={14} />
          </button>
          <button onClick={del} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors">
            <FiTrash2 size={14} />
          </button>
          <button onClick={() => setExpanded(!expanded)} className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 rounded-lg transition-colors">
            {expanded ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* Edit form */}
      {editing && (
        <div className="px-5 py-4 border-t border-white/[0.06] flex flex-col gap-3 bg-black/20">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Category title"
            className="bg-black/40 border border-white/[0.07] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50"
          />
          <textarea
            value={desc}
            onChange={e => setDesc(e.target.value)}
            placeholder="Description"
            rows={2}
            className="bg-black/40 border border-white/[0.07] rounded-xl px-4 py-2.5 text-sm text-white resize-none focus:outline-none focus:border-purple-500/50"
          />
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Category Icon</label>
              <IconPicker value={icon} onChange={setIcon} />
            </div>
            <div className="w-32">
              <label className="block text-xs text-gray-500 mb-1">Column Span</label>
              <select
                value={colSpan}
                onChange={e => setColSpan(Number(e.target.value))}
                className="w-full bg-black/40 border border-white/[0.07] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50"
              >
                <option value={1}>1 col</option>
                <option value={2}>2 cols</option>
                <option value={3}>3 cols</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={save} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-medium transition-colors">
              <FiCheck /> Save
            </button>
            <button onClick={() => setEditing(false)} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white/5 hover:bg-white/10 text-gray-400 rounded-xl text-sm transition-colors">
              <FiX /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* Skills list */}
      {expanded && (
        <div className="px-5 py-4 flex flex-col gap-2 border-t border-white/[0.06]">
          {(cat.skills ?? []).map((skill, si) => (
            <SkillRow
              key={si}
              skill={skill}
              catIndex={catIndex}
              skillIndex={si}
              onDeleted={onRefresh}
              onUpdated={onRefresh}
            />
          ))}
          <AddSkillForm catIndex={catIndex} onAdded={onRefresh} />
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminSkills() {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewCat, setShowNewCat] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newIcon, setNewIcon] = useState("");
  const [newColSpan, setNewColSpan] = useState(1);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get(`/profile?t=${Date.now()}`);
      setCategories(Array.isArray(data?.skill_categories) ? data.skill_categories : []);
    } catch {
      setError("Failed to fetch skill categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      await api.post("/admin/profile/skill-categories", {
        title: newTitle.trim(), description: newDesc.trim(),
        icon: newIcon.trim(), col_span: newColSpan, skills: [],
      });
      setNewTitle(""); setNewDesc(""); setNewIcon(""); setNewColSpan(1);
      setShowNewCat(false);
      fetchProfile();
    } catch {
      setError("Failed to add category.");
    }
  };

  const handleSeedDefaults = async () => {
    setLoading(true);
    setError(null);
    try {
      const defaults = [
        {
          title: "Front-End Development",
          description: "Building engaging and user-friendly web interfaces using modern frameworks.",
          icon: "FaCode",
          col_span: 2,
          skills: [
            { name: "React", icon: "SiReact" },
            { name: "Next.js", icon: "SiNextdotjs" },
            { name: "Tailwind", icon: "SiTailwindcss" },
            { name: "HTML", icon: "SiHtml5" },
            { name: "CSS", icon: "SiCss3" },
            { name: "JavaScript", icon: "SiJavascript" },
            { name: "TypeScript", icon: "SiTypescript" },
          ],
        },
        {
          title: "Back-End & Database",
          description: "Developing robust server-side logic and managing efficient data storage.",
          icon: "FaDatabase",
          col_span: 1,
          skills: [
            { name: "Go", icon: "SiGo" },
            { name: "NestJS", icon: "SiNestjs" },
            { name: ".NET Core", icon: "SiDotnet" },
            { name: "Node.js", icon: "SiNodedotjs" },
          ],
        },
        {
          title: "Mobile App Development",
          description: "Creating cross-platform and native mobile apps with sleek designs.",
          icon: "FaMobileAlt",
          col_span: 1,
          skills: [
            { name: "Kotlin", icon: "SiKotlin" },
            { name: "Android", icon: "SiAndroid" },
          ],
        },
        {
          title: "Database Architecture",
          description: "Architecting reliable, scalable storage solutions across SQL and NoSQL environments.",
          icon: "FiDatabase",
          col_span: 2,
          skills: [
            { name: "PostgreSQL", icon: "SiPostgresql" },
            { name: "MySQL", icon: "SiMysql" },
            { name: "Firebase", icon: "SiFirebase" },
          ],
        },
        {
          title: "AI & Data Science",
          description: "Leveraging machine learning algorithms to derive insights from data.",
          icon: "FaBrain",
          col_span: 2,
          skills: [
            { name: "Python", icon: "SiPython" },
            { name: "TensorFlow", icon: "SiTensorflow" },
          ],
        },
      ];

      for (const cat of defaults) {
        await api.post("/admin/profile/skill-categories", cat);
      }
      
      fetchProfile();
    } catch {
      setError("Failed to seed default skills. Please ensure the backend is running and restarted.");
    } finally {
      setLoading(false);
    }
  };

  const confirmAndSeed = async () => {
    if (!confirm("This will import the default skills into your database. If you already have similar categories, they will be duplicated. Continue?")) return;
    await handleSeedDefaults();
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Skills Manager</h1>
          <p className="text-gray-500 mt-1 text-sm">Manage skill categories and individual tech items</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={confirmAndSeed}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-sm font-medium transition-colors"
            title="Import Default Skills"
          >
            <FiCpu /> Import Defaults
          </button>
          <button
            onClick={() => setShowNewCat(!showNewCat)}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-medium transition-colors"
          >
            <FiPlus /> New Category
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">{error}</div>
      )}

      {showNewCat && (
        <form onSubmit={handleAddCategory} className="mb-6 flex flex-col gap-3 p-5 bg-neutral-900/50 border border-purple-500/20 rounded-2xl">
          <h2 className="text-xs font-semibold text-purple-400 uppercase tracking-widest">New Category</h2>
          <input
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="Category title (e.g. Back-End & Database)"
            required
            className="bg-black/40 border border-white/[0.07] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50"
          />
          <textarea
            value={newDesc}
            onChange={e => setNewDesc(e.target.value)}
            placeholder="Short description"
            rows={2}
            className="bg-black/40 border border-white/[0.07] rounded-xl px-4 py-2.5 text-sm text-white resize-none focus:outline-none focus:border-purple-500/50"
          />
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Category Icon</label>
              <IconPicker value={newIcon} onChange={setNewIcon} />
            </div>
            <div className="w-32">
              <label className="block text-xs text-gray-500 mb-1">Column Span</label>
              <select
                value={newColSpan}
                onChange={e => setNewColSpan(Number(e.target.value))}
                className="w-full bg-black/40 border border-white/[0.07] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50"
              >
                <option value={1}>1 col</option>
                <option value={2}>2 cols</option>
                <option value={3}>3 cols (full)</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-medium transition-colors">
              <FiCheck /> Create Category
            </button>
            <button type="button" onClick={() => setShowNewCat(false)} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 text-gray-400 rounded-xl text-sm transition-colors">
              <FiX /> Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="py-20 text-center text-gray-600 font-mono text-xs uppercase tracking-widest animate-pulse">Loading...</div>
      ) : categories.length === 0 ? (
        <div className="py-12 px-6 text-center border border-white/[0.05] rounded-3xl bg-neutral-900/25 backdrop-blur-sm">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-4 text-purple-400">
            <FiCpu size={22} />
          </div>
          <h3 className="text-base font-semibold text-white mb-2">No Skill Categories Found</h3>
          <p className="text-sm text-gray-400 max-w-md mx-auto mb-6 leading-relaxed font-sans normal-case tracking-normal">
            Your homepage is currently using hardcoded fallback skills. Seeding the database will import these default skills so you can easily edit, delete, or add new ones!
          </p>
          <button
            onClick={confirmAndSeed}
            className="inline-flex items-center gap-2 px-5 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-medium transition-colors cursor-pointer shadow-lg shadow-purple-600/20"
          >
            Import Default Skills
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {categories.map((cat, i) => (
            <CategoryCard key={i} cat={cat} catIndex={i} onRefresh={fetchProfile} onDelete={fetchProfile} />
          ))}
        </div>
      )}
    </div>
  );
}
