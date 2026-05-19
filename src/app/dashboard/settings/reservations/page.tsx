'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiClient } from '@/lib/api';
import { Restaurant } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Clock, Sun, Moon } from 'lucide-react';
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

export default function ReservationConfigPage() {
  const router = useRouter();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const isFetchingRef = useRef(false); // Prevent multiple simultaneous calls

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const useOpeningHours = watch('useOpeningHours');

  const fetchRestaurant = useCallback(async () => {
    // Prevent multiple simultaneous calls
    if (isFetchingRef.current) {
      return;
    }

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
  }, [reset]); // Include reset as dependency

  useEffect(() => {
    fetchRestaurant();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const onSubmit = async (data: FormData) => {
    try {
      setIsSaving(true);
      setSuccessMessage('');

      const defaultDuration = parseInt(data.defaultDuration, 10);
      const averagePrice = data.averagePrice ? parseFloat(data.averagePrice) : undefined;

      if (isNaN(defaultDuration) || defaultDuration < 30 || defaultDuration > 300) {
        alert('La durée doit être entre 30 et 300 minutes');
        return;
      }

      if (averagePrice !== undefined && (isNaN(averagePrice) || averagePrice < 0)) {
        alert('Le prix moyen doit être un nombre positif');
        return;
      }

      const response = await apiClient.updateReservationConfig({
        defaultDuration,
        useOpeningHours: data.useOpeningHours,
        averagePrice,
      });

      setRestaurant((prev) =>
        prev
          ? {
              ...prev,
              reservationConfig: response.reservationConfig,
            }
          : null
      );

      setSuccessMessage('Configuration des réservations mise à jour avec succès !');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-muted-foreground">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/settings')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <div>
          <h1 className="text-3xl font-light text-[#2A2A2A]">Configuration des réservations</h1>
          <p className="mt-2 text-[#666666] font-light">
            Définissez vos services et la durée de chaque réservation
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Paramètres des services</CardTitle>
          <CardDescription>Configurez la durée de chaque service de réservation</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="defaultDuration">Durée d&apos;un service (en minutes) *</Label>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="defaultDuration"
                  type="number"
                  min="30"
                  max="300"
                  step="15"
                  {...register('defaultDuration')}
                  disabled={isSaving}
                  className="max-w-[120px]"
                />
                <span className="text-sm text-[#666666]">
                  {formatMinutes(parseInt(watch('defaultDuration') || '90'))}
                </span>
              </div>
              {errors.defaultDuration && (
                <p className="text-sm text-destructive">{errors.defaultDuration.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Durée allouée à chaque réservation. Définit l&apos;espacement entre deux services.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="averagePrice">Prix moyen par client (€)</Label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">€</span>
                <Input
                  id="averagePrice"
                  type="number"
                  min="0"
                  step="0.5"
                  {...register('averagePrice')}
                  disabled={isSaving}
                  className="max-w-xs"
                  placeholder="25"
                />
              </div>
              {errors.averagePrice && (
                <p className="text-sm text-destructive">{errors.averagePrice.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Utilisé pour estimer les revenus dans le dashboard (optionnel)
              </p>
            </div>

            <div className="space-y-3 border-t pt-4">
              <Label className="text-base">Créneaux de réservation</Label>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="useOpeningHours"
                  {...register('useOpeningHours')}
                  disabled={isSaving}
                  className="mt-1 h-4 w-4 rounded border-gray-300"
                />
                <div>
                  <Label htmlFor="useOpeningHours" className="cursor-pointer font-medium">
                    Utiliser les horaires d&apos;ouverture
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {useOpeningHours
                      ? "Les réservations sont disponibles uniquement pendant les horaires d'ouverture définis"
                      : "Les réservations peuvent être prises en dehors des horaires d'ouverture (mode personnalisé)"}
                  </p>
                </div>
              </div>
            </div>

            {successMessage && (
              <div className="rounded-lg bg-green-50 p-4 text-green-800">
                <p className="text-sm font-medium">{successMessage}</p>
              </div>
            )}

            <Button type="submit" disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configuration actuelle</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Durée d&apos;un service</span>
            <span className="font-semibold">
              {restaurant?.reservationConfig.defaultDuration} min
              <span className="text-[#666666] font-light ml-1">
                ({formatMinutes(restaurant ? restaurant.reservationConfig.defaultDuration : 0)})
              </span>
            </span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-muted-foreground">Créneaux basés sur</span>
            <span className="font-semibold">
              {restaurant?.reservationConfig.useOpeningHours
                ? "Horaires d'ouverture"
                : 'Mode personnalisé'}
            </span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-muted-foreground">Prix moyen par client</span>
            <span className="font-semibold text-green-600">
              {restaurant?.reservationConfig.averagePrice
                ? `${restaurant.reservationConfig.averagePrice}€`
                : 'Non configuré'}
            </span>
          </div>
          <div className="flex justify-between pt-2">
            <span className="text-muted-foreground">Durée estimée en heures</span>
            <span className="font-semibold text-blue-600">
              {restaurant ? (restaurant.reservationConfig.defaultDuration / 60).toFixed(1) : 0}h
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-[#0066FF]" />
            Services disponibles par jour
          </CardTitle>
          <CardDescription>
            Avec une durée de service de {restaurant?.reservationConfig.defaultDuration || 90} minutes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {restaurant && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {(Object.entries(getServicesPerDay(restaurant)) as [string, { lunch: number; dinner: number; total: number }][]).map(([day, { lunch, dinner, total }]) => (
                <div key={day} className="rounded-lg border border-[#E5E5E5] p-3 text-center">
                  <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#999999] mb-2">
                    {day.substring(0, 3)}
                  </p>
                  {total === 0 ? (
                    <p className="text-sm text-[#CCCCCC] font-light">Fermé</p>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-1.5 text-xs text-[#666666]">
                        <Sun className="h-3 w-3 text-amber-500" />
                        <span>{lunch} service{lunch !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center justify-center gap-1.5 text-xs text-[#666666]">
                        <Moon className="h-3 w-3 text-indigo-400" />
                        <span>{dinner} service{dinner !== 1 ? 's' : ''}</span>
                      </div>
                      <p className="text-lg font-light text-[#2A2A2A] mt-1">{total}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          <p className="mt-4 text-xs text-[#999999]">
            Les créneaux de réservation sont automatiquement espacés selon la durée d&apos;un service.
            Modifiez cette durée pour ajuster le nombre de services disponibles par jour.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
