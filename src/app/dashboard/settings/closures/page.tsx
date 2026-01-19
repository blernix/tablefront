'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { apiClient } from '@/lib/api';
import { formatDateShort } from '@/lib/formatters';
import { Closure } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import DeleteConfirmModal from '@/components/modals/DeleteConfirmModal';
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm';

const formSchema = z.object({
  startDate: z.string().min(1, 'Date de début requise'),
  endDate: z.string().optional(),
  reason: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function ClosuresPage() {
  const router = useRouter();
  const [closures, setClosures] = useState<Closure[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Delete confirmation
  const { isOpen: isDeleteModalOpen, itemToDelete: closureToDelete, isDeleting, openDeleteModal, closeDeleteModal, confirmDelete } = useDeleteConfirm({
    onDelete: async (id) => {
      await apiClient.deleteClosure(id);
      fetchClosures();
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    fetchClosures();
  }, []);

  const fetchClosures = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getClosures();
      setClosures(response.closures);
    } catch (err) {
      console.error('Error fetching closures:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setIsCreating(true);
      await apiClient.createClosure({
        startDate: data.startDate,
        endDate: data.endDate || data.startDate,
        reason: data.reason,
      });
      reset();
      setShowForm(false);
      fetchClosures();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur lors de la création');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = (closure: Closure) => {
    openDeleteModal({
      id: closure._id,
      name: `${formatDateShort(closure.startDate)} au ${formatDateShort(closure.endDate)}`
    });
  };


  if (isLoading) {
    return <div className="text-muted-foreground">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/dashboard/settings')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Fermetures exceptionnelles</h1>
            <p className="mt-2 text-gray-600">
              Gérez vos périodes de fermeture (vacances, jours fériés)
            </p>
          </div>
          {!showForm && (
            <Button onClick={() => setShowForm(true)} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une fermeture
            </Button>
          )}
        </div>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Nouvelle fermeture</CardTitle>
            <CardDescription>Ajoutez une période de fermeture</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Date de début</Label>
                  <Input
                    id="startDate"
                    type="date"
                    {...register('startDate')}
                    disabled={isCreating}
                  />
                  {errors.startDate && (
                    <p className="text-sm text-destructive">{errors.startDate.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">Date de fin (optionnelle)</Label>
                  <Input
                    id="endDate"
                    type="date"
                    {...register('endDate')}
                    disabled={isCreating}
                  />
                  <p className="text-xs text-muted-foreground">
                    Laissez vide pour une fermeture d&apos;un seul jour
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Raison (optionnelle)</Label>
                <Input
                  id="reason"
                  {...register('reason')}
                  placeholder="Ex: Vacances d'été, Jour férié..."
                  disabled={isCreating}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    reset();
                  }}
                  disabled={isCreating}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? 'Création...' : 'Créer la fermeture'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Fermetures programmées</CardTitle>
          <CardDescription>
            {closures.length} fermeture{closures.length > 1 ? 's' : ''} enregistrée
            {closures.length > 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {closures.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              Aucune fermeture programmée
            </p>
          ) : (
            <div className="space-y-3">
              {closures.map((closure) => (
                <div
                  key={closure._id}
                  className="flex items-center justify-between border rounded-lg p-4"
                >
                  <div>
                    <p className="font-medium">
                      {formatDateShort(closure.startDate)}
                      {closure.startDate !== closure.endDate && (
                        <span> - {formatDateShort(closure.endDate)}</span>
                      )}
                    </p>
                    {closure.reason && (
                      <p className="text-sm text-muted-foreground">{closure.reason}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(closure)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Supprimer la fermeture"
        itemName={closureToDelete?.name}
        isLoading={isDeleting}
      />
    </div>
  );
}
