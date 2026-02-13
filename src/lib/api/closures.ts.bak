import { ApiClient } from './base';
import {
  Closure,
  CreateClosureInput,
} from '@/types';

export class ClosuresApi extends ApiClient {
  async getClosures(): Promise<{ closures: Closure[] }> {
    return this.request('/api/restaurant/closures');
  }

  async createClosure(data: CreateClosureInput): Promise<{ closure: Closure }> {
    return this.request('/api/restaurant/closures', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteClosure(id: string): Promise<void> {
    return this.request(`/api/restaurant/closures/${id}`, {
      method: 'DELETE',
    });
  }
}
