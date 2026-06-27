import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mot de passe oublié - TableMaster',
  description: 'Réinitialisez votre mot de passe TableMaster.',
  robots: 'noindex, nofollow',
};

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
