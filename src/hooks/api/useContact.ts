import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';

export function useContact() {
  return useMutation({
    mutationFn: (data: {
      subject: string;
      category: 'question' | 'problem' | 'other';
      message: string;
    }) => apiClient.sendContactMessage(data),
    onSuccess: () => {
      toast.success('Message envoyé avec succès. Nous vous répondrons dans les plus brefs délais.');
    },
    onError: (error: Error) => {
      toast.error(`Échec de l'envoi du message: ${error.message}`);
    },
  });
}
