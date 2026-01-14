'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiClient } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const formSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  address: z.string().min(1, 'L\'adresse est requise'),
  phone: z.string().min(1, 'Le téléphone est requis'),
  email: z.string().email('Email invalide'),
  totalTables: z.number().min(1, 'Au moins 1 table').optional(),
  averageCapacity: z.number().min(1, 'Capacité min 1').optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function NewRestaurantPage() {
  const router = useRouter();
  const { isAuthenticated, user, initAuth, isInitialized } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (!isInitialized) return;
    
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user?.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
  }, [isInitialized, isAuthenticated, user, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      totalTables: 10,
      averageCapacity: 4,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      const response = await apiClient.createRestaurant({
        name: data.name,
        address: data.address,
        phone: data.phone,
        email: data.email,
        tablesConfig: {
          totalTables: data.totalTables,
          averageCapacity: data.averageCapacity,
        },
      });

      setApiKey(response.apiKey);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur lors de la création');
      setIsLoading(false);
    }
  };

  if (!isInitialized) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">Chargement...</div>;
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">Chargement...</div>;
  }

  if (apiKey) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full">
          <CardHeader>
            <CardTitle>Restaurant créé !</CardTitle>
            <CardDescription>Clé API générée - Copiez-la maintenant</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gray-100 rounded-md font-mono text-sm break-all">
              {apiKey}
            </div>
            <p className="text-sm text-muted-foreground">
              Cette clé API permet au site web du restaurant d&apos;accéder aux menus et réservations.
              Vous ne pourrez plus la voir après.
            </p>
            <Button onClick={() => router.push('/admin/restaurants')} className="w-full">
              Retour à la liste
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Nouveau Restaurant</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Informations du restaurant</CardTitle>
            <CardDescription>Créez un nouveau restaurant dans le système</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du restaurant</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Restaurant Le Bon Goût"
                  disabled={isLoading}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  {...register('address')}
                  placeholder="123 Rue de la Paix, 75001 Paris"
                  disabled={isLoading}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <h3 className="text-sm font-medium mb-4">Configuration des tables</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="totalTables">Nombre total de tables</Label>
                    <Input
                      id="totalTables"
                      type="number"
                      {...register('totalTables', { valueAsNumber: true })}
                      disabled={isLoading}
                    />
                    {errors.totalTables && (
                      <p className="text-sm text-destructive">{errors.totalTables.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="averageCapacity">Capacité moyenne par table</Label>
                    <Input
                      id="averageCapacity"
                      type="number"
                      {...register('averageCapacity', { valueAsNumber: true })}
                      disabled={isLoading}
                    />
                    {errors.averageCapacity && (
                      <p className="text-sm text-destructive">{errors.averageCapacity.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isLoading}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Création...' : 'Créer le restaurant'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
