'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './CustomCursor.module.css';

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    // Hide native cursor globally
    document.documentElement.classList.add('custom-cursor-active');

    let rafId = 0;
    let ringX = window.innerWidth / 2;
    let ringY = window.innerHeight / 2;
    let dotX  = ringX;
    let dotY  = ringY;
    let targetX = ringX;
    let targetY = ringY;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const onEnterInteractive = () => setActive(true);
    const onLeaveInteractive = () => setActive(false);

    // Selector for interactive elements
    const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label, [tabindex]';

    const onOver = (e: MouseEvent) => {
      const el = (e.target as Element).closest(INTERACTIVE);
      setActive(!!el);
    };

    document.addEventListener('mousemove', onMove,  { passive: true });
    document.addEventListener('mouseover', onOver,  { passive: true });
    document.addEventListener('mousedown', onEnterInteractive);
    document.addEventListener('mouseup',   onLeaveInteractive);

    const tick = () => {
      // Dot follows instantly
      dotX = targetX;
      dotY = targetY;

      // Ring follows with smooth lerp
      ringX += (targetX - ringX) * 0.12;
      ringY += (targetY - ringY) * 0.12;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      document.documentElement.classList.remove('custom-cursor-active');
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mousedown', onEnterInteractive);
      document.removeEventListener('mouseup',   onLeaveInteractive);
    };
  }, []);

  return (
    <>
      {/* Dot — instant position */}
      <div
        ref={dotRef}
        className={`${styles.dot} ${active ? styles.dotActive : ''}`}
        aria-hidden
      />
      {/* Ring — lags behind */}
      <div
        ref={ringRef}
        className={`${styles.ring} ${active ? styles.ringActive : ''}`}
        aria-hidden
      />
    </>
  );
}
