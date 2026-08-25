import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import CommandPaletteLoader from '@/components/CommandPalette/CommandPaletteLoader';
import CustomCursorLoader from '@/components/Cursor/CustomCursorLoader';

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://toolock.vercel.app'),
  alternates: {
    canonical: '/',
  },
  title: {
    default: 'Toolock — All the Tools. One Place.',
    template: '%s | Toolock',
  },
  description:
    'Toolock is a premium all-in-one digital tools platform for PDFs, images, text, development and security. Fast, simple and private.',
  keywords: ['PDF tools', 'image tools', 'developer tools', 'text tools', 'online tools', 'Toolock'],
  authors: [{ name: 'Toolock', url: 'https://toolock.vercel.app' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://toolock.vercel.app',
    siteName: 'Toolock',
    title: 'Toolock — All the Tools. One Place.',
    description:
      'Premium tools for PDFs, images, text, development and security. All in one place.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Toolock — All the Tools. One Place.',
    description:
      'Premium tools for PDFs, images, text, development and security. All in one place.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Toolock',
  url: 'https://toolock.vercel.app',
  description:
    'Toolock is a premium all-in-one digital tools platform for PDFs, images, text, development and security. Fast, simple and private.',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://toolock.vercel.app/tools?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Navbar />
        <main style={{ paddingTop: 'var(--navbar-height)' }} className="page-enter">
          {children}
        </main>
        <Footer />
        {/* Global command palette — Ctrl+K or search trigger */}
        <CommandPaletteLoader />
        {/* Custom cursor — desktop only, self-disables on touch */}
        <CustomCursorLoader />
      </body>
    </html>
  );
}
