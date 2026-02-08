// Scalable plan types - easy to add new plans
export type Plan = 'starter' | 'pro' | 'enterprise' | 'managed';
export type AccountType = 'managed' | 'self-service';

// All available features in the application
export type Feature = 
  // Menu Management
  | 'menus'                    // Gestion complète des menus/carte
  | 'menu-pdf-upload'          // Upload de PDF de menu
  | 'menu-detailed-mode'       // Mode détaillé des menus
  | 'menu-both-mode'           // Mode PDF + détaillé
  
  // Widget & Integration
  | 'widget-customization'     // Personnalisation avancée du widget
  | 'widget-advanced-styling'  // Styles avancés (couleurs, polices)
  | 'custom-slug'              // Personnalisation du lien de réservation
  | 'embed-direct-link'        // Lien d'intégration direct
  | 'embed-iframe'             // Intégration iframe
  | 'embed-api-access'         // Accès API pour intégration
  
  // Analytics & Reporting
  | 'advanced-analytics'       // Statistiques détaillées
  | 'revenue-tracking'         // Suivi du chiffre d'affaires
  | 'occupancy-reports'        // Rapports d'occupation
  | 'customer-insights'        // Insights clients
  
  // Multi-location & Management
  | 'multiple-locations'       // Gestion multi-restaurants
  | 'team-management'          // Gestion d'équipe
  | 'role-based-access'        // Accès par rôles
  
  // Advanced Features
  | 'api-full-access'          // Accès API complet
  | 'webhook-integrations'     // Intégrations webhook
  | 'automated-emails'         // Emails automatisés
  | 'sms-notifications'        // Notifications SMS
  
  // Support & Priority
  | 'priority-support'         // Support prioritaire
  | 'dedicated-account-manager' // Gestionnaire dédié
  | 'custom-development';       // Développements sur mesure

// Feature configuration interface
export interface FeatureConfig {
  feature: Feature;
  allowedPlans: Plan[];
  allowedAccountTypes: AccountType[];
  description: string;
  requires?: Feature[]; // Dependencies
  limit?: number; // Usage limit (e.g., max locations, max users)
  isVisible?: boolean; // Whether to show in UI
}

// Plan configuration
export interface PlanConfig {
  id: Plan;
  name: string;
  description: string;
  price: number;
  features: Feature[];
  limitations?: {
    maxLocations?: number;
    maxUsers?: number;
    maxReservationsPerMonth?: number;
    storageLimit?: string;
  };
}

// User's feature access summary
export interface FeatureAccess {
  hasAccess: boolean;
  feature: Feature;
  reason?: 'plan' | 'account-type' | 'dependency' | 'limit-reached';
  requiredPlan?: Plan;
  requiredAccountType?: AccountType;
  currentPlan?: Plan;
  currentAccountType?: AccountType;
}