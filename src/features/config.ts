import { FeatureConfig, PlanConfig } from './types';

// Centralized feature configuration
// To modify feature access, just update this configuration
export const FEATURE_CONFIG: Record<string, FeatureConfig> = {
  // Menu Management Features
  'menus': {
    feature: 'menus',
    allowedPlans: ['managed', 'starter', 'pro', 'enterprise'],
    allowedAccountTypes: ['managed'],
    description: 'Gestion complète de la carte et des menus',
    isVisible: true,
  },
  'menu-pdf-upload': {
    feature: 'menu-pdf-upload',
    allowedPlans: ['managed', 'pro', 'enterprise'],
    allowedAccountTypes: ['managed', 'self-service'],
    description: 'Upload de PDF de menu',
    isVisible: true,
  },
  'menu-detailed-mode': {
    feature: 'menu-detailed-mode',
    allowedPlans: ['managed', 'pro', 'enterprise'],
    allowedAccountTypes: ['managed', 'self-service'],
    description: 'Mode détaillé des menus',
    isVisible: true,
  },
  'menu-both-mode': {
    feature: 'menu-both-mode',
    allowedPlans: ['managed', 'pro', 'enterprise'],
    allowedAccountTypes: ['managed', 'self-service'],
    description: 'Mode PDF + détaillé',
    isVisible: true,
  },
  
  // Widget & Integration Features
  'widget-customization': {
    feature: 'widget-customization',
    allowedPlans: ['managed', 'pro', 'enterprise'],
    allowedAccountTypes: ['managed', 'self-service'],
    description: 'Personnalisation avancée du widget (couleurs, polices, styles)',
    isVisible: true,
  },
  'widget-advanced-styling': {
    feature: 'widget-advanced-styling',
    allowedPlans: ['managed', 'pro', 'enterprise'],
    allowedAccountTypes: ['managed', 'self-service'],
    description: 'Styles avancés du widget (couleurs, polices, bordures)',
    isVisible: true,
  },
  'custom-slug': {
    feature: 'custom-slug',
    allowedPlans: ['managed', 'pro', 'enterprise'],
    allowedAccountTypes: ['managed', 'self-service'],
    description: 'Personnalisation du lien de réservation (slug personnalisé)',
    isVisible: true,
  },
  'embed-direct-link': {
    feature: 'embed-direct-link',
    allowedPlans: ['managed', 'starter', 'pro', 'enterprise'],
    allowedAccountTypes: ['managed', 'self-service'],
    description: 'Lien d\'intégration direct vers le widget',
    isVisible: true,
  },
  'embed-iframe': {
    feature: 'embed-iframe',
    allowedPlans: ['managed', 'starter', 'pro', 'enterprise'],
    allowedAccountTypes: ['managed', 'self-service'],
    description: 'Code iframe pour intégration',
    isVisible: true,
  },
  'embed-api-access': {
    feature: 'embed-api-access',
    allowedPlans: ['managed', 'pro', 'enterprise'],
    allowedAccountTypes: ['managed', 'self-service'],
    description: 'Accès API pour intégration personnalisée',
    isVisible: true,
  },
  
  // Analytics & Reporting Features
  'advanced-analytics': {
    feature: 'advanced-analytics',
    allowedPlans: ['managed', 'starter', 'pro', 'enterprise'],
    allowedAccountTypes: ['managed', 'self-service'],
    description: 'Statistiques détaillées et rapports avancés',
    isVisible: true,
  },
  'revenue-tracking': {
    feature: 'revenue-tracking',
    allowedPlans: ['managed', 'starter', 'pro', 'enterprise'],
    allowedAccountTypes: ['managed', 'self-service'],
    description: 'Suivi du chiffre d\'affaires et analyse financière',
    isVisible: true,
  },
  'occupancy-reports': {
    feature: 'occupancy-reports',
    allowedPlans: ['managed', 'starter', 'pro', 'enterprise'],
    allowedAccountTypes: ['managed', 'self-service'],
    description: 'Rapports d\'occupation et analyse de capacité',
    isVisible: true,
  },

  'customer-insights': {
    feature: 'customer-insights',
    allowedPlans: ['enterprise'],
    allowedAccountTypes: ['managed', 'self-service'],
    description: 'Insights clients et analyse comportementale',
    isVisible: true,
  },
  
  // Multi-location & Management Features
  'multiple-locations': {
    feature: 'multiple-locations',
    allowedPlans: ['managed', 'enterprise'],
    allowedAccountTypes: ['managed', 'self-service'],
    description: 'Gestion de plusieurs restaurants',
    limit: 10, // Max locations for enterprise
    isVisible: true,
  },
  'team-management': {
    feature: 'team-management',
    allowedPlans: ['managed', 'pro', 'enterprise'],
    allowedAccountTypes: ['managed', 'self-service'],
    description: 'Gestion d\'équipe avec plusieurs utilisateurs',
    isVisible: true,
  },
  'role-based-access': {
    feature: 'role-based-access',
    allowedPlans: ['managed', 'pro', 'enterprise'],
    allowedAccountTypes: ['managed', 'self-service'],
    description: 'Accès par rôles (admin, manager, serveur)',
    isVisible: true,
  },
  
  // Advanced Features
  'api-full-access': {
    feature: 'api-full-access',
    allowedPlans: ['managed', 'pro', 'enterprise'],
    allowedAccountTypes: ['managed'],
    description: 'Accès API complet pour développement',
    isVisible: true,
  },
  'webhook-integrations': {
    feature: 'webhook-integrations',
    allowedPlans: ['managed', 'pro', 'enterprise'],
    allowedAccountTypes: ['managed', 'self-service'],
    description: 'Intégrations webhook pour automatisation',
    isVisible: true,
  },
  'automated-emails': {
    feature: 'automated-emails',
    allowedPlans: ['managed', 'pro', 'enterprise'],
    allowedAccountTypes: ['managed', 'self-service'],
    description: 'Emails automatisés de confirmation et rappel',
    isVisible: true,
  },
  'sms-notifications': {
    feature: 'sms-notifications',
    allowedPlans: ['managed', 'enterprise'],
    allowedAccountTypes: ['managed', 'self-service'],
    description: 'Notifications SMS pour réservations',
    isVisible: true,
  },
  
  // Support & Priority Features
  'priority-support': {
    feature: 'priority-support',
    allowedPlans: ['managed', 'pro', 'enterprise'],
    allowedAccountTypes: ['managed', 'self-service'],
    description: 'Support prioritaire par email et téléphone',
    isVisible: true,
  },
  'dedicated-account-manager': {
    feature: 'dedicated-account-manager',
    allowedPlans: ['managed', 'enterprise'],
    allowedAccountTypes: ['managed', 'self-service'],
    description: 'Gestionnaire de compte dédié',
    isVisible: true,
  },
  'custom-development': {
    feature: 'custom-development',
    allowedPlans: ['managed', 'enterprise'],
    allowedAccountTypes: ['managed', 'self-service'],
    description: 'Développements sur mesure et intégrations personnalisées',
    isVisible: true,
  },
};

