import { useState, useCallback } from 'react';

export interface FormModalOptions<T = unknown> {
  isEditing?: boolean;
  initialData?: T;
}

export function useFormModal<T = unknown>() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingData, setEditingData] = useState<T | null>(null);

  const openCreateModal = useCallback(() => {
    setIsEditing(false);
    setEditingData(null);
    setIsOpen(true);
  }, []);

  const openEditModal = useCallback((data: T) => {
    setIsEditing(true);
    setEditingData(data);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setIsEditing(false);
    setEditingData(null);
  }, []);

  const resetModal = useCallback(() => {
    setIsEditing(false);
    setEditingData(null);
  }, []);

  return {
    isOpen,
    isEditing,
    editingData,
    openCreateModal,
    openEditModal,
    closeModal,
    resetModal,
  };
}
