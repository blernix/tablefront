'use client';

import { useCallback, useEffect, useState } from 'react';
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
import { ArrowLeft, Save, Clock } from 'lucide-react';

const formSchema = z.object({
  defaultDuration: z.string().min(1, 'La durée est requise'),
  useOpeningHours: z.boolean(),
  averagePrice: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function ReservationConfigPage() {
  const router = useRouter();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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
    try {
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
    }
  }, [reset]);

  useEffect(() => {
    fetchRestaurant();
  }, [fetchRestaurant]);

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

      setRestaurant(prev => prev ? {
        ...prev,
        reservationConfig: response.reservationConfig,
      } : null);

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
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/dashboard/settings')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configuration des réservations</h1>
          <p className="mt-2 text-gray-600">
            Définissez les paramètres de gestion des réservations
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Paramètres généraux</CardTitle>
          <CardDescription>
            Configurez la durée et les créneaux de réservation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="defaultDuration">Durée par défaut (en minutes) *</Label>
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
                  className="max-w-xs"
                />
              </div>
              {errors.defaultDuration && (
                <p className="text-sm text-destructive">{errors.defaultDuration.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Durée standard d&apos;une réservation (entre 30 et 300 minutes)
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
                      ? 'Les réservations sont disponibles uniquement pendant les horaires d\'ouverture définis'
                      : 'Les réservations peuvent être prises en dehors des horaires d\'ouverture (mode personnalisé)'}
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
            <span className="text-muted-foreground">Durée par défaut</span>
            <span className="font-semibold">{restaurant?.reservationConfig.defaultDuration} minutes</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-muted-foreground">Créneaux basés sur</span>
            <span className="font-semibold">
              {restaurant?.reservationConfig.useOpeningHours
                ? 'Horaires d\'ouverture'
                : 'Mode personnalisé'}
            </span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-muted-foreground">Prix moyen par client</span>
            <span className="font-semibold text-green-600">
              {restaurant?.reservationConfig.averagePrice ? `${restaurant.reservationConfig.averagePrice}€` : 'Non configuré'}
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
          <CardTitle>À propos des créneaux</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-600">
          <p>
            • <strong>Durée par défaut</strong> : Temps alloué pour chaque réservation
          </p>
          <p>
            • <strong>Horaires d&apos;ouverture activés</strong> : Les clients peuvent réserver uniquement pendant vos heures d&apos;ouverture
          </p>
          <p>
            • <strong>Mode personnalisé</strong> : Vous définissez manuellement les créneaux disponibles (utile pour les services spéciaux)
          </p>
          <p>
            • Les clients verront les créneaux disponibles selon votre configuration
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
