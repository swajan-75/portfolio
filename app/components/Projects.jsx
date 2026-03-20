"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiGithub, FiExternalLink, FiChevronDown, FiChevronUp, FiDownload } from "react-icons/fi";
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
  const [cv, setCV]             = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, cvRes] = await Promise.allSettled([
          api.get("/projects"),
          api.get("/cv/active"),
        ]);

        if (projectsRes.status === "fulfilled") {
          const list = Array.isArray(projectsRes.value.data)
            ? projectsRes.value.data
            : Object.values(projectsRes.value.data ?? {});
          list.sort((a, b) => (b.created_at ?? 0) - (a.created_at ?? 0));
          setProjects(list);
        }

        if (cvRes.status === "fulfilled") {
          setCV(cvRes.value.data);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const visibleProjects = showAll ? projects : projects.slice(0, 6);

  return (
    <section className="min-h-screen bg-black text-white py-24 px-6" id="projects">
      <div className="max-w-7xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 mb-4">
            Featured Projects
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            A showcase of my technical projects, research, and creative designs.
          </p>

        </motion.div>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-white/10 border-t-white rounded-full animate-spin" />
          </div>
        )}

        {!loading && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {visibleProjects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                    isExpanded={showAll}
                    color={COLORS[index % COLORS.length]}
                  />
                ))}
              </AnimatePresence>
            </div>

            {projects.length === 0 && (
              <div className="text-center text-gray-600 font-mono text-xs uppercase tracking-widest py-20">
                No_Projects_Found
              </div>
            )}

            {projects.length > 6 && (
              <div className="flex justify-center mt-16">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="group flex flex-col items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <span className="text-sm font-medium tracking-widest uppercase">
                    {showAll ? "Show Less" : "View All Projects"}
                  </span>
                  <div className="p-3 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 group-hover:border-white/30 transition-all">
                    {showAll ? (
                      <FiChevronUp className="text-xl" />
                    ) : (
                      <FiChevronDown className="text-xl animate-bounce" />
                    )}
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

function ProjectCard({ project, index, isExpanded, color }) {
  const isExtraItem = index > 5;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        duration: 0.3,
        delay: isExpanded && isExtraItem ? 0 : index * 0.05,
      }}
      whileHover={{ y: -8 }}
      className="group relative bg-neutral-900/50 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm flex flex-col"
    >
      <div className="relative h-48 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-20 group-hover:opacity-30 transition-opacity`} />
        {project.image_link ? (
          <img
            src={project.image_link}
            alt={project.title}
            loading="lazy"
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${color} opacity-30`} />
        )}
        <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-xs text-white">
          {project.category}
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-2xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">
          {project.title}
        </h3>
        <p className="text-gray-400 text-sm mb-6 line-clamp-3">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-6 mt-auto">
          {project.tech_stack?.map((t, i) => (
            <span
              key={i}
              className="px-2 py-1 text-xs rounded bg-white/5 border border-white/10 text-gray-300"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-white/5">
        
          {project.github_url && project.github_url !== "#" ? (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <FiGithub className="text-lg" /> Code
            </a>
          ) : (
            <span className="text-sm text-gray-600 italic">Code Private</span>
          )}
          {project.live_url && project.live_url !== "#" && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <FiExternalLink className="text-lg" /> Live
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}