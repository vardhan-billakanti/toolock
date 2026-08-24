'use client';

import {
  useState, useEffect, useCallback, useRef, useMemo, KeyboardEvent,
} from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, X, ArrowRight, Zap, Star,
  FilePlus2, Scissors, FileArchive, Images, ImageDown,
  Minimize2, Expand, RefreshCw, Crop, Eraser,
  Hash, Sparkles, CaseSensitive, GitCompare,
  Braces, Binary, Link2, KeyRound, ShieldCheck, EyeOff,
  FileText, Image as ImageIcon, Type, Code2, Shield,
} from 'lucide-react';
import { TOOLS, type Tool } from '@/data/tools';
import styles from './CommandPalette.module.css';

// ─── Icon maps ──────────────────────────────────────────────────
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

const CAT_ICONS: Record<string, React.ElementType> = {
  'pdf-documents':    FileText,
  'image':            ImageIcon,
  'text':             Type,
  'developer':        Code2,
  'security-privacy': Shield,
};

const CAT_LABELS: Record<string, string> = {
  'pdf-documents':    'PDF',
  'image':            'Image',
  'text':             'Text',
  'developer':        'Dev',
  'security-privacy': 'Security',
};

const CAT_ACCENT: Record<string, string> = {
  'pdf-documents':    'violet',
  'image':            'blue',
  'text':             'orange',
  'developer':        'amber',
  'security-privacy': 'violet',
};

// Popular tool IDs shown when search is empty
const POPULAR_IDS = [
  'pdf-compressor', 'image-compressor', 'background-remover',
  'json-formatter', 'text-diff-checker',
];

// ─── Highlight matching text ─────────────────────────────────────
function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase().trim());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className={styles.hlMark}>{text.slice(idx, idx + query.trim().length)}</mark>
      {text.slice(idx + query.trim().length)}
    </>
  );
}

// ─── Main CommandPalette component ───────────────────────────────
export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Open via custom event (dispatched by SearchTrigger)
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('toolora:open-search', handler);
    return () => window.removeEventListener('toolora:open-search', handler);
  }, []);

  // Ctrl/Cmd+K shortcut
  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(v => !v);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Focus input when opening
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 60);
      setQuery('');
      setSelectedIdx(0);
    }
  }, [open]);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setSelectedIdx(0);
  }, []);

  // Filtered results
  const results = useMemo<Tool[]>(() => {
    const q = query.toLowerCase().trim();
    if (!q) return TOOLS.filter(t => POPULAR_IDS.includes(t.id));
    return TOOLS.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.tags?.some((tag: string) => tag.toLowerCase().includes(q))
    );
  }, [query]);

  // Keep selected index in range
  useEffect(() => {
    setSelectedIdx(0);
  }, [query]);

  // Scroll selected item into view
  useEffect(() => {
    const items = listRef.current?.querySelectorAll<HTMLElement>('[data-result-item]');
    items?.[selectedIdx]?.scrollIntoView({ block: 'nearest' });
  }, [selectedIdx]);

  const navigate = useCallback((tool: Tool) => {
    close();
    router.push(`/tools/${tool.slug}`);
  }, [close, router]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') { close(); return; }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const tool = results[selectedIdx];
      if (tool) navigate(tool);
    }
  }, [close, results, selectedIdx, navigate]);

  if (!open) return null;

  const isEmpty = query.trim() === '';
  const hasResults = results.length > 0;

  return (
    <div className={styles.overlay} onClick={close} role="dialog" aria-modal aria-label="Search Toolora tools">
      <div className={styles.panel} onClick={e => e.stopPropagation()}>

        {/* ── Search input bar ─────────────────────────────── */}
        <div className={styles.inputRow}>
          <Search size={17} className={styles.searchIcon} aria-hidden />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for a tool…"
            className={styles.input}
            aria-label="Search tools"
            autoComplete="off"
            spellCheck={false}
          />
          {query && (
            <button className={styles.clearBtn} onClick={() => setQuery('')} aria-label="Clear search">
              <X size={14} />
            </button>
          )}
          <kbd className={styles.escKey} onClick={close}>Esc</kbd>
        </div>

        {/* ── Results ──────────────────────────────────────── */}
        <div className={styles.results} ref={listRef} role="listbox">

          {/* Section label */}
          <div className={styles.sectionLabel}>
            {isEmpty ? (
              <><Star size={12} /> Popular tools</>
            ) : hasResults ? (
              <><Zap size={12} /> {results.length} result{results.length !== 1 ? 's' : ''}</>
            ) : null}
          </div>

          {/* Tool rows */}
          {hasResults ? results.map((tool, i) => {
            const ToolIcon = TOOL_ICONS[tool.id] ?? Zap;
            const CatIcon  = CAT_ICONS[tool.category] ?? Zap;
            const accent   = CAT_ACCENT[tool.category] ?? 'violet';
            const catLabel = CAT_LABELS[tool.category] ?? tool.category;
            const isSelected = i === selectedIdx;

            return (
              <div
                key={tool.id}
                data-result-item
                className={`${styles.resultItem} ${isSelected ? styles.resultSelected : ''}`}
                onClick={() => navigate(tool)}
                onMouseEnter={() => setSelectedIdx(i)}
                role="option"
                aria-selected={isSelected}
              >
                {/* Tool icon */}
                <div className={`${styles.itemIcon} ${styles[`icon-${accent}`]}`}>
                  <ToolIcon size={16} strokeWidth={1.5} />
                </div>

                {/* Name + description */}
                <div className={styles.itemBody}>
                  <span className={styles.itemName}>
                    <Highlight text={tool.name} query={query} />
                  </span>
                  <span className={styles.itemDesc}>
                    <Highlight text={tool.description} query={query} />
                  </span>
                </div>

                {/* Category badge */}
                <div className={`${styles.catBadge} ${styles[`badge-${accent}`]}`}>
                  <CatIcon size={10} strokeWidth={2} />
                  <span>{catLabel}</span>
                </div>

                {/* Open hint on selected */}
                {isSelected && (
                  <div className={styles.openHint}>
                    <ArrowRight size={12} />
                  </div>
                )}
              </div>
            );
          }) : (
            <div className={styles.emptyResults}>
              <Search size={20} className={styles.emptyIcon} />
              <p>No tools found for &ldquo;{query}&rdquo;</p>
              <span>Try: pdf, compress, json, base64…</span>
            </div>
          )}
        </div>

        {/* ── Footer ───────────────────────────────────────── */}
        <div className={styles.footer}>
          <span className={styles.footerHint}>
            <kbd>↑</kbd><kbd>↓</kbd> navigate
          </span>
          <span className={styles.footerHint}>
            <kbd>↵</kbd> open
          </span>
          <span className={styles.footerHint}>
            <kbd>Esc</kbd> close
          </span>
          <span className={styles.footerCount}>
            {TOOLS.length} tools available
          </span>
        </div>
      </div>
    </div>
  );
}
