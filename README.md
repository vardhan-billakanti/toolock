# Toolock

A modern, privacy-first developer and creative productivity suite with client-side media manipulation, PDF operations, code formatting, and quick-launch command palette navigation.

## Overview

**Toolock** is an all-in-one web utility ecosystem that brings together high-frequency developer tools, PDF document utilities, image processing algorithms, and text transformations into a cohesive, fast, and responsive interface. All computation executes locally inside the browser using modern Web APIs (Canvas, Web Workers, and WebAssembly where applicable), guaranteeing zero data exposure and instant processing without upload wait times.

## Features

### 🛠️ Developer & Code Tools
- **JSON Formatter & Validator**: Syntax highlighting, tree indentation, minification, and schema validation.
- **JWT Decoder**: Inspect claims, headers, signatures, and expiration timestamps safely without sending tokens over the wire.
- **Hash Generator**: Real-time SHA-256, SHA-512, MD5, and SHA-1 hashing.
- **Base64 & URL Encoder/Decoder**: Two-way string and binary transformation with instant clipboard export.

### 📄 PDF Document Utilities
- **PDF Merger**: Combine multiple PDF documents into a single ordered file.
- **PDF Splitter**: Extract specific page ranges or burst documents into individual pages.
- **PDF Compressor**: Optimize document size through client-side stream compression.
- **PDF to Images / Images to PDF**: Cross-format conversion between multi-page documents and image collections.

### 🖼️ Image & Media Tools
- **Image Compressor & Resizer**: Visual quality tuning, aspect ratio preservation, and dimension scaling.
- **Image Format Converter**: Convert seamlessly between PNG, JPEG, WebP, and SVG formats.
- **Image Cropper**: Interactive boundary cropping with preset aspect ratios.
- **Metadata Remover**: Strip EXIF and camera metadata for enhanced privacy before publishing photos.
- **Background Remover**: Local boundary segmentation for product and portrait images.

### ✍️ Text & Writing Utilities
- **Text Diff Checker**: Side-by-side and unified git-style text difference comparisons.
- **Text Case Converter**: UPPERCASE, lowercase, camelCase, kebab-case, snake_case, and Title Case.
- **Text Cleaner**: Remove extra whitespaces, empty lines, and duplicate characters.
- **Word Counter**: Real-time word, character, sentence, paragraph, and reading time metrics.

### ⚡ Navigation & UX
- **Command Palette (`Cmd/Ctrl + K`)**: Quick-jump search across all 20+ utilities with keyboard shortcuts.
- **Categorized Directory**: Filter tools by Developer, PDF, Media, and Text disciplines.
- **Local Privacy**: 100% in-browser processing; files and payloads never leave the user's machine.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Typography & Styling**: CSS Modules, Geist Font
- **PDF Manipulation**: `pdf-lib`
- **Text Comparison**: `diff`
- **Icons**: Lucide React
- **Language**: TypeScript 5

## Architecture

```
Browser User Interface
         │
         ├── Command Palette (Ctrl+K) ──► Instant Tool Routing
         │
         ▼
/tools/[slug] Dynamic Runner Page
         │
         ├── PDF Engine (pdf-lib) ──────► Local Blob Generation
         ├── Canvas / Media Engine ─────► Client-side Image Manipulation
         └── Crypto & Formatters ───────► Web Crypto API & Native JS
```

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── categories/       # Category-based tool browsing
│   │   ├── tools/[slug]/     # Dynamic tool execution shell
│   │   ├── layout.tsx        # Global shell and font provider
│   │   └── page.tsx          # Main landing hero and tool ecosystem
│   ├── components/
│   │   ├── CommandPalette/   # Global quick-launcher
│   │   ├── tools/            # Concrete tool implementations (20+ components)
│   │   ├── Navbar/ & Footer/ # Shell navigation and brand layout
│   │   └── Search/           # Instant filter and search components
│   └── data/
│       └── tools.ts          # Central registry of tool metadata, slugs, and categories
├── public/                   # Static branding and vector assets
└── .env.example              # Development environment template
```

## Getting Started

### Prerequisites

- Node.js 18.17 or higher
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/vardhan-billakanti/toolock.git
   cd toolock
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) to access Toolock.

## Available Scripts

- `npm run dev`: Start the development server with hot reloading.
- `npm run build`: Compile and bundle for production.
- `npm run start`: Run the production build locally.
- `npm run lint`: Run ESLint checks.

## Security

Toolock operates under a strict privacy-first model. All uploaded documents, images, and text snippets are processed directly within browser memory using client-side Web APIs. No user data is sent to external servers or logged in remote telemetry.

## Author

**Billakanti Jaya Vardhan**
- GitHub: [@vardhan-billakanti](https://github.com/vardhan-billakanti)
