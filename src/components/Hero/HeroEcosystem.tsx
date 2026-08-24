'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { FileText, Image as ImageIcon, Type, Code2, Shield } from 'lucide-react';
import styles from './HeroEcosystem.module.css';

// ─── 5 Orbiting Category Nodes Definition ──────────────────────────
export interface NodeDef {
  id: string;
  label: string;
  href: string;
  Icon: React.ElementType;
  tools: string[];
  accent: 'violet' | 'blue' | 'orange' | 'amber';
  rx: number;       // Semi-major axis (horizontal spread)
  ry: number;       // Semi-minor axis (depth spread)
  tiltDeg: number;  // Inclination / pitch angle of orbit in 3D
  rotZ: number;     // Spatial rotation around Z axis
  phaseDeg: number; // Starting orbital phase angle
  periodSec: number;// Seconds per full orbit revolution
}

const CATEGORY_NODES: NodeDef[] = [
  {
    id: 'pdf-documents',
    label: 'PDF & Documents',
    href: '/categories/pdf-documents',
    Icon: FileText,
    tools: ['PDF Merger', 'PDF Splitter', 'PDF Compressor', 'Images → PDF', 'PDF → Images'],
    accent: 'violet',
    rx: 370,
    ry: 135,
    tiltDeg: 22,
    rotZ: 14,
    phaseDeg: 0,
    periodSec: 32,
  },
  {
    id: 'image',
    label: 'Image',
    href: '/categories/image',
    Icon: ImageIcon,
    tools: ['Image Compressor', 'Image Resizer', 'Image Converter', 'Image Cropper', 'Background Remover'],
    accent: 'blue',
    rx: 340,
    ry: 120,
    tiltDeg: -28,
    rotZ: -18,
    phaseDeg: 72,
    periodSec: 38,
  },
  {
    id: 'text',
    label: 'Text',
    href: '/categories/text',
    Icon: Type,
    tools: ['Word Counter', 'Text Cleaner', 'Case Converter', 'Text Diff Checker'],
    accent: 'orange',
    rx: 395,
    ry: 145,
    tiltDeg: 34,
    rotZ: 32,
    phaseDeg: 144,
    periodSec: 35,
  },
  {
    id: 'developer',
    label: 'Developer',
    href: '/categories/developer',
    Icon: Code2,
    tools: ['JSON Formatter', 'Base64 Encoder', 'URL Encoder', 'JWT Decoder'],
    accent: 'amber',
    rx: 350,
    ry: 125,
    tiltDeg: -20,
    rotZ: -12,
    phaseDeg: 216,
    periodSec: 42,
  },
  {
    id: 'security-privacy',
    label: 'Security & Privacy',
    href: '/categories/security-privacy',
    Icon: Shield,
    tools: ['Hash Generator', 'Metadata Remover'],
    accent: 'violet',
    rx: 380,
    ry: 138,
    tiltDeg: 30,
    rotZ: 24,
    phaseDeg: 288,
    periodSec: 30,
  },
];

// ─── 3D Orbital Projection ─────────────────────────────────────────
// Calculates true 3D spatial position (x, y, z) on an inclined elliptical plane
function project3DOrbit(
  angleDeg: number,
  rx: number,
  ry: number,
  tiltDeg: number,
  rotZDeg: number
) {
  const angleRad = (angleDeg * Math.PI) / 180;
  const tiltRad = (tiltDeg * Math.PI) / 180;
  const rotZRad = (rotZDeg * Math.PI) / 180;

  // Position in orbit plane
  const u = rx * Math.cos(angleRad);
  const v = ry * Math.sin(angleRad);

  // Rotate around X (inclination / tilt)
  const x1 = u;
  const y1 = v * Math.cos(tiltRad);
  const z1 = v * Math.sin(tiltRad);

  // Rotate around Z axis for realistic orbital orientation
  const cosZ = Math.cos(rotZRad);
  const sinZ = Math.sin(rotZRad);
  const x = x1 * cosZ - y1 * sinZ;
  const y = x1 * sinZ + y1 * cosZ;
  const z = z1;

  // Normalized depth: 0 (deepest background) to 1 (forefront)
  const normZ = (z / ry + 1) / 2;
  const isFront = z >= 0;

  return { x, y, z, normZ: Math.min(1, Math.max(0, normZ)), isFront };
}

