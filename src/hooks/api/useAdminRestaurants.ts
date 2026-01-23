import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Restaurant } from '@/types';
import { toast } from 'sonner';

export function useAdminRestaurants(page = 1, limit = 20) {
  return useQuery({
    queryKey: ['admin', 'restaurants', page, limit],
    queryFn: () => apiClient.getRestaurants(page, limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useCreateRestaurant() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => apiClient.createRestaurant(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'restaurants'] });
      toast.success('Restaurant créé avec succès');
    },
    onError: (error: Error) => {
      toast.error(`Échec de création: ${error.message}`);
    },
  });
}

export function useDeleteRestaurant() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiClient.deleteRestaurant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'restaurants'] });
      toast.success('Restaurant supprimé avec succès');
    },
    onError: (error: Error) => {
      toast.error(`Échec de suppression: ${error.message}`);
    },
  });
}

export function useUpdateRestaurant() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      apiClient.updateRestaurant(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'restaurants'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'restaurant', variables.id] });
      toast.success('Restaurant mis à jour avec succès');
    },
    onError: (error: Error) => {
      toast.error(`Échec de mise à jour: ${error.message}`);
    },
  });
}

export function useRestaurant(id: string) {
  return useQuery({
    queryKey: ['admin', 'restaurant', id],
    queryFn: () => apiClient.getRestaurant(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
}

export function useRestaurantUsers(restaurantId: string) {
  return useQuery({
    queryKey: ['admin', 'restaurant', restaurantId, 'users'],
    queryFn: () => apiClient.getRestaurantUsers(restaurantId),
    enabled: !!restaurantId,
    staleTime: 2 * 60 * 1000,
  });
}