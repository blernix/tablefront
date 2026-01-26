'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useMenuData } from '@/hooks/useMenuData';
import { useMenuStats } from '@/hooks/useMenuStats';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Plus,
  UtensilsCrossed,
  FolderTree,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';

/**
 * Onglet Dashboard du menu
 * Vue d'ensemble et statistiques de la carte
 */
export default function DashboardTab() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Data hooks (centralized API calls)
  const { restaurant, categories, dishes, isLoading } = useMenuData();

  // Stats hook
  const stats = useMenuStats(dishes, categories, restaurant);

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
        <div className="h-16 bg-[#E5E5E5]" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-[#E5E5E5]" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-48 bg-[#E5E5E5]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header avec titre */}
      <div className="relative">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-[#0066FF]" />
        <h1 className="text-2xl font-light text-[#2A2A2A] pt-4">Dashboard Menu</h1>
        <p className="text-[#666666] mt-1 font-light">Vue d&apos;ensemble et statistiques de votre carte</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {/* Plats indisponibles */}
        <Card className="card-hover p-4">
          <CardContent className="p-0">
            <div className="flex flex-col items-center text-center gap-2">
              <div
                className={`flex h-10 w-10 items-center justify-center border ${
                  stats.unavailableDishes > 0
                    ? 'border-red-600 text-red-600'
                    : 'border-emerald-600 text-emerald-600'
                }`}
              >
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-3xl font-light text-[#2A2A2A]">{stats.unavailableDishes}</p>
                <p className="text-xs text-[#666666] mt-1 uppercase tracking-[0.2em]">Indisponibles</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Catégories */}
        <Card className="card-hover p-4">
          <CardContent className="p-0">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center border border-[#0066FF] text-[#0066FF]">
                <FolderTree className="h-5 w-5" />
              </div>
              <div>
                <p className="text-3xl font-light text-[#2A2A2A]">{stats.totalCategories}</p>
                <p className="text-xs text-[#666666] mt-1 uppercase tracking-[0.2em]">Catégories</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plats */}
        <Card className="card-hover p-4">
          <CardContent className="p-0">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center border border-[#0066FF] text-[#0066FF]">
                <UtensilsCrossed className="h-5 w-5" />
              </div>
              <div>
                <p className="text-3xl font-light text-[#2A2A2A]">{stats.totalDishes}</p>
                <p className="text-xs text-[#666666] mt-1 uppercase tracking-[0.2em]">Plats total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* PDF Status */}
        <Card className="card-hover p-4">
          <CardContent className="p-0">
            <div className="flex flex-col items-center text-center gap-2">
              <div
                className={`flex h-10 w-10 items-center justify-center border ${
                  stats.hasPdf ? 'border-emerald-600 text-emerald-600' : 'border-red-600 text-red-600'
                }`}
              >
                {stats.hasPdf ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <AlertCircle className="h-5 w-5" />
                )}
              </div>
              <div>
                <p className="text-lg font-light text-[#2A2A2A]">{stats.hasPdf ? 'OK' : 'Non'}</p>
                <p className="text-xs text-[#666666] mt-1 uppercase tracking-[0.2em]">PDF Menu</p>
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
        <Card className="card-hover p-8">
          <CardContent className="p-0">
            <div className="flex flex-col h-full">
              <div className="flex h-12 w-12 items-center justify-center border border-[#0066FF] bg-[#0066FF] text-white mb-4">
                <UtensilsCrossed className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-light text-[#2A2A2A] mb-2">Gérer les plats</h3>
              <p className="text-sm text-[#666666] mb-4 flex-1 font-light">
                Créez, modifiez et organisez vos plats par catégories
              </p>
              <Button
                onClick={handleNavigateToPlats}
                className="w-full"
              >
                Accéder à la gestion
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Publication du menu */}
        <Card className="card-hover p-8">
          <CardContent className="p-0">
            <div className="flex flex-col h-full">
              <div className="flex h-12 w-12 items-center justify-center border border-[#E5E5E5] text-[#666666] mb-4">
                <Plus className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-light text-[#2A2A2A] mb-2">Publier le menu</h3>
              <p className="text-sm text-[#666666] mb-4 flex-1 font-light">
                Générez le PDF et le QR code pour vos clients
              </p>
              <Button
                onClick={handleNavigateToPublication}
                variant="outline"
                className="w-full"
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
