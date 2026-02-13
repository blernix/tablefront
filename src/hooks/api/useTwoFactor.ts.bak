import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';

export function useTwoFactorStatus() {
  return useQuery({
    queryKey: ['twoFactorStatus'],
    queryFn: () => apiClient.getTwoFactorStatus(),
  });
}

export function useGenerateTwoFactorSetup() {
  return useMutation({
    mutationFn: () => apiClient.generateTwoFactorSetup(),
    onError: (error: Error) => {
      toast.error(`Failed to generate 2FA setup: ${error.message}`);
    },
  });
}

export function useEnableTwoFactor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ secret, token }: { secret: string; token: string }) =>
      apiClient.enableTwoFactor(secret, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['twoFactorStatus'] });
      toast.success('Two-factor authentication enabled successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to enable 2FA: ${error.message}`);
    },
  });
}

export function useDisableTwoFactor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.disableTwoFactor(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['twoFactorStatus'] });
      toast.success('Two-factor authentication disabled successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to disable 2FA: ${error.message}`);
    },
  });
}

export function useVerifyTwoFactorLogin() {
  return useMutation({
    mutationFn: ({ tempToken, token }: { tempToken: string; token: string }) => {
      console.log('[useVerifyTwoFactorLogin] Calling API with:', { tempToken: tempToken?.substring(0, 20) + '...', token });
      return apiClient.verifyTwoFactorLogin(tempToken, token);
    },
    onError: (error: Error) => {
      console.error('[useVerifyTwoFactorLogin] Error:', error);
      toast.error(`Failed to verify 2FA code: ${error.message}`);
    },
  });
}

export function useRecoveryCode() {
  return useMutation({
    mutationFn: ({ tempToken, recoveryCode }: { tempToken: string; recoveryCode: string }) =>
      apiClient.useRecoveryCode(tempToken, recoveryCode),
    onError: (error: Error) => {
      toast.error(`Failed to use recovery code: ${error.message}`);
    },
  });
}