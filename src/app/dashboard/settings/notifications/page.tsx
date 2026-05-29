'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import type { NotificationPreferences } from '@/types';
import { Bell, BellOff, Check, Loader2, AlertCircle, Mail, Smartphone, Zap, Info } from 'lucide-react';
import { UpgradeCTA, useIsStarter } from '@/features';

export default function NotificationsSettingsPage() {
  const {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    error,
    preferences,
    subscribe,
    unsubscribe,
    updatePreferences,
    loadPreferences,
  } = usePushNotifications();

  const isStarter = useIsStarter();
  const [localPreferences, setLocalPreferences] = useState(preferences);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setLocalPreferences(preferences);
  }, [preferences]);

  const handleToggleSubscription = async () => {
    if (isSubscribed) {
      await unsubscribe();
    } else {
      await subscribe();
    }
    await loadPreferences();
  };

  const handlePreferenceChange = (key: keyof NotificationPreferences, value: boolean) => {
    if (!localPreferences) return;
    setLocalPreferences({ ...localPreferences, [key]: value });
  };

  const handleSavePreferences = async () => {
    if (!localPreferences) return;
    setIsSaving(true);
    try {
      await updatePreferences({
        pushEnabled: localPreferences.pushEnabled,
        emailEnabled: localPreferences.emailEnabled,
        reservationCreated: localPreferences.reservationCreated,
        reservationConfirmed: localPreferences.reservationConfirmed,
        reservationCancelled: localPreferences.reservationCancelled,
        reservationUpdated: localPreferences.reservationUpdated,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const ToggleSwitch = ({ checked, onChange, disabled }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) => (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex h-7 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-out focus:outline-none ${
        checked ? 'bg-[#0066FF]' : 'bg-[#E5E5EA]'
      } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
    >
      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-out ${
        checked ? 'translate-x-5' : 'translate-x-0'
      }`} />
    </button>
  );

  if (!isSupported) {
    return (
      <div className="space-y-3">
        <div>
          <h1 className="text-[28px] font-bold text-[#000000] leading-tight tracking-tight md:text-3xl">Notifications</h1>
          <p className="mt-1 text-[15px] text-[#8E8E93] md:text-gray-600">Gérez vos préférences de notifications</p>
        </div>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 md:rounded-xl md:p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-800">
              <p className="font-semibold">Navigateur non supporté</p>
              <p className="mt-1">Les notifications push ne sont pas supportées par votre navigateur. Utilisez Chrome, Firefox, Edge ou Safari.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-[28px] font-bold text-[#000000] leading-tight tracking-tight md:text-3xl">Notifications</h1>
        <p className="mt-1 text-[15px] text-[#8E8E93] md:text-gray-600">Gérez vos préférences de notifications push et email</p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 md:rounded-xl">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm text-red-800">Erreur</p>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Push toggle */}
      <div className="bg-white rounded-2xl border border-[#E5E5EA] overflow-hidden md:rounded-xl">
        <div className="p-5 md:p-6">
          <div className="flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-[#0066FF]/10 flex items-center justify-center flex-shrink-0">
              <Bell className="h-5 w-5 text-[#0066FF]" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[17px] font-semibold text-[#000000] md:text-lg">Notifications push</h3>
              <p className="text-[13px] text-[#8E8E93] mt-0.5 md:text-sm">
                {isSubscribed
                  ? 'Vous recevez des notifications push en temps réel'
                  : permission === 'denied'
                    ? 'Notifications bloquées dans les paramètres du navigateur'
                    : permission === 'default'
                      ? 'Autorisez les notifications pour être alerté en temps réel'
                      : 'Activez les notifications push'}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <Button
              variant={isSubscribed ? 'destructive' : 'default'}
              onClick={handleToggleSubscription}
              disabled={isLoading || permission === 'denied'}
              className="w-full h-11 rounded-xl text-[15px] font-medium md:w-auto md:h-10 md:text-sm"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isSubscribed ? (
                <><BellOff className="mr-2 h-4 w-4" /> Désactiver</>
              ) : (
                <><Bell className="mr-2 h-4 w-4" /> Activer</>
              )}
            </Button>
          </div>

          {permission === 'denied' && (
            <div className="mt-4 rounded-xl bg-blue-50 border border-blue-100 p-4 md:rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Notifications bloquées</p>
                  <p className="mt-1">
                    Ouvrez les paramètres de votre navigateur et autorisez les notifications pour TableMaster.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Event preferences */}
      {localPreferences && (
        <div className="bg-white rounded-2xl border border-[#E5E5EA] overflow-hidden md:rounded-xl">
          <div className="p-5 md:p-6">
            <h3 className="text-[17px] font-semibold text-[#000000] mb-4 md:text-lg md:mb-5">Préférences par événement</h3>

            {/* Global toggles */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between py-1.5">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-[#8E8E93] flex-shrink-0" />
                  <div>
                    <p className="text-[15px] font-medium text-[#000000] md:text-base">Push</p>
                    <p className="text-[12px] text-[#8E8E93] mt-0.5 md:text-sm">Notifiez-moi sur mon appareil</p>
                  </div>
                </div>
                <ToggleSwitch
                  checked={localPreferences.pushEnabled}
                  onChange={(v) => handlePreferenceChange('pushEnabled', v)}
                  disabled={!isSubscribed}
                />
              </div>

              {isStarter ? (
                <div className="mt-2">
                  <UpgradeCTA feature="automated-emails" type="banner" />
                </div>
              ) : (
                <div className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-[#8E8E93] flex-shrink-0" />
                    <div>
                      <p className="text-[15px] font-medium text-[#000000] md:text-base">Email</p>
                      <p className="text-[12px] text-[#8E8E93] mt-0.5 md:text-sm">Recevoir des résumés par email</p>
                    </div>
                  </div>
                  <ToggleSwitch
                    checked={localPreferences.emailEnabled}
                    onChange={(v) => handlePreferenceChange('emailEnabled', v)}
                  />
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-[#E5E5EA] mb-5" />

            {/* Per-event toggles */}
            <div className="space-y-1">
              {[
                { key: 'reservationCreated' as const, label: 'Nouvelle réservation', desc: 'Quand un client fait une nouvelle réservation' },
                { key: 'reservationConfirmed' as const, label: 'Réservation confirmée', desc: 'Quand vous confirmez une réservation' },
                { key: 'reservationCancelled' as const, label: 'Réservation annulée', desc: 'Quand une réservation est annulée' },
                { key: 'reservationUpdated' as const, label: 'Réservation modifiée', desc: 'Quand une réservation est mise à jour' },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between py-3">
                  <div className="flex-1 min-w-0 mr-4">
                    <p className="text-[15px] font-medium text-[#000000] md:text-base">{label}</p>
                    <p className="text-[12px] text-[#8E8E93] mt-0.5 md:text-sm">{desc}</p>
                  </div>
                  <ToggleSwitch
                    checked={!!localPreferences[key]}
                    onChange={(v) => handlePreferenceChange(key, v)}
                    disabled={!localPreferences.pushEnabled && !localPreferences.emailEnabled}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-6 pt-4 border-t border-[#E5E5EA]">
              <Button onClick={handleSavePreferences} disabled={isSaving} className="w-full h-11 rounded-xl text-[15px] font-medium md:w-auto md:h-10 md:text-sm">
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                Enregistrer les préférences
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Info card */}
      <div className="bg-white rounded-2xl border border-[#E5E5EA] overflow-hidden md:rounded-xl">
        <div className="p-5 md:p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#F2F2F7] flex items-center justify-center flex-shrink-0">
              <Zap className="h-5 w-5 text-[#8E8E93]" />
            </div>
            <div>
              <h3 className="text-[17px] font-semibold text-[#000000] md:text-lg">Comment ça marche</h3>
              <p className="text-[12px] text-[#8E8E93] mt-0.5 md:text-sm md:text-gray-500">Tout ce qu&apos;il faut savoir sur les notifications</p>
            </div>
          </div>

          <div className="space-y-3 text-[13px] text-[#8E8E93] leading-relaxed md:text-sm md:text-gray-600">
            <div className="flex items-start gap-3">
              <Bell className="h-4 w-4 text-[#0066FF] flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#000000] md:text-gray-900">Push : </strong>
                Recevez des notifications directement sur votre appareil, même quand l&apos;application n&apos;est pas ouverte. Une connexion internet est nécessaire.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="h-4 w-4 text-[#0066FF] flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#000000] md:text-gray-900">Email : </strong>
                Recevez des emails pour les événements importants. Vérifiez que votre adresse email est à jour.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Smartphone className="h-4 w-4 text-[#0066FF] flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#000000] md:text-gray-900">Compatibilité : </strong>
                Chrome, Firefox, Edge, Safari (macOS et iOS 16.4+). Disponible sur ordinateur et mobile.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
