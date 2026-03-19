"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import AdminHome from "../../components/AdminHome";
import {
  FiLogOut, FiShield, FiPlus, FiTrash2,
  FiLayers, FiHome, FiBox, FiCpu, FiFileText, FiPhone,
  FiEdit2,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  tech_stack: string[];
  github_url?: string;
  live_url?: string;
}

type Section = "home" | "projects" | "skills" | "cv" | "contacts";

interface NavItem {
  id: Section;
  label: string;
  icon: React.ReactNode;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  { id: "home",     label: "Home",       icon: <FiHome /> },
  { id: "projects", label: "Projects",   icon: <FiBox /> },
  { id: "skills",   label: "Skills",     icon: <FiCpu /> },
  { id: "cv",       label: "Update CV",  icon: <FiFileText /> },
  { id: "contacts", label: "Contacts",   icon: <FiPhone /> },
];

const PAGE_TRANSITION = { duration: 0.2 };

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normalizeProjects(data: unknown): Project[] {
  if (!data) return [];
  if (Array.isArray(data)) return data as Project[];
  if (typeof data === "object") return Object.values(data) as Project[];
  return [];
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState<Section>("home");
  const [projects, setProjects] = useState<Project[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  const fetchData = useCallback(async () => {
    try {
      await api.get("/admin/checkAuth");
      setAuthorized(true);
      const { data } = await api.get("/projects");
      setProjects(normalizeProjects(data));
    } catch {
      router.push("/admin/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleLogout = async () => {
    await api.post("/admin/logout");
    window.location.replace("/admin/login");
  };

  // ── Loading / Auth Guard ──
  if (loading || !authorized) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
        <p className="text-purple-400 font-mono text-xs uppercase tracking-widest animate-pulse">
          System_Sync...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex overflow-hidden">

      {/* ── Sidebar ── */}
      <aside className="w-64 shrink-0 border-r border-white/[0.07] bg-neutral-900/30 flex flex-col p-5">
        {/* Brand */}
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="p-2 bg-purple-500 rounded-lg">
            <FiShield className="text-black" />
          </div>
          <span className="font-bold text-xl tracking-tight">AdminOS</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map(({ id, label, icon }) => (
            <NavButton
              key={id}
              icon={icon}
              label={label}
              active={activeSection === id}
              onClick={() => setActiveSection(id)}
            />
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors text-sm font-medium"
        >
          <FiLogOut />
          <span>Logout</span>
        </button>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 overflow-y-auto bg-[#050505] p-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={PAGE_TRANSITION}
          >
            {activeSection === "home" && (
              <AdminHome projectsCount={projects.length} />
            )}

            {activeSection === "projects" && (
              <ProjectsSection
                projects={projects}
                isAdding={isAdding}
                setIsAdding={setIsAdding}
                onRefresh={fetchData}
              />
            )}

            {activeSection !== "home" && activeSection !== "projects" && (
              <UnderConstruction section={activeSection} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

// ─── Sub-Components ───────────────────────────────────────────────────────────

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

function NavButton({ icon, label, active, onClick }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
        active
          ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
          : "text-gray-500 hover:text-white hover:bg-white/5"
      }`}
    >
      <span className="text-base">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

interface ProjectsSectionProps {
  projects: Project[];
  isAdding: boolean;
  setIsAdding: (v: boolean) => void;
  onRefresh: () => void;
}

function ProjectsSection({ projects, isAdding, setIsAdding, onRefresh }: ProjectsSectionProps) {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {projects.length} {projects.length === 1 ? "entry" : "entries"} in your portfolio
          </p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-semibold rounded-xl hover:bg-gray-100 transition-colors"
        >
          <FiPlus className={`transition-transform duration-200 ${isAdding ? "rotate-45" : ""}`} />
          {isAdding ? "Cancel" : "New Build"}
        </button>
      </div>

      {/* Add Project Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mb-6"
          >
            <AddProjectForm
              onRefresh={onRefresh}
              onCancel={() => setIsAdding(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project List */}
      <div className="space-y-3">
        {projects.length === 0 && !isAdding && (
          <div className="py-20 text-center text-gray-600 font-mono text-xs uppercase tracking-widest">
            No_Projects_Found
          </div>
        )}
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} onRefresh={onRefresh} />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

interface AddProjectFormProps {
  onRefresh: () => void;
  onCancel: () => void;
}

function AddProjectForm({ onRefresh, onCancel }: AddProjectFormProps) {
  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    tech_stack: "",
    github_url: "",
    live_url: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.category.trim()) {
      alert("Title and category are required.");
      return;
    }
    try {
      setSubmitting(true);
      await api.post("/projects", {
        ...form,
        tech_stack: form.tech_stack
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      });
      onRefresh();
      onCancel();
    } catch {
      alert("Failed to create project.");
    } finally {
      setSubmitting(false);
    }
  };

  const fields: {
    key: keyof typeof form;
    label: string;
    placeholder: string;
    span?: boolean;
    textarea?: boolean;
  }[] = [
    { key: "title",       label: "Title",       placeholder: "My Awesome Project" },
    { key: "category",    label: "Category",    placeholder: "Web / Mobile / AI ..." },
    { key: "description", label: "Description", placeholder: "What does it do?", span: true, textarea: true },
    { key: "tech_stack",  label: "Tech Stack",  placeholder: "React, Node, Postgres (comma-separated)", span: true },
    { key: "github_url",  label: "GitHub URL",  placeholder: "https://github.com/..." },
    { key: "live_url",    label: "Live URL",    placeholder: "https://yourproject.com" },
  ];

  const inputClass =
    "w-full bg-black/40 border border-white/[0.07] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors";

  return (
    <div className="p-6 bg-neutral-900/50 border border-white/[0.07] rounded-2xl space-y-5">
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
        New Project
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map(({ key, label, placeholder, span, textarea }) => (
          <div key={key} className={span ? "sm:col-span-2" : ""}>
            <label className="block text-xs text-gray-500 mb-1.5">{label}</label>
            {textarea ? (
              <textarea
                rows={3}
                placeholder={placeholder}
                value={form[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                className={`${inputClass} resize-none`}
              />
            ) : (
              <input
                type="text"
                placeholder={placeholder}
                value={form[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                className={inputClass}
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3 pt-1">
        <button
          onClick={onCancel}
          className="px-5 py-2 text-sm text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="px-5 py-2 text-sm font-semibold bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
        >
          {submitting ? "Saving..." : "Save Project"}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

interface ProjectCardProps {
  project: Project;
  onRefresh: () => void;
}

function ProjectCard({ project, onRefresh }: ProjectCardProps) {
  const handleDelete = async () => {
    if (!confirm(`Delete "${project.title}"?`)) return;
    try {
      await api.delete(`/projects/${project.id}`);
      onRefresh();
    } catch {
      alert("Failed to delete project.");
    }
  };

  return (
    <div className="group flex items-center justify-between p-5 bg-neutral-900/40 border border-white/[0.07] rounded-2xl hover:border-white/15 transition-colors">
      <div className="min-w-0">
        <h3 className="font-semibold text-base truncate">{project.title}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-md">
            {project.category}
          </span>
          {project.tech_stack?.slice(0, 3).map((tech) => (
            <span key={tech} className="text-xs text-gray-600">
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-4">
        <button className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-colors">
          <FiEdit2 size={14} />
        </button>
        <button
          onClick={handleDelete}
          className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
        >
          <FiTrash2 size={14} />
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function UnderConstruction({ section }: { section: Section }) {
  return (
    <div className="h-[60vh] flex flex-col items-center justify-center text-gray-600 select-none">
      <FiLayers size={40} className="mb-4 opacity-20" />
      <p className="font-mono text-xs uppercase tracking-widest">
        Section_{section}_Under_Development
      </p>
    </div>
  );
}