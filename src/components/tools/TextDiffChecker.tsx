'use client';

import { useState, useMemo } from 'react';
import { GitCompare, ArrowLeftRight, Trash2 } from 'lucide-react';
import * as Diff from 'diff';
import styles from './toolStyles.module.css';

export default function TextDiffChecker() {
  const [originalText, setOriginalText] = useState(
    'The quick brown fox jumps over the lazy dog.\nAll the tools in one place.\nFast, simple and private.'
  );
  const [modifiedText, setModifiedText] = useState(
    'The swift brown fox leaps over the lazy dog.\nToolock: All the tools in one place.\nFast, simple, secure and private.'
  );
  const [mode, setMode] = useState<'words' | 'lines'>('words');

  const diffResult = useMemo(() => {
    if (mode === 'words') {
      return Diff.diffWords(originalText, modifiedText);
    }
    return Diff.diffLines(originalText, modifiedText);
  }, [originalText, modifiedText, mode]);

  const stats = useMemo(() => {
    let added = 0;
    let removed = 0;
    diffResult.forEach((part) => {
      if (part.added) added += part.value.length;
      if (part.removed) removed += part.value.length;
    });
    return { added, removed };
  }, [diffResult]);

  const swapTexts = () => {
    const temp = originalText;
    setOriginalText(modifiedText);
    setModifiedText(temp);
  };

  return (
    <div className={styles.toolContainer}>
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <span className={styles.panelTitle}>
            <GitCompare size={18} /> Text Comparison Inputs
          </span>
          <div className={styles.panelActions}>
            <button type="button" onClick={swapTexts} className={styles.btnSecondary}>
              <ArrowLeftRight size={14} /> Swap
            </button>
            <button
              type="button"
              onClick={() => { setOriginalText(''); setModifiedText(''); }}
              className={styles.btnSecondary}
            >
              <Trash2 size={14} /> Clear
            </button>
          </div>
        </div>

        {/* Inputs side by side */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          <div className={styles.controlGroup}>
            <label className={styles.controlLabel}>Original Text</label>
            <textarea
              value={originalText}
              onChange={(e) => setOriginalText(e.target.value)}
              placeholder="Paste original text here..."
              className={styles.textarea}
              style={{ minHeight: '180px' }}
            />
          </div>

          <div className={styles.controlGroup}>
            <label className={styles.controlLabel}>Modified Text</label>
            <textarea
              value={modifiedText}
              onChange={(e) => setModifiedText(e.target.value)}
              placeholder="Paste modified text here..."
              className={styles.textarea}
              style={{ minHeight: '180px' }}
            />
          </div>
        </div>

        {/* Diff Mode Toggle */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--clr-white-muted)' }}>Comparison Granularity:</span>
          <button
            type="button"
            onClick={() => setMode('words')}
            className={mode === 'words' ? styles.btnPrimary : styles.btnSecondary}
            style={{ padding: '4px 10px', fontSize: '0.78rem' }}
          >
            Words
          </button>
          <button
            type="button"
            onClick={() => setMode('lines')}
            className={mode === 'lines' ? styles.btnPrimary : styles.btnSecondary}
            style={{ padding: '4px 10px', fontSize: '0.78rem' }}
          >
            Lines
          </button>
        </div>
      </div>

      {/* Difference Output Panel */}
      <div className={styles.resultBox} style={{ marginTop: '0' }}>
        <div className={styles.panelHeader}>
          <span className={styles.panelTitle}>Visual Differences</span>
          <div style={{ display: 'flex', gap: '12px' }}>
            <span style={{ color: '#4ade80', fontSize: '0.85rem', fontWeight: 600 }}>
              +{stats.added} chars added
            </span>
            <span style={{ color: '#f87171', fontSize: '0.85rem', fontWeight: 600 }}>
              -{stats.removed} chars removed
            </span>
          </div>
        </div>

        <div
          style={{
            background: 'var(--clr-surface-3)',
            border: '1px solid var(--clr-border)',
            borderRadius: '8px',
            padding: '16px',
            fontFamily: 'monospace',
            fontSize: '0.92rem',
            lineHeight: '1.7',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {diffResult.map((part, index) => {
            const color = part.added ? '#4ade80' : part.removed ? '#f87171' : 'var(--clr-white-dim)';
            const bg = part.added
              ? 'rgba(34, 197, 94, 0.2)'
              : part.removed
              ? 'rgba(239, 68, 68, 0.2)'
              : 'transparent';
            const decoration = part.removed ? 'line-through' : 'none';

            return (
              <span
                key={index}
                style={{
                  color,
                  backgroundColor: bg,
                  textDecoration: decoration,
                  padding: part.added || part.removed ? '2px 4px' : '0',
                  borderRadius: '3px',
                }}
              >
                {part.value}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
