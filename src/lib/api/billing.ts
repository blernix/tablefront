import { ApiClient } from './base';

export class BillingApi extends ApiClient {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  /**
   * Create a Stripe Customer Portal session
   * @returns Portal session URL
   */
  async createPortalSession(): Promise<{ url: string }> {
    const response = await this.request<{ url: string }>('/api/billing/create-portal', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    return response;
  }

  /**
   * Get current subscription details
   * @returns Subscription information
   */
  async getSubscription(): Promise<any> {
    const response = await this.request('/api/billing/subscription', {
      method: 'GET',
    });
    return response;
  }

  /**
   * Cancel subscription
   * @returns Cancellation confirmation
   */
  async cancelSubscription(): Promise<any> {
    const response = await this.request('/api/billing/cancel', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    return response;
  }

  /**
   * Get available plans
   * @returns List of available subscription plans
   */
  async getPlans(): Promise<any> {
    const response = await this.request('/api/billing/plans', {
      method: 'GET',
    });
    return response;
  }

  /**
   * Create a Stripe Checkout Session
   * @param plan The plan to subscribe to ('starter' | 'pro')
   * @param restaurantId The restaurant ID
   * @returns Checkout session URL and ID
   */
  async createCheckoutSession(
    plan: 'starter' | 'pro',
    restaurantId: string
  ): Promise<{ sessionId: string; url: string }> {
    const response = await this.request<{ sessionId: string; url: string }>(
      '/api/billing/create-checkout',
      {
        method: 'POST',
        body: JSON.stringify({ plan, restaurantId }),
      }
    );
    return response;
  }
}
