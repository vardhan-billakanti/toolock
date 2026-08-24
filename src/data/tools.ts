// ============================================================
// Toolora — Centralized Tool Registry
// All tools, categories and metadata live here.
// Adding a new tool = adding one entry to TOOLS array.
// ============================================================

export type CategorySlug =
  | 'pdf-documents'
  | 'image'
  | 'text'
  | 'developer'
  | 'security-privacy';

export interface Tool {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: CategorySlug;
  icon: string;          // Lucide icon name
  popular?: boolean;
  processedLocally?: boolean; // true = can be processed client-side
  tags?: string[];
}

export interface Category {
  slug: CategorySlug;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  accentColor: 'violet' | 'blue' | 'orange' | 'amber';
  tools?: Tool[];
}

// ============================================================
// TOOL REGISTRY — Add new tools here
// ============================================================
export const TOOLS: Tool[] = [
  // ── PDF & Documents ─────────────────────────────────────
  {
    id: 'pdf-merger',
    slug: 'pdf-merger',
    name: 'PDF Merger',
    description: 'Combine multiple PDF files into a single document in seconds.',
    category: 'pdf-documents',
    icon: 'FilePlus2',
    tags: ['pdf', 'merge', 'combine', 'documents'],
    processedLocally: false,
  },
  {
    id: 'pdf-splitter',
    slug: 'pdf-splitter',
    name: 'PDF Splitter',
    description: 'Split a PDF into individual pages or custom page ranges.',
    category: 'pdf-documents',
    icon: 'Scissors',
    tags: ['pdf', 'split', 'pages', 'documents'],
    processedLocally: false,
  },
  {
    id: 'pdf-compressor',
    slug: 'pdf-compressor',
    name: 'PDF Compressor',
    description: 'Reduce PDF file size without sacrificing readability.',
    category: 'pdf-documents',
    icon: 'FileArchive',
    popular: true,
    tags: ['pdf', 'compress', 'reduce', 'size'],
    processedLocally: false,
  },
  {
    id: 'images-to-pdf',
    slug: 'images-to-pdf',
    name: 'Images → PDF',
    description: 'Convert JPG, PNG and other images into a combined PDF file.',
    category: 'pdf-documents',
    icon: 'Images',
    tags: ['pdf', 'images', 'convert', 'jpg', 'png'],
    processedLocally: true,
  },
  {
    id: 'pdf-to-images',
    slug: 'pdf-to-images',
    name: 'PDF → Images',
    description: 'Extract every page of a PDF as a high-quality image file.',
    category: 'pdf-documents',
    icon: 'ImageDown',
    tags: ['pdf', 'images', 'extract', 'pages'],
    processedLocally: false,
  },

  // ── Image ────────────────────────────────────────────────
  {
    id: 'image-compressor',
    slug: 'image-compressor',
    name: 'Image Compressor',
    description: 'Compress JPG, PNG and WebP images with minimal quality loss.',
    category: 'image',
    icon: 'Minimize2',
    popular: true,
    tags: ['image', 'compress', 'optimize', 'jpg', 'png'],
    processedLocally: true,
  },
  {
    id: 'image-resizer',
    slug: 'image-resizer',
    name: 'Image Resizer',
    description: 'Resize images to exact dimensions or by percentage.',
    category: 'image',
    icon: 'Expand',
    tags: ['image', 'resize', 'dimensions', 'scale'],
    processedLocally: true,
  },
  {
    id: 'image-converter',
    slug: 'image-converter',
    name: 'Image Converter',
    description: 'Convert images between JPG, PNG, WebP, AVIF and more.',
    category: 'image',
    icon: 'RefreshCw',
    tags: ['image', 'convert', 'format', 'webp', 'avif'],
    processedLocally: true,
  },
  {
    id: 'image-cropper',
    slug: 'image-cropper',
    name: 'Image Cropper',
    description: 'Crop images to any size or aspect ratio with a visual editor.',
    category: 'image',
    icon: 'Crop',
    tags: ['image', 'crop', 'trim', 'aspect ratio'],
    processedLocally: true,
  },
  {
    id: 'background-remover',
    slug: 'background-remover',
    name: 'Background Remover',
    description: 'Remove the background from any photo automatically using AI.',
    category: 'image',
    icon: 'Eraser',
    popular: true,
    tags: ['image', 'background', 'remove', 'transparent', 'ai'],
    processedLocally: false,
  },

  // ── Text ─────────────────────────────────────────────────
  {
    id: 'word-counter',
    slug: 'word-counter',
    name: 'Word & Character Counter',
    description: 'Count words, characters, sentences and paragraphs in any text.',
    category: 'text',
    icon: 'Hash',
    tags: ['text', 'words', 'characters', 'count'],
    processedLocally: true,
  },
  {
    id: 'text-cleaner',
    slug: 'text-cleaner',
    name: 'Text Cleaner',
    description: 'Remove extra spaces, line breaks, HTML tags and unwanted characters.',
    category: 'text',
    icon: 'Sparkles',
    tags: ['text', 'clean', 'format', 'whitespace'],
    processedLocally: true,
  },
  {
    id: 'text-case-converter',
    slug: 'text-case-converter',
    name: 'Text Case Converter',
    description: 'Convert text to UPPERCASE, lowercase, Title Case, camelCase and more.',
    category: 'text',
    icon: 'CaseSensitive',
    tags: ['text', 'case', 'convert', 'uppercase', 'lowercase'],
    processedLocally: true,
  },
  {
    id: 'text-diff-checker',
    slug: 'text-diff-checker',
    name: 'Text Diff Checker',
    description: 'Compare two texts side-by-side and highlight every difference.',
    category: 'text',
    icon: 'GitCompare',
    popular: true,
    tags: ['text', 'diff', 'compare', 'differences'],
    processedLocally: true,
  },

  // ── Developer ────────────────────────────────────────────
  {
    id: 'json-formatter',
    slug: 'json-formatter',
    name: 'JSON Formatter & Validator',
    description: 'Format, beautify and validate JSON data with syntax highlighting.',
    category: 'developer',
    icon: 'Braces',
    popular: true,
    tags: ['json', 'format', 'validate', 'developer', 'code'],
    processedLocally: true,
  },
  {
    id: 'base64-encoder',
    slug: 'base64-encoder',
    name: 'Base64 Encoder / Decoder',
    description: 'Encode text or files to Base64 and decode Base64 strings instantly.',
    category: 'developer',
    icon: 'Binary',
    tags: ['base64', 'encode', 'decode', 'developer'],
    processedLocally: true,
  },
  {
    id: 'url-encoder',
    slug: 'url-encoder',
    name: 'URL Encoder / Decoder',
    description: 'Encode special characters in URLs and decode percent-encoded strings.',
    category: 'developer',
    icon: 'Link2',
    tags: ['url', 'encode', 'decode', 'percent', 'developer'],
    processedLocally: true,
  },
  {
    id: 'jwt-decoder',
    slug: 'jwt-decoder',
    name: 'JWT Decoder',
    description: 'Decode and inspect JSON Web Tokens — header, payload and signature.',
    category: 'developer',
    icon: 'KeyRound',
    tags: ['jwt', 'token', 'decode', 'auth', 'developer'],
    processedLocally: true,
  },

  // ── Security & Privacy ───────────────────────────────────
  {
    id: 'hash-generator',
    slug: 'hash-generator',
    name: 'Hash Generator',
    description: 'Generate MD5, SHA-1, SHA-256 and SHA-512 hashes from any text.',
    category: 'security-privacy',
    icon: 'ShieldCheck',
    tags: ['hash', 'md5', 'sha', 'security', 'checksum'],
    processedLocally: true,
  },
  {
    id: 'metadata-remover',
    slug: 'metadata-remover',
    name: 'Metadata Remover',
    description: 'Strip EXIF and metadata from images to protect your privacy.',
    category: 'security-privacy',
    icon: 'EyeOff',
    tags: ['metadata', 'exif', 'privacy', 'remove', 'image'],
    processedLocally: true,
  },
];

