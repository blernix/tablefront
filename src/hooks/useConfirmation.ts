import { useState, useCallback } from 'react';

export interface ConfirmationOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDangerous?: boolean;
  onConfirm: () => void | Promise<void>;
}

interface ConfirmationState extends ConfirmationOptions {
  isOpen: boolean;
  isLoading: boolean;
}

export function useConfirmation() {
  const [state, setState] = useState<ConfirmationState>({
    isOpen: false,
    isLoading: false,
    title: '',
    message: '',
    confirmLabel: 'Confirmer',
    cancelLabel: 'Annuler',
    isDangerous: false,
    onConfirm: () => {},
  });

  const confirm = useCallback((options: ConfirmationOptions) => {
    setState({
      isOpen: true,
      isLoading: false,
      confirmLabel: 'Confirmer',
      cancelLabel: 'Annuler',
      isDangerous: false,
      ...options,
    });
  }, []);

  const handleConfirm = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      await state.onConfirm();
      setState((prev) => ({ ...prev, isOpen: false, isLoading: false }));
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, [state]);

  const handleCancel = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false, isLoading: false }));
  }, []);

  return {
    confirmationState: state,
    confirm,
    handleConfirm,
    handleCancel,
  };
}
