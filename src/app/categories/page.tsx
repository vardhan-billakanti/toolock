import type { Metadata } from 'next';
import Link from 'next/link';
import { FileText, Image, Type, Code2, Shield, ArrowRight } from 'lucide-react';
import { CATEGORIES, TOOLS } from '@/data/tools';
import styles from './categories.module.css';

export const metadata: Metadata = {
  title: 'All Categories — Toolock',
  description: 'Browse all Toolock tool categories: PDF, Image, Text, Developer and Security tools.',
};

const CAT_ICONS: Record<string, React.ElementType> = {
  'pdf-documents':    FileText,
  'image':            Image,
  'text':             Type,
  'developer':        Code2,
  'security-privacy': Shield,
};

export default function CategoriesPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <span className="section-label">Browse</span>
          <h1 className={styles.title}>All Categories</h1>
          <p className={styles.subtitle}>
            Five focused categories. Every tool you need.
          </p>
        </div>

        <div className={styles.grid}>
          {CATEGORIES.map((cat) => {
            const CatIcon = CAT_ICONS[cat.slug] ?? FileText;
            const tools = TOOLS.filter((t) => t.category === cat.slug);
            return (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className={`${styles.card} ${styles[`accent-${cat.accentColor}`]}`}
              >
                <div className={styles.cardGlow} aria-hidden="true" />
                <div className={styles.cardContent}>
                  <div className={`${styles.catIcon} ${styles[`icon-${cat.accentColor}`]}`}>
                    <CatIcon size={26} strokeWidth={1.5} />
                  </div>
                  <h2 className={styles.catName}>{cat.name}</h2>
                  <p className={styles.catDesc}>{cat.description}</p>
                  <div className={styles.toolList}>
                    {tools.map((t) => (
                      <span key={t.id} className={styles.toolChip}>{t.name}</span>
                    ))}
                  </div>
                </div>
                <div className={styles.viewCat}>
                  <span className={styles.toolCountTag}>{tools.length} tools</span>
                  <span className={styles.viewCatLink}>
                    View category <ArrowRight size={14} className={styles.arrow} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
