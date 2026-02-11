import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import QueryProvider from '@/providers/QueryProvider';
import TarteaucitronProvider from '@/components/TarteaucitronProvider';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'TableMaster - Système de Réservation sans Commission | 39€/mois',
  description:
    "Stoppez les 15% de commission sur vos réservations. Installation 1 minute. Gérez réservations et avis Google depuis mobile. Tarif fixe 39€/mois. Sans engagement, résiliable à tout moment.",
  keywords: 'réservation restaurant, système réservation, alternative TheFork, sans commission, widget réservation, avis Google restaurant',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'TableMaster',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/logo.png', sizes: '192x192', type: 'image/png' },
      { url: '/logo.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/logo.png', sizes: '152x152', type: 'image/png' }],
  },
};

export const viewport: Viewport = {
  themeColor: '#0066FF',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" data-theme="light">
      <head>
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="icon" type="image/png" href="/logo.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={`${inter.className} font-light antialiased bg-[#FAFAFA] text-[#2A2A2A]`}>
        <TarteaucitronProvider />
        <QueryProvider>
          {children}
          <Toaster position="top-right" richColors />
        </QueryProvider>
      </body>
    </html>
  );
}
