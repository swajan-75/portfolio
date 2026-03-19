"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import AdminHome from "../../components/AdminHome";
import AdminProjects from "../../components/AdminProjects";
import {
  FiLogOut, FiShield, FiLayers,
  FiHome, FiBox, FiCpu, FiFileText, FiPhone,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

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

const NAV_ITEMS: NavItem[] = [
  { id: "home",     label: "Home",      icon: <FiHome /> },
  { id: "projects", label: "Projects",  icon: <FiBox /> },
  { id: "skills",   label: "Skills",    icon: <FiCpu /> },
  { id: "cv",       label: "Update CV", icon: <FiFileText /> },
  { id: "contacts", label: "Contacts",  icon: <FiPhone /> },
];

const PAGE_TRANSITION = { duration: 0.2 };

function normalizeProjects(data: unknown): Project[] {
  if (!data) return [];
  if (Array.isArray(data)) return data as Project[];
  if (typeof data === "object") return Object.values(data) as Project[];
  return [];
}

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
      <aside className="w-64 shrink-0 border-r border-white/[0.07] bg-neutral-900/30 flex flex-col p-5">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="p-2 bg-purple-500 rounded-lg">
            <FiShield className="text-black" />
          </div>
          <span className="font-bold text-xl tracking-tight">AdminOS</span>
        </div>

        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                activeSection === id
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                  : "text-gray-500 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="text-base">{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors text-sm font-medium"
        >
          <FiLogOut />
          <span>Logout</span>
        </button>
      </aside>

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
              <AdminProjects
                projects={projects}
                isAdding={isAdding}
                setIsAdding={setIsAdding}
                onRefresh={fetchData}
              />
            )}

            {activeSection !== "home" && activeSection !== "projects" && (
              <div className="h-[60vh] flex flex-col items-center justify-center text-gray-600 select-none">
                <FiLayers size={40} className="mb-4 opacity-20" />
                <p className="font-mono text-xs uppercase tracking-widest">
                  Section_{activeSection}_Under_Development
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}