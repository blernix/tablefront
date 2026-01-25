'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { Reservation } from '@/types';
import { ReservationDetailView } from '@/components/reservations/ReservationDetailView';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function ReservationDetailPage({
  params
}: {
  params: { id: string }
}) {
  const router = useRouter();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const loadReservation = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.getReservation(params.id);
        setReservation(response.reservation);
      } catch (error) {
        console.error('Error loading reservation:', error);
        toast.error('Réservation introuvable');
        router.push('/dashboard/reservations');
      } finally {
        setIsLoading(false);
      }
    };

    loadReservation();
  }, [params.id, router]);

  const handleStatusChange = async (status: 'pending' | 'confirmed' | 'cancelled' | 'completed') => {
    if (!reservation) return;

    try {
      setIsUpdating(true);
      await apiClient.updateReservation(reservation._id, {
        status,
        sendEmail: true
      });

      const statusLabels = {
        confirmed: 'confirmée',
        cancelled: 'annulée',
        completed: 'terminée',
        pending: 'mise en attente',
      };

      toast.success(`Réservation ${statusLabels[status]} - Email envoyé`);

      // Refresh reservation data
      const response = await apiClient.getReservation(params.id);
      setReservation(response.reservation);
    } catch (error) {
      console.error('Error updating reservation:', error);
      toast.error('Erreur lors de la mise à jour de la réservation');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEdit = () => {
    router.push(`/dashboard/reservations?edit=${params.id}`);
  };

  const handleDelete = async () => {
    if (!reservation) return;

    if (!confirm(`Êtes-vous sûr de vouloir supprimer la réservation de ${reservation.customerName} ?`)) {
      return;
    }

    try {
      setIsUpdating(true);
      await apiClient.deleteReservation(reservation._id);
      toast.success('Réservation supprimée avec succès');
      router.push('/dashboard/reservations');
    } catch (error) {
      console.error('Error deleting reservation:', error);
      toast.error('Erreur lors de la suppression de la réservation');
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 md:p-6 animate-pulse">
        <div className="h-10 bg-slate-200 rounded-lg w-48" />
        <div className="h-64 bg-slate-200 rounded-lg" />
        <div className="h-40 bg-slate-200 rounded-lg" />
      </div>
    );
  }

  if (!reservation) {
    return null;
  }

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-4xl mx-auto">
      <div>
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard/reservations')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux réservations
        </Button>
      </div>

      <ReservationDetailView
        reservation={reservation}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={isUpdating ? undefined : handleStatusChange}
      />
    </div>
  );
}
