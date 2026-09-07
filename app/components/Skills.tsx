"use client";
import { useReducedMotion, motion, Variants } from "motion/react";
import { resolveIcon } from "@/app/lib/resolveIcon";
import { useProfile } from "../hooks/useProfile";
import { FiCpu } from "react-icons/fi";

export default function Skills() {
  const { profile, loading } = useProfile();
  const categories = profile?.skill_categories ?? [];
  const shouldReduceMotion = useReducedMotion();

  if (loading) return <section className="min-h-[85vh] w-full"></section>;

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
          <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-black tracking-tight text-center mb-4 text-white">
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
                className={`card-dark ${colSpan} flex flex-col justify-between p-6 rounded-3xl`}
              >
                {/* Tech badges */}
                <div className="mb-6 flex flex-wrap gap-2">
                  {(cat.skills ?? []).map((skill, idx) => (
                    <div
                      key={idx}
                      className="tag-pill flex items-center gap-2"
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
                  <h3 className="text-[clamp(1.125rem,2.5vw,1.25rem)] font-bold tracking-tight text-white mb-2 flex items-center gap-3">
                    <span className="text-accent-light" aria-hidden="true">{categoryIcon}</span>
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