'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight, FileText, Image, Type, Code2, Shield } from 'lucide-react';
import { searchTools, type Tool } from '@/data/tools';
import styles from './GlobalSearch.module.css';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  'pdf-documents': FileText,
  'image': Image,
  'text': Type,
  'developer': Code2,
  'security-privacy': Shield,
};

const CATEGORY_LABELS: Record<string, string> = {
  'pdf-documents': 'PDF',
  'image': 'Image',
  'text': 'Text',
  'developer': 'Dev',
  'security-privacy': 'Security',
};

interface GlobalSearchProps {
  autoFocus?: boolean;
  size?: 'default' | 'large';
}

export default function GlobalSearch({ autoFocus = false, size = 'default' }: GlobalSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Tool[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Search on input change
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    const found = searchTools(query);
    setResults(found.slice(0, 8));
    setIsOpen(found.length > 0);
    setActiveIndex(-1);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, -1));
      } else if (e.key === 'Enter') {
        if (activeIndex >= 0 && results[activeIndex]) {
          router.push(`/tools/${results[activeIndex].slug}`);
          setIsOpen(false);
          setQuery('');
        } else if (query.trim()) {
          router.push(`/tools?q=${encodeURIComponent(query.trim())}`);
          setIsOpen(false);
        }
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    },
    [isOpen, results, activeIndex, query, router]
  );

  const handleResultClick = (tool: Tool) => {
    router.push(`/tools/${tool.slug}`);
    setIsOpen(false);
    setQuery('');
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div
      ref={containerRef}
      className={`${styles.searchContainer} ${styles[size]}`}
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
    >
      <div className={`${styles.searchBar} ${isOpen ? styles.focused : ''}`}>
        <Search size={18} className={styles.searchIcon} aria-hidden="true" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="Search for a tool..."
          className={styles.searchInput}
          autoFocus={autoFocus}
          autoComplete="off"
          spellCheck={false}
          aria-label="Search tools"
          aria-autocomplete="list"
          aria-controls="search-results"
          aria-activedescendant={activeIndex >= 0 ? `result-${activeIndex}` : undefined}
        />
        {query && (
          <button
            className={styles.clearBtn}
            onClick={clearSearch}
            aria-label="Clear search"
            type="button"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Results dropdown */}
      {isOpen && results.length > 0 && (
        <div
          id="search-results"
          className={styles.resultsDropdown}
          role="listbox"
          aria-label="Search results"
        >
          <div className={styles.resultsHeader}>
            <span>{results.length} tool{results.length !== 1 ? 's' : ''} found</span>
          </div>

          {results.map((tool, idx) => {
            const CatIcon = CATEGORY_ICONS[tool.category] ?? FileText;
            const catLabel = CATEGORY_LABELS[tool.category] ?? tool.category;

            return (
              <div
                key={tool.id}
                id={`result-${idx}`}
                className={`${styles.resultItem} ${activeIndex === idx ? styles.resultActive : ''}`}
                role="option"
                aria-selected={activeIndex === idx}
                onClick={() => handleResultClick(tool)}
                onMouseEnter={() => setActiveIndex(idx)}
              >
                <div className={styles.resultIcon}>
                  <CatIcon size={15} strokeWidth={1.5} />
                </div>
                <div className={styles.resultInfo}>
                  <span className={styles.resultName}>{tool.name}</span>
                  <span className={styles.resultDesc}>{tool.description}</span>
                </div>
                <div className={styles.resultMeta}>
                  <span className={styles.resultCategory}>{catLabel}</span>
                  <ArrowRight size={13} className={styles.resultArrow} />
                </div>
              </div>
            );
          })}

          <div className={styles.resultsFooter}>
            <button
              className={styles.viewAllBtn}
              onClick={() => {
                router.push(`/tools?q=${encodeURIComponent(query.trim())}`);
                setIsOpen(false);
              }}
              type="button"
            >
              View all results for &quot;{query}&quot;
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
