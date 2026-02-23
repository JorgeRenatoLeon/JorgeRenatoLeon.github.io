"use client";

import { useRef, useState, useEffect, useCallback, useMemo } from "react";
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
  Database,
  Globe,
  Compass,
  MapPin,
  GraduationCap,
  QrCode,
  Shield,
  ShieldCheck,
  Vote,
  Lock,
  Calendar,
  BookOpen,
  Clock,
  type LucideIcon,
} from "lucide-react";
import { projects, type Project } from "@/data/portfolio";

/* ================================================================== */
/*  CONSTANTS & TYPES                                                 */
/* ================================================================== */

/** Diamond accent colors — one per project */
const gemAccents = [
  { glow: "rgba(99,102,241,0.35)", edge: "#818cf8", fill: "rgba(99,102,241,0.15)", fillSolid: "rgba(99,102,241,0.25)" },
  { glow: "rgba(6,182,212,0.35)", edge: "#22d3ee", fill: "rgba(6,182,212,0.15)", fillSolid: "rgba(6,182,212,0.25)" },
  { glow: "rgba(245,158,11,0.30)", edge: "#fbbf24", fill: "rgba(245,158,11,0.12)", fillSolid: "rgba(245,158,11,0.22)" },
  { glow: "rgba(16,185,129,0.35)", edge: "#34d399", fill: "rgba(16,185,129,0.15)", fillSolid: "rgba(16,185,129,0.25)" },
  { glow: "rgba(244,114,182,0.35)", edge: "#f472b6", fill: "rgba(244,114,182,0.15)", fillSolid: "rgba(244,114,182,0.25)" },
];

/** Gradient fallbacks */
const gradients = [
  "linear-gradient(135deg, #4338ca 0%, #7c3aed 50%, #06b6d4 100%)",
  "linear-gradient(135deg, #0e7490 0%, #4338ca 50%, #a78bfa 100%)",
  "linear-gradient(135deg, #b45309 0%, #dc2626 50%, #fbbf24 100%)",
  "linear-gradient(135deg, #047857 0%, #0e7490 50%, #34d399 100%)",
  "linear-gradient(135deg, #be185d 0%, #7c3aed 50%, #f472b6 100%)",
];

/* ================================================================== */
/*  GEM GEOMETRY — Diamond-cut facet generation                       */
/* ================================================================== */

interface FaceDescriptor {
  type: "table" | "crown" | "pavilion";
  /** CSS transform to position/orient this face in 3D space */
  transform: string;
  /** CSS clip-path to shape this face div (trapezoid, triangle, octagon) */
  clipPath: string;
  /** Face div width in px */
  width: number;
  /** Face div height in px */
  height: number;
  /** Whether this face should show the project screenshot */
  showImage: boolean;
  /** Unique key */
  key: string;
}

const NUM_SIDES = 8;
const DEG = Math.PI / 180;

/**
 * Generate the 17-face diamond-cut gem geometry.
 * - 1 octagonal table (top)
 * - 8 trapezoidal crown faces (table → girdle)
 * - 8 triangular pavilion faces (girdle → culet)
 */
