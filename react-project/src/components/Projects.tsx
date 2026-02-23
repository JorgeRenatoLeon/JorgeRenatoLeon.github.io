"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  Github,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { projects, type Project } from "@/data/portfolio";

/* ------------------------------------------------------------------ */
/*  Gradient configs for projects without images                      */
/* ------------------------------------------------------------------ */
const gradients = [
  "from-indigo-600 via-violet-600 to-purple-700",
  "from-cyan-600 via-blue-600 to-indigo-700",
  "from-amber-500 via-orange-600 to-rose-600",
  "from-emerald-500 via-teal-600 to-cyan-700",
  "from-rose-500 via-pink-600 to-purple-700",
];

/* ------------------------------------------------------------------ */
/*  Project Detail Overlay                                            */
/* ------------------------------------------------------------------ */
function ProjectOverlay({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const [galleryIndex, setGalleryIndex] = useState(0);
  const gallery = project.gallery ?? (project.image ? [project.image] : []);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && gallery.length > 1) {
        setGalleryIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
      }
      if (e.key === "ArrowRight" && gallery.length > 1) {
        setGalleryIndex((prev) => (prev + 1) % gallery.length);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, gallery.length]);

  const gradientIdx = projects.indexOf(project) % gradients.length;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Content panel */}
      <motion.div
        className="relative z-10 mx-4 my-8 w-full max-w-4xl sm:my-12"
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-2 right-0 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 sm:-right-2 sm:-top-4"
        >
          <X size={20} />
        </button>

        {/* Hero image / gallery */}
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-2xl">
          {gallery.length > 0 ? (
            <AnimatePresence mode="wait">
              <motion.img
                key={gallery[galleryIndex]}
                src={gallery[galleryIndex]}
                alt={`${project.title} screenshot ${galleryIndex + 1}`}
                className="absolute inset-0 h-full w-full object-cover object-top"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
              />
            </AnimatePresence>
          ) : (
            <div
              className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradients[gradientIdx]}`}
            >
              <span className="text-7xl font-bold text-white/30 sm:text-8xl">
                {project.title
                  .split(" ")
                  .map((w) => w[0])
                  .join("")}
              </span>
            </div>
          )}

          {/* Gallery navigation */}
          {gallery.length > 1 && (
            <>
              <button
                onClick={() =>
                  setGalleryIndex(
                    (prev) => (prev - 1 + gallery.length) % gallery.length
                  )
                }
                className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() =>
                  setGalleryIndex((prev) => (prev + 1) % gallery.length)
                }
                className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
              >
                <ChevronRight size={18} />
              </button>
              {/* Dots */}
              <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
                {gallery.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setGalleryIndex(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === galleryIndex
                        ? "w-6 bg-white"
                        : "w-1.5 bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Gradient overlay at bottom of image */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-900 to-transparent" />

          {/* Title over image */}
          <div className="absolute bottom-4 left-6 right-6 z-10">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm text-white/60">
                {project.year}
              </span>
              <span className="text-xs text-white/40">|</span>
              <span className="text-sm text-white/60">{project.category}</span>
            </div>
          </div>
        </div>

        {/* Details body */}
        <div className="rounded-b-2xl border border-t-0 border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <h3 className="mb-1 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            {project.title}
          </h3>
          <p className="mb-6 text-base leading-relaxed text-slate-600 dark:text-slate-400">
            {project.description}
          </p>

          <p className="mb-6 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            {project.longDescription}
          </p>

          {/* Tech stack */}
          <div className="mb-6 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Action links */}
          <div className="flex flex-wrap items-center gap-3">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
              >
                <Github size={16} />
                View Source
              </a>
            )}
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <ExternalLink size={16} />
                Live Demo
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Project Card                                                      */
/* ------------------------------------------------------------------ */
function ProjectCard({
  project,
  index,
  isInView,
  onClick,
}: {
  project: Project;
  index: number;
  isInView: boolean;
  onClick: () => void;
}) {
  const gradientIdx = index % gradients.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-2xl"
    >
      {/* Image or gradient */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          <div
            className={`h-full w-full bg-gradient-to-br ${gradients[gradientIdx]} transition-all duration-700 ease-out group-hover:scale-110`}
          >
            {/* Decorative elements for projects without images */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[6rem] font-bold leading-none text-white/10 transition-transform duration-700 group-hover:scale-95 sm:text-[8rem]">
                {project.title
                  .split(" ")
                  .map((w) => w[0])
                  .join("")}
              </span>
            </div>
            {/* Floating decorative dots */}
            <div className="absolute left-[15%] top-[20%] h-20 w-20 rounded-full bg-white/5 transition-transform duration-700 group-hover:translate-x-4 group-hover:-translate-y-2" />
            <div className="absolute bottom-[25%] right-[20%] h-14 w-14 rounded-full bg-white/5 transition-transform duration-700 group-hover:-translate-x-3 group-hover:translate-y-2" />
            <div className="absolute bottom-[15%] left-[30%] h-8 w-8 rounded-full bg-white/8 transition-transform duration-700 group-hover:translate-x-2 group-hover:translate-y-3" />
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-90" />

        {/* Reveal line effect (bottom edge) */}
        <div className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 transition-transform duration-500 ease-out group-hover:scale-x-100" />

        {/* Content overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6">
          {/* Year + Category - slides up on hover */}
          <div className="flex items-center gap-2 text-xs text-white/50 transition-all duration-500 group-hover:text-white/80">
            <span className="font-mono">{project.year}</span>
            <span className="text-white/30">--</span>
            <span>{project.category}</span>
          </div>

          {/* Title */}
          <h3 className="mt-1.5 text-xl font-bold text-white transition-transform duration-500 group-hover:translate-x-2 sm:text-2xl">
            {project.title}
          </h3>

          {/* Description - reveals on hover */}
          <p className="mt-2 line-clamp-2 max-h-0 text-sm leading-relaxed text-white/70 opacity-0 transition-all duration-500 group-hover:max-h-20 group-hover:opacity-100">
            {project.description}
          </p>

          {/* View project indicator */}
          <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-white/0 transition-all duration-500 group-hover:text-white/90">
            <span>View project</span>
            <ArrowUpRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </div>
        </div>

        {/* Featured badge */}
        {project.featured && (
          <div className="absolute right-3 top-3 rounded-full bg-amber-500/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
            Featured
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Projects Section                                                  */
/* ------------------------------------------------------------------ */
export default function Projects() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-50px" });
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section id="projects" className="relative py-20 sm:py-28">
      <div className="absolute inset-0 bg-grid" />
      <div className="section-container relative">
        <SectionHeading
          title="Projects"
          subtitle="Things I've built and contributed to"
        />

        {/* Bento grid */}
        <div
          ref={sectionRef}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {/* First featured project - spans 2 cols on large */}
          {projects[0] && (
            <div className="sm:col-span-2">
              <ProjectCard
                project={projects[0]}
                index={0}
                isInView={isInView}
                onClick={() => setSelectedProject(projects[0])}
              />
            </div>
          )}

          {/* Second featured project - single col */}
          {projects[1] && (
            <div className="sm:col-span-1">
              <ProjectCard
                project={projects[1]}
                index={1}
                isInView={isInView}
                onClick={() => setSelectedProject(projects[1])}
              />
            </div>
          )}

          {/* Remaining projects */}
          {projects.slice(2).map((project, i) => (
            <div key={project.title} className="sm:col-span-1">
              <ProjectCard
                project={project}
                index={i + 2}
                isInView={isInView}
                onClick={() => setSelectedProject(project)}
              />
            </div>
          ))}
        </div>

        {/* Project detail overlay */}
        <AnimatePresence>
          {selectedProject && (
            <ProjectOverlay
              project={selectedProject}
              onClose={() => setSelectedProject(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
