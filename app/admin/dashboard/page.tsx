"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import AdminHome from "../../components/AdminHome";
import { 
  FiLogOut, FiShield, FiPlus, FiTrash2, 
  FiLayout, FiLayers, FiCode, FiLink, FiGlobe,
  FiHome, FiBox, FiCpu, FiFileText, FiPhone
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

// --- Types ---
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

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState<Section>("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const router = useRouter();

  // Shared fetcher for auth and data
  const fetchData = useCallback(async () => {
    try {
      await api.get("/admin/checkAuth");
      setAuthorized(true);
      const response = await api.get("/projects");
      const data = response.data;
      const transformedData = (data && typeof data === 'object' && !Array.isArray(data)) 
        ? Object.values(data) 
        : (Array.isArray(data) ? data : []);
      setProjects(transformedData as Project[]);
    } catch (err: any) {
      // 🚀 THE DEBUG LOGS: Open F12 in Chrome to see these
      console.error("❌ API Fetch Error:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data, // This contains your Go "error" JSON
      });

      // 3. Conditional Redirect
      // Only redirect if it's a 401 (Not Logged In) or 403 (Forbidden)
      if (err.response?.status === 401 || err.response?.status === 403) {
        console.warn("Redirecting to login due to auth failure.");
        router.push("/admin/login");
      } else {
        // If it's a 500 error, don't redirect! Stay here so you can debug.
        alert(`Server Error: ${err.response?.data?.error || "Unknown error"}`);
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading || !authorized) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mb-4" />
        <p className="text-purple-400 font-mono text-sm animate-pulse uppercase tracking-widest">System_Sync...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex overflow-hidden">
      
      {/* 1. SIDEBAR (20%) */}
      <aside className="w-1/5 border-r border-white/10 bg-neutral-900/20 flex flex-col p-6">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="p-2 bg-purple-500 rounded-lg"><FiShield className="text-black" /></div>
          <span className="font-bold text-xl tracking-tight">AdminOS</span>
        </div>

        <nav className="flex-1 space-y-2">
          <NavBtn icon={<FiHome />} label="Home" active={activeSection === "home"} onClick={() => setActiveSection("home")} />
          <NavBtn icon={<FiBox />} label="Projects" active={activeSection === "projects"} onClick={() => setActiveSection("projects")} />
          <NavBtn icon={<FiCpu />} label="Skills" active={activeSection === "skills"} onClick={() => setActiveSection("skills")} />
          <NavBtn icon={<FiFileText />} label="Update CV" active={activeSection === "cv"} onClick={() => setActiveSection("cv")} />
          <NavBtn icon={<FiPhone />} label="Contacts" active={activeSection === "contacts"} onClick={() => setActiveSection("contacts")} />
        </nav>

        <button 
          onClick={async () => { await api.post("/admin/logout"); router.push("/admin/login"); }}
          className="mt-auto flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
        >
          <FiLogOut /> <span>Logout</span>
        </button>
      </aside>

      {/* 2. MAIN CONTENT AREA (80%) */}
      <main className="flex-1 overflow-y-auto bg-[#050505] p-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
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
            
            {activeSection !== "projects" && (
                <div className="h-[60vh] flex flex-col items-center justify-center text-gray-500">
                    <FiLayers size={48} className="mb-4 opacity-20" />
                    <p className="font-mono uppercase tracking-widest text-xs">Section_{activeSection}_Under_Development</p>
                </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

// --- Sub-Components ---

function NavBtn({ icon, label, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all font-medium ${
        active ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20" : "text-gray-500 hover:text-white hover:bg-white/5"
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function ProjectsSection({ projects, isAdding, setIsAdding, onRefresh }: any) {
  return (
    <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-12">
            <div>
                <h1 className="text-4xl font-bold">Manage Projects</h1>
                <p className="text-gray-500 mt-2">Deploy and organize your technical portfolio entries.</p>
            </div>
            <button 
                onClick={() => setIsAdding(!isAdding)}
                className="px-6 py-3 bg-white text-black font-bold rounded-xl flex items-center gap-2 hover:bg-gray-200 transition-all"
            >
                <FiPlus /> {isAdding ? "Close" : "New Build"}
            </button>
        </div>

        {/* The project list and form logic you already have goes here... */}
        <div className="space-y-4">
            {projects.map((p: any) => (
                <div key={p.id} className="p-6 bg-neutral-900/40 border border-white/10 rounded-2xl flex justify-between items-center group">
                    <div>
                        <h3 className="font-bold text-lg">{p.title}</h3>
                        <p className="text-gray-500 text-sm">{p.category}</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="p-3 bg-red-500/10 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                            <FiTrash2 />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
}