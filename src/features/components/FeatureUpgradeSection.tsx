import { ReactNode } from 'react';
import { Feature } from '../types';
import { useFeatureAccess } from '../hooks';
import { cn } from '@/lib/utils';
import { Crown, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface FeatureUpgradeSectionProps {
  /** The feature to check access for */
  feature: Feature;
  /** Content to render (always shown, but disabled/overlay when no access) */
  children: ReactNode;
  /** Optional title for the upgrade section */
  title?: string;
  /** Optional description for the upgrade section */
  description?: string;
  /** Whether to show a lock icon overlay */
  showLockOverlay?: boolean;
  /** Custom upgrade button text */
  upgradeButtonText?: string;
  /** Custom upgrade action (default: navigates to dashboard) */
  onUpgrade?: () => void;
  /** Additional class names */
  className?: string;
}

/**
 * Component that shows content with an upgrade overlay when user doesn't have access.
 * Perfect for marketing - shows Pro features but encourages upgrade.
 *
 * @example
 * // Basic usage
 * <FeatureUpgradeSection feature="widget-customization">
 *   <WidgetCustomizerForm />
 * </FeatureUpgradeSection>
 *
 * @example
 * // With custom title and description
 * <FeatureUpgradeSection
 *   feature="advanced-analytics"
 *   title="Analytics Avancés"
 *   description="Suivez vos performances détaillées"
 * >
 *   <AnalyticsDashboard />
 * </FeatureUpgradeSection>
 */
export const FeatureUpgradeSection = ({
  feature,
  children,
  title,
  description,
  showLockOverlay = true,
  upgradeButtonText,
  onUpgrade,
  className,
}: FeatureUpgradeSectionProps) => {
  const access = useFeatureAccess(feature);
  const router = useRouter();

  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      // Default: navigate to dashboard where subscription info is shown
      router.push('/dashboard');
    }
  };

  // User has access - show content normally
  if (access.hasAccess) {
    return <div className={className}>{children}</div>;
  }

  // User doesn't have access - show with upgrade overlay
  const defaultTitle = `Fonctionnalité ${access.requiredPlan?.toUpperCase() || 'Pro'}`;
  const defaultDescription =
    access.reason === 'plan' && access.requiredPlan
      ? `Disponible avec le plan ${access.requiredPlan}. ${access.currentPlan ? `Vous avez actuellement le plan ${access.currentPlan}.` : ''}`
      : "Cette fonctionnalité n'est pas disponible avec votre abonnement actuel.";

  return (
    <div className={cn('relative', className)}>
      {/* Content with overlay */}
      <div
        className={cn(
          'relative',
          !access.hasAccess && 'opacity-60 pointer-events-none select-none'
        )}
      >
        {children}

        {/* Lock overlay (optional) */}
        {showLockOverlay && !access.hasAccess && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] rounded-lg" />
        )}
      </div>

      {/* Upgrade banner */}
      {!access.hasAccess && (
        <div
          className={cn(
            'mt-4 rounded-lg border p-4',
            access.reason === 'plan'
              ? 'border-amber-200 bg-amber-50'
              : 'border-slate-200 bg-slate-50'
          )}
        >
          <div className="flex items-start gap-3">
            <div
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full',
                access.reason === 'plan'
                  ? 'bg-amber-100 text-amber-600'
                  : 'bg-slate-100 text-slate-600'
              )}
            >
              {access.reason === 'plan' ? (
                <Crown className="h-4 w-4" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-slate-900">{title || defaultTitle}</h3>
              <p className="mt-1 text-sm text-slate-600">{description || defaultDescription}</p>
              {access.reason === 'plan' && (
                <Button
                  onClick={handleUpgrade}
                  size="sm"
                  className={cn(
                    'mt-2',
                    access.requiredPlan === 'pro'
                      ? 'bg-amber-600 hover:bg-amber-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  )}
                >
                  <Crown className="h-3 w-3 mr-1.5" />
                  {upgradeButtonText || `Passer au plan ${access.requiredPlan}`}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Wrapper for form sections that need upgrade prompts
 */
export const FormSectionWithUpgrade = ({
  feature,
  children,
  title,
  description,
  ...props
}: FeatureUpgradeSectionProps) => {
  return (
    <div className="space-y-4">
      {(title || description) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-medium text-slate-900">{title}</h3>}
          {description && <p className="text-sm text-slate-600">{description}</p>}
        </div>
      )}
      <FeatureUpgradeSection feature={feature} {...props}>
        {children}
      </FeatureUpgradeSection>
    </div>
  );
};

/**
 * Badge to indicate a feature is Pro-only
 */
export const ProBadge = ({ className }: { className?: string }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
        'bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 border border-purple-200',
        className
      )}
    >
      <Crown className="h-3 w-3" />
      PRO
    </span>
  );
};

/**
 * Badge to indicate a feature is Starter-accessible
 */
export const StarterBadge = ({ className }: { className?: string }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
        'bg-yellow-50 text-yellow-700 border border-yellow-200',
        className
      )}
    >
      STARTER
    </span>
  );
};

/**
 * Badge to indicate a feature is Enterprise-only
 */
export const EnterpriseBadge = ({ className }: { className?: string }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
        'bg-blue-50 text-blue-700 border border-blue-200',
        className
      )}
    >
      ENTERPRISE
    </span>
  );
};