// ============================================================
// CATEGORY REGISTRY
// ============================================================
export const CATEGORIES: Category[] = [
  {
    slug: 'pdf-documents',
    name: 'PDF & Documents',
    shortName: 'PDF',
    description: 'Merge, split, compress and convert PDF files with ease.',
    icon: 'FileText',
    accentColor: 'violet',
  },
  {
    slug: 'image',
    name: 'Image',
    shortName: 'Image',
    description: 'Compress, resize, convert and edit images in your browser.',
    icon: 'Image',
    accentColor: 'blue',
  },
  {
    slug: 'text',
    name: 'Text',
    shortName: 'Text',
    description: 'Count, clean, compare and transform text instantly.',
    icon: 'Type',
    accentColor: 'orange',
  },
  {
    slug: 'developer',
    name: 'Developer',
    shortName: 'Dev',
    description: 'Format JSON, encode data, decode tokens and more.',
    icon: 'Code2',
    accentColor: 'amber',
  },
  {
    slug: 'security-privacy',
    name: 'Security & Privacy',
    shortName: 'Security',
    description: 'Generate hashes, remove metadata and protect your data.',
    icon: 'Shield',
    accentColor: 'violet',
  },
];

// ============================================================
// HELPERS
// ============================================================

export function getToolsByCategory(categorySlug: CategorySlug): Tool[] {
  return TOOLS.filter((t) => t.category === categorySlug);
}

export function getPopularTools(): Tool[] {
  return TOOLS.filter((t) => t.popular);
}

export function getToolBySlug(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function searchTools(query: string): Tool[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return TOOLS.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.category.includes(q) ||
      t.tags?.some((tag) => tag.includes(q))
  );
}
