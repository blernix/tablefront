import { Dish } from '@/types';

/**
 * Extracts the category ID from a dish, handling all possible types:
 * - string: direct category ID
 * - object: { _id: string; name: string }
 * - null: no category (orphaned dish)
 */
export function getDishCategoryId(dish: Dish): string | null {
  if (dish.categoryId === null) return null;
  return typeof dish.categoryId === 'string' 
    ? dish.categoryId 
    : dish.categoryId._id;
}

/**
 * Counts the number of dishes that belong to a specific category
 */
export function countDishesInCategory(dishes: Dish[], categoryId: string): number {
  return dishes.filter(dish => getDishCategoryId(dish) === categoryId).length;
}

/**
 * Filters dishes that belong to a specific category
 */
export function filterDishesByCategory(dishes: Dish[], categoryId: string): Dish[] {
  return dishes.filter(dish => getDishCategoryId(dish) === categoryId);
}

/**
 * Returns all orphaned dishes (dishes without a category)
 */
export function getOrphanedDishes(dishes: Dish[]): Dish[] {
  return dishes.filter(dish => getDishCategoryId(dish) === null);
}

/**
 * Groups dishes by their category ID
 * Returns a Map where key is category ID (string) and value is Dish[]
 * Orphaned dishes are excluded (use getOrphanedDishes for those)
 */
export function groupDishesByCategory(dishes: Dish[]): Map<string, Dish[]> {
  const map = new Map<string, Dish[]>();
  
  dishes.forEach(dish => {
    const categoryId = getDishCategoryId(dish);
    if (categoryId !== null) {
      if (!map.has(categoryId)) {
        map.set(categoryId, []);
      }
      map.get(categoryId)!.push(dish);
    }
  });
  
  return map;
}