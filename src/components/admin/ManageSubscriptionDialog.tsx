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
  open,
  onOpenChange,
  onSuccess,
}: ManageSubscriptionDialogProps) {
  const [action, setAction] = useState<ActionType>('change_plan');
  const [plan, setPlan] = useState<'starter' | 'pro' | 'enterprise'>(currentPlan || 'starter');
  const [days, setDays] = useState<string>('30');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

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

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/restaurants/${restaurantId}/subscription/manage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Erreur lors de la gestion de l\'abonnement');
      }

      const data = await response.json();

      toast.success(data.message || 'Abonnement mis à jour avec succès');
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la gestion de l\'abonnement');
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
              <option value="starter">Starter (39€/mois · 50 résa/mois)</option>
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
              ⚠️ L&apos;abonnement sera annulé mais restera actif jusqu&apos;à la fin de la période en cours.
            </p>
          </div>
        )}

        {action === 'change_plan' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-700">
              💡 Le changement de plan est immédiat. Le quota de réservations sera mis à jour automatiquement.
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
              🎁 Offre des jours gratuits au restaurant. La période d&apos;abonnement sera prolongée.
            </p>
          </div>
        )}

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
