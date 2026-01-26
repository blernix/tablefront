import { useState, useEffect, useCallback, useRef } from 'react';
import { apiClient } from '@/lib/api';
import { Restaurant, MenuCategory, Dish } from '@/types';
import { toast } from 'sonner';

interface UseMenuDataReturn {
  restaurant: Restaurant | null;
  categories: MenuCategory[];
  dishes: Dish[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook centralisé pour gérer toutes les données liées aux menus
 * Fetch UNE SEULE FOIS les données (restaurant, catégories, plats)
 * Évite les appels API redondants entre les différents tabs
 */
export const useMenuData = (): UseMenuDataReturn => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isFetchingRef = useRef(false);

  const fetchAll = useCallback(async () => {
    // Prevent multiple simultaneous calls
    if (isFetchingRef.current) {
      console.log('Already fetching menu data, skipping...');
      return;
    }

    try {
      isFetchingRef.current = true;
      setIsLoading(true);
      setError(null);

      // Fetch toutes les données en parallèle (1 seul appel)
      const [restaurantRes, categoriesRes, dishesRes] = await Promise.all([
        apiClient.getMyRestaurant(),
        apiClient.getCategories(),
        apiClient.getDishes(),
      ]);

      setRestaurant(restaurantRes.restaurant);
      setCategories(categoriesRes.categories);
      setDishes(dishesRes.dishes);
    } catch (err) {
      console.error('Error fetching menu data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement';
      setError(errorMessage);
      toast.error('Erreur lors du chargement des données du menu');
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  // Fetch au mount
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    restaurant,
    categories,
    dishes,
    isLoading,
    error,
    refetch: fetchAll,
  };
};
