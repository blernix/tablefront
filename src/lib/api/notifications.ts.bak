import { ApiClient } from './base';
import {
  PushSubscription,
  NotificationPreferences,
  VapidPublicKeyResponse,
  PushNotificationStatus,
} from '@/types';

export class NotificationsApi extends ApiClient {
  /**
   * Get VAPID public key for push notifications
   */
  async getVapidPublicKey(): Promise<VapidPublicKeyResponse> {
    return this.request('/api/notifications/vapid-public-key', {
      method: 'GET',
    });
  }

  /**
   * Get push notification status
   */
  async getPushNotificationStatus(): Promise<PushNotificationStatus> {
    return this.request('/api/notifications/status', {
      method: 'GET',
    });
  }

  /**
   * Subscribe to push notifications
   */
  async subscribe(
    subscription: PushSubscription,
    userAgent?: string
  ): Promise<{ success: boolean }> {
    return this.request('/api/notifications/subscribe', {
      method: 'POST',
      body: JSON.stringify({ subscription, userAgent }),
    });
  }

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribe(endpoint: string): Promise<{ success: boolean }> {
    return this.request('/api/notifications/unsubscribe', {
      method: 'DELETE',
      body: JSON.stringify({ endpoint }),
    });
  }

  /**
   * Get user's notification preferences
   */
  async getNotificationPreferences(): Promise<{ preferences: NotificationPreferences }> {
    return this.request('/api/notifications/preferences', {
      method: 'GET',
    });
  }

  /**
   * Update user's notification preferences
   */
  async updateNotificationPreferences(
    preferences: Partial<Omit<NotificationPreferences, 'userId' | 'createdAt' | 'updatedAt'>>
  ): Promise<{ success: boolean; preferences: NotificationPreferences }> {
    return this.request('/api/notifications/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  }
}