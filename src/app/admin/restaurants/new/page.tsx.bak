'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateRestaurant } from '@/hooks/api/useAdminRestaurants';

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
  const [apiKey, setApiKey] = useState<string | null>(null);
  const createMutation = useCreateRestaurant();

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
      const response = await createMutation.mutateAsync({
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
      // Error is handled by the mutation
    }
  };

  if (apiKey) {
    return (
      <div className="max-w-4xl mx-auto">
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
              Cette clé API sera utilisée pour les intégrations. Vous ne pourrez pas la revoir après avoir quitté cette page.
            </p>
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(apiKey);
                  alert('Clé API copiée !');
                }}
                className="flex-1"
              >
                Copier la clé API
              </Button>
              <Button
                onClick={() => router.push('/admin/restaurants')}
                className="flex-1"
              >
                Voir les restaurants
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Nouveau Restaurant</CardTitle>
          <CardDescription>Créez un nouveau restaurant et générez sa clé API</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nom du restaurant *</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Le Bistro Parisien"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="address">Adresse *</Label>
                <Input
                  id="address"
                  {...register('address')}
                  placeholder="123 Rue de la Paix, 75001 Paris"
                  className={errors.address ? 'border-red-500' : ''}
                />
                {errors.address && (
                  <p className="text-sm text-red-500 mt-1">{errors.address.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Téléphone *</Label>
                  <Input
                    id="phone"
                    {...register('phone')}
                    placeholder="+33 1 23 45 67 89"
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="contact@restaurant.com"
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="totalTables">Nombre de tables</Label>
                  <Input
                    id="totalTables"
                    type="number"
                    {...register('totalTables', { valueAsNumber: true })}
                    className={errors.totalTables ? 'border-red-500' : ''}
                  />
                  {errors.totalTables && (
                    <p className="text-sm text-red-500 mt-1">{errors.totalTables.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="averageCapacity">Capacité moyenne par table</Label>
                  <Input
                    id="averageCapacity"
                    type="number"
                    {...register('averageCapacity', { valueAsNumber: true })}
                    className={errors.averageCapacity ? 'border-red-500' : ''}
                  />
                  {errors.averageCapacity && (
                    <p className="text-sm text-red-500 mt-1">{errors.averageCapacity.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/restaurants')}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="flex-1"
              >
                {createMutation.isPending ? 'Création...' : 'Créer le restaurant'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}