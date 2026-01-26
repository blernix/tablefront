'use client';

import { useState, useRef, useEffect } from 'react';
import { Plus, Edit2, Trash2, Folder, X, Check, GripVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MenuCategory, Dish } from '@/types';
import { countDishesInCategory } from '@/lib/menu-helpers';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api';

interface CategoriesSidebarProps {
  categories: MenuCategory[];
  dishes: Dish[];
  orphanedDishesCount: number;
  onCategoryFilterChange: (categoryId: string) => void;
  onRefetch: () => void;
}

/**
 * Sidebar de gestion des catégories
 * Permet de créer, modifier, supprimer et réordonner les catégories
 */
export function CategoriesSidebar({
  categories,
  dishes,
  orphanedDishesCount,
  onCategoryFilterChange,
  onRefetch,
}: CategoriesSidebarProps) {
  // Category management state
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [draggingCategoryId, setDraggingCategoryId] = useState<string | null>(null);
  const [dragOverCategoryId, setDragOverCategoryId] = useState<string | null>(null);
  const [localCategories, setLocalCategories] = useState(categories);
  const editCategoryInputRef = useRef<HTMLInputElement>(null);

  // Sync local categories with props
  useEffect(() => {
    setLocalCategories(categories);
  }, [categories]);

  // Focus edit input when editing
  useEffect(() => {
    if (editingCategoryId && editCategoryInputRef.current) {
      editCategoryInputRef.current.focus();
      editCategoryInputRef.current.select();
    }
  }, [editingCategoryId]);

  // Category CRUD functions
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
      onRefetch();
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
      onRefetch();
      toast.success('Catégorie modifiée');
    } catch (err) {
      setCategoryError(err instanceof Error ? err.message : 'Erreur lors de la modification');
      toast.error('Erreur lors de la modification');
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Supprimer la catégorie "${name}" ?`)) return;

    try {
      await apiClient.deleteCategory(id);
      toast.success(`Catégorie "${name}" supprimée`);
      onRefetch();
    } catch (err) {
      toast.error('Erreur lors de la suppression');
    }
  };

  // Drag & Drop functions
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

    const draggedIndex = localCategories.findIndex((c) => c._id === draggingCategoryId);
    const targetIndex = localCategories.findIndex((c) => c._id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newOrder = [...localCategories];
    const [draggedItem] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedItem);

    // Optimistic update
    setLocalCategories(newOrder);

    try {
      await apiClient.reorderCategories(newOrder.map((c) => c._id));
      toast.success('Ordre des catégories mis à jour');
      onRefetch();
    } catch (err) {
      toast.error('Erreur lors du réordonnancement');
      onRefetch(); // Reload to get correct order
    }
  };

  const handleDragEndCategory = () => {
    setDraggingCategoryId(null);
    setDragOverCategoryId(null);
  };

  return (
    <div className="space-y-6">
      {/* Categories Management Card */}
      <Card className="p-6">
        <CardHeader className="pb-4 p-0">
          <CardTitle className="text-lg font-light text-[#2A2A2A]">Catégories</CardTitle>
          <CardDescription className="text-[#666666] mt-1">Organisez vos plats par sections</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 p-0 pt-4">
          {/* Create Category Form */}
          <div className="space-y-2">
            <Label htmlFor="categoryName" className="text-sm">
              Nouvelle catégorie
            </Label>
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
              >
                {isCreatingCategory ? '...' : <Plus className="h-4 w-4" />}
              </Button>
            </div>
            {categoryError && <p className="text-sm text-red-600">{categoryError}</p>}
          </div>

          {/* Categories List */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {localCategories.map((category) => {
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
                  className={`relative group ${isDragging ? 'opacity-50' : ''}`}
                >
                  <div
                    className={`flex items-center gap-3 p-4 border border-[#E5E5E5] ${isDragOver ? 'border-[#0066FF]' : ''} hover:bg-[#FAFAFA] transition-colors`}
                  >
                    {/* Drag handle */}
                    <div
                      className="cursor-grab active:cursor-grabbing text-[#666666] hover:text-[#0066FF] flex-shrink-0"
                      role="button"
                      tabIndex={0}
                    >
                      <GripVertical className="h-5 w-5" />
                    </div>

                    {/* Category info */}
                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <div>
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
                        <div>
                          <p className="font-medium text-[#2A2A2A] text-base mb-1">{category.name}</p>
                          <p className="text-xs text-[#666666] uppercase tracking-[0.1em]">
                            {dishCount} plat{dishCount !== 1 ? 's' : ''}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {isEditing ? (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCancelEditCategory}
                            className="h-8 w-8 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSaveEditCategory(category._id)}
                            className="h-8 w-8 p-0"
                          >
                            <Check className="h-4 w-4 text-emerald-500" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStartEditCategory(category)}
                            className="h-8 w-8 p-0 text-[#666666] hover:text-[#0066FF]"
                            title="Modifier"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCategory(category._id, category.name)}
                            className="h-8 w-8 p-0 text-[#666666] hover:text-red-600"
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Drag overlay */}
                  {isDragOver && !isDragging && (
                    <div className="absolute inset-0 border-2 border-dashed border-[#0066FF] bg-[#FAFAFA] pointer-events-none" />
                  )}
                </div>
              );
            })}

            {localCategories.length === 0 && (
              <div className="text-center py-12">
                <div className="h-16 w-16 border border-[#E5E5E5] flex items-center justify-center mx-auto mb-4">
                  <Folder className="h-8 w-8 text-[#666666]" />
                </div>
                <p className="text-[#2A2A2A] font-medium text-base">Aucune catégorie</p>
                <p className="text-sm text-[#666666] mt-2 font-light">
                  Créez votre première catégorie pour organiser vos plats
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Orphaned Dishes Warning */}
      {orphanedDishesCount > 0 && (
        <Card className="border-amber-600 bg-[#FAFAFA] p-5">
          <CardContent className="p-0">
            <h3 className="font-medium text-amber-600 mb-3 uppercase tracking-[0.1em] text-xs">
              Plats sans catégorie
            </h3>
            <p className="text-sm text-[#666666] mb-4 font-light leading-relaxed">
              {orphanedDishesCount} plat{orphanedDishesCount !== 1 ? 's' : ''} n&apos;
              {orphanedDishesCount > 1 ? 'ont' : 'a'} pas de catégorie. Ils ne sont pas visibles
              dans les sections du menu.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full border-amber-600 text-amber-600 hover:bg-[#FAFAFA] h-9"
              onClick={() => onCategoryFilterChange('none')}
            >
              Voir les plats sans catégorie
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <Card className="p-6">
        <CardContent className="p-0">
          <h3 className="text-xs font-medium text-[#666666] mb-4 uppercase tracking-[0.2em]">
            Statistiques
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#666666]">Total plats</span>
              <span className="font-medium text-[#2A2A2A] text-base">{dishes.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#666666]">Disponibles</span>
              <span className="font-medium text-emerald-600 text-base">
                {dishes.filter((d) => d.available).length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#666666]">Catégories</span>
              <span className="font-medium text-[#2A2A2A] text-base">{localCategories.length}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
