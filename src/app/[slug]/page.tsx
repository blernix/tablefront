import { Metadata } from 'next';
import PublicReservationForm from '@/components/reservations/PublicReservationForm';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function fetchRestaurantInfo(slug: string) {
  try {
    const res = await fetch(`${API_URL}/api/public/restaurant-info`, {
      headers: { 'x-slug': slug },
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.restaurant;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const restaurant = await fetchRestaurantInfo(params.slug);

  if (!restaurant) {
    return {
      title: 'Restaurant introuvable — TableMaster',
      description: 'Ce lien de réservation n\'est plus actif.',
    };
  }

  const title = `Réservez une table — ${restaurant.name}`;

  return {
    title,
    description: `Réservez en ligne au ${restaurant.name}. Simple, rapide, sans engagement.`,
    openGraph: {
      title,
      description: restaurant.address
        ? `Réservez en ligne au ${restaurant.name} — ${restaurant.address}`
        : `Réservez en ligne au ${restaurant.name}`,
      type: 'website',
      locale: 'fr_FR',
      siteName: 'TableMaster',
    },
    twitter: {
      card: 'summary',
      title,
      description: `Réservez en ligne au ${restaurant.name}`,
    },
  };
}

export default function SlugReservationPage({ params }: { params: { slug: string } }) {
  return <PublicReservationForm slug={params.slug} />;
}
