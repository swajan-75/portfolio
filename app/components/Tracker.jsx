"use client"; 
import { useEffect } from "react";
import api from "@/lib/axios";

export default function AnalyticsTracker() {
  useEffect(() => {
    const trackVisit = async () => {
      try {
    
        await api.post("/track/visit");
      } catch (err) {
  
        console.error("Analytics sync failed");
      }
    };
    trackVisit();
  }, []);

  return null;
}