import Link from 'next/link';
import { FileText, Image, Type, Code2, Shield, ArrowRight } from 'lucide-react';
import { CATEGORIES, getToolsByCategory } from '@/data/tools';
import styles from './ExploreSection.module.css';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  'pdf-documents': FileText,
  'image': Image,
  'text': Type,
  'developer': Code2,
  'security-privacy': Shield,
};

export default function ExploreSection() {
  return (
    <section className={styles.section} id="explore">
      <div className="container">
        <div className={styles.header}>
          <span className="section-label">Categories</span>
          <h2 className="section-title">Explore Toolock</h2>
          <p className="section-subtitle">
            Five powerful categories. 20 useful tools. All in one place.
          </p>
        </div>

        <div className={styles.grid}>
          {CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.slug] ?? FileText;
            const toolCount = getToolsByCategory(cat.slug).length;

            return (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className={`${styles.card} ${styles[`accent-${cat.accentColor}`]}`}
              >
                <div className={styles.cardTop}>
                  <div className={styles.iconWrap}>
                    <Icon size={22} strokeWidth={1.5} />
                  </div>
                  <span className={styles.toolCount}>{toolCount} tools</span>
                </div>

                <h3 className={styles.catName}>{cat.name}</h3>
                <p className={styles.catDesc}>{cat.description}</p>

                <div className={styles.cardAction}>
                  <span>View category</span>
                  <ArrowRight size={14} className={styles.arrow} />
                </div>

                {/* Accent corner glow */}
                <div className={styles.cornerGlow} aria-hidden="true" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
