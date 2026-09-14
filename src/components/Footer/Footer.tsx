import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';

const FOOTER_LINKS = [
  { href: '/tools',       label: 'All Tools' },
  { href: '/categories',  label: 'Categories' },
  { href: '/about',       label: 'About' },
  { href: '/privacy',     label: 'Privacy' },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.divider} aria-hidden="true" />

      <div className="container">
        <div className={styles.inner}>
          {/* Brand */}
          <div className={styles.brand}>
            <div className={styles.logoWrap}>
              <Image
                src="/logo.png"
                alt="Toolock"
                width={36}
                height={36}
                className={styles.logo}
              />
            </div>
            <div className={styles.brandText}>
              <span className={styles.wordmark}>TOOLOCK</span>
              <span className={styles.tagline}>ALL THE TOOLS. ONE PLACE.</span>
            </div>
          </div>

          {/* Links */}
          <nav className={styles.links} aria-label="Footer navigation">
            {FOOTER_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={styles.link}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom creator credit */}
        <div className={styles.bottom}>
          <p className={styles.creditTagline}>
            Built for productivity. Designed for precision.
          </p>
          <p className={styles.creditAuthor}>
            <span className={styles.creditPrefix}>Designed &amp; Developed by</span>{' '}
            <a
              href="https://vardhanbillakanti.in/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.creatorLink}
            >
              Billakanti Jaya Vardhan
            </a>
          </p>
          <p className={styles.creditCopyright}>
            © 2026 · All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
