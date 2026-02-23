"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  useInView,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ExternalLink,
  Github,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { projects, type Project } from "@/data/portfolio";

/* ------------------------------------------------------------------ */
/*  Crystal shape clip-paths (one per project)                        */
/* ------------------------------------------------------------------ */
const crystalClips = [
  "polygon(8% 0%, 92% 0%, 100% 12%, 100% 88%, 92% 100%, 8% 100%, 0% 88%, 0% 12%)",
  "polygon(15% 0%, 85% 0%, 100% 22%, 100% 78%, 85% 100%, 15% 100%, 0% 78%, 0% 22%)",
  "polygon(5% 5%, 50% 0%, 95% 5%, 100% 50%, 95% 95%, 50% 100%, 5% 95%, 0% 50%)",
  "polygon(12% 0%, 88% 0%, 100% 18%, 100% 82%, 88% 100%, 12% 100%, 0% 82%, 0% 18%)",
  "polygon(10% 0%, 90% 0%, 100% 15%, 100% 85%, 90% 100%, 10% 100%, 0% 85%, 0% 15%)",
];

/* Crystal accent colors for each project */
const crystalAccents = [
  { glow: "rgba(99, 102, 241, 0.4)", edge: "#818cf8" },
  { glow: "rgba(6, 182, 212, 0.4)", edge: "#22d3ee" },
  { glow: "rgba(245, 158, 11, 0.35)", edge: "#fbbf24" },
  { glow: "rgba(16, 185, 129, 0.4)", edge: "#34d399" },
  { glow: "rgba(244, 114, 182, 0.4)", edge: "#f472b6" },
];

/* Gradient fallbacks for projects without images */
const gradients = [
  "linear-gradient(135deg, #4338ca 0%, #7c3aed 50%, #06b6d4 100%)",
  "linear-gradient(135deg, #0e7490 0%, #4338ca 50%, #a78bfa 100%)",
  "linear-gradient(135deg, #b45309 0%, #dc2626 50%, #fbbf24 100%)",
  "linear-gradient(135deg, #047857 0%, #0e7490 50%, #34d399 100%)",
  "linear-gradient(135deg, #be185d 0%, #7c3aed 50%, #f472b6 100%)",
];

