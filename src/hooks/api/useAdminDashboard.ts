import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => apiClient.getAdminDashboard(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useExportData() {
  return useMutation({
    mutationFn: async (type: 'restaurants' | 'users' | 'reservations') => {
      switch (type) {
        case 'restaurants':
          return apiClient.exportRestaurants();
        case 'users':
          return apiClient.exportUsers();
        case 'reservations':
          return apiClient.exportReservations();
      }
    },
  });
}