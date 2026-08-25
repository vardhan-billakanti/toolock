'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, Copy, Check, Trash2 } from 'lucide-react';
import styles from './toolStyles.module.css';

// Lightweight pure JS MD5 implementation for client-side hashing
function md5(inputString: string): string {
  let hc = '0123456789abcdef';
  function rh(n: number) {
    let s = '';
    for (let j = 0; j <= 3; j++)
      s += hc.charAt((n >> (j * 8 + 4)) & 0x0f) + hc.charAt((n >> (j * 8)) & 0x0f);
    return s;
  }
  function ad(x: number, y: number) {
    let l = (x & 0xffff) + (y & 0xffff);
    let m = (x >> 16) + (y >> 16) + (l >> 16);
    return (m << 16) | (l & 0xffff);
  }
  function rl(n: number, c: number) {
    return (n << c) | (n >>> (32 - c));
  }
  function cm(q: number, a: number, b: number, x: number, s: number, t: number) {
    return ad(rl(ad(ad(a, q), ad(x, t)), s), b);
  }
  function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cm((b & c) | (~b & d), a, b, x, s, t);
  }
  function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cm((b & d) | (c & ~d), a, b, x, s, t);
  }
  function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cm(b ^ c ^ d, a, b, x, s, t);
  }
  function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cm(c ^ (b | ~d), a, b, x, s, t);
  }

  let x: number[] = [];
  let k = 0;
  for (let i = 0; i < inputString.length; i++) {
    x[k >> 5] |= (inputString.charCodeAt(i) & 0xff) << (k % 32);
    k += 8;
  }
  x[k >> 5] |= 0x80 << (k % 32);
  x[(((k + 64) >>> 9) << 4) + 14] = k;

  let a = 1732584193;
  let b = -271733879;
  let c = -1732584194;
  let d = 271733878;

  for (let i = 0; i < x.length; i += 16) {
    let olda = a,
      oldb = b,
      oldc = c,
      oldd = d;
    a = ff(a, b, c, d, x[i + 0] || 0, 7, -680876936);
    d = ff(d, a, b, c, x[i + 1] || 0, 12, -389564586);
    c = ff(c, d, a, b, x[i + 2] || 0, 17, 606105819);
    b = ff(b, c, d, a, x[i + 3] || 0, 22, -1044525330);
    a = ff(a, b, c, d, x[i + 4] || 0, 7, -176418897);
    d = ff(d, a, b, c, x[i + 5] || 0, 12, 1200080426);
    c = ff(c, d, a, b, x[i + 6] || 0, 17, -1473231341);
    b = ff(b, c, d, a, x[i + 7] || 0, 22, -45705983);
    a = ff(a, b, c, d, x[i + 8] || 0, 7, 1770035416);
    d = ff(d, a, b, c, x[i + 9] || 0, 12, -1958414417);
    c = ff(c, d, a, b, x[i + 10] || 0, 17, -42063);
    b = ff(b, c, d, a, x[i + 11] || 0, 22, -1990404162);
    a = ff(a, b, c, d, x[i + 12] || 0, 7, 1804603682);
    d = ff(d, a, b, c, x[i + 13] || 0, 12, -40341101);
    c = ff(c, d, a, b, x[i + 14] || 0, 17, -1502002290);
    b = ff(b, c, d, a, x[i + 15] || 0, 22, 1236535329);

    a = gg(a, b, c, d, x[i + 1] || 0, 5, -165796510);
    d = gg(d, a, b, c, x[i + 6] || 0, 9, -1069501632);
    c = gg(c, d, a, b, x[i + 11] || 0, 14, 643717713);
    b = gg(b, c, d, a, x[i + 0] || 0, 20, -373897302);
    a = gg(a, b, c, d, x[i + 5] || 0, 5, -701558691);
    d = gg(d, a, b, c, x[i + 10] || 0, 9, 38016083);
    c = gg(c, d, a, b, x[i + 15] || 0, 14, -660478335);
    b = gg(b, c, d, a, x[i + 4] || 0, 20, -405537848);
    a = gg(a, b, c, d, x[i + 9] || 0, 5, 568446438);
    d = gg(d, a, b, c, x[i + 14] || 0, 9, -1019803690);
    c = gg(c, d, a, b, x[i + 3] || 0, 14, -187363961);
    b = gg(b, c, d, a, x[i + 8] || 0, 20, 1163531501);
    a = gg(a, b, c, d, x[i + 13] || 0, 5, -1444681467);
    d = gg(d, a, b, c, x[i + 2] || 0, 9, -51403784);
    c = gg(c, d, a, b, x[i + 7] || 0, 14, 1735328473);
    b = gg(b, c, d, a, x[i + 12] || 0, 20, -1926607734);

    a = hh(a, b, c, d, x[i + 5] || 0, 4, -378558);
    d = hh(d, a, b, c, x[i + 8] || 0, 11, -2022574463);
    c = hh(c, d, a, b, x[i + 11] || 0, 16, 1839030562);
    b = hh(b, c, d, a, x[i + 14] || 0, 23, -35309556);
    a = hh(a, b, c, d, x[i + 1] || 0, 4, -1530992060);
    d = hh(d, a, b, c, x[i + 4] || 0, 11, 1272893353);
    c = hh(c, d, a, b, x[i + 7] || 0, 16, -155497632);
    b = hh(b, c, d, a, x[i + 10] || 0, 23, -1094730640);
    a = hh(a, b, c, d, x[i + 13] || 0, 4, 681279174);
    d = hh(d, a, b, c, x[i + 0] || 0, 11, -358537222);
    c = hh(c, d, a, b, x[i + 3] || 0, 16, -722521979);
    b = hh(b, c, d, a, x[i + 6] || 0, 23, 76029189);
    a = hh(a, b, c, d, x[i + 9] || 0, 4, -640364487);
    d = hh(d, a, b, c, x[i + 12] || 0, 11, -421815835);
    c = hh(c, d, a, b, x[i + 15] || 0, 16, 530742520);
    b = hh(b, c, d, a, x[i + 2] || 0, 23, -995338651);

    a = ii(a, b, c, d, x[i + 0] || 0, 6, -198630844);
    d = ii(d, a, b, c, x[i + 7] || 0, 10, 1126891415);
    c = ii(c, d, a, b, x[i + 14] || 0, 15, -1416354905);
    b = ii(b, c, d, a, x[i + 5] || 0, 21, -57434055);
    a = ii(a, b, c, d, x[i + 12] || 0, 6, 1700485571);
    d = ii(d, a, b, c, x[i + 3] || 0, 10, -1894986606);
    c = ii(c, d, a, b, x[i + 10] || 0, 15, -1051523);
    b = ii(b, c, d, a, x[i + 1] || 0, 21, -2054922799);
    a = ii(a, b, c, d, x[i + 8] || 0, 6, 1873313359);
    d = ii(d, a, b, c, x[i + 15] || 0, 10, -30611744);
    c = ii(c, d, a, b, x[i + 6] || 0, 15, -1560198380);
    b = ii(b, c, d, a, x[i + 13] || 0, 21, 1309151649);
    a = ii(a, b, c, d, x[i + 4] || 0, 6, -145523070);
    d = ii(d, a, b, c, x[i + 11] || 0, 10, -1120210379);
    c = ii(c, d, a, b, x[i + 2] || 0, 15, 718787259);
    b = ii(b, c, d, a, x[i + 9] || 0, 21, -343485551);

    a = ad(a, olda);
    b = ad(b, oldb);
    c = ad(c, oldc);
    d = ad(d, oldd);
  }
  return rh(a) + rh(b) + rh(c) + rh(d);
}

