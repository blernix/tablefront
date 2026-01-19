'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { apiClient } from '@/lib/api';
import { formatDate } from '@/lib/formatters';
import { DayBlock } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, Trash2, Ban, Calendar } from 'lucide-react';
import DeleteConfirmModal from '@/components/modals/DeleteConfirmModal';
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm';

export default function BlockedDaysPage() {
  const router = useRouter();
  const [dayBlocks, setDayBlocks] = useState<DayBlock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');

  // Delete confirmation hook
  const { isOpen: isDeleteModalOpen, itemToDelete, isDeleting, openDeleteModal, closeDeleteModal, confirmDelete } = useDeleteConfirm({
    onDelete: async (id) => {
      await apiClient.deleteDayBlock(id);
      fetchDayBlocks();
    },
  });

  useEffect(() => {
    fetchDayBlocks();
  }, []);

  const fetchDayBlocks = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getDayBlocks();
      setDayBlocks(response.dayBlocks);
    } catch (err) {
      console.error('Error fetching day blocks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date) {
      alert('La date est requise');
      return;
    }

    try {
      setIsSaving(true);
      await apiClient.createDayBlock({ date, reason });
      setShowForm(false);
      setDate('');
      setReason('');
      fetchDayBlocks();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur lors du blocage');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (dayBlock: DayBlock) => {
    openDeleteModal({ id: dayBlock._id, name: formatDate(dayBlock.date) });
  };


  // Group by past and future
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const futureDayBlocks = dayBlocks.filter(block => new Date(block.date) >= today);
  const pastDayBlocks = dayBlocks.filter(block => new Date(block.date) < today);

  if (isLoading && !showForm) {
    return <div className="text-muted-foreground">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard/reservations')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Jours bloqués</h1>
            <p className="mt-2 text-gray-600">
              Bloquez des dates pour empêcher les réservations
            </p>
          </div>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Bloquer un jour
          </Button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Bloquer un jour</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    disabled={isSaving}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Raison (optionnel)</Label>
                  <Input
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Ex: Fermeture exceptionnelle"
                    disabled={isSaving}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setDate('');
                    setReason('');
                  }}
                  disabled={isSaving}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? 'Blocage...' : 'Bloquer'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Future blocked days */}
      {!showForm && futureDayBlocks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ban className="h-5 w-5" />
              Jours bloqués à venir
            </CardTitle>
            <CardDescription>
              {futureDayBlocks.length} jour{futureDayBlocks.length > 1 ? 's' : ''} bloqué{futureDayBlocks.length > 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {futureDayBlocks.map(block => (
              <div
                key={block._id}
                className="flex items-center justify-between border rounded-lg p-4"
              >
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <div className="font-medium">{formatDate(block.date)}</div>
                    {block.reason && (
                      <div className="text-sm text-muted-foreground">{block.reason}</div>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(block)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Past blocked days */}
      {!showForm && pastDayBlocks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              Jours bloqués passés
            </CardTitle>
            <CardDescription>
              {pastDayBlocks.length} jour{pastDayBlocks.length > 1 ? 's' : ''} bloqué{pastDayBlocks.length > 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {pastDayBlocks.map(block => (
              <div
                key={block._id}
                className="flex items-center justify-between border rounded-lg p-4 opacity-60"
              >
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">{formatDate(block.date)}</div>
                    {block.reason && (
                      <div className="text-sm text-muted-foreground">{block.reason}</div>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(block)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Empty state */}
      {!showForm && dayBlocks.length === 0 && (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">
              Aucun jour bloqué
            </p>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Débloquer le jour"
        itemName={itemToDelete?.name}
        isLoading={isDeleting}
      />
    </div>
  );
}
