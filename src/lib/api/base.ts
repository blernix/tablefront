export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export class ApiClient {
  protected baseUrl: string;
  private token: string | null = null;
  private onUnauthorizedCallback: (() => void) | null = null;
  private isRefreshing = false;
  private refreshPromise: Promise<{ token: string }> | null = null;
  private static pendingRequests = 0; // Track concurrent requests
  private static maxConcurrentRequests = 0; // Track peak

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;

    // Load token from localStorage on client side
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  setOnUnauthorized(callback: () => void) {
    this.onUnauthorizedCallback = callback;
  }

  setToken(token: string | null) {
    console.log('[API] setToken called:', token ? `token length: ${token.length}` : 'null');

    // Validate token format if provided
    if (token && token.split('.').length !== 3) {
      console.error('[API] Invalid token format (not a JWT), rejecting token:', token.substring(0, 50) + '...');
      token = null;
    }

    // Decode and log token expiration if valid
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const exp = payload.exp ? new Date(payload.exp * 1000) : null;
        const now = new Date();
        const timeLeft = exp ? Math.max(0, (exp.getTime() - now.getTime()) / 1000) : null;
        console.log(`[API] Token payload:`, {
          userId: payload.userId,
          email: payload.email,
          exp: exp?.toISOString(),
          timeLeft: timeLeft !== null ? `${Math.floor(timeLeft / 60)}m ${Math.floor(timeLeft % 60)}s` : 'none'
        });
      } catch (e) {
        console.warn('[API] Failed to decode token payload:', e);
      }
    }

    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('token', token);
        // Also sync cookie for middleware
        const isSecure = window.location.protocol === 'https:';
        let cookieString = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
        if (isSecure) {
          cookieString += '; Secure';
        }
        document.cookie = cookieString;
        console.log('[API] Cookie synced with token, document.cookie after:', document.cookie.substring(0, 100));
      } else {
        localStorage.removeItem('token');
        // Clear cookie
        document.cookie = 'token=; path=/; max-age=0';
        console.log('[API] Token cleared, document.cookie after:', document.cookie);
      }
    }
  }

  protected async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Sync token from localStorage on client side
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      if (storedToken !== this.token) {
        console.log(`[API] Token sync: updating from localStorage (changed: ${!!this.token} -> ${!!storedToken})`);
        this.token = storedToken;
        // Log token expiration after sync
        if (storedToken) {
          try {
            const payload = JSON.parse(atob(storedToken.split('.')[1]));
            const exp = payload.exp ? new Date(payload.exp * 1000) : null;
            const now = new Date();
            const timeLeft = exp ? Math.max(0, (exp.getTime() - now.getTime()) / 1000) : null;
            console.log(`[API] Synced token expiration:`, {
              exp: exp?.toISOString(),
              timeLeft: timeLeft !== null ? `${Math.floor(timeLeft / 60)}m ${Math.floor(timeLeft % 60)}s` : 'none',
              expired: timeLeft !== null && timeLeft <= 0
            });
          } catch (e) {
            console.warn('[API] Failed to decode synced token:', e);
          }
        }
      }
    }

    // Check token expiration and warn if close to expiry
    if (this.token) {
      try {
        const payload = JSON.parse(atob(this.token.split('.')[1]));
        const exp = payload.exp ? new Date(payload.exp * 1000) : null;
        const now = new Date();
        const timeLeft = exp ? (exp.getTime() - now.getTime()) / 1000 : null;
        if (timeLeft !== null && timeLeft > 0 && timeLeft < 300) { // less than 5 minutes
          console.warn(`[API] Token expires soon: ${Math.floor(timeLeft)} seconds left`);
        }
      } catch (e) {
        // ignore decoding errors
      }
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
      console.log(`[API] Request to ${endpoint} with token (length: ${this.token.length})`);
    } else {
      console.warn(`[API] Request to ${endpoint} without token`);
    }

    let response;
    let retries = 0;
    const maxRetries = 2; // Retry up to 2 times for network errors
    let startTime = 0;

    while (retries <= maxRetries) {
      try {
        // Track concurrent requests
        ApiClient.pendingRequests++;
        ApiClient.maxConcurrentRequests = Math.max(ApiClient.maxConcurrentRequests, ApiClient.pendingRequests);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout (increased from 30s)

        console.log(`[API] 🚀 Sending request to ${endpoint}`, {
          method: options.method || 'GET',
          hasToken: !!this.token,
          concurrent: ApiClient.pendingRequests,
          peak: ApiClient.maxConcurrentRequests
        });
        startTime = Date.now();

        response = await fetch(`${this.baseUrl}${endpoint}`, {
          ...options,
          headers,
          credentials: 'include',
          signal: controller.signal,
        });

        const duration = Date.now() - startTime;
        ApiClient.pendingRequests--; // Request completed
        console.log(`[API] ✅ Received response from ${endpoint} in ${duration}ms`, {
          status: response.status,
          concurrent: ApiClient.pendingRequests,
          peak: ApiClient.maxConcurrentRequests
        });

        clearTimeout(timeoutId);
        break; // Success, exit retry loop
      } catch (error) {
        retries++;
        ApiClient.pendingRequests--; // Request failed
        const duration = Date.now() - startTime;

        if (error instanceof DOMException && error.name === 'AbortError') {
          console.error(`[API] ❌ Request timeout for ${endpoint} after ${duration}ms`, {
            concurrent: ApiClient.pendingRequests,
            peak: ApiClient.maxConcurrentRequests
          });
          throw new Error(`Request timeout after ${duration}ms - please check your connection`);
        }

        // Retry on network errors (like during Hot Reload)
        if (retries <= maxRetries) {
          console.warn(`[API] ⚠️ Network error for ${endpoint}, retrying (${retries}/${maxRetries})...`, {
            error,
            concurrent: ApiClient.pendingRequests
          });
          await new Promise(resolve => setTimeout(resolve, 500 * retries)); // Exponential backoff
          continue;
        }

        console.error(`[API] ❌ Network error for ${endpoint} after ${retries} retries:`, {
          error,
          concurrent: ApiClient.pendingRequests,
          peak: ApiClient.maxConcurrentRequests
        });
        throw new Error(`Failed to fetch: ${error instanceof Error ? error.message : 'Network error'}`);
      }
    }

    if (!response) {
      throw new Error('No response received');
    }

     // Handle 204 No Content
    if (response.status === 204) {
      if (!response.ok) {
        throw new Error('An error occurred');
      }
      return undefined as T;
    }

    const data = await response.json();

    if (!response.ok) {
      // Check for 401 Unauthorized (token expired or invalid)
      // Skip for auth endpoints (login, logout, password reset)
      const isAuthEndpoint = endpoint.includes('/api/auth/');
      if (response.status === 401 && this.onUnauthorizedCallback && !isAuthEndpoint) {
        console.log(`[API] 401 Unauthorized for ${endpoint}, attempting token refresh`);

        // Try to refresh token (only once)
        try {
          if (this.isRefreshing) {
            // Wait for ongoing refresh - store promise reference before await
            console.log('[API] Waiting for ongoing token refresh...');
            const currentRefreshPromise = this.refreshPromise;
            if (!currentRefreshPromise) {
              console.warn('[API] No refresh promise found, retrying request');
              return this.request<T>(endpoint, options);
            }
            await currentRefreshPromise;
            // After refresh, retry the request with new token
            console.log('[API] Token refresh completed, retrying request');
            return this.request<T>(endpoint, options);
          } else {
            this.isRefreshing = true;
            this.refreshPromise = this.refreshToken();
            const refreshResult = await this.refreshPromise;

            // Update token
            this.setToken(refreshResult.token);
            console.log('[API] Token refreshed successfully, retrying request');

            // Clear refresh state
            this.isRefreshing = false;
            this.refreshPromise = null;

            // Retry the original request with new token
            return this.request<T>(endpoint, options);
          }
        } catch (refreshError) {
          console.error('[API] Token refresh failed:', refreshError);
          // Clear refresh state
          this.isRefreshing = false;
          this.refreshPromise = null;
          // Trigger logout
          console.log(`[API] Triggering logout due to failed refresh`);
          this.onUnauthorizedCallback();
        }
      }
      console.error(`[API] Request failed for ${endpoint}: ${response.status}`, data.error?.message);
      throw new Error(data.error?.message || 'An error occurred');
    }

    return data;
  }

  protected async uploadFile<T>(
    endpoint: string,
    file: File,
    fieldName: string = 'file'
  ): Promise<T> {
    const formData = new FormData();
    formData.append(fieldName, file);

    const headers: Record<string, string> = {};

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      // Check for 401 Unauthorized (token expired or invalid)
      // Skip for auth endpoints (login, logout, password reset)
      const isAuthEndpoint = endpoint.includes('/api/auth/');
      if (response.status === 401 && this.onUnauthorizedCallback && !isAuthEndpoint) {
        console.log(`[API] 401 Unauthorized for ${endpoint} (upload), attempting token refresh`);

        // Try to refresh token (only once)
        try {
          if (this.isRefreshing) {
            // Wait for ongoing refresh - store promise reference before await
            console.log('[API] Waiting for ongoing token refresh...');
            const currentRefreshPromise = this.refreshPromise;
            if (!currentRefreshPromise) {
              console.warn('[API] No refresh promise found, retrying upload');
              return this.uploadFile<T>(endpoint, file, fieldName);
            }
            await currentRefreshPromise;
            // After refresh, retry the upload with new token
            console.log('[API] Token refresh completed, retrying upload');
            return this.uploadFile<T>(endpoint, file, fieldName);
          } else {
            this.isRefreshing = true;
            this.refreshPromise = this.refreshToken();
            const refreshResult = await this.refreshPromise;

            // Update token
            this.setToken(refreshResult.token);
            console.log('[API] Token refreshed successfully, retrying upload');

            // Clear refresh state
            this.isRefreshing = false;
            this.refreshPromise = null;

            // Retry the original upload with new token
            return this.uploadFile<T>(endpoint, file, fieldName);
          }
        } catch (refreshError) {
          console.error('[API] Token refresh failed:', refreshError);
          // Clear refresh state
          this.isRefreshing = false;
          this.refreshPromise = null;
          // Trigger logout
          console.log(`[API] Triggering logout due to failed refresh`);
          this.onUnauthorizedCallback();
        }
      }
      throw new Error(data.error?.message || 'An error occurred');
    }

    return data;
  }

  async refreshToken(): Promise<{ token: string }> {
    console.log('[API] Refreshing token');
    const response = await this.request<{ token: string }>('/api/auth/refresh', {
      method: 'POST',
    });
    console.log('[API] Token refreshed successfully');

    // Validate the returned token
    if (!response.token || response.token.split('.').length !== 3) {
      console.error('[API] Invalid token received from refresh endpoint:', response.token?.substring(0, 50) + '...');
      throw new Error('Invalid token received from server');
    }

    return response;
  }

  async healthCheck(): Promise<{ status: string }> {
    return this.request('/health');
  }
}
