import { ApiClient } from './base';
import {
  Reservation,
  CreateReservationInput,
  UpdateReservationInput,
} from '@/types';

export class ReservationsApi extends ApiClient {
  async getReservations(params?: {
    startDate?: string;
    endDate?: string;
    status?: string;
  }): Promise<{ reservations: Reservation[] }> {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.status) queryParams.append('status', params.status);

    const query = queryParams.toString();
    return this.request(`/api/reservations${query ? `?${query}` : ''}`);
  }

  async getReservation(id: string): Promise<{ reservation: Reservation }> {
    return this.request(`/api/reservations/${id}`);
  }

  async createReservation(data: CreateReservationInput): Promise<{ reservation: Reservation }> {
    return this.request('/api/reservations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateReservation(id: string, data: UpdateReservationInput): Promise<{ reservation: Reservation }> {
    return this.request(`/api/reservations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteReservation(id: string): Promise<void> {
    return this.request(`/api/reservations/${id}`, {
      method: 'DELETE',
    });
  }
}
