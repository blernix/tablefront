'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import type { NotificationPreferences } from '@/types';
import { Bell, BellOff, Check, Loader2, AlertCircle } from 'lucide-react';


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

  const [localPreferences, setLocalPreferences] = useState(preferences);
  const [isSaving, setIsSaving] = useState(false);

  // Update local preferences when preferences change
  useEffect(() => {
    setLocalPreferences(preferences);
  }, [preferences]);

  // Handle toggle subscription
  const handleToggleSubscription = async () => {
    if (isSubscribed) {
      await unsubscribe();
    } else {
      await subscribe();
    }
    await loadPreferences();
  };

  // Handle preference change
  const handlePreferenceChange = (key: keyof NotificationPreferences, value: boolean) => {
    if (!localPreferences) return;
    
    setLocalPreferences({
      ...localPreferences,
      [key]: value,
    });
  };

  // Save preferences
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

  if (!isSupported) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="mt-2 text-gray-600">
            Gérez vos préférences de notifications
          </p>
        </div>

        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-start">
            <AlertCircle className="mr-2 h-4 w-4 text-red-600 mt-0.5" />
            <div className="text-sm text-red-800">
              <p className="font-medium">Navigateur non supporté</p>
              <p className="mt-1">
                Les notifications push ne sont pas supportées par votre navigateur.
                Veuillez utiliser un navigateur moderne comme Chrome, Firefox ou Edge.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <p className="mt-2 text-gray-600">
          Gérez vos préférences de notifications push et email
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-start">
            <AlertCircle className="mr-2 h-4 w-4 text-red-600 mt-0.5" />
            <div className="text-sm text-red-800">
              <p className="font-medium">Erreur</p>
              <p className="mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications Push
          </CardTitle>
          <CardDescription>
            Recevez des notifications en temps réel sur votre appareil
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Activer les notifications push</h3>
              <p className="text-sm text-gray-500">
                {isSubscribed
                  ? 'Vous recevez déjà des notifications push'
                  : permission === 'denied'
                  ? 'Vous avez bloqué les notifications. Veuillez modifier les paramètres de votre navigateur.'
                  : permission === 'default'
                  ? 'Vous n\'avez pas encore autorisé les notifications'
                  : 'Activez pour recevoir des notifications en temps réel'}
              </p>
            </div>
            <Button
              variant={isSubscribed ? "destructive" : "default"}
              onClick={handleToggleSubscription}
              disabled={isLoading || permission === 'denied'}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isSubscribed ? (
                <>
                  <BellOff className="mr-2 h-4 w-4" />
                  Désactiver
                </>
              ) : (
                <>
                  <Bell className="mr-2 h-4 w-4" />
                  Activer
                </>
              )}
            </Button>
          </div>

          {permission === 'denied' && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div className="flex items-start">
                <AlertCircle className="mr-2 h-4 w-4 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Notifications bloquées</p>
                  <p className="mt-1">
                    Vous avez bloqué les notifications. Pour les activer, allez dans les paramètres
                    de votre navigateur et autorisez les notifications pour ce site.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {localPreferences && (
        <Card>
          <CardHeader>
            <CardTitle>Préférences de notification</CardTitle>
            <CardDescription>
              Choisissez les événements pour lesquels vous souhaitez recevoir des notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Global toggles */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-enabled" className="font-medium">
                    Notifications push
                  </Label>
                  <p className="text-sm text-gray-500">
                    Activer/désactiver toutes les notifications push
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="push-enabled"
                  checked={localPreferences.pushEnabled}
                  onChange={(e) => handlePreferenceChange('pushEnabled', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  disabled={!isSubscribed}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-enabled" className="font-medium">
                    Notifications email
                  </Label>
                  <p className="text-sm text-gray-500">
                    Activer/désactiver toutes les notifications email
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="email-enabled"
                  checked={localPreferences.emailEnabled}
                  onChange={(e) => handlePreferenceChange('emailEnabled', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Event-specific preferences */}
            <div className="space-y-4">
              <h3 className="font-medium">Notifications par événement</h3>
              
              <div className="space-y-4 pl-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="reservation-created" className="font-medium">
                      Nouvelle réservation
                    </Label>
                    <p className="text-sm text-gray-500">
                      Quand un client fait une nouvelle réservation
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    id="reservation-created"
                    checked={localPreferences.reservationCreated}
                    onChange={(e) => handlePreferenceChange('reservationCreated', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    disabled={!localPreferences.pushEnabled && !localPreferences.emailEnabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="reservation-confirmed" className="font-medium">
                      Réservation confirmée
                    </Label>
                    <p className="text-sm text-gray-500">
                      Quand vous confirmez une réservation
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    id="reservation-confirmed"
                    checked={localPreferences.reservationConfirmed}
                    onChange={(e) => handlePreferenceChange('reservationConfirmed', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    disabled={!localPreferences.pushEnabled && !localPreferences.emailEnabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="reservation-cancelled" className="font-medium">
                      Réservation annulée
                    </Label>
                    <p className="text-sm text-gray-500">
                      Quand une réservation est annulée
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    id="reservation-cancelled"
                    checked={localPreferences.reservationCancelled}
                    onChange={(e) => handlePreferenceChange('reservationCancelled', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    disabled={!localPreferences.pushEnabled && !localPreferences.emailEnabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="reservation-updated" className="font-medium">
                      Réservation modifiée
                    </Label>
                    <p className="text-sm text-gray-500">
                      Quand une réservation est mise à jour (date, heure, nombre de personnes)
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    id="reservation-updated"
                    checked={localPreferences.reservationUpdated}
                    onChange={(e) => handlePreferenceChange('reservationUpdated', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    disabled={!localPreferences.pushEnabled && !localPreferences.emailEnabled}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                onClick={handleSavePreferences}
                disabled={isSaving || !isSubscribed}
              >
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Check className="mr-2 h-4 w-4" />
                )}
                Enregistrer les préférences
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>À propos des notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-600">
          <p>
            <strong>Notifications push :</strong> Vous recevez des notifications directement sur
            votre appareil même lorsque l&apos;application n&apos;est pas ouverte. Elles nécessitent
            une connexion internet.
          </p>
          <p>
            <strong>Notifications email :</strong> Vous recevez des emails pour les événements
            importants. Assurez-vous que votre adresse email est à jour dans vos paramètres.
          </p>
          <p>
            <strong>Compatibilité :</strong> Les notifications push sont supportées sur Chrome,
            Firefox, Edge et Safari (macOS). Elles ne sont pas disponibles sur iOS en raison
            des restrictions d&apos;Apple.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}