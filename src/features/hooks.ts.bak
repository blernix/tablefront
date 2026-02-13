import { useMemo } from 'react';
import { Feature, FeatureAccess, Plan } from './types';
import { FEATURE_CONFIG, PLAN_CONFIG } from './config';
import { useRestaurantStore } from '@/store/restaurantStore';

// Main hook to check feature access
export const useFeatureAccess = (feature: Feature): FeatureAccess => {
  const { restaurant, isLoading } = useRestaurantStore();
  const config = FEATURE_CONFIG[feature];
  
  return useMemo(() => {
    // Default state when loading or no data
    if (isLoading || !restaurant || !config) {
      return {
        hasAccess: false,
        feature,
        reason: isLoading ? undefined : 'plan',
      };
    }
    
    const accountType = restaurant.accountType;
    // Managed accounts use virtual 'managed' plan, self-service use their subscription plan
    const plan = accountType === 'managed' 
      ? 'managed' 
      : (restaurant.subscription?.plan as Plan | undefined);
    
    // If self-service doesn't have a plan (shouldn't happen), treat as no access
    if (!plan) {
      return {
        hasAccess: false,
        feature,
        reason: 'plan',
        currentAccountType: accountType,
      };
    }
    
    const hasPlanAccess = config.allowedPlans.includes(plan);
    const hasAccountTypeAccess = config.allowedAccountTypes.includes(accountType);
    
    if (!hasPlanAccess) {
      // For self-service accounts, filter out 'managed' plan from required options
      const eligiblePlans = config.allowedPlans.filter(allowedPlan => 
        accountType === 'self-service' ? allowedPlan !== 'managed' : true
      );
      
      return {
        hasAccess: false,
        feature,
        reason: 'plan',
        requiredPlan: eligiblePlans[0] || config.allowedPlans[0],
        currentPlan: plan,
        currentAccountType: accountType,
      };
    }
    
    if (!hasAccountTypeAccess) {
      return {
        hasAccess: false,
        feature,
        reason: 'account-type',
        requiredAccountType: config.allowedAccountTypes[0],
        currentPlan: plan,
        currentAccountType: accountType,
      };
    }
    
    // Check dependencies if any
    if (config.requires) {
      const missingDeps = config.requires.filter(dep => {
        const depConfig = FEATURE_CONFIG[dep];
        if (!depConfig) return true; // missing config means no access
        const hasPlanAccess = depConfig.allowedPlans.includes(plan);
        const hasAccountTypeAccess = depConfig.allowedAccountTypes.includes(accountType);
        return !hasPlanAccess || !hasAccountTypeAccess;
      });
      if (missingDeps.length > 0) {
        return {
          hasAccess: false,
          feature,
          reason: 'dependency',
          currentPlan: plan,
          currentAccountType: accountType,
        };
      }
    }
    
    // All checks passed
    return {
      hasAccess: true,
      feature,
      currentPlan: plan,
      currentAccountType: accountType,
    };
  }, [feature, restaurant, isLoading, config]);
};

// Simplified boolean check (for conditional rendering)
export const useHasFeature = (feature: Feature): boolean => {
  const { hasAccess } = useFeatureAccess(feature);
  return hasAccess;
};

// Get all features accessible to current user
export const useUserFeatures = (): Feature[] => {
  const { restaurant, isLoading } = useRestaurantStore();
  
  return useMemo(() => {
    if (isLoading || !restaurant) return [];
    
    const accountType = restaurant.accountType;
    const plan = accountType === 'managed' 
      ? 'managed' 
      : (restaurant.subscription?.plan as Plan | undefined);
    
    if (!plan) return [];
    
    return Object.values(FEATURE_CONFIG)
      .filter(config => 
        config.allowedPlans.includes(plan) && 
        config.allowedAccountTypes.includes(accountType)
      )
      .map(config => config.feature);
  }, [restaurant, isLoading]);
};

// Get current plan configuration
export const useCurrentPlan = () => {
  const { restaurant, isLoading } = useRestaurantStore();
  
  return useMemo(() => {
    if (isLoading || !restaurant) {
      return null;
    }
    
    // Managed accounts use virtual 'managed' plan
    const planId = restaurant.accountType === 'managed' 
      ? 'managed' 
      : (restaurant.subscription?.plan as Plan | undefined);
    
    if (!planId) {
      return null;
    }
    
    return PLAN_CONFIG[planId] || null;
  }, [restaurant, isLoading]);
};

// Check if user can upgrade for a specific feature
export const useUpgradeRequired = (feature: Feature): {
  requiresUpgrade: boolean;
  requiredPlan?: Plan;
  currentPlan?: Plan;
} => {
  const { restaurant } = useRestaurantStore();
  const config = FEATURE_CONFIG[feature];
  const { hasAccess, reason } = useFeatureAccess(feature);
  
  return useMemo(() => {
    if (hasAccess) {
      return { requiresUpgrade: false };
    }
    
    // Managed accounts don't need upgrades
    if (restaurant?.accountType === 'managed') {
      return { requiresUpgrade: false };
    }
    
    if (reason === 'plan' && config && restaurant?.subscription?.plan) {
      // For self-service accounts, filter out 'managed' plan from required options
      const eligiblePlans = config.allowedPlans.filter(plan => 
        restaurant.accountType === 'self-service' ? plan !== 'managed' : true
      );
      
      if (eligiblePlans.length > 0) {
        return {
          requiresUpgrade: true,
          requiredPlan: eligiblePlans[0],
          currentPlan: restaurant.subscription.plan as Plan,
        };
      }
    }
    
    return { requiresUpgrade: false };
  }, [hasAccess, reason, config, restaurant]);
};

// Feature guard component props
export interface FeatureGuardProps {
  feature: Feature;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgradePrompt?: boolean;
}

// Quick access hooks for common features
export const useCanAccessMenus = () => useHasFeature('menus');
export const useCanCustomizeWidget = () => useHasFeature('widget-customization');
export const useHasCustomSlug = () => useHasFeature('custom-slug');
export const useHasAdvancedAnalytics = () => useHasFeature('advanced-analytics');
export const useHasMultipleLocations = () => useHasFeature('multiple-locations');
export const useHasAPIAccess = () => useHasFeature('api-full-access');