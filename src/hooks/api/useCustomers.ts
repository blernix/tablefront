import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';
import { Customer, Reservation } from '@/types';

interface CustomerListParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  tag?: string;
}

export function useCustomers(params: CustomerListParams = {}) {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: () => apiClient.customers.getCustomers(params),
  });
}

export function useCustomerById(id: string) {
  return useQuery({
    queryKey: ['customer', id],
    queryFn: () => apiClient.customers.getCustomerById(id),
    enabled: !!id,
  });
}

export function useSearchCustomers(q: string) {
  return useQuery({
    queryKey: ['customers', 'search', q],
    queryFn: () => apiClient.customers.searchCustomers(q),
    enabled: q.length >= 1,
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      name: string;
      email: string;
      phone: string;
      tags?: string[];
      notes?: string;
      marketingConsent?: boolean;
    }) => apiClient.customers.createCustomer(data),
    onSuccess: () => {
      toast.success('Client créé');
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { name?: string; phone?: string; tags?: string[]; notes?: string };
    }) => apiClient.customers.updateCustomer(id, data),
    onSuccess: (_, variables) => {
      toast.success('Client mis à jour');
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customer', variables.id] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
