import { ApiClient } from './base';
import { RestaurantAnalytics } from '@/types';

export class AdminApi extends ApiClient {
  async getAdminDashboard(): Promise<{
    stats: {
      restaurants: {
        total: number;
        active: number;
        inactive: number;
        recent: number;
        byAccountType: {
          managed: number;
          selfService: number;
        };
      };
      subscriptions: {
        byPlan: {
          starter: number;
          pro: number;
        };
        byStatus: {
          active: number;
          trial: number;
          pastDue: number;
          cancelled: number;
        };
        activeSubscriptions: number;
      };
      revenue: {
        mrr: number;
        breakdown: {
          starter: number;
          pro: number;
        };
        activeStarterCount: number;
        activeProCount: number;
      };
      users: {
        total: number;
        admin: number;
        restaurant: number;
        server: number;
      };
      reservations: {
        total: number;
        thisMonth: number;
        recent: number;
        averageQuotaUsage: number;
      };
      topRestaurants: Array<{
        restaurantId: string;
        restaurantName: string;
        reservationCount: number;
        accountType?: string;
        subscriptionPlan?: string;
      }>;
      abandonedSignups: {
        total: number;
        byDay: Array<{
          _id: string;
          count: number;
          restaurants: Array<{
            id: string;
            name: string;
            email: string;
            createdAt: string;
          }>;
        }>;
      };
    };
  }> {
    return this.request('/api/admin/dashboard');
  }

  async getRestaurantAnalytics(
    restaurantId: string,
    period?: string,
    startDate?: string,
    endDate?: string
  ): Promise<{ analytics: RestaurantAnalytics }> {
    const queryParams = new URLSearchParams();
    if (period) queryParams.append('period', period);
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);

    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return this.request(`/api/admin/restaurants/${restaurantId}/analytics${query}`);
  }

  async getRestaurantMonitoring(): Promise<{
    restaurants: Array<{
      id: string;
      name: string;
      status: string;
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
    }>;
    summary: {
      total: number;
      healthy: number;
      warning: number;
      critical: number;
    };
  }> {
    return this.request('/api/admin/monitoring');
  }

  // Notification analytics
  async getNotificationAnalytics(): Promise<any> {
    return this.request('/api/admin/analytics/notifications');
  }

  async getRestaurantNotificationAnalytics(restaurantId: string): Promise<any> {
    return this.request(`/api/admin/analytics/notifications/restaurant/${restaurantId}`);
  }

  // Data export
  async exportRestaurants(): Promise<void> {
    const response = await this.fetchWithBlob('/api/admin/export/restaurants');
    this.downloadBlob(response.blob, 'restaurants.csv');
  }

  async exportUsers(): Promise<void> {
    const response = await this.fetchWithBlob('/api/admin/export/users');
    this.downloadBlob(response.blob, 'users.csv');
  }

  async exportReservations(): Promise<void> {
    const response = await this.fetchWithBlob('/api/admin/export/reservations');
    this.downloadBlob(response.blob, 'reservations.csv');
  }

  async exportNotificationAnalytics(): Promise<void> {
    const response = await this.fetchWithBlob('/api/admin/export/notifications');
    this.downloadBlob(response.blob, 'notification_analytics.csv');
  }

  async getCommercials(): Promise<{ users: any[] }> {
    return this.request('/api/admin/commercials');
  }

  async getCommercialDetail(id: string): Promise<any> {
    return this.request(`/api/admin/commercials/${id}`);
  }

  async deleteCommercialUser(id: string): Promise<void> {
    return this.request(`/api/admin/commercials/${id}`, { method: 'DELETE' });
  }

  async createCommercialUser(email: string, password: string): Promise<any> {
    return this.request('/api/admin/commercials', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  private async fetchWithBlob(endpoint: string): Promise<{ blob: Blob }> {
    const headers: Record<string, string> = {};
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.error?.message || 'Export failed');
      } catch {
        throw new Error(`Export failed: ${response.status} ${response.statusText}`);
      }
    }

    const blob = await response.blob();
    return { blob };
  }

  private downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}
