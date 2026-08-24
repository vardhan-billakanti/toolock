'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search, FileText, Image, Type, Code2, Shield, ArrowRight, Zap,
  FilePlus2, Scissors, FileArchive, Images, ImageDown,
  Minimize2, Expand, RefreshCw, Crop, Eraser,
  Hash, Sparkles, CaseSensitive, GitCompare,
  Braces, Binary, Link2, KeyRound,
  ShieldCheck, EyeOff,
} from 'lucide-react';
import { TOOLS, CATEGORIES, type CategorySlug } from '@/data/tools';
import styles from './tools.module.css';

const TOOL_ICONS: Record<string, React.ElementType> = {
  'pdf-merger':         FilePlus2,
  'pdf-splitter':       Scissors,
  'pdf-compressor':     FileArchive,
  'images-to-pdf':      Images,
  'pdf-to-images':      ImageDown,
  'image-compressor':   Minimize2,
  'image-resizer':      Expand,
  'image-converter':    RefreshCw,
  'image-cropper':      Crop,
  'background-remover': Eraser,
  'word-counter':       Hash,
  'text-cleaner':       Sparkles,
  'text-case-converter': CaseSensitive,
  'text-diff-checker':  GitCompare,
  'json-formatter':     Braces,
  'base64-encoder':     Binary,
  'url-encoder':        Link2,
  'jwt-decoder':        KeyRound,
  'hash-generator':     ShieldCheck,
  'metadata-remover':   EyeOff,
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

const CATEGORY_LABELS: Record<string, string> = {
  'pdf-documents':    'PDF',
  'image':            'Image',
  'text':             'Text',
  'developer':        'Dev',
  'security-privacy': 'Security',
};

type FilterCategory = CategorySlug | 'all';

export default function AllToolsPage() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');

  const filtered = useMemo(() => {
    return TOOLS.filter((t) => {
      const matchesCategory =
        activeCategory === 'all' || t.category === activeCategory;
      const q = query.toLowerCase().trim();
      const matchesQuery =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags?.some((tag) => tag.includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [query, activeCategory]);

  return (
    <div className={styles.page}>
      <div className="container">
        {/* Header */}
        <div className={styles.pageHeader}>
          <span className="section-label">All Tools</span>
          <h1 className={styles.pageTitle}>
            {TOOLS.length} Tools. Every Category.
          </h1>
          <p className={styles.pageDesc}>
            Find the right tool for the job — fast.
          </p>
        </div>

        {/* Search + filter bar */}
        <div className={styles.toolbar}>
          {/* Search */}
          <div className={styles.searchBar}>
            <Search size={16} className={styles.searchIcon} aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tools..."
              className={styles.searchInput}
              aria-label="Search tools"
            />
          </div>

          {/* Category filter pills */}
          <div className={styles.filters} role="group" aria-label="Filter by category">
            <button
              className={`${styles.filterPill} ${activeCategory === 'all' ? styles.filterActive : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              All ({TOOLS.length})
            </button>
            {CATEGORIES.map((cat) => {
              const count = TOOLS.filter((t) => t.category === cat.slug).length;
              const CatIcon = CATEGORY_ICONS[cat.slug] ?? Zap;
              return (
                <button
                  key={cat.slug}
                  className={`${styles.filterPill} ${styles[`pill-${cat.accentColor}`]} ${activeCategory === cat.slug ? styles.filterActive : ''}`}
                  onClick={() => setActiveCategory(cat.slug as FilterCategory)}
                  aria-pressed={activeCategory === cat.slug}
                >
                  <CatIcon size={12} strokeWidth={2} />
                  {cat.shortName} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Tool grid */}
        {filtered.length > 0 ? (
          <div className={styles.grid}>
            {filtered.map((tool) => {
              const ToolIcon = TOOL_ICONS[tool.id] ?? Zap;
              const CatIcon = CATEGORY_ICONS[tool.category] ?? Zap;
              const accent = CATEGORY_ACCENT[tool.category] ?? 'violet';
              const catLabel = CATEGORY_LABELS[tool.category] ?? tool.category;

              return (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.slug}`}
                  className={`${styles.toolCard} ${styles[`accent-${accent}`]}`}
                >
                  <div className={styles.cardGlow} aria-hidden="true" />
                  <div className={styles.cardTop}>
                    <div className={styles.toolIcon}>
                      <ToolIcon size={18} strokeWidth={1.5} />
                    </div>
                    <div className={styles.catBadge}>
                      <CatIcon size={10} strokeWidth={2} />
                      <span>{catLabel}</span>
                    </div>
                  </div>

                  <h3 className={styles.toolName}>{tool.name}</h3>
                  <p className={styles.toolDesc}>{tool.description}</p>

                  <div className={styles.cardBottom}>
                    {tool.processedLocally && (
                      <span className={styles.localTag}>🔒 Local</span>
                    )}
                    <span className={styles.openTool}>
                      Open <ArrowRight size={12} className={styles.arrow} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <Zap size={32} className={styles.emptyIcon} />
            <p>No tools found for &quot;{query}&quot;</p>
            <button
              className={styles.resetBtn}
              onClick={() => { setQuery(''); setActiveCategory('all'); }}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
