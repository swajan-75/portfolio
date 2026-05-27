"use client";
import api from "@/lib/axios";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  tech_stack: string[];
  github_url?: string;
  live_url?: string;
  image_link?: string;
  rank?: number;
}

interface ProjectCardProps {
  project: Project;
  onRefresh: () => void;
  onEdit: (project: Project) => void;
}

function titleToSlug(title: string): string {
  return title.toLowerCase().replace(/\s+/g, "-");
}

export default function ProjectCard({ project, onRefresh, onEdit }: ProjectCardProps) {
  const handleDelete = async () => {
    if (!confirm(`Delete "${project.title}"?`)) return;
    try {
      await api.delete(`/admin/projects/${titleToSlug(project.title)}`);
      onRefresh();
    } catch {
      alert("Failed to delete project.");
    }
  };

  return (
    <div className="group flex items-center justify-between p-5 bg-neutral-900/40 border border-white/[0.07] rounded-2xl hover:border-white/15 transition-colors">
      <div className="min-w-0 flex items-center gap-4">
        {project.rank ? (
          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-purple-500/20 text-purple-400 font-bold rounded-full text-xs border border-purple-500/30">
            #{project.rank}
          </div>
        ) : (
          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white/5 text-gray-600 font-bold rounded-full text-xs border border-white/10">
            —
          </div>
        )}
        <div className="min-w-0">
          <h3 className="font-semibold text-base truncate">{project.title}</h3>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-md shrink-0">
              {project.category}
            </span>
            {project.tech_stack?.slice(0, 3).map((tech) => (
              <span key={tech} className="text-xs text-gray-600 shrink-0">{tech}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-4">
        <button
          onClick={() => onEdit(project)}
          className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-colors"
        >
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