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
} from "lucide-react";
import { projects, type Project } from "@/data/portfolio";

/* ================================================================== */
/*  CONSTANTS & TYPES                                                 */
/* ================================================================== */

/** Accent colors — one per project */
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
/*  POLYHEDRON GEOMETRY — Irregular asymmetric rock/crystal faces     */
/* ================================================================== */

interface FaceDescriptor {
  /** CSS transform to position/orient this face in 3D space */
  transform: string;
  /** CSS clip-path to shape this face div */
  clipPath: string;
  /** Face div width in px */
  width: number;
  /** Face div height in px */
  height: number;
  /** Whether this face should show the project screenshot on hover */
  showImage: boolean;
  /** Face index (0-based) for panoramic image slice mapping */
  faceIndex: number;
  /** Gray tone for default (non-hover) state — 0.0 (black) to 1.0 (white) */
  grayTone: number;
  /** Face normal Z component — positive = front-facing = shows image on hover */
  normalZ: number;
  /** Unique key */
  key: string;
}

/**
 * Irregular polyhedron vertex data — hand-crafted asymmetric rock shape.
 * Each face is defined by 3-4 vertex indices + a gray tone.
 * Vertices are in object-space coords (x, y, z) centered at origin.
 */

// 12 vertices forming a chunky, asymmetric rock shape (~280 wide, ~240 tall)
const ROCK_VERTS: [number, number, number][] = [
  /* 0  top peak      */ [  10,  -120,   15],
  /* 1  upper-left    */ [ -95,   -70,   65],
  /* 2  upper-front   */ [  20,   -65,  115],
  /* 3  upper-right   */ [ 110,   -60,   50],
  /* 4  right-front   */ [ 125,    15,   85],
  /* 5  lower-right   */ [ 100,    80,   40],
  /* 6  bottom-right  */ [  55,   115,  -10],
  /* 7  bottom-center */ [ -20,   110,   30],
  /* 8  lower-left    */ [-110,    65,   55],
  /* 9  left-back     */ [-120,   -15,  -40],
  /* 10 back-upper    */ [  -5,   -80,  -85],
  /* 11 back-lower    */ [  30,    50,  -90],
];

/**
 * Face definitions — ALL TRIANGULATED for guaranteed planarity.
 * Non-planar quads/pentagons cause matrix3d alignment errors;
 * triangulating eliminates this by ensuring every face is exactly planar.
 */
const ROCK_FACES: { verts: number[]; gray: number }[] = [
  // Original triangles — kept as-is
  { verts: [0, 1, 2],    gray: 0.32 },  // top-front-left
  { verts: [0, 2, 3],    gray: 0.48 },  // top-front-right
  { verts: [2, 3, 4],    gray: 0.40 },  // front-right
  // Quad [2,4,5,7] -> 2 triangles
  { verts: [2, 4, 5],    gray: 0.28 },  // front-center A
  { verts: [2, 5, 7],    gray: 0.26 },  // front-center B
  // Quad [1,2,7,8] -> 2 triangles
  { verts: [1, 2, 7],    gray: 0.52 },  // front-left A
  { verts: [1, 7, 8],    gray: 0.50 },  // front-left B
  // Original triangle
  { verts: [5, 6, 7],    gray: 0.22 },  // bottom-front
  { verts: [0, 3, 10],   gray: 0.18 },  // top-back-right
  // Quad [3,4,5,11] -> 2 triangles
  { verts: [3, 4, 5],    gray: 0.35 },  // right side A
  { verts: [3, 5, 11],   gray: 0.33 },  // right side B
  // Original triangles
  { verts: [5, 6, 11],   gray: 0.15 },  // bottom-right-back
  // Quad [0,1,9,10] -> 2 triangles
  { verts: [0, 1, 9],    gray: 0.25 },  // top-back-left A
  { verts: [0, 9, 10],   gray: 0.23 },  // top-back-left B
  // Original triangle
  { verts: [1, 8, 9],    gray: 0.38 },  // left-back
  // Pentagon [6,7,8,9,11] -> 3 triangles
  { verts: [6, 7, 8],    gray: 0.20 },  // bottom-back A
  { verts: [6, 8, 9],    gray: 0.19 },  // bottom-back B
  { verts: [6, 9, 11],   gray: 0.21 },  // bottom-back C
  // Original triangle
  { verts: [9, 10, 11],  gray: 0.30 },  // back face
];

type Vec3 = [number, number, number];

