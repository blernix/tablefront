'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user, initAuth, logout, isInitialized } = useAuthStore();

  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (!isInitialized) return;
    
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user?.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    fetchDashboardStats();
  }, [isInitialized, isAuthenticated, user, router]);

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getAdminDashboard();
      setStats(response.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard stats');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async (type: 'restaurants' | 'users' | 'reservations') => {
    try {
      setExporting(type);
      setExportError(null);
      
      switch (type) {
        case 'restaurants':
          await apiClient.exportRestaurants();
          break;
        case 'users':
          await apiClient.exportUsers();
          break;
        case 'reservations':
          await apiClient.exportReservations();
          break;
      }
      
      // Clear exporting state after a short delay to show success
      setTimeout(() => setExporting(null), 1000);
    } catch (err) {
      setExportError(err instanceof Error ? err.message : `Failed to export ${type}`);
      setExporting(null);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (!isInitialized) {
    return <div className="p-8">Chargement...</div>;
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return <div className="p-8">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold">TableMaster Admin</h1>
            <nav className="flex gap-4">
              <Button variant="link" onClick={() => router.push('/admin/restaurants')}>
                Restaurants
              </Button>
              <Button variant="link" className="font-semibold">
                Tableau de bord
              </Button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Tableau de bord Admin</h2>
           <p className="text-muted-foreground">Vue d&apos;ensemble de la plateforme</p>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Chargement des statistiques...</div>
        ) : error ? (
          <div className="text-center py-8 text-destructive">{error}</div>
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
                        disabled={exporting !== null}
                      >
                        {exporting === 'restaurants' ? 'Exportation...' : 'Exporter CSV'}
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
                        disabled={exporting !== null}
                      >
                        {exporting === 'users' ? 'Exportation...' : 'Exporter CSV'}
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
                        disabled={exporting !== null}
                      >
                        {exporting === 'reservations' ? 'Exportation...' : 'Exporter CSV'}
                      </Button>
                    </div>
                  </div>
                  
                  {exportError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-700">{exportError}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 text-red-700 hover:text-red-800"
                        onClick={() => setExportError(null)}
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
      </div>
    </div>
  );
}