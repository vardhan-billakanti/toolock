'use client';

import { useState } from 'react';
import { Download, RefreshCw, Scissors, AlertCircle } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import ImageUploadZone from './ImageUploadZone';
import styles from './toolStyles.module.css';

export default function PdfSplitter() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [rangeInput, setRangeInput] = useState<string>('1');
  const [isProcessing, setIsProcessing] = useState(false);
  const [splitBlobUrl, setSplitBlobUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = async (files: File[]) => {
    if (!files || files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    setError(null);
    setSplitBlobUrl(null);

    try {
      const buffer = await selected.arrayBuffer();
      const pdf = await PDFDocument.load(buffer);
      const pages = pdf.getPageCount();
      setTotalPages(pages);
      setRangeInput(pages > 1 ? `1-${pages}` : '1');
    } catch (err: any) {
      console.error(err);
      setError('Could not read PDF. Ensure the file is not password protected.');
    }
  };

  const parsePageRanges = (input: string, maxPages: number): number[] => {
    const pages = new Set<number>();
    const parts = input.split(',').map((p) => p.trim());

    for (const part of parts) {
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-').map((s) => s.trim());
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end)) {
          for (let p = Math.min(start, end); p <= Math.max(start, end); p++) {
            if (p >= 1 && p <= maxPages) pages.add(p - 1);
          }
        }
      } else {
        const p = parseInt(part, 10);
        if (!isNaN(p) && p >= 1 && p <= maxPages) {
          pages.add(p - 1);
        }
      }
    }
    return Array.from(pages).sort((a, b) => a - b);
  };

  const splitPdf = async () => {
    if (!file || totalPages === 0) return;
    setIsProcessing(true);
    setError(null);

    try {
      const pageIndices = parsePageRanges(rangeInput, totalPages);
      if (pageIndices.length === 0) {
        throw new Error(`Invalid page range. Enter page numbers between 1 and ${totalPages}.`);
      }

      const buffer = await file.arrayBuffer();
      const srcPdf = await PDFDocument.load(buffer);
      const newPdf = await PDFDocument.create();

      const copied = await newPdf.copyPages(srcPdf, pageIndices);
      copied.forEach((p) => newPdf.addPage(p));

      const bytes = await newPdf.save();
      const blob = new Blob([bytes as Uint8Array<ArrayBuffer>], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setSplitBlobUrl(url);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to extract PDF pages.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!splitBlobUrl || !file) return;
    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    const link = document.createElement('a');
    link.href = splitBlobUrl;
    link.download = `${baseName}-extracted.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setFile(null);
    setTotalPages(0);
    setSplitBlobUrl(null);
    setError(null);
  };

  return (
    <div className={styles.toolContainer}>
      {!file ? (
        <div className={styles.panel}>
          <ImageUploadZone
            accept="application/pdf"
            onFilesSelected={handleFilesSelected}
            title="Select or Drop PDF to Split"
            subtitle="Extract specific pages or page ranges into a new document"
          />
        </div>
      ) : (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>
              <Scissors size={18} /> Split PDF Pages
            </span>
            <button type="button" onClick={handleReset} className={styles.btnSecondary}>
              <RefreshCw size={14} /> New PDF
            </button>
          </div>

          <div className={styles.fileCard}>
            <div className={styles.fileCardLeft}>
              <div style={{ padding: '8px', background: 'rgba(124, 58, 237, 0.15)', borderRadius: '6px', color: '#c4b5fd' }}>
                <Scissors size={20} />
              </div>
              <div className={styles.fileInfo}>
                <span className={styles.fileName}>{file.name}</span>
                <span className={styles.fileMeta}>Total Pages: {totalPages} | Size: {(file.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
            </div>
          </div>

          <div className={styles.controlsGrid} style={{ marginTop: '16px' }}>
            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>Page Selection (e.g. 1-3, 5)</label>
              <input
                type="text"
                value={rangeInput}
                onChange={(e) => setRangeInput(e.target.value)}
                placeholder={`1-${totalPages}`}
                className={styles.input}
              />
              <span style={{ fontSize: '0.78rem', color: 'var(--clr-white-muted)' }}>
                Examples: &quot;1-5&quot;, &quot;1, 3, 5&quot;, or &quot;2-4, 7&quot; (Max {totalPages} pages)
              </span>
            </div>
          </div>

          {error && (
            <div className={styles.errorAlert}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className={styles.actionBtnRow}>
            <button
              type="button"
              onClick={splitPdf}
              disabled={isProcessing || !rangeInput.trim()}
              className={styles.btnPrimary}
            >
              {isProcessing ? <RefreshCw size={16} className="animate-spin" /> : <Scissors size={16} />}
              {isProcessing ? 'Extracting Pages...' : 'Extract Selected Pages'}
            </button>
          </div>

          {splitBlobUrl && (
            <div className={styles.resultBox}>
              <div className={styles.resultStats}>
                <div className={styles.resultStatItem}>
                  <span className={styles.resultStatLabel}>Status</span>
                  <span className={styles.resultStatVal} style={{ color: '#4ade80' }}>
                    Pages Extracted
                  </span>
                </div>
              </div>

              <div className={styles.actionBtnRow}>
                <button type="button" onClick={handleDownload} className={styles.btnPrimary}>
                  <Download size={16} /> Download Extracted PDF
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
