'use client';

import { useState } from 'react';
import { Shield, Key, AlertCircle, ArrowLeft } from 'lucide-react';
import Modal from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useVerifyTwoFactorLogin, useRecoveryCode } from '@/hooks/api/useTwoFactor';
import { AuthResponse } from '@/types';

interface TwoFactorVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (response: AuthResponse) => void;
  tempToken: string;
  userId: string;
  email: string;
}

type VerificationMode = 'code' | 'recovery';

const TwoFactorVerificationModal = ({
  isOpen,
  onClose,
  onSuccess,
  tempToken,
  userId,
  email,
}: TwoFactorVerificationModalProps) => {
  const [mode, setMode] = useState<VerificationMode>('code');
  const [verificationCode, setVerificationCode] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate: verifyLogin, isPending: isVerifying } = useVerifyTwoFactorLogin();
  const { mutate: recover, isPending: isUsingRecovery } = useRecoveryCode();

  const validateVerificationCode = () => {
    const newErrors: Record<string, string> = {};
    if (!verificationCode.trim()) {
      newErrors.verificationCode = 'Le code de vérification est requis';
    } else if (!/^\d{6}$/.test(verificationCode)) {
      newErrors.verificationCode = 'Le code doit contenir 6 chiffres';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRecoveryCode = () => {
    const newErrors: Record<string, string> = {};
    if (!recoveryCode.trim()) {
      newErrors.recoveryCode = 'Le code de récupération est requis';
    } else if (!/^[A-F0-9]{12}$/.test(recoveryCode)) {
      newErrors.recoveryCode = 'Format de code invalide (12 caractères hexadécimaux majuscules, ex: 1A2B3C4D5E6F)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVerifyCode = () => {
    if (!validateVerificationCode()) return;
    
    console.log('[2FA Modal] Verifying code:', { tempToken: tempToken?.substring(0, 20) + '...', verificationCode });
    
    verifyLogin({ tempToken, token: verificationCode }, {
      onSuccess: (data) => {
        console.log('[2FA Modal] Verification successful:', { user: data.user, tokenPreview: data.token?.substring(0, 20) + '...' });
        toast.success('Connexion réussie !');
        if (onSuccess) onSuccess(data);
        handleClose();
      },
      onError: (error) => {
        console.error('[2FA Modal] Verification error:', error);
      },
    });
  };

  const handleUseRecoveryCode = () => {
    if (!validateRecoveryCode()) return;
    
    recover({ tempToken, recoveryCode }, {
      onSuccess: (data) => {
        toast.success('Connexion réussie avec code de récupération !');
        if (onSuccess) onSuccess(data);
        handleClose();
      },
    });
  };

  const handleClose = () => {
    setMode('code');
    setVerificationCode('');
    setRecoveryCode('');
    setErrors({});
    onClose();
  };

  const renderCodeMode = () => (
    <div className="space-y-6">
      <div className="flex justify-center">
        <div className="rounded-full bg-blue-100 p-3">
          <Shield className="h-8 w-8 text-blue-600" />
        </div>
      </div>

      <div className="text-center">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Authentification à deux facteurs requise
        </h3>
        <p className="text-sm text-slate-600 mb-1">
           Entrez le code à 6 chiffres de votre application d&apos;authentification
        </p>
        <p className="text-xs text-slate-500">
          Pour {email}
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="verificationCode">Code de vérification (6 chiffres)</Label>
          <Input
            id="verificationCode"
            value={verificationCode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 6);
              setVerificationCode(value);
              if (errors.verificationCode) {
                setErrors({ ...errors, verificationCode: '' });
              }
            }}
            placeholder="123456"
            maxLength={6}
            className={errors.verificationCode ? 'border-destructive' : ''}
            disabled={isVerifying}
            autoFocus
          />
          {errors.verificationCode && (
            <p className="text-sm text-destructive">{errors.verificationCode}</p>
          )}
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-slate-900 mb-1">
                Problème avec le code ?
              </p>
              <p className="text-xs text-slate-700">
                 Assurez-vous que l&apos;heure de votre appareil est correcte et que le compte est bien ajouté dans votre application.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isVerifying}
            className="flex-1"
          >
            Retour
          </Button>
          <Button
            type="button"
            onClick={handleVerifyCode}
            disabled={isVerifying || !verificationCode.trim()}
            className="flex-1"
          >
            {isVerifying ? 'Vérification...' : 'Se connecter'}
          </Button>
        </div>

        <div className="pt-4 border-t border-slate-200">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setMode('recovery')}
            disabled={isVerifying}
            className="w-full text-sm"
          >
            <Key className="w-4 h-4 mr-2" />
            Utiliser un code de récupération
          </Button>
        </div>
      </div>
    </div>
  );

  const renderRecoveryMode = () => (
    <div className="space-y-6">
      <div className="flex justify-center">
        <div className="rounded-full bg-amber-100 p-3">
          <Key className="h-8 w-8 text-amber-600" />
        </div>
      </div>

      <div className="text-center">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Code de récupération
        </h3>
        <p className="text-sm text-slate-600">
           Utilisez l&apos;un de vos codes de récupération à usage unique
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="recoveryCode">Code de récupération</Label>
           <Input
            id="recoveryCode"
            value={recoveryCode}
            onChange={(e) => {
              const value = e.target.value.toUpperCase().replace(/[^A-F0-9]/g, '').slice(0, 12);
              setRecoveryCode(value);
              if (errors.recoveryCode) {
                setErrors({ ...errors, recoveryCode: '' });
              }
            }}
            placeholder="1A2B3C4D5E6F"
            className={errors.recoveryCode ? 'border-destructive' : ''}
            disabled={isUsingRecovery}
            autoFocus
          />
          {errors.recoveryCode && (
            <p className="text-sm text-destructive">{errors.recoveryCode}</p>
          )}
          <p className="text-xs text-slate-500">
            Format: 12 caractères hexadécimaux majuscules (ex: 1A2B3C4D5E6F)
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-900 mb-1">
                Codes à usage unique
              </p>
              <p className="text-xs text-amber-800">
                 Chaque code ne peut être utilisé qu&apos;une seule fois. Après utilisation, il sera supprimé de votre liste de codes de récupération.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setMode('code')}
            disabled={isUsingRecovery}
            className="flex-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au code
          </Button>
          <Button
            type="button"
            onClick={handleUseRecoveryCode}
            disabled={isUsingRecovery || !recoveryCode.trim()}
            className="flex-1"
          >
            {isUsingRecovery ? 'Vérification...' : 'Utiliser ce code'}
          </Button>
        </div>
      </div>
    </div>
  );

  const modalTitle = mode === 'code' 
    ? 'Vérification 2FA' 
    : 'Code de récupération';

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={modalTitle}
      size="md"
    >
      <div className="space-y-4">
        {mode === 'code' ? renderCodeMode() : renderRecoveryMode()}
      </div>
    </Modal>
  );
};

export default TwoFactorVerificationModal;