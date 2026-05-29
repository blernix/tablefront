'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiClient } from '@/lib/api';
import { formatDateShort } from '@/lib/formatters';
import { Closure } from '@/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Trash2, Calendar, X, Loader2 } from 'lucide-react';
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
  const isFetchingRef = useRef(false);

  const {
    isOpen: isDeleteModalOpen,
    itemToDelete: closureToDelete,
    isDeleting,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
  } = useDeleteConfirm({
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchClosures = async () => {
    if (isFetchingRef.current) return;
    try {
      isFetchingRef.current = true;
      setIsLoading(true);
      const response = await apiClient.getClosures();
      setClosures(response.closures);
    } catch (err) {
      console.error('Error fetching closures:', err);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
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
      name: `${formatDateShort(closure.startDate)} au ${formatDateShort(closure.endDate)}`,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-slate-200 rounded-lg w-32 hidden md:block animate-pulse" />
        <div className="h-8 bg-slate-200 rounded-lg w-56 animate-pulse" />
        <div className="h-44 bg-slate-200 rounded-2xl animate-pulse" />
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="h-20 bg-slate-200 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="hidden md:block">
        <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/settings')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-[#000000] leading-tight tracking-tight md:text-3xl">Fermetures</h1>
          <p className="mt-1 text-[15px] text-[#8E8E93] md:text-gray-600">Gérez vos périodes de fermeture</p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="hidden md:inline-flex">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une fermeture
          </Button>
        )}
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-[#E5E5EA] overflow-hidden md:rounded-xl">
          <div className="flex items-center justify-between p-4 md:p-5 border-b border-[#E5E5EA]">
            <h2 className="text-[17px] font-semibold text-[#000000] md:text-lg">Nouvelle fermeture</h2>
            <button
              onClick={() => { setShowForm(false); reset(); }}
              className="h-8 w-8 rounded-full flex items-center justify-center text-[#8E8E93] active:bg-[#F2F2F7] transition-colors"
              aria-label="Fermer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-4 md:p-5 space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="startDate" className="text-[13px] font-medium text-[#8E8E93] md:text-sm">Date de début</label>
                <input
                  id="startDate"
                  type="date"
                  {...register('startDate')}
                  disabled={isCreating}
                  className="w-full h-11 px-3 rounded-xl border border-[#E5E5EA] bg-white text-[15px] text-[#000000] focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/20 disabled:opacity-50 md:h-10 md:text-sm"
                />
                {errors.startDate && (
                  <p className="text-[12px] text-red-500">{errors.startDate.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="endDate" className="text-[13px] font-medium text-[#8E8E93] md:text-sm">Date de fin (optionnelle)</label>
                <input
                  id="endDate"
                  type="date"
                  {...register('endDate')}
                  disabled={isCreating}
                  className="w-full h-11 px-3 rounded-xl border border-[#E5E5EA] bg-white text-[15px] text-[#000000] focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/20 disabled:opacity-50 md:h-10 md:text-sm"
                />
                <p className="text-[11px] text-[#8E8E93]">Laissez vide pour un seul jour</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="reason" className="text-[13px] font-medium text-[#8E8E93] md:text-sm">Raison (optionnelle)</label>
              <input
                id="reason"
                {...register('reason')}
                placeholder="Vacances, jour férié..."
                disabled={isCreating}
                className="w-full h-11 px-3 rounded-xl border border-[#E5E5EA] bg-white text-[15px] text-[#000000] placeholder:text-[#C7C7CC] focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/20 disabled:opacity-50 md:h-10 md:text-sm"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => { setShowForm(false); reset(); }}
                disabled={isCreating}
                className="flex-1 h-11 rounded-xl text-[15px] font-medium md:flex-none md:h-10 md:text-sm"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isCreating}
                className="flex-1 h-11 rounded-xl text-[15px] font-medium md:flex-none md:h-10 md:text-sm"
              >
                {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isCreating ? 'Création...' : 'Valider'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div className="bg-white rounded-2xl border border-[#E5E5EA] overflow-hidden md:rounded-xl">
        <div className="p-4 md:p-5 border-b border-[#E5E5EA] flex items-center justify-between">
          <span className="text-[13px] font-medium text-[#8E8E93] md:text-sm">
            {closures.length} fermeture{closures.length !== 1 ? 's' : ''} programmée{closures.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="divide-y divide-[#E5E5EA]">
          {closures.length === 0 ? (
            <div className="py-12 text-center">
              <Calendar className="h-10 w-10 text-[#E5E5EA] mx-auto mb-3" />
              <p className="text-[15px] text-[#8E8E93] md:text-sm">Aucune fermeture programmée</p>
            </div>
          ) : (
            closures.map((closure) => (
              <div key={closure._id} className="flex items-center justify-between p-4 md:p-5">
                <div className="min-w-0 flex-1 mr-4">
                  <p className="text-[15px] font-medium text-[#000000] md:text-base">
                    {formatDateShort(closure.startDate)}
                    {closure.startDate !== closure.endDate && (
                      <span> – {formatDateShort(closure.endDate)}</span>
                    )}
                  </p>
                  {closure.reason && (
                    <p className="text-[13px] text-[#8E8E93] mt-0.5 md:text-sm truncate">{closure.reason}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(closure)}
                  className="h-9 w-9 flex items-center justify-center rounded-lg text-[#8E8E93] active:bg-red-50 active:text-red-500 transition-colors flex-shrink-0 md:h-8 md:w-8"
                  aria-label="Supprimer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Supprimer la fermeture"
        itemName={closureToDelete?.name}
        isLoading={isDeleting}
      />

      {!showForm && (
        <Button
          onClick={() => setShowForm(true)}
          size="icon"
          className="md:hidden fixed bottom-20 right-4 z-40 h-14 w-14 rounded-full shadow-[0_4px_20px_rgba(0,102,255,0.35)] active:scale-95 transition-transform"
        >
          <Plus className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}
