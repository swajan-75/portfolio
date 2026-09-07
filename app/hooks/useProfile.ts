import { useEffect, useState } from "react";
import api from "@/lib/axios";

export interface SkillItem {
  name: string;
  icon: string;
}

export interface SkillCategory {
  title: string;
  description: string;
  icon: string;
  col_span: number;
  skills: SkillItem[];
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface Profile {
  name: string;
  title: string;
  subtitle: string;
  bio: string;
  education: string;
  location: string;
  skills: string[];
  socials: SocialLink[];
  skill_categories?: SkillCategory[];
  education_info?: { degree?: string; institution?: string };
  tech_tags?: string[];
  stats?: { value: string; label: string }[];
  highlights?: { title: string; value: string; subtext?: string }[];
}

// Module-level cache so every useProfile() caller across the page shares
// a single network request instead of each firing its own /profile fetch.
let cachedProfile: Profile | null = null;
let inFlightRequest: Promise<Profile> | null = null;

function fetchProfileOnce(): Promise<Profile> {
  if (cachedProfile) return Promise.resolve(cachedProfile);
  if (!inFlightRequest) {
    inFlightRequest = api
      .get("/profile")
      .then(({ data }) => {
        cachedProfile = data;
        return data as Profile;
      })
      .finally(() => {
        inFlightRequest = null;
      });
  }
  return inFlightRequest;
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(cachedProfile);
  const [loading, setLoading] = useState(!cachedProfile);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initial state above already reflects a warm cache — nothing to do.
    if (cachedProfile) return;

    let cancelled = false;
    fetchProfileOnce()
      .then((data) => {
        if (!cancelled) setProfile(data);
      })
      .catch(() => {
        if (!cancelled) setError("Failed to fetch profile");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { profile, loading, error };
}
