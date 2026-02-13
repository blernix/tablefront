import { ApiClient } from './base';
import { AuthResponse, TwoFactorAuthResponse } from '@/types';

export class TwoFactorRequiredError extends Error {
  constructor(
    public tempToken: string,
    public userId: string,
    public email: string,
    message: string = 'Two-factor authentication required'
  ) {
    super(message);
    this.name = 'TwoFactorRequiredError';
  }
}

export class AuthApi extends ApiClient {
  async login(email: string, password: string): Promise<AuthResponse> {
    console.log('[API] Login attempt for:', email);
    try {
      const response = await this.request<AuthResponse | TwoFactorAuthResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      // Check if 2FA is required
      if ('requiresTwoFactor' in response && response.requiresTwoFactor) {
        const twoFactorResponse = response as TwoFactorAuthResponse;
        console.log('[API] 2FA required for:', email);
        throw new TwoFactorRequiredError(
          twoFactorResponse.tempToken,
          twoFactorResponse.userId,
          twoFactorResponse.email,
          twoFactorResponse.message
        );
      }
      
      // Normal login success
      const authResponse = response as AuthResponse;
      console.log('[API] Login response:', { user: authResponse.user, tokenLength: authResponse.token?.length, tokenPreview: authResponse.token?.substring(0, 20) + '...' });
      if (!authResponse.token) {
        console.error('[API] Login response missing token!', authResponse);
        throw new Error('Server did not return authentication token');
      }
      this.setToken(authResponse.token);
      return authResponse;
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

  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    return this.request('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  async changeEmail(currentPassword: string, newEmail: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/api/auth/change-email', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newEmail }),
    });
    // Update token with new email
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  // Two-factor authentication methods
  
  async getTwoFactorStatus(): Promise<{ twoFactorEnabled: boolean; hasRecoveryCodes: boolean }> {
    return this.request('/api/2fa/status', {
      method: 'GET',
    });
  }

  async generateTwoFactorSetup(): Promise<{ secret: string; qrCodeUrl: string; recoveryCodes: string[] }> {
    return this.request('/api/2fa/setup/generate', {
      method: 'POST',
    });
  }

  async enableTwoFactor(secret: string, token: string): Promise<{ message: string; recoveryCodes: string[] }> {
    return this.request('/api/2fa/setup/enable', {
      method: 'POST',
      body: JSON.stringify({ secret, token }),
    });
  }

  async disableTwoFactor(): Promise<{ message: string }> {
    return this.request('/api/2fa/disable', {
      method: 'POST',
    });
  }

  async verifyTwoFactorLogin(tempToken: string, token: string): Promise<AuthResponse> {
    console.log('[AuthApi] verifyTwoFactorLogin called:', { tempToken: tempToken?.substring(0, 20) + '...', token });
    const response = await this.request<AuthResponse>('/api/2fa/verify-login', {
      method: 'POST',
      body: JSON.stringify({ tempToken, token }),
    });
    console.log('[AuthApi] verifyTwoFactorLogin response:', { user: response.user, tokenPreview: response.token?.substring(0, 20) + '...' });
    // Set token after successful verification
    this.setToken(response.token);
    return response;
  }

  async useRecoveryCode(tempToken: string, recoveryCode: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/api/2fa/recovery', {
      method: 'POST',
      body: JSON.stringify({ tempToken, recoveryCode }),
    });
    this.setToken(response.token);
    return response;
  }
}
