import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Essai Gratuit 14 Jours - TableMaster',
  description:
    'Créez votre compte en 2 minutes et testez TableMaster gratuitement pendant 14 jours. Sans engagement.',
  robots: 'noindex, nofollow',
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