function cross(a: Vec3, b: Vec3): Vec3 {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

function sub(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function normalize(v: Vec3): Vec3 {
  const len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  return len === 0 ? [0, 0, 1] : [v[0] / len, v[1] / len, v[2] / len];
}

/**
 * Generate face descriptors for the irregular polyhedron.
 * Each face is projected to 2D, gets a CSS transform that positions it in 3D,
 * and a clip-path that shapes it.
 */
function generatePolyhedronFaces(): FaceDescriptor[] {
  const faces: FaceDescriptor[] = [];

  ROCK_FACES.forEach((faceDef, fi) => {
    const pts = faceDef.verts.map((vi) => ROCK_VERTS[vi]);

    // Compute face center
    const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
    const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
    const cz = pts.reduce((s, p) => s + p[2], 0) / pts.length;

    // Compute face normal (using first 3 verts)
    const e1 = sub(pts[1], pts[0]);
    const e2 = sub(pts[2], pts[0]);
    const rawNormal = cross(e1, e2);
    const n = normalize(rawNormal);

    // Ensure normal points outward (away from origin)
    const dot = n[0] * cx + n[1] * cy + n[2] * cz;
    const normal: Vec3 = dot >= 0 ? n : [-n[0], -n[1], -n[2]];

    // Build local coordinate system on the face plane
    // u = arbitrary vector perpendicular to normal
    let up: Vec3 = [0, 1, 0];
    if (Math.abs(normal[1]) > 0.9) up = [1, 0, 0];
    const u = normalize(cross(normal, up));
    const v = cross(normal, u);

    // Project each vertex onto the face plane (local 2D coords)
    const localPts = pts.map((p) => ({
      u: (p[0] - cx) * u[0] + (p[1] - cy) * u[1] + (p[2] - cz) * u[2],
      v: (p[0] - cx) * v[0] + (p[1] - cy) * v[1] + (p[2] - cz) * v[2],
    }));

    // Bounding box in local coords
    const minU = Math.min(...localPts.map((p) => p.u));
    const maxU = Math.max(...localPts.map((p) => p.u));
    const minV = Math.min(...localPts.map((p) => p.v));
    const maxV = Math.max(...localPts.map((p) => p.v));

    const faceW = maxU - minU || 1;
    const faceH = maxV - minV || 1;

    // Build clip-path from local coords scaled to [0%, 100%]
    const clipPoints = localPts
      .map((p) => {
        const px = ((p.u - minU) / faceW) * 100;
        const py = ((p.v - minV) / faceH) * 100;
        return `${px.toFixed(1)}% ${py.toFixed(1)}%`;
      })
      .join(", ");

    // Build CSS transform via matrix3d — encodes full rotation + translation.
    // Rotation matrix columns: u (local X), v (local Y), normal (local Z).
    // CRITICAL: The div is centered at (0,0) in parent space (via left:50%, margin offsets).
    // The bounding box center in local coords (midU, midV) may differ from (0,0),
    // so the translation must compensate: tx = cx + u*midU + v*midV.
    const midU = (minU + maxU) / 2;
    const midV = (minV + maxV) / 2;
    const tx = cx + u[0] * midU + v[0] * midV;
    const ty = cy + u[1] * midU + v[1] * midV;
    const tz = cz + u[2] * midU + v[2] * midV;

    const transform = `matrix3d(${[
      u[0], u[1], u[2], 0,
      v[0], v[1], v[2], 0,
      normal[0], normal[1], normal[2], 0,
      tx, ty, tz, 1,
    ].map((n) => n.toFixed(4)).join(",")})`;

    // Front-facing threshold: normalZ > 0.2 means face is pointing toward viewer
    const isFrontFacing = normal[2] > 0.2;

    faces.push({
      transform,
      clipPath: `polygon(${clipPoints})`,
      width: faceW,
      height: faceH,
      showImage: isFrontFacing,
      faceIndex: fi,
      grayTone: faceDef.gray,
      normalZ: normal[2],
      key: `face-${fi}`,
    });
  });

  return faces;
}

/* ================================================================== */
/*  ORBIT CONFIG — per-project orbiting 3D illustrations              */
/* ================================================================== */

type IllustrationShape =
  | "laptop" | "document" | "globe"
  | "suitcase" | "airplane" | "compass"
  | "gradcap" | "phone" | "badge"
  | "ballotbox" | "shield" | "chainlink"
  | "clock" | "calendar" | "clipboard";

interface OrbitItem {
  shape: IllustrationShape;
  orbitRadius: number;
  orbitDuration: number;
  /** Orbital plane inclination around X axis (degrees) */
  tiltX: number;
  /** Orbital plane inclination around Z axis (degrees) */
  tiltZ: number;
  /** Start angle offset (degrees) — initial position in orbit */
  startAngle: number;
  size: number;
}

const projectOrbits: OrbitItem[][] = [
  /* DPP Interoperability — laptop, document, globe */
  [
    { shape: "laptop",   orbitRadius: 260, orbitDuration: 14, tiltX:  10, tiltZ:   5, startAngle:   0, size: 38 },
    { shape: "document", orbitRadius: 280, orbitDuration: 20, tiltX:  55, tiltZ:  40, startAngle: 120, size: 34 },
    { shape: "globe",    orbitRadius: 250, orbitDuration: 17, tiltX: -45, tiltZ: -55, startAngle: 240, size: 36 },
  ],
  /* TravelApp — suitcase, airplane, compass */
  [
    { shape: "suitcase", orbitRadius: 270, orbitDuration: 15, tiltX: -15, tiltZ:  10, startAngle:  30, size: 38 },
    { shape: "airplane", orbitRadius: 290, orbitDuration: 22, tiltX:  50, tiltZ: -45, startAngle: 150, size: 36 },
    { shape: "compass",  orbitRadius: 250, orbitDuration: 13, tiltX: -50, tiltZ:  50, startAngle: 270, size: 34 },
  ],
  /* PUCP-IN — gradcap, phone, badge */
  [
    { shape: "gradcap",  orbitRadius: 265, orbitDuration: 16, tiltX:  20, tiltZ: -10, startAngle:  50, size: 38 },
    { shape: "phone",    orbitRadius: 285, orbitDuration: 19, tiltX: -55, tiltZ:  35, startAngle: 170, size: 34 },
    { shape: "badge",    orbitRadius: 245, orbitDuration: 24, tiltX:  45, tiltZ: -50, startAngle: 290, size: 34 },
  ],
  /* Digital Voting — ballotbox, shield, chainlink */
  [
    { shape: "ballotbox", orbitRadius: 275, orbitDuration: 14, tiltX: -10, tiltZ: -15, startAngle:  40, size: 38 },
    { shape: "shield",    orbitRadius: 290, orbitDuration: 18, tiltX:  50, tiltZ:  45, startAngle: 160, size: 36 },
    { shape: "chainlink", orbitRadius: 250, orbitDuration: 22, tiltX: -45, tiltZ: -40, startAngle: 280, size: 34 },
  ],
  /* Assistance — clock, calendar, clipboard */
  [
    { shape: "clock",     orbitRadius: 260, orbitDuration: 15, tiltX:  15, tiltZ:  20, startAngle:  20, size: 38 },
    { shape: "calendar",  orbitRadius: 280, orbitDuration: 21, tiltX: -50, tiltZ: -45, startAngle: 140, size: 36 },
    { shape: "clipboard", orbitRadius: 250, orbitDuration: 17, tiltX:  50, tiltZ:  55, startAngle: 260, size: 34 },
  ],
];

/* ================================================================== */
/*  THEMED 3D ILLUSTRATION COMPONENTS                                 */
/* ================================================================== */

/** 3D Laptop — base slab + angled screen */
function Laptop3D({ size, accent }: Readonly<{ size: number; accent: typeof gemAccents[0] }>) {
  const w = size;
  const baseH = size * 0.12;
  const screenH = size * 0.65;
  return (
    <div style={{ width: w, height: size, position: "relative", transformStyle: "preserve-3d" }}>
      {/* Base */}
      <div style={{
        position: "absolute", bottom: 0, left: 0,
        width: w, height: baseH, borderRadius: 2,
        background: accent.fillSolid, border: `1px solid ${accent.edge}66`,
        transform: "rotateX(70deg)", transformOrigin: "bottom center",
      }} />
      {/* Screen */}
      <div style={{
        position: "absolute", bottom: baseH, left: w * 0.05,
        width: w * 0.9, height: screenH, borderRadius: 2,
        background: `linear-gradient(135deg, ${accent.fillSolid}, ${accent.fill})`,
        border: `1px solid ${accent.edge}88`,
        transform: "rotateX(-15deg)", transformOrigin: "bottom center",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {/* Code lines on screen */}
        <div style={{ width: "60%", display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ width: "80%", height: 2, background: accent.edge, opacity: 0.6, borderRadius: 1 }} />
          <div style={{ width: "55%", height: 2, background: accent.edge, opacity: 0.4, borderRadius: 1 }} />
          <div style={{ width: "70%", height: 2, background: accent.edge, opacity: 0.5, borderRadius: 1 }} />
        </div>
      </div>
    </div>
  );
}

/** 3D Document / Passport — card with line details and stamp */
function Document3D({ size, accent }: Readonly<{ size: number; accent: typeof gemAccents[0] }>) {
  const w = size * 0.75;
  const h = size;
  return (
    <div style={{ width: w, height: h, position: "relative", transformStyle: "preserve-3d" }}>
      {/* Main card */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: 3,
        background: `linear-gradient(180deg, ${accent.fillSolid}, ${accent.fill})`,
        border: `1px solid ${accent.edge}66`,
        display: "flex", flexDirection: "column", padding: size * 0.12, gap: size * 0.06,
      }}>
        {/* Photo placeholder */}
        <div style={{
          width: size * 0.2, height: size * 0.24, borderRadius: 2,
          background: accent.edge, opacity: 0.3,
        }} />
        {/* Text lines */}
        <div style={{ width: "90%", height: 2, background: accent.edge, opacity: 0.4, borderRadius: 1 }} />
        <div style={{ width: "65%", height: 2, background: accent.edge, opacity: 0.3, borderRadius: 1 }} />
        <div style={{ width: "75%", height: 2, background: accent.edge, opacity: 0.3, borderRadius: 1 }} />
        {/* Stamp circle */}
        <div style={{
          position: "absolute", bottom: size * 0.1, right: size * 0.08,
          width: size * 0.2, height: size * 0.2, borderRadius: "50%",
          border: `1.5px solid ${accent.edge}55`,
        }} />
      </div>
      {/* Depth layer behind */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: 3,
        background: accent.fill, border: `1px solid ${accent.edge}33`,
        transform: "translateZ(-3px)",
      }} />
    </div>
  );
}

/** 3D Globe — circle with latitude/longitude arcs */
function Globe3D({ size, accent }: Readonly<{ size: number; accent: typeof gemAccents[0] }>) {
  return (
    <div style={{ width: size, height: size, position: "relative", transformStyle: "preserve-3d" }}>
      {/* Sphere base */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        background: `radial-gradient(circle at 35% 35%, ${accent.fillSolid}, ${accent.fill})`,
        border: `1.5px solid ${accent.edge}66`,
        overflow: "hidden",
      }}>
        {/* Vertical meridian */}
        <div style={{
          position: "absolute", left: "50%", top: 0, width: 0, height: "100%",
          borderLeft: `1px solid ${accent.edge}44`, transform: "translateX(-0.5px)",
        }} />
        {/* Elliptical meridian */}
        <div style={{
          position: "absolute", left: "25%", top: "5%", width: "50%", height: "90%",
          borderRadius: "50%", border: `1px solid ${accent.edge}33`,
        }} />
        {/* Horizontal equator */}
        <div style={{
          position: "absolute", top: "50%", left: 0, width: "100%", height: 0,
          borderTop: `1px solid ${accent.edge}44`, transform: "translateY(-0.5px)",
        }} />
        {/* Latitude lines */}
        <div style={{
          position: "absolute", top: "30%", left: "8%", width: "84%", height: 0,
          borderTop: `1px solid ${accent.edge}22`,
        }} />
        <div style={{
          position: "absolute", top: "70%", left: "8%", width: "84%", height: 0,
          borderTop: `1px solid ${accent.edge}22`,
        }} />
      </div>
      {/* Highlight glare */}
      <div style={{
        position: "absolute", top: "12%", left: "18%", width: "25%", height: "12%",
        borderRadius: "50%", background: "rgba(255,255,255,0.15)",
        transform: "rotate(-30deg)", filter: "blur(2px)",
      }} />
    </div>
  );
}

/** 3D Suitcase — box with handle and stickers */
function Suitcase3D({ size, accent }: Readonly<{ size: number; accent: typeof gemAccents[0] }>) {
  const w = size;
  const h = size * 0.85;
  const handleH = size * 0.15;
  return (
    <div style={{ width: w, height: size, position: "relative", transformStyle: "preserve-3d" }}>
      {/* Handle */}
      <div style={{
        position: "absolute", top: 0, left: "30%", width: "40%", height: handleH,
        borderRadius: `${size * 0.06}px ${size * 0.06}px 0 0`,
        border: `2px solid ${accent.edge}66`, borderBottom: "none",
        background: "transparent",
      }} />
      {/* Main body */}
      <div style={{
        position: "absolute", top: handleH, left: 0,
        width: w, height: h - handleH, borderRadius: 4,
        background: `linear-gradient(135deg, ${accent.fillSolid}, ${accent.fill})`,
        border: `1.5px solid ${accent.edge}55`,
      }}>
        {/* Center divider line */}
        <div style={{
          position: "absolute", top: 0, left: "50%", width: 0, height: "100%",
          borderLeft: `1px solid ${accent.edge}33`,
        }} />
        {/* Sticker dots */}
        <div style={{
          position: "absolute", top: "20%", right: "15%",
          width: size * 0.14, height: size * 0.14, borderRadius: "50%",
          background: accent.edge, opacity: 0.3,
        }} />
        <div style={{
          position: "absolute", bottom: "25%", left: "12%",
          width: size * 0.1, height: size * 0.1, borderRadius: 2,
          background: accent.edge, opacity: 0.2,
        }} />
      </div>
      {/* Depth side */}
      <div style={{
        position: "absolute", top: handleH + 2, left: 2,
        width: w - 4, height: h - handleH - 4, borderRadius: 4,
        background: accent.fill, transform: "translateZ(-4px)",
      }} />
    </div>
  );
}

/** 3D Airplane — body + wings silhouette */
function Airplane3D({ size, accent }: Readonly<{ size: number; accent: typeof gemAccents[0] }>) {
  return (
    <div style={{ width: size, height: size, position: "relative", transformStyle: "preserve-3d" }}>
      {/* Fuselage */}
      <div style={{
        position: "absolute", top: "35%", left: "10%",
        width: "80%", height: "22%",
        borderRadius: `${size * 0.3}px ${size * 0.06}px ${size * 0.06}px ${size * 0.3}px`,
        background: `linear-gradient(90deg, ${accent.fillSolid}, ${accent.fill})`,
        border: `1px solid ${accent.edge}55`,
      }}>
        {/* Cockpit window */}
        <div style={{
          position: "absolute", left: "8%", top: "25%",
          width: "10%", height: "50%", borderRadius: "50%",
          background: accent.edge, opacity: 0.5,
        }} />
      </div>
      {/* Main wing */}
      <div style={{
        position: "absolute", top: "20%", left: "30%",
        width: "45%", height: "55%",
        clipPath: "polygon(0% 45%, 100% 0%, 80% 100%, 0% 55%)",
        background: accent.fillSolid, border: `1px solid ${accent.edge}44`,
      }} />
      {/* Tail fin */}
      <div style={{
        position: "absolute", top: "15%", right: "8%",
        width: "18%", height: "35%",
        clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
        background: accent.fillSolid, border: `1px solid ${accent.edge}44`,
      }} />
      {/* Engine glow */}
      <div style={{
        position: "absolute", top: "40%", left: "40%",
        width: size * 0.08, height: size * 0.08, borderRadius: "50%",
        background: accent.edge, opacity: 0.4, filter: "blur(2px)",
      }} />
    </div>
  );
}

/** 3D Compass — circle face with needle */
function Compass3D({ size, accent }: Readonly<{ size: number; accent: typeof gemAccents[0] }>) {
  return (
    <div style={{ width: size, height: size, position: "relative", transformStyle: "preserve-3d" }}>
      {/* Outer ring */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        background: accent.fill, border: `2px solid ${accent.edge}55`,
      }}>
        {/* Inner ring */}
        <div style={{
          position: "absolute", inset: "12%", borderRadius: "50%",
          border: `1px solid ${accent.edge}33`,
        }} />
        {/* Cardinal marks */}
        <div style={{ position: "absolute", top: "8%", left: "50%", width: 1, height: size * 0.08, background: accent.edge, opacity: 0.6, transform: "translateX(-0.5px)" }} />
        <div style={{ position: "absolute", bottom: "8%", left: "50%", width: 1, height: size * 0.08, background: accent.edge, opacity: 0.4, transform: "translateX(-0.5px)" }} />
        <div style={{ position: "absolute", top: "50%", left: "8%", width: size * 0.08, height: 1, background: accent.edge, opacity: 0.4, transform: "translateY(-0.5px)" }} />
        <div style={{ position: "absolute", top: "50%", right: "8%", width: size * 0.08, height: 1, background: accent.edge, opacity: 0.4, transform: "translateY(-0.5px)" }} />
        {/* Needle — north (red tip) */}
        <div style={{
          position: "absolute", top: "18%", left: "50%",
          width: 0, height: 0,
          borderLeft: `${size * 0.04}px solid transparent`,
          borderRight: `${size * 0.04}px solid transparent`,
          borderBottom: `${size * 0.3}px solid ${accent.edge}`,
          transform: "translateX(-50%)", opacity: 0.8,
        }} />
        {/* Needle — south */}
        <div style={{
          position: "absolute", bottom: "18%", left: "50%",
          width: 0, height: 0,
          borderLeft: `${size * 0.03}px solid transparent`,
          borderRight: `${size * 0.03}px solid transparent`,
          borderTop: `${size * 0.3}px solid ${accent.edge}44`,
          transform: "translateX(-50%)",
        }} />
        {/* Center dot */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          width: size * 0.08, height: size * 0.08, borderRadius: "50%",
          background: accent.edge, transform: "translate(-50%, -50%)", opacity: 0.6,
        }} />
      </div>
    </div>
  );
}

