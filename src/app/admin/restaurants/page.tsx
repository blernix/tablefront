'use client';

import { useRouter } from 'next/navigation';
import { useState, memo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DeleteConfirmModal from '@/components/modals/DeleteConfirmModal';
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm';
import { useAdminRestaurants, useDeleteRestaurant } from '@/hooks/api/useAdminRestaurants';
import AdminRestaurantsSkeleton from '@/components/skeleton/AdminRestaurantsSkeleton';
import { Restaurant } from '@/types';
interface RestaurantItemProps {
  restaurant: Restaurant;
  onView: (id: string) => void;
  onDelete: (restaurant: Restaurant) => void;
}

const RestaurantItem = memo(function RestaurantItem({ restaurant, onView, onDelete }: RestaurantItemProps) {
  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center justify-between border rounded-lg p-3 sm:p-4 hover:bg-gray-50 space-y-3 sm:space-y-0"
    >
      <div className="flex-1">
        <h3 className="font-medium">{restaurant.name}</h3>
        <p className="text-sm text-muted-foreground">{restaurant.address}</p>
        <p className="text-sm text-muted-foreground">
          {restaurant.phone} • {restaurant.email}
        </p>
        <div className="mt-2">
          <span
            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
              restaurant.status === 'active'
                ? 'bg-green-50 text-green-700'
                : 'bg-gray-50 text-gray-700'
            }`}
          >
            {restaurant.status}
          </span>
        </div>
      </div>
      <div className="flex gap-2 mt-3 sm:mt-0">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onView(restaurant._id)}
        >
          Voir
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(restaurant)}
        >
          Supprimer
        </Button>
      </div>
    </div>
  );
});

export default function RestaurantsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const limit = 20;
  const { data, isLoading, error, refetch } = useAdminRestaurants(page, limit);
  const deleteMutation = useDeleteRestaurant();

  const restaurants = data?.restaurants || [];
  const pagination = data?.pagination;

  // Delete confirmation hook
  const { isOpen: isDeleteModalOpen, itemToDelete, isDeleting, openDeleteModal, closeDeleteModal, confirmDelete } = useDeleteConfirm({
    onDelete: async (id) => {
      await deleteMutation.mutateAsync(id);
    },
    itemType: 'le restaurant',
  });

  const handleDelete = (restaurant: Restaurant) => {
    openDeleteModal({ id: restaurant._id, name: restaurant.name });
  };

  const handleView = (id: string) => {
    router.push(`/admin/restaurants/${id}`);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Restaurants</CardTitle>
              <CardDescription>
                Gérez les restaurants et leurs utilisateurs
              </CardDescription>
            </div>
            <Button onClick={() => router.push('/admin/restaurants/new')}>
              Nouveau Restaurant
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <AdminRestaurantsSkeleton />
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-destructive mb-4">{error.message}</p>
              <Button variant="outline" onClick={() => refetch()}>
                Réessayer
              </Button>
            </div>
          ) : restaurants.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucun restaurant. Créez-en un pour commencer.
            </div>
          ) : (
             <div className="space-y-6">
               <div className="space-y-4">
                  {restaurants.map((restaurant) => (
                    <RestaurantItem
                      key={restaurant._id}
                      restaurant={restaurant}
                      onView={handleView}
                      onDelete={handleDelete}
                    />
                  ))}
               </div>
               {pagination && pagination.pages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                   <Button
                     variant="outline"
                     onClick={() => setPage(page - 1)}
                     disabled={page <= 1}
                   >
                     Précédent
                   </Button>
                   <span className="text-sm text-gray-600">
                     Page {pagination.page} sur {pagination.pages}
                   </span>
                   <Button
                     variant="outline"
                     onClick={() => setPage(page + 1)}
                     disabled={page >= pagination.pages}
                   >
                     Suivant
                   </Button>
                 </div>
               )}
             </div>
            )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Supprimer le restaurant"
        itemName={itemToDelete?.name}
        isLoading={isDeleting || deleteMutation.isPending}
      />
    </>
  );
}