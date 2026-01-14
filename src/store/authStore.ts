import { create } from 'zustand';
import { User } from '@/types';
import { apiClient } from '@/lib/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User, token: string) => void;
  clearError: () => void;
  initAuth: () => void;
  syncCookie: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      console.log('[AuthStore] Attempting login for:', email);
      const response = await apiClient.login(email, password);
      console.log('[AuthStore] Login response:', { user: response.user, token: response.token?.substring(0, 10) + '...' });
       set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      // Sync cookie for middleware
      if (typeof window !== 'undefined' && response.token) {
        const isSecure = window.location.protocol === 'https:';
        let cookieString = `token=${response.token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
        if (isSecure) {
          cookieString += '; Secure';
        }
        document.cookie = cookieString;
        console.log('[AuthStore] Cookie synced after login');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      console.error('[AuthStore] Login error:', errorMessage, 'Full error:', error);
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Clear cookie
        document.cookie = 'token=; path=/; max-age=0';
      }
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  setUser: (user: User, token: string) => {
    apiClient.setToken(token);
    set({
      user,
      token,
      isAuthenticated: true,
      error: null,
    });
    // Sync cookie for middleware
    if (typeof window !== 'undefined') {
      const isSecure = window.location.protocol === 'https:';
      let cookieString = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      if (isSecure) {
        cookieString += '; Secure';
      }
      document.cookie = cookieString;
      console.log('[AuthStore] Cookie synced in setUser');
    }
  },

  clearError: () => {
    set({ error: null });
  },

  initAuth: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      const updates: Partial<AuthState> = { isInitialized: true };

       if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          updates.user = user;
          updates.token = token;
          updates.isAuthenticated = true;
          apiClient.setToken(token);
          // Ensure cookie is set for middleware with proper flags
          const isSecure = window.location.protocol === 'https:';
          let cookieString = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
          if (isSecure) {
            cookieString += '; Secure';
          }
          document.cookie = cookieString;
          console.log('[AuthStore] Cookie synced on init');
        } catch (error) {
          console.error('Failed to parse user from localStorage:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          document.cookie = 'token=; path=/; max-age=0';
        }
      }

      set(updates);

      // Register unauthorized callback
      apiClient.setOnUnauthorized(() => {
        console.log('Token expired or invalid, forcing logout...');
        // Clear local storage and cookies
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        document.cookie = 'token=; path=/; max-age=0';
        // Clear token from api client
        apiClient.setToken(null);
        
        // Update store state
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: 'Votre session a expiré. Veuillez vous reconnecter.',
        });
      });
    }
  },
  syncCookie: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (token && userStr) {
        try {
          // Validate token format (basic check)
          if (token.split('.').length !== 3) {
            console.error('Invalid token format, clearing auth');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            document.cookie = 'token=; path=/; max-age=0';
            return;
          }
          
          // Set cookie with secure flags
          const isSecure = window.location.protocol === 'https:';
          let cookieString = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
          if (isSecure) {
            cookieString += '; Secure';
          }
          document.cookie = cookieString;
          console.log('[AuthStore] Cookie synced');
        } catch (error) {
          console.error('Failed to sync cookie:', error);
        }
      } else {
        // No token, clear cookie
        document.cookie = 'token=; path=/; max-age=0';
      }
    }
  },
}));
