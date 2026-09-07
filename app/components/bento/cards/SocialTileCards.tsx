"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { FiInstagram, FiFacebook, FiLinkedin, FiGithub, FiMail } from "react-icons/fi";
import { useProfile, type SocialLink } from "../../../hooks/useProfile";

const ROTATE_MS = 2800;
const FALLBACK_EMAIL = "swajanbarua09@gmail.com";

function findSocialUrl(socials: SocialLink[] | undefined, match: string): string | null {
  return socials?.find((s) => s.platform.toLowerCase().includes(match))?.url ?? null;
}

interface TileEntry {
  key: string;
  label: string;
  url: string;
  icon: ReactNode;
  gradient: string;
}

function SocialTile({ entries }: { entries: TileEntry[] }) {
  const [active, setActive] = useState(0);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (entries.length < 2) return;
    const id = setInterval(() => setActive((i) => (i + 1) % entries.length), ROTATE_MS);
    return () => clearInterval(id);
  }, [entries.length]);

  const current = entries[active];

  return (
    <button
      onPointerDown={(e) => {
        pointerStart.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerUp={(e) => {
        if (!pointerStart.current) return;
        const dx = e.clientX - pointerStart.current.x;
        const dy = e.clientY - pointerStart.current.y;
        pointerStart.current = null;
        if (Math.sqrt(dx * dx + dy * dy) > 8) return; // was a drag
        if (current.url.startsWith("mailto:")) {
          window.location.href = current.url;
        } else {
          window.open(current.url, "_blank", "noopener,noreferrer");
        }
      }}
      aria-label={current.label}
      className={`relative flex h-full w-full min-h-[220px] flex-col items-center justify-center gap-6 overflow-hidden bg-gradient-to-br ${current.gradient} transition-colors duration-700 cursor-grab active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffffff99] focus-visible:ring-inset`}
    >
      {/* This tile's gradient is a fixed brand color (Instagram/Facebook/etc.),
          not the page background, so the icon chrome stays literal white in
          both themes — deliberately not the `white` utility, which derives
          from the theme-swapped --color-white token. */}
      <span
        key={current.key}
        className="relative flex h-20 w-20 shrink-0 animate-[tile-pop_0.4s_ease-out] items-center justify-center rounded-full bg-[#ffffff33] text-4xl text-[#fff] ring-1 ring-[#ffffff4d] backdrop-blur-sm"
      >
        {current.icon}
      </span>

      {entries.length > 1 && (
        <div className="absolute bottom-6 flex items-center gap-1.5" aria-hidden="true">
          {entries.map((entry, i) => (
            <span
              key={entry.key}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === active ? "w-5 bg-[#fff]" : "w-1.5 bg-[#ffffff66]"
              }`}
            />
          ))}
        </div>
      )}
    </button>
  );
}

export function InstagramFacebookCard() {
  const { profile } = useProfile();
  const entries: TileEntry[] = [
    {
      key: "instagram",
      label: "Instagram",
      url: findSocialUrl(profile?.socials, "instagram") ?? "#",
      icon: <FiInstagram />,
      gradient: "from-[#7024c4] via-[#e1306c] to-[#fdb44b]",
    },
    {
      key: "facebook",
      label: "Facebook",
      url: findSocialUrl(profile?.socials, "facebook") ?? "#",
      icon: <FiFacebook />,
      gradient: "from-[#1877f2] to-[#0a4fa8]",
    },
  ];

  return <SocialTile entries={entries} />;
}

export function LinkedinGithubCard() {
  const { profile } = useProfile();
  const entries: TileEntry[] = [
    {
      key: "linkedin",
      label: "LinkedIn",
      url: findSocialUrl(profile?.socials, "linkedin") ?? "#",
      icon: <FiLinkedin />,
      gradient: "from-[#0a66c2] to-[#00355e]",
    },
    {
      key: "github",
      label: "GitHub",
      url: findSocialUrl(profile?.socials, "github") ?? "#",
      icon: <FiGithub />,
      gradient: "from-[#3a3a3a] to-[#0d1117] light:from-[#565d67] light:to-[#24292f]",
    },
  ];

  return <SocialTile entries={entries} />;
}

export function EmailCard() {
  const { profile } = useProfile();
  const rawUrl = findSocialUrl(profile?.socials, "email");
  const url = rawUrl ?? `mailto:${FALLBACK_EMAIL}`;

  const entries: TileEntry[] = [
    {
      key: "email",
      label: "Email",
      url,
      icon: <FiMail />,
      gradient: "from-[#ea4335] via-[#fbbc05] to-[#34a853]",
    },
  ];

  return <SocialTile entries={entries} />;
}
