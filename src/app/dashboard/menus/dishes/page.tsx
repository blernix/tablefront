'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api';
import { Dish, MenuCategory, DishVariation } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Plus, Trash2, Edit2, X, Check, Folder, FolderEdit, ImageIcon } from 'lucide-react';
import ImageUpload from '@/components/ui/image-upload';
import Image from 'next/image';

const formSchema = z.object({
  categoryId: z.string().min(1, 'La catégorie est requise'),
  name: z.string().min(1, 'Le nom est requis'),
  description: z.string().optional(),
  price: z.string().min(1, 'Le prix est requis'),
  allergens: z.string().optional(),
  available: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

export default function DishesPage() {
  const router = useRouter();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prefilledCategoryId, setPrefilledCategoryId] = useState<string>('');

  // Variations state
  const [hasVariations, setHasVariations] = useState(false);
  const [variations, setVariations] = useState<DishVariation[]>([]);
  const [variationName, setVariationName] = useState('');
  const [variationPrice, setVariationPrice] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      available: true,
    },
  });

  useEffect(() => {
    console.log('[DishesPage] useEffect running');
    fetchCategories();
    fetchDishes();
  }, []);

  const fetchCategories = async () => {
    try {
      console.log('[DishesPage] Fetching categories...');
      const response = await apiClient.getCategories();
      console.log('[DishesPage] Categories fetched:', response.categories.length);
      setCategories(response.categories);
    } catch (err) {
      console.error('[DishesPage] Error fetching categories:', err);
    }
  };

  const fetchDishes = async () => {
    try {
      setIsLoading(true);
      console.log('[DishesPage] Fetching dishes...');
      const response = await apiClient.getDishes();
      console.log('[DishesPage] Dishes fetched:', response.dishes.length);
      setDishes(response.dishes);
    } catch (err) {
      console.error('[DishesPage] Error fetching dishes:', err);
      toast.error('Erreur lors du chargement des plats');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartCreate = () => {
    setEditingDish(null);
    setPrefilledCategoryId('');
    setHasVariations(false);
    setVariations([]);
    setVariationName('');
    setVariationPrice('');
    reset({
      categoryId: '',
      name: '',
      description: '',
      price: '',
      allergens: '',
      available: true,
    });
    setShowForm(true);
  };

  const handleAddDishToCategory = (categoryId: string) => {
    setEditingDish(null);
    setPrefilledCategoryId(categoryId);
    setHasVariations(false);
    setVariations([]);
    setVariationName('');
    setVariationPrice('');
    reset({
      categoryId,
      name: '',
      description: '',
      price: '',
      allergens: '',
      available: true,
    });
    setShowForm(true);
  };

  const handleStartEdit = (dish: Dish) => {
    setEditingDish(dish);
    const categoryId = typeof dish.categoryId === 'string' ? dish.categoryId : dish.categoryId._id;

    // Load variations if present
    setHasVariations(dish.hasVariations || false);
    setVariations(dish.variations || []);
    setVariationName('');
    setVariationPrice('');

    reset({
      categoryId,
      name: dish.name,
      description: dish.description || '',
      price: dish.price.toString(),
      allergens: dish.allergens.join(', '),
      available: dish.available,
    });
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingDish(null);
    setHasVariations(false);
    setVariations([]);
    setVariationName('');
    setVariationPrice('');
    reset();
  };

  const handleAddVariation = () => {
    if (!variationName || !variationPrice) {
      toast.error('Nom et prix de la variation requis');
      return;
    }

    const price = parseFloat(variationPrice);
    if (isNaN(price) || price < 0) {
      toast.error('Le prix doit être un nombre positif');
      return;
    }

    setVariations([...variations, { name: variationName, price }]);
    setVariationName('');
    setVariationPrice('');
    toast.success('Variation ajoutée');
  };

  const handleRemoveVariation = (index: number) => {
    setVariations(variations.filter((_, i) => i !== index));
    toast.success('Variation supprimée');
  };

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);

      const price = parseFloat(data.price);
      if (isNaN(price) || price < 0) {
        toast.error('Le prix doit être un nombre positif');
        setIsSubmitting(false);
        return;
      }

      const allergens = data.allergens
        ? data.allergens.split(',').map(a => a.trim()).filter(a => a.length > 0)
        : [];

      // Validation: Si hasVariations est true, il faut au moins une variation
      if (hasVariations && variations.length === 0) {
        toast.error('Ajoutez au moins une variation ou désactivez les variations');
        setIsSubmitting(false);
        return;
      }

      const dishData = {
        categoryId: data.categoryId,
        name: data.name,
        description: data.description || '',
        price,
        hasVariations,
        variations: hasVariations ? variations : [],
        allergens,
        available: data.available,
      };

      if (editingDish) {
        await apiClient.updateDish(editingDish._id, dishData);
        toast.success(`Plat "${data.name}" modifié avec succès`);
      } else {
        await apiClient.createDish(dishData);
        toast.success(`Plat "${data.name}" créé avec succès`);
      }

      handleCancelForm();
      fetchDishes();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleAvailability = async (id: string, name: string) => {
    try {
      await apiClient.toggleDishAvailability(id);
      toast.success(`Disponibilité de "${name}" modifiée`);
      fetchDishes();
    } catch (err) {
      toast.error('Erreur lors du changement de disponibilité');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Supprimer le plat "${name}" ?`)) return;

    try {
      await apiClient.deleteDish(id);
      toast.success(`Plat "${name}" supprimé`);
      fetchDishes();
    } catch (err) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleUploadPhoto = async (file: File) => {
    if (!editingDish) return;

    try {
      const response = await apiClient.uploadDishPhoto(editingDish._id, file);
      toast.success('Photo ajoutée avec succès');

      // Update editing dish with new photo URL
      setEditingDish(response.dish);

      // Refresh dishes list
      fetchDishes();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de l\'upload');
    }
  };

  const handleDeletePhoto = async () => {
    if (!editingDish) return;

    try {
      const response = await apiClient.deleteDishPhoto(editingDish._id);
      toast.success('Photo supprimée avec succès');

      // Update editing dish without photo
      setEditingDish(response.dish);

      // Refresh dishes list
      fetchDishes();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    }
  };

  if (isLoading && !showForm) {
    return <div className="text-muted-foreground">Chargement...</div>;
  }

  if (categories.length === 0 && !isLoading) {
    return (
      <div className="space-y-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/dashboard/menus')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>Aucune catégorie</CardTitle>
            <CardDescription>
              Vous devez d&apos;abord créer des catégories avant d&apos;ajouter des plats
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/dashboard/menus/categories')}>
              Gérer les catégories
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header responsive */}
      <div className="space-y-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/dashboard/menus')}
          className="w-auto"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des plats</h1>
            <p className="mt-2 text-gray-600">
              Ajoutez et gérez les plats de votre menu
            </p>
          </div>
          {!showForm && (
            <Button onClick={handleStartCreate} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un plat
            </Button>
          )}
        </div>
      </div>


      {/* Create/Edit Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingDish ? 'Modifier le plat' : 'Nouveau plat'}</CardTitle>
            <CardDescription>
              {editingDish ? 'Modifiez les informations du plat' : 'Ajoutez un nouveau plat à votre menu'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom du plat *</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    placeholder="Ex: Salade César"
                    disabled={isSubmitting}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Prix (€) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    {...register('price')}
                    placeholder="12.50"
                    disabled={isSubmitting}
                  />
                  {errors.price && (
                    <p className="text-sm text-destructive">{errors.price.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoryId">Catégorie *</Label>
                <select
                  id="categoryId"
                  {...register('categoryId')}
                  disabled={isSubmitting}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="text-sm text-destructive">{errors.categoryId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Description du plat..."
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="allergens">Allergènes (séparés par des virgules)</Label>
                <Input
                  id="allergens"
                  {...register('allergens')}
                  placeholder="Ex: Gluten, Lactose, Fruits à coque"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground">
                  Séparez les allergènes par des virgules
                </p>
              </div>

              {/* Photo Section - Only in edit mode */}
              {editingDish && (
                <div className="space-y-2 border-t pt-4">
                  <Label>Photo du plat</Label>
                  <div className="max-w-xs">
                    <ImageUpload
                      currentImageUrl={editingDish.photoUrl}
                      onUpload={handleUploadPhoto}
                      onDelete={editingDish.photoUrl ? handleDeletePhoto : undefined}
                      disabled={isSubmitting}
                      aspectRatio="landscape"
                      maxSizeMB={5}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    La photo sera visible dans le menu détaillé
                  </p>
                </div>
              )}

              {/* Variations Section */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="hasVariations"
                    checked={hasVariations}
                    onChange={(e) => {
                      setHasVariations(e.target.checked);
                      if (!e.target.checked) {
                        setVariations([]);
                        setVariationName('');
                        setVariationPrice('');
                      }
                    }}
                    disabled={isSubmitting}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="hasVariations" className="cursor-pointer font-semibold">
                    Ce plat a des variations (tailles, portions)
                  </Label>
                </div>

                {hasVariations && (
                  <div className="space-y-3 ml-6 bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Exemple: &quot;5 pièces&quot;, &quot;Portion moyenne&quot;, &quot;Format XL&quot;
                    </p>

                    {/* Add variation form */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div className="md:col-span-2">
                        <Input
                          placeholder="Nom de la variation (ex: 5 pièces)"
                          value={variationName}
                          onChange={(e) => setVariationName(e.target.value)}
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Prix"
                          value={variationPrice}
                          onChange={(e) => setVariationPrice(e.target.value)}
                          disabled={isSubmitting}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleAddVariation}
                          disabled={isSubmitting}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Variations list */}
                    {variations.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Variations ajoutées:</Label>
                        {variations.map((variation, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-white border rounded p-2"
                          >
                            <div className="flex-1">
                              <span className="font-medium">{variation.name}</span>
                              <span className="ml-3 text-blue-600 font-semibold">
                                {variation.price.toFixed(2)} €
                              </span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveVariation(index)}
                              disabled={isSubmitting}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="available"
                  {...register('available')}
                  disabled={isSubmitting}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="available" className="cursor-pointer">
                  Disponible
                </Label>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelForm}
                  disabled={isSubmitting}
                >
                  <X className="mr-2 h-4 w-4" />
                  Annuler
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Enregistrement...' : editingDish ? 'Modifier' : 'Créer'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Hierarchical Categories & Dishes View */}
      {!showForm && (
        <div className="space-y-4">
          {categories.length === 0 ? (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">
                  Aucune catégorie. Créez une catégorie pour commencer.
                </p>
                <div className="flex justify-center mt-4">
                  <Button onClick={() => router.push('/dashboard/menus/categories')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Créer une catégorie
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {categories.map(category => {
                const categoryDishes = dishes.filter(dish => {
                  const dishCatId = typeof dish.categoryId === 'string' ? dish.categoryId : dish.categoryId._id;
                  return dishCatId === category._id;
                });

                return (
                  <Card key={category._id}>
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <Folder className="h-5 w-5 text-blue-600" />
                          <div>
                            <CardTitle>{category.name}</CardTitle>
                            <CardDescription>
                              {categoryDishes.length} plat{categoryDishes.length > 1 ? 's' : ''}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push('/dashboard/menus/categories')}
                          >
                            <FolderEdit className="h-4 w-4 sm:mr-2" />
                            <span className="hidden sm:inline">Modifier</span>
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleAddDishToCategory(category._id)}
                          >
                            <Plus className="h-4 w-4 sm:mr-2" />
                            <span className="hidden sm:inline">Ajouter un plat</span>
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {categoryDishes.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          Aucun plat dans cette catégorie
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {categoryDishes.map(dish => (
                            <div
                              key={dish._id}
                              className="border rounded-lg p-3 hover:bg-gray-50 space-y-3"
                            >
                              <div className="flex items-start gap-3">
                                {/* Photo thumbnail */}
                                <div className="flex-shrink-0">
                                  {dish.photoUrl ? (
                                    <div className="relative w-16 h-16 rounded-md overflow-hidden border">
                                      <Image
                                        src={dish.photoUrl}
                                        alt={dish.name}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                      />
                                    </div>
                                  ) : (
                                    <div className="w-16 h-16 rounded-md border flex items-center justify-center bg-gray-100">
                                      <ImageIcon className="h-6 w-6 text-gray-400" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <p className="font-medium">{dish.name}</p>
                                    {!dish.hasVariations && (
                                      <span className="text-sm font-semibold text-blue-600">
                                        {dish.price.toFixed(2)} €
                                      </span>
                                    )}
                                    {dish.hasVariations && (
                                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                        Variations disponibles
                                      </span>
                                    )}
                                    {!dish.available && (
                                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                        Indisponible
                                      </span>
                                    )}
                                  </div>
                                  {dish.description && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {dish.description}
                                    </p>
                                  )}
                                  {dish.hasVariations && dish.variations.length > 0 && (
                                    <div className="mt-2 space-y-1">
                                      <p className="text-xs font-medium text-purple-700">Variations:</p>
                                      <div className="flex flex-wrap gap-2">
                                        {dish.variations.map((variation, idx) => (
                                          <span
                                            key={idx}
                                            className="text-xs bg-purple-50 border border-purple-200 px-2 py-1 rounded"
                                          >
                                            {variation.name} - {variation.price.toFixed(2)} €
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  {dish.allergens.length > 0 && (
                                    <p className="text-xs text-orange-600 mt-2">
                                      Allergènes: {dish.allergens.join(', ')}
                                    </p>
                                  )}
                                </div>
                              </div>
                              {/* Actions - séparées en bas sur mobile, alignées à droite */}
                              <div className="flex justify-end gap-1 pt-2 border-t">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleToggleAvailability(dish._id, dish.name)}
                                  title={dish.available ? 'Marquer comme indisponible' : 'Marquer comme disponible'}
                                >
                                  <Check className={`h-4 w-4 ${dish.available ? 'text-green-600' : 'text-gray-400'}`} />
                                  <span className="ml-2 hidden sm:inline text-xs">
                                    {dish.available ? 'Disponible' : 'Indisponible'}
                                  </span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleStartEdit(dish)}
                                  title="Modifier"
                                >
                                  <Edit2 className="h-4 w-4" />
                                  <span className="ml-2 hidden sm:inline text-xs">Modifier</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(dish._id, dish.name)}
                                  title="Supprimer"
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                  <span className="ml-2 hidden sm:inline text-xs">Supprimer</span>
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}

              {/* Add New Category Button */}
              <Card className="border-dashed border-2">
                <CardContent className="py-6">
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => router.push('/dashboard/menus/categories')}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Nouvelle catégorie
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )}
    </div>
  );
}