function generateGemFaces(
  girdleRadius: number,
  tableRadius: number,
  crownHeight: number,
  pavilionHeight: number
): FaceDescriptor[] {
  const faces: FaceDescriptor[] = [];
  const angleStep = (2 * Math.PI) / NUM_SIDES;

  /* ---- TABLE (octagonal top face) ---- */
  const tablePoints: string[] = [];
  for (let i = 0; i < NUM_SIDES; i++) {
    const a = angleStep * i - Math.PI / 2;
    const px = 50 + (50 * Math.cos(a));
    const py = 50 + (50 * Math.sin(a));
    tablePoints.push(`${px.toFixed(2)}% ${py.toFixed(2)}%`);
  }
  faces.push({
    type: "table",
    transform: `translate3d(0px, ${-crownHeight}px, 0px) rotateX(90deg)`,
    clipPath: `polygon(${tablePoints.join(", ")})`,
    width: tableRadius * 2,
    height: tableRadius * 2,
    showImage: true,
    key: "table",
  });

  /* ---- CROWN FACES (8 trapezoids from table down to girdle) ---- */
  for (let i = 0; i < NUM_SIDES; i++) {
    const angle = angleStep * i;
    const midAngle = angle + angleStep / 2;

    // Face normal direction
    const nx = Math.cos(midAngle);
    const nz = Math.sin(midAngle);

    // Crown face tilts outward — compute tilt angle
    const crownTilt = Math.atan2(girdleRadius - tableRadius, crownHeight);
    const faceRotY = (midAngle * 180) / Math.PI;

    // Width of each face at girdle level
    const girdleChord = 2 * girdleRadius * Math.sin(angleStep / 2);
    const tableChord = 2 * tableRadius * Math.sin(angleStep / 2);

    // Face height (slant)
    const slantH = Math.sqrt(
      crownHeight * crownHeight +
        (girdleRadius - tableRadius) * (girdleRadius - tableRadius)
    );

    // Trapezoid: top edge = tableChord, bottom edge = girdleChord
    const topInset = ((girdleChord - tableChord) / (2 * girdleChord)) * 100;
    const clipPath = `polygon(${topInset.toFixed(1)}% 0%, ${(100 - topInset).toFixed(1)}% 0%, 100% 100%, 0% 100%)`;

    // Distance from center to face center
    const avgR = (girdleRadius + tableRadius) / 2;

    faces.push({
      type: "crown",
      transform: [
        `rotateY(${faceRotY.toFixed(2)}deg)`,
        `translateZ(${avgR.toFixed(1)}px)`,
        `rotateX(${(-(90 - (crownTilt * 180) / Math.PI)).toFixed(2)}deg)`,
      ].join(" "),
      clipPath,
      width: girdleChord,
      height: slantH,
      showImage: true,
      key: `crown-${i}`,
    });
  }

  /* ---- PAVILION FACES (8 triangles from girdle down to culet) ---- */
  for (let i = 0; i < NUM_SIDES; i++) {
    const angle = angleStep * i;
    const midAngle = angle + angleStep / 2;

    const pavilionTilt = Math.atan2(girdleRadius, pavilionHeight);
    const faceRotY = (midAngle * 180) / Math.PI;

    const girdleChord = 2 * girdleRadius * Math.sin(angleStep / 2);
    const slantH = Math.sqrt(
      pavilionHeight * pavilionHeight + girdleRadius * girdleRadius
    );

    // Triangle: full width at top, converging to point at bottom
    const clipPath = "polygon(0% 0%, 100% 0%, 50% 100%)";

    const avgR = girdleRadius / 2;

    faces.push({
      type: "pavilion",
      transform: [
        `rotateY(${faceRotY.toFixed(2)}deg)`,
        `translateZ(${avgR.toFixed(1)}px)`,
        `rotateX(${((90 - (pavilionTilt * 180) / Math.PI)).toFixed(2)}deg)`,
      ].join(" "),
      clipPath,
      width: girdleChord,
      height: slantH,
      showImage: false,
      key: `pav-${i}`,
    });
  }

  return faces;
}

/* ================================================================== */
/*  ORBIT CONFIG — per-project orbiting 3D objects                    */
/* ================================================================== */

interface OrbitItem {
  shape: "cube" | "tetrahedron" | "octahedron";
  Icon: LucideIcon;
  orbitRadius: number;
  orbitDuration: number;
  orbitTilt: number;
  startAngle: number;
  size: number;
}

