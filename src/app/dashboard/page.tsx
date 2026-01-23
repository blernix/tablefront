'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/lib/api';
import { Restaurant } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Utensils, Users, TrendingUp, Clock, Euro, ArrowRight, Plus } from 'lucide-react';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import EmptyState from '@/components/EmptyState';

interface DashboardStats {
  today: {
    reservations: number;
    guests: number;
    estimatedRevenue: number;
    upcomingReservations: Array<{
      _id: string;
      customerName: string;
      time: string;
      numberOfGuests: number;
      status: string;
    }>;
  };
  thisWeek: {
    reservations: number;
    guests: number;
    estimatedRevenue: number;
    avgOccupation: number;
  };
  menu: {
    categories: number;
    dishes: number;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, initAuth, isInitialized } = useAuthStore();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isFetchingRef = useRef(false); // Prevent multiple simultaneous calls

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  useEffect(() => {
    if (!isInitialized) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
  }, [isInitialized, isAuthenticated, router]);

  const fetchData = async () => {
    if (!user?.restaurantId) return;

    // Prevent multiple simultaneous calls
    if (isFetchingRef.current) {
      console.log('Already fetching dashboard data, skipping...');
      return;
    }

    try {
      isFetchingRef.current = true;
      setIsLoading(true);
      const [restaurantRes, statsRes] = await Promise.all([
        apiClient.getMyRestaurant(),
        apiClient.getDashboardStats(),
      ]);
      setRestaurant(restaurantRes.restaurant);
      setStats(statsRes);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    if (user?.restaurantId) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.restaurantId]);

  if (!isInitialized) {
    return <LoadingSkeleton type="dashboard" />;
  }

  if (!isAuthenticated) {
    return <LoadingSkeleton type="dashboard" />;
  }

  if (isLoading) {
    return <LoadingSkeleton type="dashboard" />;
  }

  const getTotalCapacity = () => {
    if (!restaurant) return 0;
    if (restaurant.tablesConfig.mode === 'detailed' && restaurant.tablesConfig.tables) {
      return restaurant.tablesConfig.tables.reduce(
        (sum, table) => sum + (table.quantity * table.capacity),
        0
      );
    }
    return (restaurant.tablesConfig.totalTables || 0) * (restaurant.tablesConfig.averageCapacity || 0);
  };

  const getTotalTables = () => {
    if (!restaurant) return 0;
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
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmée';
      case 'pending':
        return 'En attente';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Tableau de bord</h1>
        <p className="mt-2 text-slate-600">
          Bienvenue, {restaurant?.name}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={() => router.push('/dashboard/reservations')} className="w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Nouvelle réservation
        </Button>
        <Button variant="outline" onClick={() => router.push('/dashboard/reservations')} className="w-full sm:w-auto">
          <Calendar className="h-4 w-4" />
          Voir le calendrier
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Réservations du jour</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-slate-900">{stats?.today.reservations || 0}</div>
            <p className="mt-1 text-sm text-slate-600">
              {stats?.today.guests || 0} {(stats?.today.guests || 0) > 1 ? 'convives' : 'convive'}
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Cette semaine</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-slate-900">{stats?.thisWeek.reservations || 0}</div>
            <p className="mt-1 text-sm text-slate-600">
              {stats?.thisWeek.avgOccupation || 0}% d&apos;occupation
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Menu</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
              <Utensils className="h-5 w-5 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-slate-900">{stats?.menu.dishes || 0}</div>
            <p className="mt-1 text-sm text-slate-600">
              {stats?.menu.categories || 0} {(stats?.menu.categories || 0) > 1 ? 'catégories' : 'catégorie'}
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Revenu estimé</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
              <Euro className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            {restaurant?.reservationConfig?.averagePrice ? (
              <>
                <div className="text-3xl font-semibold text-green-600">
                  {stats?.today.estimatedRevenue?.toFixed(2) || '0.00'}€
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  {stats?.thisWeek.estimatedRevenue?.toFixed(2) || '0.00'}€ cette semaine
                </p>
              </>
            ) : (
              <>
                <div className="text-3xl font-semibold text-slate-400">--</div>
                <p className="mt-1 text-sm text-slate-600">
                  Configurez le prix moyen
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

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
              <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard/reservations')}>
                Voir tout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {stats?.today.upcomingReservations && stats.today.upcomingReservations.length > 0 ? (
              <div className="space-y-4">
                {stats.today.upcomingReservations.map((reservation) => (
                  <div
                    key={reservation._id}
                    className="flex items-center gap-4 rounded-lg border border-slate-200 p-4 transition-colors hover:border-slate-300 hover:bg-slate-50 cursor-pointer"
                    onClick={() => router.push('/dashboard/reservations')}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                      <Clock className="h-5 w-5 text-slate-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900">{reservation.customerName}</p>
                      <p className="text-sm text-slate-600">
                        {reservation.time} • {reservation.numberOfGuests} {reservation.numberOfGuests > 1 ? 'personnes' : 'personne'}
                      </p>
                    </div>
                    <Badge variant={getStatusBadgeVariant(reservation.status)}>
                      {getStatusLabel(reservation.status)}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Calendar}
                title="Aucune réservation aujourd'hui"
                description="Les réservations apparaîtront ici"
              />
            )}
          </CardContent>
        </Card>

        {/* Restaurant Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Informations restaurant</CardTitle>
                <CardDescription>Vos coordonnées</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard/settings/basic-info')}>
                Modifier
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div>
                <p className="text-sm font-medium text-slate-600">Nom</p>
                <p className="mt-1 text-sm text-slate-900">{restaurant?.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Adresse</p>
                <p className="mt-1 text-sm text-slate-900">{restaurant?.address}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-600">Téléphone</p>
                  <p className="mt-1 text-sm text-slate-900">{restaurant?.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Email</p>
                  <p className="mt-1 text-sm text-slate-900 truncate">{restaurant?.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-600">Capacité</p>
                  <p className="mt-1 text-sm text-slate-900">
                    {getTotalCapacity()} places
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Tables</p>
                  <p className="mt-1 text-sm text-slate-900">
                    {getTotalTables()} {getTotalTables() > 1 ? 'tables' : 'table'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
