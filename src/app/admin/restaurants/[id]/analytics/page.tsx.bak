'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format, subDays } from 'date-fns';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Restaurant, RestaurantAnalytics } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DailyReservationsChart, StatusDistributionChart, TimeSlotsChart } from '@/components/charts';

export default function RestaurantAnalyticsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { isAuthenticated, user, initAuth, isInitialized } = useAuthStore();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [analytics, setAnalytics] = useState<RestaurantAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  const [period, setPeriod] = useState('30d');
  const [customRange, setCustomRange] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

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
  }, [isInitialized, isAuthenticated, user, router]);

  useEffect(() => {
    if (!startDate || !endDate) {
      const today = new Date();
      const thirtyDaysAgo = subDays(today, 30);
      setStartDate(format(thirtyDaysAgo, 'yyyy-MM-dd'));
      setEndDate(format(today, 'yyyy-MM-dd'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchRestaurant = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getRestaurant(params.id);
      setRestaurant(response.restaurant);
    } catch (err) {
      toast.error('Erreur lors du chargement du restaurant');
      router.push('/admin/restaurants');
    } finally {
      setIsLoading(false);
    }
  }, [params.id, router]);

  const loadAnalytics = useCallback(async () => {
    try {
      setIsLoadingAnalytics(true);
      let response;
      if (customRange && startDate && endDate) {
        response = await apiClient.getRestaurantAnalytics(params.id, undefined, startDate, endDate);
      } else {
        response = await apiClient.getRestaurantAnalytics(params.id, period);
      }
      setAnalytics(response.analytics);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors du chargement des statistiques');
    } finally {
      setIsLoadingAnalytics(false);
    }
  }, [params.id, period, customRange, startDate, endDate]);

  useEffect(() => {
    fetchRestaurant();
  }, [params.id, fetchRestaurant]);

  useEffect(() => {
    if (restaurant && !customRange) {
      loadAnalytics();
    }
  }, [restaurant, period, customRange, loadAnalytics]);

  if (!isInitialized) {
    return <div className="p-8">Chargement...</div>;
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return <div className="p-8">Chargement...</div>;
  }

  if (isLoading) {
    return <div className="p-8">Chargement...</div>;
  }

  if (!restaurant) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.push(`/admin/restaurants/${params.id}`)}>
              ← Retour au restaurant
            </Button>
            <Button variant="outline" onClick={() => router.push('/admin/restaurants')}>
              ← Liste des restaurants
            </Button>
          </div>
        </div>
        <div className="border-t">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-3">
              <div>
                <h1 className="text-xl font-bold">{restaurant.name}</h1>
                <p className="text-sm text-muted-foreground">Statistiques et analyses</p>
              </div>
               <div className="flex flex-col gap-3">
                 <div className="flex gap-2">
                   <Button
                     variant={!customRange && period === '7d' ? 'default' : 'outline'}
                     size="sm"
                     onClick={() => {
                       setCustomRange(false);
                       setPeriod('7d');
                     }}
                   >
                     7 jours
                   </Button>
                   <Button
                     variant={!customRange && period === '30d' ? 'default' : 'outline'}
                     size="sm"
                     onClick={() => {
                       setCustomRange(false);
                       setPeriod('30d');
                     }}
                   >
                     30 jours
                   </Button>
                   <Button
                     variant={!customRange && period === '90d' ? 'default' : 'outline'}
                     size="sm"
                     onClick={() => {
                       setCustomRange(false);
                       setPeriod('90d');
                     }}
                   >
                     90 jours
                   </Button>
                   <Button
                     variant={customRange ? 'default' : 'outline'}
                     size="sm"
                     onClick={() => {
                       setCustomRange(true);
                     }}
                   >
                     Période personnalisée
                   </Button>
                 </div>
                 
                 {customRange && (
                   <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                     <div className="flex items-center gap-2">
                       <label htmlFor="startDate" className="text-sm font-medium">Du</label>
                       <input
                         id="startDate"
                         type="date"
                         value={startDate}
                         onChange={(e) => setStartDate(e.target.value)}
                         className="px-3 py-1 border rounded text-sm"
                       />
                     </div>
                     <div className="flex items-center gap-2">
                       <label htmlFor="endDate" className="text-sm font-medium">au</label>
                       <input
                         id="endDate"
                         type="date"
                         value={endDate}
                         onChange={(e) => setEndDate(e.target.value)}
                         className="px-3 py-1 border rounded text-sm"
                       />
                     </div>
                     <Button
                       size="sm"
                       onClick={loadAnalytics}
                       disabled={isLoadingAnalytics}
                     >
                       Appliquer
                     </Button>
                     <Button
                       variant="outline"
                       size="sm"
                       onClick={() => setCustomRange(false)}
                     >
                       Annuler
                     </Button>
                   </div>
                 )}
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-6">
        {isLoadingAnalytics ? (
          <div className="text-center py-8">Chargement des statistiques...</div>
        ) : analytics ? (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl">{analytics.summary.totalReservations}</CardTitle>
                  <CardDescription>Réservations totales</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl">{analytics.summary.totalGuests}</CardTitle>
                  <CardDescription>Total couverts</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl">{analytics.summary.occupationRate}%</CardTitle>
                  <CardDescription>Taux d&apos;occupation</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl">{analytics.summary.estimatedRevenue.toFixed(2)} €</CardTitle>
                  <CardDescription>Revenu estimé</CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Status Distribution Chart */}
            <StatusDistributionChart 
              data={analytics.statusDistribution}
              totalReservations={analytics.summary.totalReservations}
            />

            {/* Top Time Slots Chart */}
            <TimeSlotsChart data={analytics.topTimeSlots} />

            {/* Daily Reservations Chart */}
            <DailyReservationsChart data={analytics.dailyStats} />

            {/* Daily Stats Table */}
            <Card>
              <CardHeader>
                <CardTitle>Statistiques quotidiennes</CardTitle>
                <CardDescription>Réservations par jour</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4 text-sm font-medium">Date</th>
                        <th className="text-left py-2 px-4 text-sm font-medium">Réservations</th>
                        <th className="text-left py-2 px-4 text-sm font-medium">Couverts</th>
                        <th className="text-left py-2 px-4 text-sm font-medium">Revenu estimé</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.dailyStats.map((day) => (
                        <tr key={day.date} className="border-b hover:bg-gray-50">
                          <td className="py-2 px-4 text-sm">
                            {new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
                          </td>
                          <td className="py-2 px-4 text-sm font-medium">{day.reservations}</td>
                          <td className="py-2 px-4 text-sm">{day.guests}</td>
                          <td className="py-2 px-4 text-sm">{day.revenue.toFixed(2)} €</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Aucune donnée disponible</CardTitle>
              <CardDescription>Ce restaurant n&apos;a pas encore de réservations pour cette période</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Les statistiques apparaîtront dès que des réservations seront enregistrées.
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}