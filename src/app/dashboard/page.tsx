'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import {
  useDashboardData,
  useShouldShowQuota,
  useHasRevenueTracking,
  FeatureUpgradeSection,
  UpgradeCTA,
  useIsStarter,
} from '@/features';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Utensils,
  Users,
  TrendingUp,
  Clock,
  Euro,
  ArrowRight,
  Plus,
  Crown,
  Settings as SettingsIcon,
  AlertTriangle,
  CheckCircle,
  Globe,
  Loader2,
  Play,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { apiClient } from '@/lib/api';
import { useDashboardStore } from '@/store/dashboardStore';
import TourProvider from '@/components/tour/TourProvider';
import TourStep from '@/components/tour/TourStep';
import { TourTrigger } from '@/components/tour/TourTrigger';
import { DASHBOARD_TOUR_STEPS } from '@/components/tour/steps';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, initAuth, isInitialized } = useAuthStore();
  const { fetchStats } = useDashboardStore();

  // Use our optimized dashboard hooks
  const dashboardData = useDashboardData();
  const quotaInfo = useShouldShowQuota();

  const revenueInfo = useHasRevenueTracking();

  const isStarter = useIsStarter();

  const { restaurant, stats, isLoading, isSelfService } = dashboardData;

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
      alert("Impossible d'accéder au portail de gestion d'abonnement. Veuillez réessayer.");
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
    <TourProvider steps={DASHBOARD_TOUR_STEPS}>
      <div className="space-y-6 p-4 md:p-6">
        <TourStep />
        <TourTrigger variant="floating" />
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
              <TourTrigger variant="badge" />
            </div>
          </div>
        </div>

        {/* Quota Indicator for Starter Plan */}
        {quotaInfo.shouldShow && quotaInfo.quota && (
          <Card
            className={`${
              quotaInfo.isOverLimit
                ? 'border-red-500 bg-gradient-to-r from-red-50 to-white'
                : quotaInfo.isNearLimit
                  ? 'border-amber-500 bg-gradient-to-r from-amber-50 to-white'
                  : 'border-[#E5E5E5]'
            }`}
          >
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center border ${
                        quotaInfo.isOverLimit
                          ? 'border-red-500 bg-red-500'
                          : quotaInfo.isNearLimit
                            ? 'border-amber-500 bg-amber-500'
                            : 'border-emerald-500 bg-emerald-500'
                      }`}
                    >
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
                      className={`mt-4 md:mt-0 ${
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
                <div className="space-y-2" data-tour="welcome">
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
                    <p className="text-sm font-medium text-red-900">Limite atteinte</p>
                    <p className="text-xs text-red-800 mt-1">
                      Vous avez atteint votre limite mensuelle de {quotaInfo.quota.limit}{' '}
                      réservations. Passez au plan Pro pour des réservations illimitées.
                    </p>
                  </div>
                )}
                {quotaInfo.isNearLimit && !quotaInfo.isOverLimit && (
                  <div className="bg-amber-50 border border-amber-200 p-3 rounded-md">
                    <p className="text-sm font-medium text-amber-900">Limite bientôt atteinte</p>
                    <p className="text-xs text-amber-800 mt-1">
                      Vous approchez de votre limite mensuelle. Pensez à passer au plan Pro pour des
                      réservations illimitées.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-3" data-tour="quick-actions">
          <Button
            onClick={() => router.push('/dashboard/reservations')}
            className="w-full sm:w-auto"
          >
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
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard/guide')}
            className="w-full sm:w-auto"
          >
            <HelpCircle className="h-4 w-4" />
            Guide de démarrage
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4" data-tour="stats-cards">
          <Card className="p-4 sm:p-6">
            <CardHeader className="flex flex-col pb-2 p-0 gap-2">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-[#0066FF]/5">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-[#0066FF]" />
              </div>
              <CardTitle className="text-[11px] sm:text-xs font-medium text-[#666666] uppercase tracking-wider truncate">Réservations du jour</CardTitle>
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

          <Card className="p-4 sm:p-6">
            <CardHeader className="flex flex-col pb-2 p-0 gap-2">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-[#0066FF]/5">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-[#0066FF]" />
              </div>
              <CardTitle className="text-[11px] sm:text-xs font-medium text-[#666666] uppercase tracking-wider truncate">
                Cette semaine
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-4">
              <div className="text-3xl font-light text-[#2A2A2A]">
                {stats.thisWeek.reservations || 0}
              </div>
              <p className="mt-1 text-sm text-[#666666]">{stats.thisWeek.guests || 0} convives</p>
            </CardContent>
          </Card>

          <Card className="p-4 sm:p-6">
            <CardHeader className="flex flex-col pb-2 p-0 gap-2">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-[#0066FF]/5">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-[#0066FF]" />
              </div>
              <CardTitle className="text-[11px] sm:text-xs font-medium text-[#666666] uppercase tracking-wider truncate">
                Occupation moyenne
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-4">
              <div className="text-3xl font-light text-[#2A2A2A]">
                {stats.thisWeek.avgOccupation?.toFixed(0) || 0}%
              </div>
              <p className="mt-1 text-sm text-[#666666]">{getTotalCapacity()} couverts max</p>
            </CardContent>
          </Card>

          <FeatureUpgradeSection feature="revenue-tracking">
            <Card className="p-4 sm:p-6">
              <CardHeader className="flex flex-col pb-2 p-0 gap-2">
                <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-[#059669]/5">
                  <Euro className="h-4 w-4 sm:h-5 sm:w-5 text-[#059669]" />
                </div>
                <CardTitle className="text-[11px] sm:text-xs font-medium text-[#666666] uppercase tracking-wider truncate">
                  CA estimé
                </CardTitle>
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
        <Card className="border-[#0066FF] bg-gradient-to-r from-blue-50 to-white rounded-xl">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#0066FF]">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[#2A2A2A]">Intégrez sur votre site</h3>
                  <p className="text-sm text-[#666666]">
                    Ajoutez le bouton de réservation flottant à votre site web en quelques clics
                  </p>
                </div>
              </div>
              <Button
                onClick={() => router.push('/dashboard/settings/integrations')}
                className="mt-4 md:mt-0 bg-[#0066FF] hover:bg-[#0052EB]"
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
        <div>
          {/* Upcoming Reservations */}
          <Card data-tour="upcoming-reservations">
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
                        {reservation.status === 'confirmed'
                          ? 'Confirmée'
                          : reservation.status === 'pending'
                            ? 'En attente'
                            : reservation.status === 'completed'
                              ? 'Terminée'
                              : reservation.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Calendar className="h-12 w-12 text-[#E5E5E5] mx-auto mb-3" />
                  <p className="text-sm text-[#666666]">
                    Aucune réservation à venir aujourd&apos;hui
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </TourProvider>
  );
}
