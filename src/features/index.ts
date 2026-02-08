// Export all feature-related utilities
export * from './types';
export * from './config';
export * from './hooks';
export * from './utils';

// Re-export commonly used hooks with better names
export { useFeatureAccess } from './hooks';
export { useHasFeature } from './hooks';
export { useUserFeatures } from './hooks';
export { useCurrentPlan } from './hooks';
export { useUpgradeRequired } from './hooks';

// Convenience exports
export {
  useCanAccessMenus,
  useCanCustomizeWidget,
  useHasAdvancedAnalytics,
  useHasMultipleLocations,
  useHasAPIAccess,
} from './hooks';

// Dashboard specific hooks
export {
  useDashboardData,
  useShouldShowSubscription,
  useShouldShowQuota,
  useShouldShowWidgetSection,
  useHasRevenueTracking,
} from './dashboardHooks';

// Components
export { FeatureGuard, withFeatureGuard } from './components/FeatureGuard';
export { 
  FeatureUpgradeSection, 
  FormSectionWithUpgrade,
  ProBadge,
  StarterBadge,
  EnterpriseBadge 
} from './components/FeatureUpgradeSection';
export { 
  UpgradeCTA,
  useIsStarter,
  useIsPro,
  useIsEnterprise 
} from './components/UpgradeCTA';