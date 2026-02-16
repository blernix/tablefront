'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, TrendingUp, Users, Calendar, Euro } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { RestaurantAnalytics } from '@/types';

export default function RestaurantAnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<RestaurantAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const restaurantId = params.id as string;

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.admin.getRestaurantAnalytics(restaurantId);
        setAnalytics(response.analytics);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (restaurantId) {
      fetchAnalytics();
    }
  }, [restaurantId]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/admin/restaurants/${restaurantId}`)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-light text-[#2A2A2A]">Statistiques détaillées</h1>
            <p className="text-sm text-[#666666]">
              Analyse des performances et tendances du restaurant
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0066FF] mb-4"></div>
          <p className="text-[#666666]">Chargement des statistiques...</p>
        </div>
      ) : analytics ? (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="card-hover p-6">
              <CardHeader className="flex flex-row items-center justify-between pb-2 p-0">
                <CardTitle className="text-xs font-medium text-[#666666] uppercase tracking-[0.2em]">
                  Réservations totales
                </CardTitle>
                <div className="flex h-12 w-12 items-center justify-center border border-[#E5E5E5]">
                  <Calendar className="h-6 w-6 text-[#0066FF]" />
                </div>
              </CardHeader>
              <CardContent className="p-0 pt-4">
                <div className="text-3xl font-light text-[#2A2A2A]">
                  {analytics.summary.totalReservations}
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover p-6">
              <CardHeader className="flex flex-row items-center justify-between pb-2 p-0">
                <CardTitle className="text-xs font-medium text-[#666666] uppercase tracking-[0.2em]">
                  Total couverts
                </CardTitle>
                <div className="flex h-12 w-12 items-center justify-center border border-[#E5E5E5]">
                  <Users className="h-6 w-6 text-[#0066FF]" />
                </div>
              </CardHeader>
              <CardContent className="p-0 pt-4">
                <div className="text-3xl font-light text-[#2A2A2A]">
                  {analytics.summary.totalGuests}
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover p-6">
              <CardHeader className="flex flex-row items-center justify-between pb-2 p-0">
                <CardTitle className="text-xs font-medium text-[#666666] uppercase tracking-[0.2em]">
                  Taux d&apos;occupation
                </CardTitle>
                <div className="flex h-12 w-12 items-center justify-center border border-[#E5E5E5]">
                  <TrendingUp className="h-6 w-6 text-[#0066FF]" />
                </div>
              </CardHeader>
              <CardContent className="p-0 pt-4">
                <div className="text-3xl font-light text-[#2A2A2A]">
                  {analytics.summary.occupationRate}%
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover p-6">
              <CardHeader className="flex flex-row items-center justify-between pb-2 p-0">
                <CardTitle className="text-xs font-medium text-[#666666] uppercase tracking-[0.2em]">
                  Revenu estimé
                </CardTitle>
                <div className="flex h-12 w-12 items-center justify-center border border-[#E5E5E5]">
                  <Euro className="h-6 w-6 text-[#0066FF]" />
                </div>
              </CardHeader>
              <CardContent className="p-0 pt-4">
                <div className="text-3xl font-light text-[#2A2A2A]">
                  {analytics.summary.estimatedRevenue.toFixed(2)} €
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Répartition par statut</CardTitle>
                <CardDescription>Distribution des réservations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(analytics.statusDistribution).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            status === 'confirmed'
                              ? 'bg-green-500'
                              : status === 'pending'
                                ? 'bg-yellow-500'
                                : status === 'completed'
                                  ? 'bg-blue-500'
                                  : 'bg-gray-500'
                          }`}
                        />
                        <span className="font-medium capitalize">{status}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold">{count}</span>
                        <span className="text-sm text-[#666666]">
                          ({((count / analytics.summary.totalReservations) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Créneaux horaires populaires</CardTitle>
                <CardDescription>Top 5 des heures les plus réservées</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.topTimeSlots.slice(0, 5).map((slot) => (
                    <div key={slot.hour} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="font-bold text-blue-700">{slot.hour}</span>
                        </div>
                        <span className="font-medium">{slot.hour}:00</span>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold">{slot.count}</span>
                        <p className="text-sm text-[#666666]">réservations</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informations complémentaires</CardTitle>
              <CardDescription>Données supplémentaires d&apos;analyse</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#666666] mb-4">
                Ces statistiques sont mises à jour quotidiennement et couvrent toutes les
                réservations effectuées via TableMaster. Les données incluent les réservations
                confirmées, en attente, terminées et annulées.
              </p>
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => window.print()}>
                  Exporter en PDF
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push(`/admin/restaurants/${restaurantId}`)}
                >
                  Retour au restaurant
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <TrendingUp className="h-16 w-16 text-[#E5E5E5]" />
              <div>
                <h3 className="text-lg font-medium text-[#2A2A2A] mb-2">
                  Aucune donnée statistique disponible
                </h3>
                <p className="text-sm text-[#666666] max-w-md mx-auto">
                  Les statistiques apparaîtront après les premières réservations du restaurant.
                  Consultez cette page ultérieurement pour analyser les performances.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => router.push(`/admin/restaurants/${restaurantId}`)}
              >
                Retour au restaurant
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
