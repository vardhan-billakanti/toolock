import type { Metadata } from 'next';
import SearchTrigger from '@/components/CommandPalette/SearchTrigger';
import ExploreSection from '@/components/ExploreSection/ExploreSection';
import PopularTools from '@/components/PopularTools/PopularTools';
import HeroEcosystemLoader from '@/components/Hero/HeroEcosystemLoader';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Toolora — All the Tools. One Place.',
  description:
    'Toolora is a premium all-in-one digital tools platform for PDFs, images, text, development and security. Fast, simple and private.',
};

export default function HomePage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className={styles.hero} aria-label="Toolora hero">
        {/* Scan-line texture */}
        <div className={styles.scanLines} aria-hidden="true" />

        <div className={styles.heroContent}>
          {/* 3D Ecosystem — dominant visual centerpiece */}
          <div className={styles.ecosystemWrap}>
            <HeroEcosystemLoader />
          </div>

          {/* Hero text block below the ecosystem */}
          <div className={styles.heroText}>
            <h1 className={styles.heroHeadline}>
              <span className={styles.headlineTop}>ALL THE TOOLS.</span>
              <span className={styles.headlineBottom}>ONE PLACE.</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Powerful tools for your files, images, text, development and
              security — designed to be fast, simple and private.
            </p>

            {/* Command palette trigger */}
            <div className={styles.searchWrap}>
              <SearchTrigger />
            </div>

            {/* Stats */}
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>20</span>
                <span className={styles.statLabel}>Tools</span>
              </div>
              <div className={styles.statDivider} aria-hidden="true" />
              <div className={styles.stat}>
                <span className={styles.statNumber}>5</span>
                <span className={styles.statLabel}>Categories</span>
              </div>
              <div className={styles.statDivider} aria-hidden="true" />
              <div className={styles.stat}>
                <span className={styles.statNumber}>100%</span>
                <span className={styles.statLabel}>Free</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className={styles.heroFade} aria-hidden="true" />
      </section>

      {/* ── Explore categories ────────────────────────────── */}
      <ExploreSection />

      {/* ── Popular tools ─────────────────────────────────── */}
      <PopularTools />
    </>
  );
}
