'use client';

import { useState } from 'react';
import { KeyRound, Copy, Check, Trash2, AlertCircle, ShieldCheck, ShieldAlert } from 'lucide-react';
import styles from './toolStyles.module.css';

export default function JwtDecoder() {
  const [token, setToken] = useState('');
  const [header, setHeader] = useState<string | null>(null);
  const [payload, setPayload] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState<boolean | null>(null);
  const [expiryDate, setExpiryDate] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const base64UrlDecode = (str: string) => {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  };

  const decodeJwt = (jwtString: string) => {
    setToken(jwtString);
    if (!jwtString.trim()) {
      setHeader(null);
      setPayload(null);
      setIsExpired(null);
      setError(null);
      return;
    }

    try {
      const parts = jwtString.trim().split('.');
      if (parts.length < 2 || parts.length > 3) {
        throw new Error('JWT must have 2 or 3 parts separated by dots (.)');
      }

      const decodedHeader = JSON.parse(base64UrlDecode(parts[0]));
      const decodedPayload = JSON.parse(base64UrlDecode(parts[1]));

      setHeader(JSON.stringify(decodedHeader, null, 2));
      setPayload(JSON.stringify(decodedPayload, null, 2));
      setError(null);

      // Check expiry claim `exp`
      if (decodedPayload.exp) {
        const expMs = decodedPayload.exp * 1000;
        const now = Date.now();
        setIsExpired(now > expMs);
        setExpiryDate(new Date(expMs).toLocaleString());
      } else {
        setIsExpired(null);
        setExpiryDate(null);
      }
    } catch (err: any) {
      setError(err?.message || 'Invalid JWT structure or encoding.');
      setHeader(null);
      setPayload(null);
      setIsExpired(null);
    }
  };

  const handleCopy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedSection(key);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className={styles.toolContainer}>
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <span className={styles.panelTitle}>
            <KeyRound size={18} /> JSON Web Token (JWT) Decoder
          </span>
          <button
            type="button"
            onClick={() => decodeJwt('')}
            disabled={!token}
            className={styles.btnSecondary}
          >
            <Trash2 size={14} /> Clear
          </button>
        </div>

        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>Paste JWT Token</label>
          <textarea
            value={token}
            onChange={(e) => decodeJwt(e.target.value)}
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlRvb2xvY2sgVXNlciIsImlhdCI6MTUxNjIzOTAyMn0..."
            className={styles.textarea}
            style={{ minHeight: '120px' }}
          />
        </div>

        {error && (
          <div className={styles.errorAlert}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Expiry Badge */}
        {expiryDate && (
          <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isExpired ? (
              <span className={styles.savedBadge} style={{ background: 'rgba(239, 68, 68, 0.15)', borderColor: '#ef4444', color: '#f87171' }}>
                <ShieldAlert size={14} /> Token Expired ({expiryDate})
              </span>
            ) : (
              <span className={styles.savedBadge}>
                <ShieldCheck size={14} /> Token Active (Expires: {expiryDate})
              </span>
            )}
          </div>
        )}
      </div>

      {/* Decoded Sections */}
      {header && payload && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {/* Header */}
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <span className={styles.panelTitle} style={{ color: '#f87171' }}>
                Header (Algorithm & Token Type)
              </span>
              <button
                type="button"
                onClick={() => handleCopy(header, 'header')}
                className={styles.btnSecondary}
              >
                {copiedSection === 'header' ? <Check size={14} color="#4ade80" /> : <Copy size={14} />}
                {copiedSection === 'header' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre
              style={{
                background: 'var(--clr-surface-3)',
                padding: '12px',
                borderRadius: '8px',
                color: '#f87171',
                fontSize: '0.88rem',
                fontFamily: 'monospace',
                overflowX: 'auto',
              }}
            >
              {header}
            </pre>
          </div>

          {/* Payload */}
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <span className={styles.panelTitle} style={{ color: '#c084fc' }}>
                Payload (Data & Claims)
              </span>
              <button
                type="button"
                onClick={() => handleCopy(payload, 'payload')}
                className={styles.btnSecondary}
              >
                {copiedSection === 'payload' ? <Check size={14} color="#4ade80" /> : <Copy size={14} />}
                {copiedSection === 'payload' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre
              style={{
                background: 'var(--clr-surface-3)',
                padding: '12px',
                borderRadius: '8px',
                color: '#c084fc',
                fontSize: '0.88rem',
                fontFamily: 'monospace',
                overflowX: 'auto',
              }}
            >
              {payload}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
