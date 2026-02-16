'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminDashboard, useExportData } from '@/hooks/api/useAdminDashboard';
import AdminDashboardSkeleton from '@/components/skeleton/AdminDashboardSkeleton';
import { getPlanDisplay } from '@/features';
import { toast } from 'sonner';

export default function AdminDashboardPage() {
  const { data, isLoading, error, refetch } = useAdminDashboard();
  const exportMutation = useExportData();

  console.log('Dashboard data:', data);
  console.log('Abandoned signups:', data?.stats?.abandonedSignups);

  const stats = data?.stats;
  const abandoned = stats?.abandonedSignups;

  const handleExport = async (type: 'restaurants' | 'users' | 'reservations') => {
    try {
      await exportMutation.mutateAsync(type);
    } catch (err) {
      // Error handling is done in the mutation
    }
  };

  const isExporting = exportMutation.isPending;

  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold">Tableau de bord Admin</h2>
        <p className="text-muted-foreground">Vue d&apos;ensemble de la plateforme</p>
      </div>

      {isLoading ? (
        <AdminDashboardSkeleton />
      ) : error ? (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center gap-3 text-red-700">
              <p className="font-medium">{error.message}</p>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                Réessayer
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : stats ? (
        <div className="space-y-6">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white">
              <CardHeader className="pb-2">
                <CardDescription className="text-green-700">
                  Revenu Mensuel Récurrent
                </CardDescription>
                <CardTitle className="text-3xl text-green-600">{stats.revenue.mrr}€</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-green-600">
                  <span>
                    {stats.revenue.activeStarterCount} Starter · {stats.revenue.activeProCount} Pro
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
              <CardHeader className="pb-2">
                <CardDescription className="text-blue-700">Abonnements Actifs</CardDescription>
                <CardTitle className="text-3xl text-blue-600">
                  {stats.subscriptions.activeSubscriptions}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-blue-600">
                  <span>{stats.subscriptions.byStatus.trial} en essai</span>
                </div>
              </CardContent>
            </Card>
            <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
              <CardHeader className="pb-2">
                <CardDescription className="text-purple-700">Réservations Totales</CardDescription>
                <CardTitle className="text-3xl text-purple-600">
                  {stats.reservations.total.toLocaleString()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-purple-600">
                  <span>{stats.reservations.thisMonth} ce mois-ci</span>
                </div>
              </CardContent>
            </Card>
            <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white">
              <CardHeader className="pb-2">
                <CardDescription className="text-orange-700">Nouveaux Restaurants</CardDescription>
                <CardTitle className="text-3xl text-orange-600">
                  {stats.restaurants.recent}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-orange-600">
                  <span>30 derniers jours</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Account Type & Subscription Plans */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Types de Comptes</CardTitle>
                <CardDescription>Distinction comptes manuels vs auto-inscription</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-gray-600 font-bold text-lg">🛠️</span>
                      </div>
                      <div>
                        <p className="font-semibold">Comptes Manuels</p>
                        <p className="text-sm text-muted-foreground">Créés par admin</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">
                        {stats.restaurants.byAccountType.managed}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(
                          (stats.restaurants.byAccountType.managed / stats.restaurants.total) *
                          100
                        ).toFixed(0)}
                        %
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-lg">🚀</span>
                      </div>
                      <div>
                        <p className="font-semibold">Auto-inscription</p>
                        <p className="text-sm text-muted-foreground">Créés via Stripe</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">
                        {stats.restaurants.byAccountType.selfService}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(
                          (stats.restaurants.byAccountType.selfService / stats.restaurants.total) *
                          100
                        ).toFixed(0)}
                        %
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Plans d&apos;Abonnement</CardTitle>
                <CardDescription>Répartition des comptes auto-inscrits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <span className="text-yellow-600 font-bold">S</span>
                      </div>
                      <div>
                        <p className="font-semibold">Starter</p>
                        <p className="text-sm text-muted-foreground">39€/mois · 50 résa/mois</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{stats.subscriptions.byPlan.starter}</p>
                      <p className="text-xs text-green-600 font-medium">
                        {stats.revenue.breakdown.starter}€/mois
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-purple-600 font-bold">P</span>
                      </div>
                      <div>
                        <p className="font-semibold">Pro</p>
                        <p className="text-sm text-muted-foreground">69€/mois · Illimité</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{stats.subscriptions.byPlan.pro}</p>
                      <p className="text-xs text-green-600 font-medium">
                        {stats.revenue.breakdown.pro}€/mois
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Subscription Status & Reservations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Statut des Abonnements</CardTitle>
                <CardDescription>État des comptes auto-inscrits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Actifs
                    </span>
                    <span className="text-lg font-bold">{stats.subscriptions.byStatus.active}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      En essai
                    </span>
                    <span className="text-lg font-bold">{stats.subscriptions.byStatus.trial}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                      Paiement en retard
                    </span>
                    <span className="text-lg font-bold">
                      {stats.subscriptions.byStatus.pastDue}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      Annulés
                    </span>
                    <span className="text-lg font-bold">
                      {stats.subscriptions.byStatus.cancelled}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Métriques Réservations</CardTitle>
                <CardDescription>Performance globale de la plateforme</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total (tous temps)</span>
                    <span className="text-lg font-bold">
                      {stats.reservations.total.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Ce mois-ci</span>
                    <span className="text-lg font-bold">
                      {stats.reservations.thisMonth.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">7 derniers jours</span>
                    <span className="text-lg font-bold">
                      {stats.reservations.recent.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm font-medium">Utilisation quota moyenne (Starter)</span>
                    <span className="text-lg font-bold text-blue-600">
                      {stats.reservations.averageQuotaUsage}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Users Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Utilisateurs</CardTitle>
              <CardDescription>Répartition par rôle</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Administrateurs</span>
                    <span className="text-lg font-bold">{stats.users.admin}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gray-600"
                      style={{ width: `${(stats.users.admin / stats.users.total) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Gérants</span>
                    <span className="text-lg font-bold">{stats.users.restaurant}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600"
                      style={{ width: `${(stats.users.restaurant / stats.users.total) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Serveurs</span>
                    <span className="text-lg font-bold">{stats.users.server}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-600"
                      style={{ width: `${(stats.users.server / stats.users.total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Restaurants */}
          <Card>
            <CardHeader>
              <CardTitle>Restaurants les plus actifs</CardTitle>
              <CardDescription>
                Top 5 des 30 derniers jours (par nombre de réservations)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats.topRestaurants.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">
                  Aucune donnée de réservation
                </p>
              ) : (
                <div className="space-y-3">
                  {stats.topRestaurants.map((restaurant: any, index: number) => {
                    const planDisplay = getPlanDisplay(restaurant.subscriptionPlan);
                    return (
                      <div
                        key={restaurant.restaurantId}
                        className="flex items-center justify-between border-b pb-3"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <span className="text-lg font-bold text-gray-400 w-6">{index + 1}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{restaurant.restaurantName}</p>
                              {restaurant.accountType === 'managed' ? (
                                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full font-medium">
                                  Manuel
                                </span>
                              ) : (
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${planDisplay.badgeClass}`}
                                >
                                  {planDisplay.name}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {restaurant.restaurantId}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">{restaurant.reservationCount}</p>
                          <p className="text-sm text-muted-foreground">réservations</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Abandoned Signups */}
          <Card>
            <CardHeader>
              <CardTitle>Inscriptions abandonnées</CardTitle>
              <CardDescription>
                {abandoned?.total || 0} comptes créés sans paiement complet (30 derniers jours)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!abandoned || abandoned.total === 0 ? (
                <p className="text-center py-4 text-muted-foreground">
                  Aucune inscription abandonnée récente
                </p>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4 bg-red-50">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                          <span className="text-red-600 font-bold">⚠️</span>
                        </div>
                        <div>
                          <h3 className="font-semibold">Total abandonnées</h3>
                          <p className="text-2xl font-bold text-red-700">{abandoned.total}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Comptes self-service inactifs sans abonnement Stripe
                      </p>
                    </div>
                    <div className="border rounded-lg p-4 bg-amber-50">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                          <span className="text-amber-600 font-bold">📅</span>
                        </div>
                        <div>
                          <h3 className="font-semibold">Derniers 7 jours</h3>
                          <p className="text-2xl font-bold text-amber-700">
                            {abandoned.byDay.slice(0, 7).reduce((sum, day) => sum + day.count, 0)}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Tentatives d&apos;inscription récentes échouées
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Répartition par jour</h4>
                    <div className="space-y-2">
                      {abandoned.byDay.map((day) => (
                        <div
                          key={day._id}
                          className="flex items-center justify-between border-b pb-2"
                        >
                          <div>
                            <p className="font-medium">
                              {new Date(day._id).toLocaleDateString('fr-FR', {
                                weekday: 'short',
                                day: 'numeric',
                                month: 'short',
                              })}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {day.count} inscription{day.count > 1 ? 's' : ''}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              // TODO: Open modal with restaurant details
                              console.log('Day details:', day);
                            }}
                          >
                            Voir détails
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Data Export */}
          <Card>
            <CardHeader>
              <CardTitle>Export de données</CardTitle>
              <CardDescription>Téléchargez les données au format CSV</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-bold">R</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">Restaurants</h3>
                        <p className="text-sm text-muted-foreground">
                          {stats?.restaurants.total} restaurants
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleExport('restaurants')}
                      disabled={isExporting}
                    >
                      {exportMutation.variables === 'restaurants' && isExporting
                        ? 'Exportation...'
                        : 'Exporter CSV'}
                    </Button>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-green-600 font-bold">U</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">Utilisateurs</h3>
                        <p className="text-sm text-muted-foreground">
                          {stats?.users.total} utilisateurs
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleExport('users')}
                      disabled={isExporting}
                    >
                      {exportMutation.variables === 'users' && isExporting
                        ? 'Exportation...'
                        : 'Exporter CSV'}
                    </Button>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-purple-600 font-bold">V</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">Réservations</h3>
                        <p className="text-sm text-muted-foreground">
                          {stats?.reservations.total.toLocaleString()} total
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleExport('reservations')}
                      disabled={isExporting}
                    >
                      {exportMutation.variables === 'reservations' && isExporting
                        ? 'Exportation...'
                        : 'Exporter CSV'}
                    </Button>
                  </div>
                </div>

                {exportMutation.error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-700">{exportMutation.error.message}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 text-red-700 hover:text-red-800"
                      onClick={() => exportMutation.reset()}
                    >
                      Fermer
                    </Button>
                  </div>
                )}

                <div className="text-sm text-muted-foreground pt-2 border-t">
                  <p>
                    Les fichiers CSV contiennent toutes les données disponibles. L&apos;export peut
                    prendre quelques secondes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </>
  );
}