export default function HashGenerator() {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState<Record<string, string>>({
    MD5: '',
    'SHA-1': '',
    'SHA-256': '',
    'SHA-384': '',
    'SHA-512': '',
  });
  const [uppercase, setUppercase] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (!input) {
      setHashes({
        MD5: '',
        'SHA-1': '',
        'SHA-256': '',
        'SHA-384': '',
        'SHA-512': '',
      });
      return;
    }

    const calcHashes = async () => {
      const data = new TextEncoder().encode(input);

      const [sha1, sha256, sha384, sha512] = await Promise.all([
        crypto.subtle.digest('SHA-1', data),
        crypto.subtle.digest('SHA-256', data),
        crypto.subtle.digest('SHA-384', data),
        crypto.subtle.digest('SHA-512', data),
      ]);

      const bufferToHex = (buf: ArrayBuffer) =>
        Array.from(new Uint8Array(buf))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');

      setHashes({
        MD5: md5(input),
        'SHA-1': bufferToHex(sha1),
        'SHA-256': bufferToHex(sha256),
        'SHA-384': bufferToHex(sha384),
        'SHA-512': bufferToHex(sha512),
      });
    };

    calcHashes();
  }, [input]);

  const copyHash = async (val: string, key: string) => {
    const finalVal = uppercase ? val.toUpperCase() : val.toLowerCase();
    await navigator.clipboard.writeText(finalVal);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className={styles.toolContainer}>
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <span className={styles.panelTitle}>
            <ShieldCheck size={18} /> Cryptographic Hash Generator
          </span>
          <div className={styles.panelActions}>
            <button
              type="button"
              onClick={() => setUppercase(!uppercase)}
              className={styles.btnSecondary}
            >
              {uppercase ? 'UPPERCASE HEX' : 'lowercase hex'}
            </button>
            <button
              type="button"
              onClick={() => setInput('')}
              disabled={!input}
              className={styles.btnSecondary}
            >
              <Trash2 size={14} /> Clear
            </button>
          </div>
        </div>

        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>Input Text</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or paste any text to hash in real time..."
            className={styles.textarea}
            style={{ minHeight: '120px' }}
          />
        </div>
      </div>

      {/* Hashes Output List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {Object.entries(hashes).map(([algo, hashVal]) => {
          const displayVal = uppercase ? hashVal.toUpperCase() : hashVal.toLowerCase();
          return (
            <div
              key={algo}
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
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--clr-violet-400)' }}>
                  {algo}
                </span>
                <button
                  type="button"
                  onClick={() => copyHash(hashVal, algo)}
                  disabled={!hashVal}
                  className={styles.btnSecondary}
                  style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                >
                  {copiedKey === algo ? <Check size={12} color="#4ade80" /> : <Copy size={12} />}
                  {copiedKey === algo ? 'Copied' : 'Copy Hash'}
                </button>
              </div>

              <div
                style={{
                  background: 'var(--clr-surface-3)',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  fontFamily: 'monospace',
                  color: 'var(--clr-white)',
                  wordBreak: 'break-all',
                  minHeight: '36px',
                }}
              >
                {displayVal || <span style={{ color: 'var(--clr-white-muted)' }}>Enter text above...</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