/** 3D Graduation Cap — square top + tassel */
function GradCap3D({ size, accent }: Readonly<{ size: number; accent: typeof gemAccents[0] }>) {
  return (
    <div style={{ width: size, height: size, position: "relative", transformStyle: "preserve-3d" }}>
      {/* Board (mortarboard) — diamond shape viewed from slight angle */}
      <div style={{
        position: "absolute", top: "20%", left: "5%",
        width: "90%", height: "50%",
        clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
        background: `linear-gradient(180deg, ${accent.fillSolid}, ${accent.fill})`,
        border: `1px solid ${accent.edge}55`,
        transform: "rotateX(20deg)",
      }} />
      {/* Cap base (skull portion) */}
      <div style={{
        position: "absolute", bottom: "10%", left: "25%",
        width: "50%", height: "35%",
        borderRadius: `0 0 ${size * 0.06}px ${size * 0.06}px`,
        background: accent.fill, border: `1px solid ${accent.edge}33`,
        borderTop: "none",
      }} />
      {/* Button on top */}
      <div style={{
        position: "absolute", top: "18%", left: "50%",
        width: size * 0.08, height: size * 0.08, borderRadius: "50%",
        background: accent.edge, opacity: 0.6, transform: "translateX(-50%)",
      }} />
      {/* Tassel string */}
      <div style={{
        position: "absolute", top: "22%", left: "50%",
        width: 1, height: "45%", background: accent.edge, opacity: 0.4,
      }} />
      {/* Tassel end */}
      <div style={{
        position: "absolute", bottom: "28%", left: "50%",
        width: size * 0.06, height: size * 0.12,
        borderRadius: `0 0 ${size * 0.03}px ${size * 0.03}px`,
        background: accent.edge, opacity: 0.5, transform: "translateX(-50%)",
      }} />
    </div>
  );
}