// Plan configuration for UI display
export const PLAN_CONFIG: Record<string, PlanConfig> = {
  'starter': {
    id: 'starter',
    name: 'Starter',
    description: 'Parfait pour démarrer avec les réservations en ligne',
    price: 29,
    features: [
      'embed-direct-link',
      'embed-iframe',
      'automated-emails',
      'advanced-analytics',
      'revenue-tracking',
      'occupancy-reports',
    ],
    limitations: {
      maxLocations: 1,
      maxUsers: 2,
      maxReservationsPerMonth: 500,
    },
  },
  'pro': {
    id: 'pro',
    name: 'Pro',
    description: 'Solution complète pour restaurants professionnels',
    price: 79,
    features: [
      'embed-direct-link',
      'embed-iframe',
      'embed-api-access',
      'widget-customization',
      'widget-advanced-styling',
      'custom-slug',
      'advanced-analytics',
      'revenue-tracking',
      'occupancy-reports',
      'team-management',
      'role-based-access',
      'api-full-access',
      'webhook-integrations',
      'automated-emails',
      'priority-support',
      'menu-pdf-upload',
      'menu-detailed-mode',
      'menu-both-mode',
    ],
    limitations: {
      maxLocations: 3,
      maxUsers: 10,
      maxReservationsPerMonth: 5000,
    },
  },
  'enterprise': {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Solution sur mesure pour groupes et chaînes de restaurants',
    price: 199,
    features: [
      'embed-direct-link',
      'embed-iframe',
      'embed-api-access',
      'widget-customization',
      'widget-advanced-styling',
      'custom-slug',
      'advanced-analytics',
      'revenue-tracking',
      'occupancy-reports',
      'customer-insights',
      'multiple-locations',
      'team-management',
      'role-based-access',
      'api-full-access',
      'webhook-integrations',
      'automated-emails',
      'sms-notifications',
      'priority-support',
      'dedicated-account-manager',
      'custom-development',
      'menu-pdf-upload',
      'menu-detailed-mode',
      'menu-both-mode',
    ],
    limitations: {
      maxLocations: 10,
      maxUsers: 50,
      maxReservationsPerMonth: 50000,
    },
  },
  'managed': {
    id: 'managed',
    name: 'Managed',
    description: 'Service complet avec site web sur mesure',
    price: 0,
    features: [
      'menus',
      'menu-pdf-upload',
      'menu-detailed-mode',
      'menu-both-mode',
      'embed-direct-link',
      'embed-iframe',
      'embed-api-access',
      'advanced-analytics',
      'revenue-tracking',
      'occupancy-reports',
      'team-management',
      'role-based-access',
      'api-full-access',
      'webhook-integrations',
      'automated-emails',
      'priority-support',
      'sms-notifications',
      'dedicated-account-manager',
      'custom-development',
      'multiple-locations',
    ],
    limitations: {
      maxLocations: 10,
      maxUsers: 50,
      maxReservationsPerMonth: -1, // Illimité
    },
  },
};

// Helper to get feature config
export const getFeatureConfig = (feature: string): FeatureConfig | undefined => {
  return FEATURE_CONFIG[feature];
};

// Helper to check if a plan has a feature
export const planHasFeature = (plan: string, feature: string): boolean => {
  const planConfig = PLAN_CONFIG[plan];
  return planConfig?.features.includes(feature as any) || false;
};