'use client';

import { useState } from 'react';
import { Shield, ShieldCheck, ShieldOff, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import TwoFactorSetupModal from '@/components/modals/TwoFactorSetupModal';
import ConfirmationModal from '@/components/modals/ConfirmationModal';
import { useTwoFactorStatus, useDisableTwoFactor } from '@/hooks/api/useTwoFactor';

const TwoFactorManagement = () => {
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showDisableConfirm, setShowDisableConfirm] = useState(false);
  
  const { data: status, isLoading, refetch } = useTwoFactorStatus();
  const { mutate: disableTwoFactor, isPending: isDisabling } = useDisableTwoFactor();

  const handleEnableClick = () => {
    setShowSetupModal(true);
  };

  const handleDisableClick = () => {
    setShowDisableConfirm(true);
  };

  const handleDisableConfirm = () => {
    disableTwoFactor(undefined, {
      onSuccess: () => {
        toast.success('Authentification à deux facteurs désactivée');
        setShowDisableConfirm(false);
        refetch();
      },
    });
  };

  const handleSetupSuccess = () => {
    setShowSetupModal(false);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <Shield className="w-4 h-4 animate-spin" />
        Chargement...
      </div>
    );
  }

  const isEnabled = status?.twoFactorEnabled ?? false;

  return (
    <>
      <div className="flex items-center gap-2">
        {isEnabled ? (
          <>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-md border border-green-200">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-sm font-medium">2FA activée</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDisableClick}
              disabled={isDisabling}
            >
              <ShieldOff className="w-4 h-4 mr-2" />
              Désactiver
            </Button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 text-slate-700 rounded-md border border-slate-200">
              <ShieldOff className="w-4 h-4" />
              <span className="text-sm font-medium">2FA désactivée</span>
            </div>
            <Button
              variant="default"
              size="sm"
              onClick={handleEnableClick}
            >
              <Key className="w-4 h-4 mr-2" />
              Activer 2FA
            </Button>
          </>
        )}
      </div>

      <TwoFactorSetupModal
        isOpen={showSetupModal}
        onClose={() => setShowSetupModal(false)}
        onSuccess={handleSetupSuccess}
      />

      <ConfirmationModal
        isOpen={showDisableConfirm}
        title="Désactiver l&apos;authentification à deux facteurs"
        message="Êtes-vous sûr de vouloir désactiver l&apos;authentification à deux facteurs ? Votre compte sera moins sécurisé."
        confirmLabel="Désactiver"
        cancelLabel="Annuler"
        isDangerous={true}
        onConfirm={handleDisableConfirm}
        onCancel={() => setShowDisableConfirm(false)}
      />
    </>
  );
};

export default TwoFactorManagement;