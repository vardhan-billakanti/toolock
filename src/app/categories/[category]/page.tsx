import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ArrowRight, Zap, Home,
  FilePlus2, Scissors, FileArchive, Images, ImageDown,
  Minimize2, Expand, RefreshCw, Crop, Eraser,
  Hash, Sparkles, CaseSensitive, GitCompare,
  Braces, Binary, Link2, KeyRound,
  ShieldCheck, EyeOff, FileText, Image, Type, Code2, Shield,
  Lock,
} from 'lucide-react';
import { CATEGORIES, TOOLS } from '@/data/tools';
import styles from './category.module.css';

const CAT_ICONS: Record<string, React.ElementType> = {
  'pdf-documents':    FileText,
  'image':            Image,
  'text':             Type,
  'developer':        Code2,
  'security-privacy': Shield,
};

const TOOL_ICONS: Record<string, React.ElementType> = {
  'pdf-merger':           FilePlus2,
  'pdf-splitter':         Scissors,
  'pdf-compressor':       FileArchive,
  'images-to-pdf':        Images,
  'pdf-to-images':        ImageDown,
  'image-compressor':     Minimize2,
  'image-resizer':        Expand,
  'image-converter':      RefreshCw,
  'image-cropper':        Crop,
  'background-remover':   Eraser,
  'word-counter':         Hash,
  'text-cleaner':         Sparkles,
  'text-case-converter':  CaseSensitive,
  'text-diff-checker':    GitCompare,
  'json-formatter':       Braces,
  'base64-encoder':       Binary,
  'url-encoder':          Link2,
  'jwt-decoder':          KeyRound,
  'hash-generator':       ShieldCheck,
  'metadata-remover':     EyeOff,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = CATEGORIES.find((c) => c.slug === category);
  if (!cat) return { title: 'Category Not Found' };

  return {
    title: `${cat.name} Tools — Toolock`,
    description: cat.description,
  };
}

export async function generateStaticParams() {
  return CATEGORIES.map((cat) => ({ category: cat.slug }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = CATEGORIES.find((c) => c.slug === category);
  if (!cat) notFound();

  const CatIcon = CAT_ICONS[cat.slug] ?? FileText;
  const tools = TOOLS.filter((t) => t.category === cat.slug);

  return (
    <div className={`${styles.page} ${styles[`accent-${cat.accentColor}`]}`}>
      <div className={styles.pageGlow} aria-hidden="true" />

      <div className="container">
        {/* Breadcrumb Navigation: Home / All Tools / [Category] */}
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/" className={styles.breadcrumbLink} title="Return to Home">
            <Home size={13} />
            Home
          </Link>
          <span className={styles.sep} aria-hidden="true">/</span>
          <Link href="/tools" className={styles.breadcrumbLink} title="Browse All Tools">
            All Tools
          </Link>
          <span className={styles.sep} aria-hidden="true">/</span>
          <span className={styles.current} aria-current="page">{cat.name}</span>
        </nav>

        {/* Category header */}
        <div className={styles.catHeader}>
          <div className={`${styles.catIcon} ${styles[`icon-${cat.accentColor}`]}`}>
            <CatIcon size={32} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className={styles.catTitle}>{cat.name}</h1>
            <p className={styles.catDesc}>{cat.description}</p>
          </div>
        </div>

        {/* Tools grid */}
        <div className={styles.grid}>
          {tools.map((tool) => {
            const ToolIcon = TOOL_ICONS[tool.id] ?? Zap;
            return (
              <Link
                key={tool.id}
                href={`/tools/${tool.slug}`}
                className={`${styles.toolCard} ${styles[`accent-${cat.accentColor}`]}`}
              >
                <div className={styles.cardGlow} aria-hidden="true" />
                <div className={styles.cardTop}>
                  <div className={`${styles.toolIcon} ${styles[`icon-${cat.accentColor}`]}`}>
                    <ToolIcon size={20} strokeWidth={1.5} />
                  </div>
                  {tool.processedLocally && (
                    <span className={styles.localBadge}>
                      <Lock size={10} />
                      Local
                    </span>
                  )}
                </div>
                <h3 className={styles.toolName}>{tool.name}</h3>
                <p className={styles.toolDesc}>{tool.description}</p>
                <span className={styles.openLink}>
                  Open tool <ArrowRight size={13} className={styles.arrow} />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
