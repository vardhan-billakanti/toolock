import Link from 'next/link';
import type { Metadata } from 'next';
import styles from './not-found.module.css';

export const metadata: Metadata = {
  title: '404 — Page Not Found | Toolock',
};

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.glowBg} aria-hidden="true" />
        <p className={styles.code}>404</p>
        <h1 className={styles.title}>Page not found</h1>
        <p className={styles.desc}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className={styles.actions}>
          <Link href="/" className={styles.homeBtn}>
            Go home
          </Link>
          <Link href="/tools" className={styles.toolsBtn}>
            Browse all tools
          </Link>
        </div>
      </div>
    </div>
  );
}
