"use client";
import { useEffect, useState } from "react";
import { motion, useReducedMotion, Variants } from "motion/react";
import api from "@/lib/axios";
import { resolveIcon } from "@/app/lib/resolveIcon";
import { FiCpu } from "react-icons/fi";

interface SkillItem {
  name: string;
  icon: string;
}

interface SkillCategory {
  title: string;
  description: string;
  icon: string;
  col_span: number;
  skills: SkillItem[];
}

const GLOWS = [
  "bg-blue-500/10 group-hover:bg-blue-500/20",
  "bg-green-500/10 group-hover:bg-green-500/20",
  "bg-purple-500/10 group-hover:bg-purple-500/20",
  "bg-emerald-500/10 group-hover:bg-emerald-500/20",
  "bg-pink-500/10 group-hover:bg-pink-500/20",
];

const glass = {
  backdropFilter: 'blur(24px) saturate(180%)',
  WebkitBackdropFilter: 'blur(24px) saturate(180%)',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.12)',
};

export default function Skills() {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    api.get(`/profile?t=${Date.now()}`)
      .then(({ data }) => {
        const cats: SkillCategory[] = data?.skill_categories;
        setCategories(Array.isArray(cats) ? cats : []);
      })
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.08 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: shouldReduceMotion ? 0.3 : 0.5, ease: "easeOut" } }
  };

  return (
    <section className="min-h-[85vh] py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center" id="skills">
      <div className="max-w-7xl w-full p-6 sm:p-10 md:p-12 mx-auto">
        <motion.header
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 sm:mb-20 py-8 px-6 rounded-3xl"
        >
          <h2 className="text-[clamp(2rem,6vw,3rem)] font-bold text-center mb-4 text-white">
            My Skills
          </h2>
          <p className="text-white/80 font-medium text-base sm:text-lg max-w-2xl mx-auto">
            Tools and technologies I use to build scalable systems.
          </p>
        </motion.header>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12"
        >
          {categories.map((cat, i) => {
            const colSpan =
              cat.col_span === 2
                ? "md:col-span-2"
                : cat.col_span === 3
                ? "md:col-span-3"
                : "md:col-span-1";

            const categoryIcon =
              resolveIcon(cat.icon, { size: 20 }) ?? <FiCpu size={20} />;

            return (
              <motion.article
                key={i}
                variants={itemVariants}
                style={glass}
                className={`${colSpan} flex flex-col justify-between p-6 rounded-3xl`}
              >
                {/* Tech badges */}
                <div className="mb-6 flex flex-wrap gap-2">
                  {(cat.skills ?? []).map((skill, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 transition-colors duration-300 hover:bg-white/10"
                    >
                      <span className="text-xl text-white shrink-0" aria-hidden="true">
                        {resolveIcon(skill.icon) ?? <FiCpu />}
                      </span>
                      <span className="text-sm font-bold whitespace-nowrap text-white">
                        {skill.name}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Title + description */}
                <div className="mt-auto">
                  <h3 className="text-[clamp(1.25rem,3vw,1.5rem)] font-bold text-white mb-2 flex items-center gap-3">
                    <span className="text-sky-300" aria-hidden="true">{categoryIcon}</span>
                    {cat.title}
                  </h3>
                  <p className="text-sm sm:text-base text-white/80 font-medium leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}