import { useMemo } from 'react';
import { useRestaurant, useRestaurantPlan } from '@/store/restaurantStore';
import { useDashboardStats, useQuotaStatus } from '@/store/dashboardStore';
import { useHasFeature } from './hooks';

/**
 * Hook to check if user should see subscription indicator
 * Only for self-service accounts with subscription
 */
export const useShouldShowSubscription = () => {
  const { isSelfService, plan } = useRestaurantPlan();
  const { stats } = useDashboardStats();

  return useMemo(
    () => ({
      shouldShow: isSelfService && plan !== undefined,
      isSelfService,
      plan,
      hasSubscription: plan !== undefined,
    }),
    [isSelfService, plan]
  );
};

/**
 * Hook to check if user should see quota indicator
 * Only for self-service accounts on starter plan with quota limits
 */
export const useShouldShowQuota = () => {
  const { isSelfService, isStarter } = useRestaurantPlan();
  const { quota, isNearLimit, isOverLimit, hasUnlimited } = useQuotaStatus();

  return useMemo(
    () => ({
      shouldShow: isSelfService && isStarter && quota && !hasUnlimited,
      isNearLimit,
      isOverLimit,
      quota,
      hasUnlimited,
    }),
    [isSelfService, isStarter, quota, hasUnlimited, isNearLimit, isOverLimit]
  );
};

/**
 * Hook to check if user should see widget section
 * Only for self-service accounts
 */
export const useShouldShowWidgetSection = () => {
  const { isSelfService } = useRestaurantPlan();
  const canCustomizeWidget = useHasFeature('widget-customization');

  return useMemo(
    () => ({
      shouldShow: isSelfService,
      canCustomizeWidget,
      isSelfService,
    }),
    [isSelfService, canCustomizeWidget]
  );
};

/**
 * Hook to check if user has revenue tracking enabled
 * Based on restaurant settings
 */
export const useHasRevenueTracking = () => {
  const { restaurant } = useRestaurant();
  const hasFeature = useHasFeature('revenue-tracking');

  return useMemo(
    () => ({
      hasAccess: hasFeature,
      isConfigured:
        restaurant?.reservationConfig?.averagePrice !== undefined &&
        restaurant.reservationConfig.averagePrice > 0,
      averagePrice: restaurant?.reservationConfig?.averagePrice,
    }),
    [hasFeature, restaurant?.reservationConfig?.averagePrice]
  );
};

/**
 * Hook to get dashboard data with optimized loading
 */
export const useDashboardData = () => {
  const { restaurant, isLoading: isLoadingRestaurant } = useRestaurant();
  const { stats, isLoading: isLoadingStats } = useDashboardStats();
  const { isSelfService, isPro, isStarter, plan } = useRestaurantPlan();

  const isLoading = isLoadingRestaurant || isLoadingStats;

  return useMemo(
    () => ({
      restaurant,
      stats,
      isLoading,
      isSelfService,
      isPro,
      isStarter,
      plan,
      hasData: !!restaurant && !!stats,
    }),
    [restaurant, stats, isLoading, isSelfService, isPro, isStarter, plan]
  );
};

// Note: useDashboardStats and useRestaurant are available from their respective stores
// Import them directly as needed:
// import { useDashboardStats } from '@/store/dashboardStore';
// import { useRestaurant } from '@/store/restaurantStore';
