import type { Metadata } from 'next';

const siteUrl = 'https://tablemaster.fr';

interface PageMetadata {
  [key: string]: Metadata;
}

export const pageMetadata: PageMetadata = {
  // Page d'accueil - Corrigée : On mise sur l'essai gratuit et le sans engagement
  '/': {
    title: 'TableMaster | Réservation Restaurant sans Commission & Avis Google',
    description:
      'Gérez vos réservations sans commission (0€/couvert). Pack Gestion à 39€/mois. Boostez vos avis Google automatiquement. 14 jours d’essai gratuit.',
    keywords:
      'cahier de réservation digital, logiciel réservation restaurant, alternative TheFork sans commission, alternative ZenChef moins cher, gestion restaurant mobile, avis Google restaurant automatique, carnet de réservation en ligne, QR code restaurant',
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      title: 'TableMaster | Logiciel de Réservation Restaurant 0% Commission',
      description:
        "Installez votre système de réservation avant le prochain service. Simple, mobile et conçu pour booster vos avis Google. 14 jours d'essai.",
      type: 'website',
      locale: 'fr_FR',
      url: siteUrl,
      siteName: 'TableMaster',
      images: [
        {
          url: `${siteUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'TableMaster - Simplifiez la gestion de votre restaurant',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'TableMaster | 0% de commission sur vos réservations',
      description: 'Reprenez le contrôle de votre salle et de votre réputation Google. 14 jours d’essai gratuit.',
      images: [`${siteUrl}/og-image.png`],
    },
  },

  // Pages "Application"
  '/signup': {
    title: 'Essai Gratuit 14 Jours - TableMaster',
    description: 'Créez votre compte en 2 minutes et testez TableMaster gratuitement pendant 14 jours. Sans engagement.',
    robots: 'noindex, nofollow',
  },
  '/login': {
    title: 'Connexion Restaurateur - TableMaster',
    description: 'Accédez à votre cahier de réservation TableMaster.',
    robots: 'noindex, nofollow',
  },

  // Mentions légales
  '/legal': {
    title: 'Mentions Légales - TableMaster',
    description: 'Informations légales concernant l’éditeur du site TableMaster.',
    alternates: { canonical: `${siteUrl}/legal` },
  },
  '/privacy': {
    title: 'Politique de Confidentialité - TableMaster',
    description: 'Protection de vos données et de celles de vos clients.',
    alternates: { canonical: `${siteUrl}/privacy` },
  },
};

// Métadonnées par défaut
export const defaultMetadata: Metadata = {
  title: 'TableMaster - Système de Réservation pour Restaurants',
  description: 'Logiciel de réservation sans commission et boosteur d’avis Google pour restaurants.',
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: siteUrl,
    siteName: 'TableMaster',
  },
};

// Fonction utilitaire pour récupérer les métadonnées
export function getPageMetadata(pathname: string): Metadata {
  const normalizedPath = pathname === '/' ? '/' : pathname.replace(/\/$/, '');

  if (pageMetadata[normalizedPath]) {
    return pageMetadata[normalizedPath];
  }

  const isSystemPath =
    normalizedPath.startsWith('/_next') ||
    normalizedPath.startsWith('/api') ||
    normalizedPath.includes('.');

  if (!isSystemPath && normalizedPath !== '/') {
    return {
      ...defaultMetadata,
      title: 'Réserver une table - TableMaster',
      description: 'Réservez votre table en quelques clics via TableMaster.',
      robots: 'noindex, nofollow',
    };
  }

  return defaultMetadata;
}

// --- DONNÉES STRUCTURÉES (JSON-LD) ---
export const organizationStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'TableMaster',
  description: 'Logiciel de réservation directe sans commission et gestion d’avis Google pour restaurants.',
  url: siteUrl,
  logo: `${siteUrl}/logo_512.png`,
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'contact@tablemaster.fr',
    availableLanguage: 'French',
  },
};

export const softwareStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'TableMaster',
  operatingSystem: 'All',
  applicationCategory: 'BusinessApplication',
  offers: {
    '@type': 'AggregateOffer',
    lowPrice: '39.00',
    highPrice: '69.00',
    priceCurrency: 'EUR',
    offerCount: '2'
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '55',
  },
};