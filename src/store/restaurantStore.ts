import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Restaurant } from '@/types';
import { apiClient } from '@/lib/api';

interface RestaurantStore {
  // State
  restaurant: Restaurant | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  lastServerUpdatedAt: string | null;

  // Actions
  fetchRestaurant: (force?: boolean) => Promise<void>;
  clearRestaurant: () => void;
  updateRestaurant: (updates: Partial<Restaurant>) => void;
  setRestaurant: (restaurant: Restaurant | null) => void;
  invalidateCache: () => void;

  // Derived state
  isStale: (staleMinutes?: number) => boolean;
}

// Cache duration in milliseconds (1 minute)
const CACHE_DURATION = 60 * 1000;

export const useRestaurantStore = create<RestaurantStore>()(
  persist(
    (set, get) => ({
      // Initial state
      restaurant: null,
      isLoading: false,
      error: null,
      lastFetched: null,
      lastServerUpdatedAt: null,

      // Fetch restaurant data with caching
      fetchRestaurant: async (force = false) => {
        const { lastFetched, isLoading, restaurant, lastServerUpdatedAt } = get();

        // Skip if already loading
        if (isLoading) return;

        // Check if we need to fetch (force, no cache, cache expired, or server data changed)
        const shouldFetch =
          force ||
          !lastFetched ||
          Date.now() - lastFetched >= CACHE_DURATION ||
          (restaurant?.updatedAt && restaurant.updatedAt !== lastServerUpdatedAt);

        if (!shouldFetch) {
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.getMyRestaurant();

          set({
            restaurant: response.restaurant,
            lastFetched: Date.now(),
            lastServerUpdatedAt: response.restaurant?.updatedAt || null,
            error: null,
          });
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Unknown error';
          console.error('[RestaurantStore] Error fetching restaurant:', err);
          set({ error: errorMessage, restaurant: null, lastServerUpdatedAt: null });
        } finally {
          set({ isLoading: false });
        }
      },

      // Clear restaurant data
      clearRestaurant: () => {
        set({
          restaurant: null,
          lastFetched: null,
          lastServerUpdatedAt: null,
          error: null,
        });
      },

      // Invalidate cache (keep data but mark as stale)
      invalidateCache: () => {
        set({ lastFetched: null });
      },

      // Update restaurant with partial data
      updateRestaurant: (updates: Partial<Restaurant>) => {
        const { restaurant } = get();
        if (restaurant) {
          set({
            restaurant: { ...restaurant, ...updates },
            lastFetched: Date.now(),
            lastServerUpdatedAt: updates.updatedAt || restaurant.updatedAt,
          });
        }
      },

      // Direct set (for admin purposes)
      setRestaurant: (restaurant: Restaurant | null) => {
        set({
          restaurant,
          lastFetched: restaurant ? Date.now() : null,
          lastServerUpdatedAt: restaurant?.updatedAt || null,
          error: null,
        });
      },

      // Check if data is stale
      isStale: (staleMinutes = 5) => {
        const { lastFetched } = get();
        if (!lastFetched) return true;
        return Date.now() - lastFetched > staleMinutes * 60 * 1000;
      },
    }),
    {
      name: 'restaurant-storage',
      partialize: (state) => ({
        restaurant: state.restaurant,
        lastFetched: state.lastFetched,
        lastServerUpdatedAt: state.lastServerUpdatedAt,
      }),
    }
  )
);

// Helper hooks for common use cases
export const useRestaurant = () => {
  const { restaurant, isLoading, error } = useRestaurantStore();
  return { restaurant, isLoading, error };
};

export const useRestaurantPlan = () => {
  const { restaurant } = useRestaurantStore();
  const plan = restaurant?.subscription?.plan;
  return {
    plan: plan as 'starter' | 'pro' | 'enterprise' | undefined,
    accountType: restaurant?.accountType as 'managed' | 'self-service' | undefined,
    isPro: plan === 'pro',
    isStarter: plan === 'starter',
    isEnterprise: plan === 'enterprise',
    isSelfService: restaurant?.accountType === 'self-service',
    isManaged: restaurant?.accountType === 'managed',
  };
};

