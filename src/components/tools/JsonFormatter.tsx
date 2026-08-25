'use client';

import { useState } from 'react';
import { Braces, Copy, Check, Trash2, Download, AlertCircle, CheckCircle2 } from 'lucide-react';
import styles from './toolStyles.module.css';

export default function JsonFormatter() {
  const [input, setInput] = useState(
    '{\n  "name": "Toolock",\n  "version": "1.0.0",\n  "tools": [\n    "pdf",\n    "image",\n    "text",\n    "developer",\n    "security"\n  ],\n  "status": "active"\n}'
  );
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [copied, setCopied] = useState(false);

  const formatJson = (spaces: number = 2) => {
    if (!input.trim()) {
      setError('Please enter JSON content.');
      setIsValid(false);
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed, null, spaces));
      setError(null);
      setIsValid(true);
      setTimeout(() => setIsValid(null), 3000);
    } catch (err: any) {
      setError(err?.message || 'Invalid JSON syntax');
      setIsValid(false);
    }
  };

  const minifyJson = () => {
    if (!input.trim()) {
      setError('Please enter JSON content.');
      setIsValid(false);
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed));
      setError(null);
      setIsValid(true);
      setTimeout(() => setIsValid(null), 3000);
    } catch (err: any) {
      setError(err?.message || 'Invalid JSON syntax');
      setIsValid(false);
    }
  };

  const validateJson = () => {
    if (!input.trim()) {
      setError('Please enter JSON content to validate.');
      setIsValid(false);
      return;
    }
    try {
      JSON.parse(input);
      setError(null);
      setIsValid(true);
      setTimeout(() => setIsValid(null), 3000);
    } catch (err: any) {
      setError(err?.message || 'Invalid JSON syntax');
      setIsValid(false);
    }
  };

  const handleCopy = async () => {
    if (!input) return;
    await navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!input) return;
    const blob = new Blob([input], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'formatted.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setInput('');
    setError(null);
    setIsValid(null);
  };

  return (
    <div className={styles.toolContainer}>
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <span className={styles.panelTitle}>
            <Braces size={18} /> JSON Formatter & Validator
          </span>
          <div className={styles.panelActions}>
            <button type="button" onClick={handleCopy} disabled={!input} className={styles.btnSecondary}>
              {copied ? <Check size={14} color="#4ade80" /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button type="button" onClick={handleDownload} disabled={!input} className={styles.btnSecondary}>
              <Download size={14} /> Download
            </button>
            <button type="button" onClick={handleClear} disabled={!input} className={styles.btnSecondary}>
              <Trash2 size={14} /> Clear
            </button>
          </div>
        </div>

        {/* Action bar for formatting & validation */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button type="button" onClick={() => formatJson(2)} className={styles.btnPrimary} style={{ padding: '6px 14px', fontSize: '0.82rem' }}>
            Beautify (2 Spaces)
          </button>
          <button type="button" onClick={() => formatJson(4)} className={styles.btnSecondary} style={{ padding: '6px 12px', fontSize: '0.82rem' }}>
            4 Spaces
          </button>
          <button type="button" onClick={minifyJson} className={styles.btnSecondary} style={{ padding: '6px 12px', fontSize: '0.82rem' }}>
            Minify / Compact
          </button>
          <button type="button" onClick={validateJson} className={styles.btnSecondary} style={{ padding: '6px 12px', fontSize: '0.82rem' }}>
            Validate JSON
          </button>

          {isValid && (
            <span className={styles.savedBadge} style={{ marginLeft: 'auto' }}>
              <CheckCircle2 size={13} /> Valid JSON Syntax
            </span>
          )}
        </div>

        <textarea
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError(null);
            setIsValid(null);
          }}
          placeholder="Paste or type JSON data here..."
          className={styles.textarea}
          style={{ minHeight: '340px' }}
          spellCheck={false}
        />

        {error && (
          <div className={styles.errorAlert}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
