import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

export function useRestaurantMonitoring() {
  return useQuery({
    queryKey: ['restaurantMonitoring'],
    queryFn: () => apiClient.admin.getRestaurantMonitoring(),
    refetchInterval: 60000, // Refetch every minute for real-time monitoring
  });
}
