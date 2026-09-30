"use client";
import api from "@/lib/axios";
import { FiEdit2, FiTrash2, FiImage } from "react-icons/fi";

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

export default function ProjectCard({ project, onRefresh, onEdit }: ProjectCardProps) {
  const handleDelete = async () => {
    if (!confirm(`Delete "${project.title}"?`)) return;
    try {
      await api.delete(`/admin/projects/${project.id}`);
      onRefresh();
    } catch {
      alert("Failed to delete project.");
    }
  };

  return (
    <div
      style={glass}
      className="group flex flex-col overflow-hidden rounded-3xl hover:bg-white/5 transition-all duration-300"
    >
      {/* Cover image */}
      <div className="relative aspect-video overflow-hidden">
        {project.image_link ? (
          <img
            src={project.image_link}
            alt={`Cover of ${project.title}`}
            loading="lazy"
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-white/[0.03] text-white/20">
            <FiImage size={28} />
          </div>
        )}

        {project.rank ? (
          <div className="absolute top-3 left-3 px-2.5 py-1 flex items-center justify-center bg-sky-500/20 text-sky-200 font-bold rounded-xl text-xs border border-sky-500/30 backdrop-blur-md">
            #{project.rank}
          </div>
        ) : null}

        {/* Hover actions */}
        <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(project)}
            style={glassInner}
            className="p-2.5 hover:bg-white/20 text-white/70 hover:text-white rounded-xl transition-colors"
          >
            <FiEdit2 size={15} />
          </button>
          <button
            onClick={handleDelete}
            style={{
              backdropFilter: 'blur(16px) saturate(160%)',
              WebkitBackdropFilter: 'blur(16px) saturate(160%)',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
            }}
            className="p-2.5 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-xl transition-colors"
          >
            <FiTrash2 size={15} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="min-w-0 p-4">
        <h3 className="font-bold text-base text-white truncate">{project.title}</h3>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <span
            style={glassInner}
            className="text-xs text-white/80 px-3 py-1 rounded-full shrink-0 font-medium"
          >
            {project.category}
          </span>
          {project.tech_stack?.slice(0, 2).map((tech) => (
            <span key={tech} className="text-xs font-medium text-white/50 shrink-0">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}