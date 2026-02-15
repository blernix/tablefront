'use client';

import Head from 'next/head';
import { usePathname } from 'next/navigation';
import {
  getPageMetadata,
  organizationStructuredData,
  productStructuredData,
  proProductStructuredData,
} from '@/config/metadata';

interface PageMetadataProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  noindex?: boolean;
  structuredData?: any[];
}

export default function PageMetadata({
  title,
  description,
  canonicalUrl,
  noindex = false,
  structuredData = [],
}: PageMetadataProps) {
  const pathname = usePathname();
  const pageMetadata = getPageMetadata(pathname);

  // Utiliser les props si fournies, sinon les métadonnées de la page
  const finalTitle = title || pageMetadata.title || '';
  const finalDescription = description || pageMetadata.description || '';

  // Construire l'URL canonique
  const siteUrl = 'https://tablemaster.fr';
  const finalCanonicalUrl = canonicalUrl || `${siteUrl}${pathname}`;

  // Données structurées par défaut
  const defaultStructuredData = [
    organizationStructuredData,
    productStructuredData,
    proProductStructuredData,
  ];

  const allStructuredData = [...defaultStructuredData, ...structuredData];

  // Fonction utilitaire pour obtenir l'URL de l'image
  const getImageUrl = (images: any): string => {
    if (!images) return `${siteUrl}/og-image.png`;
    if (Array.isArray(images) && images.length > 0) {
      return images[0]?.url || `${siteUrl}/og-image.png`;
    }
    if (images.url) {
      return images.url;
    }
    return `${siteUrl}/og-image.png`;
  };

  // Cast pour éviter les erreurs TypeScript avec les types Next.js
  const openGraph = pageMetadata.openGraph as any;
  const twitterMetadata = pageMetadata.twitter as any;

  // Métadonnées Open Graph
  const ogTitle = title || openGraph?.title || finalTitle;
  const ogDescription = description || openGraph?.description || finalDescription;
  const ogImage = getImageUrl(openGraph?.images);

  // Métadonnées Twitter
  const twitterCard = twitterMetadata?.card || 'summary_large_image';
  const twitterTitle = twitterMetadata?.title || ogTitle;
  const twitterDescription = twitterMetadata?.description || ogDescription;
  const twitterImage = getImageUrl(twitterMetadata?.images);

  return (
    <Head>
      {/* Titre et description de base */}
      <title>{String(finalTitle)}</title>
      <meta name="description" content={String(finalDescription)} />

      {/* Open Graph */}
      <meta property="og:title" content={String(ogTitle)} />
      <meta property="og:description" content={String(ogDescription)} />
      <meta property="og:type" content={String(openGraph?.type || 'website')} />
      <meta property="og:url" content={String(finalCanonicalUrl)} />
      <meta property="og:image" content={String(ogImage)} />
      <meta property="og:locale" content={String(openGraph?.locale || 'fr_FR')} />
      <meta property="og:site_name" content={String(openGraph?.siteName || 'TableMaster')} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content={String(twitterCard)} />
      <meta name="twitter:title" content={String(twitterTitle)} />
      <meta name="twitter:description" content={String(twitterDescription)} />
      <meta name="twitter:image" content={String(twitterImage)} />

      {/* Canonical URL */}
      <link rel="canonical" href={finalCanonicalUrl} />

      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
      )}

      {/* Données structurées JSON-LD */}
      {allStructuredData.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
    </Head>
  );
}
