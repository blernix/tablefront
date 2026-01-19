'use client';

import { AlertTriangle } from 'lucide-react';
import Modal from '@/components/ui/modal';
import { Button } from '@/components/ui/button';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description?: string;
  itemName?: string;
  isLoading?: boolean;
}

const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  itemName,
  isLoading = false,
}: DeleteConfirmModalProps) => {
  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
    >
      <div className="space-y-4">
        {/* Warning Icon */}
        <div className="flex justify-center">
          <div className="rounded-full bg-red-100 p-3">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        {/* Description */}
        <div className="text-center">
          {description ? (
            <p className="text-slate-600">{description}</p>
          ) : (
            <p className="text-slate-600">
              Êtes-vous sûr de vouloir supprimer{' '}
              {itemName ? (
                <>
                  <span className="font-semibold text-slate-900">{itemName}</span>
                  {' '}?
                </>
              ) : (
                'cet élément ?'
              )}
            </p>
          )}
          <p className="mt-2 text-sm text-slate-500">
            Cette action est irréversible.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            Annuler
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? 'Suppression...' : 'Supprimer'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;
