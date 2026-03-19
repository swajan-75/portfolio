"use client";
import { useEffect, useState, useRef } from "react";
import api from "@/lib/axios";
import { FiUpload, FiTrash2, FiCheck, FiFileText } from "react-icons/fi";

interface CV {
  id: string;
  name: string;
  url: string;
  active: boolean;
  created_at: number;
}

export default function AdminCV() {
  const [cvs, setCvs] = useState<CV[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [cvName, setCvName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchCVs = async () => {
    try {
      const { data } = await api.get("/admin/cv");
      setCvs(Array.isArray(data) ? data : Object.values(data ?? {}));
    } catch {
      setError("Failed to fetch CVs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCVs(); }, []);

  const handleUpload = async (file: File) => {
    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("CV must be under 5MB.");
      return;
    }
    try {
      setUploading(true);
      setError(null);
      const formData = new FormData();
      formData.append("cv", file);
      formData.append("name", cvName || file.name);
      await api.post("/admin/cv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setCvName("");
      fetchCVs();
    } catch {
      setError("Failed to upload CV.");
    } finally {
      setUploading(false);
    }
  };

  const handleSetActive = async (id: string) => {
    try {
      await api.put(`/admin/cv/${id}/active`);
      fetchCVs();
    } catch {
      setError("Failed to set active CV.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this CV?")) return;
    try {
      await api.delete(`/admin/cv/${id}`);
      fetchCVs();
    } catch {
      setError("Failed to delete CV.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">CV Manager</h1>
        <p className="text-gray-500 mt-1 text-sm">Upload and manage which CV is publicly visible</p>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
          {error}
        </div>
      )}

      {/* Upload Section */}
      <div className="p-6 bg-neutral-900/50 border border-white/[0.07] rounded-2xl space-y-4 mb-6">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Upload New CV</h2>

        <div>
          <label className="block text-xs text-gray-500 mb-1.5">CV Label (optional)</label>
          <input
            type="text"
            placeholder="e.g. Software Engineer CV — 2025"
            value={cvName}
            onChange={(e) => setCvName(e.target.value)}
            className="w-full bg-black/40 border border-white/[0.07] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors"
          />
        </div>

        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full h-28 flex flex-col items-center justify-center gap-2 bg-black/40 border border-dashed border-white/[0.15] hover:border-purple-500/50 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <div className="w-5 h-5 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
              <span className="text-xs text-gray-500">Uploading...</span>
            </>
          ) : (
            <>
              <FiUpload size={20} className="text-gray-600" />
              <span className="text-xs text-gray-500">Click to upload PDF</span>
              <span className="text-xs text-gray-700">PDF only · max 5MB</span>
            </>
          )}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
        />
      </div>

      {/* CV List */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Uploaded CVs</h2>

        {loading && (
          <div className="py-10 text-center text-gray-600 font-mono text-xs uppercase tracking-widest">
            Loading...
          </div>
        )}

        {!loading && cvs.length === 0 && (
          <div className="py-10 text-center text-gray-600 font-mono text-xs uppercase tracking-widest">
            No_CVs_Found
          </div>
        )}

        {cvs.map((cv) => (
          <div
            key={cv.id}
            className={`group flex items-center justify-between p-5 border rounded-2xl transition-colors ${
              cv.active
                ? "bg-purple-600/10 border-purple-500/30"
                : "bg-neutral-900/40 border-white/[0.07] hover:border-white/15"
            }`}
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className={`p-2 rounded-lg ${cv.active ? "bg-purple-500/20" : "bg-white/5"}`}>
                <FiFileText size={16} className={cv.active ? "text-purple-400" : "text-gray-500"} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm truncate">{cv.name}</h3>
                  {cv.active && (
                    <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-md shrink-0">
                      Active
                    </span>
                  )}
                </div>
                <a  
                  href={cv.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-600 hover:text-purple-400 transition-colors"
                >
                  View PDF ↗
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-4">
              {!cv.active && (
                <button
                  onClick={() => handleSetActive(cv.id)}
                  className="p-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-lg transition-colors"
                  title="Set as active"
                >
                  <FiCheck size={14} />
                </button>
              )}
              <button
                onClick={() => handleDelete(cv.id)}
                className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                title="Delete"
              >
                <FiTrash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}