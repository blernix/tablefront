'use client';

import { useState, useEffect } from 'react';
import { Shield, QrCode, Key, Copy, Download, Check, AlertCircle } from 'lucide-react';
import Modal from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useGenerateTwoFactorSetup, useEnableTwoFactor } from '@/hooks/api/useTwoFactor';

interface TwoFactorSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type SetupStep = 'qr' | 'verify' | 'recovery';

const TwoFactorSetupModal = ({
  isOpen,
  onClose,
  onSuccess,
}: TwoFactorSetupModalProps) => {
  const [step, setStep] = useState<SetupStep>('qr');
  const [verificationCode, setVerificationCode] = useState('');
  const [secret, setSecret] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedRecoveryCodes, setCopiedRecoveryCodes] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate: generateSetup, isPending: isGenerating } = useGenerateTwoFactorSetup();
  const { mutate: enableTwoFactor, isPending: isEnabling } = useEnableTwoFactor();

  useEffect(() => {
    if (isOpen && step === 'qr') {
      generateSetup(undefined, {
        onSuccess: (data) => {
          setSecret(data.secret);
          setQrCodeUrl(data.qrCodeUrl);
          setRecoveryCodes(data.recoveryCodes);
        },
      });
    }
  }, [isOpen, step, generateSetup]);

  const handleCopySecret = () => {
    navigator.clipboard.writeText(secret)
      .then(() => {
        setCopiedSecret(true);
        toast.success('Secret copié dans le presse-papier');
        setTimeout(() => setCopiedSecret(false), 2000);
      })
      .catch(() => {
        toast.error('Erreur lors de la copie');
      });
  };

  const handleCopyRecoveryCodes = () => {
    const codesText = recoveryCodes.join('\n');
    navigator.clipboard.writeText(codesText)
      .then(() => {
        setCopiedRecoveryCodes(true);
        toast.success('Codes de récupération copiés');
        setTimeout(() => setCopiedRecoveryCodes(false), 2000);
      })
      .catch(() => {
        toast.error('Erreur lors de la copie');
      });
  };

  const handleDownloadRecoveryCodes = () => {
    const codesText = recoveryCodes.join('\n');
    const blob = new Blob([codesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tablemaster-recovery-codes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Codes de récupération téléchargés');
  };

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

  const handleVerify = () => {
    if (!validateVerificationCode()) return;

    enableTwoFactor({ secret, token: verificationCode }, {
      onSuccess: (data) => {
        toast.success(data.message);
        // ✅ Update recovery codes with the ones returned by the API (these are the REAL codes stored in DB)
        if (data.recoveryCodes && Array.isArray(data.recoveryCodes)) {
          setRecoveryCodes(data.recoveryCodes);
        }
        setStep('recovery');
      },
    });
  };

  const handleComplete = () => {
    if (onSuccess) onSuccess();
    handleClose();
  };

  const handleClose = () => {
    setStep('qr');
    setVerificationCode('');
    setErrors({});
    setCopiedSecret(false);
    setCopiedRecoveryCodes(false);
    onClose();
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-6">
      <div className="flex items-center">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 'qr' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
          <QrCode className="w-4 h-4" />
        </div>
        <div className={`w-16 h-1 ${step === 'verify' || step === 'recovery' ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 'verify' ? 'bg-blue-600 text-white' : step === 'recovery' ? 'bg-slate-200 text-slate-600' : 'bg-slate-200 text-slate-600'}`}>
          <Key className="w-4 h-4" />
        </div>
        <div className={`w-16 h-1 ${step === 'recovery' ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 'recovery' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
          <Download className="w-4 h-4" />
        </div>
      </div>
    </div>
  );

  const renderQrStep = () => (
    <div className="space-y-6">
      <div className="flex justify-center">
        <div className="rounded-full bg-blue-100 p-3">
          <Shield className="h-8 w-8 text-blue-600" />
        </div>
      </div>

      <div className="text-center">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
           Configurer l&apos;authentification à deux facteurs
        </h3>
        <p className="text-sm text-slate-600">
           Scannez le QR code avec votre application d&apos;authentification (Google Authenticator, Authy, etc.)
        </p>
      </div>

      {isGenerating ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center space-y-4">
             <div className="p-4 bg-white border border-slate-200 rounded-lg">
               {/* eslint-disable-next-line @next/next/no-img-element */}
               <img
                 src={qrCodeUrl}
                 alt="QR Code for 2FA setup"
                 className="w-48 h-48 object-contain mx-auto"
               />
             </div>

            <div className="w-full max-w-md">
              <div className="flex items-center gap-2 mb-2">
                <Key className="w-4 h-4 text-slate-500" />
                <Label className="text-sm font-medium">Clé secrète manuelle</Label>
              </div>
              <div className="flex gap-2">
                <Input
                  value={secret}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleCopySecret}
                  disabled={copiedSecret}
                >
                  {copiedSecret ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Utilisez cette clé si vous ne pouvez pas scanner le QR code
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-sm font-medium text-blue-900">
                  Instructions importantes
                </p>
                <ul className="text-xs text-blue-800 space-y-1">
                   <li>• Gardez votre application d&apos;authentification ouverte après l&apos;ajout du compte</li>
                   <li>• Vous aurez besoin d&apos;un code à 6 chiffres pour l&apos;étape suivante</li>
                   <li>• Assurez-vous que l&apos;heure de votre appareil est synchronisée</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isGenerating}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              type="button"
              onClick={() => setStep('verify')}
              disabled={isGenerating}
              className="flex-1"
            >
               J&apos;ai ajouté le compte
            </Button>
          </div>
        </>
      )}
    </div>
  );

  const renderVerifyStep = () => (
    <div className="space-y-6">
      <div className="flex justify-center">
        <div className="rounded-full bg-blue-100 p-3">
          <Key className="h-8 w-8 text-blue-600" />
        </div>
      </div>

      <div className="text-center">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
           Vérifier le code d&apos;authentification
        </h3>
        <p className="text-sm text-slate-600">
           Entrez le code à 6 chiffres généré par votre application d&apos;authentification
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="verificationCode">Code de vérification</Label>
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
            disabled={isEnabling}
          />
          {errors.verificationCode && (
            <p className="text-sm text-destructive">{errors.verificationCode}</p>
          )}
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <p className="text-sm text-slate-600">
             <strong>Problème ?</strong> Vérifiez que l&apos;heure de votre appareil est correcte et que vous avez bien ajouté le compte dans votre application.
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep('qr')}
            disabled={isEnabling}
            className="flex-1"
          >
            Retour
          </Button>
          <Button
            type="button"
            onClick={handleVerify}
            disabled={isEnabling}
            className="flex-1"
          >
            {isEnabling ? 'Vérification...' : 'Vérifier et activer'}
          </Button>
        </div>
      </div>
    </div>
  );

  const renderRecoveryStep = () => (
    <div className="space-y-6">
      <div className="flex justify-center">
        <div className="rounded-full bg-green-100 p-3">
          <Shield className="h-8 w-8 text-green-600" />
        </div>
      </div>

      <div className="text-center">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Authentification à deux facteurs activée !
        </h3>
        <p className="text-sm text-slate-600">
          Voici vos codes de récupération. Conservez-les en lieu sûr.
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-900 mb-1">
                Important : Conservez ces codes en sécurité
              </p>
              <p className="text-xs text-amber-800">
                 Ces codes vous permettent de récupérer l&apos;accès à votre compte si vous perdez votre appareil d&apos;authentification. Chaque code ne peut être utilisé qu&apos;une seule fois.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-2 font-mono text-sm">
            {recoveryCodes.map((code, index) => (
              <div key={index} className="p-2 bg-white rounded border text-center">
                {code}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCopyRecoveryCodes}
            disabled={copiedRecoveryCodes}
            className="flex-1"
          >
            {copiedRecoveryCodes ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            {copiedRecoveryCodes ? 'Copié !' : 'Copier les codes'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleDownloadRecoveryCodes}
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            Télécharger
          </Button>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleComplete}
            className="flex-1"
          >
            Terminer
          </Button>
        </div>
      </div>
    </div>
  );

  const stepTitles = {
    qr: 'Configurer l\'authentification à deux facteurs',
    verify: 'Vérifier le code',
    recovery: 'Codes de récupération'
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={stepTitles[step]}
      size="md"
    >
      <div className="space-y-4">
        {renderStepIndicator()}
        {step === 'qr' && renderQrStep()}
        {step === 'verify' && renderVerifyStep()}
        {step === 'recovery' && renderRecoveryStep()}
      </div>
    </Modal>
  );
};

export default TwoFactorSetupModal;