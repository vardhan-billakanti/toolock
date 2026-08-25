'use client';

import { useState } from 'react';
import { Download, RefreshCw, ImageDown, FileText } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import ImageUploadZone from './ImageUploadZone';
import styles from './toolStyles.module.css';

interface ExtractedPage {
  pageNum: number;
  pdfBlobUrl: string;
}

export default function PdfToImages() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [pages, setPages] = useState<ExtractedPage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = async (files: File[]) => {
    if (!files || files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    setError(null);
    setPages([]);

    try {
      const buffer = await selected.arrayBuffer();
      const pdf = await PDFDocument.load(buffer);
      setPageCount(pdf.getPageCount());
    } catch (err: any) {
      console.error(err);
      setError('Could not read PDF. Ensure file is not corrupt or password-protected.');
    }
  };

  const processPdfPages = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);

    try {
      const buffer = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(buffer);
      const count = srcDoc.getPageCount();
      const extracted: ExtractedPage[] = [];

      for (let i = 0; i < count; i++) {
        const singleDoc = await PDFDocument.create();
        const [copied] = await singleDoc.copyPages(srcDoc, [i]);
        singleDoc.addPage(copied);
        const bytes = await singleDoc.save();
        const blob = new Blob([bytes as Uint8Array<ArrayBuffer>], { type: 'application/pdf' });
        extracted.push({
          pageNum: i + 1,
          pdfBlobUrl: URL.createObjectURL(blob),
        });
      }

      setPages(extracted);
    } catch (err: any) {
      console.error(err);
      setError('Failed to extract PDF pages.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadSinglePage = (page: ExtractedPage) => {
    if (!file) return;
    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    const link = document.createElement('a');
    link.href = page.pdfBlobUrl;
    link.download = `${baseName}-page-${page.pageNum}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setFile(null);
    setPageCount(0);
    setPages([]);
    setError(null);
  };

  return (
    <div className={styles.toolContainer}>
      {!file ? (
        <div className={styles.panel}>
          <ImageUploadZone
            accept="application/pdf"
            onFilesSelected={handleFilesSelected}
            title="Select or Drop PDF to Extract Pages"
            subtitle="Split and extract each page as standalone documents or images"
          />
        </div>
      ) : (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>
              <ImageDown size={18} /> Extract Pages from PDF
            </span>
            <button type="button" onClick={handleReset} className={styles.btnSecondary}>
              <RefreshCw size={14} /> New PDF
            </button>
          </div>

          <div className={styles.fileCard}>
            <div className={styles.fileCardLeft}>
              <div style={{ padding: '8px', background: 'rgba(124, 58, 237, 0.15)', borderRadius: '6px', color: '#c4b5fd' }}>
                <FileText size={20} />
              </div>
              <div className={styles.fileInfo}>
                <span className={styles.fileName}>{file.name}</span>
                <span className={styles.fileMeta}>Total Pages: {pageCount} | Size: {(file.size / 1024 / 1024).toFixed(2)} MB</span>
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
              onClick={processPdfPages}
              disabled={isProcessing}
              className={styles.btnPrimary}
            >
              {isProcessing ? <RefreshCw size={16} className="animate-spin" /> : <ImageDown size={16} />}
              {isProcessing ? 'Extracting Pages...' : `Extract All ${pageCount} Pages`}
            </button>
          </div>

          {pages.length > 0 && (
            <div className={styles.resultBox}>
              <span className={styles.panelTitle}>Extracted Pages ({pages.length})</span>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
                {pages.map((p) => (
                  <div
                    key={p.pageNum}
                    style={{
                      background: 'var(--clr-surface-3)',
                      border: '1px solid var(--clr-border)',
                      borderRadius: '8px',
                      padding: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <FileText size={32} color="#a78bfa" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--clr-white)' }}>
                      Page {p.pageNum}
                    </span>
                    <button
                      type="button"
                      onClick={() => downloadSinglePage(p)}
                      className={styles.btnSecondary}
                      style={{ width: '100%', fontSize: '0.78rem', padding: '4px 8px' }}
                    >
                      <Download size={12} /> Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
