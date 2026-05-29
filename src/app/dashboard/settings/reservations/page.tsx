'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiClient } from '@/lib/api';
import { Restaurant } from '@/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Clock, Sun, Moon, Loader2, Check } from 'lucide-react';
import { getServicesPerDay } from '@/store/restaurantStore';

const formSchema = z.object({
  defaultDuration: z.string().min(1, 'La durée est requise'),
  useOpeningHours: z.boolean(),
  averagePrice: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const formatMinutes = (min: number) => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h}h` : `${h}h${m.toString().padStart(2, '0')}`;
};

const DAY_NAMES = ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'];

export default function ReservationConfigPage() {
  const router = useRouter();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const isFetchingRef = useRef(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const useOpeningHours = watch('useOpeningHours');

  const fetchRestaurant = useCallback(async () => {
    if (isFetchingRef.current) return;
    try {
      isFetchingRef.current = true;
      setIsLoading(true);
      const response = await apiClient.getMyRestaurant();
      setRestaurant(response.restaurant);
      reset({
        defaultDuration: response.restaurant.reservationConfig.defaultDuration.toString(),
        useOpeningHours: response.restaurant.reservationConfig.useOpeningHours,
        averagePrice: response.restaurant.reservationConfig.averagePrice?.toString() || '25',
      });
    } catch (err) {
      console.error('Error fetching restaurant:', err);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [reset]);

  useEffect(() => { fetchRestaurant(); }, []); // eslint-disable-line

  const onSubmit = async (data: FormData) => {
    try {
      setIsSaving(true);
      setSuccessMessage('');
      const defaultDuration = parseInt(data.defaultDuration, 10);
      const averagePrice = data.averagePrice ? parseFloat(data.averagePrice) : undefined;
      if (isNaN(defaultDuration) || defaultDuration < 30 || defaultDuration > 300) {
        alert('La durée doit être entre 30 et 300 minutes'); return;
      }
      if (averagePrice !== undefined && (isNaN(averagePrice) || averagePrice < 0)) {
        alert('Le prix moyen doit être un nombre positif'); return;
      }
      const response = await apiClient.updateReservationConfig({ defaultDuration, useOpeningHours: data.useOpeningHours, averagePrice });
      setRestaurant((prev) => prev ? { ...prev, reservationConfig: response.reservationConfig } : null);
      setSuccessMessage('Configuration mise à jour ✓');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
    } finally { setIsSaving(false); }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-slate-200 rounded-lg w-32 hidden md:block animate-pulse" />
        <div className="h-8 bg-slate-200 rounded-lg w-60 animate-pulse" />
        <div className="h-80 bg-slate-200 rounded-2xl animate-pulse" />
        <div className="h-40 bg-slate-200 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="hidden md:block">
        <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/settings')}><ArrowLeft className="mr-2 h-4 w-4" /> Retour</Button>
      </div>

      <div>
        <h1 className="text-[28px] font-bold text-[#000000] leading-tight tracking-tight md:text-3xl">Créneaux</h1>
        <p className="mt-1 text-[15px] text-[#8E8E93] md:text-gray-600">Configurez la durée des services et les créneaux</p>
      </div>

      {/* Success */}
      {successMessage && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4 text-[15px] font-medium text-emerald-700 text-center md:rounded-xl md:text-sm">{successMessage}</div>
      )}

      {/* Form */}
      <div className="bg-white rounded-2xl border border-[#E5E5EA] overflow-hidden md:rounded-xl">
        <div className="p-4 md:p-5">
          <h2 className="text-[17px] font-semibold text-[#000000] mb-4 md:text-lg">Paramètres des services</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Duration */}
            <div className="space-y-1.5">
              <label htmlFor="defaultDuration" className="text-[13px] font-medium text-[#8E8E93] md:text-sm">Durée d&apos;un service (minutes)</label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-[160px]">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8E8E93] pointer-events-none" />
                  <input
                    id="defaultDuration" type="number" min="30" max="300" step="15"
                    {...register('defaultDuration')} disabled={isSaving}
                    className="w-full h-11 pl-9 pr-3 rounded-xl border border-[#E5E5EA] bg-white text-[15px] text-[#000000] focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/20 appearance-none md:h-10 md:text-sm"
                  />
                </div>
                <span className="text-[15px] font-medium text-[#0066FF] tabular-nums md:text-sm">
                  = {formatMinutes(parseInt(watch('defaultDuration') || '90'))}
                </span>
              </div>
              {errors.defaultDuration && <p className="text-[12px] text-red-500">{errors.defaultDuration.message}</p>}
              <p className="text-[11px] text-[#8E8E93] md:text-xs">Espacement entre deux services (30-300 min, par paliers de 15)</p>
            </div>

            {/* Average price */}
            <div className="space-y-1.5">
              <label htmlFor="averagePrice" className="text-[13px] font-medium text-[#8E8E93] md:text-sm">Prix moyen par client (€)</label>
              <div className="relative max-w-[200px]">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[15px] text-[#8E8E93] md:text-sm">€</span>
                <input
                  id="averagePrice" type="number" min="0" step="0.5" placeholder="25"
                  {...register('averagePrice')} disabled={isSaving}
                  className="w-full h-11 pl-7 pr-3 rounded-xl border border-[#E5E5EA] bg-white text-[15px] text-[#000000] placeholder:text-[#C7C7CC] focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/20 md:h-10 md:text-sm"
                />
              </div>
              <p className="text-[11px] text-[#8E8E93] md:text-xs">Estimations de revenus dans le dashboard</p>
            </div>

            {/* Toggle: use opening hours */}
            <div className="border-t border-[#E5E5EA] pt-5">
              <div className="flex items-center justify-between">
                <div className="flex-1 mr-4">
                  <p className="text-[15px] font-medium text-[#000000] md:text-base">Créneaux basés sur les horaires</p>
                  <p className="text-[12px] text-[#8E8E93] mt-0.5 md:text-sm">
                    {useOpeningHours ? 'Réservations uniquement pendant les horaires d&apos;ouverture' : 'Réservations possibles en dehors des horaires'}
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={useOpeningHours}
                  onClick={() => !isSaving && setValue('useOpeningHours', !useOpeningHours)}
                  className={`relative inline-flex h-7 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${useOpeningHours ? 'bg-[#0066FF]' : 'bg-[#E5E5EA]'} ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ${useOpeningHours ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            <Button type="submit" disabled={isSaving} className="w-full h-11 rounded-xl text-[15px] font-medium md:w-auto md:h-10 md:text-sm">
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {isSaving ? 'Enregistrement...' : 'Valider'}
            </Button>
          </form>
        </div>
      </div>

      {/* Current config summary */}
      <div className="bg-white rounded-2xl border border-[#E5E5EA] overflow-hidden md:rounded-xl">
        <div className="p-4 md:p-5">
          <h2 className="text-[17px] font-semibold text-[#000000] mb-4 md:text-lg">Configuration actuelle</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[13px] text-[#8E8E93] md:text-sm">Durée d&apos;un service</span>
              <span className="text-[13px] font-medium text-[#000000] md:text-sm tabular-nums">
                {restaurant?.reservationConfig.defaultDuration} min ({formatMinutes(restaurant ? restaurant.reservationConfig.defaultDuration : 0)})
              </span>
            </div>
            <div className="border-t border-[#E5E5EA]" />
            <div className="flex justify-between items-center">
              <span className="text-[13px] text-[#8E8E93] md:text-sm">Créneaux basés sur</span>
              <span className="text-[13px] font-medium text-[#000000] md:text-sm">
                {restaurant?.reservationConfig.useOpeningHours ? 'Horaires d&apos;ouverture' : 'Mode personnalisé'}
              </span>
            </div>
            <div className="border-t border-[#E5E5EA]" />
            <div className="flex justify-between items-center">
              <span className="text-[13px] text-[#8E8E93] md:text-sm">Prix moyen</span>
              <span className="text-[13px] font-medium text-emerald-600 md:text-sm">
                {restaurant?.reservationConfig.averagePrice ? `${restaurant.reservationConfig.averagePrice}€` : 'Non configuré'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Services per day */}
      <div className="bg-white rounded-2xl border border-[#E5E5EA] overflow-hidden md:rounded-xl">
        <div className="p-4 md:p-5">
          <h2 className="text-[17px] font-semibold text-[#000000] mb-3 md:text-lg">Services par jour</h2>
          <p className="text-[11px] text-[#8E8E93] mb-4 md:text-xs">
            Durée de service : {restaurant?.reservationConfig.defaultDuration || 90} min
          </p>

          {restaurant && (
            <div className="grid grid-cols-4 md:grid-cols-7 gap-1.5 md:gap-2">
              {(Object.entries(getServicesPerDay(restaurant)) as [string, { lunch: number; dinner: number; total: number }][]).map(([day, { lunch, dinner, total }], i) => (
                <div key={day} className="rounded-xl border border-[#E5E5EA] bg-white p-2 text-center md:rounded-lg md:p-3">
                  <p className="text-[10px] font-semibold text-[#8E8E93] uppercase mb-1.5 md:text-xs">{DAY_NAMES[i]}</p>
                  {total === 0 ? (
                    <p className="text-[11px] text-[#C7C7CC] md:text-xs">Fermé</p>
                  ) : (
                    <div className="space-y-0.5">
                      <div className="flex items-center justify-center gap-1">
                        <Sun className="h-2.5 w-2.5 text-amber-400 flex-shrink-0 md:h-3 md:w-3" />
                        <span className="text-[10px] text-[#8E8E93] md:text-xs">{lunch}</span>
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        <Moon className="h-2.5 w-2.5 text-indigo-400 flex-shrink-0 md:h-3 md:w-3" />
                        <span className="text-[10px] text-[#8E8E93] md:text-xs">{dinner}</span>
                      </div>
                      <p className="text-sm font-bold text-[#0066FF] mt-0.5 md:text-base">{total}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          <p className="mt-4 text-[11px] text-[#8E8E93] leading-relaxed md:text-xs">
            Les créneaux sont automatiquement espacés selon la durée d&apos;un service. Modifiez cette durée pour ajuster le nombre de services disponibles.
          </p>
        </div>
      </div>
    </div>
  );
}