const projectOrbits: OrbitItem[][] = [
  /* DPP Interoperability */
  [
    { shape: "cube", Icon: Database, orbitRadius: 200, orbitDuration: 14, orbitTilt: 15, startAngle: 0, size: 34 },
    { shape: "tetrahedron", Icon: Globe, orbitRadius: 240, orbitDuration: 18, orbitTilt: -20, startAngle: 120, size: 28 },
    { shape: "octahedron", Icon: Shield, orbitRadius: 180, orbitDuration: 22, orbitTilt: 10, startAngle: 240, size: 26 },
  ],
  /* TravelApp */
  [
    { shape: "octahedron", Icon: Compass, orbitRadius: 210, orbitDuration: 15, orbitTilt: -15, startAngle: 30, size: 32 },
    { shape: "cube", Icon: MapPin, orbitRadius: 250, orbitDuration: 20, orbitTilt: 20, startAngle: 150, size: 28 },
    { shape: "tetrahedron", Icon: Globe, orbitRadius: 185, orbitDuration: 17, orbitTilt: -10, startAngle: 270, size: 26 },
  ],
  /* PUCP-IN */
  [
    { shape: "cube", Icon: GraduationCap, orbitRadius: 195, orbitDuration: 16, orbitTilt: 12, startAngle: 60, size: 32 },
    { shape: "octahedron", Icon: QrCode, orbitRadius: 235, orbitDuration: 19, orbitTilt: -18, startAngle: 180, size: 28 },
    { shape: "tetrahedron", Icon: Shield, orbitRadius: 175, orbitDuration: 23, orbitTilt: 8, startAngle: 300, size: 26 },
  ],
  /* Digital Voting */
  [
    { shape: "octahedron", Icon: ShieldCheck, orbitRadius: 205, orbitDuration: 14, orbitTilt: -14, startAngle: 45, size: 34 },
    { shape: "cube", Icon: Vote, orbitRadius: 245, orbitDuration: 18, orbitTilt: 22, startAngle: 165, size: 28 },
    { shape: "tetrahedron", Icon: Lock, orbitRadius: 190, orbitDuration: 21, orbitTilt: -8, startAngle: 285, size: 26 },
  ],
  /* Assistance */
  [
    { shape: "cube", Icon: Calendar, orbitRadius: 200, orbitDuration: 15, orbitTilt: 16, startAngle: 20, size: 32 },
    { shape: "octahedron", Icon: BookOpen, orbitRadius: 240, orbitDuration: 19, orbitTilt: -20, startAngle: 140, size: 28 },
    { shape: "tetrahedron", Icon: Clock, orbitRadius: 180, orbitDuration: 22, orbitTilt: 10, startAngle: 260, size: 26 },
  ],
];

/* ================================================================== */
/*  SMALL 3D SHAPE COMPONENTS                                        */
/* ================================================================== */

