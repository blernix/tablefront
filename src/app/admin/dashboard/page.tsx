'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminDashboard, useExportData } from '@/hooks/api/useAdminDashboard';
import AdminDashboardSkeleton from '@/components/skeleton/AdminDashboardSkeleton';
import { toast } from 'sonner';

export default function AdminDashboardPage() {
  const { data, isLoading, error, refetch } = useAdminDashboard();
  const exportMutation = useExportData();

  const stats = data?.stats;

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
          {/* Restaurants Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{stats.restaurants.total}</CardTitle>
                <CardDescription>Restaurants total</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  <span className="text-green-600 font-medium">{stats.restaurants.active} actifs</span>
                  {' · '}
                  <span className="text-gray-600">{stats.restaurants.inactive} inactifs</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{stats.restaurants.active}</CardTitle>
                <CardDescription>Restaurants actifs</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{stats.restaurants.recent}</CardTitle>
                <CardDescription>Nouveaux (30 jours)</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{stats.reservations.recent}</CardTitle>
                <CardDescription>Réservations (7 jours)</CardDescription>
              </CardHeader>
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
              <CardDescription>Top 5 des 30 derniers jours</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.topRestaurants.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">Aucune donnée de réservation</p>
              ) : (
                <div className="space-y-3">
                  {stats.topRestaurants.map((restaurant: any, index: number) => (
                    <div key={restaurant.restaurantId} className="flex items-center justify-between border-b pb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-gray-400 w-6">{index + 1}</span>
                        <div>
                          <p className="font-medium">{restaurant.restaurantName}</p>
                          <p className="text-sm text-muted-foreground">{restaurant.restaurantId}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{restaurant.reservationCount}</p>
                        <p className="text-sm text-muted-foreground">réservations</p>
                      </div>
                    </div>
                  ))}
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
                        <p className="text-sm text-muted-foreground">{stats?.restaurants.total} restaurants</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleExport('restaurants')}
                      disabled={isExporting}
                    >
                      {exportMutation.variables === 'restaurants' && isExporting ? 'Exportation...' : 'Exporter CSV'}
                    </Button>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-green-600 font-bold">U</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">Utilisateurs</h3>
                        <p className="text-sm text-muted-foreground">{stats?.users.total} utilisateurs</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleExport('users')}
                      disabled={isExporting}
                    >
                      {exportMutation.variables === 'users' && isExporting ? 'Exportation...' : 'Exporter CSV'}
                    </Button>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-purple-600 font-bold">V</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">Réservations</h3>
                        <p className="text-sm text-muted-foreground">{stats?.reservations.recent} (7 jours)</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleExport('reservations')}
                      disabled={isExporting}
                    >
                      {exportMutation.variables === 'reservations' && isExporting ? 'Exportation...' : 'Exporter CSV'}
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
                  <p>Les fichiers CSV contiennent toutes les données disponibles. L&apos;export peut prendre quelques secondes.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </>
  );
}