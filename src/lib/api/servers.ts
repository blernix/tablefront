import { ApiClient } from './base';
import {
  ServerUser,
  CreateServerUserInput,
  UpdateServerUserInput,
} from '@/types';

export class ServersApi extends ApiClient {
  async getServerUsers(): Promise<{ servers: ServerUser[] }> {
    return this.request('/api/users/servers');
  }

  async createServerUser(data: CreateServerUserInput): Promise<{ server: ServerUser }> {
    return this.request('/api/users/servers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateServerUser(id: string, data: UpdateServerUserInput): Promise<{ server: ServerUser }> {
    return this.request(`/api/users/servers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteServerUser(id: string): Promise<void> {
    return this.request(`/api/users/servers/${id}`, {
      method: 'DELETE',
    });
  }
}
