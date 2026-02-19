import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import QueryProvider from '@/providers/QueryProvider';
import TarteaucitronProvider from '@/components/TarteaucitronProvider';
import { headers } from 'next/headers';
import Script from 'next/script';
import './globals.css';
import {
  getPageMetadata,
  organizationStructuredData,
  softwareStructuredData,
  pricingStructuredData,
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
  themeColor: '#0066FF',
  width: 'device-width',
  initialScale: 1,
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

  // Ajouter la page courante si ce n'est pas l'accueil
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
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/favicon/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#0066FF" />
        <meta name="msapplication-TileColor" content="#0066FF" />
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
