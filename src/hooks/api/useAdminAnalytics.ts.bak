import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';

export function useNotificationAnalytics() {
  return useQuery({
    queryKey: ['admin', 'analytics', 'notifications'],
    queryFn: () => apiClient.admin.getNotificationAnalytics(),
    staleTime: 5 * 60 * 1000, // 5 minutes (données moins fréquemment mises à jour)
  });
}

export function useExportNotificationAnalytics() {
  return useMutation({
    mutationFn: () => apiClient.admin.exportNotificationAnalytics(),
    onSuccess: () => {
      toast.success('Données exportées avec succès');
    },
    onError: (error: Error) => {
      toast.error(`Échec de l'exportation: ${error.message}`);
    },
  });
}