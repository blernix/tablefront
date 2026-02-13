'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Bell, 
  Mail, 
  Radio, 
  TrendingUp, 
  TrendingDown,
  AlertCircle,
  CheckCircle,
  XCircle,
  Download,
  RefreshCw
} from 'lucide-react';
import { useNotificationAnalytics, useExportNotificationAnalytics } from '@/hooks/api/useAdminAnalytics';
import AdminAnalyticsSkeleton from '@/components/skeleton/AdminAnalyticsSkeleton';

export default function NotificationAnalyticsPage() {
  const router = useRouter();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  
  const { data, isLoading, error, refetch } = useNotificationAnalytics();
  const exportMutation = useExportNotificationAnalytics();

  const analytics = data?.analytics;

  const handleExport = async () => {
    try {
      await exportMutation.mutateAsync();
    } catch (err) {
      // Error handling is done in the mutation
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const getTrendIcon = (value: number) => {
    if (value >= 90) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (value >= 75) return <TrendingUp className="h-4 w-4 text-yellow-500" />;
    return <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  const getStatusBadge = (value: number) => {
    if (value >= 90) return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Excellent</Badge>;
    if (value >= 75) return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Bon</Badge>;
    if (value >= 50) return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Moyen</Badge>;
    return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Critique</Badge>;
  };

  return (
    <>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Analytics Notifications</h2>
            <p className="text-muted-foreground">Performance et suivi des notifications push, email et temps réel</p>
          </div>
          <div className="flex gap-2 flex-wrap justify-center sm:justify-end">
            <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Rafraîchir
            </Button>
            <Button variant="outline" onClick={handleExport} disabled={exportMutation.isPending}>
              <Download className="h-4 w-4 mr-2" />
              {exportMutation.isPending ? 'Exportation...' : 'Exporter'}
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <AdminAnalyticsSkeleton />
      ) : error ? (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <div>
                <p className="font-medium">{error.message}</p>
                <Button variant="ghost" size="sm" className="mt-2 text-red-700" onClick={handleRefresh}>
                  Réessayer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : analytics ? (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">{analytics.total.toLocaleString()}</CardTitle>
                  <Bell className="h-5 w-5 text-blue-500" />
                </div>
                <CardDescription>Notifications totales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Toutes les notifications envoyées depuis le début
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">
                    {formatPercentage(analytics.summary.push?.deliveryRate || 0)}
                  </CardTitle>
                  <Mail className="h-5 w-5 text-green-500" />
                </div>
                <CardDescription>Push Notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{analytics.summary.push?.count || 0} envoyées</p>
                    <p className="text-xs text-muted-foreground">
                      {analytics.summary.push?.delivered || 0} livrées
                    </p>
                  </div>
                  {getTrendIcon((analytics.summary.push?.deliveryRate || 0) * 100)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">
                    {formatPercentage(analytics.summary.email?.deliveryRate || 0)}
                  </CardTitle>
                  <Mail className="h-5 w-5 text-purple-500" />
                </div>
                <CardDescription>Emails</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{analytics.summary.email?.count || 0} envoyés</p>
                    <p className="text-xs text-muted-foreground">
                      {analytics.summary.email?.delivered || 0} livrés
                    </p>
                  </div>
                  {getTrendIcon((analytics.summary.email?.deliveryRate || 0) * 100)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">
                    {formatPercentage(analytics.summary.sse?.deliveryRate || 0)}
                  </CardTitle>
                  <Radio className="h-5 w-5 text-orange-500" />
                </div>
                <CardDescription>Temps réel (SSE)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{analytics.summary.sse?.count || 0} événements</p>
                    <p className="text-xs text-muted-foreground">
                      {analytics.summary.sse?.delivered || 0} livrés
                    </p>
                  </div>
                  {getTrendIcon((analytics.summary.sse?.deliveryRate || 0) * 100)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Delivery Rates */}
          <Card>
            <CardHeader>
              <CardTitle>Taux de livraison par type</CardTitle>
              <CardDescription>Performance des différents canaux de notification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.byType?.map((typeData: any) => (
                  <div key={typeData.type} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {typeData.type === 'push' && <Bell className="h-4 w-4 text-blue-500" />}
                        {typeData.type === 'email' && <Mail className="h-4 w-4 text-purple-500" />}
                        {typeData.type === 'sse' && <Radio className="h-4 w-4 text-orange-500" />}
                        <span className="font-medium capitalize">{typeData.type}</span>
                        <span className="text-sm text-muted-foreground">
                          {typeData.count.toLocaleString()} notifications
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        {getStatusBadge(typeData.deliveryRate * 100)}
                        <span className="text-lg font-bold">{formatPercentage(typeData.deliveryRate)}</span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${
                          typeData.deliveryRate >= 0.9 ? 'bg-green-500' :
                          typeData.deliveryRate >= 0.75 ? 'bg-yellow-500' :
                          typeData.deliveryRate >= 0.5 ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${typeData.deliveryRate * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          {typeData.delivered.toLocaleString()} livrées
                        </span>
                        <span className="flex items-center gap-1">
                          <XCircle className="h-3 w-3 text-red-500" />
                          {typeData.failed.toLocaleString()} échouées
                        </span>
                      </div>
                      <span>
                        {typeData.count - typeData.delivered - typeData.failed} en attente
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Event Types */}
          <Card>
            <CardHeader>
              <CardTitle>Types d&apos;événements</CardTitle>
              <CardDescription>Répartition des notifications par type d&apos;événement</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.byEvent?.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">Aucune donnée d&apos;événement</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {analytics.byEvent?.map((event: any) => (
                    <div key={event.event} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">
                          {event.event === 'reservation_created' && 'Nouvelle réservation'}
                          {event.event === 'reservation_confirmed' && 'Réservation confirmée'}
                          {event.event === 'reservation_cancelled' && 'Réservation annulée'}
                          {event.event === 'reservation_updated' && 'Réservation modifiée'}
                          {event.event === 'reservation_completed' && 'Réservation terminée'}
                          {event.event === 'general' && 'Général'}
                          {event.event === 'system' && 'Système'}
                        </span>
                        <Badge variant="outline">{event.count}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {event.event === 'reservation_created' && 'Lorsqu\'un client crée une réservation'}
                        {event.event === 'reservation_confirmed' && 'Lorsqu\'une réservation est confirmée'}
                        {event.event === 'reservation_cancelled' && 'Lorsqu\'une réservation est annulée'}
                        {event.event === 'reservation_updated' && 'Lorsqu\'une réservation est modifiée'}
                        {event.event === 'reservation_completed' && 'Lorsqu\'une réservation est terminée'}
                        {event.event === 'general' && 'Notifications générales'}
                        {event.event === 'system' && 'Notifications système'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Restaurants */}
          <Card>
            <CardHeader>
              <CardTitle>Restaurants les plus actifs</CardTitle>
              <CardDescription>Top 10 des restaurants par volume de notifications</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.topRestaurants?.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">Aucune donnée de restaurant</p>
              ) : (
                <div className="space-y-3">
                  {analytics.topRestaurants?.map((restaurant: any, index: number) => (
                     <div key={restaurant.restaurantId} className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 space-y-2 sm:space-y-0">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-gray-400 w-6">{index + 1}</span>
                        <div>
                          <p className="font-medium">{restaurant.restaurantName || 'Restaurant inconnu'}</p>
                          <p className="text-sm text-muted-foreground">
                            ID: {restaurant.restaurantId.substring(0, 8)}...
                          </p>
                        </div>
                      </div>
                      <div className="text-left sm:text-right mt-2 sm:mt-0">
                        <p className="text-lg font-bold">{restaurant.count.toLocaleString()}</p>
                        <div className="flex items-center gap-2 justify-end">
                          <span className="text-sm text-muted-foreground">
                            {formatPercentage(restaurant.deliveryRate)}
                          </span>
                          {getTrendIcon(restaurant.deliveryRate * 100)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Activité récente (30 jours)</CardTitle>
              <CardDescription>Évolution du volume de notifications</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.recentStats?.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">Aucune donnée récente</p>
              ) : (
                <div className="space-y-4">
                  {analytics.recentStats?.slice(-10).map((day: any) => (
                    <div key={day.date} className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
                        <span className="font-medium">
                          {new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
                        </span>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground">
                            {day.total} notifications
                          </span>
                          <span className={`font-bold ${
                            day.deliveryRate >= 0.9 ? 'text-green-600' :
                            day.deliveryRate >= 0.75 ? 'text-yellow-600' :
                            day.deliveryRate >= 0.5 ? 'text-orange-600' : 'text-red-600'
                          }`}>
                            {formatPercentage(day.deliveryRate)}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1 h-6">
                        {day.byType?.map((type: any) => (
                          <div
                            key={type.type}
                            className={`flex-1 rounded ${
                              type.type === 'push' ? 'bg-blue-500' :
                              type.type === 'email' ? 'bg-purple-500' :
                              'bg-orange-500'
                            }`}
                            title={`${type.type}: ${type.count} (${type.delivered} livrées)`}
                            style={{ 
                              width: `${(type.count / day.total) * 100}%` 
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle>Santé du système</CardTitle>
              <CardDescription>Statut des services de notification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Bell className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Push Notifications</h3>
                      <p className="text-sm text-muted-foreground">Web Push API</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${
                      (analytics.summary.push?.deliveryRate || 0) >= 0.9 ? 'text-green-600' :
                      (analytics.summary.push?.deliveryRate || 0) >= 0.75 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {(analytics.summary.push?.deliveryRate || 0) >= 0.9 ? 'Opérationnel' :
                       (analytics.summary.push?.deliveryRate || 0) >= 0.75 ? 'Partiel' : 'Problèmes'}
                    </span>
                    {getTrendIcon((analytics.summary.push?.deliveryRate || 0) * 100)}
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Mail className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Service Email</h3>
                      <p className="text-sm text-muted-foreground">Brevo API</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${
                      (analytics.summary.email?.deliveryRate || 0) >= 0.9 ? 'text-green-600' :
                      (analytics.summary.email?.deliveryRate || 0) >= 0.75 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {(analytics.summary.email?.deliveryRate || 0) >= 0.9 ? 'Opérationnel' :
                       (analytics.summary.email?.deliveryRate || 0) >= 0.75 ? 'Partiel' : 'Problèmes'}
                    </span>
                    {getTrendIcon((analytics.summary.email?.deliveryRate || 0) * 100)}
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Radio className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Temps réel (SSE)</h3>
                      <p className="text-sm text-muted-foreground">Server-Sent Events</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${
                      (analytics.summary.sse?.deliveryRate || 0) >= 0.9 ? 'text-green-600' :
                      (analytics.summary.sse?.deliveryRate || 0) >= 0.75 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {(analytics.summary.sse?.deliveryRate || 0) >= 0.9 ? 'Opérationnel' :
                       (analytics.summary.sse?.deliveryRate || 0) >= 0.75 ? 'Partiel' : 'Problèmes'}
                    </span>
                    {getTrendIcon((analytics.summary.sse?.deliveryRate || 0) * 100)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </>
  );
}