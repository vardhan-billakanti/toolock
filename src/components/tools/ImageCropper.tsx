'use client';

import { useState, useRef, useEffect, useCallback, MouseEvent } from 'react';
import { Download, RefreshCw, Crop } from 'lucide-react';
import ImageUploadZone from './ImageUploadZone';
import styles from './toolStyles.module.css';

type AspectRatio = 'free' | '1:1' | '16:9' | '4:3' | '9:16';

export default function ImageCropper() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [aspect, setAspect] = useState<AspectRatio>('free');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  // Crop rectangle state (in percentage: 0 to 100)
  const [crop, setCrop] = useState<{ x: number; y: number; width: number; height: number }>({
    x: 10,
    y: 10,
    width: 80,
    height: 80,
  });

  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [initialCrop, setInitialCrop] = useState<{ x: number; y: number; width: number; height: number }>({
    x: 10,
    y: 10,
    width: 80,
    height: 80,
  });

  const handleFilesSelected = (files: File[]) => {
    if (!files || files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);
    setResultUrl(null);
    setCrop({ x: 10, y: 10, width: 80, height: 80 });
  };

  const applyAspectRatio = (ratio: AspectRatio) => {
    setAspect(ratio);
    if (ratio === '1:1') {
      setCrop({ x: 20, y: 20, width: 60, height: 60 });
    } else if (ratio === '16:9') {
      setCrop({ x: 10, y: 25, width: 80, height: 45 });
    } else if (ratio === '4:3') {
      setCrop({ x: 15, y: 20, width: 70, height: 52.5 });
    } else if (ratio === '9:16') {
      setCrop({ x: 30, y: 10, width: 40, height: 71 });
    }
  };

  const startDrag = (e: MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialCrop({ ...crop });
  };

  useEffect(() => {
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dx = ((e.clientX - dragStart.x) / rect.width) * 100;
      const dy = ((e.clientY - dragStart.y) / rect.height) * 100;

      setCrop({
        ...initialCrop,
        x: Math.max(0, Math.min(100 - initialCrop.width, initialCrop.x + dx)),
        y: Math.max(0, Math.min(100 - initialCrop.height, initialCrop.y + dy)),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, initialCrop]);

  const executeCrop = useCallback(() => {
    if (!file || !previewUrl || !imageRef.current) return;
    setIsProcessing(true);

    const img = imageRef.current;
    const canvas = document.createElement('canvas');
    const sourceX = (crop.x / 100) * img.naturalWidth;
    const sourceY = (crop.y / 100) * img.naturalHeight;
    const sourceW = (crop.width / 100) * img.naturalWidth;
    const sourceH = (crop.height / 100) * img.naturalHeight;

    canvas.width = Math.round(sourceW);
    canvas.height = Math.round(sourceH);
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setIsProcessing(false);
      return;
    }

    ctx.drawImage(img, sourceX, sourceY, sourceW, sourceH, 0, 0, canvas.width, canvas.height);

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
  }, [file, previewUrl, crop]);

  const handleDownload = () => {
    if (!resultUrl || !file) return;
    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    const link = document.createElement('a');
    link.href = resultUrl;
    link.download = `${baseName}-cropped.png`;
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
            title="Select or Drop Image to Crop"
            subtitle="Crop with custom or standard aspect ratios (1:1, 16:9, 4:3, 9:16)"
          />
        </div>
      ) : (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>
              <Crop size={18} /> Visual Image Cropper
            </span>
            <button type="button" onClick={handleReset} className={styles.btnSecondary}>
              <RefreshCw size={14} /> New Image
            </button>
          </div>

          {/* Aspect ratio buttons */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            {(['free', '1:1', '16:9', '4:3', '9:16'] as AspectRatio[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => applyAspectRatio(r)}
                className={aspect === r ? styles.btnPrimary : styles.btnSecondary}
                style={{ padding: '6px 12px', fontSize: '0.82rem' }}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Interactive Crop Viewport */}
          <div
            ref={containerRef}
            style={{
              position: 'relative',
              width: '100%',
              maxHeight: '440px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#09090c',
              border: '1px solid var(--clr-border)',
              borderRadius: '8px',
              overflow: 'hidden',
              userSelect: 'none',
            }}
          >
            {previewUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                ref={imageRef}
                src={previewUrl}
                alt="Crop preview"
                style={{ maxWidth: '100%', maxHeight: '440px', display: 'block' }}
                draggable={false}
              />
            )}

            {/* Dark Mask with Crop Box Hole */}
            <div
              onMouseDown={startDrag}
              style={{
                position: 'absolute',
                left: `${crop.x}%`,
                top: `${crop.y}%`,
                width: `${crop.width}%`,
                height: `${crop.height}%`,
                border: '2px solid #8b5cf6',
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.55)',
                cursor: 'move',
                zIndex: 10,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: 'rgba(0, 0, 0, 0.75)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '0.72rem',
                  color: '#fff',
                  pointerEvents: 'none',
                }}
              >
                Drag to position
              </div>
            </div>
          </div>

          <div className={styles.actionBtnRow}>
            <button
              type="button"
              onClick={executeCrop}
              disabled={isProcessing}
              className={styles.btnPrimary}
            >
              {isProcessing ? <RefreshCw size={16} className="animate-spin" /> : <Crop size={16} />}
              {isProcessing ? 'Cropping...' : 'Crop Image'}
            </button>
          </div>

          {resultUrl && (
            <div className={styles.resultBox}>
              <span className={styles.panelTitle}>Cropped Result</span>
              <div style={{ maxWidth: '320px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--clr-border)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={resultUrl} alt="Cropped" style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>

              <div className={styles.actionBtnRow}>
                <button type="button" onClick={handleDownload} className={styles.btnPrimary}>
                  <Download size={16} /> Download Cropped PNG
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
