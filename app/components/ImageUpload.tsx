"use client";
import { useState, useRef } from "react";
import api from "@/lib/axios";
import { FiUpload, FiX, FiImage } from "react-icons/fi";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Only JPEG, PNG and WebP allowed.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be under 2MB.");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("image", file);
      const { data } = await api.post("/admin/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onChange(data.url);
    } catch {
      setError("Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs text-gray-500 mb-1.5">Project Image</label>

      {/* Preview */}
      {value && (
        <div className="relative w-full h-40 rounded-xl overflow-hidden border border-white/[0.07]">
          <img src={value} alt="Project" className="w-full h-full object-cover" />
          <button
            onClick={() => onChange("")}
            className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-lg transition-colors"
          >
            <FiX size={12} />
          </button>
        </div>
      )}

      {/* Upload Area */}
      {!value && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full h-32 flex flex-col items-center justify-center gap-2 bg-black/40 border border-dashed border-white/[0.15] hover:border-purple-500/50 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <div className="w-5 h-5 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
              <span className="text-xs text-gray-500">Uploading...</span>
            </>
          ) : (
            <>
              <FiImage size={20} className="text-gray-600" />
              <span className="text-xs text-gray-500">Click to upload image</span>
              <span className="text-xs text-gray-700">JPEG, PNG, WebP · max 2MB</span>
            </>
          )}
        </button>
      )}

      {/* Change button when image exists */}
      {value && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
        >
          <FiUpload size={12} />
          {uploading ? "Uploading..." : "Change image"}
        </button>
      )}

      {error && <p className="text-xs text-red-400">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
    </div>
  );
}