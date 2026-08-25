'use client';

import { useState, useMemo } from 'react';
import { Hash, Copy, Check, Trash2, Clock, Volume2 } from 'lucide-react';
import styles from './toolStyles.module.css';

export default function WordCounter() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const trimmed = text.trim();
    if (!trimmed) {
      return {
        words: 0,
        charsWithSpaces: 0,
        charsNoSpaces: 0,
        sentences: 0,
        paragraphs: 0,
        readingTimeMin: 0,
        speakingTimeMin: 0,
      };
    }

    const words = trimmed.split(/\s+/).filter(Boolean).length;
    const charsWithSpaces = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const sentences = trimmed.split(/[.!?]+/).filter(Boolean).length;
    const paragraphs = text.split(/\n+/).filter((p) => p.trim().length > 0).length;
    const readingTimeMin = Math.ceil(words / 200);
    const speakingTimeMin = Math.ceil(words / 130);

    return {
      words,
      charsWithSpaces,
      charsNoSpaces,
      sentences,
      paragraphs,
      readingTimeMin,
      speakingTimeMin,
    };
  }, [text]);

  const handleCopy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.toolContainer}>
      {/* Live Metrics Grid */}
      <div className={styles.panel}>
        <div className={styles.resultStats} style={{ justifyContent: 'space-between' }}>
          <div className={styles.resultStatItem}>
            <span className={styles.resultStatLabel}>Words</span>
            <span className={styles.resultStatVal} style={{ color: '#a78bfa', fontSize: '1.75rem' }}>
              {stats.words.toLocaleString()}
            </span>
          </div>

          <div className={styles.resultStatItem}>
            <span className={styles.resultStatLabel}>Characters</span>
            <span className={styles.resultStatVal} style={{ color: '#60a5fa', fontSize: '1.75rem' }}>
              {stats.charsWithSpaces.toLocaleString()}
            </span>
          </div>

          <div className={styles.resultStatItem}>
            <span className={styles.resultStatLabel}>No Spaces</span>
            <span className={styles.resultStatVal} style={{ color: '#fb923c', fontSize: '1.75rem' }}>
              {stats.charsNoSpaces.toLocaleString()}
            </span>
          </div>

          <div className={styles.resultStatItem}>
            <span className={styles.resultStatLabel}>Sentences</span>
            <span className={styles.resultStatVal} style={{ fontSize: '1.75rem' }}>
              {stats.sentences.toLocaleString()}
            </span>
          </div>

          <div className={styles.resultStatItem}>
            <span className={styles.resultStatLabel}>Paragraphs</span>
            <span className={styles.resultStatVal} style={{ fontSize: '1.75rem' }}>
              {stats.paragraphs.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Reading and Speaking times */}
        <div style={{ display: 'flex', gap: '16px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--clr-border)', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: 'var(--clr-white-dim)' }}>
            <Clock size={16} color="#c4b5fd" />
            <span>Reading time: <strong>~{stats.readingTimeMin} min</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: 'var(--clr-white-dim)' }}>
            <Volume2 size={16} color="#fb923c" />
            <span>Speaking time: <strong>~{stats.speakingTimeMin} min</strong></span>
          </div>
        </div>
      </div>

      {/* Editor Panel */}
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <span className={styles.panelTitle}>
            <Hash size={18} /> Type or Paste Your Text
          </span>
          <div className={styles.panelActions}>
            <button
              type="button"
              onClick={handleCopy}
              disabled={!text}
              className={styles.btnSecondary}
            >
              {copied ? <Check size={14} color="#4ade80" /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy Text'}
            </button>
            <button
              type="button"
              onClick={() => setText('')}
              disabled={!text}
              className={styles.btnSecondary}
            >
              <Trash2 size={14} /> Clear
            </button>
          </div>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing or paste content here..."
          className={styles.textarea}
          style={{ minHeight: '320px', fontFamily: 'inherit', fontSize: '1rem', lineHeight: '1.7' }}
          autoFocus
        />
      </div>
    </div>
  );
}
