'use client';

import { useState, useCallback } from 'react';
import { Download, RefreshCw, EyeOff, ShieldCheck, Check } from 'lucide-react';
import ImageUploadZone from './ImageUploadZone';
import styles from './toolStyles.module.css';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export default function MetadataRemover() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cleanUrl, setCleanUrl] = useState<string | null>(null);
  const [cleanSize, setCleanSize] = useState<number | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (!files || files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);
    setCleanUrl(null);
    setCleanSize(null);
  };

  const removeMetadata = useCallback(() => {
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

      const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';

      canvas.toBlob(
        (blob) => {
          if (blob) {
            setCleanSize(blob.size);
            const resUrl = URL.createObjectURL(blob);
            setCleanUrl(resUrl);
          }
          setIsProcessing(false);
        },
        outputType,
        0.95
      );
    };
    img.src = previewUrl;
  }, [file, previewUrl]);

  const handleDownload = () => {
    if (!cleanUrl || !file) return;
    const ext = file.type === 'image/png' ? 'png' : 'jpg';
    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    const link = document.createElement('a');
    link.href = cleanUrl;
    link.download = `${baseName}-cleaned.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setFile(null);
    setPreviewUrl(null);
    setCleanUrl(null);
    setCleanSize(null);
  };

  return (
    <div className={styles.toolContainer}>
      {!file ? (
        <div className={styles.panel}>
          <ImageUploadZone
            accept="image/jpeg, image/png, image/webp, image/tiff"
            onFilesSelected={handleFilesSelected}
            title="Select or Drop Photo to Strip Metadata"
            subtitle="Remove EXIF, GPS Location, Camera info, and privacy timestamps"
          />
        </div>
      ) : (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>
              <EyeOff size={18} /> Privacy Metadata Remover
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

          <div className={styles.actionBtnRow}>
            <button
              type="button"
              onClick={removeMetadata}
              disabled={isProcessing}
              className={styles.btnPrimary}
            >
              {isProcessing ? <RefreshCw size={16} className="animate-spin" /> : <EyeOff size={16} />}
              {isProcessing ? 'Sanitizing Image...' : 'Strip All Metadata (EXIF/GPS)'}
            </button>
          </div>

          {cleanUrl && cleanSize !== null && (
            <div className={styles.resultBox}>
              <div className={styles.resultStats}>
                <div className={styles.resultStatItem}>
                  <span className={styles.resultStatLabel}>Privacy Status</span>
                  <span className={styles.savedBadge}>
                    <ShieldCheck size={14} /> 100% Sanitized & Clean
                  </span>
                </div>

                <div className={styles.resultStatItem}>
                  <span className={styles.resultStatLabel}>Original Size</span>
                  <span className={styles.resultStatVal}>{formatBytes(file.size)}</span>
                </div>

                <div className={styles.resultStatItem}>
                  <span className={styles.resultStatLabel}>Clean Size</span>
                  <span className={styles.resultStatVal} style={{ color: '#4ade80' }}>
                    {formatBytes(cleanSize)}
                  </span>
                </div>
              </div>

              <div className={styles.actionBtnRow}>
                <button type="button" onClick={handleDownload} className={styles.btnPrimary}>
                  <Download size={16} /> Download Sanitized Image
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
