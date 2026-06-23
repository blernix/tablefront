import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import QueryProvider from '@/providers/QueryProvider';
import ServiceWorkerUpdater from '@/components/ServiceWorkerUpdater';
import TarteaucitronProvider from '@/components/TarteaucitronProvider';
import { headers } from 'next/headers';
import Script from 'next/script';
import './globals.css';
import {
  getPageMetadata,
  organizationStructuredData,
  softwareStructuredData,
  pricingStructuredData,
  faqStructuredData,
  productComparisonStructuredData,
} from '@/config/metadata';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
});

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const pathname = headersList.get('x-invoke-path') || '/';
  const metadata = getPageMetadata(pathname);
  return {
    metadataBase: new URL('https://tablemaster.fr'),
    ...metadata,
  };
}

export const viewport: Viewport = {
  themeColor: '#FAFAFA',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const pathname = headersList.get('x-invoke-path') || '/';

  // Mapping des noms de pages pour le fil d'Ariane
  const pageNames: Record<string, string> = {
    '/': 'Accueil',
    '/legal': 'Mentions Légales',
    '/privacy': 'Politique de Confidentialité',
    '/cookies': 'Gestion des Cookies',
    '/cgv': 'Conditions Générales de Vente',
    '/signup': 'Inscription',
    '/login': 'Connexion',
    '/dashboard': 'Tableau de Bord',
  };

  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Accueil',
        item: 'https://tablemaster.fr',
      },
    ],
  };

  if (pathname !== '/' && pageNames[pathname]) {
    breadcrumbStructuredData.itemListElement.push({
      '@type': 'ListItem',
      position: 2,
      name: pageNames[pathname],
      item: `https://tablemaster.fr${pathname}`,
    });
  }

  return (
    <html lang="fr" data-theme="light">
      <head>
        {/* --- Umami Analytics (privacy-first, no cookies, GDPR compliant) --- */}
        <Script
          src="https://analytique.killian-lecrut.com/script.js"
          data-website-id="ab136b94-e68a-48c3-95da-f44e25f6c806"
          strategy="afterInteractive"
        />
        <Script
          src="https://analytique.killian-lecrut.com/recorder.js"
          data-website-id="ab136b94-e68a-48c3-95da-f44e25f6c806"
          data-sample-rate="1"
          data-mask-level="moderate"
          data-max-duration="300000"
          strategy="afterInteractive"
        />

        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/favicon/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#FAFAFA" />
        <meta name="msapplication-TileColor" content="#FAFAFA" />

        {/* Données structurées existantes */}
        <Script
          id="organization-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
        />
        <Script
          id="product-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareStructuredData) }}
        />
        <Script
          id="pro-product-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingStructuredData) }}
        />
        <Script
          id="breadcrumb-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
        />
        <Script
          id="faq-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
        />
        <Script
          id="product-comparison-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productComparisonStructuredData) }}
        />
      </head>
      <body className={`${inter.className} font-light antialiased bg-[#FAFAFA] text-[#2A2A2A]`}>
        <TarteaucitronProvider />
        <ServiceWorkerUpdater />
        <QueryProvider>
          {children}
          <Toaster position="top-right" richColors />
        </QueryProvider>
      </body>
    </html>
  );
}
