import Link from 'next/link';
import {
  FileArchive, Minimize2, Braces, Eraser, GitCompare,
  FileText, Image, Type, Code2, Shield,
  ArrowRight, Zap,
} from 'lucide-react';
import styles from './PopularTools.module.css';

const TOOL_ICONS: Record<string, React.ElementType> = {
  'pdf-compressor':   FileArchive,
  'image-compressor': Minimize2,
  'json-formatter':   Braces,
  'background-remover': Eraser,
  'text-diff-checker': GitCompare,
};

const CATEGORY_META: Record<string, { icon: React.ElementType; label: string; accent: string }> = {
  'pdf-documents':    { icon: FileText, label: 'PDF', accent: 'violet' },
  'image':            { icon: Image,    label: 'Image', accent: 'blue' },
  'developer':        { icon: Code2,    label: 'Dev', accent: 'amber' },
  'text':             { icon: Type,     label: 'Text', accent: 'orange' },
  'security-privacy': { icon: Shield,   label: 'Security', accent: 'violet' },
};

const POPULAR_TOOLS = [
  {
    id: 'pdf-compressor',
    slug: 'pdf-compressor',
    name: 'PDF Compressor',
    description: 'Reduce PDF file size without sacrificing readability.',
    category: 'pdf-documents',
    processedLocally: false,
  },
  {
    id: 'image-compressor',
    slug: 'image-compressor',
    name: 'Image Compressor',
    description: 'Compress JPG, PNG and WebP images with minimal quality loss.',
    category: 'image',
    processedLocally: true,
  },
  {
    id: 'json-formatter',
    slug: 'json-formatter',
    name: 'JSON Formatter & Validator',
    description: 'Format, beautify and validate JSON data with syntax highlighting.',
    category: 'developer',
    processedLocally: true,
  },
  {
    id: 'background-remover',
    slug: 'background-remover',
    name: 'Background Remover',
    description: 'Remove the background from any photo automatically using AI.',
    category: 'image',
    processedLocally: false,
  },
  {
    id: 'text-diff-checker',
    slug: 'text-diff-checker',
    name: 'Text Diff Checker',
    description: 'Compare two texts side-by-side and highlight every difference.',
    category: 'text',
    processedLocally: true,
  },
];

export default function PopularTools() {
  return (
    <section className={styles.section} id="popular">
      <div className="container">
        <div className={styles.header}>
          <span className="section-label">Most Used</span>
          <h2 className="section-title">Popular Tools</h2>
          <p className="section-subtitle">
            The tools people reach for every day.
          </p>
        </div>

        <div className={styles.grid}>
          {POPULAR_TOOLS.map((tool) => {
            const ToolIcon = TOOL_ICONS[tool.id] ?? Zap;
            const catMeta = CATEGORY_META[tool.category];
            const CatIcon = catMeta?.icon ?? FileText;

            return (
              <Link
                key={tool.id}
                href={`/tools/${tool.slug}`}
                className={`${styles.card} ${styles[`accent-${catMeta?.accent ?? 'violet'}`]}`}
              >
                <div className={styles.cardGlow} aria-hidden="true" />

                <div className={styles.cardTop}>
                  <div className={styles.toolIconWrap}>
                    <ToolIcon size={20} strokeWidth={1.5} />
                  </div>
                  <div className={styles.catBadge}>
                    <CatIcon size={10} strokeWidth={2} />
                    <span>{catMeta?.label}</span>
                  </div>
                </div>

                <h3 className={styles.toolName}>{tool.name}</h3>
                <p className={styles.toolDesc}>{tool.description}</p>

                <div className={styles.cardBottom}>
                  {tool.processedLocally && (
                    <span className={styles.localBadge}>🔒 Browser-local</span>
                  )}
                  <div className={styles.openLink}>
                    <span>Open tool</span>
                    <ArrowRight size={13} className={styles.arrow} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
