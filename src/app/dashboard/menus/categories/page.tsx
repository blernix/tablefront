'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { MenuCategory } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, Trash2, Edit2, ChevronUp, ChevronDown, Save, X } from 'lucide-react';

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getCategories();
      setCategories(response.categories);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newCategoryName.trim()) {
      setError('Le nom de la catégorie est requis');
      return;
    }

    try {
      setIsCreating(true);
      setError('');
      await apiClient.createCategory({ name: newCategoryName.trim() });
      setNewCategoryName('');
      setShowForm(false);
      fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création');
    } finally {
      setIsCreating(false);
    }
  };

  const handleStartEdit = (category: MenuCategory) => {
    setEditingId(category._id);
    setEditName(category.name);
    setError('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setError('');
  };

  const handleSaveEdit = async (id: string) => {
    if (!editName.trim()) {
      setError('Le nom de la catégorie est requis');
      return;
    }

    try {
      setError('');
      await apiClient.updateCategory(id, { name: editName.trim() });
      setEditingId(null);
      setEditName('');
      fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la modification');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Supprimer la catégorie "${name}" ?`)) return;

    try {
      await apiClient.deleteCategory(id);
      fetchCategories();
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;

    const newOrder = [...categories];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];

    try {
      await apiClient.reorderCategories(newOrder.map(c => c._id));
      setCategories(newOrder);
    } catch (err) {
      alert('Erreur lors du réordonnancement');
      fetchCategories(); // Reload to get correct order
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index === categories.length - 1) return;

    const newOrder = [...categories];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];

    try {
      await apiClient.reorderCategories(newOrder.map(c => c._id));
      setCategories(newOrder);
    } catch (err) {
      alert('Erreur lors du réordonnancement');
      fetchCategories(); // Reload to get correct order
    }
  };

  if (isLoading) {
    return <div className="text-muted-foreground">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/dashboard/menus')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Catégories du menu</h1>
          <p className="mt-2 text-gray-600">
            Organisez votre menu en catégories
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une catégorie
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Nouvelle catégorie</CardTitle>
            <CardDescription>Ajoutez une catégorie à votre menu</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="categoryName">Nom de la catégorie</Label>
              <Input
                id="categoryName"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Ex: Entrées, Plats, Desserts..."
                disabled={isCreating}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreate();
                  if (e.key === 'Escape') {
                    setShowForm(false);
                    setNewCategoryName('');
                    setError('');
                  }
                }}
              />
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setNewCategoryName('');
                  setError('');
                }}
                disabled={isCreating}
              >
                Annuler
              </Button>
              <Button onClick={handleCreate} disabled={isCreating}>
                {isCreating ? 'Création...' : 'Créer la catégorie'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Liste des catégories</CardTitle>
          <CardDescription>
            {categories.length} catégorie{categories.length > 1 ? 's' : ''} enregistrée{categories.length > 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              Aucune catégorie. Créez votre première catégorie pour commencer.
            </p>
          ) : (
            <div className="space-y-2">
              {categories.map((category, index) => (
                <div
                  key={category._id}
                  className="flex items-center gap-3 border rounded-lg p-4"
                >
                  {/* Reorder buttons */}
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="h-6 w-6 p-0"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMoveDown(index)}
                      disabled={index === categories.length - 1}
                      className="h-6 w-6 p-0"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Category name */}
                  <div className="flex-1">
                    {editingId === category._id ? (
                      <div className="space-y-2">
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEdit(category._id);
                            if (e.key === 'Escape') handleCancelEdit();
                          }}
                          autoFocus
                        />
                        {error && (
                          <p className="text-sm text-destructive">{error}</p>
                        )}
                      </div>
                    ) : (
                      <p className="font-medium">{category.name}</p>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    {editingId === category._id ? (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCancelEdit}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSaveEdit(category._id)}
                        >
                          <Save className="h-4 w-4 text-green-600" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStartEdit(category)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(category._id, category.name)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>À propos des catégories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-600">
          <p>
            • Les catégories permettent d&apos;organiser votre menu en sections (Entrées, Plats, Desserts, etc.)
          </p>
          <p>
            • Utilisez les flèches pour réorganiser l&apos;ordre d&apos;affichage des catégories
          </p>
          <p>
            • Chaque catégorie peut contenir plusieurs plats que vous pourrez gérer ensuite
          </p>
          <p>
            • Les catégories sont uniquement disponibles en mode menu détaillé
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
