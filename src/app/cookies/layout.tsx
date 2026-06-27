import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gestion des cookies - TableMaster',
  description:
    'Gérez vos préférences de cookies sur TableMaster. Contrôlez les cookies fonctionnels et marketing.',
};

export default function CookiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
