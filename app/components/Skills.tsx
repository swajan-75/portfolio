"use client";
import { motion } from "motion/react";
import { 
  SiReact, SiNextdotjs, SiTailwindcss, SiHtml5, SiCss3, 
  SiNodedotjs, SiExpress, SiFirebase, SiMongodb, 
  SiKotlin, SiAndroid, SiPython, SiTensorflow, 
  SiJavascript, SiTypescript, SiGit,
  SiGo,
  SiNestjs,
  SiDotnet,
  SiPostgresql,
  SiMysql
} from "react-icons/si";
import { FaDatabase, FaMobileAlt, FaBrain, FaCode } from "react-icons/fa";
import { FiDatabase } from "react-icons/fi";

// 1. We organize data into "Cards" rather than simple lists
const features = [
  {
    title: "Front-End Development",
    description: "Building engaging and user-friendly web interfaces using modern frameworks.",
    className: "md:col-span-2", // This makes the card wider like in the image
    icon: <FaCode className="text-blue-400" />, 
    tech: [
      { name: "React", icon: <SiReact /> },
      { name: "Next.js", icon: <SiNextdotjs /> },
      { name: "Tailwind", icon: <SiTailwindcss /> },
      { name: "HTML", icon: <SiHtml5 /> },
      { name: "CSS", icon: <SiCss3 /> },
      { name: "JS", icon: <SiJavascript /> },
      { name: "TS", icon: <SiTypescript /> },
    ],
  },
  {
    title: "Back-End & Database",
    description: "Developing robust server-side logic and managing efficient data storage.",
    className: "md:col-span-1",
    icon: <FaDatabase className="text-green-400" />,
    tech: [
      { name: "Go", icon: <SiGo /> },           // Core skill from resume
  { name: "NestJS", icon: <SiNestjs /> },   // Primary framework from resume
  { name: ".NET Core", icon: <SiDotnet /> }, // Listed in frameworks
  { name: "Node.js", icon: <SiNodedotjs /> }, // Underlying runtime
    ],
  },
  {
    title: "Mobile App Development",
    description: "Creating cross-platform and native mobile apps with sleek designs.",
    className: "md:col-span-1",
    icon: <FaMobileAlt className="text-purple-400" />,
    tech: [
      { name: "Kotlin", icon: <SiKotlin /> },
      { name: "Android", icon: <SiAndroid /> },
      { name: "Room DB", icon: <FaDatabase /> }, // Generic DB icon for Room
    ],
  },
  {
    title: "Database Architecture",
  description: "Architecting reliable, scalable storage solutions across SQL and NoSQL environments.",
  className: "md:col-span-2",
  icon: <FiDatabase className="text-emerald-400" />, 
  tech: [
    { name: "PostgreSQL", icon: <SiPostgresql /> },
    { name: "MySQL", icon: <SiMysql /> },
    { name: "Firebase", icon: <SiFirebase /> },
  ],
  },
  {
    title: "AI & Data Science",
    description: "Leveraging machine learning algorithms to derive insights from data.",
    className: "md:col-span-2",
    icon: <FaBrain className="text-pink-400" />,
    tech: [
      { name: "Python", icon: <SiPython /> },
      { name: "ML", icon: <FaBrain /> },
      { name: "TensorFlow", icon: <SiTensorflow /> },
    ],
  },
];

export default function Skills() {
  return (
    <section className="min-h-screen bg-black text-white py-20 px-4 flex items-center justify-center">
      <div className="max-w-6xl w-full">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-center mb-16"
        >
          My Skills
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`
                ${item.className || ""} 
                relative overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/50 p-8 
                backdrop-blur-sm hover:border-white/20 transition-colors group
              `}
            >
              {/* Subtle Gradient Glow effect */}
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-purple-500/10 blur-3xl group-hover:bg-purple-500/20 transition-all duration-500" />

              {/* Top Section: Icons */}
              <div className="mb-6 flex flex-wrap gap-3">
                {item.tech.map((tech, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-center h-12 w-12 rounded-xl bg-white/5 border border-white/5 text-2xl text-gray-300 hover:bg-white/10 hover:scale-110 transition-all duration-300"
                    title={tech.name}
                  >
                    {tech.icon}
                  </div>
                ))}
              </div>

              {/* Bottom Section: Text */}
              <div className="relative z-10">
                <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}