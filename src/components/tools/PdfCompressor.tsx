'use client';

import { useState } from 'react';
import { Download, RefreshCw, FileArchive, Check } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import ImageUploadZone from './ImageUploadZone';
import styles from './toolStyles.module.css';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export default function PdfCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (!files || files.length === 0) return;
    setFile(files[0]);
    setCompressedUrl(null);
    setCompressedSize(null);
    setError(null);
  };

  const compressPdf = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);

    try {
      const buffer = await file.arrayBuffer();
      // Load PDF and re-serialize with object stream optimization and structure normalization
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: false });

      // Save with useObjectStreams enabled to compress cross-reference tables and metadata objects
      const compressedBytes = await pdfDoc.save({ useObjectStreams: true, addDefaultPage: false });

      let finalBlob = new Blob([compressedBytes as Uint8Array<ArrayBuffer>], { type: 'application/pdf' });
      // If optimized stream is larger than original, preserve original bytes
      if (finalBlob.size >= file.size) {
        finalBlob = new Blob([buffer], { type: 'application/pdf' });
      }

      const newSize = Math.min(finalBlob.size, file.size);
      setCompressedSize(newSize);
      const url = URL.createObjectURL(finalBlob);
      setCompressedUrl(url);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to compress PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!compressedUrl || !file) return;
    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    const link = document.createElement('a');
    link.href = compressedUrl;
    link.download = `${baseName}-optimized.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setFile(null);
    setCompressedUrl(null);
    setCompressedSize(null);
    setError(null);
  };

  const savedPercent =
    file && compressedSize ? Math.max(0, Math.round(((file.size - compressedSize) / file.size) * 100)) : 0;

  return (
    <div className={styles.toolContainer}>
      {!file ? (
        <div className={styles.panel}>
          <ImageUploadZone
            accept="application/pdf"
            onFilesSelected={handleFilesSelected}
            title="Select or Drop PDF to Compress"
            subtitle="Optimize stream objects and remove redundant metadata"
          />
        </div>
      ) : (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>
              <FileArchive size={18} /> Compress PDF
            </span>
            <button type="button" onClick={handleReset} className={styles.btnSecondary}>
              <RefreshCw size={14} /> New PDF
            </button>
          </div>

          <div className={styles.fileCard}>
            <div className={styles.fileCardLeft}>
              <div style={{ padding: '8px', background: 'rgba(124, 58, 237, 0.15)', borderRadius: '6px', color: '#c4b5fd' }}>
                <FileArchive size={20} />
              </div>
              <div className={styles.fileInfo}>
                <span className={styles.fileName}>{file.name}</span>
                <span className={styles.fileMeta}>Original Size: {formatBytes(file.size)}</span>
              </div>
            </div>
          </div>

          {error && (
            <div className={styles.errorAlert}>
              <span>{error}</span>
            </div>
          )}

          <div className={styles.actionBtnRow}>
            <button
              type="button"
              onClick={compressPdf}
              disabled={isProcessing}
              className={styles.btnPrimary}
            >
              {isProcessing ? <RefreshCw size={16} className="animate-spin" /> : <FileArchive size={16} />}
              {isProcessing ? 'Optimizing PDF...' : 'Compress PDF'}
            </button>
          </div>

          {compressedUrl && compressedSize !== null && (
            <div className={styles.resultBox}>
              <div className={styles.resultStats}>
                <div className={styles.resultStatItem}>
                  <span className={styles.resultStatLabel}>Original Size</span>
                  <span className={styles.resultStatVal}>{formatBytes(file.size)}</span>
                </div>
                <div className={styles.resultStatItem}>
                  <span className={styles.resultStatLabel}>Optimized Size</span>
                  <span className={styles.resultStatVal} style={{ color: '#4ade80' }}>
                    {formatBytes(compressedSize)}
                  </span>
                </div>
                {savedPercent > 0 && (
                  <div className={styles.resultStatItem}>
                    <span className={styles.resultStatLabel}>Savings</span>
                    <span className={styles.savedBadge}>
                      <Check size={12} /> {savedPercent}% Reduced
                    </span>
                  </div>
                )}
              </div>

              <div className={styles.actionBtnRow}>
                <button type="button" onClick={handleDownload} className={styles.btnPrimary}>
                  <Download size={16} /> Download Compressed PDF
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
