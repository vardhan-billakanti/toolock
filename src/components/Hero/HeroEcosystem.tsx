'use client';

import { useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { FileText, Image as ImageIcon, Type, Code2, Shield } from 'lucide-react';
import styles from './HeroEcosystem.module.css';

export default function HeroEcosystem() {
  const containerRef = useRef<HTMLDivElement>(null);
  const logo3DRef = useRef<HTMLDivElement>(null);
  const specularRef = useRef<HTMLDivElement>(null);
  const targetTiltRef = useRef({ pitch: 0, yaw: 0 });
  const currentTiltRef = useRef({ pitch: 0, yaw: 0 });
  const rafRef = useRef<number>(0);
  const isAnimatingRef = useRef(false);
  const isVisibleRef = useRef(true);

  // Smooth lerp tilt loop — only runs when mouse tilt is actively changing
  const tickTilt = useCallback(() => {
    if (!isVisibleRef.current) {
      isAnimatingRef.current = false;
      return;
    }

    const current = currentTiltRef.current;
    const target = targetTiltRef.current;

    current.pitch += (target.pitch - current.pitch) * 0.12;
    current.yaw += (target.yaw - current.yaw) * 0.12;

    if (logo3DRef.current) {
      logo3DRef.current.style.setProperty('--pitch', `${current.pitch.toFixed(2)}deg`);
      logo3DRef.current.style.setProperty('--yaw', `${current.yaw.toFixed(2)}deg`);
    }

    const diff = Math.abs(target.pitch - current.pitch) + Math.abs(target.yaw - current.yaw);
    if (diff > 0.01) {
      rafRef.current = requestAnimationFrame(tickTilt);
    } else {
      isAnimatingRef.current = false;
    }
  }, []);

  const requestTiltUpdate = useCallback(() => {
    if (!isAnimatingRef.current && isVisibleRef.current) {
      isAnimatingRef.current = true;
      rafRef.current = requestAnimationFrame(tickTilt);
    }
  }, [tickTilt]);

  // Pause animations when hero is scrolled out of viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting && !isAnimatingRef.current) {
          requestTiltUpdate();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [requestTiltUpdate]);

  // Parallax Mouse Interaction on 3D T
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const nx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const ny = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

      targetTiltRef.current = {
        pitch: -ny * 6,
        yaw: nx * 9,
      };

      if (specularRef.current) {
        const specX = 50 + nx * 26;
        const specY = 50 + ny * 26;
        specularRef.current.style.background = `radial-gradient(circle at ${specX}% ${specY}%, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0.05) 30%, transparent 60%)`;
      }

      requestTiltUpdate();
    },
    [requestTiltUpdate]
  );

  const handleMouseLeaveContainer = useCallback(() => {
    targetTiltRef.current = { pitch: 0, yaw: 0 };
    requestTiltUpdate();
  }, [requestTiltUpdate]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={styles.ecosystem}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeaveContainer}
      aria-label="Interactive 3D Toolock Logo with Multi-Plane Orbit System"
    >
      {/* ── Ambient Subtle Dual-Tone Glow (Violet Left, Orange Right) ── */}
      <div className={styles.ambientGlowViolet} aria-hidden="true" />
      <div className={styles.ambientGlowOrange} aria-hidden="true" />

      {/* ── MULTI-PLANE ORBIT SYSTEM (Surrounding the 3D T) ─────────── */}
      <div className={styles.multiPlaneOrbitContainer}>
        {/* ORBIT TRACK A (Main Horizontal Plane — Tilt -6°) */}
        <div className={styles.trackPlaneA} aria-hidden="true">
          <svg className={styles.orbitSvg} viewBox="0 0 840 240">
            <defs>
              <linearGradient id="orbitGradA" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.45" />
                <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.45" />
              </linearGradient>
            </defs>
            <ellipse cx="420" cy="120" rx="390" ry="85" stroke="url(#orbitGradA)" fill="none" strokeWidth="1" strokeDasharray="6 8" />
          </svg>
        </div>

        {/* ORBIT TRACK B (Secondary Tilted 3D Plane — Tilt +22°) */}
        <div className={styles.trackPlaneB} aria-hidden="true">
          <svg className={styles.orbitSvg} viewBox="0 0 740 280">
            <defs>
              <linearGradient id="orbitGradB" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.45" />
                <stop offset="50%" stopColor="#f97316" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.45" />
              </linearGradient>
            </defs>
            <ellipse cx="370" cy="140" rx="330" ry="110" stroke="url(#orbitGradB)" fill="none" strokeWidth="0.9" strokeDasharray="5 7" />
          </svg>
        </div>

        {/* ORBIT TRACK C (Depth Plane — Tilt -18°) */}
        <div className={styles.trackPlaneC} aria-hidden="true">
          <svg className={styles.orbitSvg} viewBox="0 0 600 220">
            <defs>
              <linearGradient id="orbitGradC" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            <ellipse cx="300" cy="110" rx="270" ry="85" stroke="url(#orbitGradC)" fill="none" strokeWidth="0.8" strokeDasharray="4 6" />
          </svg>
        </div>

        {/* ── ORBIT A SATELLITES (24s cycle, Main Horizontal Orbit) ──── */}
        {/* 1. PDF & Documents */}
        <div className={`${styles.satelliteAnchor} ${styles.orbitA_Slot1}`}>
          <Link
            href="/categories/pdf-documents"
            className={`${styles.orbitPill} ${styles['accent-violet']}`}
            title="Explore PDF & Documents tools"
          >
            <span className={styles.pillIconWrap}>
              <FileText size={13} strokeWidth={2} />
            </span>
            <span className={styles.pillLabel}>PDF & Documents</span>
          </Link>
        </div>

        {/* 2. Image */}
        <div className={`${styles.satelliteAnchor} ${styles.orbitA_Slot2}`}>
          <Link
            href="/categories/image"
            className={`${styles.orbitPill} ${styles['accent-blue']}`}
            title="Explore Image tools"
          >
            <span className={styles.pillIconWrap}>
              <ImageIcon size={13} strokeWidth={2} />
            </span>
            <span className={styles.pillLabel}>Image</span>
          </Link>
        </div>

        {/* ── ORBIT B SATELLITES (30s cycle, Tilted 3D Orbit) ────────── */}
        {/* 3. Developer */}
        <div className={`${styles.satelliteAnchor} ${styles.orbitB_Slot1}`}>
          <Link
            href="/categories/developer"
            className={`${styles.orbitPill} ${styles['accent-violet']}`}
            title="Explore Developer tools"
          >
            <span className={styles.pillIconWrap}>
              <Code2 size={13} strokeWidth={2} />
            </span>
            <span className={styles.pillLabel}>Developer</span>
          </Link>
        </div>

        {/* 4. Security & Privacy */}
        <div className={`${styles.satelliteAnchor} ${styles.orbitB_Slot2}`}>
          <Link
            href="/categories/security-privacy"
            className={`${styles.orbitPill} ${styles['accent-amber']}`}
            title="Explore Security & Privacy tools"
          >
            <span className={styles.pillIconWrap}>
              <Shield size={13} strokeWidth={2} />
            </span>
            <span className={styles.pillLabel}>Security & Privacy</span>
          </Link>
        </div>

        {/* ── ORBIT C SATELLITE (36s cycle, Depth Plane) ─────────────── */}
        {/* 5. Text */}
        <div className={`${styles.satelliteAnchor} ${styles.orbitC_Slot1}`}>
          <Link
            href="/categories/text"
            className={`${styles.orbitPill} ${styles['accent-orange']}`}
            title="Explore Text tools"
          >
            <span className={styles.pillIconWrap}>
              <Type size={13} strokeWidth={2} />
            </span>
            <span className={styles.pillLabel}>Text</span>
          </Link>
        </div>
      </div>

      {/* ── FLOATING 3D TOOLOCK T-LOGO (Hero Centerpiece - Stationary in Center) ── */}
      <div className={styles.centerpieceAnchor}>
        <div ref={logo3DRef} className={styles.logo3DObject}>
          {/* Subtle Aura Halos */}
          <div className={styles.logoHaloViolet} aria-hidden="true" />
          <div className={styles.logoHaloOrange} aria-hidden="true" />

          {/* Dynamic Light Sweep & Specular Reflection */}
          <div ref={specularRef} className={styles.logoSpecular} aria-hidden="true" />

          {/* Official Isolated 3D T Logo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/t-logo.png"
            alt="Toolock 3D T Logo — All the Tools. One Place."
            className={styles.logoTImage}
            draggable={false}
            width={280}
            height={280}
            fetchPriority="high"
          />

          {/* Spatial Floor Shadow beneath floating 3D T */}
          <div className={styles.logoFloorShadow} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
