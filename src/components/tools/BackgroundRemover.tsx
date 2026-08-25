'use client';

import { useState, useRef, useCallback } from 'react';
import { Download, RefreshCw, Eraser, Eye, Pipette } from 'lucide-react';
import ImageUploadZone from './ImageUploadZone';
import styles from './toolStyles.module.css';

export default function BackgroundRemover() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [targetColor, setTargetColor] = useState<{ r: number; g: number; b: number }>({ r: 255, g: 255, b: 255 });
  const [tolerance, setTolerance] = useState<number>(35);
  const [feather, setFeather] = useState<number>(10);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isPickingColor, setIsPickingColor] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFilesSelected = (files: File[]) => {
    if (!files || files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);
    setResultUrl(null);

    // Sample top-left corner color automatically as initial background guess
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const ctx = c.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const p = ctx.getImageData(0, 0, 1, 1).data;
        setTargetColor({ r: p[0], g: p[1], b: p[2] });
      }
    };
    img.src = url;
  };

  const removeBackground = useCallback(() => {
    if (!file || !previewUrl) return;
    setIsProcessing(true);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsProcessing(false);
        return;
      }

      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      const tr = targetColor.r;
      const tg = targetColor.g;
      const tb = targetColor.b;
      const tolDist = (tolerance / 100) * 441.67; // max distance in 3D RGB space is sqrt(255^2*3) = 441.67
      const featherDist = (feather / 100) * 100;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Euclidean color distance
        const dist = Math.sqrt(
          (r - tr) * (r - tr) +
          (g - tg) * (g - tg) +
          (b - tb) * (b - tb)
        );

        if (dist <= tolDist) {
          // Fully transparent
          data[i + 3] = 0;
        } else if (dist < tolDist + featherDist && featherDist > 0) {
          // Smooth alpha feathering
          const alphaFactor = (dist - tolDist) / featherDist;
          data[i + 3] = Math.round(data[i + 3] * alphaFactor);
        }
      }

      ctx.putImageData(imgData, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const resUrl = URL.createObjectURL(blob);
            setResultUrl(resUrl);
          }
          setIsProcessing(false);
        },
        'image/png'
      );
    };
    img.src = previewUrl;
  }, [file, previewUrl, targetColor, tolerance, feather]);

  const handleDownload = () => {
    if (!resultUrl || !file) return;
    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    const link = document.createElement('a');
    link.href = resultUrl;
    link.download = `${baseName}-transparent.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setFile(null);
    setPreviewUrl(null);
    setResultUrl(null);
  };

  return (
    <div className={styles.toolContainer}>
      {!file ? (
        <div className={styles.panel}>
          <ImageUploadZone
            accept="image/*"
            onFilesSelected={handleFilesSelected}
            title="Select or Drop Photo to Remove Background"
            subtitle="Automatic background detection & transparent PNG export"
          />
        </div>
      ) : (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>
              <Eraser size={18} /> Background Removal
            </span>
            <button type="button" onClick={handleReset} className={styles.btnSecondary}>
              <RefreshCw size={14} /> New Image
            </button>
          </div>

          {/* Color & Tolerance Settings */}
          <div className={styles.controlsGrid}>
            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>
                Target Background Color
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="color"
                  value={`#${targetColor.r.toString(16).padStart(2, '0')}${targetColor.g.toString(16).padStart(2, '0')}${targetColor.b.toString(16).padStart(2, '0')}`}
                  onChange={(e) => {
                    const hex = e.target.value;
                    const r = parseInt(hex.substring(1, 3), 16);
                    const g = parseInt(hex.substring(3, 5), 16);
                    const b = parseInt(hex.substring(5, 7), 16);
                    setTargetColor({ r, g, b });
                  }}
                  style={{ width: '42px', height: '36px', border: 'none', borderRadius: '4px', cursor: 'pointer', background: 'transparent' }}
                />
                <span style={{ fontSize: '0.85rem', color: 'var(--clr-white-dim)' }}>
                  RGB({targetColor.r}, {targetColor.g}, {targetColor.b})
                </span>
              </div>
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>Tolerance ({tolerance}%)</label>
              <div className={styles.rangeWrap}>
                <input
                  type="range"
                  min="5"
                  max="90"
                  value={tolerance}
                  onChange={(e) => setTolerance(Number(e.target.value))}
                  className={styles.rangeInput}
                />
                <span className={styles.rangeValue}>{tolerance}%</span>
              </div>
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>Edge Softness ({feather}%)</label>
              <div className={styles.rangeWrap}>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={feather}
                  onChange={(e) => setFeather(Number(e.target.value))}
                  className={styles.rangeInput}
                />
                <span className={styles.rangeValue}>{feather}%</span>
              </div>
            </div>
          </div>

          <div className={styles.actionBtnRow}>
            <button
              type="button"
              onClick={removeBackground}
              disabled={isProcessing}
              className={styles.btnPrimary}
            >
              {isProcessing ? <RefreshCw size={16} className="animate-spin" /> : <Eraser size={16} />}
              {isProcessing ? 'Processing...' : 'Remove Background'}
            </button>
          </div>

          {/* Result view */}
          {resultUrl && (
            <div className={styles.resultBox}>
              <span className={styles.panelTitle}>Transparent Result</span>
              <div
                className={styles.checkerboard}
                style={{
                  maxWidth: '360px',
                  borderRadius: '8px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--clr-border)',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={resultUrl} alt="Transparent Result" style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }} />
              </div>

              <div className={styles.actionBtnRow}>
                <button type="button" onClick={handleDownload} className={styles.btnPrimary}>
                  <Download size={16} /> Download Transparent PNG
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
