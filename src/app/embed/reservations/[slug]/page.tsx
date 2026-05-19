'use client';

import { useParams } from 'next/navigation';
import PublicReservationForm from '@/components/reservations/PublicReservationForm';

export default function EmbedReservationPage() {
  const params = useParams();
  const slug = params?.slug as string;

  return <PublicReservationForm slug={slug} isEmbed />;
}
