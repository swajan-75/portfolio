"use client";
import { useState } from "react";
import api from "@/lib/axios";
import { Project } from "./ProjectCard";
import ImageUpload from "./ImageUpload";
import { FiCheck, FiImage } from "react-icons/fi";

interface EditProjectFormProps {
  project: Project;
  onRefresh: () => void;
  onCancel: () => void;
}

const inputClass =
  "w-full bg-black/40 border border-white/[0.07] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors";


export default function EditProjectForm({ project, onRefresh, onCancel }: EditProjectFormProps) {
  const [form, setForm] = useState({
    title:       project.title       ?? "",
    category:    project.category    ?? "",
    description: project.description ?? "",
    tech_stack:  project.tech_stack?.join(", ") ?? "",
    github_url:  project.github_url  ?? "",
    live_url:    project.live_url    ?? "",
    image_link:  project.image_link  ?? "",
    rank:        project.rank?.toString() ?? "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [setCoverStatus, setSetCoverStatus] = useState<'idle' | 'loading' | 'done'>('idle');

  const handleSetCover = async () => {
    if (!form.image_link.trim()) {
      alert("Upload an image first before setting it as cover.");
      return;
    }
    try {
      setSetCoverStatus('loading');
      await api.patch(`/admin/projects/${project.id}/cover`, { coverUrl: form.image_link.trim() });
      setSetCoverStatus('done');
      setTimeout(() => setSetCoverStatus('idle'), 2500);
      onRefresh();
    } catch {
      alert("Failed to set cover photo.");
      setSetCoverStatus('idle');
    }
  };

  const handleSubmit = async () => {
    if (!(form.title ?? "").trim() || !(form.category ?? "").trim()) {
      alert("Title and category are required.");
      return;
    }
    try {
      setSubmitting(true);
      await api.put(`/admin/projects/${project.id}`, {
        title:       (form.title       ?? "").trim(),
        category:    (form.category    ?? "").trim(),
        description: (form.description ?? "").trim(),
        github_url:  (form.github_url  ?? "").trim(),
        live_url:    (form.live_url    ?? "").trim(),
        image_link:  (form.image_link  ?? "").trim(),
        rank:        Number(form.rank) || 0,
        tech_stack:  (form.tech_stack  ?? "").split(",").map((t) => t.trim()).filter(Boolean),
      });
      onRefresh();
      onCancel();
    } catch {
      alert("Failed to update project.");
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
    type?: string;
  }[] = [
    { key: "title",       label: "Title",       placeholder: "My Awesome Project" },
    { key: "category",    label: "Category",    placeholder: "Web / Mobile / AI ..." },
    { key: "rank",        label: "Visibility Rank", placeholder: "1 for top, 0 for default", type: "number" },
    { key: "github_url",  label: "GitHub URL",  placeholder: "https://github.com/..." },
    { key: "live_url",    label: "Live URL",    placeholder: "https://yourproject.com" },
    { key: "description", label: "Description", placeholder: "What does it do?",               span: true, textarea: true },
    { key: "tech_stack",  label: "Tech Stack",  placeholder: "React, Node, Postgres (comma-separated)", span: true },
  ];

  return (
    <div className="p-6 bg-neutral-900/50 border border-purple-500/20 rounded-2xl space-y-5">
      <h2 className="text-xs font-semibold text-purple-400 uppercase tracking-widest">
        Editing — {project.title}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map(({ key, label, placeholder, span, textarea, type }) => (
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
                type={type || "text"}
                placeholder={placeholder}
                value={form[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                className={inputClass}
              />
            )}
          </div>
        ))}

        {/* Image Upload + Set as Cover — full width */}
        <div className="sm:col-span-2 space-y-3">
          <ImageUpload
            value={form.image_link}
            onChange={(url) => setForm((f) => ({ ...f, image_link: url }))}
          />
          {form.image_link && (
            <button
              type="button"
              onClick={handleSetCover}
              disabled={setCoverStatus === 'loading'}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: setCoverStatus === 'done'
                  ? 'rgba(34,197,94,0.12)'
                  : 'rgba(108,92,231,0.12)',
                border: setCoverStatus === 'done'
                  ? '1px solid rgba(34,197,94,0.3)'
                  : '1px solid rgba(108,92,231,0.3)',
                color: setCoverStatus === 'done' ? '#4ade80' : '#a78bfa',
              }}
            >
              {setCoverStatus === 'done' ? (
                <><FiCheck size={13} /> Cover set!</>
              ) : setCoverStatus === 'loading' ? (
                <><div className="w-3 h-3 border border-purple-400/40 border-t-purple-400 rounded-full animate-spin" /> Setting...</>
              ) : (
                <><FiImage size={13} /> Set as Cover Photo</>
              )}
            </button>
          )}
        </div>
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
          {submitting ? "Updating..." : "Update Project"}
        </button>
      </div>
    </div>
  );
}