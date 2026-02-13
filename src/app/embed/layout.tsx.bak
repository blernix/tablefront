import { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  robots: 'noindex, nofollow',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

export default function EmbedLayout({ children }: { children: React.ReactNode }) {
  // Don't return <html> or <body> tags here - Next.js will use the root layout
  // This layout is just for adding embed-specific metadata
  return <>{children}</>;
}
