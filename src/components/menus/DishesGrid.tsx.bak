'use client';

import { useState, useEffect } from 'react';
import { Plus, Folder, UtensilsCrossed } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { DishCard } from './DishCard';
import { Dish, MenuCategory } from '@/types';
import { getDishCategoryId, filterDishesByCategory } from '@/lib/menu-helpers';

interface DishesGridProps {
  dishes: Dish[];
  categories: MenuCategory[];
  categoryFilter: string;
  hasActiveFilters: boolean;
  onCreateDish: (categoryId?: string) => void;
  onEditDish: (dish: Dish) => void;
  onDeleteDish: (dishId: string, dishName: string) => void;
  onClearFilters: () => void;
}

/**
 * Grille d'affichage des plats groupés par catégorie
 * Affiche les plats dans des sections collapsibles par catégorie
 */
export function DishesGrid({
  dishes,
  categories,
  categoryFilter,
  hasActiveFilters,
  onCreateDish,
  onEditDish,
  onDeleteDish,
  onClearFilters,
}: DishesGridProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  // Auto-expand filtered category or all categories
  useEffect(() => {
    if (categories.length > 0 && expandedCategories.length === 0) {
      if (categoryFilter !== 'all') {
        setExpandedCategories([categoryFilter]);
      } else {
        setExpandedCategories(categories.map((c) => c._id));
      }
    }
  }, [categories, categoryFilter, expandedCategories.length]);

  const toggleCategory = (categoryId: string) => {
    if (categoryId === 'none') return;
    setExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  // Group dishes by category
  const dishesByCategory = categories
    .map((category) => ({
      category,
      dishes: filterDishesByCategory(dishes, category._id),
    }))
    .filter((group) => group.dishes.length > 0 || categoryFilter === 'all');

  // Add orphaned dishes group if needed
  const orphanedDishesInView = dishes.filter((dish) => getDishCategoryId(dish) === null);
  const dishesByCategoryWithOrphans = [...dishesByCategory];
  if (
    orphanedDishesInView.length > 0 &&
    (categoryFilter === 'all' || categoryFilter === 'none')
  ) {
    dishesByCategoryWithOrphans.push({
      category: {
        _id: 'none',
        name: 'Sans catégorie',
        restaurantId: '',
        displayOrder: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as MenuCategory,
      dishes: orphanedDishesInView,
    });
  }

  // No categories state
  if (categories.length === 0) {
    return (
      <Card className="p-16">
        <CardContent className="p-0 text-center">
          <div className="flex flex-col items-center justify-center max-w-md mx-auto">
            <div className="flex h-20 w-20 items-center justify-center border border-amber-600 mb-6">
              <Folder className="h-10 w-10 text-amber-600" />
            </div>
            <h3 className="text-2xl font-light text-[#2A2A2A] mb-3">
              Créez d&apos;abord une catégorie
            </h3>
            <p className="text-[#666666] mb-8 font-light">
              Vous devez avoir au moins une catégorie pour ajouter des plats
            </p>
            <Button
              onClick={() => {
                const categoryInput = document.getElementById('categoryName');
                if (categoryInput) categoryInput.focus();
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Créer une catégorie
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // No dishes state
  if (dishes.length === 0) {
    return (
      <Card className="p-16">
        <CardContent className="p-0 text-center">
          <div className="flex flex-col items-center justify-center max-w-md mx-auto">
            <div className="flex h-20 w-20 items-center justify-center border border-[#0066FF] mb-6">
              <UtensilsCrossed className="h-10 w-10 text-[#0066FF]" />
            </div>
            <h3 className="text-2xl font-light text-[#2A2A2A] mb-3">
              {hasActiveFilters ? 'Aucun plat trouvé' : 'Aucun plat'}
            </h3>
            <p className="text-[#666666] mb-8 font-light">
              {hasActiveFilters
                ? 'Essayez de modifier vos filtres de recherche'
                : 'Commencez par ajouter votre premier plat'}
            </p>
            {hasActiveFilters ? (
              <Button variant="outline" onClick={onClearFilters}>
                Effacer les filtres
              </Button>
            ) : (
              <Button onClick={() => onCreateDish()}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un plat
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Dishes list grouped by category
  return (
    <div className="space-y-4">
      {dishesByCategoryWithOrphans.map(({ category, dishes: categoryDishes }) => (
        <Collapsible
          key={category._id}
          open={
            category._id === 'none' ? true : expandedCategories.includes(category._id)
          }
          onOpenChange={
            category._id === 'none' ? undefined : () => toggleCategory(category._id)
          }
        >
          <Card>
            <CollapsibleTrigger asChild>
              <div className="flex items-center justify-between p-5 cursor-pointer hover:bg-[#FAFAFA] transition-colors">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center border ${category._id === 'none' ? 'border-[#E5E5E5] text-[#666666]' : 'border-amber-600 text-amber-600'}`}
                  >
                    <Folder className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#2A2A2A] text-base">{category.name}</h3>
                    <p className="text-xs text-[#666666] uppercase tracking-[0.1em] mt-0.5">
                      {categoryDishes.length} plat{categoryDishes.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                {category._id !== 'none' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCreateDish(category._id);
                    }}
                    className="text-[#0066FF] hover:bg-[#FAFAFA]"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Ajouter
                  </Button>
                )}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="px-6 pb-6 pt-0">
                <div className="space-y-3">
                  {categoryDishes.map((dish) => (
                    <DishCard
                      key={dish._id}
                      dish={dish}
                      onEdit={onEditDish}
                      onDelete={onDeleteDish}
                    />
                  ))}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      ))}
    </div>
  );
}
