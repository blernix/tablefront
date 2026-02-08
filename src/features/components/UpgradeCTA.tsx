import { ReactNode } from 'react';
import { Feature } from '../types';
import { useUpgradeRequired, useCurrentPlan } from '../hooks';
import { cn } from '@/lib/utils';
import { Crown, Zap, TrendingUp, BarChart, Palette, Users, Euro, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface UpgradeCTAProps {
  /** The feature this CTA is promoting */
  feature: Feature;
  /** Type of CTA - determines icon and styling */
  type?: 'card' | 'inline' | 'banner' | 'simple';
  /** Custom title override */
  title?: string;
  /** Custom description override */
  description?: string;
  /** Custom button text */
  buttonText?: string;
  /** Custom icon override */
  icon?: ReactNode;
  /** Where to navigate on upgrade click */
  upgradePath?: string;
  /** Additional class names */
  className?: string;
  /** Show only if upgrade is required (default: true) */
  showOnlyIfUpgradeRequired?: boolean;
  /** Show for all Starter users regardless of feature (default: false) */
  showForAllStarters?: boolean;
}

/**
 * Contextual upgrade call-to-action component.
 * Shows relevant upgrade prompts based on feature and user's current plan.
 * 
 * @example
 * // Basic feature-based CTA
 * <UpgradeCTA feature="revenue-tracking" />
 * 
 * @example
 * // Banner style CTA
 * <UpgradeCTA 
 *   feature="widget-customization" 
 *   type="banner"
 *   title="Personnalisez votre widget"
 *   description="Passez au plan Pro pour modifier les couleurs et la police"
 * />
 * 
 * @example  
 * // Card style for dashboard
 * <UpgradeCTA 
 *   feature="advanced-analytics"
 *   type="card"
 *   className="mt-6"
 * />
 */
export const UpgradeCTA = ({
  feature,
  type = 'inline',
  title,
  description,
  buttonText,
  icon,
  upgradePath = '/dashboard',
  className,
  showOnlyIfUpgradeRequired = true,
  showForAllStarters = false,
}: UpgradeCTAProps) => {
  const upgradeInfo = useUpgradeRequired(feature);
  const currentPlan = useCurrentPlan();
  const router = useRouter();

  const isStarter = currentPlan?.id === 'starter';
  const isPro = currentPlan?.id === 'pro';
  const isEnterprise = currentPlan?.id === 'enterprise';

  // Determine if we should show the CTA
  const shouldShow = showForAllStarters 
    ? isStarter 
    : (showOnlyIfUpgradeRequired ? upgradeInfo.requiresUpgrade : true);

  // Don't show if user already has access and we're only showing for upgrades
  if (!shouldShow) {
    return null;
  }

  const handleUpgrade = () => {
    router.push(upgradePath);
  };

  // Feature-specific configurations
  const featureConfigs: Partial<Record<Feature, any>> = {
    'revenue-tracking': {
      icon: <Euro className="h-5 w-5" />,
      defaultTitle: 'Suivez votre chiffre d\'affaires',
      defaultDescription: 'Passez au plan Pro pour analyser vos revenus et optimiser vos prix.',
      cardTitle: 'Analytics Financiers',
      cardDescription: 'Suivez votre CA, analysez vos performances et prenez des décisions éclairées.',
    },
    'widget-customization': {
      icon: <Palette className="h-5 w-5" />,
      defaultTitle: 'Personnalisez votre widget',
      defaultDescription: 'Modifiez les couleurs, la police et le style pour correspondre à votre marque.',
      cardTitle: 'Personnalisation Avancée',
      cardDescription: 'Un widget qui correspond parfaitement à l\'identité de votre restaurant.',
    },
    'advanced-analytics': {
      icon: <BarChart className="h-5 w-5" />,
      defaultTitle: 'Analytics Avancés',
      defaultDescription: 'Obtenez des insights détaillés sur vos réservations et vos clients.',
      cardTitle: 'Tableau de Bord Pro',
      cardDescription: 'Données en temps réel, tendances et prédictions pour optimiser votre restaurant.',
    },
    'team-management': {
      icon: <Users className="h-5 w-5" />,
      defaultTitle: 'Gestion d\'Équipe',
      defaultDescription: 'Ajoutez des serveurs et gérez les permissions facilement.',
      cardTitle: 'Collaboration Équipe',
      cardDescription: 'Plusieurs utilisateurs, rôles personnalisés, accès sécurisé.',
    },
    'menus': {
      icon: <Zap className="h-5 w-5" />,
      defaultTitle: 'Gestion Complète des Menus',
      defaultDescription: 'Créez, modifiez et publiez votre carte en quelques clics.',
      cardTitle: 'Menu Digital Pro',
      cardDescription: 'PDF upload, QR codes, gestion des catégories et des prix.',
    },
    'automated-emails': {
      icon: <Zap className="h-5 w-5" />,
      defaultTitle: 'Emails Automatisés',
      defaultDescription: 'Confirmation, rappels et suivis automatiques pour vos clients.',
      cardTitle: 'Communication Pro',
      cardDescription: 'Gagnez du temps et améliorez l\'expérience client avec des emails automatisés.',
    },
  };

  const featureConfig = featureConfigs[feature] || {
    icon: <Crown className="h-5 w-5" />,
    defaultTitle: `Fonctionnalité ${upgradeInfo.requiredPlan?.toUpperCase() || 'Pro'}`,
    defaultDescription: `Disponible avec le plan ${upgradeInfo.requiredPlan || 'Pro'}.`,
    cardTitle: `Fonctionnalité ${upgradeInfo.requiredPlan?.toUpperCase() || 'Pro'}`,
    cardDescription: `Passez au plan ${upgradeInfo.requiredPlan || 'Pro'} pour débloquer cette fonctionnalité.`,
  };

  // Choose icon
  const displayIcon = icon || featureConfig.icon;

  // Choose texts based on type
  const displayTitle = title || (type === 'card' ? featureConfig.cardTitle : featureConfig.defaultTitle);
  const displayDescription = description || (type === 'card' ? featureConfig.cardDescription : featureConfig.defaultDescription);
  const displayButtonText = buttonText || `Passer au ${upgradeInfo.requiredPlan || 'Pro'}`;

  // Render based on type
  if (type === 'card') {
    return (
      <div className={cn(
        'rounded-lg border-2 border-dashed border-[#0066FF]/30 bg-gradient-to-br from-blue-50/50 to-white p-6',
        className
      )}>
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0066FF]/10">
            <div className="text-[#0066FF]">
              {displayIcon}
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-[#2A2A2A]">{displayTitle}</h3>
            <p className="mt-1 text-sm text-[#666666]">{displayDescription}</p>
            <Button
              onClick={handleUpgrade}
              className="mt-4 bg-[#0066FF] hover:bg-[#0052EB]"
            >
              <Crown className="mr-2 h-4 w-4" />
              {displayButtonText}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'banner') {
    return (
      <div className={cn(
        'rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-[#0066FF] p-4',
        className
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0066FF]">
              <div className="text-white">
                {displayIcon}
              </div>
            </div>
            <div>
              <p className="font-medium text-[#2A2A2A]">{displayTitle}</p>
              <p className="text-sm text-[#666666]">{displayDescription}</p>
            </div>
          </div>
          <Button
            onClick={handleUpgrade}
            variant="outline"
            className="border-[#0066FF] text-[#0066FF] hover:bg-[#0066FF] hover:text-white"
          >
            <Crown className="mr-2 h-4 w-4" />
            {displayButtonText}
          </Button>
        </div>
      </div>
    );
  }

  if (type === 'simple') {
    return (
      <Button
        onClick={handleUpgrade}
        variant="outline"
        size="sm"
        className={cn(
          'border-[#0066FF] text-[#0066FF] hover:bg-[#0066FF] hover:text-white',
          className
        )}
      >
        <Crown className="mr-2 h-4 w-4" />
        {displayButtonText}
      </Button>
    );
  }

  // Default: inline type
  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <Lock className="h-4 w-4 text-[#666666]" />
      <span className="text-sm text-[#666666]">{displayDescription}</span>
      <Button
        onClick={handleUpgrade}
        variant="link"
        size="sm"
        className="h-auto p-0 text-[#0066FF] hover:text-[#0052EB]"
      >
        {displayButtonText}
      </Button>
    </div>
  );
};

/**
 * Simple hook to check if user is on Starter plan
 */
export const useIsStarter = () => {
  const currentPlan = useCurrentPlan();
  return currentPlan?.id === 'starter';
};

/**
 * Simple hook to check if user is on Pro plan
 */
export const useIsPro = () => {
  const currentPlan = useCurrentPlan();
  return currentPlan?.id === 'pro';
};

/**
 * Simple hook to check if user is on Enterprise plan
 */
export const useIsEnterprise = () => {
  const currentPlan = useCurrentPlan();
  return currentPlan?.id === 'enterprise';
};