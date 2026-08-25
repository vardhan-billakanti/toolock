'use client';

import { useState } from 'react';
import { Sparkles, Copy, Check, Trash2, Download } from 'lucide-react';
import styles from './toolStyles.module.css';

export default function TextCleaner() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [copied, setCopied] = useState(false);

  // Options
  const [removeExtraSpaces, setRemoveExtraSpaces] = useState(true);
  const [removeEmptyLines, setRemoveEmptyLines] = useState(true);
  const [trimLines, setTrimLines] = useState(true);
  const [stripHtml, setStripHtml] = useState(false);
  const [removeDuplicateLines, setRemoveDuplicateLines] = useState(false);
  const [removeEmoji, setRemoveEmoji] = useState(false);
  const [normalizeQuotes, setNormalizeQuotes] = useState(true);

  const cleanText = () => {
    let result = inputText;

    if (stripHtml) {
      result = result.replace(/<[^>]*>/g, '');
    }

    if (normalizeQuotes) {
      result = result
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/[\u201C\u201D]/g, '"');
    }

    if (removeEmoji) {
      result = result.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
    }

    let lines = result.split('\n');

    if (trimLines) {
      lines = lines.map((l) => l.trim());
    }

    if (removeExtraSpaces) {
      lines = lines.map((l) => l.replace(/[ \t]+/g, ' '));
    }

    if (removeEmptyLines) {
      lines = lines.filter((l) => l.length > 0);
    }

    if (removeDuplicateLines) {
      lines = Array.from(new Set(lines));
    }

    setOutputText(lines.join('\n'));
  };

  const handleCopy = async () => {
    if (!outputText) return;
    await navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!outputText) return;
    const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cleaned-text.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.toolContainer}>
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <span className={styles.panelTitle}>
            <Sparkles size={18} /> Cleaning Options
          </span>
          <button
            type="button"
            onClick={() => { setInputText(''); setOutputText(''); }}
            className={styles.btnSecondary}
          >
            <Trash2 size={14} /> Clear All
          </button>
        </div>

        {/* Options grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: 'var(--clr-white-dim)', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={removeExtraSpaces}
              onChange={(e) => setRemoveExtraSpaces(e.target.checked)}
              style={{ accentColor: 'var(--clr-violet-500)' }}
            />
            Remove Extra Spaces
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: 'var(--clr-white-dim)', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={removeEmptyLines}
              onChange={(e) => setRemoveEmptyLines(e.target.checked)}
              style={{ accentColor: 'var(--clr-violet-500)' }}
            />
            Remove Empty Lines
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: 'var(--clr-white-dim)', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={trimLines}
              onChange={(e) => setTrimLines(e.target.checked)}
              style={{ accentColor: 'var(--clr-violet-500)' }}
            />
            Trim Leading/Trailing Space
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: 'var(--clr-white-dim)', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={stripHtml}
              onChange={(e) => setStripHtml(e.target.checked)}
              style={{ accentColor: 'var(--clr-violet-500)' }}
            />
            Strip HTML Tags
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: 'var(--clr-white-dim)', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={normalizeQuotes}
              onChange={(e) => setNormalizeQuotes(e.target.checked)}
              style={{ accentColor: 'var(--clr-violet-500)' }}
            />
            Normalize Smart Quotes
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: 'var(--clr-white-dim)', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={removeDuplicateLines}
              onChange={(e) => setRemoveDuplicateLines(e.target.checked)}
              style={{ accentColor: 'var(--clr-violet-500)' }}
            />
            Remove Duplicate Lines
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: 'var(--clr-white-dim)', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={removeEmoji}
              onChange={(e) => setRemoveEmoji(e.target.checked)}
              style={{ accentColor: 'var(--clr-violet-500)' }}
            />
            Remove Emojis
          </label>
        </div>

        {/* Input Textarea */}
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste messy text here to clean..."
          className={styles.textarea}
          style={{ minHeight: '160px' }}
        />

        <div className={styles.actionBtnRow}>
          <button
            type="button"
            onClick={cleanText}
            disabled={!inputText.trim()}
            className={styles.btnPrimary}
          >
            <Sparkles size={16} /> Clean Text
          </button>
        </div>

        {/* Cleaned Result */}
        {outputText && (
          <div className={styles.resultBox}>
            <div className={styles.panelHeader}>
              <span className={styles.panelTitle}>Cleaned Output</span>
              <div className={styles.panelActions}>
                <button type="button" onClick={handleCopy} className={styles.btnSecondary}>
                  {copied ? <Check size={14} color="#4ade80" /> : <Copy size={14} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button type="button" onClick={handleDownload} className={styles.btnSecondary}>
                  <Download size={14} /> Download
                </button>
              </div>
            </div>
            <textarea
              readOnly
              value={outputText}
              className={styles.textarea}
              style={{ minHeight: '160px', background: 'var(--clr-surface-2)' }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