// Hook to invalidate restaurant cache
export const useInvalidateRestaurantCache = () => {
  const invalidateCache = useRestaurantStore((state) => state.invalidateCache);
  return invalidateCache;
};

// Helper to get available time slots for a specific day (15-min intervals, validated by service duration)
export const getAvailableTimeSlots = (
  restaurant: Restaurant | null,
  dayOfWeek: number // 0 = Sunday, 1 = Monday, etc.
): string[] => {
  if (!restaurant || !restaurant.openingHours) return [];

  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayName = dayNames[dayOfWeek] as keyof typeof restaurant.openingHours;
  const daySchedule = restaurant.openingHours[dayName];

  if (!daySchedule || daySchedule.closed || !daySchedule.slots || daySchedule.slots.length === 0) {
    return [];
  }

  const serviceDuration = restaurant.reservationConfig?.defaultDuration || 90;
  const allSlots: string[] = [];

  daySchedule.slots.forEach((slot) => {
    const [startHour, startMin] = slot.start.split(':').map(Number);
    const [endHour, endMin] = slot.end.split(':').map(Number);

    const startTotal = startHour * 60 + startMin;
    const endTotal = endHour * 60 + endMin;

    // 15-minute intervals — slot is valid only if a full service fits before closing
    for (let current = startTotal; current + serviceDuration <= endTotal; current += 15) {
      const h = Math.floor(current / 60);
      const m = current % 60;
      allSlots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
    }
  });

  return allSlots;
};

// Count how many services (reservation slots) fit in each opening period
export const getServicesPerDay = (
  restaurant: Restaurant | null,
): Record<string, { lunch: number; dinner: number; total: number }> => {
  const defaultCount = { lunch: 0, dinner: 0, total: 0 };
  if (!restaurant || !restaurant.openingHours) return {};

  const serviceDuration = restaurant.reservationConfig?.defaultDuration || 90;
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const result: Record<string, { lunch: number; dinner: number; total: number }> = {};

  dayNames.forEach((dayName) => {
    const day = restaurant.openingHours[dayName as keyof typeof restaurant.openingHours];
    if (!day || day.closed || !day.slots) {
      result[dayName] = { ...defaultCount };
      return;
    }

    let lunch = 0, dinner = 0;
    day.slots.forEach((slot) => {
      const [startH] = slot.start.split(':').map(Number);
      const [startHour, startMin] = slot.start.split(':').map(Number);
      const [endHour, endMin] = slot.end.split(':').map(Number);
      const totalMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
      const count = Math.floor(totalMinutes / serviceDuration);

      if (startH < 17) lunch += count;
      else dinner += count;
    });

    result[dayName] = { lunch, dinner, total: lunch + dinner };
  });

  return result;
};

// Helper to check if a time is within opening hours AND a full service fits before closing
export const isTimeWithinOpeningHours = (
  restaurant: Restaurant | null,
  dayOfWeek: number,
  time: string
): boolean => {
  if (!restaurant || !restaurant.openingHours) return true;
  if (!restaurant.reservationConfig?.useOpeningHours) return true;

  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayName = dayNames[dayOfWeek] as keyof typeof restaurant.openingHours;
  const daySchedule = restaurant.openingHours[dayName];

  if (!daySchedule || daySchedule.closed) return false;

  const [inputHour, inputMin] = time.split(':').map(Number);
  const inputMinutes = inputHour * 60 + inputMin;
  const serviceDuration = restaurant.reservationConfig?.defaultDuration || 90;
  const endMinutes = inputMinutes + serviceDuration;

  return daySchedule.slots.some((slot) => {
    const [startHour, startMin] = slot.start.split(':').map(Number);
    const [endHour, endMin] = slot.end.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const slotEndMinutes = endHour * 60 + endMin;

    // Time must be within the slot AND the full service must fit before the slot ends
    return inputMinutes >= startMinutes && endMinutes <= slotEndMinutes;
  });
};
