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
    plan: 'starter' | 'pro' | 'trial';
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

  async getMyStats() {
    return this.request('/api/commercial/stats');
  }
}
