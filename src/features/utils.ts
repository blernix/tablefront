import { Feature, Plan, AccountType } from './types';
import { FEATURE_CONFIG, PLAN_CONFIG } from './config';
import { Restaurant } from '@/types';

// Get display configuration for a plan
export const getPlanDisplay = (plan: Plan | undefined) => {
  switch (plan) {
    case 'starter':
      return {
        name: 'Pack Gestion',
        colorClass: 'text-yellow-700',
        bgColorClass: 'bg-yellow-100',
        badgeClass: 'bg-yellow-100 text-yellow-700',
      };
    case 'pro':
      return {
        name: 'Pack Croissance',
        colorClass: 'text-purple-700',
        bgColorClass: 'bg-purple-100',
        badgeClass: 'bg-purple-100 text-purple-700',
      };
    case 'enterprise':
      return {
        name: 'Enterprise',
        colorClass: 'text-blue-700',
        bgColorClass: 'bg-blue-100',
        badgeClass: 'bg-blue-100 text-blue-700',
      };
    case 'managed':
      return {
        name: 'Managed',
        colorClass: 'text-green-700',
        bgColorClass: 'bg-green-100',
        badgeClass: 'bg-green-100 text-green-700',
      };
    default:
      return {
        name: 'N/A',
        colorClass: 'text-gray-700',
        bgColorClass: 'bg-gray-100',
        badgeClass: 'bg-gray-100 text-gray-700',
      };
  }
};

// Check if a restaurant has access to a specific feature
export const restaurantHasFeature = (
  restaurant: Restaurant | null | undefined,
  feature: Feature
): boolean => {
  if (!restaurant) return false;

  const plan = restaurant.subscription?.plan as Plan | undefined;
  const accountType = restaurant.accountType as AccountType;
  const config = FEATURE_CONFIG[feature];

  if (!config || !plan) return false;

  const hasPlanAccess = config.allowedPlans.includes(plan);
  const hasAccountTypeAccess = config.allowedAccountTypes.includes(accountType);

  return hasPlanAccess && hasAccountTypeAccess;
};

// Get display configuration for a restaurant's plan
export const getRestaurantPlanDisplay = (restaurant: Restaurant | null | undefined) => {
  const plan = restaurant?.subscription?.plan as Plan | undefined;
  const isSelfService = restaurant?.accountType === 'self-service';

  const planDisplay = getPlanDisplay(plan);

  return {
    ...planDisplay,
    isSelfService,
    accountType: restaurant?.accountType,
    accountTypeDisplay: restaurant?.accountType === 'self-service' ? 'Auto-inscrit' : 'Manuel',
    accountTypeBadgeClass:
      restaurant?.accountType === 'self-service'
        ? 'bg-blue-100 text-blue-700'
        : 'bg-gray-100 text-gray-700',
  };
};

// Get all features accessible to a restaurant
export const getRestaurantFeatures = (restaurant: Restaurant | null | undefined): Feature[] => {
  if (!restaurant) return [];

  const plan = restaurant.subscription?.plan as Plan | undefined;
  const accountType = restaurant.accountType as AccountType;

  if (!plan) return [];

  return Object.values(FEATURE_CONFIG)
    .filter(
      (config) =>
        config.allowedPlans.includes(plan) && config.allowedAccountTypes.includes(accountType)
    )
    .map((config) => config.feature);
};

// Check if restaurant is on a specific plan
export const isRestaurantOnPlan = (
  restaurant: Restaurant | null | undefined,
  plan: Plan
): boolean => {
  return restaurant?.subscription?.plan === plan;
};

// Get plan configuration for a restaurant
export const getRestaurantPlanConfig = (restaurant: Restaurant | null | undefined) => {
  const plan = restaurant?.subscription?.plan as Plan | undefined;
  return plan ? PLAN_CONFIG[plan] : null;
};
