import { ApiClient } from './base';
import {
  Restaurant,
  CreateRestaurantInput,
  UpdateRestaurantInput,
  OpeningHours,
  User,
} from '@/types';

export class RestaurantsApi extends ApiClient {
  // Admin - Restaurant Management
  async getRestaurants(page = 1, limit = 20): Promise<{
    restaurants: Restaurant[];
    pagination: { total: number; page: number; pages: number; limit: number };
  }> {
    return this.request(`/api/admin/restaurants?page=${page}&limit=${limit}`);
  }

  async createRestaurant(data: CreateRestaurantInput): Promise<{
    restaurant: Restaurant;
    apiKey: string;
  }> {
    return this.request('/api/admin/restaurants', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getRestaurant(id: string): Promise<{ restaurant: Restaurant }> {
    return this.request(`/api/admin/restaurants/${id}`);
  }

  async updateRestaurant(id: string, data: UpdateRestaurantInput): Promise<{
    restaurant: Restaurant;
  }> {
    return this.request(`/api/admin/restaurants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteRestaurant(id: string): Promise<void> {
    return this.request(`/api/admin/restaurants/${id}`, {
      method: 'DELETE',
    });
  }

  async regenerateApiKey(id: string): Promise<{ apiKey: string }> {
    return this.request(`/api/admin/restaurants/${id}/regenerate-api-key`, {
      method: 'PUT',
    });
  }

  async createRestaurantUser(
    restaurantId: string,
    email: string,
    password: string
  ): Promise<{ user: User }> {
    return this.request(`/api/admin/restaurants/${restaurantId}/users`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getRestaurantUsers(restaurantId: string): Promise<{ users: User[] }> {
    return this.request(`/api/admin/restaurants/${restaurantId}/users`);
  }

  async updateUser(userId: string, data: { email?: string; password?: string }): Promise<{ user: User }> {
    return this.request(`/api/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteUser(userId: string): Promise<void> {
    return this.request(`/api/admin/users/${userId}`, {
      method: 'DELETE',
    });
  }

  // Restaurant Owner - Own data management
  async getMyRestaurant(): Promise<{ restaurant: Restaurant }> {
    return this.request('/api/restaurant/me');
  }

  async getDashboardStats(): Promise<{
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
  }> {
    return this.request('/api/restaurant/dashboard-stats');
  }

  async updateBasicInfo(data: {
    name?: string;
    address?: string;
    phone?: string;
    email?: string;
  }): Promise<{ restaurant: Restaurant }> {
    return this.request('/api/restaurant/basic-info', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateOpeningHours(data: Partial<OpeningHours>): Promise<{
    openingHours: OpeningHours;
  }> {
    return this.request('/api/restaurant/opening-hours', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateTablesConfig(data: {
    mode?: 'simple' | 'detailed';
    totalTables?: number;
    averageCapacity?: number;
    tables?: Array<{ type: string; quantity: number; capacity: number }>;
  }): Promise<{
    message: string;
    tablesConfig: {
      mode: 'simple' | 'detailed';
      totalTables?: number;
      averageCapacity?: number;
      tables?: Array<{ type: string; quantity: number; capacity: number }>;
    };
  }> {
    return this.request('/api/restaurant/tables-config', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateReservationConfig(data: {
    defaultDuration?: number;
    useOpeningHours?: boolean;
    averagePrice?: number;
  }): Promise<{
    message: string;
    reservationConfig: {
      defaultDuration: number;
      useOpeningHours: boolean;
      averagePrice?: number;
    };
  }> {
    return this.request('/api/restaurant/reservation-config', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async generateMenuQrCode(): Promise<{
    message: string;
    qrCodeUrl: string;
    restaurant: Restaurant;
  }> {
    return this.request('/api/restaurant/menu/qrcode/generate', {
      method: 'POST',
    });
  }
}
