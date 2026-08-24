import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ArrowLeft, Upload, Download, Lock, Zap,
  FilePlus2, Scissors, FileArchive, Images, ImageDown,
  Minimize2, Expand, RefreshCw, Crop, Eraser,
  Hash, Sparkles, CaseSensitive, GitCompare,
  Braces, Binary, Link2, KeyRound,
  ShieldCheck, EyeOff, FileText, Image, Type, Code2, Shield,
} from 'lucide-react';
import { TOOLS, CATEGORIES } from '@/data/tools';
import styles from './tool.module.css';

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

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  'pdf-documents':    FileText,
  'image':            Image,
  'text':             Type,
  'developer':        Code2,
  'security-privacy': Shield,
};

const CATEGORY_ACCENT: Record<string, string> = {
  'pdf-documents':    'violet',
  'image':            'blue',
  'text':             'orange',
  'developer':        'amber',
  'security-privacy': 'violet',
};

// Generate metadata per tool
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = TOOLS.find((t) => t.slug === slug);
  if (!tool) return { title: 'Tool Not Found' };

  return {
    title: `${tool.name} — Toolora`,
    description: tool.description,
  };
}

// Pre-generate all 20 tool slugs at build time
export async function generateStaticParams() {
  return TOOLS.map((tool) => ({ slug: tool.slug }));
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = TOOLS.find((t) => t.slug === slug);
  if (!tool) notFound();

  const ToolIcon = TOOL_ICONS[tool.id] ?? Zap;
  const CatIcon = CATEGORY_ICONS[tool.category] ?? FileText;
  const accent = CATEGORY_ACCENT[tool.category] ?? 'violet';
  const category = CATEGORIES.find((c) => c.slug === tool.category);

  // Related tools (same category, excluding current)
  const relatedTools = TOOLS.filter(
    (t) => t.category === tool.category && t.id !== tool.id
  ).slice(0, 4);

  return (
    <div className={`${styles.page} ${styles[`accent-${accent}`]}`}>
      {/* Background glow */}
      <div className={styles.pageGlow} aria-hidden="true" />

      <div className="container">
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/tools" className={styles.breadcrumbLink}>
            <ArrowLeft size={14} />
            All Tools
          </Link>
          {category && (
            <>
              <span className={styles.breadcrumbSep} aria-hidden="true">/</span>
              <Link
                href={`/categories/${category.slug}`}
                className={styles.breadcrumbLink}
              >
                {category.name}
              </Link>
            </>
          )}
          <span className={styles.breadcrumbSep} aria-hidden="true">/</span>
          <span className={styles.breadcrumbCurrent}>{tool.name}</span>
        </nav>

        {/* Tool header */}
        <div className={styles.toolHeader}>
          <div className={styles.headerLeft}>
            <div className={`${styles.toolIconWrap} ${styles[`icon-${accent}`]}`}>
              <ToolIcon size={28} strokeWidth={1.5} />
            </div>
            <div>
              <div className={styles.categoryTag}>
                <CatIcon size={12} strokeWidth={2} />
                <span>{category?.name}</span>
              </div>
              <h1 className={styles.toolTitle}>{tool.name}</h1>
              <p className={styles.toolDesc}>{tool.description}</p>
            </div>
          </div>

          {/* Badges */}
          <div className={styles.badges}>
            {tool.processedLocally && (
              <div className={styles.privacyBadge}>
                <Lock size={12} />
                <span>Processed locally in your browser</span>
              </div>
            )}
            <div className={styles.speedBadge}>
              <Zap size={12} />
              <span>Fast & free</span>
            </div>
          </div>
        </div>

        {/* ── Tool workspace (shell / coming soon) ─────────── */}
        <div className={styles.workspace}>
          {/* Upload area */}
          <div className={styles.uploadArea}>
            <div className={styles.uploadIcon} aria-hidden="true">
              <Upload size={32} strokeWidth={1.5} />
            </div>
            <h2 className={styles.uploadTitle}>Drop your file here</h2>
            <p className={styles.uploadSubtitle}>
              or click to browse from your device
            </p>
            <button className={`${styles.uploadBtn} ${styles[`btn-${accent}`]}`} type="button">
              <Upload size={16} />
              Select File
            </button>
            <p className={styles.uploadNote}>
              Tool functionality coming soon — this page shows the Toolora shell architecture.
            </p>
          </div>

          {/* Controls area (placeholder) */}
          <div className={styles.controls}>
            <h3 className={styles.controlsTitle}>Options</h3>
            <div className={styles.controlRow}>
              <div className={styles.controlPlaceholder} style={{ width: '60%' }} />
              <div className={styles.controlPlaceholder} style={{ width: '30%' }} />
            </div>
            <div className={styles.controlRow}>
              <div className={styles.controlPlaceholder} style={{ width: '45%' }} />
              <div className={styles.controlPlaceholder} style={{ width: '45%' }} />
            </div>
          </div>

          {/* Action button */}
          <button
            className={`${styles.actionBtn} ${styles[`btn-${accent}`]}`}
            type="button"
            disabled
          >
            <Zap size={16} />
            Run {tool.name}
          </button>

          {/* Result area (placeholder) */}
          <div className={styles.resultArea}>
            <div className={styles.resultPlaceholder}>
              <Download size={24} className={styles.resultIcon} />
              <p>Your result will appear here</p>
            </div>
          </div>
        </div>

        {/* Privacy note */}
        {tool.processedLocally && (
          <div className={styles.privacyNote}>
            <Lock size={14} />
            <p>
              <strong>Privacy first.</strong> This tool processes your files
              entirely in your browser. Nothing is uploaded to our servers.
            </p>
          </div>
        )}

        {/* Related tools */}
        {relatedTools.length > 0 && (
          <div className={styles.relatedSection}>
            <h3 className={styles.relatedTitle}>More {category?.name} tools</h3>
            <div className={styles.relatedGrid}>
              {relatedTools.map((rt) => {
                const RelIcon = TOOL_ICONS[rt.id] ?? Zap;
                return (
                  <Link
                    key={rt.id}
                    href={`/tools/${rt.slug}`}
                    className={`${styles.relatedCard} ${styles[`accent-${accent}`]}`}
                  >
                    <div className={`${styles.relatedIcon} ${styles[`icon-${accent}`]}`}>
                      <RelIcon size={16} strokeWidth={1.5} />
                    </div>
                    <div>
                      <span className={styles.relatedName}>{rt.name}</span>
                      <span className={styles.relatedDesc}>{rt.description}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
