'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Bell,
  TrendingUp,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Search,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRestaurantMonitoring } from '@/hooks/api/useAdminMonitoring';
import { cn } from '@/lib/utils';

type HealthFilter = 'all' | 'healthy' | 'warning' | 'critical';

type MonitoringRestaurant = {
  id: string;
  name: string;
  healthStatus: 'healthy' | 'warning' | 'critical';
  metrics: {
    reservationsThisMonth: number;
    notificationDeliveryRate: number;
    lastActivity: string | null;
    problems: string[];
  };
  optionalMetrics: {
    estimatedRevenue: number;
    cancellationRate: number;
    confirmedReservations: number;
    completedReservations: number;
    totalGuests: number;
  };
};

export default function MonitoringPage() {
  const { data, isLoading, error } = useRestaurantMonitoring();
  const [searchQuery, setSearchQuery] = useState('');
  const [healthFilter, setHealthFilter] = useState<HealthFilter>('all');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  // Filter and search restaurants
  const filteredRestaurants = useMemo(() => {
    if (!data?.restaurants) return [];

    return data.restaurants.filter(restaurant => {
      // Health filter
      if (healthFilter !== 'all' && restaurant.healthStatus !== healthFilter) {
        return false;
      }

      // Search filter
      if (searchQuery && !restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [data?.restaurants, healthFilter, searchQuery]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Activity className="w-8 h-8 text-blue-600 animate-pulse" />
          <h1 className="text-3xl font-bold text-gray-900">Monitoring Restaurants</h1>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des données de monitoring...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Monitoring Restaurants</h1>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <p>Erreur lors du chargement des données de monitoring</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const summary = data?.summary || { total: 0, healthy: 0, warning: 0, critical: 0 };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Monitoring Restaurants</h1>
            <p className="text-gray-600 mt-1">
              Surveillance en temps réel de l&apos;activité de vos restaurants
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{summary.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En bonne santé</p>
                <p className="text-2xl font-bold text-green-600">{summary.healthy}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avertissement</p>
                <p className="text-2xl font-bold text-yellow-600">{summary.warning}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critique</p>
                <p className="text-2xl font-bold text-red-600">{summary.critical}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Rechercher un restaurant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={healthFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setHealthFilter('all')}
              >
                <Filter className="w-4 h-4 mr-2" />
                Tous
              </Button>
              <Button
                variant={healthFilter === 'healthy' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setHealthFilter('healthy')}
                className={healthFilter === 'healthy' ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                Sains
              </Button>
              <Button
                variant={healthFilter === 'warning' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setHealthFilter('warning')}
                className={healthFilter === 'warning' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
              >
                Attention
              </Button>
              <Button
                variant={healthFilter === 'critical' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setHealthFilter('critical')}
                className={healthFilter === 'critical' ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                Critique
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Restaurants Table */}
      <Card>
        <CardHeader>
          <CardTitle>Restaurants ({filteredRestaurants.length})</CardTitle>
          <CardDescription>
            Cliquez sur une ligne pour voir les métriques détaillées
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredRestaurants.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Aucun restaurant trouvé</p>
              </div>
            ) : (
              filteredRestaurants.map((restaurant) => (
                <RestaurantRow
                  key={restaurant.id}
                  restaurant={restaurant}
                  isExpanded={expandedRows.has(restaurant.id)}
                  onToggle={() => toggleRow(restaurant.id)}
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function RestaurantRow({
  restaurant,
  isExpanded,
  onToggle
}: {
  restaurant: MonitoringRestaurant;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const healthConfig = {
    healthy: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
      icon: CheckCircle2,
      label: 'En bonne santé',
      badgeVariant: 'default' as const,
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-700',
      icon: AlertTriangle,
      label: 'Avertissement',
      badgeVariant: 'default' as const,
    },
    critical: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      icon: AlertCircle,
      label: 'Critique',
      badgeVariant: 'danger' as const,
    },
  };

  const config = healthConfig[restaurant.healthStatus];
  const HealthIcon = config.icon;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Jamais';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Aujourd\'hui';
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`;
    return `Il y a ${Math.floor(diffDays / 30)} mois`;
  };

  return (
    <div className={cn('border rounded-lg p-4', config.border, config.bg)}>
      {/* Main Row */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggle}
          className="p-1 hover:bg-white/50 rounded"
        >
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-600" />
          )}
        </button>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
          {/* Restaurant Name & Health */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <HealthIcon className={cn('w-5 h-5', config.text)} />
              <div>
                <Link
                  href={`/admin/restaurants/${restaurant.id}`}
                  className="font-semibold text-gray-900 hover:text-blue-600 flex items-center gap-1"
                >
                  {restaurant.name}
                  <ExternalLink className="w-3 h-3" />
                </Link>
                <Badge variant={config.badgeVariant} className="mt-1">
                  {config.label}
                </Badge>
              </div>
            </div>
          </div>

          {/* Reservations This Month */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Réservations</p>
              <p className="font-semibold text-gray-900">
                {restaurant.metrics.reservationsThisMonth}
              </p>
            </div>
          </div>

          {/* Notification Delivery Rate */}
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Taux notif.</p>
              <p className={cn(
                'font-semibold',
                restaurant.metrics.notificationDeliveryRate >= 90 ? 'text-green-600' :
                restaurant.metrics.notificationDeliveryRate >= 75 ? 'text-yellow-600' :
                'text-red-600'
              )}>
                {restaurant.metrics.notificationDeliveryRate}%
              </p>
            </div>
          </div>

          {/* Last Activity */}
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Dernière activité</p>
              <p className="font-semibold text-gray-900 text-sm">
                {formatDate(restaurant.metrics.lastActivity)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t space-y-4">
          {/* Problems */}
          {restaurant.metrics.problems.length > 0 && (
            <div className="bg-white/50 rounded-lg p-3">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Problèmes détectés :
              </p>
              <ul className="space-y-1">
                {restaurant.metrics.problems.map((problem: string, idx: number) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-red-700">
                    <AlertCircle className="w-4 h-4" />
                    {problem}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Optional Metrics */}
          <div className="bg-white/50 rounded-lg p-3">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Métriques détaillées (ce mois) :
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-600">Confirmées</p>
                <p className="text-lg font-semibold text-gray-900">
                  {restaurant.optionalMetrics.confirmedReservations}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Complétées</p>
                <p className="text-lg font-semibold text-gray-900">
                  {restaurant.optionalMetrics.completedReservations}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Total invités</p>
                <p className="text-lg font-semibold text-gray-900">
                  {restaurant.optionalMetrics.totalGuests}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Taux annulation</p>
                <p className={cn(
                  'text-lg font-semibold',
                  restaurant.optionalMetrics.cancellationRate > 30 ? 'text-red-600' :
                  restaurant.optionalMetrics.cancellationRate > 15 ? 'text-yellow-600' :
                  'text-green-600'
                )}>
                  {restaurant.optionalMetrics.cancellationRate}%
                </p>
              </div>
            </div>

            {restaurant.optionalMetrics.estimatedRevenue > 0 && (
              <div className="mt-3 pt-3 border-t">
                <p className="text-xs text-gray-600">Revenus estimés (curiosité 😉)</p>
                <p className="text-xl font-bold text-blue-600">
                  {restaurant.optionalMetrics.estimatedRevenue.toLocaleString('fr-FR', {
                    style: 'currency',
                    currency: 'EUR'
                  })}
                </p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Link href={`/admin/restaurants/${restaurant.id}`}>
              <Button size="sm" variant="outline">
                Voir détails
              </Button>
            </Link>
            <Link href={`/admin/restaurants/${restaurant.id}/analytics`}>
              <Button size="sm" variant="outline">
                Analytics détaillées
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
