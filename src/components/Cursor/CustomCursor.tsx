'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './CustomCursor.module.css';

export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    // Disable on touch / coarse pointer devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let rafId = 0;
    let isRunning = false;
    let ringX = -100;
    let ringY = -100;
    let targetX = -100;
    let targetY = -100;

    const tick = () => {
      // Ring trails with smooth lerp
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }

      const dist = Math.abs(targetX - ringX) + Math.abs(targetY - ringY);
      if (dist > 0.15) {
        rafId = requestAnimationFrame(tick);
      } else {
        isRunning = false;
      }
    };

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

      if (!isRunning) {
        isRunning = true;
        rafId = requestAnimationFrame(tick);
      }
    };

    // Selector for interactive elements
    const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label, [tabindex]';

    const onOver = (e: MouseEvent) => {
      const el = (e.target as Element).closest(INTERACTIVE);
      setActive(!!el);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
    };
  }, []);

  return (
    <div
      ref={ringRef}
      className={`${styles.cursorRing} ${active ? styles.cursorRingActive : ''}`}
      aria-hidden="true"
    />
  );
}
