import type { Metadata } from 'next';

const siteUrl = 'https://tablemaster.fr';

interface PageMetadata {
  [key: string]: Metadata;
}

export const pageMetadata: PageMetadata = {
  // Page d'accueil
  '/': {
    title: 'TableMaster - Système de Réservation sans Commission | 39€/mois',
    description:
      'Stoppez les 15% de commission sur vos réservations. Installation 1 minute. Gérez réservations et avis Google depuis mobile. Tarif fixe 39€/mois. Sans engagement, résiliable à tout moment.',
    keywords:
      'réservation restaurant, système réservation, alternative TheFork, sans commission, widget réservation, avis Google restaurant',
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      title: 'TableMaster - Système de Réservation sans Commission | 39€/mois',
      description:
        'Stoppez les 15% de commission sur vos réservations. Installation 1 minute. Gérez réservations et avis Google depuis mobile.',
      type: 'website',
      locale: 'fr_FR',
      url: siteUrl,
      siteName: 'TableMaster',
      images: [
        {
          url: `${siteUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'TableMaster - Système de Réservation pour Restaurants',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'TableMaster - Système de Réservation sans Commission | 39€/mois',
      description: 'Stoppez les 15% de commission sur vos réservations. Installation 1 minute.',
      images: [`${siteUrl}/og-image.png`],
    },
  },

  // Mentions légales
  '/legal': {
    title: 'Mentions Légales - TableMaster',
    description:
      'Mentions légales du site TableMaster. Éditeur, hébergement, propriété intellectuelle, limites de responsabilité.',
    alternates: {
      canonical: `${siteUrl}/legal`,
    },
    openGraph: {
      title: 'Mentions Légales - TableMaster',
      description:
        'Mentions légales du site TableMaster. Éditeur, hébergement, propriété intellectuelle.',
      type: 'article',
      url: `${siteUrl}/legal`,
    },
    twitter: {
      card: 'summary',
      title: 'Mentions Légales - TableMaster',
      description: 'Mentions légales du site TableMaster.',
    },
  },

  // Politique de confidentialité
  '/privacy': {
    title: 'Politique de Confidentialité - TableMaster',
    description:
      'Politique de confidentialité de TableMaster. Gestion des données personnelles, droits des utilisateurs, cookies.',
    alternates: {
      canonical: `${siteUrl}/privacy`,
    },
    openGraph: {
      title: 'Politique de Confidentialité - TableMaster',
      description:
        'Politique de confidentialité de TableMaster. Gestion des données personnelles, droits des utilisateurs.',
      type: 'article',
      url: `${siteUrl}/privacy`,
    },
    twitter: {
      card: 'summary',
      title: 'Politique de Confidentialité - TableMaster',
      description: 'Politique de confidentialité de TableMaster.',
    },
  },

  // Gestion des cookies
  '/cookies': {
    title: 'Gestion des Cookies - TableMaster',
    description:
      'Gestion des cookies sur TableMaster. Types de cookies utilisés, préférences, consentement.',
    alternates: {
      canonical: `${siteUrl}/cookies`,
    },
    openGraph: {
      title: 'Gestion des Cookies - TableMaster',
      description: 'Gestion des cookies sur TableMaster. Types de cookies utilisés, préférences.',
      type: 'article',
      url: `${siteUrl}/cookies`,
    },
    twitter: {
      card: 'summary',
      title: 'Gestion des Cookies - TableMaster',
      description: 'Gestion des cookies sur TableMaster.',
    },
  },

  // Conditions Générales de Vente
  '/cgv': {
    title: 'Conditions Générales de Vente - TableMaster',
    description:
      "Conditions Générales de Vente et d'Utilisation de TableMaster. Droits et obligations, tarifs, support.",
    alternates: {
      canonical: `${siteUrl}/cgv`,
    },
    openGraph: {
      title: 'Conditions Générales de Vente - TableMaster',
      description: "Conditions Générales de Vente et d'Utilisation de TableMaster.",
      type: 'article',
      url: `${siteUrl}/cgv`,
    },
    twitter: {
      card: 'summary',
      title: 'Conditions Générales de Vente - TableMaster',
      description: "Conditions Générales de Vente et d'Utilisation de TableMaster.",
    },
  },

  // Inscription
  '/signup': {
    title: 'Inscription - TableMaster',
    description:
      'Créez votre compte TableMaster en 2 minutes. Commencez à gérer vos réservations sans commission.',
    alternates: {
      canonical: `${siteUrl}/signup`,
    },
    openGraph: {
      title: 'Inscription - TableMaster',
      description: 'Créez votre compte TableMaster en 2 minutes.',
      type: 'website',
      url: `${siteUrl}/signup`,
    },
    twitter: {
      card: 'summary',
      title: 'Inscription - TableMaster',
      description: 'Créez votre compte TableMaster en 2 minutes.',
    },
  },

  // Connexion
  '/login': {
    title: 'Connexion - TableMaster',
    description:
      'Connectez-vous à votre compte TableMaster pour gérer vos réservations, paramètres et statistiques.',
    alternates: {
      canonical: `${siteUrl}/login`,
    },
    openGraph: {
      title: 'Connexion - TableMaster',
      description: 'Connectez-vous à votre compte TableMaster.',
      type: 'website',
      url: `${siteUrl}/login`,
    },
    twitter: {
      card: 'summary',
      title: 'Connexion - TableMaster',
      description: 'Connectez-vous à votre compte TableMaster.',
    },
  },

  // Tableau de bord
  '/dashboard': {
    title: 'Tableau de Bord - TableMaster',
    description:
      'Tableau de bord TableMaster. Gérez vos réservations, statistiques, paramètres et équipe.',
    alternates: {
      canonical: `${siteUrl}/dashboard`,
    },
    openGraph: {
      title: 'Tableau de Bord - TableMaster',
      description: 'Tableau de bord TableMaster. Gérez vos réservations.',
      type: 'website',
      url: `${siteUrl}/dashboard`,
    },
    twitter: {
      card: 'summary',
      title: 'Tableau de Bord - TableMaster',
      description: 'Tableau de bord TableMaster.',
    },
  },
};

// Métadonnées par défaut (utilisées quand aucune page ne correspond)
export const defaultMetadata: Metadata = {
  title: 'TableMaster - Système de Réservation sans Commission',
  description:
    'Stoppez les 15% de commission sur vos réservations. Installation 1 minute. Tarif fixe 39€/mois.',
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: 'TableMaster - Système de Réservation sans Commission',
    description: 'Stoppez les 15% de commission sur vos réservations. Installation 1 minute.',
    type: 'website',
    locale: 'fr_FR',
    url: siteUrl,
    siteName: 'TableMaster',
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 677,
        height: 369,
        alt: 'TableMaster - Système de Réservation pour Restaurants',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TableMaster - Système de Réservation sans Commission',
    description: 'Stoppez les 15% de commission sur vos réservations. Installation 1 minute.',
    images: [`${siteUrl}/og-image.png`],
  },
};

// Fonction utilitaire pour obtenir les métadonnées d'une page
export function getPageMetadata(pathname: string): Metadata {
  const normalizedPath = pathname === '/' ? '/' : pathname.replace(/\/$/, '');
  return pageMetadata[normalizedPath] || defaultMetadata;
}

// Données structurées JSON-LD pour l'organisation
export const organizationStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'TableMaster',
  description: 'Système de réservation sans commission pour restaurants',
  url: siteUrl,
  logo: `${siteUrl}/logo_512.png`,
  sameAs: ['https://www.linkedin.com/company/tablemaster'],
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

// Données structurées JSON-LD pour le produit
export const productStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'TableMaster Starter',
  description: 'Plan Starter - 400 réservations par mois pour 39€/mois',
  brand: {
    '@type': 'Brand',
    name: 'TableMaster',
  },
  offers: {
    '@type': 'Offer',
    url: `${siteUrl}/signup`,
    priceCurrency: 'EUR',
    price: '39',
    priceValidUntil: '2025-12-31',
    availability: 'https://schema.org/InStock',
  },
};

export const proProductStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'TableMaster Pro',
  description: 'Plan Pro - Réservations illimitées pour 69€/mois',
  brand: {
    '@type': 'Brand',
    name: 'TableMaster',
  },
  offers: {
    '@type': 'Offer',
    url: `${siteUrl}/signup`,
    priceCurrency: 'EUR',
    price: '69',
    priceValidUntil: '2025-12-31',
    availability: 'https://schema.org/InStock',
  },
};
