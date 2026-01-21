'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { Restaurant } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Plus,
  UtensilsCrossed,
  FolderTree,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';

export default function DashboardTab() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    categoriesCount: 0,
    dishesCount: 0,
    unavailableDishes: 0,
    hasPdf: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [restaurantRes, categoriesRes, dishesRes] = await Promise.all([
        apiClient.getMyRestaurant(),
        apiClient.getCategories(),
        apiClient.getDishes()
      ]);

      setRestaurant(restaurantRes.restaurant);

      const unavailableDishes = dishesRes.dishes.filter(dish => !dish.available).length;

      setStats({
        categoriesCount: categoriesRes.categories.length,
        dishesCount: dishesRes.dishes.length,
        unavailableDishes,
        hasPdf: !!restaurantRes.restaurant.menu.pdfUrl
      });
    } catch (err) {
      console.error('Error fetching data:', err);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  };


  const handleNavigateToPlats = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', 'plats');
    router.push(`/dashboard/menus?${params.toString()}`);
  };

  const handleNavigateToPublication = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', 'publication');
    router.push(`/dashboard/menus?${params.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse pb-20 md:pb-6">
        <div className="h-16 bg-stone-100 rounded-xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-stone-100 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-48 bg-stone-100 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header avec titre */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Menu</h1>
        <p className="text-slate-600 mt-1">Vue d&apos;ensemble et statistiques de votre carte</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {/* Plats indisponibles */}
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex flex-col items-center text-center gap-2">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                stats.unavailableDishes > 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
              }`}>
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900">
                  {stats.unavailableDishes}
                </p>
                <p className="text-xs text-slate-600 mt-1">Indisponibles</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Catégories */}
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                <FolderTree className="h-5 w-5" />
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900">{stats.categoriesCount}</p>
                <p className="text-xs text-slate-600 mt-1">Catégories</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plats */}
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                <UtensilsCrossed className="h-5 w-5" />
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900">{stats.dishesCount}</p>
                <p className="text-xs text-slate-600 mt-1">Plats total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* PDF Status */}
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex flex-col items-center text-center gap-2">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                stats.hasPdf ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
                {stats.hasPdf ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <AlertCircle className="h-5 w-5" />
                )}
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900">
                  {stats.hasPdf ? 'OK' : 'Non'}
                </p>
                <p className="text-xs text-slate-600 mt-1">PDF Menu</p>
                {!stats.hasPdf && (
                  <Button
                    variant="link"
                    size="sm"
                    onClick={handleNavigateToPublication}
                    className="text-xs mt-1 h-auto p-0"
                  >
                    Ajouter
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Gestion des plats */}
        <Card className="border-orange-200 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-orange-50 to-amber-50">
          <CardContent className="p-6">
            <div className="flex flex-col h-full">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-white mb-4">
                <UtensilsCrossed className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Gérer les plats
              </h3>
              <p className="text-sm text-slate-600 mb-4 flex-1">
                Créez, modifiez et organisez vos plats par catégories
              </p>
              <Button
                onClick={handleNavigateToPlats}
                className="bg-orange-500 hover:bg-orange-600 text-white w-full"
              >
                Accéder à la gestion
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Publication du menu */}
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex flex-col h-full">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-900 mb-4">
                <Plus className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Publier le menu
              </h3>
              <p className="text-sm text-slate-600 mb-4 flex-1">
                Générez le PDF et le QR code pour vos clients
              </p>
              <Button
                onClick={handleNavigateToPublication}
                variant="outline"
                className="w-full border-slate-300 hover:bg-slate-50"
              >
                Gérer la publication
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}