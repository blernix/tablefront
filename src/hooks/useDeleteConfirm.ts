import { useState, useCallback } from 'react';

interface DeleteItem {
  id: string;
  name: string;
}

interface UseDeleteConfirmOptions {
  onDelete: (id: string) => Promise<void>;
  itemType?: string;
}

export function useDeleteConfirm({ onDelete, itemType = 'cet élément' }: UseDeleteConfirmOptions) {
  const [isOpen, setIsOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<DeleteItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openDeleteModal = useCallback((item: DeleteItem) => {
    setItemToDelete(item);
    setIsOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setIsOpen(false);
    setItemToDelete(null);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!itemToDelete) return;

    setIsDeleting(true);
    try {
      await onDelete(itemToDelete.id);
      closeDeleteModal();
    } catch (error) {
      // Error handled by parent
      throw error;
    } finally {
      setIsDeleting(false);
    }
  }, [itemToDelete, onDelete, closeDeleteModal]);

  return {
    isOpen,
    itemToDelete,
    isDeleting,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
  };
}