/** 3D Phone — slim rectangle + screen content */
function Phone3D({ size, accent }: Readonly<{ size: number; accent: typeof gemAccents[0] }>) {
  const w = size * 0.55;
  const h = size;
  return (
    <div style={{ width: w, height: h, position: "relative", transformStyle: "preserve-3d" }}>
      {/* Phone body */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: size * 0.08,
        background: accent.fill, border: `1.5px solid ${accent.edge}55`,
      }}>
        {/* Screen area */}
        <div style={{
          position: "absolute", top: "8%", left: "8%", right: "8%", bottom: "12%",
          borderRadius: size * 0.04, background: accent.fillSolid,
          display: "flex", flexDirection: "column", padding: "15%", gap: size * 0.05,
        }}>
          {/* App bars */}
          <div style={{ width: "70%", height: 2, background: accent.edge, opacity: 0.5, borderRadius: 1 }} />
          <div style={{ width: "50%", height: 2, background: accent.edge, opacity: 0.3, borderRadius: 1 }} />
          <div style={{ width: "80%", height: 2, background: accent.edge, opacity: 0.4, borderRadius: 1 }} />
          <div style={{ width: "40%", height: 2, background: accent.edge, opacity: 0.3, borderRadius: 1 }} />
        </div>
        {/* Home button / bar */}
        <div style={{
          position: "absolute", bottom: "4%", left: "30%", width: "40%", height: 2,
          borderRadius: 1, background: accent.edge, opacity: 0.3,
        }} />
      </div>
      {/* Depth */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: size * 0.08,
        background: accent.fill, transform: "translateZ(-2px)",
        border: `1px solid ${accent.edge}22`,
      }} />
    </div>
  );
}

