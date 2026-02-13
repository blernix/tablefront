'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { 
  useDashboardData,
  useShouldShowSubscription,
  useShouldShowQuota,
  useHasRevenueTracking,
  FeatureUpgradeSection,
  UpgradeCTA,
  useIsStarter
} from '@/features';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, Utensils, Users, TrendingUp, Clock, Euro, ArrowRight, Plus, 
  Crown, Settings as SettingsIcon, AlertTriangle, CheckCircle, Globe, Loader2 
} from 'lucide-react';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { apiClient } from '@/lib/api';
import { useDashboardStore } from '@/store/dashboardStore';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, initAuth, isInitialized } = useAuthStore();
  const { fetchStats } = useDashboardStore();
  
  // Use our optimized dashboard hooks
  const dashboardData = useDashboardData();
  const subscriptionInfo = useShouldShowSubscription();
  const quotaInfo = useShouldShowQuota();

  const revenueInfo = useHasRevenueTracking();

  const isStarter = useIsStarter();

  const { restaurant, stats, isLoading, isSelfService, plan } = dashboardData;

  // Initialize auth
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isInitialized) return;
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isInitialized, isAuthenticated, router]);

  // Fetch dashboard stats when authenticated and restaurant data is loaded
  useEffect(() => {
    if (isInitialized && isAuthenticated && restaurant && !isLoading) {
      fetchStats();
    }
  }, [isInitialized, isAuthenticated, restaurant, isLoading, fetchStats]);

  // Handle subscription management
  const [isManagingSubscription, setIsManagingSubscription] = useState(false);
  const handleManageSubscription = async () => {
    setIsManagingSubscription(true);
    try {
      const { url } = await apiClient.billing.createPortalSession();
      window.location.href = url;
    } catch (error) {
      console.error('Failed to create portal session:', error);
      alert('Impossible d\'accéder au portail de gestion d\'abonnement. Veuillez réessayer.');
    } finally {
      setIsManagingSubscription(false);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchStats(true); // Force refresh
  };

  // Loading states
  if (!isInitialized || !isAuthenticated) {
    return <LoadingSkeleton type="dashboard" />;
  }

  if (isLoading || !restaurant || !stats) {
    return <LoadingSkeleton type="dashboard" />;
  }

  // Helper functions for calculations
  const getTotalCapacity = () => {
    if (!restaurant.tablesConfig) return 0;
    
    if (restaurant.tablesConfig.mode === 'detailed' && restaurant.tablesConfig.tables) {
      return restaurant.tablesConfig.tables.reduce(
        (sum, table) => sum + table.quantity * table.capacity,
        0
      );
    }
    
    const totalTables = restaurant.tablesConfig.totalTables || 0;
    const avgCapacity = restaurant.tablesConfig.averageCapacity || 0;
    return totalTables * avgCapacity;
  };

  const getTotalTables = () => {
    if (!restaurant.tablesConfig) return 0;
    
    if (restaurant.tablesConfig.mode === 'detailed' && restaurant.tablesConfig.tables) {
      return restaurant.tablesConfig.tables.reduce((sum, table) => sum + table.quantity, 0);
    }
    
    return restaurant.tablesConfig.totalTables || 0;
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'danger';
      case 'completed':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="relative">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-[#0066FF]" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-light text-[#2A2A2A]">Tableau de bord</h1>
            <p className="text-sm text-[#666666]">
              {restaurant.name} • {restaurant.address}
            </p>
          </div>
           <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isLoading}
                className="h-10 sm:h-8"
              >
                {isLoading ? 'Rafraîchissement...' : 'Rafraîchir'}
              </Button>
             {isStarter && !subscriptionInfo.shouldShow && (
                <UpgradeCTA 
                  feature="widget-customization"
                  type="simple"
                  buttonText="Passer au Pro"
                  className="h-10 sm:h-8"
                />
             )}
           </div>
        </div>
      </div>

      {/* Subscription Indicator for Self-Service */}
      {subscriptionInfo.shouldShow && (
        <Card className="border-[#0066FF] bg-gradient-to-r from-blue-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center border border-[#0066FF] bg-[#0066FF]">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[#2A2A2A]">
                    Plan {plan === 'starter' ? 'Starter' : 'Pro'}
                  </h3>
                  <p className="text-sm text-[#666666]">
                    Statut : <Badge variant="success">Actif</Badge>
                  </p>
                  {restaurant.subscription?.currentPeriodEnd && (
                    <p className="text-xs text-[#666666] mt-1">
                      Renouvellement le {new Date(restaurant.subscription.currentPeriodEnd).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleManageSubscription}
                disabled={isManagingSubscription}
              >
                {isManagingSubscription ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <SettingsIcon className="h-4 w-4" />
                )}
                Gérer mon abonnement
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quota Indicator for Starter Plan */}
      {quotaInfo.shouldShow && quotaInfo.quota && (
        <Card className={`${
          quotaInfo.isOverLimit
            ? 'border-red-500 bg-gradient-to-r from-red-50 to-white'
            : quotaInfo.isNearLimit
            ? 'border-amber-500 bg-gradient-to-r from-amber-50 to-white'
            : 'border-[#E5E5E5]'
        }`}>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center border ${
                    quotaInfo.isOverLimit
                      ? 'border-red-500 bg-red-500'
                      : quotaInfo.isNearLimit
                      ? 'border-amber-500 bg-amber-500'
                      : 'border-emerald-500 bg-emerald-500'
                  }`}>
                    {quotaInfo.isOverLimit ? (
                      <AlertTriangle className="h-6 w-6 text-white" />
                    ) : quotaInfo.isNearLimit ? (
                      <AlertTriangle className="h-6 w-6 text-white" />
                    ) : (
                      <CheckCircle className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-[#2A2A2A]">
                      Quota de réservations mensuel
                    </h3>
                    <p className="text-sm text-[#666666]">
                      {quotaInfo.quota.current} / {quotaInfo.quota.limit} réservations ce mois
                    </p>
                  </div>
                </div>
                {quotaInfo.isNearLimit && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleManageSubscription}
                    className={`${
                      quotaInfo.isOverLimit
                        ? 'border-red-600 text-red-600 hover:bg-red-50'
                        : 'border-amber-600 text-amber-600 hover:bg-amber-50'
                    }`}
                  >
                    <Crown className="h-4 w-4" />
                    Passer au Pro
                  </Button>
                )}
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="h-2 w-full bg-[#E5E5E5] rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      quotaInfo.isOverLimit
                        ? 'bg-red-500'
                        : quotaInfo.isNearLimit
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(quotaInfo.quota.percentage, 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-[#666666]">
                  <span>{quotaInfo.quota.remaining} réservations restantes</span>
                  <span>{quotaInfo.quota.percentage}%</span>
                </div>
              </div>

              {/* Warning Messages */}
              {quotaInfo.isOverLimit && (
                <div className="bg-red-50 border border-red-200 p-3 rounded-md">
                  <p className="text-sm font-medium text-red-900">
                    Limite atteinte
                  </p>
                  <p className="text-xs text-red-800 mt-1">
                    Vous avez atteint votre limite mensuelle de {quotaInfo.quota.limit} réservations.
                    Passez au plan Pro pour des réservations illimitées.
                  </p>
                </div>
              )}
              {quotaInfo.isNearLimit && !quotaInfo.isOverLimit && (
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-md">
                  <p className="text-sm font-medium text-amber-900">
                    Limite bientôt atteinte
                  </p>
                  <p className="text-xs text-amber-800 mt-1">
                    Vous approchez de votre limite mensuelle. Pensez à passer au plan Pro pour des réservations illimitées.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={() => router.push('/dashboard/reservations')} className="w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Nouvelle réservation
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard/reservations')}
          className="w-full sm:w-auto"
        >
          <Calendar className="h-4 w-4" />
          Voir le calendrier
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="card-hover p-4 sm:p-8">
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-0">
            <CardTitle className="text-xs font-medium text-[#666666] uppercase tracking-[0.2em]">
              Réservations du jour
            </CardTitle>
            <div className="flex h-10 w-10 items-center justify-center border border-[#E5E5E5]">
              <Calendar className="h-5 w-5 text-[#0066FF]" />
            </div>
          </CardHeader>
          <CardContent className="p-0 pt-4">
            <div className="text-3xl font-light text-[#2A2A2A]">
              {stats.today.reservations || 0}
            </div>
            <p className="mt-1 text-sm text-[#666666]">
              {stats.today.guests || 0} {(stats.today.guests || 0) > 1 ? 'convives' : 'convive'}
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover p-4 sm:p-8">
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-0">
            <CardTitle className="text-xs font-medium text-[#666666] uppercase tracking-[0.2em]">
              Cette semaine
            </CardTitle>
            <div className="flex h-10 w-10 items-center justify-center border border-[#E5E5E5]">
              <TrendingUp className="h-5 w-5 text-[#0066FF]" />
            </div>
          </CardHeader>
          <CardContent className="p-0 pt-4">
            <div className="text-3xl font-light text-[#2A2A2A]">
              {stats.thisWeek.reservations || 0}
            </div>
            <p className="mt-1 text-sm text-[#666666]">
              {stats.thisWeek.guests || 0} convives
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover p-4 sm:p-8">
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-0">
            <CardTitle className="text-xs font-medium text-[#666666] uppercase tracking-[0.2em]">
              Occupation moyenne
            </CardTitle>
            <div className="flex h-10 w-10 items-center justify-center border border-[#E5E5E5]">
              <Users className="h-5 w-5 text-[#0066FF]" />
            </div>
          </CardHeader>
          <CardContent className="p-0 pt-4">
            <div className="text-3xl font-light text-[#2A2A2A]">
              {stats.thisWeek.avgOccupation?.toFixed(0) || 0}%
            </div>
            <p className="mt-1 text-sm text-[#666666]">
              {getTotalCapacity()} couverts max
            </p>
          </CardContent>
        </Card>

        <FeatureUpgradeSection feature="revenue-tracking">
        <Card className="card-hover p-4 sm:p-8">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-0">
              <CardTitle className="text-xs font-medium text-[#666666] uppercase tracking-[0.2em]">
                CA estimé
              </CardTitle>
              <div className="flex h-10 w-10 items-center justify-center border border-[#E5E5E5]">
                <Euro className="h-5 w-5 text-[#0066FF]" />
              </div>
            </CardHeader>
            <CardContent className="p-0 pt-4">
              {revenueInfo.isConfigured ? (
                <>
                  <div className="text-3xl font-light text-emerald-600">
                    {stats.today.estimatedRevenue?.toFixed(2) || '0.00'}€
                  </div>
                  <p className="mt-1 text-sm text-[#666666]">
                    {stats.thisWeek.estimatedRevenue?.toFixed(2) || '0.00'}€ cette semaine
                  </p>
                </>
              ) : (
                <>
                  <div className="text-3xl font-light text-[#666666]">--</div>
                  <p className="mt-1 text-sm text-[#666666]">Configurez le prix moyen</p>
                </>
              )}
            </CardContent>
          </Card>
        </FeatureUpgradeSection>
      </div>

      {/* Integration Card */}
      <Card className="border-[#0066FF] bg-gradient-to-r from-blue-50 to-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center border border-[#0066FF] bg-[#0066FF]">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-[#2A2A2A]">
                  Intégrez sur votre site
                </h3>
                <p className="text-sm text-[#666666]">
                  Ajoutez le bouton de réservation flottant à votre site web en quelques clics
                </p>
              </div>
            </div>
            <Button
              onClick={() => router.push('/dashboard/settings/integrations')}
              className="bg-[#0066FF] hover:bg-[#0052EB]"
            >
              Configurer
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade CTAs for Starter Users */}
      {isStarter && (
        <div className="grid gap-6 sm:grid-cols-2">
          <UpgradeCTA 
            feature="advanced-analytics"
            type="card"
            title="Analytics Avancés"
            description="Obtenez des insights détaillés sur vos réservations, revenus et performance."
          />
          <UpgradeCTA 
            feature="team-management"
            type="card"
            title="Gestion d'Équipe"
            description="Ajoutez des serveurs, gérez les permissions et collaborez efficacement."
          />
        </div>
      )}



      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Reservations */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Réservations à venir</CardTitle>
                <CardDescription>Aujourd&apos;hui</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/dashboard/reservations')}
              >
                Tout voir <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {stats.today.upcomingReservations && stats.today.upcomingReservations.length > 0 ? (
              <div className="space-y-3">
                {stats.today.upcomingReservations.slice(0, 5).map((reservation) => (
                  <div
                    key={reservation._id}
                    className="flex items-center justify-between border-b border-[#E5E5E5] pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{reservation.customerName}</p>
                      <p className="text-sm text-[#666666]">
                        {reservation.time} • {reservation.numberOfGuests} pers.
                      </p>
                    </div>
                    <Badge variant={getStatusBadgeVariant(reservation.status)}>
                      {reservation.status === 'confirmed' ? 'Confirmée' : 
                       reservation.status === 'pending' ? 'En attente' : 
                       reservation.status === 'completed' ? 'Terminée' : 
                       reservation.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <Calendar className="h-12 w-12 text-[#E5E5E5] mx-auto mb-3" />
                <p className="text-sm text-[#666666]">Aucune réservation à venir aujourd&apos;hui</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Menu Summary */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Carte & Menus</CardTitle>
                <CardDescription>Votre offre</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/dashboard/menus')}
              >
                Gérer <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-[#E5E5E5] p-4 rounded-md text-center">
                <Utensils className="h-8 w-8 text-[#0066FF] mx-auto mb-2" />
                <div className="text-2xl font-light text-[#2A2A2A]">
                  {stats.menu.categories || 0}
                </div>
                <p className="text-sm text-[#666666]">Catégories</p>
              </div>
              <div className="border border-[#E5E5E5] p-4 rounded-md text-center">
                <Utensils className="h-8 w-8 text-[#0066FF] mx-auto mb-2" />
                <div className="text-2xl font-light text-[#2A2A2A]">
                  {stats.menu.dishes || 0}
                </div>
                <p className="text-sm text-[#666666]">Plats</p>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#666666]">Configuration des tables</span>
                <Badge variant="outline">
                  {restaurant.tablesConfig?.mode === 'detailed' ? 'Détaillée' : 'Simple'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#666666]">Total tables</span>
                <span className="text-sm font-medium">{getTotalTables()}</span>
              </div>
               <div className="flex items-center justify-between">
                 <span className="text-sm text-[#666666]">Capacité totale</span>
                 <span className="text-sm font-medium">{getTotalCapacity()} couverts</span>
               </div>
             </div>
             
             {/* Upgrade CTA for menus feature */}
             {isStarter && (
               <div className="mt-6 pt-6 border-t border-[#E5E5E5]">
                 <UpgradeCTA 
                   feature="menus"
                   type="inline"
                   title="Gestion Complète des Menus"
                   description="Passez au plan Pro pour créer et gérer votre carte numérique."
                 />
               </div>
             )}
           </CardContent>
         </Card>
      </div>
    </div>
  );
}