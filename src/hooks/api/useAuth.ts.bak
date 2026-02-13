import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';

export function useChangePassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      apiClient.changePassword(currentPassword, newPassword),
    onSuccess: () => {
      toast.success('Mot de passe modifié avec succès');
    },
    onError: (error: Error) => {
      toast.error(`Échec de modification: ${error.message}`);
    },
  });
}

export function useChangeEmail() {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: ({ currentPassword, newEmail }: { currentPassword: string; newEmail: string }) =>
      apiClient.changeEmail(currentPassword, newEmail),
    onSuccess: (data) => {
      // Update user in auth store with new email and token
      if (data.user && data.token) {
        setUser(data.user, data.token);
      }
      toast.success('Email modifié avec succès');
    },
    onError: (error: Error) => {
      toast.error(`Échec de modification de l'email: ${error.message}`);
    },
  });
}