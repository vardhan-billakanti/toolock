'use client';

import { useState } from 'react';
import { Download, RefreshCw, FilePlus2, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import ImageUploadZone from './ImageUploadZone';
import styles from './toolStyles.module.css';

interface PdfItem {
  id: string;
  file: File;
  name: string;
  size: number;
}

export default function PdfMerger() {
  const [pdfList, setPdfList] = useState<PdfItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mergedBlobUrl, setMergedBlobUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = (files: File[]) => {
    const newItems: PdfItem[] = files.map((f, i) => ({
      id: `${f.name}-${Date.now()}-${i}`,
      file: f,
      name: f.name,
      size: f.size,
    }));
    setPdfList((prev) => [...prev, ...newItems]);
    setMergedBlobUrl(null);
    setError(null);
  };

  const removeItem = (id: string) => {
    setPdfList((prev) => prev.filter((item) => item.id !== id));
    setMergedBlobUrl(null);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    setPdfList((prev) => {
      const copy = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= copy.length) return prev;
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  const mergePdfs = async () => {
    if (pdfList.length < 2) {
      setError('Please add at least 2 PDF files to merge.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const item of pdfList) {
        const fileBuffer = await item.file.arrayBuffer();
        const pdf = await PDFDocument.load(fileBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes as Uint8Array<ArrayBuffer>], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setMergedBlobUrl(url);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to merge PDF files. Ensure files are valid PDF documents.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!mergedBlobUrl) return;
    const link = document.createElement('a');
    link.href = mergedBlobUrl;
    link.download = 'merged-document.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.toolContainer}>
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <span className={styles.panelTitle}>
            <FilePlus2 size={18} /> Merge Multiple PDF Files
          </span>
          {pdfList.length > 0 && (
            <button
              type="button"
              onClick={() => { setPdfList([]); setMergedBlobUrl(null); }}
              className={styles.btnSecondary}
            >
              <RefreshCw size={14} /> Clear All
            </button>
          )}
        </div>

        <ImageUploadZone
          accept="application/pdf"
          multiple={true}
          onFilesSelected={handleFilesSelected}
          title="Select or Drop PDF Files Here"
          subtitle="Choose 2 or more PDF documents to merge into a single file"
        />

        {error && (
          <div className={styles.errorAlert}>
            <span>{error}</span>
          </div>
        )}

        {/* Selected files list with reordering */}
        {pdfList.length > 0 && (
          <div className={styles.previewContainer}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--clr-white-dim)', marginTop: '8px' }}>
              Files to merge ({pdfList.length} files):
            </span>

            {pdfList.map((item, index) => (
              <div key={item.id} className={styles.fileCard}>
                <div className={styles.fileCardLeft}>
                  <div style={{ padding: '6px 10px', background: 'rgba(124, 58, 237, 0.15)', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700, color: '#c4b5fd' }}>
                    #{index + 1}
                  </div>
                  <div className={styles.fileInfo}>
                    <span className={styles.fileName}>{item.name}</span>
                    <span className={styles.fileMeta}>{(item.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => moveItem(index, 'up')}
                    disabled={index === 0}
                    className={styles.btnSecondary}
                    style={{ padding: '4px 8px' }}
                    title="Move up"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(index, 'down')}
                    disabled={index === pdfList.length - 1}
                    className={styles.btnSecondary}
                    style={{ padding: '4px 8px' }}
                    title="Move down"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className={styles.btnDanger}
                    title="Remove"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}

            <div className={styles.actionBtnRow}>
              <button
                type="button"
                onClick={mergePdfs}
                disabled={isProcessing || pdfList.length < 2}
                className={styles.btnPrimary}
              >
                {isProcessing ? <RefreshCw size={16} className="animate-spin" /> : <FilePlus2 size={16} />}
                {isProcessing ? 'Merging PDFs...' : `Merge ${pdfList.length} PDFs`}
              </button>
            </div>
          </div>
        )}

        {/* Download result */}
        {mergedBlobUrl && (
          <div className={styles.resultBox}>
            <div className={styles.resultStats}>
              <div className={styles.resultStatItem}>
                <span className={styles.resultStatLabel}>Status</span>
                <span className={styles.resultStatVal} style={{ color: '#4ade80' }}>
                  Merged Successfully
                </span>
              </div>
            </div>

            <div className={styles.actionBtnRow}>
              <button type="button" onClick={handleDownload} className={styles.btnPrimary}>
                <Download size={16} /> Download Combined PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
