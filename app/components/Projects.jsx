"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiGithub, FiExternalLink, FiChevronDown, FiChevronUp } from "react-icons/fi";

// 1. UPDATED PROJECTS LIST
const projects = [
  {
    title: "ArkPlay Zone",
    category: "Booking System",
    description: "A complete indoor playzone booking system. Built a RESTful API for slot booking, tracking, and cancellation with role-based access control.",
    tech: ["NestJS", "PostgreSQL", "JWT", "SMTP", "OTP"],
    image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=1470&auto=format&fit=crop",
    github: "https://github.com/swajan-75/ArkPlayZone", 
    live: null,
    color: "from-orange-500 to-red-500",
  },
  {
    title: "Bkash Transaction Tracker",
    category: "Fintech / Automation",
    description: "Full-stack system for automating personal transaction tracking. Integrates SMS parsing, CRUD operations, and secure JWT authentication.",
    tech: ["NestJS", "Next.js", "PostgreSQL", "Android"],
    image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?q=80&w=1470&auto=format&fit=crop",
    github: null,
    live: null,
    color: "from-pink-600 to-rose-500",
  },
  {
    title: "Smart Student Assistant",
    category: "Android App",
    description: "Mobile assistant for university students managing class routines and notices. Features real-time FCM notifications and secure auth.",
    tech: ["Kotlin", "Firebase", "Room DB", "NestJS"],
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1470&auto=format&fit=crop",
    github: "https://github.com/swajan-75/Aiub_buddy.git",
    live: null,
    color: "from-teal-500 to-cyan-500",
  },
  {
    title: "Codeforces Tracker (cf)",
    category: "CLI Tool",
    description: "A robust CLI tool written in Go to track competitive programming activity. Features rating filters, daily stats, and Telegram bot notifications.",
    tech: ["Go", "Telegram API", "Codeforces API"],
    image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=1374&auto=format&fit=crop",
    github: "https://github.com/swajan-75/Codeforces-Tracker.git", 
    live: null,
    color: "from-gray-700 to-black",
  },
  {
    title: "AIUB API",
    category: "Open Source API",
    description: "Open-source REST API exposing university data like faculty info and notices. Designed for developers to build dashboards and automation tools.",
    tech: ["NestJS", "RESTful API", "JSON", "Scraping"],
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1470&auto=format&fit=crop",
    github: "https://github.com/swajan-75/aiub-public-api.git",
    live: "https://aiub-public-api.vercel.app/",
    color: "from-blue-600 to-indigo-600",
  },
  {
   title: "Rangeer",
    category: "Rust CLI Tool",
    description: "A high-performance text extraction tool built in Rust. Uses Regex to search, filter, and extract data from streams with maximum speed and efficiency.",
    tech: ["Rust", "Regex", "CLI", "Systems Programming"],
    image: "https://images.unsplash.com/photo-1550439062-609e1531270e?q=80&w=1470&auto=format&fit=crop", 
    github: "https://github.com/swajan-75/rangeer",
    live: null,
    color: "from-orange-600 to-amber-600",
  },
  {
    title: "Telegram Msg Scheduler",
    category: "Bot Automation",
    description: "An automated bot service to schedule and manage Telegram messages, ensuring timely delivery for community announcements.",
    tech: ["Go", "Telegram Bot API", "Cron", "Docker"],
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1470&auto=format&fit=crop",
    github: "https://github.com/swajan-75/telegram-message-scheduler", // ADDED
    live: null,
    color: "from-sky-500 to-blue-400",
  },
  {
    title: "AIUB Captcha Solver",
    category: "Machine Learning / Automation",
    description: "An automated script utilizing computer vision techniques to solve CAPTCHAs for the university portal, streamlining login processes.",
    tech: ["Python", "OpenCV", "TensorFlow", "Selenium"],
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1365&auto=format&fit=crop", // AI/Brain
    github: "https://github.com/swajan-75/aiub_captcha_solver", // ADDED
    live: null,
    color: "from-emerald-500 to-green-600",
  },
  
];

export default function Projects() {
  const [showAll, setShowAll] = useState(false);

  // LOGIC: Show all if 'showAll' is true, otherwise slice first 6
  const visibleProjects = showAll ? projects : projects.slice(0, 6);

  return (
    <section className="min-h-screen bg-black text-white py-24 px-6" id="projects">
      <div className="max-w-7xl mx-auto">
        
        {/* SECTION HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 mb-4">
            Featured Projects
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            A showcase of my technical projects, research, and creative designs.
          </p>
        </motion.div>

        {/* PROJECTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {visibleProjects.map((project, index) => (
              <ProjectCard key={index} project={project} index={index} />
            ))}
          </AnimatePresence>
        </div>

        {/* TOGGLE BUTTONS */}
        {projects.length > 6 && (
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="flex justify-center mt-16"
          >
            {!showAll ? (
              <button
                onClick={() => setShowAll(true)}
                className="group flex flex-col items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <span className="text-sm font-medium tracking-widest uppercase">View All Projects</span>
                <div className="p-3 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 group-hover:border-white/30 transition-all">
                  <FiChevronDown className="text-xl animate-bounce" />
                </div>
              </button>
            ) : (
              <button
                onClick={() => setShowAll(false)}
                className="group flex flex-col items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <div className="p-3 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 group-hover:border-white/30 transition-all">
                  <FiChevronUp className="text-xl" />
                </div>
                <span className="text-sm font-medium tracking-widest uppercase">Show Less</span>
              </button>
            )}
          </motion.div>
        )}

      </div>
    </section>
  );
}

function ProjectCard({ project, index }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className="group relative bg-neutral-900/50 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm flex flex-col"
    >
      {/* 1. IMAGE AREA */}
      <div className="relative h-48 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-20 group-hover:opacity-30 transition-opacity`} />
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-xs text-white">
          {project.category}
        </div>
      </div>

      {/* 2. CONTENT AREA */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-2xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">
          {project.title}
        </h3>
        <p className="text-gray-400 text-sm mb-6 line-clamp-3">
          {project.description}
        </p>

        {/* Tech Stack Tags */}
        <div className="flex flex-wrap gap-2 mb-6 mt-auto">
          {project.tech.map((t, i) => (
            <span 
              key={i} 
              className="px-2 py-1 text-xs rounded bg-white/5 border border-white/10 text-gray-300"
            >
              {t}
            </span>
          ))}
        </div>

        {/* 3. LINKS FOOTER */}
        <div className="flex items-center gap-4 pt-4 border-t border-white/5">
          {project.github && (
            <a 
              href={project.github} 
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <FiGithub className="text-lg" /> Code
            </a>
          )}
          {project.live && (
            <a 
              href={project.live} 
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <FiExternalLink className="text-lg" /> Live Demo
            </a>
          )}
          {!project.github && !project.live && (
             <span className="text-sm text-gray-600 italic">Confidential / Offline</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}