/** 3D Cube — 6 faces */
function Cube3D({
  size,
  Icon,
  accent,
}: Readonly<{ size: number; Icon: LucideIcon; accent: typeof gemAccents[0] }>) {
  const half = size / 2;
  const faceStyle = (transform: string): React.CSSProperties => ({
    position: "absolute",
    width: size,
    height: size,
    transform,
    backfaceVisibility: "hidden",
    background: accent.fillSolid,
    border: `1px solid ${accent.edge}66`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  });
  const iconSize = size * 0.5;

  return (
    <div
      style={{
        width: size,
        height: size,
        position: "relative",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Front */}
      <div style={faceStyle(`translateZ(${half}px)`)}>
        <Icon size={iconSize} color={accent.edge} strokeWidth={1.5} />
      </div>
      {/* Back */}
      <div style={faceStyle(`rotateY(180deg) translateZ(${half}px)`)} />
      {/* Right */}
      <div style={faceStyle(`rotateY(90deg) translateZ(${half}px)`)} />
      {/* Left */}
      <div style={faceStyle(`rotateY(-90deg) translateZ(${half}px)`)} />
      {/* Top */}
      <div style={faceStyle(`rotateX(90deg) translateZ(${half}px)`)} />
      {/* Bottom */}
      <div style={faceStyle(`rotateX(-90deg) translateZ(${half}px)`)} />
    </div>
  );
}

/** 3D Tetrahedron — 4 triangular faces */
function Tetrahedron3D({
  size,
  Icon,
  accent,
}: Readonly<{ size: number; Icon: LucideIcon; accent: typeof gemAccents[0] }>) {
  const h = size * 0.816; // height of regular tetrahedron relative to edge
  const iconSize = size * 0.35;

  const triangleFace = (
    rotY: number,
    rotX: number,
    tz: number,
    showIcon: boolean
  ): React.ReactNode => (
    <div
      key={`${rotY}-${rotX}`}
      style={{
        position: "absolute",
        width: size,
        height: h,
        transform: `rotateY(${rotY}deg) rotateX(${rotX}deg) translateZ(${tz}px)`,
        clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
        background: accent.fillSolid,
        border: `1px solid ${accent.edge}66`,
        backfaceVisibility: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: h * 0.3,
      }}
    >
      {showIcon && (
        <Icon size={iconSize} color={accent.edge} strokeWidth={1.5} />
      )}
    </div>
  );

  const inR = size / (2 * Math.sqrt(3));

  return (
    <div
      style={{
        width: size,
        height: h,
        position: "relative",
        transformStyle: "preserve-3d",
      }}
    >
      {triangleFace(0, -19.47, inR, true)}
      {triangleFace(120, -19.47, inR, false)}
      {triangleFace(240, -19.47, inR, false)}
      {/* Bottom face */}
      <div
        style={{
          position: "absolute",
          width: size,
          height: size,
          transform: `rotateX(90deg) translateZ(${h * 0.75}px)`,
          clipPath: "polygon(50% 0%, 0% 87%, 100% 87%)",
          background: accent.fill,
          backfaceVisibility: "hidden",
        }}
      />
    </div>
  );
}

/** 3D Octahedron — 8 triangular faces (top 4 + bottom 4) */
function Octahedron3D({
  size,
  Icon,
  accent,
}: Readonly<{ size: number; Icon: LucideIcon; accent: typeof gemAccents[0] }>) {
  const half = size / 2;
  const iconSize = size * 0.35;
  const faceH = size * 0.707; // ~half * sqrt(2)

  const face = (
    rotY: number,
    rotX: number,
    showIcon: boolean
  ): React.ReactNode => (
    <div
      key={`${rotY}-${rotX}-oct`}
      style={{
        position: "absolute",
        width: size,
        height: faceH,
        transform: `rotateY(${rotY}deg) rotateX(${rotX}deg) translateZ(${half * 0.5}px)`,
        clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
        background: accent.fillSolid,
        border: `1px solid ${accent.edge}66`,
        backfaceVisibility: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: faceH * 0.25,
      }}
    >
      {showIcon && (
        <Icon size={iconSize} color={accent.edge} strokeWidth={1.5} />
      )}
    </div>
  );

  return (
    <div
      style={{
        width: size,
        height: size,
        position: "relative",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Top 4 upper triangles */}
      {face(0, -35.26, true)}
      {face(90, -35.26, false)}
      {face(180, -35.26, false)}
      {face(270, -35.26, false)}
      {/* Bottom 4 inverted triangles */}
      {face(45, 35.26 + 180, false)}
      {face(135, 35.26 + 180, false)}
      {face(225, 35.26 + 180, false)}
      {face(315, 35.26 + 180, false)}
    </div>
  );
}

/** Render a 3D shape by type */
function Shape3D({
  shape,
  size,
  Icon,
  accent,
}: Readonly<{
  shape: OrbitItem["shape"];
  size: number;
  Icon: LucideIcon;
  accent: typeof gemAccents[0];
}>) {
  switch (shape) {
    case "cube":
      return <Cube3D size={size} Icon={Icon} accent={accent} />;
    case "tetrahedron":
      return <Tetrahedron3D size={size} Icon={Icon} accent={accent} />;
    case "octahedron":
      return <Octahedron3D size={size} Icon={Icon} accent={accent} />;
  }
}

/* ================================================================== */
/*  ORBIT SYSTEM — orbiting 3D objects around the gem                 */
/* ================================================================== */
function OrbitSystem({
  projectIndex,
  isActive,
}: Readonly<{ projectIndex: number; isActive: boolean }>) {
  const orbits = projectOrbits[projectIndex % projectOrbits.length];
  const accent = gemAccents[projectIndex % gemAccents.length];

  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{ transformStyle: "preserve-3d" }}
    >
      {orbits.map((item, i) => (
        <motion.div
          key={`orbit-${projectIndex}-${i}`}
          className="absolute left-1/2 top-1/2"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateX(${item.orbitTilt}deg) rotateZ(${item.startAngle}deg)`,
          }}
          animate={
            isActive
              ? { rotateY: [0, 360] }
              : { rotateY: 0 }
          }
          transition={
            isActive
              ? {
                  rotateY: {
                    duration: item.orbitDuration,
                    repeat: Infinity,
                    ease: "linear",
                  },
                }
              : { duration: 0.5 }
          }
        >
          {/* Orbit child — offset + counter-rotate to face viewer */}
          <motion.div
            style={{
              position: "absolute",
              transformStyle: "preserve-3d",
              transform: `translateX(${item.orbitRadius}px) translateY(-${item.size / 2}px)`,
            }}
          >
            {/* Self-rotation for the small shape */}
            <motion.div
              animate={
                isActive
                  ? { rotateY: [360, 0], rotateX: [0, 180, 360] }
                  : {}
              }
              transition={{
                duration: item.orbitDuration * 0.7,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <Shape3D
                shape={item.shape}
                size={item.size}
                Icon={item.Icon}
                accent={accent}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}

/* ================================================================== */
/*  DIAMOND GEM — 3D diamond-cut gemstone with project image          */
/* ================================================================== */

// Responsive sizing hook
function useGemSize() {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 480) setScale(0.5);
      else if (w < 640) setScale(0.6);
      else if (w < 768) setScale(0.75);
      else if (w < 1024) setScale(0.85);
      else setScale(1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return scale;
}

function DiamondGem({
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
  const scale = useGemSize();

  const springCfg = { stiffness: 120, damping: 18, mass: 0.6 };
  const mouseTiltX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [15, -15]),
    springCfg
  );
  const mouseTiltY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-18, 18]),
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

  const accent = gemAccents[index % gemAccents.length];
  const gradient = gradients[index % gradients.length];

  // Generate faces once
  const faces = useMemo(
    () => generateGemFaces(130, 80, 60, 110),
    []
  );

  // Total gem height = crownHeight + pavilionHeight = 170
  const totalH = 170;
  const girdleW = 260; // 2 * girdleRadius

  return (
    <motion.div
      ref={containerRef}
      className="relative cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1200,
        width: girdleW * scale,
        height: totalH * scale * 1.3,
      }}
    >
      {/* Glow behind gem */}
      <motion.div
        className="absolute inset-0 blur-3xl"
        style={{
          background: accent.glow,
          borderRadius: "50%",
          transform: "scale(1.8)",
        }}
        animate={{ opacity: isActive ? 0.5 : 0 }}
        transition={{ duration: 0.7 }}
      />

      {/* 3D gem wrapper — auto-rotates + mouse tilt */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transformStyle: "preserve-3d",
          rotateX: isActive ? mouseTiltX : 0,
          rotateY: isActive ? mouseTiltY : 0,
        }}
      >
        <motion.div
          style={{
            transformStyle: "preserve-3d",
            transform: `scale(${scale})`,
          }}
          animate={
            isActive
              ? { rotateY: [0, 360] }
              : { rotateY: 0, scale: 0.85, opacity: 0.3 }
          }
          transition={
            isActive
              ? {
                  rotateY: {
                    duration: 16,
                    repeat: Infinity,
                    ease: "linear",
                  },
                  scale: { duration: 0.7 },
                  opacity: { duration: 0.7 },
                }
              : { duration: 0.7 }
          }
        >
          {/* Render all 17 gem faces */}
          {faces.map((face) => (
            <div
              key={face.key}
              style={{
                position: "absolute",
                width: face.width,
                height: face.height,
                transform: face.transform,
                clipPath: face.clipPath,
                backfaceVisibility: "hidden",
                overflow: "hidden",
                transformOrigin: "center center",
                left: "50%",
                top: "50%",
                marginLeft: -face.width / 2,
                marginTop: -face.height / 2,
              }}
            >
              {/* Background: image or color */}
              {face.showImage && project.image ? (
                <>
                  <img
                    src={project.image}
                    alt=""
                    className="h-full w-full object-cover object-center"
                    style={{ opacity: 0.92 }}
                    draggable={false}
                  />
                  {/* Light refraction overlay */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        face.type === "table"
                          ? "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)"
                          : "linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, transparent 40%, rgba(0,0,0,0.15) 100%)",
                    }}
                  />
                </>
              ) : face.showImage ? (
                <div
                  className="flex h-full w-full items-center justify-center"
                  style={{ background: gradient }}
                >
                  {face.type === "table" && (
                    <span className="font-display text-2xl font-light text-white/20">
                      {project.title
                        .split(" ")
                        .map((w) => w[0])
                        .join("")}
                    </span>
                  )}
                </div>
              ) : (
                /* Pavilion face — translucent colored panel */
                <div
                  className="h-full w-full"
                  style={{
                    background: `linear-gradient(to bottom, ${accent.fillSolid}, ${accent.fill})`,
                    border: `1px solid ${accent.edge}33`,
                  }}
                />
              )}

              {/* Facet edge highlight */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  boxShadow: `inset 0 0 0 0.5px ${accent.edge}22`,
                }}
              />
            </div>
          ))}

          {/* Girdle ring — subtle edge at midpoint */}
          <div
            style={{
              position: "absolute",
              width: girdleW,
              height: girdleW,
              borderRadius: "50%",
              border: `1px solid ${accent.edge}33`,
              transform: "rotateX(90deg)",
              left: "50%",
              top: "50%",
              marginLeft: -girdleW / 2,
              marginTop: -girdleW / 2,
              pointerEvents: "none",
            }}
          />
        </motion.div>
      </motion.div>

      {/* Orbiting 3D objects */}
      {isActive && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transformStyle: "preserve-3d",
            perspective: 1200,
          }}
        >
          <OrbitSystem projectIndex={index} isActive={isActive} />
        </div>
      )}
    </motion.div>
  );
}

/* ================================================================== */
/*  LANDSCAPE BACKGROUND                                              */
/* ================================================================== */
function Landscape() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f1a] via-[#161625] to-[#1a1a2e]" />
      <div
        className="absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(99,102,241,0.15) 0%, transparent 70%)",
        }}
      />
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
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}

/* ================================================================== */
/*  FLOATING GEO DECORATIONS                                         */
/* ================================================================== */
function FloatingGeo({ index }: Readonly<{ index: number }>) {
  const shapes = [
    <div
      key="a"
      className="h-16 w-12 sm:h-20 sm:w-16"
      style={{
        clipPath:
          "polygon(15% 0%, 85% 0%, 100% 22%, 100% 78%, 85% 100%, 15% 100%, 0% 78%, 0% 22%)",
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    />,
    <div
      key="b"
      className="h-10 w-10 rotate-45 sm:h-14 sm:w-14"
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    />,
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

/* ================================================================== */
/*  PROJECT OVERLAY (full-screen modal)                               */
/* ================================================================== */
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

/* ================================================================== */
/*  PROJECT SLIDE — one project at a time                             */
/* ================================================================== */
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
      className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-4 sm:flex-row sm:gap-10 lg:gap-16"
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

      {/* Diamond gem with orbiting objects */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        <DiamondGem project={project} index={index} isActive={true} />
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

/* ================================================================== */
/*  MAIN PROJECTS SECTION                                             */
/* ================================================================== */
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
      <Landscape />

      {isInView &&
        [0, 1, 2, 3, 4].map((i) => <FloatingGeo key={i} index={i} />)}

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

      <div className="pointer-events-none absolute left-4 right-4 top-1/2 z-20 flex -translate-y-1/2 justify-between sm:left-6 sm:right-6">
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

      <motion.div
        className="absolute bottom-6 right-4 z-20 font-mono text-xs text-white/30 sm:bottom-8 sm:right-8"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.8 }}
      >
        {String(activeIndex + 1).padStart(2, "0")} /{" "}
        {String(projects.length).padStart(2, "0")}
      </motion.div>

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
