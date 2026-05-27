import { useState, useEffect } from "react";
import api from "@/lib/axios";

export interface Profile {
  name: string;
  title: string;
  subtitle: string;
  bio: string;
  education: string;
  location: string;
  skills: string[];
  socials: { platform: string; url: string }[];
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data } = await api.get(`/profile?t=${Date.now()}`);
        setProfile(data);
      } catch (err) {
        setError("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  return { profile, loading, error };
}
