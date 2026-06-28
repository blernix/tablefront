import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gestion des Cookies — TableMaster',
  description:
    'Gérez vos préférences de cookies sur TableMaster. Nous utilisons uniquement des cookies essentiels et analytics anonymes. Conforme RGPD.',
  alternates: { canonical: 'https://tablemaster.fr/cookies' },
  openGraph: {
    title: 'Gestion des Cookies — TableMaster',
    description:
      'Gérez vos préférences de cookies sur TableMaster. Nous utilisons uniquement des cookies essentiels et analytics anonymes. Conforme RGPD.',
    type: 'website',
    locale: 'fr_FR',
    url: 'https://tablemaster.fr/cookies',
    siteName: 'TableMaster',
  },
  twitter: {
    card: 'summary',
    title: 'Gestion des Cookies — TableMaster',
    description:
      'Gérez vos préférences de cookies sur TableMaster. Conforme RGPD.',
  },
};

export default function CookiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
