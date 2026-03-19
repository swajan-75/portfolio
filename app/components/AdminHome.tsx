"use client";
import React, { useEffect, useState, useCallback } from "react";
import api from "@/lib/axios";
import { FiGlobe, FiBox, FiFileText, FiLayers, FiTrendingUp, FiRefreshCw } from "react-icons/fi";
import { motion } from "framer-motion";


interface AdminHomeProps {
  projectsCount: number;
}

interface StatsData {
  unique_visitors: number;
  cv_downloads: number;
  countries?: Record<string, number>; 
}

export default function AdminHome({ projectsCount }: AdminHomeProps) {
  const [statsData, setStatsData] = useState<StatsData>({ 
    unique_visitors: 0, 
    cv_downloads: 0,
    countries: {} 
  });
  const [syncing, setSyncing] = useState(true);

  const fetchRealStats = useCallback(async () => {
    setSyncing(true);
    try {
      const res = await api.get("/admin/track/stats");
      

      setStatsData({
        unique_visitors: res.data?.unique_visitors || 0,
        cv_downloads: res.data?.cv_downloads || 0,
        countries: res.data?.countries || {} 
      });
    } catch (err) {
      console.error("Stats Sync Failed:", err);
    } finally {
      setSyncing(false);
    }
  }, []);

  useEffect(() => {
    fetchRealStats();
  }, [fetchRealStats]);

  const stats = [
    { label: "Unique Visitors", value: statsData.unique_visitors.toLocaleString(), icon: <FiGlobe />, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "Project Clicks", value: "450", icon: <FiBox />, color: "text-purple-400", bg: "bg-purple-500/10" },
    { label: "CV Downloads", value: statsData.cv_downloads.toLocaleString(), icon: <FiFileText />, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "Live Projects", value: projectsCount.toLocaleString(), icon: <FiLayers />, color: "text-orange-400", bg: "bg-orange-500/10" },
  ];

  return (
    <div className="max-w-6xl mx-auto">
     
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white">System Overview</h1>
          <p className="text-gray-500 mt-2 font-mono text-sm">
            {syncing ? "// SYNCING_REALTIME_DATA..." : "// DATA_VINTAGE: RECENT"}
          </p>
        </div>
        <button 
          onClick={fetchRealStats}
          disabled={syncing}
          className={`p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all ${syncing ? 'opacity-50' : ''}`}
        >
          <FiRefreshCw className={`text-gray-400 ${syncing ? 'animate-spin' : ''}`} />
        </button>
      </header>

     
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((s, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-neutral-900/40 border border-white/10 p-6 rounded-3xl hover:border-white/20 transition-all group cursor-default"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-4 ${s.bg} ${s.color}`}>
              {s.icon}
            </div>
            <div className="text-3xl font-bold text-white tracking-tight">{s.value}</div>
            <div className="text-gray-500 text-sm mt-1 font-medium">{s.label}</div>
          </motion.div>
        ))}
      </div>

      
      <div className="bg-neutral-900/40 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h3 className="font-bold flex items-center gap-2 text-white">
            <FiTrendingUp className="text-blue-400" /> Traffic Distribution
          </h3>
          <span className="text-[10px] uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full text-emerald-400 font-bold border border-emerald-500/20">
            Live Stream
          </span>
        </div>
        
        <div className="p-6 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs text-gray-500 uppercase tracking-wider">
                <th className="pb-4 font-semibold">Location</th>
                <th className="pb-4 font-semibold">Views</th>
                <th className="pb-4 font-semibold">Clicks</th>
                <th className="pb-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-sm">
             
              {statsData.countries && Object.entries(statsData.countries).length > 0 ? (
                Object.entries(statsData.countries)
                  .sort((a, b) => b[1] - a[1]) 
                  .map(([name, count]) => (
                    <CountryRow 
                      key={name} 
                      name={name} 
                      views={count} 
                      clicks={0} 
                      color={name === "Bangladesh" ? "bg-green-500" : "bg-blue-500"} 
                    />
                  ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-600 italic">
                    // No geographic data recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CountryRow({ name, views, clicks, color }: { name: string, views: number, clicks: number, color: string }) {
  return (
    <tr className="group hover:bg-white/5 transition-colors">
      <td className="py-4 flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${color}`} />
        <span className="text-gray-300 group-hover:text-white transition-colors">{name}</span>
      </td>
      <td className="py-4 text-gray-400">{views.toLocaleString()}</td>
      <td className="py-4 text-gray-400">{clicks.toLocaleString()}</td>
      <td className="py-4">
        <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-600">Active</span>
      </td>
    </tr>
  );
}