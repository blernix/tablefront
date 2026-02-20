import type { Metadata } from 'next';

const siteUrl = 'https://tablemaster.fr';

interface PageMetadata {
  [key: string]: Metadata;
}

export const pageMetadata: PageMetadata = {
  // Page d'accueil - Optimisée SEO & Conversion
  '/': {
    title: 'TableMaster | Cahier de Réservation Digital sans Commission',
    description:
      'Le cahier de réservation nouvelle génération pour restaurants. Économisez les 15% de commission. Installation en 1 min.',
    keywords:
      'cahier de réservation digital, logiciel réservation restaurant, alternative TheFork, sans commission, gestion restaurant mobile, avis Google restaurant, carnet de réservation en ligne',
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      title: 'TableMaster | Cahier de Réservation Digital sans Commission',
      description:
        "Stoppez les commissions sur vos réservations. Un outil complet : du bouton de résa à l'envoi d'emails post-service.",
      type: 'website',
      locale: 'fr_FR',
      url: siteUrl,
      siteName: 'TableMaster',
      images: [
        {
          url: `${siteUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'TableMaster - Logiciel de Réservation pour Restaurants',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'TableMaster | Logiciel de Réservation Restaurant à 39€/mois',
      description: 'Reprenez le contrôle de vos réservations sans payer de commissions.',
      images: [`${siteUrl}/og-image.png`],
    },
  },

  // Pages "Application" - Marquées en noindex pour protéger le SEO global
  '/signup': {
    title: 'Créer mon compte - TableMaster',
    description: 'Rejoignez TableMaster et commencez à prendre des réservations en 2 minutes.',
    robots: 'noindex, nofollow',
  },
  '/login': {
    title: 'Connexion - TableMaster',
    description: 'Accédez à votre cahier de réservation digital.',
    robots: 'noindex, nofollow',
  },
  '/dashboard': {
    title: 'Tableau de Bord - TableMaster',
    description: 'Gestion de vos tables et statistiques en temps réel.',
    robots: 'noindex, nofollow',
  },

  // Mentions légales & Conformité
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
  '/cookies': {
    title: 'Gestion des Cookies - TableMaster',
    description: 'Préférences concernant les cookies utilisés sur TableMaster.',
    alternates: { canonical: `${siteUrl}/cookies` },
  },
  '/cgv': {
    title: 'CGV / CGU - TableMaster',
    description: 'Conditions générales de vente et d’utilisation du service TableMaster.',
    alternates: { canonical: `${siteUrl}/cgv` },
  },
};

// Métadonnées par défaut
export const defaultMetadata: Metadata = {
  title: 'TableMaster - Système de Réservation pour Restaurants',
  description: 'Logiciel de réservation sans commission pour les restaurateurs indépendants.',
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

// Fonction utilitaire
export function getPageMetadata(pathname: string): Metadata {
  const normalizedPath = pathname === '/' ? '/' : pathname.replace(/\/$/, '');

  // Vérifier si c'est une route connue
  if (pageMetadata[normalizedPath]) {
    return pageMetadata[normalizedPath];
  }

  // Détection des slugs dynamiques (pages de réservation)
  // Un slug est un segment unique sans slash, ne commençant pas par des chemins système
  const isSystemPath =
    normalizedPath.startsWith('/_next') ||
    normalizedPath.startsWith('/api') ||
    normalizedPath.startsWith('/public') ||
    normalizedPath.startsWith('/static') ||
    normalizedPath.includes('.') || // Fichiers avec extension
    normalizedPath.includes('//');

  const isSlug =
    !isSystemPath &&
    normalizedPath !== '/' &&
    !normalizedPath.includes('/') && // Un seul segment
    !pageMetadata[normalizedPath]; // Pas une route connue

  if (isSlug) {
    // Pages de réservation : noindex, nofollow
    return {
      ...defaultMetadata,
      title: 'Réservation - TableMaster',
      description: 'Réservez une table dans ce restaurant',
      robots: 'noindex, nofollow',
    };
  }

  return defaultMetadata;
}

// DONNÉES STRUCTURÉES (JSON-LD)

// 1. L'Organisation
export const organizationStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'TableMaster',
  description: 'Logiciel de gestion de réservations sans commission pour restaurants.',
  url: siteUrl,
  logo: `${siteUrl}/logo_512.png`,
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+33641970383',
    contactType: 'customer service',
    email: 'contact@tablemaster.fr',
    availableLanguage: 'French',
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'CESSON',
    addressCountry: 'FR',
  },
};

// 2. Le Logiciel (SoftwareApplication est plus précis pour un SaaS)
export const softwareStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'TableMaster',
  operatingSystem: 'All',
  applicationCategory: 'BusinessApplication',
  browserRequirements: 'requires HTML5 support',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5',
    reviewCount: '1', // À mettre à jour quand tu auras des avis
  },
  offers: {
    '@type': 'Offer',
    price: '39.00',
    priceCurrency: 'EUR',
  },
};

// 3. Les Plans (Product)
export const pricingStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: [
    {
      '@type': 'Product',
      name: 'TableMaster Pack Gestion',
      description: "Jusqu'à 400 réservations/mois",
      offers: {
        '@type': 'Offer',
        price: '39.00',
        priceCurrency: 'EUR',
      },
    },
    {
      '@type': 'Product',
      name: 'TableMaster Pack Croissance',
      description: 'Réservations illimitées',
      offers: {
        '@type': 'Offer',
        price: '69.00',
        priceCurrency: 'EUR',
      },
    },
  ],
};
