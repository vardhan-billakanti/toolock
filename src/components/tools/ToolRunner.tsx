'use client';

import dynamic from 'next/dynamic';
import type { Tool } from '@/data/tools';
import styles from './toolStyles.module.css';

// Dynamically import all 20 tool engines for optimal code splitting & bundle performance
const PdfMerger = dynamic(() => import('./PdfMerger'), { ssr: false });
const PdfSplitter = dynamic(() => import('./PdfSplitter'), { ssr: false });
const PdfCompressor = dynamic(() => import('./PdfCompressor'), { ssr: false });
const ImagesToPdf = dynamic(() => import('./ImagesToPdf'), { ssr: false });
const PdfToImages = dynamic(() => import('./PdfToImages'), { ssr: false });

const ImageCompressor = dynamic(() => import('./ImageCompressor'), { ssr: false });
const ImageResizer = dynamic(() => import('./ImageResizer'), { ssr: false });
const ImageConverter = dynamic(() => import('./ImageConverter'), { ssr: false });
const ImageCropper = dynamic(() => import('./ImageCropper'), { ssr: false });
const BackgroundRemover = dynamic(() => import('./BackgroundRemover'), { ssr: false });

const WordCounter = dynamic(() => import('./WordCounter'), { ssr: false });
const TextCleaner = dynamic(() => import('./TextCleaner'), { ssr: false });
const TextCaseConverter = dynamic(() => import('./TextCaseConverter'), { ssr: false });
const TextDiffChecker = dynamic(() => import('./TextDiffChecker'), { ssr: false });

const JsonFormatter = dynamic(() => import('./JsonFormatter'), { ssr: false });
const Base64Encoder = dynamic(() => import('./Base64Encoder'), { ssr: false });
const UrlEncoder = dynamic(() => import('./UrlEncoder'), { ssr: false });
const JwtDecoder = dynamic(() => import('./JwtDecoder'), { ssr: false });

const HashGenerator = dynamic(() => import('./HashGenerator'), { ssr: false });
const MetadataRemover = dynamic(() => import('./MetadataRemover'), { ssr: false });

interface ToolRunnerProps {
  tool: Tool;
}

export default function ToolRunner({ tool }: ToolRunnerProps) {
  switch (tool.slug) {
    case 'pdf-merger':
      return <PdfMerger />;
    case 'pdf-splitter':
      return <PdfSplitter />;
    case 'pdf-compressor':
      return <PdfCompressor />;
    case 'images-to-pdf':
      return <ImagesToPdf />;
    case 'pdf-to-images':
      return <PdfToImages />;

    case 'image-compressor':
      return <ImageCompressor />;
    case 'image-resizer':
      return <ImageResizer />;
    case 'image-converter':
      return <ImageConverter />;
    case 'image-cropper':
      return <ImageCropper />;
    case 'background-remover':
      return <BackgroundRemover />;

    case 'word-counter':
      return <WordCounter />;
    case 'text-cleaner':
      return <TextCleaner />;
    case 'text-case-converter':
      return <TextCaseConverter />;
    case 'text-diff-checker':
      return <TextDiffChecker />;

    case 'json-formatter':
      return <JsonFormatter />;
    case 'base64-encoder':
      return <Base64Encoder />;
    case 'url-encoder':
      return <UrlEncoder />;
    case 'jwt-decoder':
      return <JwtDecoder />;

    case 'hash-generator':
      return <HashGenerator />;
    case 'metadata-remover':
      return <MetadataRemover />;

    default:
      return (
        <div className={styles.panel}>
          <p style={{ color: 'var(--clr-white-dim)' }}>Tool engine loading...</p>
        </div>
      );
  }
}
