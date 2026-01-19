import { ApiClient } from './base';
import { AuthResponse } from '@/types';

export class AuthApi extends ApiClient {
  async login(email: string, password: string): Promise<AuthResponse> {
    console.log('[API] Login attempt for:', email);
    try {
      const response = await this.request<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      console.log('[API] Login response:', { user: response.user, tokenLength: response.token?.length, tokenPreview: response.token?.substring(0, 20) + '...' });
      if (!response.token) {
        console.error('[API] Login response missing token!', response);
        throw new Error('Server did not return authentication token');
      }
      this.setToken(response.token);
      return response;
    } catch (error) {
      console.error('[API] Login error details:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.request('/api/auth/logout', {
        method: 'POST',
      });
    } finally {
      this.setToken(null);
    }
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    return this.request('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    return this.request('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  }
}
