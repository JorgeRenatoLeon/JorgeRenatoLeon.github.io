"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import { skillCategories } from "@/data/portfolio";

const categoryColors: Record<string, string> = {
  Languages: "border-indigo-500/30 bg-indigo-50 dark:bg-indigo-950/30",
  Frontend: "border-cyan-500/30 bg-cyan-50 dark:bg-cyan-950/30",
  Backend: "border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/30",
  Databases: "border-amber-500/30 bg-amber-50 dark:bg-amber-950/30",
  "Cloud & DevOps": "border-purple-500/30 bg-purple-50 dark:bg-purple-950/30",
  "Semantic Web": "border-rose-500/30 bg-rose-50 dark:bg-rose-950/30",
  Testing: "border-teal-500/30 bg-teal-50 dark:bg-teal-950/30",
  Tools: "border-slate-500/30 bg-slate-50 dark:bg-slate-800/30",
};

const skillPillColors: Record<string, string> = {
  Languages:
    "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300",
  Frontend:
    "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300",
  Backend:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
  Databases:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
  "Cloud & DevOps":
    "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
  "Semantic Web":
    "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300",
  Testing:
    "bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300",
  Tools:
    "bg-slate-100 text-slate-700 dark:bg-slate-700/50 dark:text-slate-300",
};

export default function Skills() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="skills"
      className="relative bg-slate-100/50 py-20 dark:bg-slate-900/50 sm:py-28"
    >
      <div className="section-container">
        <SectionHeading
          title="Skills & Technologies"
          subtitle="The tools and technologies I work with"
        />

        <div
          ref={ref}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={
                isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className={`hover-lift rounded-xl border p-5 ${
                categoryColors[category.name] || "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
              }`}
            >
              <h3 className="mb-3 font-mono text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {category.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-all hover:scale-105 ${
                      skillPillColors[category.name] ||
                      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
