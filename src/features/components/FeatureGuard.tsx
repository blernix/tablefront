import { ReactNode, useState } from 'react';
import { Feature, Plan } from '../types';
import { useFeatureAccess } from '../hooks';
import { apiClient } from '@/lib/api';
import { useRestaurantStore } from '@/store/restaurantStore';

interface FeatureGuardProps {
  /** The feature to check access for */
  feature: Feature;
  /** Content to render when user has access */
  children: ReactNode;
  /** Content to render when user doesn't have access */
  fallback?: ReactNode;
  /** Optional custom message when access is denied */
  denyMessage?: ReactNode;
  /** Whether to show a default upgrade prompt when access is denied */
  showUpgradePrompt?: boolean;
}

/**
 * Component that guards access to features based on user's plan and account type.
 *
 * @example
 * // Basic usage
 * <FeatureGuard feature="widget-customization">
 *   <WidgetCustomizer />
 * </FeatureGuard>
 *
 * @example
 * // With custom fallback
 * <FeatureGuard
 *   feature="advanced-analytics"
 *   fallback={<UpgradePrompt requiredPlan="pro" />}
 * >
 *   <AnalyticsDashboard />
 * </FeatureGuard>
 *
 * @example
 * // With default upgrade prompt
 * <FeatureGuard
 *   feature="multiple-locations"
 *   showUpgradePrompt={true}
 * >
 *   <MultiLocationManager />
 * </FeatureGuard>
 */
export const FeatureGuard = ({
  feature,
  children,
  fallback,
  denyMessage,
  showUpgradePrompt = false,
}: FeatureGuardProps) => {
  const access = useFeatureAccess(feature);
  const restaurant = useRestaurantStore((state) => state.restaurant);
  const [upgradeLoading, setUpgradeLoading] = useState(false);

  const handleUpgrade = async () => {
    if (!restaurant) return;
    if (!access.requiredPlan) return;
    if (access.requiredPlan !== 'starter' && access.requiredPlan !== 'pro') {
      alert("Le plan requis n'est pas disponible pour l'achat en ligne. Veuillez nous contacter.");
      return;
    }
    setUpgradeLoading(true);
    try {
      const { url } = await apiClient.billing.createCheckoutSession(
        access.requiredPlan,
        restaurant._id
      );
      window.location.href = url;
    } catch (error) {
      console.error('Failed to create checkout session:', error);
      alert('Impossible de créer la session de paiement. Veuillez réessayer.');
    } finally {
      setUpgradeLoading(false);
    }
  };

  if (access.hasAccess) {
    return <>{children}</>;
  }

  // Return custom fallback if provided
  if (fallback) {
    return <>{fallback}</>;
  }

  // Show default upgrade prompt if requested
  if (showUpgradePrompt && access.reason === 'plan' && access.requiredPlan) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            ⭐
          </div>
          <div>
            <h3 className="font-medium text-amber-900">
              Fonctionnalité {access.requiredPlan?.toUpperCase()}
            </h3>
            <p className="mt-1 text-sm text-amber-800">
              Cette fonctionnalité est disponible avec le plan {access.requiredPlan}.
              {access.currentPlan && ` Vous avez actuellement le plan ${access.currentPlan}.`}
            </p>
            <button
              onClick={handleUpgrade}
              disabled={upgradeLoading || !restaurant}
              className="mt-2 rounded-md bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {upgradeLoading ? 'Chargement...' : `Passer au plan ${access.requiredPlan}`}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show custom deny message if provided
  if (denyMessage) {
    return <>{denyMessage}</>;
  }

  // Default: render nothing when access is denied
  return null;
};

/**
 * HOC version of FeatureGuard for class components or alternative patterns
 */
export const withFeatureGuard = <P extends object>(
  Component: React.ComponentType<P>,
  feature: Feature,
  fallback?: ReactNode
) => {
  const WrappedComponent = (props: P) => (
    <FeatureGuard feature={feature} fallback={fallback}>
      <Component {...props} />
    </FeatureGuard>
  );

  WrappedComponent.displayName = `withFeatureGuard(${Component.displayName || Component.name})`;
  return WrappedComponent;
};
