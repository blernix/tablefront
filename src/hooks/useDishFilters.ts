import { useState, useMemo } from 'react';
import { Dish } from '@/types';
import { getDishCategoryId } from '@/lib/menu-helpers';

type AvailabilityFilter = 'all' | 'available' | 'unavailable';

interface UseDishFiltersReturn {
  filteredDishes: Dish[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  availabilityFilter: AvailabilityFilter;
  setAvailabilityFilter: (filter: AvailabilityFilter) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

/**
 * Hook pour gérer les filtres et la recherche des plats
 * Inspiré de useReservationsFilters pour la cohérence
 */
export const useDishFilters = (dishes: Dish[]): UseDishFiltersReturn => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<AvailabilityFilter>('all');

  // Filtrage des plats (memoized pour performance)
  const filteredDishes = useMemo(() => {
    return dishes.filter((dish) => {
      // Filtre par recherche (nom ou description)
      const matchesSearch =
        searchQuery === '' ||
        dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.description?.toLowerCase().includes(searchQuery.toLowerCase());

      // Filtre par catégorie
      const dishCategoryId = getDishCategoryId(dish);
      const matchesCategory =
        categoryFilter === 'all' ||
        (categoryFilter === 'none' && dishCategoryId === null) ||
        (categoryFilter !== 'all' &&
          categoryFilter !== 'none' &&
          dishCategoryId !== null &&
          dishCategoryId === categoryFilter);

      // Filtre par disponibilité
      const matchesAvailability =
        availabilityFilter === 'all' ||
        (availabilityFilter === 'available' && dish.available) ||
        (availabilityFilter === 'unavailable' && !dish.available);

      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [dishes, searchQuery, categoryFilter, availabilityFilter]);

  // Réinitialiser tous les filtres
  const clearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setAvailabilityFilter('all');
  };

  // Vérifier si des filtres sont actifs
  const hasActiveFilters =
    searchQuery !== '' || categoryFilter !== 'all' || availabilityFilter !== 'all';

  return {
    filteredDishes,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    availabilityFilter,
    setAvailabilityFilter,
    clearFilters,
    hasActiveFilters,
  };
};
