'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { Reservation } from '@/types';
import { ReservationDetailView } from '@/components/reservations/ReservationDetailView';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import DeleteConfirmModal from '@/components/modals/DeleteConfirmModal';

function getActionFromURL(): string | null {
  if (typeof window === 'undefined') return null;
  // Read from both query param (?action=) and hash fragment (#action=)
  var searchAction = new URLSearchParams(window.location.search).get('action');
  if (searchAction === 'confirm' || searchAction === 'cancel') return searchAction;
  var hash = window.location.hash;
  if (hash === '#action=confirm') return 'confirm';
  if (hash === '#action=cancel') return 'cancel';
  return null;
}

function cleanActionFromURL() {
  if (typeof window === 'undefined') return;
  var url = window.location.pathname + window.location.search.replace(/[?&]action=[^&]*/g, '').replace(/^\?$/, '');
  // Also clean hash
  window.history.replaceState(null, '', url);
}

export default function ReservationDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  var actionProcessedRef = useRef(false);

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

  // Handle action from notification (confirm/cancel)
  // Uses window.location directly (not useSearchParams) because:
  // 1. useSearchParams changes reference on every render causing effect cascades
  // 2. Query params can be lost in PWA openWindow on Android
  useEffect(() => {
    if (isLoading || actionProcessedRef.current || !reservation) return;

    var action = getActionFromURL();
    console.log('[ReservationDetail] action from URL:', action, '| reservation.status:', reservation.status, '| URL:', window.location.href);

    if (!action) return;

    var targetStatus = action === 'confirm' ? 'confirmed' : 'cancelled';

    // Skip if reservation is already in target status
    if (reservation.status === targetStatus) {
      cleanActionFromURL();
      actionProcessedRef.current = true;
      return;
    }

    // Mark as processed BEFORE async call to prevent double execution
    actionProcessedRef.current = true;
    // Clean URL immediately
    cleanActionFromURL();

    var processAction = async function() {
      try {
        setIsUpdating(true);
        await apiClient.updateReservation(reservation._id, { status: targetStatus });

        var statusLabel = action === 'confirm' ? 'confirmée' : 'annulée';
        toast.success('Réservation ' + statusLabel + ' depuis la notification');

        // Refresh reservation data
        var response = await apiClient.getReservation(params.id);
        setReservation(response.reservation);
      } catch (error) {
        console.error('Error processing notification action:', error);
        toast.error('Erreur lors de la ' + (action === 'confirm' ? 'confirmation' : 'annulation'));
      } finally {
        setIsUpdating(false);
      }
    };

    processAction();
  }, [isLoading, reservation, params.id]);

  const handleStatusChange = async (
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  ) => {
    if (!reservation) return;

    try {
      setIsUpdating(true);
      await apiClient.updateReservation(reservation._id, {
        status,
      });

      const statusLabels = {
        confirmed: 'confirmée',
        cancelled: 'annulée',
        completed: 'terminée',
        pending: 'mise en attente',
      };

      toast.success(`Réservation ${statusLabels[status]}`);

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

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!reservation) return;

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
        <div className="h-10 bg-slate-200 rounded-lg w-48 hidden md:block" />
        <div className="h-64 bg-slate-200 rounded-lg" />
        <div className="h-40 bg-slate-200 rounded-lg" />
      </div>
    );
  }

  if (!reservation) {
    return null;
  }

  return (
    <div className="space-y-6 px-4 md:p-6 max-w-4xl mx-auto">
      <div className="hidden md:block">
        <Button variant="outline" onClick={() => router.push('/dashboard/reservations')}>
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

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Supprimer la réservation"
        itemName={reservation ? `la réservation de ${reservation.customerName}` : undefined}
        description="Êtes-vous sûr de vouloir supprimer définitivement cette réservation ? Cette action est irréversible."
        isLoading={isUpdating}
      />
    </div>
  );
}
