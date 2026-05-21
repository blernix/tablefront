import { ApiClient } from './base';

export class CommercialApiClient extends ApiClient {
  constructor() {
    super(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000');
  }

  async createRestaurant(data: {
    name: string;
    address: string;
    phone: string;
    email: string;
    plan: 'starter' | 'pro';
    trialDays?: number;
    discountPercent?: number;
    tablesConfig?: { totalTables: number; averageCapacity: number };
  }) {
    return this.request('/api/commercial/restaurants', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMyRestaurants(params?: { page?: number; limit?: number }) {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    return this.request(`/api/commercial/restaurants?${query.toString()}`);
  }

  async getRestaurantDetail(id: string) {
    return this.request(`/api/commercial/restaurants/${id}`);
  }

  async getMyStats() {
    return this.request('/api/commercial/stats');
  }

  async updateObjectives(monthlySignups: number) {
    return this.request('/api/commercial/objectives', {
      method: 'PUT',
      body: JSON.stringify({ monthlySignups }),
    });
  }

  async getProfile() {
    return this.request('/api/commercial/profile');
  }

  async updateProfile(data: { firstName?: string; lastName?: string; phone?: string; photoUrl?: string }) {
    return this.request('/api/commercial/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request('/api/commercial/profile/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  async uploadProfilePhoto(file: File) {
    return this.uploadFile('/api/commercial/profile/photo', file, 'photo');
  }
}
