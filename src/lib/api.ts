import {
  AuthResponse,
  User,
  Restaurant,
  CreateRestaurantInput,
  UpdateRestaurantInput,
  OpeningHours,
  Closure,
  CreateClosureInput,
  MenuCategory,
  CreateCategoryInput,
  UpdateCategoryInput,
  Dish,
  CreateDishInput,
  UpdateDishInput,
  Reservation,
  CreateReservationInput,
  UpdateReservationInput,
  DayBlock,
  CreateDayBlockInput,
  BulkCreateDayBlocksInput,
  ServerUser,
  CreateServerUserInput,
  UpdateServerUserInput,
  RestaurantAnalytics,
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;
  private onUnauthorizedCallback: (() => void) | null = null;
  private isRefreshing = false;
  private refreshPromise: Promise<{ token: string }> | null = null;

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

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Sync token from localStorage on client side
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      if (storedToken !== this.token) {
        console.log(`[API] Token sync: updating from localStorage (changed: ${!!this.token} -> ${!!storedToken})`);
        this.token = storedToken;
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
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
    } catch (error) {
      console.error(`[API] Network error for ${endpoint}:`, error);
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new Error('Request timeout - please check your connection');
      }
      throw new Error(`Failed to fetch: ${error instanceof Error ? error.message : 'Network error'}`);
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
            // Wait for ongoing refresh
            console.log('[API] Waiting for ongoing token refresh...');
            await this.refreshPromise;
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



  private async uploadFile<T>(
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
            // Wait for ongoing refresh
            console.log('[API] Waiting for ongoing token refresh...');
            await this.refreshPromise;
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

  // Refresh token
  async refreshToken(): Promise<{ token: string }> {
    console.log('[API] Refreshing token');
    const response = await this.request<{ token: string }>('/api/auth/refresh', {
      method: 'POST',
    });
    console.log('[API] Token refreshed successfully');
    return response;
  }

  // Auth endpoints
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

  // Password reset
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

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    return this.request('/health');
  }

  // Admin - Restaurant Management
  async getRestaurants(page = 1, limit = 20): Promise<{
    restaurants: Restaurant[];
    pagination: { total: number; page: number; pages: number; limit: number };
  }> {
    return this.request(`/api/admin/restaurants?page=${page}&limit=${limit}`);
  }

  async createRestaurant(data: CreateRestaurantInput): Promise<{
    restaurant: Restaurant;
    apiKey: string;
  }> {
    return this.request('/api/admin/restaurants', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getRestaurant(id: string): Promise<{ restaurant: Restaurant }> {
    return this.request(`/api/admin/restaurants/${id}`);
  }

  async updateRestaurant(id: string, data: UpdateRestaurantInput): Promise<{
    restaurant: Restaurant;
  }> {
    return this.request(`/api/admin/restaurants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteRestaurant(id: string): Promise<void> {
    return this.request(`/api/admin/restaurants/${id}`, {
      method: 'DELETE',
    });
  }

  async regenerateApiKey(id: string): Promise<{ apiKey: string }> {
    return this.request(`/api/admin/restaurants/${id}/regenerate-api-key`, {
      method: 'PUT',
    });
  }

  async createRestaurantUser(
    restaurantId: string,
    email: string,
    password: string
  ): Promise<{ user: User }> {
    return this.request(`/api/admin/restaurants/${restaurantId}/users`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getRestaurantUsers(restaurantId: string): Promise<{ users: User[] }> {
    return this.request(`/api/admin/restaurants/${restaurantId}/users`);
  }

  async updateUser(userId: string, data: { email?: string; password?: string }): Promise<{ user: User }> {
    return this.request(`/api/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteUser(userId: string): Promise<void> {
    return this.request(`/api/admin/users/${userId}`, {
      method: 'DELETE',
    });
  }

  async getAdminDashboard(): Promise<{
    stats: {
      restaurants: {
        total: number;
        active: number;
        inactive: number;
        recent: number;
      };
      users: {
        total: number;
        admin: number;
        restaurant: number;
        server: number;
      };
      reservations: {
        recent: number;
      };
      topRestaurants: Array<{
        restaurantId: string;
        restaurantName: string;
        reservationCount: number;
      }>;
    };
  }> {
    return this.request('/api/admin/dashboard');
  }

  async getRestaurantAnalytics(
    restaurantId: string, 
    period?: string, 
    startDate?: string, 
    endDate?: string
  ): Promise<{ analytics: RestaurantAnalytics }> {
    const queryParams = new URLSearchParams();
    if (period) queryParams.append('period', period);
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);
    
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return this.request(`/api/admin/restaurants/${restaurantId}/analytics${query}`);
  }

  // Data export
  async exportRestaurants(): Promise<void> {
    const response = await this.fetchWithBlob('/api/admin/export/restaurants');
    this.downloadBlob(response.blob, 'restaurants.csv');
  }

  async exportUsers(): Promise<void> {
    const response = await this.fetchWithBlob('/api/admin/export/users');
    this.downloadBlob(response.blob, 'users.csv');
  }

  async exportReservations(): Promise<void> {
    const response = await this.fetchWithBlob('/api/admin/export/reservations');
    this.downloadBlob(response.blob, 'reservations.csv');
  }

  private async fetchWithBlob(endpoint: string): Promise<{ blob: Blob }> {
    const headers: Record<string, string> = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.error?.message || 'Export failed');
      } catch {
        throw new Error(`Export failed: ${response.status} ${response.statusText}`);
      }
    }

    const blob = await response.blob();
    return { blob };
  }

  private downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  // Restaurant - Own data management
  async getMyRestaurant(): Promise<{ restaurant: Restaurant }> {
    return this.request('/api/restaurant/me');
  }

  async getDashboardStats(): Promise<{
    today: {
      reservations: number;
      guests: number;
      estimatedRevenue: number;
      upcomingReservations: Array<{
        _id: string;
        customerName: string;
        time: string;
        numberOfGuests: number;
        status: string;
      }>;
    };
    thisWeek: {
      reservations: number;
      guests: number;
      estimatedRevenue: number;
      avgOccupation: number;
    };
    menu: {
      categories: number;
      dishes: number;
    };
  }> {
    return this.request('/api/restaurant/dashboard-stats');
  }

  async updateBasicInfo(data: {
    name?: string;
    address?: string;
    phone?: string;
    email?: string;
  }): Promise<{ restaurant: Restaurant }> {
    return this.request('/api/restaurant/basic-info', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateOpeningHours(data: Partial<OpeningHours>): Promise<{
    openingHours: OpeningHours;
  }> {
    return this.request('/api/restaurant/opening-hours', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Closures
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

  // Menu Management
  async uploadMenuPdf(file: File): Promise<{
    message: string;
    menu: {
      displayMode: 'pdf' | 'detailed';
      pdfUrl?: string;
    };
  }> {
    const formData = new FormData();
    formData.append('pdf', file);

    const headers: Record<string, string> = {};

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}/api/restaurant/menu/pdf`, {
      method: 'POST',
      headers,
      body: formData,
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'An error occurred');
    }

    return data;
  }

  // Menu Categories
  async getCategories(): Promise<{ categories: MenuCategory[] }> {
    return this.request('/api/menu/categories');
  }

  async createCategory(data: CreateCategoryInput): Promise<{ category: MenuCategory }> {
    return this.request('/api/menu/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCategory(id: string, data: UpdateCategoryInput): Promise<{ category: MenuCategory }> {
    return this.request(`/api/menu/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCategory(id: string): Promise<void> {
    return this.request(`/api/menu/categories/${id}`, {
      method: 'DELETE',
    });
  }

  async reorderCategories(categoryIds: string[]): Promise<{ categories: MenuCategory[] }> {
    return this.request('/api/menu/categories/reorder', {
      method: 'PUT',
      body: JSON.stringify({ categoryIds }),
    });
  }

  // Menu Dishes
  async getDishes(categoryId?: string): Promise<{ dishes: Dish[] }> {
    const query = categoryId ? `?categoryId=${categoryId}` : '';
    return this.request(`/api/menu/dishes${query}`);
  }

  async createDish(data: CreateDishInput): Promise<{ dish: Dish }> {
    return this.request('/api/menu/dishes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateDish(id: string, data: UpdateDishInput): Promise<{ dish: Dish }> {
    return this.request(`/api/menu/dishes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteDish(id: string): Promise<void> {
    return this.request(`/api/menu/dishes/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleDishAvailability(id: string): Promise<{ dish: Dish }> {
    return this.request(`/api/menu/dishes/${id}/toggle-availability`, {
      method: 'PATCH',
    });
  }

  async uploadDishPhoto(id: string, file: File): Promise<{ dish: Dish }> {
    return this.uploadFile(`/api/menu/dishes/${id}/photo`, file, 'photo');
  }

  async deleteDishPhoto(id: string): Promise<{ dish: Dish }> {
    return this.request(`/api/menu/dishes/${id}/photo`, {
      method: 'DELETE',
    });
  }

  // Menu Mode
  async switchMenuMode(displayMode: 'pdf' | 'detailed' | 'both'): Promise<{
    message: string;
    menu: {
      displayMode: 'pdf' | 'detailed' | 'both';
      pdfUrl?: string;
    };
  }> {
    return this.request('/api/restaurant/menu/mode', {
      method: 'PUT',
      body: JSON.stringify({ displayMode }),
    });
  }

  // Tables Configuration
  async updateTablesConfig(data: {
    mode?: 'simple' | 'detailed';
    totalTables?: number;
    averageCapacity?: number;
    tables?: Array<{ type: string; quantity: number; capacity: number }>;
  }): Promise<{
    message: string;
    tablesConfig: {
      mode: 'simple' | 'detailed';
      totalTables?: number;
      averageCapacity?: number;
      tables?: Array<{ type: string; quantity: number; capacity: number }>;
    };
  }> {
    return this.request('/api/restaurant/tables-config', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Reservation Configuration
  async updateReservationConfig(data: {
    defaultDuration?: number;
    useOpeningHours?: boolean;
    averagePrice?: number;
  }): Promise<{
    message: string;
    reservationConfig: {
      defaultDuration: number;
      useOpeningHours: boolean;
      averagePrice?: number;
    };
  }> {
    return this.request('/api/restaurant/reservation-config', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Reservations
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

  // Day Blocks
  async getDayBlocks(): Promise<{ dayBlocks: DayBlock[] }> {
    return this.request('/api/day-blocks');
  }

  async checkDayBlock(date: string): Promise<{
    isBlocked: boolean;
    dayBlock: DayBlock | null;
  }> {
    return this.request(`/api/day-blocks/check/${date}`);
  }

  async createDayBlock(data: CreateDayBlockInput): Promise<{ dayBlock: DayBlock }> {
    return this.request('/api/day-blocks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async bulkCreateDayBlocks(data: BulkCreateDayBlocksInput): Promise<{
    message: string;
    dayBlocks: DayBlock[];
    errors?: Array<{ date: string; reason: string }>;
  }> {
    return this.request('/api/day-blocks/bulk', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteDayBlock(id: string): Promise<{ message: string }> {
    return this.request(`/api/day-blocks/${id}`, {
      method: 'DELETE',
    });
  }

  // Server User Management
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

export const apiClient = new ApiClient(API_URL);
