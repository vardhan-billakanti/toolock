'use client';

import { useState, useCallback } from 'react';
import { Download, RefreshCw, ArrowRight } from 'lucide-react';
import ImageUploadZone from './ImageUploadZone';
import styles from './toolStyles.module.css';

type TargetFormat = 'image/png' | 'image/jpeg' | 'image/webp' | 'image/bmp';

const FORMAT_EXTS: Record<TargetFormat, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/bmp': 'bmp',
};

export default function ImageConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState<TargetFormat>('image/png');
  const [quality, setQuality] = useState(90);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (!files || files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);
    setResultUrl(null);
  };

  const convertImage = useCallback(() => {
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

      if (targetFormat === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const resUrl = URL.createObjectURL(blob);
            setResultUrl(resUrl);
          }
          setIsProcessing(false);
        },
        targetFormat,
        quality / 100
      );
    };
    img.src = previewUrl;
  }, [file, previewUrl, targetFormat, quality]);

  const handleDownload = () => {
    if (!resultUrl || !file) return;
    const ext = FORMAT_EXTS[targetFormat];
    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    const link = document.createElement('a');
    link.href = resultUrl;
    link.download = `${baseName}.${ext}`;
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
            title="Select or Drop Image to Convert"
            subtitle="Convert between PNG, JPG, WebP, BMP, and SVG"
          />
        </div>
      ) : (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>
              <RefreshCw size={18} /> Convert Format
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
                <span className={styles.fileMeta}>Type: {file.type || 'image'}</span>
              </div>
            </div>
          </div>

          {/* Target format controls */}
          <div className={styles.controlsGrid}>
            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>Convert to Format</label>
              <select
                value={targetFormat}
                onChange={(e) => setTargetFormat(e.target.value as TargetFormat)}
                className={styles.select}
              >
                <option value="image/png">PNG (Lossless transparency)</option>
                <option value="image/jpeg">JPEG / JPG (Standard photo)</option>
                <option value="image/webp">WebP (Modern web format)</option>
                <option value="image/bmp">BMP (Bitmap)</option>
              </select>
            </div>

            {(targetFormat === 'image/jpeg' || targetFormat === 'image/webp') && (
              <div className={styles.controlGroup}>
                <label className={styles.controlLabel}>Quality ({quality}%)</label>
                <div className={styles.rangeWrap}>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className={styles.rangeInput}
                  />
                  <span className={styles.rangeValue}>{quality}%</span>
                </div>
              </div>
            )}
          </div>

          <div className={styles.actionBtnRow}>
            <button
              type="button"
              onClick={convertImage}
              disabled={isProcessing}
              className={styles.btnPrimary}
            >
              {isProcessing ? <RefreshCw size={16} className="animate-spin" /> : <RefreshCw size={16} />}
              {isProcessing ? 'Converting...' : `Convert to ${FORMAT_EXTS[targetFormat].toUpperCase()}`}
            </button>
          </div>

          {resultUrl && (
            <div className={styles.resultBox}>
              <div className={styles.resultStats}>
                <div className={styles.resultStatItem}>
                  <span className={styles.resultStatLabel}>Conversion Status</span>
                  <span className={styles.resultStatVal} style={{ color: '#4ade80' }}>
                    Ready ({FORMAT_EXTS[targetFormat].toUpperCase()})
                  </span>
                </div>
              </div>

              <div className={styles.actionBtnRow}>
                <button type="button" onClick={handleDownload} className={styles.btnPrimary}>
                  <Download size={16} /> Download {FORMAT_EXTS[targetFormat].toUpperCase()}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
