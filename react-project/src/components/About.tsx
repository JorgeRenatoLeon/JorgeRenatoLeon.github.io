"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, GraduationCap, Code2, TestTube2 } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { personalInfo } from "@/data/portfolio";

const highlightIcons = [Code2, GraduationCap, TestTube2, MapPin];

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="relative py-20 sm:py-28">
      <div className="absolute inset-0 bg-grid" />
      <div className="section-container relative">
        <SectionHeading
          title="About Me"
          subtitle="A bit about who I am and what I do"
        />

        <div ref={ref} className="grid gap-12 lg:grid-cols-5 lg:gap-16">
          {/* Bio text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            <div className="space-y-4 text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg">
              <p>{personalInfo.bio}</p>
              <p>
                When I&apos;m not coding, you can find me exploring new technologies,
                contributing to open-source projects, or sharing knowledge with
                the developer community. I believe in writing clean, well-tested
                code that makes a real impact.
              </p>
            </div>

            {/* Location badge */}
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
              <MapPin size={14} className="text-indigo-500" />
              {personalInfo.location}
            </div>
          </motion.div>

          {/* Highlights grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="grid grid-cols-2 gap-4">
              {personalInfo.highlights.map((highlight, index) => {
                const Icon = highlightIcons[index % highlightIcons.length];
                return (
                  <motion.div
                    key={highlight.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={
                      isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                    }
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="glass-card hover-lift rounded-xl p-4 text-center"
                  >
                    <Icon
                      size={20}
                      className="mx-auto mb-2 text-indigo-500"
                    />
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {highlight.value}
                    </div>
                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {highlight.label}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
