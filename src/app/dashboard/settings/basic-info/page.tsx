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
import { ArrowLeft } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  address: z.string().min(1, 'L\'adresse est requise'),
  phone: z.string().min(1, 'Le téléphone est requis'),
  email: z.string().email('Email invalide'),
  googleReviewLink: z.string().url('URL invalide').optional().or(z.literal('')),
});

type FormData = z.infer<typeof formSchema>;

export default function BasicInfoPage() {
  const router = useRouter();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const fetchRestaurant = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getMyRestaurant();
      setRestaurant(response.restaurant);
      reset({
        name: response.restaurant.name,
        address: response.restaurant.address,
        phone: response.restaurant.phone,
        email: response.restaurant.email,
        googleReviewLink: response.restaurant.googleReviewLink || '',
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
      const response = await apiClient.updateBasicInfo(data);
      setRestaurant(response.restaurant);
      reset(data);
      setSuccessMessage('Informations mises à jour avec succès !');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
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
          <h1 className="text-3xl font-bold text-gray-900">Informations de base</h1>
          <p className="mt-2 text-gray-600">
            Modifiez les coordonnées de votre restaurant
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coordonnées</CardTitle>
          <CardDescription>
            Ces informations seront affichées sur votre page publique
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du restaurant</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Restaurant Le Bon Goût"
                disabled={isSaving}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Adresse complète</Label>
              <Input
                id="address"
                {...register('address')}
                placeholder="123 Rue de la Paix, 75001 Paris"
                disabled={isSaving}
              />
              {errors.address && (
                <p className="text-sm text-destructive">{errors.address.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  {...register('phone')}
                  placeholder="01 23 45 67 89"
                  disabled={isSaving}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="contact@restaurant.fr"
                  disabled={isSaving}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="googleReviewLink">Lien vers page Google (optionnel)</Label>
              <Input
                id="googleReviewLink"
                type="url"
                {...register('googleReviewLink')}
                placeholder="https://g.page/votre-restaurant/review"
                disabled={isSaving}
              />
              {errors.googleReviewLink && (
                <p className="text-sm text-destructive">{errors.googleReviewLink.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Ce lien sera envoyé aux clients après leur visite pour qu&apos;ils laissent un avis Google
              </p>
            </div>

            {successMessage && (
              <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">
                {successMessage}
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => reset()}
                disabled={isSaving || !isDirty}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isSaving || !isDirty}>
                {isSaving ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
