'use client';

import { useState, useCallback, useEffect } from 'react';
import { Download, RefreshCw, Expand, Lock, Unlock } from 'lucide-react';
import ImageUploadZone from './ImageUploadZone';
import styles from './toolStyles.module.css';

export default function ImageResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [origWidth, setOrigWidth] = useState<number>(0);
  const [origHeight, setOrigHeight] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [lockAspect, setLockAspect] = useState(true);
  const [format, setFormat] = useState<'image/png' | 'image/jpeg' | 'image/webp'>('image/png');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultDimensions, setResultDimensions] = useState<{ width: number; height: number } | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (!files || files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);
    setResultUrl(null);
    setResultDimensions(null);

    const img = new Image();
    img.onload = () => {
      setOrigWidth(img.naturalWidth);
      setOrigHeight(img.naturalHeight);
      setWidth(img.naturalWidth);
      setHeight(img.naturalHeight);
    };
    img.src = url;
  };

  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth);
    if (lockAspect && origWidth > 0) {
      const ratio = origHeight / origWidth;
      setHeight(Math.round(newWidth * ratio));
    }
  };

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight);
    if (lockAspect && origHeight > 0) {
      const ratio = origWidth / origHeight;
      setWidth(Math.round(newHeight * ratio));
    }
  };

  const setPercentage = (pct: number) => {
    if (origWidth > 0 && origHeight > 0) {
      setWidth(Math.round((origWidth * pct) / 100));
      setHeight(Math.round((origHeight * pct) / 100));
    }
  };

  const resizeImage = useCallback(() => {
    if (!file || !previewUrl || width <= 0 || height <= 0) return;
    setIsProcessing(true);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsProcessing(false);
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      if (format === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const resUrl = URL.createObjectURL(blob);
            setResultUrl(resUrl);
            setResultDimensions({ width, height });
          }
          setIsProcessing(false);
        },
        format,
        0.92
      );
    };
    img.src = previewUrl;
  }, [file, previewUrl, width, height, format]);

  const handleDownload = () => {
    if (!resultUrl || !file) return;
    const ext = format === 'image/jpeg' ? 'jpg' : format === 'image/webp' ? 'webp' : 'png';
    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    const link = document.createElement('a');
    link.href = resultUrl;
    link.download = `${baseName}-${width}x${height}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setFile(null);
    setPreviewUrl(null);
    setResultUrl(null);
    setResultDimensions(null);
  };

  return (
    <div className={styles.toolContainer}>
      {!file ? (
        <div className={styles.panel}>
          <ImageUploadZone
            accept="image/png, image/jpeg, image/webp, image/bmp, image/svg+xml"
            onFilesSelected={handleFilesSelected}
            title="Select or Drop Image to Resize"
            subtitle="Custom dimensions, aspect ratio lock, and instant export"
          />
        </div>
      ) : (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>
              <Expand size={18} /> Resize Dimensions
            </span>
            <button type="button" onClick={handleReset} className={styles.btnSecondary}>
              <RefreshCw size={14} /> New Image
            </button>
          </div>

          <div className={styles.fileCard}>
            <div className={styles.fileCardLeft}>
              {previewUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewUrl} alt="Preview" className={styles.fileThumbnail} />
              )}
              <div className={styles.fileInfo}>
                <span className={styles.fileName}>{file.name}</span>
                <span className={styles.fileMeta}>Original: {origWidth} × {origHeight} px</span>
              </div>
            </div>
          </div>

          {/* Quick Percentages */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--clr-white-muted)', alignSelf: 'center' }}>Presets:</span>
            {[25, 50, 75, 100, 150, 200].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => setPercentage(pct)}
                className={styles.btnSecondary}
                style={{ padding: '4px 10px', fontSize: '0.78rem' }}
              >
                {pct}%
              </button>
            ))}
          </div>

          {/* Dimension inputs */}
          <div className={styles.controlsGrid}>
            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>Width (px)</label>
              <input
                type="number"
                min="1"
                max="10000"
                value={width || ''}
                onChange={(e) => handleWidthChange(Math.max(1, parseInt(e.target.value) || 0))}
                className={styles.input}
              />
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>Height (px)</label>
              <input
                type="number"
                min="1"
                max="10000"
                value={height || ''}
                onChange={(e) => handleHeightChange(Math.max(1, parseInt(e.target.value) || 0))}
                className={styles.input}
              />
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>Aspect Ratio</label>
              <button
                type="button"
                onClick={() => setLockAspect(!lockAspect)}
                className={styles.btnSecondary}
                style={{ height: '38px' }}
              >
                {lockAspect ? <Lock size={14} color="#a78bfa" /> : <Unlock size={14} />}
                {lockAspect ? 'Locked' : 'Unlocked'}
              </button>
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>Output Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as 'image/png' | 'image/jpeg' | 'image/webp')}
                className={styles.select}
              >
                <option value="image/png">PNG</option>
                <option value="image/jpeg">JPEG</option>
                <option value="image/webp">WebP</option>
              </select>
            </div>
          </div>

          <div className={styles.actionBtnRow}>
            <button
              type="button"
              onClick={resizeImage}
              disabled={isProcessing || width <= 0 || height <= 0}
              className={styles.btnPrimary}
            >
              {isProcessing ? <RefreshCw size={16} className="animate-spin" /> : <Expand size={16} />}
              {isProcessing ? 'Resizing...' : 'Resize Image'}
            </button>
          </div>

          {/* Result preview & download */}
          {resultUrl && resultDimensions && (
            <div className={styles.resultBox}>
              <div className={styles.resultStats}>
                <div className={styles.resultStatItem}>
                  <span className={styles.resultStatLabel}>Target Dimensions</span>
                  <span className={styles.resultStatVal} style={{ color: '#4ade80' }}>
                    {resultDimensions.width} × {resultDimensions.height} px
                  </span>
                </div>
              </div>

              <div style={{ maxWidth: '300px', maxHeight: '200px', overflow: 'hidden', borderRadius: '8px', border: '1px solid var(--clr-border)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={resultUrl} alt="Resized output" style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>

              <div className={styles.actionBtnRow}>
                <button type="button" onClick={handleDownload} className={styles.btnPrimary}>
                  <Download size={16} /> Download Resized Image
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
