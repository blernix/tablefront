import { TourStep } from './useTour';

export const DASHBOARD_TOUR_STEPS: TourStep[] = [
  {
    target: '[data-tour="welcome"]',
    title: 'Bienvenue sur TableMaster !',
    content:
      'Bienvenue dans votre espace de gestion TableMaster. Ce tutoriel rapide vous guide à travers les principales fonctionnalités.',
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '[data-tour="quick-actions"]',
    title: 'Actions Rapides',
    content:
      'Créez de nouvelles réservations ou consultez votre calendrier directement depuis ici.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="stats-cards"]',
    title: 'Vos Statistiques',
    content: 'Suivez en temps réel vos réservations, occupation et revenus estimés.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="upcoming-reservations"]',
    title: 'Réservations à Venir',
    content: 'Consultez vos réservations du jour et gérez leur statut.',
    placement: 'left',
  },
  {
    target: '[data-tour="sidebar-settings"]',
    title: 'Paramètres de votre restaurant',
    content:
      "Accédez aux paramètres pour configurer vos heures d'ouverture, votre capacité, et bien plus. Sur mobile, ouvrez le menu de navigation pour voir le lien Paramètres.",
    placement: 'right',
  },
];

export const SETTINGS_TOUR_STEPS: TourStep[] = [
  // To be defined when implementing settings page tour
];

export const RESERVATIONS_TOUR_STEPS: TourStep[] = [
  // To be defined when implementing reservations page tour
];
