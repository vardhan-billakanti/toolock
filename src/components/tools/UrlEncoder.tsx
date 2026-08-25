'use client';

import { useState } from 'react';
import { Link2, Copy, Check, Trash2, AlertCircle } from 'lucide-react';
import styles from './toolStyles.module.css';

export default function UrlEncoder() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [encodeType, setEncodeType] = useState<'component' | 'uri'>('component');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleProcess = () => {
    setError(null);
    try {
      if (mode === 'encode') {
        setOutput(encodeType === 'component' ? encodeURIComponent(input) : encodeURI(input));
      } else {
        setOutput(encodeType === 'component' ? decodeURIComponent(input) : decodeURI(input));
      }
    } catch (err: any) {
      setError(err?.message || 'Invalid URI sequence.');
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.toolContainer}>
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <span className={styles.panelTitle}>
            <Link2 size={18} /> URL Encoder / Decoder
          </span>
          <button
            type="button"
            onClick={() => { setInput(''); setOutput(''); setError(null); }}
            className={styles.btnSecondary}
          >
            <Trash2 size={14} /> Clear
          </button>
        </div>

        {/* Mode & Type controls */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => { setMode('encode'); setOutput(''); setError(null); }}
            className={mode === 'encode' ? styles.btnPrimary : styles.btnSecondary}
            style={{ padding: '6px 14px' }}
          >
            Encode
          </button>
          <button
            type="button"
            onClick={() => { setMode('decode'); setOutput(''); setError(null); }}
            className={mode === 'decode' ? styles.btnPrimary : styles.btnSecondary}
            style={{ padding: '6px 14px' }}
          >
            Decode
          </button>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setEncodeType('component')}
              className={encodeType === 'component' ? styles.btnPrimary : styles.btnSecondary}
              style={{ padding: '6px 12px', fontSize: '0.78rem' }}
              title="Encodes all special characters (best for query parameters)"
            >
              Component (Query Params)
            </button>
            <button
              type="button"
              onClick={() => setEncodeType('uri')}
              className={encodeType === 'uri' ? styles.btnPrimary : styles.btnSecondary}
              style={{ padding: '6px 12px', fontSize: '0.78rem' }}
              title="Preserves URL protocol and separators"
            >
              Full URL
            </button>
          </div>
        </div>

        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>
            {mode === 'encode' ? 'String / URL to Encode' : 'Percent-Encoded URL to Decode'}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? 'https://example.com/search?q=toolock platform & special chars' : 'https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dtoolock'}
            className={styles.textarea}
            style={{ minHeight: '140px' }}
          />
        </div>

        <div className={styles.actionBtnRow}>
          <button
            type="button"
            onClick={handleProcess}
            disabled={!input.trim()}
            className={styles.btnPrimary}
          >
            <Link2 size={16} /> {mode === 'encode' ? 'Encode URL' : 'Decode URL'}
          </button>
        </div>

        {error && (
          <div className={styles.errorAlert}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {output && (
          <div className={styles.resultBox}>
            <div className={styles.panelHeader}>
              <span className={styles.panelTitle}>Result</span>
              <button type="button" onClick={handleCopy} className={styles.btnSecondary}>
                {copied ? <Check size={14} color="#4ade80" /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <textarea
              readOnly
              value={output}
              className={styles.textarea}
              style={{ minHeight: '140px', background: 'var(--clr-surface-2)' }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
