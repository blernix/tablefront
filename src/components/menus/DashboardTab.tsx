'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { Restaurant, Dish, MenuCategory } from '@/types';
import { filterDishesByCategory } from '@/lib/menu-helpers';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Eye,
  EyeOff,
  Plus,
  BarChart3,
  UtensilsCrossed,
  FolderTree,
  FileText,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Edit2,
  Folder,
  ImageIcon,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

export default function DashboardTab() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [stats, setStats] = useState({
    categoriesCount: 0,
    dishesCount: 0,
    unavailableDishes: 0,
    hasPdf: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Auto-expand all categories on first load
    if (categories.length > 0 && expandedCategories.length === 0) {
      setExpandedCategories(categories.map(c => c._id));
    }
  }, [categories, expandedCategories.length]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [restaurantRes, categoriesRes, dishesRes] = await Promise.all([
        apiClient.getMyRestaurant(),
        apiClient.getCategories(),
        apiClient.getDishes()
      ]);

      setRestaurant(restaurantRes.restaurant);
      setCategories(categoriesRes.categories);
      setDishes(dishesRes.dishes);

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

  const handleToggleAvailability = async (id: string, name: string) => {
    try {
      await apiClient.toggleDishAvailability(id);
      toast.success(`Disponibilité de "${name}" modifiée`);
      fetchData();
    } catch (err) {
      toast.error('Erreur lors du changement de disponibilité');
    }
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handlePreviewMenu = () => {
    // TODO: Open customer menu view in new tab
    toast.info('Fonction de prévisualisation à venir');
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

  const currentMode = restaurant?.menu.displayMode || 'detailed';

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-16 bg-stone-100 rounded-xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-stone-100 rounded-xl" />
          ))}
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 bg-stone-100 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // Group dishes by category
  const dishesByCategory = categories.map(category => ({
    category,
    dishes: filterDishesByCategory(dishes, category._id)
  }));

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header avec titre et actions rapides */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Menu</h1>
          <p className="text-slate-600 mt-1">Vue d&apos;ensemble et statistiques de votre carte</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviewMenu}
            className="flex items-center gap-1.5"
          >
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Prévisualiser</span>
          </Button>
          <Button
            size="sm"
            onClick={handleNavigateToPlats}
            className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Ajouter un plat</span>
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {/* Mode actuel */}
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex flex-col items-center text-center gap-2">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                currentMode === 'pdf' ? 'bg-slate-100 text-slate-900' :
                currentMode === 'both' ? 'bg-amber-100 text-amber-600' :
                'bg-green-100 text-green-600'
              }`}>
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 capitalize">
                  {currentMode === 'pdf' ? 'PDF' : currentMode === 'both' ? 'Mix' : 'Détail'}
                </p>
                <p className="text-xs text-slate-600 mt-1">Mode actuel</p>
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

      {/* Vue des catégories avec plats */}
      {categories.length === 0 ? (
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="py-16 text-center">
            <div className="flex flex-col items-center justify-center max-w-md mx-auto">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 mb-6">
                <Folder className="h-10 w-10 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                Créez votre première catégorie
              </h3>
              <p className="text-slate-600 mb-8">
                Organisez votre menu en sections pour une navigation facile
              </p>
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                <Button
                  variant="outline"
                  onClick={handleNavigateToPlats}
                  className="bg-orange-50 hover:bg-orange-100 border-orange-200"
                >
                  Entrées
                </Button>
                <Button
                  variant="outline"
                  onClick={handleNavigateToPlats}
                  className="bg-orange-50 hover:bg-orange-100 border-orange-200"
                >
                  Plats principaux
                </Button>
                <Button
                  variant="outline"
                  onClick={handleNavigateToPlats}
                  className="bg-orange-50 hover:bg-orange-100 border-orange-200"
                >
                  Desserts
                </Button>
              </div>
              <Button
                onClick={handleNavigateToPlats}
                className="bg-orange-500 hover:bg-orange-600"
              >
                <Plus className="mr-2 h-4 w-4" />
                Gérer les catégories
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {dishesByCategory.map(({ category, dishes: categoryDishes }) => (
            <Collapsible
              key={category._id}
              open={expandedCategories.includes(category._id)}
              onOpenChange={() => toggleCategory(category._id)}
            >
              <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                {/* Category Header */}
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-stone-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-900">
                        <Folder className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                          {category.name}
                          <Badge variant="default" className="text-xs">
                            {categoryDishes.length} plat{categoryDishes.length !== 1 ? 's' : ''}
                          </Badge>
                        </h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNavigateToPlats();
                        }}
                        className="hidden sm:flex text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Ajouter un plat
                      </Button>
                      {expandedCategories.includes(category._id) ? (
                        <ChevronDown className="h-5 w-5 text-slate-600" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-slate-600" />
                      )}
                    </div>
                  </div>
                </CollapsibleTrigger>

                {/* Collapsed Preview: Show first 3 dishes as thumbnails */}
                {!expandedCategories.includes(category._id) && categoryDishes.length > 0 && (
                  <div className="px-4 pb-4 flex gap-2">
                    {categoryDishes.slice(0, 3).map((dish) => (
                      <div
                        key={dish._id}
                        className="relative h-12 w-12 rounded-lg overflow-hidden border border-slate-200"
                      >
                        {dish.photoUrl ? (
                          <Image
                            src={dish.photoUrl}
                            alt={dish.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full bg-slate-100">
                            <UtensilsCrossed className="h-5 w-5 text-slate-400" />
                          </div>
                        )}
                      </div>
                    ))}
                    {categoryDishes.length > 3 && (
                      <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-slate-100 text-xs font-medium text-slate-600">
                        +{categoryDishes.length - 3}
                      </div>
                    )}
                  </div>
                )}

                {/* Expanded: Show full dish grid */}
                <CollapsibleContent>
                  <CardContent className="p-4 pt-0">
                    {categoryDishes.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-slate-600 mb-4">
                          Aucun plat dans cette catégorie
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleNavigateToPlats}
                          className="text-orange-600 border-orange-200 hover:bg-orange-50"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Ajouter le premier plat
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {categoryDishes.map((dish) => (
                          <Card
                            key={dish._id}
                            className="group overflow-hidden hover:shadow-lg transition-all duration-200 border-slate-200"
                          >
                            {/* Image Section (60% of card) */}
                            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                              {dish.photoUrl ? (
                                <Image
                                  src={dish.photoUrl}
                                  alt={dish.name}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                  unoptimized
                                />
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  <UtensilsCrossed className="h-12 w-12 text-slate-300" />
                                </div>
                              )}

                              {/* Availability Badge Overlay */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleAvailability(dish._id, dish.name);
                                }}
                                className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 backdrop-blur hover:bg-white transition-all shadow-sm"
                                title={dish.available ? 'Marquer comme indisponible' : 'Marquer comme disponible'}
                              >
                                {dish.available ? (
                                  <Eye className="h-4 w-4 text-green-600" />
                                ) : (
                                  <EyeOff className="h-4 w-4 text-red-600" />
                                )}
                              </button>
                            </div>

                            {/* Info Section (40% of card) */}
                            <CardContent className="p-3">
                              <h4 className="font-semibold text-slate-900 truncate">
                                {dish.name}
                              </h4>
                              {dish.description && (
                                <p className="text-sm text-slate-600 line-clamp-1 mt-1">
                                  {dish.description}
                                </p>
                              )}

                              <div className="flex items-center justify-between mt-3">
                                <span className="text-lg font-semibold text-orange-500 tabular-nums">
                                  {dish.hasVariations ? 'Dès ' : ''}{dish.price.toFixed(2)} €
                                </span>

                                {/* Actions - visible on hover (desktop) or always (mobile) */}
                                <div className="flex gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={handleNavigateToPlats}
                                    className="h-7 w-7 p-0 hover:bg-orange-50"
                                    title="Modifier"
                                  >
                                    <Edit2 className="h-3.5 w-3.5 text-slate-600" />
                                  </Button>
                                </div>
                              </div>

                              {/* Additional Badges */}
                              {(dish.hasVariations || dish.allergens.length > 0) && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {dish.hasVariations && (
                                    <Badge variant="default" className="text-xs">
                                      Variations
                                    </Badge>
                                  )}
                                  {dish.allergens.length > 0 && (
                                    <Badge variant="outline" className="text-xs">
                                      Allergènes
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </div>
      )}

      {/* CTA pour passer à la gestion complète */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Gestion complète des plats</h3>
            <p className="text-slate-600 mt-1">
              Accédez à toutes les fonctionnalités de gestion : création, édition, filtres, etc.
            </p>
          </div>
          <Button
            onClick={handleNavigateToPlats}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            Voir la gestion complète
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}