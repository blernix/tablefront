'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api';
import { Dish, MenuCategory } from '@/types';
import { getDishCategoryId, countDishesInCategory, filterDishesByCategory, getOrphanedDishes } from '@/lib/menu-helpers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm';
import {
  Plus,
  Search,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  UtensilsCrossed,
  Folder,
  Filter,
  X,
  ChevronDown,
  ChevronRight,
  GripVertical,
  Save,
  Check,
  ArrowLeft
} from 'lucide-react';
import Image from 'next/image';
import DishFormModal from '@/components/menu/DishFormModal';
import DeleteConfirmModal from '@/components/modals/DeleteConfirmModal';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

export default function PlatsTab() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get('category');

  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>(categoryFromUrl || 'all');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'unavailable'>('all');

  // Category management state
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [draggingCategoryId, setDraggingCategoryId] = useState<string | null>(null);
  const [dragOverCategoryId, setDragOverCategoryId] = useState<string | null>(null);
  const editCategoryInputRef = useRef<HTMLInputElement>(null);
  const isFetchingRef = useRef(false); // Prevent multiple simultaneous calls

  // Delete confirmation hooks
  const { isOpen: isDeleteDishModalOpen, itemToDelete: dishToDelete, isDeleting: isDeletingDish, openDeleteModal: openDeleteDishModal, closeDeleteModal: closeDeleteDishModal, confirmDelete: confirmDeleteDish } = useDeleteConfirm({
    onDelete: async (id) => {
      await apiClient.deleteDish(id);
      toast.success('Plat supprimé');
      fetchData();
    },
  });

  const { isOpen: isDeleteCategoryModalOpen, itemToDelete: categoryToDelete, isDeleting: isDeletingCategory, openDeleteModal: openDeleteCategoryModal, closeDeleteModal: closeDeleteCategoryModal, confirmDelete: confirmDeleteCategory } = useDeleteConfirm({
    onDelete: async (id) => {
      await apiClient.deleteCategory(id);
      const category = categories.find(c => c._id === id);
      if (category) {
        toast.success(`Catégorie "${category.name}" supprimée`);
      }
      fetchData();
    },
  });

  const fetchData = async () => {
    // Prevent multiple simultaneous calls
    if (isFetchingRef.current) {
      console.log('Already fetching dishes data, skipping...');
      return;
    }

    try {
      isFetchingRef.current = true;
      setIsLoading(true);
      const [categoriesRes, dishesRes] = await Promise.all([
        apiClient.getCategories(),
        apiClient.getDishes()
      ]);
      setCategories(categoriesRes.categories);
      setDishes(dishesRes.dishes);
    } catch (err) {
      console.error('Error fetching data:', err);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  useEffect(() => {
    // Auto-expand filtered category or all categories
    if (categories.length > 0 && expandedCategories.length === 0) {
      if (selectedCategoryFilter !== 'all') {
        setExpandedCategories([selectedCategoryFilter]);
      } else {
        setExpandedCategories(categories.map(c => c._id));
      }
    }
  }, [categories, selectedCategoryFilter, expandedCategories.length]);

  useEffect(() => {
    if (editingCategoryId && editCategoryInputRef.current) {
      editCategoryInputRef.current.focus();
      editCategoryInputRef.current.select();
    }
  }, [editingCategoryId]);

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

  const handleToggleAvailability = async (id: string, name: string) => {
    try {
      await apiClient.toggleDishAvailability(id);
      toast.success(`Disponibilité de "${name}" modifiée`);
      fetchData();
    } catch (err) {
      toast.error('Erreur lors du changement de disponibilité');
    }
  };

  const handleDeleteDish = (id: string, name: string) => {
    openDeleteDishModal({ id, name });
  };

  const toggleCategory = (categoryId: string) => {
    if (categoryId === 'none') return;
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategoryFilter('all');
    setAvailabilityFilter('all');
  };

  // Category management functions
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      setCategoryError('Le nom de la catégorie est requis');
      return;
    }

    try {
      setIsCreatingCategory(true);
      setCategoryError('');
      await apiClient.createCategory({ name: newCategoryName.trim() });
      setNewCategoryName('');
      fetchData();
      toast.success(`Catégorie "${newCategoryName.trim()}" créée`);
    } catch (err) {
      setCategoryError(err instanceof Error ? err.message : 'Erreur lors de la création');
      toast.error('Erreur lors de la création');
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const handleStartEditCategory = (category: MenuCategory) => {
    setEditingCategoryId(category._id);
    setEditCategoryName(category.name);
    setCategoryError('');
  };

  const handleCancelEditCategory = () => {
    setEditingCategoryId(null);
    setEditCategoryName('');
    setCategoryError('');
  };

  const handleSaveEditCategory = async (id: string) => {
    if (!editCategoryName.trim()) {
      setCategoryError('Le nom de la catégorie est requis');
      return;
    }

    try {
      setCategoryError('');
      await apiClient.updateCategory(id, { name: editCategoryName.trim() });
      setEditingCategoryId(null);
      setEditCategoryName('');
      fetchData();
      toast.success('Catégorie modifiée');
    } catch (err) {
      setCategoryError(err instanceof Error ? err.message : 'Erreur lors de la modification');
      toast.error('Erreur lors de la modification');
    }
  };

  const handleDeleteCategory = (id: string, name: string) => {
    openDeleteCategoryModal({ id, name });
  };

  const handleDragStartCategory = (id: string) => {
    setDraggingCategoryId(id);
  };

  const handleDragOverCategory = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    setDragOverCategoryId(id);
  };

  const handleDragLeaveCategory = () => {
    setDragOverCategoryId(null);
  };

  const handleDropCategory = async (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    setDragOverCategoryId(null);
    
    if (!draggingCategoryId || draggingCategoryId === targetId) return;

    const draggedIndex = categories.findIndex(c => c._id === draggingCategoryId);
    const targetIndex = categories.findIndex(c => c._id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newOrder = [...categories];
    const [draggedItem] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedItem);

    try {
      await apiClient.reorderCategories(newOrder.map(c => c._id));
      setCategories(newOrder);
      toast.success('Ordre des catégories mis à jour');
    } catch (err) {
      toast.error('Erreur lors du réordonnancement');
      fetchData(); // Reload to get correct order
    }
  };

  const handleDragEndCategory = () => {
    setDraggingCategoryId(null);
    setDragOverCategoryId(null);
  };

  // Filter dishes
  const filteredDishes = dishes.filter(dish => {
    const matchesSearch = searchQuery === '' ||
      dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const dishCategoryId = getDishCategoryId(dish);
    const matchesCategory = selectedCategoryFilter === 'all' ||
      (selectedCategoryFilter === 'none' && dishCategoryId === null) ||
      (selectedCategoryFilter !== 'all' && selectedCategoryFilter !== 'none' && dishCategoryId !== null && dishCategoryId === selectedCategoryFilter);

    const matchesAvailability = availabilityFilter === 'all' ||
      (availabilityFilter === 'available' && dish.available) ||
      (availabilityFilter === 'unavailable' && !dish.available);

    return matchesSearch && matchesCategory && matchesAvailability;
  });
  const orphanedDishesCount = getOrphanedDishes(dishes).length;

  // Group dishes by category
  const dishesByCategory = categories.map(category => ({
    category,
    dishes: filterDishesByCategory(filteredDishes, category._id)
  })).filter(group => group.dishes.length > 0 || selectedCategoryFilter === 'all');

  const orphanedDishesInView = filteredDishes.filter(dish => getDishCategoryId(dish) === null);
  const dishesByCategoryWithOrphans = [...dishesByCategory];
  if (orphanedDishesInView.length > 0 && (selectedCategoryFilter === 'all' || selectedCategoryFilter === 'none')) {
    dishesByCategoryWithOrphans.push({
      category: {
        _id: 'none',
        name: 'Sans catégorie',
        restaurantId: '',
        displayOrder: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as MenuCategory,
      dishes: orphanedDishesInView
    });
  }

  const hasActiveFilters = searchQuery !== '' || selectedCategoryFilter !== 'all' || availabilityFilter !== 'all';
  const selectedCategory = categories.find(c => c._id === selectedCategoryFilter);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-16 bg-stone-100 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 h-96 bg-stone-100 rounded-xl" />
          <div className="lg:col-span-2 h-96 bg-stone-100 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestion des plats</h1>
          <p className="text-slate-600 mt-1">
            {selectedCategoryFilter !== 'all' && selectedCategory
              ? `Plats de la catégorie "${selectedCategory.name}"`
              : 'Créez et gérez tous vos plats'}
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => handleStartCreateDish()}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          <Plus className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Ajouter un plat</span>
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="bg-stone-50/95 backdrop-blur-md border border-slate-200 rounded-xl p-4">
        <div className="space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="search"
              placeholder="Rechercher un plat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-sm text-slate-600">
              <Filter className="h-4 w-4" />
              <span className="font-medium">Filtres:</span>
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="text-sm px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:border-orange-300 transition-colors"
            >
              <option value="all">Toutes les catégories</option>
              <option value="none">Sans catégorie</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Availability Filter */}
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value as any)}
              className="text-sm px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:border-orange-300 transition-colors"
            >
              <option value="all">Tous</option>
              <option value="available">Disponibles</option>
              <option value="unavailable">Indisponibles</option>
            </select>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs text-slate-600 hover:text-orange-600"
              >
                <X className="h-3 w-3 mr-1" />
                Effacer
              </Button>
            )}

            {/* Results Count */}
            <div className="ml-auto text-sm text-slate-600 font-medium">
              {filteredDishes.length} plat{filteredDishes.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Categories Management */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Catégories</CardTitle>
              <CardDescription>
                Organisez vos plats par sections
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Create Category Form */}
              <div className="space-y-2">
                <Label htmlFor="categoryName" className="text-sm">Nouvelle catégorie</Label>
                <div className="flex gap-2">
                  <Input
                    id="categoryName"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Ex: Entrées"
                    disabled={isCreatingCategory}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCreateCategory();
                    }}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleCreateCategory}
                    disabled={isCreatingCategory || !newCategoryName.trim()}
                    size="sm"
                    className="bg-slate-900 hover:bg-slate-800"
                  >
                    {isCreatingCategory ? '...' : '+'}
                  </Button>
                </div>
                {categoryError && (
                  <p className="text-sm text-red-600">{categoryError}</p>
                )}
              </div>

              {/* Categories List */}
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                {categories.map((category) => {
                  const isEditing = editingCategoryId === category._id;
                  const isDragging = draggingCategoryId === category._id;
                  const isDragOver = dragOverCategoryId === category._id;
                  const dishCount = countDishesInCategory(dishes, category._id);

                  return (
                    <div
                      key={category._id}
                      draggable
                      onDragStart={() => handleDragStartCategory(category._id)}
                      onDragOver={(e) => handleDragOverCategory(e, category._id)}
                      onDragLeave={handleDragLeaveCategory}
                      onDrop={(e) => handleDropCategory(e, category._id)}
                      onDragEnd={handleDragEndCategory}
                      className={`
                        relative group
                        ${isDragging ? 'opacity-50' : ''}
                        ${isDragOver ? 'ring-2 ring-slate-900 ring-inset' : ''}
                      `}
                    >
                      <div className={`
                        flex items-center justify-between p-3 rounded-lg border border-slate-200
                        ${isDragOver ? 'border-slate-900' : ''}
                        hover:bg-slate-50 transition-all
                      `}>
                        {/* Drag handle */}
                        <div 
                          className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 mr-2"
                          role="button"
                          tabIndex={0}
                        >
                          <GripVertical className="h-4 w-4" />
                        </div>

                        {/* Category info */}
                        <div className="flex-1 min-w-0">
                          {isEditing ? (
                            <div className="space-y-1">
                              <Input
                                ref={editCategoryInputRef}
                                value={editCategoryName}
                                onChange={(e) => setEditCategoryName(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSaveEditCategory(category._id);
                                  if (e.key === 'Escape') handleCancelEditCategory();
                                }}
                                className="text-sm"
                              />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-slate-900 truncate">{category.name}</p>
                                <p className="text-xs text-slate-600">
                                  {dishCount} plat{dishCount !== 1 ? 's' : ''}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 ml-2">
                          {isEditing ? (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCancelEditCategory}
                                className="h-6 w-6 p-0"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSaveEditCategory(category._id)}
                                className="h-6 w-6 p-0"
                              >
                                <Check className="h-3 w-3 text-green-600" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleStartEditCategory(category)}
                                className="h-6 w-6 p-0 text-slate-600 hover:text-slate-900"
                                title="Modifier"
                              >
                                <Edit2 className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteCategory(category._id, category.name)}
                                className="h-6 w-6 p-0 text-slate-600 hover:text-red-600"
                                title="Supprimer"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Drag overlay */}
                      {isDragOver && !isDragging && (
                        <div className="absolute inset-0 border-2 border-dashed border-slate-900 rounded-lg bg-slate-50/20 pointer-events-none" />
                      )}
                    </div>
                  );
                })}

                {categories.length === 0 && (
                  <div className="text-center py-8">
                    <Folder className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-600">Aucune catégorie</p>
                    <p className="text-sm text-slate-500 mt-1">
                      Créez votre première catégorie pour organiser vos plats
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {orphanedDishesCount > 0 && (
            <Card className="border-amber-200 bg-amber-50 shadow-sm">
              <CardContent className="p-4">
                <h3 className="font-semibold text-amber-900 mb-2">Plats sans catégorie</h3>
                <p className="text-sm text-amber-800 mb-3">
                  {orphanedDishesCount} plat{orphanedDishesCount !== 1 ? 's' : ''} n&apos;{orphanedDishesCount > 1 ? 'ont' : 'a'} pas de catégorie.
                  Ils ne sont pas visibles dans les sections du menu.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-amber-300 text-amber-700 hover:bg-amber-100"
                  onClick={() => setSelectedCategoryFilter('all')}
                >
                  Voir les plats sans catégorie
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4">
              <h3 className="font-semibold text-slate-900 mb-3">Statistiques</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Total plats</span>
                  <span className="font-semibold">{dishes.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Disponibles</span>
                  <span className="font-semibold text-green-600">
                    {dishes.filter(d => d.available).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Catégories</span>
                  <span className="font-semibold">{categories.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Dishes Management */}
        <div className="lg:col-span-2">
          {categories.length === 0 ? (
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="py-16 text-center">
                <div className="flex flex-col items-center justify-center max-w-md mx-auto">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 mb-6">
                    <Folder className="h-10 w-10 text-orange-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    Créez d&apos;abord une catégorie
                  </h3>
                  <p className="text-slate-600 mb-8">
                    Vous devez avoir au moins une catégorie pour ajouter des plats
                  </p>
                  <Button
                    onClick={() => {
                      const categoryInput = document.getElementById('categoryName');
                      if (categoryInput) categoryInput.focus();
                    }}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Créer une catégorie
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : filteredDishes.length === 0 ? (
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="py-16 text-center">
                <div className="flex flex-col items-center justify-center max-w-md mx-auto">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 mb-6">
                    <UtensilsCrossed className="h-10 w-10 text-orange-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    {hasActiveFilters ? 'Aucun plat trouvé' : 'Aucun plat'}
                  </h3>
                  <p className="text-slate-600 mb-8">
                    {hasActiveFilters
                      ? 'Essayez de modifier vos filtres de recherche'
                      : 'Commencez par ajouter votre premier plat'
                    }
                  </p>
                  {hasActiveFilters ? (
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="border-orange-200 text-orange-600 hover:bg-orange-50"
                    >
                      Effacer les filtres
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleStartCreateDish()}
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Ajouter un plat
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* List View */}
              <div className="space-y-2">
                {dishesByCategoryWithOrphans.map(({ category, dishes: categoryDishes }) => (
                  <Collapsible
                    key={category._id}
                    open={category._id === 'none' ? true : expandedCategories.includes(category._id)}
                    onOpenChange={category._id === 'none' ? undefined : () => toggleCategory(category._id)}
                  >
                      <Card className="border-slate-200 shadow-sm">
                        <CollapsibleTrigger asChild>
                          <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50">
                            <div className="flex items-center gap-3">
                              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${category._id === 'none' ? 'bg-slate-100 text-slate-600' : 'bg-amber-100 text-amber-600'}`}>
                                <Folder className="h-5 w-5" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-slate-900">
                                  {category.name}
                                </h3>
                                <p className="text-sm text-slate-600">
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
                                  handleStartCreateDish(category._id);
                                }}
                                className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Ajouter
                              </Button>
                            )}
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <CardContent className="pt-0">
                            <div className="space-y-2">
                              {categoryDishes.map((dish) => (
                                <div
                                  key={dish._id}
                                  className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 group"
                                >
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0">
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
                                      {!dish.available && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                          <EyeOff className="h-4 w-4 text-white" />
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-medium text-slate-900 truncate">
                                        {dish.name}
                                      </h4>
                                      <p className="text-sm text-slate-600 truncate">
                                        {dish.description || 'Aucune description'}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-orange-500 tabular-nums">
                                      {dish.price.toFixed(2)} €
                                    </span>
                                    <div className="flex gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleStartEditDish(dish)}
                                        className="h-8 w-8 p-0"
                                        title="Modifier"
                                      >
                                        <Edit2 className="h-3.5 w-3.5" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleDeleteDish(dish._id, dish.name)}
                                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                        title="Supprimer"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </CollapsibleContent>
                      </Card>
                    </Collapsible>
                  ))}
                </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Floating Action Button */}
      <button
        onClick={() => handleStartCreateDish()}
        className="fixed bottom-20 right-6 md:hidden h-14 w-14 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg flex items-center justify-center z-50"
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
        onSuccess={fetchData}
        initialCategoryId={selectedCategoryId}
      />

      {/* Delete Confirmation Modals */}
      <DeleteConfirmModal
        isOpen={isDeleteDishModalOpen}
        onClose={closeDeleteDishModal}
        onConfirm={confirmDeleteDish}
        title="Supprimer le plat"
        itemName={dishToDelete?.name}
        isLoading={isDeletingDish}
      />

      <DeleteConfirmModal
        isOpen={isDeleteCategoryModalOpen}
        onClose={closeDeleteCategoryModal}
        onConfirm={confirmDeleteCategory}
        title="Supprimer la catégorie"
        description={
          categoryToDelete ? (() => {
            const count = countDishesInCategory(dishes, categoryToDelete.id);
            return count > 0 
              ? `Cette catégorie contient ${count} plat${count > 1 ? 's' : ''}. Les plats resteront sans catégorie.`
              : undefined;
          })() : undefined
        }
        itemName={categoryToDelete?.name}
        isLoading={isDeletingCategory}
      />
    </div>
  );
}