/* ------------------------------------------------------------------ */
/*  Floating Geometric Decorations                                    */
/* ------------------------------------------------------------------ */
function FloatingGeo({ index }: { index: number }) {
  const shapes = [
    /* Small crystal */
    <div
      key="a"
      className="h-16 w-12 sm:h-20 sm:w-16"
      style={{
        clipPath: crystalClips[1],
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    />,
    /* Diamond */
    <div
      key="b"
      className="h-10 w-10 rotate-45 sm:h-14 sm:w-14"
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    />,
    /* Sphere */
    <div
      key="c"
      className="h-8 w-8 rounded-full sm:h-12 sm:w-12"
      style={{
        background:
          "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1), rgba(255,255,255,0.02))",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    />,
  ];

  const positions: Record<string, string>[] = [
    { top: "12%", right: "8%" },
    { bottom: "18%", left: "5%" },
    { top: "35%", left: "12%" },
    { bottom: "30%", right: "15%" },
    { top: "20%", left: "25%" },
  ];

  const delays = [0, 1.5, 3, 0.8, 2.2];
  const pos = positions[index % positions.length];

  return (
    <motion.div
      className="pointer-events-none absolute z-0"
      style={pos}
      animate={{
        y: [0, -15, 0, 10, 0],
        rotateZ: [0, 5, 0, -5, 0],
        opacity: [0.4, 0.7, 0.4],
      }}
      transition={{
        duration: 8 + index * 2,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delays[index % delays.length],
      }}
    >
      {shapes[index % shapes.length]}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Wave/Hill Landscape Background                                    */
/* ------------------------------------------------------------------ */
function Landscape() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Main gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f1a] via-[#161625] to-[#1a1a2e]" />

      {/* Subtle radial glow from center */}
      <div
        className="absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(99,102,241,0.15) 0%, transparent 70%)",
        }}
      />

      {/* Undulating hills -- layered SVGs */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        style={{ height: "40%" }}
      >
        <path
          d="M0,160 C240,100 480,220 720,180 C960,140 1200,200 1440,160 L1440,320 L0,320 Z"
          fill="rgba(15,15,26,0.8)"
        />
        <path
          d="M0,200 C300,160 500,240 720,210 C940,180 1140,230 1440,190 L1440,320 L0,320 Z"
          fill="rgba(18,18,32,0.9)"
        />
        <path
          d="M0,240 C360,210 600,270 900,245 C1100,225 1300,260 1440,240 L1440,320 L0,320 Z"
          fill="rgba(22,22,40,1)"
        />
      </svg>

      {/* Noise/grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  3D Crystal Component -- mouse-reactive with parallax              */
/* ------------------------------------------------------------------ */
function Crystal({
  project,
  index,
  isActive,
}: Readonly<{
  project: Project;
  index: number;
  isActive: boolean;
}>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springCfg = { stiffness: 150, damping: 20, mass: 0.5 };
  const rotX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [12, -12]),
    springCfg
  );
  const rotY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-15, 15]),
    springCfg
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
      mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
    },
    [mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const clipPath = crystalClips[index % crystalClips.length];
  const accent = crystalAccents[index % crystalAccents.length];
  const gradient = gradients[index % gradients.length];

  return (
    <motion.div
      ref={containerRef}
      className="relative cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1200 }}
    >
      <motion.div
        className="relative"
        style={{
          rotateX: isActive ? rotX : 0,
          rotateY: isActive ? rotY : 0,
          transformStyle: "preserve-3d",
        }}
        animate={
          isActive
            ? { scale: 1, opacity: 1 }
            : { scale: 0.85, opacity: 0.3 }
        }
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Glow behind crystal */}
        <div
          className="absolute -inset-8 blur-3xl transition-opacity duration-700 sm:-inset-12"
          style={{
            background: accent.glow,
            opacity: isActive ? 0.5 : 0,
            clipPath,
          }}
        />

        {/* Crystal body */}
        <div
          className="relative h-[280px] w-[220px] overflow-hidden sm:h-[380px] sm:w-[320px] md:h-[440px] md:w-[380px] lg:h-[500px] lg:w-[440px]"
          style={{ clipPath }}
        >
          {/* Screenshot or gradient */}
          {project.image ? (
            <img
              src={project.image}
              alt={project.title}
              className="h-full w-full object-cover object-top"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center"
              style={{ background: gradient }}
            >
              <span className="font-display text-[4rem] font-light tracking-tight text-white/20 sm:text-[6rem]">
                {project.title
                  .split(" ")
                  .map((w) => w[0])
                  .join("")}
              </span>
            </div>
          )}

          {/* Facet overlays -- simulated crystal facets */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.2) 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.08) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.15) 100%)",
            }}
          />

          {/* Crystal edge highlight (top-left) */}
          <div
            className="absolute left-0 top-0 h-1/3 w-full opacity-40"
            style={{
              background: `linear-gradient(135deg, ${accent.edge}33 0%, transparent 50%)`,
            }}
          />

          {/* Inner edge line */}
          <div
            className="absolute inset-[3px] sm:inset-[4px]"
            style={{
              clipPath,
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          />
        </div>

        {/* Crystal outer border glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            clipPath,
            boxShadow: `inset 0 0 0 1.5px ${accent.edge}44, 0 0 40px ${accent.glow}`,
          }}
        />
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Project Detail Overlay (full-screen modal)                        */
/* ------------------------------------------------------------------ */
function ProjectOverlay({
  project,
  onClose,
}: Readonly<{
  project: Project;
  onClose: () => void;
}>) {
  const [galleryIndex, setGalleryIndex] = useState(0);
  const gallery = project.gallery ?? (project.image ? [project.image] : []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && gallery.length > 1)
        setGalleryIndex((p) => (p - 1 + gallery.length) % gallery.length);
      if (e.key === "ArrowRight" && gallery.length > 1)
        setGalleryIndex((p) => (p + 1) % gallery.length);
    };
    globalThis.addEventListener("keydown", handler);
    return () => globalThis.removeEventListener("keydown", handler);
  }, [onClose, gallery.length]);

  const idx = projects.indexOf(project);
  const gradient = gradients[idx % gradients.length];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="fixed inset-0 bg-black/85 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
        className="relative z-10 mx-4 my-8 w-full max-w-4xl sm:my-12"
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 60, scale: 0.95 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <button
          onClick={onClose}
          className="absolute -top-2 right-0 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 sm:-right-2 sm:-top-4"
        >
          <X size={20} />
        </button>

        {/* Gallery hero */}
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
              className="flex h-full w-full items-center justify-center"
              style={{ background: gradient }}
            >
              <span className="font-display text-7xl font-light text-white/20 sm:text-8xl">
                {project.title
                  .split(" ")
                  .map((w) => w[0])
                  .join("")}
              </span>
            </div>
          )}

          {gallery.length > 1 && (
            <>
              <button
                onClick={() =>
                  setGalleryIndex(
                    (p) => (p - 1 + gallery.length) % gallery.length
                  )
                }
                className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() =>
                  setGalleryIndex((p) => (p + 1) % gallery.length)
                }
                className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
              >
                <ChevronRight size={18} />
              </button>
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

          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0f0f1a] to-transparent" />

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
        <div className="rounded-b-2xl border border-t-0 border-slate-800 bg-[#161625] p-6 sm:p-8">
          <h3 className="mb-1 font-display text-2xl font-semibold text-white sm:text-3xl">
            {project.title}
          </h3>
          <p className="mb-6 text-base leading-relaxed text-slate-400">
            {project.description}
          </p>
          <p className="mb-6 text-sm leading-relaxed text-slate-500">
            {project.longDescription}
          </p>

          <div className="mb-6 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-indigo-950/60 px-3 py-1 text-xs font-medium text-indigo-400"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-200"
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
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800"
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
/*  Project Slide -- one project at a time                            */
/* ------------------------------------------------------------------ */
function ProjectSlide({
  project,
  index,
  direction,
}: Readonly<{
  project: Project;
  index: number;
  direction: number;
}>) {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-4 sm:flex-row sm:gap-12 lg:gap-20"
      initial={{ opacity: 0, x: direction > 0 ? 300 : -300, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: direction > 0 ? -300 : 300, scale: 0.9 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Large background title */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <motion.span
          className="whitespace-nowrap font-display text-[15vw] font-light leading-none text-white/[0.03] sm:text-[12vw]"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          {project.title}
        </motion.span>
      </div>

      {/* Crystal with screenshot */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        <Crystal project={project} index={index} isActive={true} />
      </motion.div>

      {/* Project info panel */}
      <motion.div
        className="relative z-10 max-w-md text-center sm:text-left"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mb-3 flex items-center justify-center gap-3 text-xs tracking-widest text-white/40 sm:justify-start">
          <span className="font-mono">{project.year}</span>
          <span className="h-px w-6 bg-white/20" />
          <span className="uppercase">{project.category}</span>
        </div>

        <h3 className="mb-4 font-display text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
          {project.title}
        </h3>

        <p className="mb-6 text-sm leading-relaxed text-white/50 sm:text-base">
          {project.description}
        </p>

        <div className="mb-5 flex flex-wrap justify-center gap-1.5 sm:justify-start">
          {project.technologies.slice(0, 5).map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-white/[0.06] px-3 py-1 text-[11px] font-medium text-white/50 backdrop-blur-sm"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 5 && (
            <span className="rounded-full bg-white/[0.06] px-3 py-1 text-[11px] font-medium text-white/40">
              +{project.technologies.length - 5}
            </span>
          )}
        </div>

        <motion.span
          className="inline-flex cursor-pointer items-center gap-2 text-xs font-medium uppercase tracking-widest text-white/60 transition-colors hover:text-white/90"
          whileHover={{ x: 4 }}
        >
          View details
          <ChevronRight size={14} />
        </motion.span>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Projects Section -- Immersive 3D Crystal Gallery             */
/* ------------------------------------------------------------------ */
export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const navigate = useCallback((dir: number) => {
    setDirection(dir);
    setActiveIndex((prev) => {
      const next = prev + dir;
      if (next < 0) return projects.length - 1;
      if (next >= projects.length) return 0;
      return next;
    });
  }, []);

  /* Keyboard navigation */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (selectedProject) return;
      if (e.key === "ArrowLeft") navigate(-1);
      if (e.key === "ArrowRight") navigate(1);
    };
    globalThis.addEventListener("keydown", handler);
    return () => globalThis.removeEventListener("keydown", handler);
  }, [navigate, selectedProject]);

  /* Touch/swipe support */
  const touchStartX = useRef(0);
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);
  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const diff = e.changedTouches[0].clientX - touchStartX.current;
      if (Math.abs(diff) > 60) {
        navigate(diff > 0 ? -1 : 1);
      }
    },
    [navigate]
  );

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="projects-3d-section relative overflow-hidden"
      style={{ height: "100vh", minHeight: "640px", maxHeight: "960px" }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Atmospheric landscape background */}
      <Landscape />

      {/* Floating geometric decorations */}
      {isInView &&
        [0, 1, 2, 3, 4].map((i) => <FloatingGeo key={i} index={i} />)}

      {/* Section label -- top left */}
      <motion.div
        className="absolute left-4 top-6 z-20 sm:left-8 sm:top-8"
        initial={{ opacity: 0, y: -20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <span className="text-xs font-medium uppercase tracking-[0.3em] text-white/30">
          Projects
        </span>
      </motion.div>

      {/* Project carousel */}
      <div
        className="relative z-10 h-full cursor-pointer"
        onClick={() => setSelectedProject(projects[activeIndex])}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <ProjectSlide
            key={activeIndex}
            project={projects[activeIndex]}
            index={activeIndex}
            direction={direction}
          />
        </AnimatePresence>
      </div>

      {/* Navigation arrows */}
      <div className="absolute left-4 right-4 top-1/2 z-20 flex -translate-y-1/2 justify-between pointer-events-none sm:left-6 sm:right-6">
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(-1);
          }}
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.06] text-white/50 backdrop-blur-sm transition-all hover:bg-white/[0.12] hover:text-white sm:h-12 sm:w-12"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(1);
          }}
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.06] text-white/50 backdrop-blur-sm transition-all hover:bg-white/[0.12] hover:text-white sm:h-12 sm:w-12"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Navigation dots -- bottom center */}
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 sm:bottom-8">
        {projects.map((_, i) => (
          <button
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              setDirection(i > activeIndex ? 1 : -1);
              setActiveIndex(i);
            }}
            className="group relative flex h-8 items-center justify-center"
          >
            <div
              className={`rounded-full transition-all duration-500 ${
                i === activeIndex
                  ? "h-1.5 w-8 bg-white/80"
                  : "h-1.5 w-1.5 bg-white/20 group-hover:bg-white/40"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Project counter -- bottom right */}
      <motion.div
        className="absolute bottom-6 right-4 z-20 font-mono text-xs text-white/30 sm:bottom-8 sm:right-8"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.8 }}
      >
        {String(activeIndex + 1).padStart(2, "0")} /{" "}
        {String(projects.length).padStart(2, "0")}
      </motion.div>

      {/* Project detail overlay */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectOverlay
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