/** 3D Badge / ID Card — card with avatar circle */
function Badge3D({ size, accent }: Readonly<{ size: number; accent: typeof gemAccents[0] }>) {
  const w = size * 0.8;
  const h = size;
  return (
    <div style={{ width: w, height: h, position: "relative", transformStyle: "preserve-3d" }}>
      {/* Card body */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: 4,
        background: `linear-gradient(180deg, ${accent.fillSolid}, ${accent.fill})`,
        border: `1.5px solid ${accent.edge}55`,
        display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "15%",
      }}>
        {/* Lanyard clip */}
        <div style={{
          position: "absolute", top: -size * 0.06, left: "50%",
          width: size * 0.12, height: size * 0.06, borderRadius: "50%",
          border: `1.5px solid ${accent.edge}44`, background: "transparent",
          transform: "translateX(-50%)",
        }} />
        {/* Avatar circle */}
        <div style={{
          width: size * 0.3, height: size * 0.3, borderRadius: "50%",
          background: accent.edge, opacity: 0.25, marginBottom: size * 0.08,
        }} />
        {/* Name lines */}
        <div style={{ width: "60%", height: 2, background: accent.edge, opacity: 0.5, borderRadius: 1, marginBottom: size * 0.04 }} />
        <div style={{ width: "40%", height: 2, background: accent.edge, opacity: 0.3, borderRadius: 1, marginBottom: size * 0.06 }} />
        {/* Barcode area */}
        <div style={{
          width: "65%", height: size * 0.1, marginTop: "auto", marginBottom: "12%",
          display: "flex", gap: 1, alignItems: "stretch",
        }}>
          {[3, 1, 2, 1, 3, 2, 1, 2, 3, 1].map((w2, j) => (
            <div key={j} style={{ flex: w2, background: accent.edge, opacity: 0.2 + (j % 3) * 0.1 }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/** 3D BallotBox — box with slot and check mark */
function BallotBox3D({ size, accent }: Readonly<{ size: number; accent: typeof gemAccents[0] }>) {
  const w = size;
  const h = size * 0.9;
  return (
    <div style={{ width: w, height: size, position: "relative", transformStyle: "preserve-3d" }}>
      {/* Main box body */}
      <div style={{
        position: "absolute", bottom: 0, left: 0,
        width: w, height: h, borderRadius: 4,
        background: `linear-gradient(180deg, ${accent.fillSolid}, ${accent.fill})`,
        border: `1.5px solid ${accent.edge}55`,
      }}>
        {/* Slot at top */}
        <div style={{
          position: "absolute", top: size * 0.04, left: "20%",
          width: "60%", height: 3, borderRadius: 2,
          background: accent.edge, opacity: 0.4,
        }} />
        {/* Paper/ballot sticking out */}
        <div style={{
          position: "absolute", top: -size * 0.15, left: "30%",
          width: "40%", height: size * 0.2, borderRadius: 2,
          background: `linear-gradient(180deg, rgba(255,255,255,0.15), ${accent.fill})`,
          border: `1px solid ${accent.edge}33`,
        }}>
          {/* Checkmark on ballot */}
          <div style={{
            position: "absolute", top: "20%", left: "25%",
            width: "50%", height: "50%",
            borderBottom: `2px solid ${accent.edge}88`,
            borderRight: `2px solid ${accent.edge}88`,
            transform: "rotate(40deg) scale(0.6)",
          }} />
        </div>
        {/* Side accent */}
        <div style={{
          position: "absolute", left: 0, top: "20%",
          width: 2, height: "60%", background: accent.edge, opacity: 0.2,
        }} />
      </div>
    </div>
  );
}

/** 3D Shield — shield clip-path + checkmark */
function Shield3D({ size, accent }: Readonly<{ size: number; accent: typeof gemAccents[0] }>) {
  return (
    <div style={{ width: size, height: size, position: "relative", transformStyle: "preserve-3d" }}>
      {/* Shield shape */}
      <div style={{
        position: "absolute", inset: "5%",
        clipPath: "polygon(50% 0%, 100% 15%, 95% 60%, 50% 100%, 5% 60%, 0% 15%)",
        background: `linear-gradient(180deg, ${accent.fillSolid}, ${accent.fill})`,
        border: `1px solid ${accent.edge}55`,
      }}>
        {/* Inner shield ring */}
        <div style={{
          position: "absolute", inset: "12%",
          clipPath: "polygon(50% 5%, 95% 18%, 90% 58%, 50% 95%, 10% 58%, 5% 18%)",
          border: `1px solid ${accent.edge}33`, background: "transparent",
        }} />
        {/* Check mark */}
        <div style={{
          position: "absolute", top: "30%", left: "30%",
          width: "40%", height: "30%",
          borderBottom: `2.5px solid ${accent.edge}`,
          borderRight: `2.5px solid ${accent.edge}`,
          transform: "rotate(40deg)", opacity: 0.7,
        }} />
      </div>
      {/* Depth */}
      <div style={{
        position: "absolute", inset: "5%",
        clipPath: "polygon(50% 0%, 100% 15%, 95% 60%, 50% 100%, 5% 60%, 0% 15%)",
        background: accent.fill, transform: "translateZ(-3px)",
      }} />
    </div>
  );
}

/** 3D ChainLink — two interlocking oval links */
function ChainLink3D({ size, accent }: Readonly<{ size: number; accent: typeof gemAccents[0] }>) {
  const linkW = size * 0.4;
  const linkH = size * 0.65;
  return (
    <div style={{ width: size, height: size, position: "relative", transformStyle: "preserve-3d" }}>
      {/* Left link */}
      <div style={{
        position: "absolute", top: "50%", left: "12%",
        width: linkW, height: linkH, borderRadius: linkW / 2,
        border: `2.5px solid ${accent.edge}77`, background: "transparent",
        transform: "translateY(-50%)",
      }} />
      {/* Right link (overlapping) */}
      <div style={{
        position: "absolute", top: "50%", right: "12%",
        width: linkW, height: linkH, borderRadius: linkW / 2,
        border: `2.5px solid ${accent.edge}55`, background: "transparent",
        transform: "translateY(-50%) rotate(15deg)",
      }} />
      {/* Intersection highlight */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        width: size * 0.08, height: size * 0.08, borderRadius: "50%",
        background: accent.edge, opacity: 0.3,
        transform: "translate(-50%, -50%)",
      }} />
    </div>
  );
}

/** 3D Clock — circle face with hour/minute hands */
function Clock3D({ size, accent }: Readonly<{ size: number; accent: typeof gemAccents[0] }>) {
  return (
    <div style={{ width: size, height: size, position: "relative", transformStyle: "preserve-3d" }}>
      {/* Clock face */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        background: accent.fill, border: `2px solid ${accent.edge}55`,
      }}>
        {/* Hour markers */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
          <div key={deg} style={{
            position: "absolute", top: "50%", left: "50%", width: 1.5, height: size * 0.08,
            background: accent.edge, opacity: deg % 90 === 0 ? 0.7 : 0.3,
            transformOrigin: `0.75px ${size * 0.42}px`,
            transform: `rotate(${deg}deg) translateY(-${size * 0.42}px)`,
          }} />
        ))}
        {/* Hour hand */}
        <div style={{
          position: "absolute", bottom: "50%", left: "50%",
          width: 2, height: size * 0.22, borderRadius: 1,
          background: accent.edge, opacity: 0.7,
          transformOrigin: "1px 100%",
          transform: "rotate(-30deg) translateX(-1px)",
        }} />
        {/* Minute hand */}
        <div style={{
          position: "absolute", bottom: "50%", left: "50%",
          width: 1.5, height: size * 0.32, borderRadius: 1,
          background: accent.edge, opacity: 0.5,
          transformOrigin: "0.75px 100%",
          transform: "rotate(60deg) translateX(-0.75px)",
        }} />
        {/* Center dot */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          width: size * 0.07, height: size * 0.07, borderRadius: "50%",
          background: accent.edge, opacity: 0.6, transform: "translate(-50%, -50%)",
        }} />
      </div>
    </div>
  );
}

