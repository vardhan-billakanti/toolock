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
  const year = new Date().getFullYear();

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
                alt="Toolora"
                width={36}
                height={36}
                className={styles.logo}
              />
            </div>
            <div className={styles.brandText}>
              <span className={styles.wordmark}>TOOLORA</span>
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

        {/* Bottom bar */}
        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {year} Toolora. All rights reserved.
          </p>
          <p className={styles.madeWith}>
            Built for productivity. Designed for precision.
          </p>
        </div>
      </div>
    </footer>
  );
}
