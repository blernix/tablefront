import { ApiClient } from './base';
import { Customer, Reservation } from '@/types';

export class CustomersApi extends ApiClient {
  async getCustomers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
    tag?: string;
  }): Promise<{
    customers: Customer[];
    pagination: { total: number; page: number; pages: number; limit: number };
  }> {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.search) query.set('search', params.search);
    if (params?.sort) query.set('sort', params.sort);
    if (params?.tag) query.set('tag', params.tag);
    return this.request(`/api/restaurant/customers?${query.toString()}`);
  }

  async getCustomerById(id: string): Promise<{
    customer: Customer;
    reservations: Reservation[];
  }> {
    return this.request(`/api/restaurant/customers/${id}`);
  }

  async createCustomer(data: {
    name: string;
    email: string;
    phone: string;
    tags?: string[];
    notes?: string;
    marketingConsent?: boolean;
  }): Promise<{ customer: Customer }> {
    return this.request('/api/restaurant/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCustomer(
    id: string,
    data: {
      name?: string;
      phone?: string;
      tags?: string[];
      notes?: string;
    }
  ): Promise<{ customer: Customer }> {
    return this.request(`/api/restaurant/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async searchCustomers(q: string): Promise<{
    customers: Pick<Customer, '_id' | 'name' | 'email' | 'phone' | 'totalReservations' | 'lastVisit'>[];
  }> {
    return this.request(`/api/restaurant/customers/search?q=${encodeURIComponent(q)}`);
  }

  async exportCustomers(params?: { tag?: string; format?: 'csv' | 'json' }): Promise<Response> {
    const query = new URLSearchParams();
    if (params?.tag) query.set('tag', params.tag);
    if (params?.format) query.set('format', params.format);
    const url = `${this.baseUrl}/api/restaurant/customers/export?${query.toString()}`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
    return response;
  }
}
