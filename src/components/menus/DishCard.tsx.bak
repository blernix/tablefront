'use client';

import Image from 'next/image';
import { Edit2, Trash2, UtensilsCrossed, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dish } from '@/types';

interface DishCardProps {
  dish: Dish;
  onEdit: (dish: Dish) => void;
  onDelete: (dishId: string, dishName: string) => void;
}

/**
 * Carte d'affichage individuelle d'un plat
 * Affiche l'image, le nom, la description, le prix et les actions
 */
export function DishCard({ dish, onEdit, onDelete }: DishCardProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-5 border border-[#E5E5E5] hover:bg-[#FAFAFA] hover:border-[#0066FF] group transition-colors gap-4">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {/* Image du plat */}
        <div className="relative h-20 w-20 sm:h-20 sm:w-20 overflow-hidden border border-[#E5E5E5] flex-shrink-0">
          {dish.photoUrl ? (
            <Image
              src={dish.photoUrl}
              alt={dish.name}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-[#FAFAFA]">
              <UtensilsCrossed className="h-7 w-7 text-[#666666]" />
            </div>
          )}
          {!dish.available && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <EyeOff className="h-5 w-5 text-white" />
            </div>
          )}
        </div>

        {/* Informations du plat */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-[#2A2A2A] text-base mb-1.5">{dish.name}</h4>
          <p className="text-sm text-[#666666] font-light line-clamp-2 leading-relaxed">
            {dish.description || 'Aucune description'}
          </p>
        </div>
      </div>

      {/* Prix et actions */}
      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 sm:ml-4">
        <span className="font-medium text-[#2A2A2A] text-lg tabular-nums whitespace-nowrap">
          {dish.price.toFixed(2)} €
        </span>
        <div className="flex gap-1.5">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(dish)}
            className="h-9 w-9 p-0"
            title="Modifier"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(dish._id, dish.name)}
            className="h-9 w-9 p-0 text-red-600 hover:text-red-700"
            title="Supprimer"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
