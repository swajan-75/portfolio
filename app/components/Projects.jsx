"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiGithub, FiExternalLink, FiChevronDown, FiChevronUp } from "react-icons/fi";

const projects = [
  {
    title: "ArkPlay Zone",
    category: "Booking System",
    description: "A complete indoor playzone booking system. Built a RESTful API for slot booking, tracking, and cancellation with role-based access control.",
    tech: ["NestJS", "PostgreSQL", "JWT", "SMTP", "OTP"],
    image: "projects/arkplay.jpg",
    github: "https://github.com/swajan-75/ArkPlayZone", 
    live: null,
    color: "from-orange-500 to-red-500",
  },
  {
    title: "Bkash Transaction Tracker",
    category: "Fintech / Automation",
    description: "Full-stack system for automating personal transaction tracking. Integrates SMS parsing, CRUD operations, and secure JWT authentication.",
    tech: ["NestJS", "Next.js", "PostgreSQL", "Android"],
    image: "projects/bkash.jpg",
    github: "#",
    live: null,
    color: "from-pink-600 to-rose-500",
  },
  {
    title: "Smart Student Assistant",
    category: "Android App",
    description: "Mobile assistant for university students managing class routines and notices. Features real-time FCM notifications and secure auth.",
    tech: ["Kotlin", "Firebase", "Room DB", "NestJS"],
    image: "projects/student_assistant.jpg",
    github: "https://github.com/swajan-75/Aiub_buddy.git",
    live: null,
    color: "from-teal-500 to-cyan-500",
  },
  {
    title: "Codeforces Tracker (cf)",
    category: "CLI Tool",
    description: "A robust CLI tool written in Go to track competitive programming activity. Features rating filters, daily stats, and Telegram bot notifications.",
    tech: ["Go", "Telegram API", "Codeforces API"],
    image: "projects/codeforces.jpg",
    github: "https://github.com/swajan-75/Codeforces-Tracker.git", 
    live: null,
    color: "from-gray-700 to-black",
  },
  {
    title: "AIUB API",
    category: "Open Source API",
    description: "Open-source REST API exposing university data like faculty info and notices. Designed for developers to build dashboards and automation tools.",
    tech: ["NestJS", "RESTful API", "JSON", "Scraping"],
    image: "projects/aiub_api.jpg",
    github: "https://github.com/swajan-75/aiub-public-api.git",
    live: "https://aiub-public-api.vercel.app/",
    color: "from-blue-600 to-indigo-600",
  },
  {
   title: "Rangeer",
    category: "Rust CLI Tool",
    description: "A high-performance text extraction tool built in Rust. Uses Regex to search, filter, and extract data from streams with maximum speed and efficiency.",
    tech: ["Rust", "Regex", "CLI", "Systems Programming"],
    image: "projects/rangeer.jpg", 
    github: "https://github.com/swajan-75/rangeer",
    live: null,
    color: "from-orange-600 to-amber-600",
  },
  {
    title: "Telegram Msg Scheduler",
    category: "Bot Automation",
    description: "An automated bot service to schedule and manage Telegram messages, ensuring timely delivery for community announcements.",
    tech: ["Go", "Telegram Bot API", "Cron", "Docker"],
    image: "projects/scheduler.jpg",
    github: "https://github.com/swajan-75/telegram-message-scheduler",
    live: "#",
    color: "from-sky-500 to-blue-400",
  },
  {
    title: "AIUB Captcha Solver",
    category: "Machine Learning / Automation",
    description: "An automated script utilizing computer vision techniques to solve CAPTCHAs for the university portal, streamlining login processes.",
    tech: ["Python", "OpenCV", "TensorFlow", "Selenium"],
    image: "projects/captcha.jpg",
    github: "https://github.com/swajan-75/aiub_captcha_solver",
    live: null,
    color: "from-emerald-500 to-green-600",
  },
];

export default function Projects() {
  const [showAll, setShowAll] = useState(false);

  // Logic to show all or just 6
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

        {/* Improved Grid with popLayout for smoother transitions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {visibleProjects.map((project, index) => (
              <ProjectCard 
                key={project.title} // Using title as key is better for layout animations than index
                project={project} 
                index={index} 
                isExpanded={showAll}
              />
            ))}
          </AnimatePresence>
        </div>

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
      </div>
    </section>
  );
}

function ProjectCard({ project, index, isExpanded }) {
  const isExtraItem = index > 5;
  
  return (
    <motion.div
      layout 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ 
        duration: 0.3, 
       
        delay: (isExpanded && isExtraItem) ? 0 : index * 0.05 
      }}
      whileHover={{ y: -8 }}
      className="group relative bg-neutral-900/50 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm flex flex-col"
    >
      <div className="relative h-48 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-20 group-hover:opacity-30 transition-opacity`} />
        <img 
          src={project.image} 
          alt={project.title} 
          loading="lazy" 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
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
          {project.tech.map((t, i) => (
            <span 
              key={i} 
              className="px-2 py-1 text-xs rounded bg-white/5 border border-white/10 text-gray-300"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-white/5">
          {project.github && project.github !== "#" ? (
            <a 
              href={project.github} 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <FiGithub className="text-lg" /> Code
            </a>
          ) : (
             <span className="text-sm text-gray-600 italic">Code Private</span>
          )}
          {project.live && (
            <a 
              href={project.live} 
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