'use client';

import { Button } from '@/components/ui/button';

interface EmailConfirmationModalState {
  show: boolean;
  modalTitle?: string;
  modalMessage?: string;
  showEmailOption?: boolean;
}

interface EmailConfirmationModalProps {
  modal: EmailConfirmationModalState;
  dontAskAgain: boolean;
  onDontAskAgainChange: (checked: boolean) => void;
  isSaving: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function EmailConfirmationModal({
  modal,
  dontAskAgain,
  onDontAskAgainChange,
  isSaving,
  onConfirm,
  onClose,
}: EmailConfirmationModalProps) {
  if (!modal.show) return null;

  return (
    <div className="fixed inset-0 bg-[#0A0A0A] bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-[#E5E5E5] max-w-md w-full p-8 space-y-4">
        <div>
          <h3 className="text-lg font-light text-[#2A2A2A]">
            {modal.modalTitle || "Confirmer l'action"}
          </h3>
          <p className="mt-2 text-sm text-[#666666]">
            {modal.modalMessage ||
              'Voulez-vous envoyer un email de confirmation au client ?'}
          </p>
        </div>

        {modal.showEmailOption !== false && (
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="dontAskAgainCheckbox"
              checked={dontAskAgain}
              onChange={(e) => onDontAskAgainChange(e.target.checked)}
              className="h-4 w-4 border-[#E5E5E5]"
            />
            <label htmlFor="dontAskAgainCheckbox" className="text-sm text-[#2A2A2A]">
              Ne plus me demander
            </label>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSaving}
            className="flex-1"
          >
            Annuler
          </Button>
          <Button onClick={onConfirm} disabled={isSaving} className="flex-1">
            {isSaving ? 'En cours...' : 'Confirmer'}
          </Button>
        </div>
      </div>
    </div>
  );
}