/** 3D Calendar — panel with top bar + date grid */
function Calendar3D({ size, accent }: Readonly<{ size: number; accent: typeof gemAccents[0] }>) {
  const w = size * 0.9;
  const h = size;
  return (
    <div style={{ width: w, height: h, position: "relative", transformStyle: "preserve-3d" }}>
      {/* Calendar body */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: 4,
        background: accent.fill, border: `1.5px solid ${accent.edge}55`,
        overflow: "hidden",
      }}>
        {/* Header bar with month */}
        <div style={{
          width: "100%", height: "22%",
          background: accent.fillSolid, borderBottom: `1px solid ${accent.edge}33`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ width: "50%", height: 2, background: accent.edge, opacity: 0.5, borderRadius: 1 }} />
        </div>
        {/* Date grid (3x3 dots) */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
          gap: size * 0.04, padding: `${size * 0.06}px ${size * 0.08}px`,
        }}>
          {Array.from({ length: 12 }).map((_, j) => (
            <div key={j} style={{
              width: size * 0.07, height: size * 0.07, borderRadius: j === 4 ? "50%" : 1,
              background: accent.edge, opacity: j === 4 ? 0.6 : 0.2,
              margin: "auto",
            }} />
          ))}
        </div>
      </div>
      {/* Ring holes */}
      <div style={{
        position: "absolute", top: -size * 0.03, left: "25%",
        width: size * 0.06, height: size * 0.06, borderRadius: "50%",
        border: `1.5px solid ${accent.edge}44`,
      }} />
      <div style={{
        position: "absolute", top: -size * 0.03, right: "25%",
        width: size * 0.06, height: size * 0.06, borderRadius: "50%",
        border: `1.5px solid ${accent.edge}44`,
      }} />
    </div>
  );
}

