'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Search } from 'lucide-react';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/tools', label: 'All Tools' },
  { href: '/categories', label: 'Categories' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const openSearch = () => {
    window.dispatchEvent(new CustomEvent('toolora:open-search'));
    setMobileOpen(false);
  };

  return (
    <>
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.inner}>
          {/* Brand — official logo + wordmark */}
          <Link href="/" className={styles.brand} aria-label="Toolora home">
            <div className={styles.logoWrap}>
              {/* Plain <img> — avoids next/image placeholder states */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="Toolora"
                width={32}
                height={32}
                className={styles.logoImg}
                draggable={false}
              />
            </div>
            <span className={styles.wordmark}>TOOLORA</span>
          </Link>

          {/* Desktop nav links */}
          <ul className={styles.navLinks} role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={styles.navLink}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop right: search button + CTA */}
          <div className={styles.navRight}>
            <button
              type="button"
              onClick={openSearch}
              className={styles.searchBtn}
              aria-label="Search tools (Ctrl+K)"
            >
              <Search size={14} />
              <span>Search</span>
              <kbd>⌘K</kbd>
            </button>
            <Link href="/tools" className={styles.ctaBtn}>
              Open Tools
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className={styles.hamburger}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={`${styles.mobileOverlay} ${mobileOpen ? styles.mobileOpen : ''}`}
        aria-hidden={!mobileOpen}
      >
        <nav className={styles.mobileNav}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={styles.mobileNavLink}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={openSearch}
            className={styles.mobileNavLink}
            style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', font: 'inherit', color: 'inherit' }}
          >
            Search tools
          </button>
          <Link
            href="/tools"
            className={`${styles.ctaBtn} ${styles.mobileCta}`}
            onClick={() => setMobileOpen(false)}
          >
            Open Tools
          </Link>
        </nav>
      </div>
    </>
  );
}
