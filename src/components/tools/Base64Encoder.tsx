'use client';

import { useState } from 'react';
import { Binary, Copy, Check, Trash2, Upload, AlertCircle } from 'lucide-react';
import styles from './toolStyles.module.css';

export default function Base64Encoder() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleProcess = () => {
    setError(null);
    try {
      if (mode === 'encode') {
        // UTF-8 safe Base64 encoding
        const bytes = new TextEncoder().encode(input);
        let binary = '';
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        setOutput(btoa(binary));
      } else {
        // UTF-8 safe Base64 decoding
        const binary = atob(input.trim());
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        setOutput(new TextDecoder().decode(bytes));
      }
    } catch (err: any) {
      setError(mode === 'decode' ? 'Invalid Base64 string.' : 'Encoding failed.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const res = reader.result as string;
      if (mode === 'encode') {
        setOutput(res);
      }
    };
    reader.readAsDataURL(file);
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
            <Binary size={18} /> Base64 Encoder / Decoder
          </span>
          <div className={styles.panelActions}>
            <button
              type="button"
              onClick={() => { setInput(''); setOutput(''); setError(null); }}
              className={styles.btnSecondary}
            >
              <Trash2 size={14} /> Clear
            </button>
          </div>
        </div>

        {/* Mode Toggle */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <button
            type="button"
            onClick={() => { setMode('encode'); setError(null); setOutput(''); }}
            className={mode === 'encode' ? styles.btnPrimary : styles.btnSecondary}
            style={{ padding: '6px 16px' }}
          >
            Encode to Base64
          </button>
          <button
            type="button"
            onClick={() => { setMode('decode'); setError(null); setOutput(''); }}
            className={mode === 'decode' ? styles.btnPrimary : styles.btnSecondary}
            style={{ padding: '6px 16px' }}
          >
            Decode from Base64
          </button>
        </div>

        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>
            {mode === 'encode' ? 'Input Text to Encode' : 'Base64 String to Decode'}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? 'Type or paste plain text here...' : 'Paste Base64 encoded string here...'}
            className={styles.textarea}
            style={{ minHeight: '140px' }}
          />
        </div>

        {mode === 'encode' && (
          <div style={{ marginTop: '12px' }}>
            <label style={{ fontSize: '0.82rem', color: 'var(--clr-white-muted)', display: 'block', marginBottom: '6px' }}>
              Or encode a file:
            </label>
            <input
              type="file"
              onChange={handleFileUpload}
              className={styles.input}
              style={{ padding: '6px' }}
            />
          </div>
        )}

        <div className={styles.actionBtnRow}>
          <button
            type="button"
            onClick={handleProcess}
            disabled={!input.trim()}
            className={styles.btnPrimary}
          >
            <Binary size={16} /> {mode === 'encode' ? 'Encode to Base64' : 'Decode Base64'}
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
                {copied ? 'Copied' : 'Copy Result'}
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
