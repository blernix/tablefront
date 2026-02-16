'use client';

import { useState } from 'react';
import Modal from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface ManageSubscriptionDialogProps {
  restaurantId: string;
  restaurantName: string;
  currentPlan?: 'starter' | 'pro' | 'enterprise';
  currentStatus?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

type ActionType = 'change_plan' | 'extend_subscription' | 'activate' | 'cancel';

export function ManageSubscriptionDialog({
  restaurantId,
  restaurantName,
  currentPlan,
  currentStatus,
  stripeCustomerId,
  stripeSubscriptionId,
  open,
  onOpenChange,
  onSuccess,
}: ManageSubscriptionDialogProps) {
  const [action, setAction] = useState<ActionType>('change_plan');
  const [plan, setPlan] = useState<'starter' | 'pro' | 'enterprise'>(currentPlan || 'starter');
  const [days, setDays] = useState<string>('30');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [syncInfo, setSyncInfo] = useState<{
    hasStripeSubscription?: boolean;
    note?: string;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
  } | null>(null);
  const [syncStatus, setSyncStatus] = useState<{
    inSync?: boolean;
    differences?: Record<string, any>;
    lastSync?: string;
    loading?: boolean;
  } | null>(null);

  const checkSyncStatus = async () => {
    try {
      setSyncStatus((prev) => ({ ...prev, loading: true }));

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/restaurants/${restaurantId}/subscription/sync-status`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message || 'Erreur lors de la vérification de synchronisation'
        );
      }

      const data = await response.json();
      setSyncStatus({
        inSync: data.inSync,
        differences: data.differences,
        lastSync: data.lastSync,
        loading: false,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur de vérification');
      setSyncStatus((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setSyncInfo(null);
      setSyncStatus(null);

      const payload: any = { action };

      if (action === 'change_plan' || action === 'activate') {
        payload.plan = plan;
      }

      if (action === 'extend_subscription') {
        const daysNumber = parseInt(days);
        if (isNaN(daysNumber) || daysNumber < 1 || daysNumber > 365) {
          toast.error('Le nombre de jours doit être entre 1 et 365');
          return;
        }
        payload.days = daysNumber;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/restaurants/${restaurantId}/subscription/manage`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Erreur lors de la gestion de l'abonnement");
      }

      const data = await response.json();

      // Store sync information
      if (data.syncInfo || data.subscription) {
        setSyncInfo({
          hasStripeSubscription: data.syncInfo?.hasStripeSubscription,
          note: data.syncInfo?.note,
          stripeCustomerId: data.subscription?.stripeCustomerId,
          stripeSubscriptionId: data.subscription?.stripeSubscriptionId,
        });
      }

      toast.success(data.message || 'Abonnement mis à jour avec succès');

      // Call success callback to refresh parent data
      onSuccess?.();

      // Auto-check sync status after update
      setTimeout(() => {
        checkSyncStatus();
      }, 1000);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erreur lors de la gestion de l'abonnement"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const description = currentPlan
    ? `Restaurant : ${restaurantName} · Plan actuel : ${currentPlan === 'pro' ? 'Pro' : 'Starter'}${currentStatus ? ` · ${currentStatus}` : ''}`
    : `Restaurant : ${restaurantName}`;

  return (
    <Modal
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title="Gérer l'abonnement"
      description={description}
      size="md"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="action">Action</Label>
          <select
            id="action"
            value={action}
            onChange={(e) => setAction(e.target.value as ActionType)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="change_plan">Changer de plan</option>
            <option value="extend_subscription">Offrir des jours gratuits</option>
            <option value="activate">Activer/Réactiver</option>
            <option value="cancel">Annuler l&apos;abonnement</option>
          </select>
        </div>

        {(action === 'change_plan' || action === 'activate') && (
          <div className="space-y-2">
            <Label htmlFor="plan">Plan</Label>
            <select
              id="plan"
              value={plan}
              onChange={(e) => setPlan(e.target.value as 'starter' | 'pro')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="starter">Starter (39€/mois · 400 résa/mois)</option>
              <option value="pro">Pro (69€/mois · Illimité)</option>
            </select>
          </div>
        )}

        {action === 'extend_subscription' && (
          <div className="space-y-2">
            <Label htmlFor="days">Nombre de jours à offrir</Label>
            <Input
              id="days"
              type="number"
              min="1"
              max="365"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              placeholder="30"
            />
            <p className="text-sm text-gray-600">
              Entre 1 et 365 jours. Prolonge la période d&apos;abonnement actuelle.
            </p>
          </div>
        )}

        {action === 'cancel' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700">
              ⚠️ L&apos;abonnement sera annulé mais restera actif jusqu&apos;à la fin de la période
              en cours.
            </p>
          </div>
        )}

        {action === 'change_plan' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-700">
              💡 Le changement de plan est immédiat. Le quota de réservations sera mis à jour
              automatiquement.
            </p>
          </div>
        )}

        {action === 'activate' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-700">
              ✅ Active ou réactive l&apos;abonnement pour 30 jours avec le plan sélectionné.
            </p>
          </div>
        )}

        {action === 'extend_subscription' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-700">
              🎁 Offre des jours gratuits au restaurant. La période d&apos;abonnement sera
              prolongée.
            </p>
          </div>
        )}

        {/* Stripe Information Section */}
        <div className="border-t pt-4 mt-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-sm">Informations Stripe</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={checkSyncStatus}
              disabled={syncStatus?.loading}
            >
              {syncStatus?.loading ? 'Vérification...' : 'Vérifier synchronisation'}
            </Button>
          </div>

          {/* Current Stripe IDs */}
          {(stripeCustomerId || stripeSubscriptionId) && (
            <div className="bg-gray-50 rounded-lg p-3 mb-3">
              <p className="text-xs text-gray-600 mb-1">IDs Stripe actuels :</p>
              {stripeCustomerId && (
                <p className="text-xs font-mono break-all">
                  Customer: <span className="text-blue-600">{stripeCustomerId}</span>
                </p>
              )}
              {stripeSubscriptionId && (
                <p className="text-xs font-mono break-all">
                  Subscription: <span className="text-blue-600">{stripeSubscriptionId}</span>
                </p>
              )}
            </div>
          )}

          {/* Sync Info from last action */}
          {syncInfo && (
            <div
              className={`rounded-lg p-3 mb-3 ${syncInfo.hasStripeSubscription ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}
            >
              <p className="text-xs font-medium mb-1">
                {syncInfo.hasStripeSubscription
                  ? '✅ Synchronisé avec Stripe'
                  : '⚠️ Synchronisation partielle'}
              </p>
              <p className="text-xs">{syncInfo.note}</p>
              {syncInfo.stripeCustomerId && (
                <p className="text-xs font-mono break-all mt-1">
                  Customer ID: <span className="text-blue-600">{syncInfo.stripeCustomerId}</span>
                </p>
              )}
              {syncInfo.stripeSubscriptionId && (
                <p className="text-xs font-mono break-all">
                  Subscription ID:{' '}
                  <span className="text-blue-600">{syncInfo.stripeSubscriptionId}</span>
                </p>
              )}
            </div>
          )}

          {/* Sync Status Check Results */}
          {syncStatus && !syncStatus.loading && (
            <div
              className={`rounded-lg p-3 ${syncStatus.inSync ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}
            >
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-medium">
                  {syncStatus.inSync
                    ? '✅ Synchronisation vérifiée'
                    : '❌ Désynchronisation détectée'}
                </p>
                {syncStatus.lastSync && (
                  <p className="text-xs text-gray-500">
                    {new Date(syncStatus.lastSync).toLocaleDateString('fr-FR')}
                  </p>
                )}
              </div>

              {!syncStatus.inSync && syncStatus.differences && (
                <div className="mt-2">
                  <p className="text-xs font-medium mb-1">Différences :</p>
                  <div className="space-y-1">
                    {Object.entries(syncStatus.differences).map(([key, diff]: [string, any]) => (
                      <div key={key} className="text-xs bg-white rounded p-2 border">
                        <p className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                        <p>
                          MongoDB:{' '}
                          <span className="text-red-600">{JSON.stringify(diff.mongo)}</span>
                        </p>
                        <p>
                          Stripe:{' '}
                          <span className="text-green-600">{JSON.stringify(diff.stripe)}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {syncStatus.inSync && (
                <p className="text-xs">Les données MongoDB et Stripe sont synchronisées.</p>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'En cours...' : 'Confirmer'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
