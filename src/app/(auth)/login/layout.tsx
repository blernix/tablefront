import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Connexion Restaurateur - TableMaster',
  description: 'Accédez à votre cahier de réservation TableMaster.',
  robots: 'noindex, nofollow',
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
