'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/lib/api';
import { Restaurant } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DeleteConfirmModal from '@/components/modals/DeleteConfirmModal';
import { useDeleteConfirm } from '@/hooks/useDeleteConfirm';

export default function RestaurantsPage() {
  const router = useRouter();
  const { isAuthenticated, user, initAuth, logout, isInitialized } = useAuthStore();

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Delete confirmation hook
  const { isOpen: isDeleteModalOpen, itemToDelete, isDeleting, openDeleteModal, closeDeleteModal, confirmDelete } = useDeleteConfirm({
    onDelete: async (id) => {
      await apiClient.deleteRestaurant(id);
      fetchRestaurants();
    },
  });

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (!isInitialized) return;
    
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user?.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    fetchRestaurants();
  }, [isInitialized, isAuthenticated, user, router]);

  const fetchRestaurants = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getRestaurants();
      setRestaurants(response.restaurants);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch restaurants');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const handleDelete = (restaurant: Restaurant) => {
    openDeleteModal({ id: restaurant._id, name: restaurant.name });
  };

  if (!isInitialized) {
    return <div className="p-8">Chargement...</div>;
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return <div className="p-8">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold">TableMaster Admin</h1>
            <nav className="flex gap-4">
              <Button variant="link" onClick={() => router.push('/admin/dashboard')}>
                Tableau de bord
              </Button>
              <Button variant="link" className="font-semibold">
                Restaurants
              </Button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
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
              <div className="text-center py-8 text-muted-foreground">Chargement...</div>
            ) : error ? (
              <div className="text-center py-8 text-destructive">{error}</div>
            ) : restaurants.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucun restaurant. Créez-en un pour commencer.
              </div>
            ) : (
              <div className="space-y-4">
                {restaurants.map((restaurant) => (
                  <div
                    key={restaurant._id}
                    className="flex items-center justify-between border rounded-lg p-4 hover:bg-gray-50"
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
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/admin/restaurants/${restaurant._id}`)}
                      >
                        Voir
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(restaurant)}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Supprimer le restaurant"
        itemName={itemToDelete?.name}
        isLoading={isDeleting}
      />
    </div>
  );
}
