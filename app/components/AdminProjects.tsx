"use client";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus } from "react-icons/fi";
import AddProjectForm from "./AddProjectForm";
import ProjectCard from "./ProjectCard";

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  tech_stack: string[];
  github_url?: string;
  live_url?: string;
}

interface AdminProjectsProps {
  projects: Project[];
  isAdding: boolean;
  setIsAdding: (v: boolean) => void;
  onRefresh: () => void;
}

export default function AdminProjects({ projects, isAdding, setIsAdding, onRefresh }: AdminProjectsProps) {
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
            <AddProjectForm onRefresh={onRefresh} onCancel={() => setIsAdding(false)} />
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