/** 3D Clipboard — board with clip and text lines */
function Clipboard3D({ size, accent }: Readonly<{ size: number; accent: typeof gemAccents[0] }>) {
  const w = size * 0.8;
  const h = size;
  return (
    <div style={{ width: w, height: h, position: "relative", transformStyle: "preserve-3d" }}>
      {/* Board */}
      <div style={{
        position: "absolute", top: "8%", left: 0,
        width: w, height: h * 0.92, borderRadius: 4,
        background: `linear-gradient(180deg, ${accent.fillSolid}, ${accent.fill})`,
        border: `1.5px solid ${accent.edge}55`,
        display: "flex", flexDirection: "column", padding: "15% 12%", gap: size * 0.06,
      }}>
        {/* Text lines */}
        <div style={{ width: "90%", height: 2, background: accent.edge, opacity: 0.4, borderRadius: 1 }} />
        <div style={{ width: "65%", height: 2, background: accent.edge, opacity: 0.3, borderRadius: 1 }} />
        <div style={{ width: "80%", height: 2, background: accent.edge, opacity: 0.35, borderRadius: 1 }} />
        <div style={{ width: "50%", height: 2, background: accent.edge, opacity: 0.25, borderRadius: 1 }} />
        {/* Checkbox */}
        <div style={{ display: "flex", alignItems: "center", gap: size * 0.04, marginTop: size * 0.02 }}>
          <div style={{
            width: size * 0.08, height: size * 0.08, borderRadius: 1,
            border: `1.5px solid ${accent.edge}55`,
          }} />
          <div style={{ width: "40%", height: 2, background: accent.edge, opacity: 0.3, borderRadius: 1 }} />
        </div>
      </div>
      {/* Metal clip */}
      <div style={{
        position: "absolute", top: 0, left: "30%",
        width: "40%", height: size * 0.14, borderRadius: `${size * 0.04}px ${size * 0.04}px 0 0`,
        background: accent.edge, opacity: 0.4,
      }}>
        <div style={{
          position: "absolute", bottom: 0, left: "15%",
          width: "70%", height: "50%",
          background: accent.fill, borderRadius: 1,
        }} />
      </div>
    </div>
  );
}

/** Render a themed 3D illustration by shape name */
function Shape3D({
  shape,
  size,
  accent,
}: Readonly<{
  shape: IllustrationShape;
  size: number;
  accent: typeof gemAccents[0];
}>) {
  switch (shape) {
    case "laptop": return <Laptop3D size={size} accent={accent} />;
    case "document": return <Document3D size={size} accent={accent} />;
    case "globe": return <Globe3D size={size} accent={accent} />;
    case "suitcase": return <Suitcase3D size={size} accent={accent} />;
    case "airplane": return <Airplane3D size={size} accent={accent} />;
    case "compass": return <Compass3D size={size} accent={accent} />;
    case "gradcap": return <GradCap3D size={size} accent={accent} />;
    case "phone": return <Phone3D size={size} accent={accent} />;
    case "badge": return <Badge3D size={size} accent={accent} />;
    case "ballotbox": return <BallotBox3D size={size} accent={accent} />;
    case "shield": return <Shield3D size={size} accent={accent} />;
    case "chainlink": return <ChainLink3D size={size} accent={accent} />;
    case "clock": return <Clock3D size={size} accent={accent} />;
    case "calendar": return <Calendar3D size={size} accent={accent} />;
    case "clipboard": return <Clipboard3D size={size} accent={accent} />;
  }
}

/* ================================================================== */
/*  ORBIT SYSTEM — scattered 3D illustrations with wide elliptical    */
/*  orbits around the polyhedron                                      */
/* ================================================================== */
function OrbitSystem({
  projectIndex,
  isActive,
  isHovered = false,
  scale = 1,
}: Readonly<{ projectIndex: number; isActive: boolean; isHovered?: boolean; scale?: number }>) {
  const orbits = projectOrbits[projectIndex % projectOrbits.length];
  const accent = gemAccents[projectIndex % gemAccents.length];

  // Rest angles when hovered — all in the front half (positive Z = toward viewer)
  // 200deg = left-front, 270deg = center-front, 340deg = right-front
  const restAngles = [200, 270, 340];

  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{ transformStyle: "preserve-3d" }}
    >
      {orbits.map((item, i) => (
        <div
          key={`orbit-${projectIndex}-${i}`}
          className="absolute left-1/2 top-1/2"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Orbital plane tilt — animated to flat (0,0) on hover for visibility */}
          <motion.div
            style={{ transformStyle: "preserve-3d" }}
            animate={
              isActive
                ? isHovered
                  ? { rotateX: 0, rotateZ: 0, opacity: 1 }
                  : { rotateX: item.tiltX, rotateZ: item.tiltZ, opacity: 1 }
                : { rotateX: 0, rotateZ: 0, opacity: 0 }
            }
            transition={{
              rotateX: { duration: 0.8, ease: "easeInOut" },
              rotateZ: { duration: 0.8, ease: "easeInOut" },
              opacity: { duration: 0.5 },
            }}
          >
            {/* Orbit rotation — continuous when active, parks on hover */}
            <motion.div
              style={{ transformStyle: "preserve-3d" }}
              animate={
                isActive
                  ? isHovered
                    ? { rotateY: restAngles[i], scale: 1 }
                    : { rotateY: [item.startAngle, item.startAngle + 360], scale: 1 }
                  : { rotateY: item.startAngle, scale: 0.5 }
              }
              transition={
                isActive
                  ? isHovered
                    ? {
                        rotateY: { duration: 0.8, ease: "easeInOut" },
                        scale: { duration: 0.4 },
                      }
                    : {
                        rotateY: {
                          duration: item.orbitDuration,
                          repeat: Infinity,
                          ease: "linear",
                        },
                        scale: { duration: 0.6 },
                      }
                  : { duration: 0.5 }
              }
            >
              {/* Radius offset from center — static */}
              <div
                style={{
                  position: "absolute",
                  transformStyle: "preserve-3d",
                  transform: `translateX(${item.orbitRadius * scale}px) translateY(-${(item.size * scale) / 2}px)`,
                }}
              >
                {/* Self-rotation — stops and faces viewer on hover */}
                <motion.div
                  animate={
                    isActive && !isHovered
                      ? { rotateY: [360, 0], rotateX: [0, 180, 360] }
                      : { rotateY: 0, rotateX: 0 }
                  }
                  transition={
                    isActive && !isHovered
                      ? {
                          duration: item.orbitDuration * 0.6,
                          repeat: Infinity,
                          ease: "linear",
                        }
                      : { duration: 0.6, ease: "easeOut" }
                  }
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <Shape3D
                    shape={item.shape}
                    size={Math.round(item.size * scale)}
                    accent={accent}
                  />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      ))}
    </div>
  );
}

