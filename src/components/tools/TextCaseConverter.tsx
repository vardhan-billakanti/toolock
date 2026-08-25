'use client';

import { useState } from 'react';
import { CaseSensitive, Copy, Check, Trash2 } from 'lucide-react';
import styles from './toolStyles.module.css';

export default function TextCaseConverter() {
  const [text, setText] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = async (str: string, key: string) => {
    if (!str) return;
    await navigator.clipboard.writeText(str);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toTitleCase = (str: string) =>
    str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

  const toSentenceCase = (str: string) =>
    str.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());

  const toCamelCase = (str: string) =>
    str
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
      .replace(/^[A-Z]/, (c) => c.toLowerCase());

  const toPascalCase = (str: string) =>
    str
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
      .replace(/^[a-z]/, (c) => c.toUpperCase());

  const toSnakeCase = (str: string) =>
    str
      .trim()
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_]/g, '')
      .toLowerCase();

  const toKebabCase = (str: string) =>
    str
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9-]/g, '')
      .toLowerCase();

  const toConstantCase = (str: string) =>
    str
      .trim()
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_]/g, '')
      .toUpperCase();

  const toAlternatingCase = (str: string) =>
    str
      .split('')
      .map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()))
      .join('');

  const conversions = [
    { key: 'upper', label: 'UPPERCASE', value: text.toUpperCase() },
    { key: 'lower', label: 'lowercase', value: text.toLowerCase() },
    { key: 'title', label: 'Title Case', value: toTitleCase(text) },
    { key: 'sentence', label: 'Sentence case', value: toSentenceCase(text) },
    { key: 'camel', label: 'camelCase', value: toCamelCase(text) },
    { key: 'pascal', label: 'PascalCase', value: toPascalCase(text) },
    { key: 'snake', label: 'snake_case', value: toSnakeCase(text) },
    { key: 'kebab', label: 'kebab-case', value: toKebabCase(text) },
    { key: 'constant', label: 'CONSTANT_CASE', value: toConstantCase(text) },
    { key: 'alternating', label: 'aLtErNaTiNg cAsE', value: toAlternatingCase(text) },
  ];

  return (
    <div className={styles.toolContainer}>
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <span className={styles.panelTitle}>
            <CaseSensitive size={18} /> Enter Text to Convert
          </span>
          <button
            type="button"
            onClick={() => setText('')}
            disabled={!text}
            className={styles.btnSecondary}
          >
            <Trash2 size={14} /> Clear
          </button>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste text here to convert across all cases instantly..."
          className={styles.textarea}
          style={{ minHeight: '120px' }}
        />
      </div>

      {/* Case cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
        {conversions.map(({ key, label, value }) => (
          <div
            key={key}
            style={{
              background: 'var(--clr-surface-2)',
              border: '1px solid var(--clr-border)',
              borderRadius: '8px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--clr-violet-400)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {label}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(value, key)}
                disabled={!text}
                className={styles.btnSecondary}
                style={{ padding: '3px 8px', fontSize: '0.75rem' }}
              >
                {copiedKey === key ? <Check size={12} color="#4ade80" /> : <Copy size={12} />}
                {copiedKey === key ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div
              style={{
                background: 'var(--clr-surface-3)',
                padding: '8px 10px',
                borderRadius: '6px',
                fontSize: '0.88rem',
                color: 'var(--clr-white)',
                minHeight: '38px',
                overflowX: 'auto',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
              }}
            >
              {value || <span style={{ color: 'var(--clr-white-muted)' }}>Preview</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
