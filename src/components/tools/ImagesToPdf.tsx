'use client';

import { useState } from 'react';
import { Download, RefreshCw, Images, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import ImageUploadZone from './ImageUploadZone';
import styles from './toolStyles.module.css';

interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
}

export default function ImagesToPdf() {
  const [imageList, setImageList] = useState<ImageItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = (files: File[]) => {
    const newItems: ImageItem[] = files.map((f, i) => ({
      id: `${f.name}-${Date.now()}-${i}`,
      file: f,
      previewUrl: URL.createObjectURL(f),
      name: f.name,
    }));
    setImageList((prev) => [...prev, ...newItems]);
    setPdfBlobUrl(null);
    setError(null);
  };

  const removeItem = (id: string) => {
    setImageList((prev) => prev.filter((item) => item.id !== id));
    setPdfBlobUrl(null);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    setImageList((prev) => {
      const copy = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= copy.length) return prev;
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  const convertToPdf = async () => {
    if (imageList.length === 0) return;
    setIsProcessing(true);
    setError(null);

    try {
      const pdfDoc = await PDFDocument.create();

      for (const item of imageList) {
        const fileBuffer = await item.file.arrayBuffer();
        let pdfImage;

        if (item.file.type === 'image/jpeg' || item.file.name.match(/\.(jpe?g)$/i)) {
          pdfImage = await pdfDoc.embedJpg(fileBuffer);
        } else if (item.file.type === 'image/png' || item.file.name.match(/\.png$/i)) {
          pdfImage = await pdfDoc.embedPng(fileBuffer);
        } else {
          // Convert other image types (WebP, GIF, BMP) via Canvas to PNG buffer
          const img = new Image();
          const imgUrl = URL.createObjectURL(item.file);
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject(new Error('Failed to load image for PDF embedding'));
            img.src = imgUrl;
          });

          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const pngBlob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/png'));
            if (pngBlob) {
              const pngBuffer = await pngBlob.arrayBuffer();
              pdfImage = await pdfDoc.embedPng(pngBuffer);
            }
          }
          URL.revokeObjectURL(imgUrl);
        }

        if (pdfImage) {
          const { width, height } = pdfImage;
          const page = pdfDoc.addPage([width, height]);
          page.drawImage(pdfImage, {
            x: 0,
            y: 0,
            width,
            height,
          });
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as Uint8Array<ArrayBuffer>], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfBlobUrl(url);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to convert images to PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!pdfBlobUrl) return;
    const link = document.createElement('a');
    link.href = pdfBlobUrl;
    link.download = 'converted-images.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.toolContainer}>
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <span className={styles.panelTitle}>
            <Images size={18} /> Convert Images to PDF
          </span>
          {imageList.length > 0 && (
            <button
              type="button"
              onClick={() => { setImageList([]); setPdfBlobUrl(null); }}
              className={styles.btnSecondary}
            >
              <RefreshCw size={14} /> Clear All
            </button>
          )}
        </div>

        <ImageUploadZone
          accept="image/*"
          multiple={true}
          onFilesSelected={handleFilesSelected}
          title="Select or Drop Images to Combine into PDF"
          subtitle="Supports JPG, PNG, WebP, GIF, SVG"
        />

        {error && (
          <div className={styles.errorAlert}>
            <span>{error}</span>
          </div>
        )}

        {imageList.length > 0 && (
          <div className={styles.previewContainer}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--clr-white-dim)', marginTop: '8px' }}>
              Pages in order ({imageList.length} images):
            </span>

            {imageList.map((item, index) => (
              <div key={item.id} className={styles.fileCard}>
                <div className={styles.fileCardLeft}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.previewUrl} alt={item.name} className={styles.fileThumbnail} />
                  <div className={styles.fileInfo}>
                    <span className={styles.fileName}>Page {index + 1}: {item.name}</span>
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
                    disabled={index === imageList.length - 1}
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
                onClick={convertToPdf}
                disabled={isProcessing || imageList.length === 0}
                className={styles.btnPrimary}
              >
                {isProcessing ? <RefreshCw size={16} className="animate-spin" /> : <Images size={16} />}
                {isProcessing ? 'Generating PDF...' : `Convert ${imageList.length} Images to PDF`}
              </button>
            </div>
          </div>
        )}

        {pdfBlobUrl && (
          <div className={styles.resultBox}>
            <div className={styles.resultStats}>
              <div className={styles.resultStatItem}>
                <span className={styles.resultStatLabel}>Status</span>
                <span className={styles.resultStatVal} style={{ color: '#4ade80' }}>
                  PDF Generated Successfully
                </span>
              </div>
            </div>

            <div className={styles.actionBtnRow}>
              <button type="button" onClick={handleDownload} className={styles.btnPrimary}>
                <Download size={16} /> Download Generated PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
