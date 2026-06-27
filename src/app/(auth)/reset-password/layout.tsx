import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Réinitialiser le mot de passe - TableMaster',
  description: 'Définissez un nouveau mot de passe pour votre compte TableMaster.',
  robots: 'noindex, nofollow',
};

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
