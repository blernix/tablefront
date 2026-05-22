'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiClient } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useDashboardData } from '@/features';
import { toast } from 'sonner';
import { ArrowLeft, Crown, Settings as SettingsIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AccountSettingsPage() {
  const { restaurant, plan } = useDashboardData();
  const [isManagingSubscription, setIsManagingSubscription] = useState(false);

  const subscription = restaurant?.subscription;

  const handleManageSubscription = async () => {
    setIsManagingSubscription(true);
    try {
      const { url } = await apiClient.billing.createPortalSession();
      window.location.href = url;
    } catch {
      toast.error("Impossible d'accéder au portail de gestion d'abonnement");
    } finally {
      setIsManagingSubscription(false);
    }
  };

  const planLabel = plan === 'pro' ? 'Pack Croissance' : 'Pack Gestion';
  const planPrice = plan === 'pro' ? '69€/mois' : '39€/mois';

  return (
    <div className="max-w-lg space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/settings">
          <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-light text-[#2A2A2A]">Abonnement</h1>
          <p className="text-sm text-gray-400 mt-1">Gérer votre plan et votre facturation</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Crown className="h-5 w-5 text-[#0066FF]" /> Votre plan actuel
          </CardTitle>
          <CardDescription>Abonnement géré via Stripe</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
            <div>
              <div className="text-lg font-medium text-[#2A2A2A]">{planLabel}</div>
              <div className="text-sm text-[#666666]">{planPrice}</div>
            </div>
            <Badge variant="success" className="text-sm">Actif</Badge>
          </div>

          {subscription && (
            <div className="space-y-2 text-sm text-[#666666]">
              <div className="flex justify-between">
                <span>Statut</span>
                <span className="font-medium">
                  {subscription.status === 'trial' ? 'Essai gratuit' : subscription.status === 'active' ? 'Actif' : subscription.status}
                </span>
              </div>
              {subscription.trialEndsAt && (
                <div className="flex justify-between">
                  <span>Fin de l&apos;essai</span>
                  <span className="font-medium">{new Date(subscription.trialEndsAt).toLocaleDateString('fr-FR')}</span>
                </div>
              )}
              {subscription.currentPeriodEnd && (
                <div className="flex justify-between">
                  <span>Prochain renouvellement</span>
                  <span className="font-medium">{new Date(subscription.currentPeriodEnd).toLocaleDateString('fr-FR')}</span>
                </div>
              )}
            </div>
          )}

          <Button
            onClick={handleManageSubscription}
            disabled={isManagingSubscription}
            className="w-full bg-[#0066FF] hover:bg-[#0052CC]"
          >
            {isManagingSubscription ? (
              <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Redirection...</>
            ) : (
              <><SettingsIcon className="h-4 w-4 mr-2" /> Gérer mon abonnement</>
            )}
          </Button>
          <p className="text-xs text-gray-400 text-center">
            Vous serez redirigé vers le portail de gestion Stripe
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
