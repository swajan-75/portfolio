import { useEffect, useState } from "react";
import api from "@/lib/axios";

// Module-level cache so every useActiveCv() caller across the page shares
// a single network request instead of each firing its own /cv/active fetch.
let hasFetched = false;
let cachedCvUrl: string | null = null;
let inFlightRequest: Promise<string | null> | null = null;

function fetchActiveCvOnce(): Promise<string | null> {
  if (hasFetched) return Promise.resolve(cachedCvUrl);
  if (!inFlightRequest) {
    inFlightRequest = api
      .get("/cv/active")
      .then((res) => {
        cachedCvUrl = res.data?.url ?? null;
        return cachedCvUrl;
      })
      .catch(() => {
        cachedCvUrl = null;
        return cachedCvUrl;
      })
      .finally(() => {
        hasFetched = true;
        inFlightRequest = null;
      });
  }
  return inFlightRequest;
}

export function useActiveCv() {
  const [cvUrl, setCvUrl] = useState<string | null>(cachedCvUrl);

  useEffect(() => {
    let cancelled = false;
    fetchActiveCvOnce().then((url) => {
      if (!cancelled) setCvUrl(url);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return cvUrl;
}
