import type { Metadata } from 'next';
import { headers } from 'next/headers';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const pathname = headersList.get('x-invoke-path') || '/';

  if (pathname.includes('/signup')) {
    return {
      title: 'Inscription - TableMaster',
      description:
        'Créez votre compte TableMaster en 2 minutes. Commencez à gérer vos réservations sans commission.',
      openGraph: {
        title: 'Inscription - TableMaster',
        description: 'Créez votre compte TableMaster en 2 minutes.',
        type: 'website',
        url: 'https://tablemaster.fr/signup',
      },
      twitter: {
        card: 'summary',
        title: 'Inscription - TableMaster',
        description: 'Créez votre compte TableMaster en 2 minutes.',
      },
    };
  }

  if (pathname.includes('/login')) {
    return {
      title: 'Connexion - TableMaster',
      description:
        'Connectez-vous à votre compte TableMaster pour gérer vos réservations, paramètres et statistiques.',
      openGraph: {
        title: 'Connexion - TableMaster',
        description: 'Connectez-vous à votre compte TableMaster.',
        type: 'website',
        url: 'https://tablemaster.fr/login',
      },
      twitter: {
        card: 'summary',
        title: 'Connexion - TableMaster',
        description: 'Connectez-vous à votre compte TableMaster.',
      },
    };
  }

  // Default auth metadata
  return {
    title: 'TableMaster - Authentification',
    description: 'Authentification TableMaster',
  };
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
