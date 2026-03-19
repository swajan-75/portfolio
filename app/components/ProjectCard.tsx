"use client";
import api from "@/lib/axios";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

interface Project {
  id: string;
  title: string;
  category: string;
  tech_stack: string[];
}

interface ProjectCardProps {
  project: Project;
  onRefresh: () => void;
}

export default function ProjectCard({ project, onRefresh }: ProjectCardProps) {
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
            <span key={tech} className="text-xs text-gray-600">{tech}</span>
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