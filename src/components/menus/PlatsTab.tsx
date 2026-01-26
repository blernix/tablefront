'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMenuData } from '@/hooks/useMenuData';
import { useDishFilters } from '@/hooks/useDishFilters';
import { useMenuStats } from '@/hooks/useMenuStats';
import { CategoriesSidebar } from './CategoriesSidebar';
import { DishFilters } from './DishFilters';
import { DishesGrid } from './DishesGrid';
import DishFormModal from '@/components/menu/DishFormModal';
import DeleteConfirmModal from '@/components/modals/DeleteConfirmModal';
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';
import type { Dish } from '@/types';

/**
 * Onglet de gestion des plats
 * Refactorisé en composants atomiques réutilisables
 */
export default function PlatsTab() {
  // Data hooks (centralized API calls)
  const { restaurant, categories, dishes, isLoading, refetch } = useMenuData();

  // Filter hooks
  const {
    filteredDishes,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    availabilityFilter,
    setAvailabilityFilter,
    clearFilters,
    hasActiveFilters,
  } = useDishFilters(dishes);

  // Stats hooks
  const stats = useMenuStats(dishes, categories, restaurant);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

  // Delete confirmation hooks
  const {
    isOpen: isDeleteDishModalOpen,
    itemToDelete: dishToDelete,
    isDeleting: isDeletingDish,
    openDeleteModal: openDeleteDishModal,
    closeDeleteModal: closeDeleteDishModal,
    confirmDelete: confirmDeleteDish,
  } = useDeleteConfirm({
    onDelete: async (id) => {
      await apiClient.deleteDish(id);
      toast.success('Plat supprimé');
      refetch();
    },
  });

  // Dish management functions
  const handleStartCreateDish = (categoryId?: string) => {
    setSelectedDish(null);
    setSelectedCategoryId(categoryId || '');
    setIsModalOpen(true);
  };

  const handleStartEditDish = (dish: Dish) => {
    setSelectedDish(dish);
    setSelectedCategoryId('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDish(null);
    setSelectedCategoryId('');
  };

  const handleDeleteDish = (id: string, name: string) => {
    openDeleteDishModal({ id, name });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-16 bg-[#E5E5E5]" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 h-96 bg-[#E5E5E5]" />
          <div className="lg:col-span-2 h-96 bg-[#E5E5E5]" />
        </div>
      </div>
    );
  }

  const selectedCategory = categories.find((c) => c._id === categoryFilter);

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-[#0066FF]" />
        <div className="pt-4">
          <h1 className="text-2xl font-light text-[#2A2A2A]">Gestion des plats</h1>
          <p className="text-[#666666] mt-1 font-light">
            {categoryFilter !== 'all' && selectedCategory
              ? `Plats de la catégorie "${selectedCategory.name}"`
              : 'Créez et gérez tous vos plats'}
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => handleStartCreateDish()}
          className="mt-4 sm:mt-0"
        >
          <Plus className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Ajouter un plat</span>
        </Button>
      </div>

      {/* Filters Bar */}
      <DishFilters
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        availabilityFilter={availabilityFilter}
        onAvailabilityFilterChange={setAvailabilityFilter}
        categories={categories}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
      />

      {/* Main Content - Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Categories Management */}
        <div className="lg:col-span-1">
          <CategoriesSidebar
            categories={categories}
            dishes={dishes}
            orphanedDishesCount={stats.orphanedDishesCount}
            onCategoryFilterChange={setCategoryFilter}
            onRefetch={refetch}
          />
        </div>

        {/* Right Column - Dishes Management */}
        <div className="lg:col-span-2">
          <DishesGrid
            dishes={filteredDishes}
            categories={categories}
            categoryFilter={categoryFilter}
            hasActiveFilters={hasActiveFilters}
            onCreateDish={handleStartCreateDish}
            onEditDish={handleStartEditDish}
            onDeleteDish={handleDeleteDish}
            onClearFilters={clearFilters}
          />
        </div>
      </div>

      {/* Mobile Floating Action Button */}
      <button
        onClick={() => handleStartCreateDish()}
        className="fixed bottom-20 right-6 md:hidden h-14 w-14 border-2 border-[#0066FF] bg-[#0066FF] hover:bg-white text-white hover:text-[#0066FF] transition-colors flex items-center justify-center z-50"
        aria-label="Ajouter un plat"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Dish Form Modal */}
      <DishFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        dish={selectedDish}
        categories={categories}
        onSuccess={refetch}
        initialCategoryId={selectedCategoryId}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteDishModalOpen}
        onClose={closeDeleteDishModal}
        onConfirm={confirmDeleteDish}
        title="Supprimer le plat"
        itemName={dishToDelete?.name}
        isLoading={isDeletingDish}
      />
    </div>
  );
}
