"use client";
import { useEffect, useState, useRef } from "react";
import api from "@/lib/axios";
import { createPortal } from "react-dom";
import { resolveIcon, searchIcons } from "@/app/lib/resolveIcon";
import { FiPlus, FiTrash2, FiEdit2, FiCheck, FiX, FiLink, FiCpu, FiSearch } from "react-icons/fi";

interface Contact {
  platform: string;
  url: string;
  icon?: string;
}

export default function AdminContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newPlatform, setNewPlatform] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newIcon, setNewIcon] = useState("");

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editPlatform, setEditPlatform] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editIcon, setEditIcon] = useState("");

  const fetchProfile = async () => {
    try {
      const { data } = await api.get(`/profile?t=${Date.now()}`);
      setContacts(data.socials || []);
    } catch {
      setError("Failed to fetch contacts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlatform.trim() || !newUrl.trim()) return;
    try {
      await api.post("/admin/profile/contacts", {
        platform: newPlatform.trim(),
        url: newUrl.trim(),
        icon: newIcon.trim(),
      });
      setNewPlatform("");
      setNewUrl("");
      setNewIcon("");
      fetchProfile();
    } catch {
      setError("Failed to add contact.");
    }
  };

  const handleDelete = async (index: number) => {
    if (!confirm("Delete this contact?")) return;
    try {
      await api.delete(`/admin/profile/contacts/${index}`);
      fetchProfile();
    } catch {
      setError("Failed to delete contact.");
    }
  };

  const startEditing = (index: number, contact: Contact) => {
    setEditingIndex(index);
    setEditPlatform(contact.platform);
    setEditUrl(contact.url);
    setEditIcon(contact.icon || "");
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setEditPlatform("");
    setEditUrl("");
    setEditIcon("");
  };

  const handleUpdate = async (index: number) => {
    if (!editPlatform.trim() || !editUrl.trim()) return;
    try {
      await api.put(`/admin/profile/contacts/${index}`, {
        platform: editPlatform.trim(),
        url: editUrl.trim(),
        icon: editIcon.trim(),
      });
      cancelEditing();
      fetchProfile();
    } catch {
      setError("Failed to update contact.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Contacts & Socials Manager</h1>
        <p className="text-gray-500 mt-1 text-sm">Manage your social links and contacts</p>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
          {error}
        </div>
      )}

      {/* Add New Contact */}
      <form onSubmit={handleAdd} className="mb-6 bg-neutral-900/50 border border-white/[0.07] p-4 rounded-2xl flex flex-col sm:flex-row gap-3">
        <SmartContactInput
          nameValue={newPlatform}
          iconValue={newIcon}
          onNameChange={setNewPlatform}
          onIconChange={setNewIcon}
        />
        <div className="flex-[2] min-w-[200px]">
          <input
            type="text"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="URL (e.g. https://github.com/... or mailto:...)"
            className="w-full bg-black/40 border border-white/[0.07] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors"
          />
        </div>
        <div className="flex-1 min-w-[150px]">
          <IconPicker value={newIcon} onChange={setNewIcon} compact />
        </div>
        <button
          type="submit"
          className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 shrink-0"
        >
          <FiPlus /> Add
        </button>
      </form>

      {/* Contacts List */}
      <div className="space-y-3">
        {loading && (
          <div className="py-10 text-center text-gray-600 font-mono text-xs uppercase tracking-widest">
            Loading...
          </div>
        )}

        {!loading && contacts.length === 0 && (
          <div className="py-10 text-center text-gray-600 font-mono text-xs uppercase tracking-widest">
            No_Contacts_Found
          </div>
        )}

        {contacts.map((contact, index) => (
          <div
            key={index}
            className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-neutral-900/40 border border-white/[0.07] hover:border-white/15 rounded-2xl transition-colors gap-4"
          >
            {editingIndex === index ? (
              <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
                <div className="flex-1">
                  <SmartContactInput
                    nameValue={editPlatform}
                    iconValue={editIcon}
                    onNameChange={setEditPlatform}
                    onIconChange={setEditIcon}
                    compact
                  />
                </div>
                <input
                  type="text"
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  className="flex-[2] bg-black/60 border border-purple-500/30 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-purple-500"
                  placeholder="URL"
                />
                <div className="flex-[1] min-w-[120px]">
                  <IconPicker value={editIcon} onChange={setEditIcon} compact />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdate(index)}
                    className="p-1.5 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors flex items-center justify-center flex-1"
                  >
                    <FiCheck size={16} />
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="p-1.5 bg-gray-500/20 text-gray-400 rounded-lg hover:bg-gray-500/30 transition-colors flex items-center justify-center flex-1"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="p-2 bg-white/5 rounded-lg shrink-0 text-xl text-gray-300">
                    {contact.icon ? resolveIcon(contact.icon, { size: 18 }) || <FiLink /> : <FiLink />}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-white">{contact.platform}</div>
                    <a
                      href={contact.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gray-500 hover:text-purple-400 truncate block mt-0.5"
                    >
                      {contact.url}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={() => startEditing(index, contact)}
                    className="p-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <FiEdit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Shared Components ────────────────────────────────────────────────────────
const CONTACT_SUGGESTIONS = [
  { name: "GitHub", icon: "FiGithub" },
  { name: "LinkedIn", icon: "FiLinkedin" },
  { name: "Facebook", icon: "FiFacebook" },
  { name: "Twitter", icon: "FiTwitter" },
  { name: "Instagram", icon: "FiInstagram" },
  { name: "YouTube", icon: "FiYoutube" },
  { name: "Discord", icon: "SiDiscord" },
  { name: "LeetCode", icon: "SiLeetcode" },
  { name: "HackerRank", icon: "SiHackerrank" },
  { name: "Codeforces", icon: "SiCodeforces" },
  { name: "Email", icon: "FiMail" },
  { name: "Phone", icon: "FiPhone" },
];

function matchContactSuggestions(query: string) {
  if (!query.trim()) return CONTACT_SUGGESTIONS.slice(0, 5);
  const lower = query.toLowerCase();
  return CONTACT_SUGGESTIONS.filter(
    s => s.name.toLowerCase().includes(lower) || s.icon.toLowerCase().includes(lower)
  ).slice(0, 5);
}

function SmartContactInput({
  nameValue,
  iconValue,
  onNameChange,
  onIconChange,
  compact = false,
}: {
  nameValue: string;
  iconValue: string;
  onNameChange: (v: string) => void;
  onIconChange: (v: string) => void;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const anchorRef = useRef<HTMLDivElement>(null);
  const suggestions = matchContactSuggestions(nameValue);

  useEffect(() => {
    setActiveIndex(0);
  }, [nameValue]);

  const select = (s: { name: string; icon: string }) => {
    onNameChange(s.name);
    // Auto-fill icon if not already set, or if they pick a standard suggestion
    if (!iconValue || CONTACT_SUGGESTIONS.some(cs => cs.icon === iconValue)) {
      onIconChange(s.icon);
    }
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(prev => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (suggestions[activeIndex]) {
        select(suggestions[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className={`relative ${!compact ? "flex-1 min-w-[120px]" : "w-full"}`} ref={anchorRef as React.RefObject<HTMLDivElement>}>
      <input
        value={nameValue}
        onChange={(e) => { onNameChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={handleKeyDown}
        placeholder="Platform (e.g. GitHub)"
        className={compact 
          ? "w-full bg-black/60 border border-purple-500/30 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-purple-500" 
          : "w-full bg-black/40 border border-white/[0.07] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors"
        }
      />

      <PortalDropdown anchorRef={anchorRef as React.RefObject<HTMLElement>} open={open && suggestions.length > 0}>
        <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-black">
          {suggestions.map((s, idx) => (
            <button
              key={s.icon}
              type="button"
              onMouseDown={() => select(s)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 transition-colors text-left ${
                idx === activeIndex ? "bg-purple-600/30" : "hover:bg-purple-600/10"
              }`}
            >
              <span className="text-lg text-gray-300 shrink-0 w-6 flex items-center justify-center">
                {resolveIcon(s.icon, { size: 18 }) ?? <FiCpu size={18} />}
              </span>
              <span className="text-sm text-gray-200">{s.name}</span>
            </button>
          ))}
        </div>
      </PortalDropdown>
    </div>
  );
}

function PortalDropdown({ anchorRef, children, open, width }: any) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (open && anchorRef.current) {
      setRect(anchorRef.current.getBoundingClientRect());
      const handleUpdate = () => {
        if (anchorRef.current) setRect(anchorRef.current.getBoundingClientRect());
      };
      window.addEventListener("scroll", handleUpdate, true);
      window.addEventListener("resize", handleUpdate, true);
      return () => {
        window.removeEventListener("scroll", handleUpdate, true);
        window.removeEventListener("resize", handleUpdate, true);
      };
    }
  }, [open, anchorRef]);

  if (!open || !rect) return null;

  const spaceBelow = window.innerHeight - rect.bottom;
  const openUp = spaceBelow < 260;
  let dropdownWidth = typeof width === "number" ? width : Math.max(rect.width, 280);
  let left = rect.left;
  if (left + dropdownWidth > window.innerWidth) {
    left = Math.max(16, rect.right - dropdownWidth);
  }

  const style: React.CSSProperties = {
    position: "fixed",
    left: left,
    width: dropdownWidth,
    zIndex: 9999,
    ...(openUp ? { bottom: window.innerHeight - rect.top + 4 } : { top: rect.bottom + 4 }),
  };

  return createPortal(<div style={style}>{children}</div>, document.body);
}

function IconPicker({ value, onChange, compact = false }: any) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const anchorRef = useRef<HTMLDivElement>(null);

  const suggestions = query.length >= 2
    ? searchIcons(query, 10).map(icon => ({ name: icon.replace(/^(Si|Fa|Fi|Md|Io|Bi)/, ""), icon }))
    : [];

  useEffect(() => setActiveIndex(0), [query, open]);

  const select = (iconName: string, displayName?: string) => {
    onChange(iconName);
    if (displayName) setQuery(displayName);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(prev => (suggestions.length ? (prev + 1) % suggestions.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(prev => (suggestions.length ? (prev - 1 + suggestions.length) % suggestions.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (suggestions.length > 0 && suggestions[activeIndex]) {
        select(suggestions[activeIndex].icon, suggestions[activeIndex].name);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={anchorRef} className="h-full w-full">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 w-full h-full px-3 py-2 bg-black/40 border border-white/[0.07] ${compact ? "rounded-lg" : "rounded-xl"} text-gray-400 hover:border-purple-500/50 hover:text-white transition-colors text-xs whitespace-nowrap overflow-hidden`}
        title="Select Icon"
      >
        {value ? (
          <span className="text-base text-gray-200 shrink-0">
            {resolveIcon(value, { size: 16 }) ?? <FiCpu size={16} />}
          </span>
        ) : (
          <FiSearch size={14} className="shrink-0" />
        )}
        <span className="truncate">{value || "Icon"}</span>
      </button>

      <PortalDropdown anchorRef={anchorRef as React.RefObject<HTMLElement>} open={open} width={280}>
        <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-black">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10">
            <FiSearch className="text-gray-500 shrink-0" size={14} />
            <input
              autoFocus
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search icon..."
              className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 focus:outline-none"
            />
            <button onClick={() => setOpen(false)} className="text-gray-600 hover:text-white shrink-0">
              <FiX size={14} />
            </button>
          </div>
          {suggestions.length > 0 ? (
            suggestions.map((s, idx) => (
              <button
                key={s.icon}
                type="button"
                onMouseDown={() => select(s.icon, s.name)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 transition-colors text-left ${idx === activeIndex ? "bg-purple-600/30" : "hover:bg-purple-600/10"}`}
              >
                <span className="text-base text-gray-300 shrink-0 w-6 flex items-center justify-center">
                  {resolveIcon(s.icon, { size: 18 }) ?? <FiCpu size={18} />}
                </span>
                <span className="text-sm text-gray-200 truncate">{s.name}</span>
                <span className="text-xs text-gray-600 ml-auto shrink-0">{s.icon}</span>
              </button>
            ))
          ) : query.length >= 2 ? (
            <div className="px-3 py-4 text-center text-xs text-gray-600">No results for "{query}"</div>
          ) : (
            <div className="px-3 py-4 text-center text-xs text-gray-600">Type to search icons...</div>
          )}
        </div>
      </PortalDropdown>
    </div>
  );
}
