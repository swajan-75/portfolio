"use client";
import React, { useState, useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import { FiDownload, FiUser, FiCpu, FiBookOpen, FiAward, FiTrendingUp } from "react-icons/fi";
import aiubLogo from "../images/aiub.png";
import swajanDP from "../images/swajan_1.jpg";
import { useProfile } from "../hooks/useProfile";
import api from "@/lib/axios";

export default function About() {
  const [cvUrl, setCvUrl] = useState(null);
  const { profile, loading: profileLoading } = useProfile();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    api.get("/cv/active")
      .then((res) => setCvUrl(res.data?.url ?? null))
      .catch(() => setCvUrl(null));
  }, []);

  const handleDownload = async () => {
    try {
      await api.post("/track/downloads");
    } catch (err) {
      console.error("Download tracking failed:", err?.response?.status, err?.message);
    }
  };

  if (profileLoading) return null;

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: shouldReduceMotion ? 0.3 : 0.6, ease: "easeOut" } }
  };

  return (
    <section className="py-24 px-5 sm:px-8" id="about">
      <div 
        style={{ background: 'rgba(255,255,255,0.2)' }}
        className="max-w-6xl w-full mx-auto p-6 sm:p-10 md:p-12 rounded-[2.5rem]"
      >        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-12 gap-6"
        >

          {/* 2. PROFILE IMAGE CARD */}
          <motion.article 
            style={{ backdropFilter: 'blur(40px) saturate(180%)', WebkitBackdropFilter: 'blur(40px) saturate(180%)', background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.25)' }}
            variants={itemVariants}
            className="md:col-span-4 relative overflow-hidden group order-1 md:order-2 aspect-[4/5] md:aspect-auto md:h-full rounded-3xl"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" aria-hidden="true" />
            <img
              src={swajanDP.src}
              alt="Swajan Barua profile picture"
              className="w-full h-full object-cover transition-all duration-700 scale-100 group-hover:scale-105"
            />
          </motion.article>

          {/* 1. HERO BIO CARD */}
          <motion.article 
            style={{ backdropFilter: 'blur(40px) saturate(180%)', WebkitBackdropFilter: 'blur(40px) saturate(180%)', background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.25)' }}
            variants={itemVariants}
            className="md:col-span-8 p-6 sm:p-8 flex flex-col justify-center order-2 md:order-1 rounded-3xl"
          >
            <header className="flex items-center gap-3 mb-6">
              <span className="text-slate-700 text-2xl" aria-hidden="true"><FiUser /></span>
              <h2 className="text-[clamp(1.75rem,5vw,2.25rem)] font-bold text-slate-900">Who I Am</h2>
            </header>

            <div className="text-slate-700 font-medium text-base sm:text-lg leading-relaxed mb-6 whitespace-pre-wrap">
              {profile?.bio || `I am a Computer Science student and Backend Developer passionate about creating high-performing, scalable systems. From low-level algorithms in C++ and Go to modern web frameworks like NestJS, Next.js, and .NET Core, my experience covers the full software lifecycle.`}
            </div>

            {cvUrl ? (
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                onClick={handleDownload}
                className="w-full sm:w-fit flex items-center justify-center gap-2 px-6 py-3 bg-[#1976D2] text-white font-bold rounded-full hover:bg-[#1565C0] shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <FiDownload /> Download Resume
              </a>
            ) : (
              <button
                disabled
                style={{ backdropFilter: 'blur(40px) saturate(180%)', WebkitBackdropFilter: 'blur(40px) saturate(180%)', background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.25)' }}
                className="w-full sm:w-fit flex items-center justify-center gap-2 px-6 py-3 text-slate-500 font-bold rounded-full cursor-not-allowed bg-white/20"
              >
                <FiDownload /> Resume Unavailable
              </button>
            )}
          </motion.article>

          {/* 3. EDUCATION CARD */}
          <motion.article 
            variants={itemVariants}
            style={{ backdropFilter: 'blur(40px) saturate(180%)', WebkitBackdropFilter: 'blur(40px) saturate(180%)', background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.25)' }}
            className="md:col-span-6 p-6 sm:p-8 relative overflow-hidden order-3 rounded-3xl"
          >
            <div className="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10">
              <div>
                <header className="flex items-center gap-3 mb-4">
                  <span className="text-slate-700 text-2xl" aria-hidden="true"><FiBookOpen /></span>
                  <h3 className="text-[clamp(1.25rem,3vw,1.5rem)] font-bold text-slate-900">Education</h3>
                </header>
                <div className="space-y-1">
                  <h4 className="text-[clamp(1.25rem,4vw,1.75rem)] font-bold text-slate-900 leading-tight">
                    {profile?.education_info?.degree || "Loading..."}
                  </h4>
                  <p className="text-slate-700 font-medium text-sm whitespace-pre-wrap mt-2">
                    {profile?.education_info?.institution || ""}
                  </p>
                </div>
              </div>
              <div style={{ backdropFilter: 'blur(40px) saturate(180%)', WebkitBackdropFilter: 'blur(40px) saturate(180%)', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.30)' }} className="p-3 h-16 w-16 sm:h-20 sm:w-20 flex items-center justify-center shrink-0 rounded-2xl" aria-hidden="true">
                <img src={aiubLogo.src} alt="AIUB" className="w-full h-full object-contain" />
              </div>
            </div>
          </motion.article>

          {/* 4. TECH FOCUS CARD */}
          <motion.article variants={itemVariants} style={{ backdropFilter: 'blur(40px) saturate(180%)', WebkitBackdropFilter: 'blur(40px) saturate(180%)', background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.25)' }} className="md:col-span-6 p-6 sm:p-8 order-4 rounded-3xl">
            <header className="flex items-center gap-3 mb-4">
              <span className="text-slate-700 text-2xl" aria-hidden="true"><FiCpu /></span>
              <h3 className="text-[clamp(1.25rem,3vw,1.5rem)] font-bold text-slate-900">The Tech</h3>
            </header>
            <div className="flex flex-wrap gap-2">
              {(profile?.tech_tags || []).map((tag) => (
                <span key={tag} className="px-3 py-1.5 bg-white/40 border border-white/40 rounded-full text-xs font-bold text-blue-700">
                  {tag}
                </span>
              ))}
            </div>
          </motion.article>

          {/* 5. STATS CARD */}
          <motion.article variants={itemVariants} style={{ backdropFilter: 'blur(40px) saturate(180%)', WebkitBackdropFilter: 'blur(40px) saturate(180%)', background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.25)' }} className="md:col-span-4 p-6 sm:p-8 flex flex-col justify-between order-5 rounded-3xl">
            <header className="flex items-center gap-3 mb-6">
              <span className="text-slate-700 text-2xl" aria-hidden="true"><FiTrendingUp /></span>
              <h3 className="text-[clamp(1.25rem,3vw,1.5rem)] font-bold text-slate-900">Stats</h3>
            </header>
            <div className="grid grid-cols-2 gap-4">
              {(profile?.stats || []).map((stat, i) => (
                <div key={i}>
                  <h3 className="text-[clamp(1.75rem,5vw,2.25rem)] font-bold text-blue-700 leading-none mb-1">{stat.value}</h3>
                  <p className="text-slate-600 font-bold text-xs uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.article>

          {/* 6. COMPETITIVE HIGHLIGHTS */}
          <motion.article variants={itemVariants} style={{ backdropFilter: 'blur(40px) saturate(180%)', WebkitBackdropFilter: 'blur(40px) saturate(180%)', background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.25)' }} className="md:col-span-8 p-6 sm:p-8 order-6 rounded-3xl">
            <header className="flex items-center gap-3 mb-6">
              <span className="text-slate-700 text-2xl" aria-hidden="true"><FiAward /></span>
              <h3 className="text-[clamp(1.25rem,3vw,1.5rem)] font-bold text-slate-900">Competitive Career</h3>
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {(profile?.highlights || []).map((highlight, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ scale: 1.02 }}
                  style={{ backdropFilter: 'blur(40px) saturate(180%)', WebkitBackdropFilter: 'blur(40px) saturate(180%)', background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.25)' }}
                  className="p-5 hover:bg-white/40 transition-all cursor-default rounded-2xl"
                >
                  <div className="text-sm font-medium text-slate-700 mb-2">{highlight.title}</div>
                  <div className="text-2xl font-bold text-blue-700 mb-1">{highlight.value}</div>
                  {highlight.subtext && <div className="text-xs font-bold text-slate-500">{highlight.subtext}</div>}
                </motion.div>
              ))}
            </div>
          </motion.article>

        </motion.div>
      </div>
    </section>
  );
}