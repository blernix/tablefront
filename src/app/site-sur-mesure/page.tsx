import type { Metadata } from 'next';
import SiteSurMesureContent from './SiteSurMesureContent';

export const metadata: Metadata = {
  title: 'Création de site web pour restaurant sur mesure — TableMaster',
  description:
    'Un site unique pensé pour votre restaurant. Design sur mesure, réservation intégrée, menu en ligne et SEO optimisé. Votre cuisine mérite mieux qu\'un template.',
  alternates: { canonical: 'https://tablemaster.fr/site-sur-mesure' },
  openGraph: {
    title: 'Création de site web pour restaurant sur mesure — TableMaster',
    description:
      'Un site unique pensé pour votre restaurant. Design sur mesure, réservation intégrée, menu en ligne et SEO optimisé.',
    type: 'website',
    locale: 'fr_FR',
    url: 'https://tablemaster.fr/site-sur-mesure',
    siteName: 'TableMaster',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Création de site web pour restaurant sur mesure — TableMaster',
    description:
      'Un site unique pour votre restaurant : design sur mesure, réservation intégrée, menu en ligne.',
  },
};

export default function Page() {
  return <SiteSurMesureContent />;
}
