import { useMemo } from 'react';
import { Dish, MenuCategory, Restaurant } from '@/types';
import { getOrphanedDishes, countDishesInCategory } from '@/lib/menu-helpers';

interface MenuStats {
  totalDishes: number;
  availableDishes: number;
  unavailableDishes: number;
  totalCategories: number;
  orphanedDishesCount: number;
  hasPdf: boolean;
  dishesByCategory: Array<{
    categoryId: string;
    categoryName: string;
    dishCount: number;
  }>;
}

/**
 * Hook pour calculer les statistiques du menu
 * Memoized pour éviter les recalculs inutiles
 */
export const useMenuStats = (
  dishes: Dish[],
  categories: MenuCategory[],
  restaurant: Restaurant | null
): MenuStats => {
  return useMemo(() => {
    const availableDishes = dishes.filter((d) => d.available).length;
    const unavailableDishes = dishes.filter((d) => !d.available).length;
    const orphanedDishes = getOrphanedDishes(dishes);
    const hasPdf = !!restaurant?.menu?.pdfUrl;

    const dishesByCategory = categories.map((category) => ({
      categoryId: category._id,
      categoryName: category.name,
      dishCount: countDishesInCategory(dishes, category._id),
    }));

    return {
      totalDishes: dishes.length,
      availableDishes,
      unavailableDishes,
      totalCategories: categories.length,
      orphanedDishesCount: orphanedDishes.length,
      hasPdf,
      dishesByCategory,
    };
  }, [dishes, categories, restaurant]);
};
