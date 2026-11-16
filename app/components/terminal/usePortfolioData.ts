import { useEffect, useMemo, useState } from "react";
import api from "@/lib/axios";
import { useActiveCv } from "@/app/hooks/useActiveCv";
import { useProfile } from "@/app/hooks/useProfile";
import { normalizeProjects, type Project } from "@/app/projects/_components/projectModel";
import type { PortfolioData } from "./types";

// Shared across terminal sessions so reopening doesn't refetch.
let cachedProjects: Project[] | null = null;
let inFlight: Promise<Project[]> | null = null;

function fetchProjectsOnce(): Promise<Project[]> {
  if (cachedProjects) return Promise.resolve(cachedProjects);
  inFlight ??= api
    .get("/projects")
    .then(({ data }) => {
      cachedProjects = normalizeProjects(data);
      return cachedProjects;
    })
    .finally(() => {
      inFlight = null;
    });
  return inFlight;
}

/** Profile, projects and CV link: the live data the terminal's files and commands are built from. */
export function usePortfolioData(): PortfolioData {
  const { profile, loading: isProfileLoading } = useProfile();
  const cvUrl = useActiveCv();
  const [projects, setProjects] = useState<Project[]>(cachedProjects ?? []);
  const [isProjectsLoading, setIsProjectsLoading] = useState(!cachedProjects);

  useEffect(() => {
    if (cachedProjects) return;
    let cancelled = false;
    fetchProjectsOnce()
      .then((list) => {
        if (!cancelled) setProjects(list);
      })
      .catch((err: unknown) => {
        console.error("Terminal: failed to load projects", err);
      })
      .finally(() => {
        if (!cancelled) setIsProjectsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const isLoading = isProfileLoading || isProjectsLoading;
  return useMemo(() => ({ profile, projects, cvUrl, isLoading }), [profile, projects, cvUrl, isLoading]);
}
