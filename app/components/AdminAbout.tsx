"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { FiSave, FiPlus, FiTrash2, FiUser, FiBookOpen, FiCpu, FiTrendingUp, FiAward } from "react-icons/fi";

export default function AdminAbout() {
  const [profile, setProfile] = useState<any>({
    bio: "",
    education_info: { degree: "", institution: "" },
    tech_tags: [],
    stats: [],
    highlights: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get(`/profile?t=${Date.now()}`);
      setProfile({
        ...data,
        education_info: data.education_info || { degree: "", institution: "" },
        tech_tags: data.tech_tags || [],
        stats: data.stats || [],
        highlights: data.highlights || []
      });
    } catch (err) {
      console.error("Failed to fetch profile", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await api.post("/admin/profile", profile);
      setMessage({ type: "success", text: "About section saved successfully!" });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: "error", text: "Failed to save profile." });
    } finally {
      setSaving(false);
    }
  };

  const handleImportDefaults = () => {
    if (!confirm("This will overwrite your current form data with the default values. You will still need to click 'Save Changes' to apply them. Continue?")) return;
    setProfile((prev: any) => ({
      ...prev,
      bio: "I am a Computer Science student and Backend Developer passionate about creating high-performing, scalable systems. From low-level algorithms in C++ and Go to modern web frameworks like NestJS, Next.js, and .NET Core, my experience covers the full software lifecycle.",
      education_info: { degree: "B.Sc. in CSE", institution: "American International\nUniversity-Bangladesh (AIUB)" },
      tech_tags: ['Golang', 'NextJS', 'NestJS', '.NET Core', 'PostgreSQL', 'Firebase', 'Kotlin', 'Git'],
      stats: [
        { value: "15+", label: "Projects" },
        { value: "600+", label: "DSA Solved" }
      ],
      highlights: [
        { title: "Codeforces", value: "Max 1162", subtext: "" },
        { title: "LeetCode", value: "50+", subtext: "Problems Solved" },
        { title: "Programming Contest", value: "17th", subtext: "AIUB CS Fest 2024" }
      ]
    }));
  };

  // Generic Array Handlers
  const addToArray = (key: string, emptyItem: any) => {
    setProfile((prev: any) => ({ ...prev, [key]: [...(prev[key] || []), emptyItem] }));
  };
  const removeFromArray = (key: string, index: number) => {
    setProfile((prev: any) => ({
      ...prev,
      [key]: prev[key].filter((_: any, i: number) => i !== index)
    }));
  };
  const updateArrayItem = (key: string, index: number, field: string, value: any) => {
    setProfile((prev: any) => {
      const newArray = [...prev[key]];
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prev, [key]: newArray };
    });
  };

  if (loading) {
    return (
      <div className="py-10 text-center text-gray-600 font-mono text-xs uppercase tracking-widest">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">About Section Manager</h1>
          <p className="text-gray-500 mt-1 text-sm">Update your bio, education, stats, and highlights.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleImportDefaults}
            className="flex items-center gap-2 px-4 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-sm font-medium transition-colors border border-white/10"
          >
            Import Defaults
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-medium transition-colors"
          >
            <FiSave /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-sm ${message.type === "success" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
          {message.text}
        </div>
      )}

      {/* Bio Section */}
      <section className="bg-neutral-900/50 border border-white/[0.07] p-6 rounded-2xl">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4 text-white">
          <span className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg"><FiUser size={16} /></span> Bio
        </h2>
        <textarea
          value={profile.bio || ""}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          rows={5}
          placeholder="I am a Computer Science student..."
          className="w-full bg-black/40 border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50"
        />
      </section>

      {/* Education Section */}
      <section className="bg-neutral-900/50 border border-white/[0.07] p-6 rounded-2xl">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4 text-white">
          <span className="p-1.5 bg-green-500/20 text-green-400 rounded-lg"><FiBookOpen size={16} /></span> Education
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={profile.education_info.degree}
            onChange={(e) => setProfile({ ...profile, education_info: { ...profile.education_info, degree: e.target.value } })}
            placeholder="Degree (e.g. B.Sc. in CSE)"
            className="w-full bg-black/40 border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50"
          />
          <input
            type="text"
            value={profile.education_info.institution}
            onChange={(e) => setProfile({ ...profile, education_info: { ...profile.education_info, institution: e.target.value } })}
            placeholder="Institution (e.g. AIUB)"
            className="w-full bg-black/40 border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50"
          />
        </div>
      </section>

      {/* Tech Tags Section */}
      <section className="bg-neutral-900/50 border border-white/[0.07] p-6 rounded-2xl">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4 text-white">
          <span className="p-1.5 bg-purple-500/20 text-purple-400 rounded-lg"><FiCpu size={16} /></span> Tech Focus Tags
        </h2>
        <input
          type="text"
          value={profile.tech_tags.join(", ")}
          onChange={(e) => setProfile({ ...profile, tech_tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })}
          placeholder="Golang, NextJS, Postgres (Comma separated)"
          className="w-full bg-black/40 border border-white/[0.07] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50"
        />
        <div className="flex flex-wrap gap-2 mt-4">
          {profile.tech_tags.map((tag: string, i: number) => (
            <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-300">
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-neutral-900/50 border border-white/[0.07] p-6 rounded-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2 text-white">
            <span className="p-1.5 bg-orange-500/20 text-orange-400 rounded-lg"><FiTrendingUp size={16} /></span> Stats
          </h2>
          <button onClick={() => addToArray("stats", { value: "", label: "" })} className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">
            <FiPlus /> Add Stat
          </button>
        </div>
        <div className="space-y-3">
          {profile.stats.map((stat: any, i: number) => (
            <div key={i} className="flex gap-3">
              <input
                type="text"
                value={stat.value}
                onChange={(e) => updateArrayItem("stats", i, "value", e.target.value)}
                placeholder="Value (e.g. 15+)"
                className="flex-[1] bg-black/40 border border-white/[0.07] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50"
              />
              <input
                type="text"
                value={stat.label}
                onChange={(e) => updateArrayItem("stats", i, "label", e.target.value)}
                placeholder="Label (e.g. Projects)"
                className="flex-[2] bg-black/40 border border-white/[0.07] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50"
              />
              <button onClick={() => removeFromArray("stats", i)} className="p-2.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl transition-colors shrink-0">
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Highlights Section */}
      <section className="bg-neutral-900/50 border border-white/[0.07] p-6 rounded-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2 text-white">
            <span className="p-1.5 bg-yellow-500/20 text-yellow-400 rounded-lg"><FiAward size={16} /></span> Competitive Highlights
          </h2>
          <button onClick={() => addToArray("highlights", { title: "", value: "", subtext: "" })} className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">
            <FiPlus /> Add Highlight
          </button>
        </div>
        <div className="space-y-4">
          {profile.highlights.map((h: any, i: number) => (
            <div key={i} className="flex flex-col sm:flex-row gap-3 bg-black/20 p-4 rounded-xl border border-white/[0.05]">
              <div className="flex-1 space-y-3">
                <input
                  type="text"
                  value={h.title}
                  onChange={(e) => updateArrayItem("highlights", i, "title", e.target.value)}
                  placeholder="Platform (e.g. Codeforces)"
                  className="w-full bg-black/40 border border-white/[0.07] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50"
                />
                <input
                  type="text"
                  value={h.value}
                  onChange={(e) => updateArrayItem("highlights", i, "value", e.target.value)}
                  placeholder="Value (e.g. Max 1162)"
                  className="w-full bg-black/40 border border-white/[0.07] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50"
                />
                <input
                  type="text"
                  value={h.subtext}
                  onChange={(e) => updateArrayItem("highlights", i, "subtext", e.target.value)}
                  placeholder="Subtext (e.g. AIUB CS Fest)"
                  className="w-full bg-black/40 border border-white/[0.07] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50"
                />
              </div>
              <button onClick={() => removeFromArray("highlights", i)} className="p-2.5 h-fit bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl transition-colors shrink-0">
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
