'use client';

import { useState, useCallback } from 'react';
import { Download, RefreshCw, Minimize2, Check, FileCheck } from 'lucide-react';
import ImageUploadZone from './ImageUploadZone';
import styles from './toolStyles.module.css';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export default function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState<number>(80);
  const [format, setFormat] = useState<'image/jpeg' | 'image/webp' | 'image/png'>('image/jpeg');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (!files || files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);
    setResultBlob(null);
    setResultUrl(null);
    setCompressedSize(null);
  };

  const compressImage = useCallback(async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = objectUrl;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) throw new Error('Canvas 2D context not supported');

      // Draw with white background if converting to JPEG to avoid black transparent areas
      if (format === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            setResultBlob(blob);
            setCompressedSize(blob.size);
            const resUrl = URL.createObjectURL(blob);
            setResultUrl(resUrl);
          }
          setIsProcessing(false);
          URL.revokeObjectURL(objectUrl);
        },
        format,
        quality / 100
      );
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  }, [file, format, quality]);

  const handleDownload = () => {
    if (!resultUrl || !file) return;
    const ext = format === 'image/jpeg' ? 'jpg' : format === 'image/webp' ? 'webp' : 'png';
    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    const link = document.createElement('a');
    link.href = resultUrl;
    link.download = `${baseName}-compressed.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setFile(null);
    setPreviewUrl(null);
    setResultBlob(null);
    setResultUrl(null);
    setCompressedSize(null);
  };

  const savedPercent =
    file && compressedSize ? Math.max(0, Math.round(((file.size - compressedSize) / file.size) * 100)) : 0;

  return (
    <div className={styles.toolContainer}>
      {!file ? (
        <div className={styles.panel}>
          <ImageUploadZone
            accept="image/png, image/jpeg, image/webp, image/bmp"
            onFilesSelected={handleFilesSelected}
            title="Select or Drop Image to Compress"
            subtitle="JPG, PNG, WebP up to 50MB"
          />
        </div>
      ) : (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>
              <Minimize2 size={18} /> Image Compression Settings
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
                <span className={styles.fileMeta}>Original: {formatBytes(file.size)}</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className={styles.controlsGrid}>
            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>Quality ({quality}%)</label>
              <div className={styles.rangeWrap}>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className={styles.rangeInput}
                />
                <span className={styles.rangeValue}>{quality}%</span>
              </div>
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>Output Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as 'image/jpeg' | 'image/webp' | 'image/png')}
                className={styles.select}
              >
                <option value="image/jpeg">JPEG (Smaller file size)</option>
                <option value="image/webp">WebP (Modern high efficiency)</option>
                <option value="image/png">PNG (Lossless)</option>
              </select>
            </div>
          </div>

          <div className={styles.actionBtnRow}>
            <button
              type="button"
              onClick={compressImage}
              disabled={isProcessing}
              className={styles.btnPrimary}
            >
              {isProcessing ? <RefreshCw size={16} className="animate-spin" /> : <Minimize2 size={16} />}
              {isProcessing ? 'Compressing...' : 'Compress Image'}
            </button>
          </div>

          {/* Results */}
          {resultBlob && compressedSize !== null && (
            <div className={styles.resultBox}>
              <div className={styles.resultStats}>
                <div className={styles.resultStatItem}>
                  <span className={styles.resultStatLabel}>Original Size</span>
                  <span className={styles.resultStatVal}>{formatBytes(file.size)}</span>
                </div>
                <div className={styles.resultStatItem}>
                  <span className={styles.resultStatLabel}>Compressed Size</span>
                  <span className={styles.resultStatVal} style={{ color: '#4ade80' }}>
                    {formatBytes(compressedSize)}
                  </span>
                </div>
                <div className={styles.resultStatItem}>
                  <span className={styles.resultStatLabel}>Savings</span>
                  <span className={styles.savedBadge}>
                    <Check size={12} /> {savedPercent}% Reduced
                  </span>
                </div>
              </div>

              <div className={styles.actionBtnRow}>
                <button type="button" onClick={handleDownload} className={styles.btnPrimary}>
                  <Download size={16} /> Download Compressed Image
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
