"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { FiGithub, FiExternalLink, FiChevronDown, FiChevronUp } from "react-icons/fi";
import api from "@/lib/axios";

const COLORS = [
  "from-orange-500 to-red-500",
  "from-pink-600 to-rose-500",
  "from-teal-500 to-cyan-500",
  "from-gray-700 to-black",
  "from-blue-600 to-indigo-600",
  "from-orange-600 to-amber-600",
  "from-sky-500 to-blue-400",
  "from-emerald-500 to-green-600",
];

export default function Projects() {
  const [showAll, setShowAll]   = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      try {
        const [projectsRes] = await Promise.allSettled([
          api.get("/projects", { signal: controller.signal }),
        ]);

        if (projectsRes.status === "fulfilled") {
          const list = Array.isArray(projectsRes.value.data)
            ? projectsRes.value.data
            : Object.values(projectsRes.value.data ?? {});
          
          setProjects(prev => {
             const newList = [...list].sort((a, b) => {
               const rankA = a.rank || Number.MAX_SAFE_INTEGER;
               const rankB = b.rank || Number.MAX_SAFE_INTEGER;
               if (rankA !== rankB) return rankA - rankB;
               return (b.created_at ?? 0) - (a.created_at ?? 0);
             });
             return JSON.stringify(prev) === JSON.stringify(newList) ? prev : newList;
          });
        }
      } catch (err) {
        if (err.name !== 'CanceledError') {
          console.error("Failed to fetch data:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, []);

  const visibleProjects = showAll ? projects : projects.slice(0, 6);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: shouldReduceMotion ? 0.3 : 0.4, ease: "easeOut" } }
  };

  return (
    <section className="min-h-screen py-24 px-5 sm:px-8" id="projects">
      <div 
        style={{ background: 'rgba(255,255,255,0.2)' }}
        className="max-w-7xl w-full mx-auto p-6 sm:p-10 md:p-12 rounded-[2.5rem]"
      >
        <motion.header
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.3 : 0.4 }}
          viewport={{ once: true }}
          className="text-center mb-16 sm:mb-20"
        >
          <h2 className="text-[clamp(2rem,6vw,3rem)] font-bold text-slate-900 mb-4">
            Featured Projects
          </h2>
          <p className="text-slate-700 font-medium text-base sm:text-lg max-w-2xl mx-auto">
            A showcase of my technical projects, research, and creative designs.
          </p>
        </motion.header>

        {loading && (
          <div className="flex justify-center py-20" aria-busy="true">
            <div className="w-8 h-8 border-4 border-blue-600/20 border-t-[#1976D2] rounded-full animate-spin" />
          </div>
        )}
        {!loading && (
          <>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              <AnimatePresence>
                {visibleProjects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                    isExpanded={showAll}
                    color={COLORS[index % COLORS.length]}
                    variants={itemVariants}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {projects.length === 0 && (
              <div className="text-center text-slate-500 font-mono text-xs uppercase tracking-widest py-20 font-bold">
                No_Projects_Found
              </div>
            )}

            {projects.length > 6 && (
              <div className="flex justify-center mt-16">
                <button
                  onClick={() => setShowAll(!showAll)}
                  aria-expanded={showAll}
                  className="group flex flex-col items-center gap-2 text-slate-700 hover:text-[#1976D2] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-2"
                >
                  <span className="text-sm font-bold tracking-widest uppercase">
                    {showAll ? "Show Less" : "View All Projects"}
                  </span>
                  <div className="p-4 rounded-full bg-[#1976D2] group-hover:bg-[#1565C0] transition-all shadow-lg text-white">
                    <FiChevronDown 
                      className={`text-xl transition-transform duration-300 ${showAll ? "rotate-180" : ""}`} 
                    />
                  </div>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function ProjectCard({ project, index, isExpanded, color, variants }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.article
      layout={!shouldReduceMotion}
      variants={variants}
      initial="hidden"
      animate="visible"
      style={{ 
        backdropFilter: 'blur(40px) saturate(180%)', 
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        background: 'rgba(255,255,255,0.10)',
        border: '1px solid rgba(255,255,255,0.25)'
      }}
      exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }}
      whileHover={shouldReduceMotion ? {} : { y: -4 }}
      className="group relative rounded-3xl hover:border-white/40 flex flex-col focus-within:ring-2 focus-within:ring-white/50 focus-within:border-transparent transition-all duration-300 shadow-sm"
    >
      {/* Blur layer — must be first child, handles its own clipping */}
      <div className="glass-blur-layer" aria-hidden="true" />

      {/* Image section — needs its own clip */}
      <div className="relative aspect-[4/3] sm:aspect-[16/9] lg:aspect-[4/3] overflow-hidden rounded-t-[24px]">
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-20 group-hover:opacity-30 transition-opacity`} aria-hidden="true" />
        {project.image_link ? (
          <img
            src={project.image_link}
            alt={`Screenshot of ${project.title}`}
            loading="lazy"
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${color} opacity-30`} aria-hidden="true" />
        )}
        <div style={{ backdropFilter: 'blur(40px) saturate(180%)', WebkitBackdropFilter: 'blur(40px) saturate(180%)', background: 'rgba(255,255,255,0.40)', border: '1px solid rgba(255,255,255,0.40)' }} className="absolute top-4 left-4 px-3 py-1.5 text-xs font-bold text-slate-900 shadow-lg rounded-xl">
          {project.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-[clamp(1.25rem,3vw,1.5rem)] font-bold mb-2 text-slate-900 transition-colors">
          {project.title}
        </h3>
        <p className="text-slate-700 font-medium text-sm mb-6 line-clamp-3 leading-relaxed">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-6 mt-auto">
          {project.tech_stack?.map((t, i) => (
            <span
              key={i}
              className="bg-white/40 border border-white/40 text-blue-700 font-bold rounded-full px-3 py-[2px] text-[12px]"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-slate-300/50">
          {project.github_url && project.github_url !== "#" ? (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-[#1976D2] transition-colors focus-visible:outline-none focus-visible:text-[#1976D2] p-2 -ml-2 rounded-lg"
              aria-label={`${project.title} source code on GitHub`}
            >
              <FiGithub className="text-lg" /> Code
            </a>
          ) : (
            <span className="text-sm font-bold text-slate-500 italic p-2 -ml-2">Code Private</span>
          )}
          {project.live_url && project.live_url !== "#" && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-[#1976D2] transition-colors focus-visible:outline-none focus-visible:text-[#1976D2] p-2 rounded-lg"
              aria-label={`View live demo of ${project.title}`}
            >
              <FiExternalLink className="text-lg" /> Live
            </a>
          )}
        </div>
      </div>
    </motion.article>

    
    
  );

}