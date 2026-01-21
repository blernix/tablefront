'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api';
import { Dish, MenuCategory, DishVariation } from '@/types';
import { getDishCategoryId } from '@/lib/menu-helpers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Trash2, 
  ImageIcon,
  Loader2
} from 'lucide-react';
import ImageUpload from '@/components/ui/image-upload';
import Image from 'next/image';
import Modal from '@/components/ui/modal';

const formSchema = z.object({
  categoryId: z.string().min(1, 'La catégorie est requise'),
  name: z.string().min(1, 'Le nom est requis'),
  description: z.string().optional(),
  price: z.string().min(1, 'Le prix est requis'),
  allergens: z.string().optional(),
  available: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

interface DishFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  dish?: Dish | null;
  categories: MenuCategory[];
  onSuccess: () => void;
  initialCategoryId?: string;
}

const DishFormModal = ({
  isOpen,
  onClose,
  dish,
  categories,
  onSuccess,
  initialCategoryId = ''
}: DishFormModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVariations, setHasVariations] = useState(dish?.hasVariations || false);
  const [variations, setVariations] = useState<DishVariation[]>(dish?.variations || []);
  const [variationName, setVariationName] = useState('');
  const [variationPrice, setVariationPrice] = useState('');
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState<string | undefined>(dish?.photoUrl);
  const [photoHasChanged, setPhotoHasChanged] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: dish ? (getDishCategoryId(dish) || '') : initialCategoryId,
      name: dish?.name || '',
      description: dish?.description || '',
      price: dish ? dish.price.toString() : '',
      allergens: dish ? dish.allergens.join(', ') : '',
      available: dish?.available ?? true,
    },
  });

  const isFirstRender = useRef(true);

  const resetForm = useCallback(() => {
    // Réinitialiser le formulaire avec les valeurs actuelles
    reset({
      categoryId: dish ? (getDishCategoryId(dish) || '') : initialCategoryId,
      name: dish?.name || '',
      description: dish?.description || '',
      price: dish ? dish.price.toString() : '',
      allergens: dish ? dish.allergens.join(', ') : '',
      available: dish?.available ?? true,
    });

    // Réinitialiser les états liés aux variations
    setHasVariations(dish?.hasVariations || false);
    setVariations(dish?.variations || []);
    setVariationName('');
    setVariationPrice('');
    setCurrentPhotoUrl(dish?.photoUrl);
    setPhotoHasChanged(false);
  }, [dish, reset, initialCategoryId]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    resetForm();
  }, [resetForm]);

  // Synchroniser currentPhotoUrl quand dish change
  useEffect(() => {
    setCurrentPhotoUrl(dish?.photoUrl);
  }, [dish]);

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

  const handleUploadPhoto = async (file: File) => {
    if (!dish) return;

    try {
      const response = await apiClient.uploadDishPhoto(dish._id, file);
      // Mettre à jour l'URL de la photo localement sans recharger les données
      setCurrentPhotoUrl(response.dish.photoUrl);
      setPhotoHasChanged(true);
      toast.success('Photo ajoutée avec succès');
      // NE PAS appeler onSuccess() ici pour éviter le re-render
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de l\'upload');
    }
  };

  const handleDeletePhoto = async () => {
    if (!dish) return;

    try {
      const response = await apiClient.deleteDishPhoto(dish._id);
      // Mettre à jour l'URL de la photo localement sans recharger les données
      setCurrentPhotoUrl(undefined);
      setPhotoHasChanged(true);
      toast.success('Photo supprimée avec succès');
      // NE PAS appeler onSuccess() ici pour éviter le re-render
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    }
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

      if (dish) {
        await apiClient.updateDish(dish._id, dishData);
        toast.success(`Plat "${data.name}" modifié avec succès`);
      } else {
        await apiClient.createDish(dishData);
        toast.success(`Plat "${data.name}" créé avec succès`);
      }

      // Fermer la modal et rafraîchir les données
      handleClose();
      onSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Si la photo a été modifiée, rafraîchir les données dans la liste
    if (photoHasChanged) {
      onSuccess();
    }
    resetForm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={dish ? 'Modifier le plat' : 'Nouveau plat'}
      description={dish ? 'Modifiez les informations du plat' : 'Ajoutez un nouveau plat à votre menu'}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du plat *</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Ex: Salade César"
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
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
              <p className="text-sm text-red-600">{errors.price.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoryId">Catégorie *</Label>
          <select
            id="categoryId"
            {...register('categoryId')}
            disabled={isSubmitting}
            className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Sélectionnez une catégorie</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="text-sm text-red-600">{errors.categoryId.message}</p>
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
          <p className="text-xs text-slate-500">
            Séparez les allergènes par des virgules
          </p>
        </div>

        {/* Photo Section - Only in edit mode */}
        {dish && (
          <div className="space-y-2 border-t pt-4">
            <Label>Photo du plat</Label>
            <div className="max-w-xs">
              <ImageUpload
                currentImageUrl={currentPhotoUrl}
                onUpload={handleUploadPhoto}
                onDelete={currentPhotoUrl ? handleDeletePhoto : undefined}
                disabled={isSubmitting}
                aspectRatio="landscape"
                maxSizeMB={5}
              />
            </div>
            <p className="text-xs text-slate-500">
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
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
            />
            <Label htmlFor="hasVariations" className="cursor-pointer font-semibold">
              Ce plat a des variations (tailles, portions)
            </Label>
          </div>

          {hasVariations && (
            <div className="space-y-3 ml-6 bg-slate-50 p-4 rounded-lg">
              <p className="text-sm text-slate-600">
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
                      className="flex items-center justify-between bg-white border border-slate-200 rounded p-2"
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
                        <Trash2 className="h-4 w-4 text-red-600" />
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
            className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
          />
          <Label htmlFor="available" className="cursor-pointer">
            Disponible
          </Label>
        </div>

        <div className="flex gap-2 justify-end border-t pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-slate-900 hover:bg-slate-800 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : dish ? (
              'Modifier'
            ) : (
              'Créer'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default DishFormModal;