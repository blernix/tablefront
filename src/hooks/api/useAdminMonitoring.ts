import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

export function useRestaurantMonitoring() {
  return useQuery({
    queryKey: ['restaurantMonitoring'],
    queryFn: () => apiClient.admin.getRestaurantMonitoring(),
    refetchInterval: 300000, // Refetch every 5 min (was 60s — endpoint is expensive)
  });
}
