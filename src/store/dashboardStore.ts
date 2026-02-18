import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '@/lib/api';

// Types for dashboard stats
export interface DashboardStats {
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
  quota?: {
    current: number;
    limit: number;
    remaining: number;
    percentage: number;
    isUnlimited: boolean;
  };
}

interface DashboardStore {
  // State
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;

  // Actions
  fetchStats: (force?: boolean) => Promise<void>;
  clearStats: () => void;
  updateStats: (updates: Partial<DashboardStats>) => void;

  // Derived state
  isStale: (staleMinutes?: number) => boolean;
}

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set, get) => ({
      // Initial state
      stats: null,
      isLoading: false,
      error: null,
      lastFetched: null,

      // Fetch dashboard stats with caching
      fetchStats: async (force = false) => {
        const { lastFetched, isLoading } = get();

        // Skip if already loading
        if (isLoading) return;

        // Skip if cached and not forced
        if (!force && lastFetched && Date.now() - lastFetched < CACHE_DURATION) {
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const stats = await apiClient.getDashboardStats();

          set({
            stats,
            lastFetched: Date.now(),
            error: null,
          });
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Unknown error';
          console.error('[DashboardStore] Error fetching stats:', err);
          set({ error: errorMessage, stats: null });
        } finally {
          set({ isLoading: false });
        }
      },

      // Clear stats data
      clearStats: () => {
        set({
          stats: null,
          lastFetched: null,
          error: null,
        });
      },

      // Update stats with partial data
      updateStats: (updates: Partial<DashboardStats>) => {
        const { stats } = get();
        if (stats) {
          set({
            stats: { ...stats, ...updates },
            lastFetched: Date.now(),
          });
        }
      },

      // Check if data is stale
      isStale: (staleMinutes = 5) => {
        const { lastFetched } = get();
        if (!lastFetched) return true;
        return Date.now() - lastFetched > staleMinutes * 60 * 1000;
      },
    }),
    {
      name: 'dashboard-storage',
      partialize: (state) => ({
        stats: state.stats,
        lastFetched: state.lastFetched,
      }),
    }
  )
);

// Helper hooks for common use cases
export const useDashboardStats = () => {
  const { stats, isLoading, error } = useDashboardStore();
  return { stats, isLoading, error };
};

// Hook to check quota status
export const useQuotaStatus = () => {
  const { stats } = useDashboardStore();
  const quota = stats?.quota;

  return {
    quota,
    isNearLimit: quota ? quota.percentage >= 80 : false,
    isOverLimit: quota ? quota.percentage >= 100 : false,
    hasUnlimited: quota ? quota.isUnlimited : false,
    remaining: quota ? quota.remaining : 0,
    percentage: quota ? quota.percentage : 0,
  };
};