/* ================================================================== */
/*  POLYHEDRON — 3D rock-like shape with hover image reveal           */
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

/** Total number of front-facing image faces — for panoramic strip math */
const IMAGE_FACE_COUNT = ROCK_FACES.filter((_, fi) => {
  // Pre-compute: matches the logic in generatePolyhedronFaces for normalZ > 0.2
  // We count them here so the constant is available before rendering
  return true; // Will be filtered at render time by face.showImage
}).length;

function Polyhedron({
  project,
  index,
  isActive,
}: Readonly<{
  project: Project;
  index: number;
  isActive: boolean;
}>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const scale = useGemSize();

  const springCfg = { stiffness: 120, damping: 18, mass: 0.6 };
  const mouseTiltX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [12, -12]),
    springCfg
  );
  const mouseTiltY = useSpring(
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
    setIsHovered(false);
  }, [mouseX, mouseY]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const accent = gemAccents[index % gemAccents.length];
  const gradient = gradients[index % gradients.length];

  // Generate faces once
  const faces = useMemo(() => generatePolyhedronFaces(), []);

  // Count how many faces show images (for panoramic slicing)
  const imageFaceCount = useMemo(
    () => faces.filter((f) => f.showImage).length,
    [faces]
  );

  // Polyhedron bounding box for container sizing
  const polyW = 280;
  const polyH = 260;

  return (
    <motion.div
      ref={containerRef}
      className="relative cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        perspective: 1200,
        width: polyW * scale,
        height: polyH * scale,
      }}
    >
      {/* Glow behind polyhedron — intensifies on hover */}
      <motion.div
        className="absolute inset-0 blur-3xl"
        style={{
          background: accent.glow,
          borderRadius: "50%",
          transform: "scale(1.6)",
        }}
        animate={{ opacity: isActive ? (isHovered ? 0.65 : 0.3) : 0 }}
        transition={{ duration: 0.6 }}
      />

      {/* 3D polyhedron wrapper — mouse tilt on hover, static otherwise */}
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
              ? { scale: 1, opacity: 1 }
              : { scale: 0.85, opacity: 0.3 }
          }
          transition={{ duration: 0.7 }}
        >
          {/* Render polyhedron faces */}
          {faces.map((face, fi) => {
            // Gray tone to RGB for default state
            const g = Math.round(face.grayTone * 255);
            const grayColor = `rgb(${g}, ${g}, ${g})`;

            // Image faces get a sequential index for panoramic slicing
            let imageSliceIndex = 0;
            if (face.showImage) {
              imageSliceIndex = faces
                .slice(0, fi)
                .filter((f) => f.showImage).length;
            }

            return (
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
                {/* Default state: gray tone fill */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: grayColor,
                    transition: "opacity 0.5s ease",
                    opacity: isHovered && face.showImage && project.image ? 0 : 1,
                  }}
                />

                {/* Hover state: project image on front-facing faces */}
                {face.showImage && project.image && (
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url(${project.image})`,
                      backgroundSize: `${face.width * imageFaceCount}px auto`,
                      backgroundPosition: `${-imageSliceIndex * face.width}px center`,
                      transition: "opacity 0.5s ease",
                      opacity: isHovered ? 0.9 : 0,
                    }}
                  />
                )}

                {/* Fallback: gradient with initials when no image */}
                {face.showImage && !project.image && (
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      background: gradient,
                      transition: "opacity 0.5s ease",
                      opacity: isHovered ? 1 : 0,
                    }}
                  >
                    <span className="font-display text-lg font-light text-white/30">
                      {project.title.split(" ").map((w) => w[0]).join("")}
                    </span>
                  </div>
                )}

                {/* Subtle light/shadow gradient overlay */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, rgba(255,255,255,${isHovered ? 0.12 : 0.06}) 0%, transparent 50%, rgba(0,0,0,${isHovered ? 0.15 : 0.08}) 100%)`,
                    transition: "background 0.5s ease",
                  }}
                />

                {/* Facet edge highlight */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.08)`,
                  }}
                />
              </div>
            );
          })}
        </motion.div>
      </motion.div>

      {/* Orbiting 3D illustrations — scattered wide */}
      {isActive && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transformStyle: "preserve-3d",
            overflow: "visible",
          }}
        >
          <OrbitSystem projectIndex={index} isActive={isActive} isHovered={isHovered} scale={scale} />
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

      {/* 3D Polyhedron with orbiting illustrations */}
      <motion.div
        className="relative"
        style={{ overflow: "visible" }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        <Polyhedron project={project} index={index} isActive={true} />
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
