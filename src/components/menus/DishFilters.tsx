'use client';

import { Search, X, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MenuCategory } from '@/types';

type AvailabilityFilter = 'all' | 'available' | 'unavailable';

interface DishFiltersProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (category: string) => void;
  availabilityFilter: AvailabilityFilter;
  onAvailabilityFilterChange: (filter: AvailabilityFilter) => void;
  categories: MenuCategory[];
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

/**
 * Barre de filtres pour la recherche et le filtrage des plats
 * Permet de rechercher par nom/description, filtrer par catégorie et disponibilité
 */
export function DishFilters({
  searchQuery,
  onSearchQueryChange,
  categoryFilter,
  onCategoryFilterChange,
  availabilityFilter,
  onAvailabilityFilterChange,
  categories,
  hasActiveFilters,
  onClearFilters,
}: DishFiltersProps) {
  return (
    <div className="bg-white border border-[#E5E5E5] p-4">
      <div className="space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#666666]" />
          <Input
            type="search"
            placeholder="Rechercher un plat..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="pl-10 pr-10 bg-white"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchQueryChange('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#666666] hover:text-[#0066FF]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-[#666666] uppercase tracking-[0.2em]">
            <Filter className="h-4 w-4" />
            <span className="font-medium">Filtres</span>
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryFilterChange(e.target.value)}
            className="text-sm px-3 py-1.5 border border-[#E5E5E5] bg-white hover:border-[#0066FF] transition-colors"
          >
            <option value="all">Toutes les catégories</option>
            <option value="none">Sans catégorie</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>

          {/* Availability Filter */}
          <select
            value={availabilityFilter}
            onChange={(e) => onAvailabilityFilterChange(e.target.value as AvailabilityFilter)}
            className="text-sm px-3 py-1.5 border border-[#E5E5E5] bg-white hover:border-[#0066FF] transition-colors"
          >
            <option value="all">Tous</option>
            <option value="available">Disponibles</option>
            <option value="unavailable">Indisponibles</option>
          </select>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-xs text-[#666666] hover:text-[#0066FF]"
            >
              <X className="h-3 w-3 mr-1" />
              Effacer les filtres
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
