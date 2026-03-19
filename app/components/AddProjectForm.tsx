"use client";
import { useState } from "react";
import api from "@/lib/axios";

interface AddProjectFormProps {
  onRefresh: () => void;
  onCancel: () => void;
}

const inputClass =
  "w-full bg-black/40 border border-white/[0.07] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors";

export default function AddProjectForm({ onRefresh, onCancel }: AddProjectFormProps) {
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
        tech_stack: form.tech_stack.split(",").map((t) => t.trim()).filter(Boolean),
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