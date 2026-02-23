"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Briefcase, GraduationCap, Building2 } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { experiences } from "@/data/portfolio";

const typeIcons = {
  work: Briefcase,
  academic: GraduationCap,
  internship: Building2,
};

const typeColors = {
  work: "bg-indigo-500",
  academic: "bg-amber-500",
  internship: "bg-teal-500",
};

export default function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="experience"
      className="relative bg-slate-100/50 py-20 dark:bg-slate-900/50 sm:py-28"
    >
      <div className="section-container">
        <SectionHeading
          title="Experience"
          subtitle="My professional journey"
        />

        <div ref={ref} className="relative mx-auto max-w-3xl">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 h-full w-px bg-slate-200 dark:bg-slate-800 sm:left-1/2 sm:-translate-x-px" />

          {experiences.map((exp, index) => {
            const Icon = typeIcons[exp.type];
            const dotColor = typeColors[exp.type];
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={`${exp.company}-${exp.title}`}
                initial={{ opacity: 0, y: 30 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                }
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className={`relative mb-10 pl-12 sm:mb-12 sm:w-1/2 sm:pl-0 ${
                  isEven
                    ? "sm:mr-auto sm:pr-12 sm:text-right"
                    : "sm:ml-auto sm:pl-12 sm:text-left"
                }`}
              >
                {/* Timeline dot */}
                <div
                  className={`absolute left-2.5 top-1 flex h-3 w-3 items-center justify-center rounded-full ${dotColor} ring-4 ring-slate-50 dark:ring-slate-950 sm:left-auto ${
                    isEven ? "sm:-right-1.5" : "sm:-left-1.5"
                  }`}
                />

                {/* Card */}
                <div className="glass-card hover-lift rounded-xl p-5 sm:p-6">
                  <div
                    className={`mb-3 flex items-center gap-2 ${
                      isEven ? "sm:flex-row-reverse" : ""
                    }`}
                  >
                    <Icon size={16} className="shrink-0 text-indigo-500" />
                    <span className="font-mono text-xs tracking-wider text-indigo-500 dark:text-indigo-400">
                      {exp.period}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {exp.title}
                  </h3>
                  <p className="mb-3 text-sm font-medium text-slate-500 dark:text-slate-400">
                    {exp.company}
                  </p>
                  <p className="mb-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {exp.description}
                  </p>

                  {/* Tech tags */}
                  <div
                    className={`flex flex-wrap gap-1.5 ${
                      isEven ? "sm:justify-end" : ""
                    }`}
                  >
                    {exp.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
