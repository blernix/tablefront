import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import QueryProvider from '@/providers/QueryProvider';
import TarteaucitronProvider from '@/components/TarteaucitronProvider';
import { headers } from 'next/headers';
import Script from 'next/script'; // Import important pour le GTM
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
  themeColor: '#0066FF',
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
        {/* --- GOOGLE CONSENT MODE V2 (doit être chargé AVANT GTM) --- */}
        <Script id="google-consent-default" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('consent', 'default', {
              'analytics_storage': 'denied',
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'functionality_storage': 'granted',
              'personalization_storage': 'denied',
              'security_storage': 'granted',
              'wait_for_update': 2000,
            });
          `}
        </Script>

        {/* --- GOOGLE TAG MANAGER (Script) --- */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-5CBBW2XZ');
          `}
        </Script>

        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/favicon/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#0066FF" />
        <meta name="msapplication-TileColor" content="#0066FF" />

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
        {/* --- GOOGLE TAG MANAGER (Noscript) --- */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5CBBW2XZ"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        <TarteaucitronProvider />
        <QueryProvider>
          {children}
          <Toaster position="top-right" richColors />
        </QueryProvider>
      </body>
    </html>
  );
}
