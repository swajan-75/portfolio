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

// Main card glass effect
const glass = {
  backdropFilter: 'blur(24px) saturate(180%)',
  WebkitBackdropFilter: 'blur(24px) saturate(180%)',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.12)',
};

// Nested items glass effect (matching the About component)
const glassInner = {
  backdropFilter: 'blur(16px) saturate(160%)',
  WebkitBackdropFilter: 'blur(16px) saturate(160%)',
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,255,255,0.15)',
};

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
    <div
      style={glass}
      className="group flex items-center justify-between p-5 rounded-3xl hover:bg-white/5 transition-all duration-300"
    >
      <div className="min-w-0 flex items-center gap-4">
        {project.rank ? (
          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-sky-500/10 text-sky-200 font-bold rounded-2xl text-sm border border-sky-500/20">
            #{project.rank}
          </div>
        ) : (
          <div 
            style={glassInner}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-white/30 font-bold rounded-2xl text-sm"
          >
            —
          </div>
        )}
        <div className="min-w-0">
          <h3 className="font-bold text-lg text-white truncate">{project.title}</h3>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <span 
              style={glassInner}
              className="text-xs text-white/80 px-3 py-1 rounded-full shrink-0 font-medium"
            >
              {project.category}
            </span>
            {project.tech_stack?.slice(0, 3).map((tech) => (
              <span key={tech} className="text-xs font-medium text-white/50 shrink-0">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-4">
        <button
          onClick={() => onEdit(project)}
          style={glassInner}
          className="p-2.5 hover:bg-white/20 text-white/60 hover:text-white rounded-xl transition-colors"
        >
          <FiEdit2 size={16} />
        </button>
        <button
          onClick={handleDelete}
          style={{
            backdropFilter: 'blur(16px) saturate(160%)',
            WebkitBackdropFilter: 'blur(16px) saturate(160%)',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
          }}
          className="p-2.5 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-xl transition-colors"
        >
          <FiTrash2 size={16} />
        </button>
      </div>
    </div>
  );
}