export default function HeroEcosystem() {
  const anglesRef = useRef<number[]>(CATEGORY_NODES.map((n) => n.phaseDeg));
  const prevTsRef = useRef(0);
  const rafRef = useRef(0);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const logo3DRef = useRef<HTMLDivElement>(null);
  const specularRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const orbitScaleRef = useRef(1);
  const hoveredRef = useRef<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // 3D Parallax Tilt state
  const targetTiltRef = useRef({ pitch: 0, yaw: 0 });
  const currentTiltRef = useRef({ pitch: 0, yaw: 0 });

  const isReducedMotion = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  // ── Responsive Scale Calculation ─────────────────────────────────
  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth || window.innerWidth;
      // Smooth scaling from mobile (360px: 0.46) to full desktop (>1100px: 1.0)
      const scale = Math.min(1.0, Math.max(0.46, (width - 32) / 880));
      orbitScaleRef.current = scale;
    };
    updateScale();
    window.addEventListener('resize', updateScale, { passive: true });
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  // ── Parallax Mouse Interaction ───────────────────────────────────
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isReducedMotion.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const ny = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

    // Max 10 deg pitch, 14 deg yaw
    targetTiltRef.current = {
      pitch: -ny * 9,
      yaw: nx * 13,
    };

    // Update specular reflection position
    if (specularRef.current) {
      const specX = 50 + nx * 35;
      const specY = 50 + ny * 35;
      specularRef.current.style.background = `radial-gradient(circle at ${specX}% ${specY}%, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.04) 35%, transparent 65%)`;
    }
  }, []);

  const handleMouseLeaveContainer = useCallback(() => {
    targetTiltRef.current = { pitch: 0, yaw: 0 };
    setHoveredId(null);
    hoveredRef.current = null;
  }, []);

  // ── Node 3D Transformation ───────────────────────────────────────
  const updateNodeStyle = useCallback(
    (i: number, angle: number, isHovered: boolean) => {
      const el = nodeRefs.current[i];
      if (!el) return;

      const node = CATEGORY_NODES[i];
      const s = orbitScaleRef.current;
      const { x, y, normZ, isFront } = project3DOrbit(
        angle,
        node.rx * s,
        node.ry * s,
        node.tiltDeg,
        node.rotZ
      );

      // Depth Scaling: forefront nodes are 1.05x-1.12x, background nodes are 0.74x-0.84x
      const depthScale = 0.74 + 0.38 * normZ;
      const finalScale = depthScale * (isHovered ? 1.15 : 1.0);

      // Opacity: forefront is 0.95-1.0, background is 0.42-0.65
      const opacity = isHovered ? 1.0 : 0.42 + 0.58 * normZ;

      // Z-Index Layering:
      // Central T is at z-index 15.
      // Front nodes (z >= 0) pass physically IN FRONT of T (z-index 20-30).
      // Back nodes (z < 0) pass physically BEHIND T (z-index 2-10).
      const zIndex = isHovered
        ? 60
        : isFront
        ? Math.round(20 + normZ * 10)
        : Math.round(2 + normZ * 10);

      // Depth blur for distant nodes
      const blur =
        !isHovered && normZ < 0.32 ? ((0.32 - normZ) * 4).toFixed(1) : '0';

      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%) scale(${finalScale.toFixed(3)})`;
      el.style.opacity = opacity.toFixed(2);
      el.style.zIndex = String(zIndex);
      el.style.filter = Number(blur) > 0.4 ? `blur(${blur}px)` : 'none';
    },
    []
  );

  // ── Main RAF Animation Loop ──────────────────────────────────────
  const animate = useCallback(
    (ts: number) => {
      if (!prevTsRef.current) prevTsRef.current = ts;
      const dt = Math.min((ts - prevTsRef.current) / 1000, 0.05);
      prevTsRef.current = ts;

      // Smooth lerp for parallax tilt
      currentTiltRef.current.pitch +=
        (targetTiltRef.current.pitch - currentTiltRef.current.pitch) * 0.08;
      currentTiltRef.current.yaw +=
        (targetTiltRef.current.yaw - currentTiltRef.current.yaw) * 0.08;

      if (logo3DRef.current) {
        const { pitch, yaw } = currentTiltRef.current;
        // Floating sinusoidal levitation
        const floatY = Math.sin(ts * 0.0018) * 7;
        const subtleRoll = Math.sin(ts * 0.0011) * 1.5;
        logo3DRef.current.style.transform = `perspective(1200px) rotateX(${pitch.toFixed(2)}deg) rotateY(${yaw.toFixed(2)}deg) rotateZ(${subtleRoll.toFixed(2)}deg) translateY(${floatY.toFixed(2)}px)`;
      }

      // Advance orbital angles
      CATEGORY_NODES.forEach((node, i) => {
        // Slow down smoothly when hovered
        const speedFactor = hoveredRef.current === node.id ? 0.04 : 1.0;
        anglesRef.current[i] =
          (anglesRef.current[i] +
            (360 / node.periodSec) * dt * speedFactor) %
          360;
        updateNodeStyle(
          i,
          anglesRef.current[i],
          hoveredRef.current === node.id
        );
      });

      rafRef.current = requestAnimationFrame(animate);
    },
    [updateNodeStyle]
  );

  useEffect(() => {
    if (isReducedMotion.current) {
      CATEGORY_NODES.forEach((_, i) =>
        updateNodeStyle(i, anglesRef.current[i], false)
      );
      return;
    }
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate, updateNodeStyle]);

  const onNodeEnter = useCallback((id: string) => {
    setHoveredId(id);
    hoveredRef.current = id;
  }, []);

  const onNodeLeave = useCallback(() => {
    setHoveredId(null);
    hoveredRef.current = null;
  }, []);

  return (
    <div
      ref={containerRef}
      className={styles.ecosystem}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeaveContainer}
      aria-label="Interactive 3D Toolora Ecosystem"
    >
      {/* ── Ambient Volumetric Lighting (Violet Left, Orange Right) ── */}
      <div className={styles.ambientLightViolet} aria-hidden="true" />
      <div className={styles.ambientLightOrange} aria-hidden="true" />

      {/* ── 3D Rendered Orbital Path Rings ─────────────────────────── */}
      <div className={styles.orbitalPaths} aria-hidden="true">
        <svg className={styles.orbitSvg} viewBox="-500 -250 1000 500">
          <defs>
            {/* Dual-tone gradient for orbit lines */}
            <linearGradient
              id="orbitGradient1"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.4" />
              <stop offset="45%" stopColor="#3b82f6" stopOpacity="0.25" />
              <stop offset="70%" stopColor="#f97316" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.35" />
            </linearGradient>
            <linearGradient
              id="orbitGradient2"
              x1="100%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.35" />
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.35" />
            </linearGradient>
          </defs>

          {/* 5 Distinct Elliptical Orbits with 3D Spatial Tilts */}
          <ellipse
            cx="0"
            cy="0"
            rx="370"
            ry="125"
            transform="rotate(14)"
            className={styles.svgOrbitPath}
            stroke="url(#orbitGradient1)"
          />
          <ellipse
            cx="0"
            cy="0"
            rx="340"
            ry="110"
            transform="rotate(-18)"
            className={styles.svgOrbitPath}
            stroke="url(#orbitGradient2)"
          />
          <ellipse
            cx="0"
            cy="0"
            rx="395"
            ry="132"
            transform="rotate(32)"
            className={styles.svgOrbitPath}
            stroke="url(#orbitGradient1)"
          />
          <ellipse
            cx="0"
            cy="0"
            rx="350"
            ry="115"
            transform="rotate(-12)"
            className={styles.svgOrbitPath}
            stroke="url(#orbitGradient2)"
          />
          <ellipse
            cx="0"
            cy="0"
            rx="380"
            ry="128"
            transform="rotate(24)"
            className={styles.svgOrbitPath}
            stroke="url(#orbitGradient1)"
          />
        </svg>
      </div>

      {/* ── CENTRAL 3D TOOLORA T-LOGO (Hero Centerpiece) ───────────── */}
      <div className={styles.centerpieceAnchor} style={{ zIndex: 15 }}>
        <div ref={logo3DRef} className={styles.logo3DObject}>
          {/* Spatial Depth Layers / 3D Bevel Extrusion */}
          <div className={styles.depthExtrusionBack} aria-hidden="true" />
          <div className={styles.depthExtrusionMid} aria-hidden="true" />

          {/* Glowing Aura Halos (Violet Left, Amber Right) */}
          <div className={styles.logoHaloViolet} aria-hidden="true" />
          <div className={styles.logoHaloOrange} aria-hidden="true" />

          {/* Cosmic Energy Orbit Ring around T */}
          <div className={styles.logoEnergyRing} aria-hidden="true" />

          {/* Dynamic Light Sweep & Specular Reflection */}
          <div
            ref={specularRef}
            className={styles.logoSpecular}
            aria-hidden="true"
          />

          {/* The Exact Official Isolated 3D T Logo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/t-logo.png"
            alt="Toolora 3D T Logo — All the Tools. One Place."
            className={styles.logoTImage}
            draggable={false}
            width={300}
            height={300}
          />

          {/* Spatial Floor Shadow beneath floating 3D T */}
          <div className={styles.logoFloorShadow} aria-hidden="true" />
        </div>
      </div>

      {/* ── 5 Orbiting 3D Category Nodes ───────────────────────────── */}
      <div className={styles.orbitField} aria-label="Tool categories ecosystem">
        {CATEGORY_NODES.map((node, i) => {
          const { Icon } = node;
          const isHovered = hoveredId === node.id;

          return (
            <div
              key={node.id}
              ref={(el) => {
                nodeRefs.current[i] = el;
              }}
              className={styles.nodeWrapper}
              onMouseEnter={() => onNodeEnter(node.id)}
              onMouseLeave={onNodeLeave}
            >
              {/* Floating 3D Capsule Node */}
              <Link
                href={node.href}
                className={`${styles.nodeCapsule} ${
                  styles[`capsule_${node.accent}`]
                } ${isHovered ? styles.capsuleActive : ''}`}
                prefetch
                aria-label={`Explore ${node.label} tools`}
              >
                {/* Dynamic Glass Sheen */}
                <span className={styles.capsuleSheen} aria-hidden="true" />

                {/* Category Icon Badge */}
                <span
                  className={`${styles.iconBadge} ${
                    styles[`badge_${node.accent}`]
                  }`}
                >
                  <Icon size={16} strokeWidth={1.75} />
                </span>

                {/* Category Name */}
                <span className={styles.nodeTitle}>{node.label}</span>

                {/* Brand-colored status light */}
                <span
                  className={`${styles.statusDot} ${
                    styles[`dot_${node.accent}`]
                  }`}
                  aria-hidden="true"
                />
              </Link>

              {/* Rich Glassmorphic Tool Preview Panel */}
              <div
                className={`${styles.toolPreview} ${
                  isHovered ? styles.previewVisible : ''
                }`}
                aria-hidden={!isHovered}
              >
                <div className={styles.previewPointer} />
                <div className={styles.previewHeader}>
                  <span
                    className={`${styles.previewCategory} ${
                      styles[`previewText_${node.accent}`]
                    }`}
                  >
                    {node.label}
                  </span>
                  <span className={styles.previewCount}>
                    {node.tools.length} tools
                  </span>
                </div>
                <div className={styles.previewList}>
                  {node.tools.map((toolName) => (
                    <span key={toolName} className={styles.previewToolItem}>
                      <span
                        className={`${styles.previewBullet} ${
                          styles[`bullet_${node.accent}`]
                        }`}
                      />
                      {toolName}
                    </span>
                  ))}
                </div>
                <div
                  className={`${styles.previewFooter} ${
                    styles[`previewText_${node.accent}`]
                  }`}
                >
                  <span>Explore category</span>
                  <span aria-hidden="true">→</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Subtle Ambient Cosmic Floating Micro-Particles ─────────── */}
      <div className={styles.cosmicParticles} aria-hidden="true">
        {Array.from({ length: 16 }).map((_, idx) => (
          <span
            key={idx}
            className={styles.microParticle}
            style={
              {
                '--p-x': `${(idx * 6.7) % 100}%`,
                '--p-y': `${(idx * 11.3) % 75 + 12}%`,
                '--p-dur': `${5 + (idx % 6) * 1.8}s`,
                '--p-delay': `${(idx % 5) * 0.9}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    </div>
  );
}
