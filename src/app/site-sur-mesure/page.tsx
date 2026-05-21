import type { Metadata } from 'next';
import SiteSurMesureContent from './SiteSurMesureContent';

export const metadata: Metadata = {
  title: 'Site web sur mesure pour restaurant — TableMaster',
  description: 'Un site unique pensé pour votre restaurant. Design sur mesure, réservation intégrée, menu en ligne. Votre cuisine mérite mieux qu\'un template.',
  openGraph: {
    title: 'Site web sur mesure pour restaurant — TableMaster',
    description: 'Un site unique pensé pour votre restaurant. Design sur mesure, réservation intégrée, menu en ligne.',
  },
};

export default function Page() {
  return <SiteSurMesureContent />;
}
