import type { Metadata } from 'next';

const siteUrl = 'https://tablemaster.fr';

interface PageMetadata {
  [key: string]: Metadata;
}

export const pageMetadata: PageMetadata = {
  // Page d'accueil
  '/': {
    title:
      'TableMaster | Alternative TheFork & Zenchef Sans Commission - Logiciel Réservation Restaurant',
    description:
      'Alternative TheFork et Zenchef sans commission (0€/couvert). Économisez 15% vs TheFork. Pack Gestion 39€/mois. Gestion mobile, widget intégrable, avis Google automatiques. Essai gratuit 14 jours.',
    keywords:
      'alternative TheFork, alternative Zenchef, logiciel réservation restaurant sans commission, comparatif TheFork TableMaster, système réservation sans commission, cahier réservation digital, gestion restaurant mobile, avis Google automatique, widget réservation site web, carnet réservation en ligne, QR code restaurant, réservation en ligne restaurant, logiciel gestion restaurant, tablemaster, réservation directe restaurant, booster avis Google, économiser commission restaurant, logiciel réservation moins cher, the fork alternative, zenchef concurrent',
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      title: 'TableMaster | Alternative TheFork & Zenchef - Logiciel Réservation 0% Commission',
      description:
        "Économisez 15% vs TheFork. Alternative sans commission aux plateformes de réservation. Simple, mobile, widget intégrable, avis Google automatiques. 14 jours d'essai gratuit.",
      type: 'website',
      locale: 'fr_FR',
      url: siteUrl,
      siteName: 'TableMaster',
      images: [
        {
          url: `${siteUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'TableMaster - Alternative TheFork Zenchef sans commission',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'TableMaster | Alternative TheFork - 0% commission',
      description:
        'Économisez 15% vs TheFork, boostez vos avis Google. Alternative sans commission aux plateformes de réservation. Essai gratuit 14 jours.',
      images: [`${siteUrl}/og-image.png`],
    },
  },

  '/signup': {
    title: 'Essai Gratuit 14 Jours - TableMaster',
    description:
      'Créez votre compte en 2 minutes et testez TableMaster gratuitement pendant 14 jours. Sans engagement.',
    robots: 'noindex, nofollow',
  },
  '/login': {
    title: 'Connexion Restaurateur - TableMaster',
    description: 'Accédez à votre cahier de réservation TableMaster.',
    robots: 'noindex, nofollow',
  },

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
  description:
    'Logiciel de réservation sans commission et boosteur d’avis Google pour restaurants.',
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
  description:
    'Logiciel de réservation directe sans commission et gestion d’avis Google pour restaurants.',
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
    offerCount: '2',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '55',
  },
};

// L'élément qui manquait pour ton build :
export const pricingStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: [
    {
      '@type': 'Product',
      name: 'TableMaster Pack Gestion',
      description:
        "Solution complète de réservation, jusqu'à 400 réservations/mois, 0% commission.",
      offers: {
        '@type': 'Offer',
        price: '39.00',
        priceCurrency: 'EUR',
      },
    },
    {
      '@type': 'Product',
      name: 'TableMaster Pack Croissance',
      description: 'Réservations illimitées et envoi automatique de demandes d’avis Google.',
      offers: {
        '@type': 'Offer',
        price: '69.00',
        priceCurrency: 'EUR',
      },
    },
  ],
};

export const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'TableMaster vs TheFork : quelle est la principale différence de coût ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'TableMaster coûte 39€ à 69€/mois forfait fixe, tandis que TheFork prend une commission de 1,50€ à 2,50€ par couvert. Pour un restaurant avec 300 couverts/mois, TableMaster à 39€ fait économiser 400€ à 700€ par mois vs TheFork qui coûterait 450€ à 750€.',
      },
    },
    {
      '@type': 'Question',
      name: 'TableMaster vs Zenchef : lequel est le plus économique ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Zenchef coûte 129€ à 249€/mois. TableMaster coûte 39€ à 69€/mois. Pour les mêmes fonctionnalités essentielles (réservations en ligne, gestion mobile, avis Google), TableMaster est 2 à 6 fois moins cher que Zenchef.',
      },
    },
    {
      '@type': 'Question',
      name: 'Comment TableMaster génère-t-il des avis Google sans commission ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'TableMaster envoie automatiquement des emails après chaque réservation pour inviter vos clients à laisser un avis Google directement sur votre fiche. Contrairement à TheFork qui redirige vers sa propre plateforme, nous favorisons votre visibilité Google locale sans intermédiaire.',
      },
    },
    {
      '@type': 'Question',
      name: 'Puis-je tester TableMaster en parallèle de ma solution actuelle ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Oui, TableMaster peut fonctionner en parallèle de TheFork ou Zenchef pendant notre période d'essai de 14 jours. Cela vous permet de comparer les interfaces et tester les fonctionnalités sans interrompre votre service actuel.",
      },
    },
    {
      '@type': 'Question',
      name: 'TableMaster offre-t-il une interface mobile comme TheFork Manager ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Oui, TableMaster propose une interface mobile optimisée qui fonctionne sur tous les smartphones. Vous recevez des notifications push en temps réel pour les nouvelles réservations, annulations et modifications, sans besoin d'installer une application dédiée.",
      },
    },
  ],
};

export const productComparisonStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'TableMaster - Alternative TheFork & Zenchef',
  description:
    'Logiciel de réservation restaurant sans commission, alternative économique à TheFork et Zenchef.',
  brand: {
    '@type': 'Brand',
    name: 'TableMaster',
  },
  offers: {
    '@type': 'Offer',
    price: '39',
    priceCurrency: 'EUR',
    priceValidUntil: '2026-12-31',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '55',
    bestRating: '5',
    worstRating: '1',
  },
  additionalProperty: [
    {
      '@type': 'PropertyValue',
      name: 'Commission par couvert',
      value: '0€',
      valueReference: 'TheFork: 1.50-2.50€/couvert, Zenchef: forfait fixe',
    },
    {
      '@type': 'PropertyValue',
      name: 'Forfait mensuel fixe',
      value: '39€',
      valueReference: 'TheFork: commission variable, Zenchef: 129-249€/mois',
    },
    {
      '@type': 'PropertyValue',
      name: 'Avis Google automatiques',
      value: 'Inclus',
      valueReference: 'TheFork: non, Zenchef: supplément',
    },
    {
      '@type': 'PropertyValue',
      name: 'Widget personnalisable',
      value: 'Inclus',
      valueReference: 'TheFork: limité, Zenchef: limité',
    },
    {
      '@type': 'PropertyValue',
      name: 'Données clients',
      value: '100% propriétaire',
      valueReference: 'TheFork: partagées, Zenchef: partagées',
    },
  ],
};
