'use client';

import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { Upload, X, AlertCircle } from 'lucide-react';
import styles from './toolStyles.module.css';

interface ImageUploadZoneProps {
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  onFilesSelected: (files: File[]) => void;
  title?: string;
  subtitle?: string;
}

export default function ImageUploadZone({
  accept = 'image/png, image/jpeg, image/webp, image/gif, image/avif, image/svg+xml',
  multiple = false,
  maxSizeMB = 50,
  onFilesSelected,
  title = 'Click to browse or drop files here',
  subtitle = 'Supports PNG, JPG, WebP, GIF, SVG up to 50MB',
}: ImageUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setError(null);

    const validFiles: File[] = [];
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (file.size > maxSizeBytes) {
        setError(`File "${file.name}" exceeds the ${maxSizeMB}MB limit.`);
        return;
      }
      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    // Reset file input value so re-uploading the same file triggers change
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  return (
    <div className={styles.controlGroup}>
      <div
        className={`${styles.uploadZone} ${isDragging ? styles.uploadZoneDragging : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Upload files"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className={styles.hiddenFileInput}
        />
        <div className={styles.uploadIconWrap}>
          <Upload size={24} />
        </div>
        <span className={styles.uploadText}>{title}</span>
        <span className={styles.uploadHint}>{subtitle}</span>
        <span className={styles.uploadBtnMock}>Select from Device</span>
      </div>

      {error && (
        <div className={styles.errorAlert}>
          <AlertCircle size={16} />
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            style={{ background: 'none', border: 'none', color: 'inherit', marginLeft: 'auto', cursor: 'pointer' }}
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
