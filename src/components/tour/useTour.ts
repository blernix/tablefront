import { useState, useCallback, useEffect } from 'react';

export type TourStep = {
  target: string; // CSS selector
  content: React.ReactNode;
  title?: string;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  disableBeacon?: boolean;
};

export type TourStatus = 'not-started' | 'in-progress' | 'completed' | 'skipped';

export interface TourState {
  isRunning: boolean;
  stepIndex: number;
  status: TourStatus;
  steps: TourStep[];
}

// Default tour steps (will be customized later)
const DEFAULT_STEPS: TourStep[] = [
  {
    target: '[data-tour="welcome"]',
    content:
      'Bienvenue sur TableMaster ! Ce tutoriel rapide vous guide à travers les principales fonctionnalités.',
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '[data-tour="quick-actions"]',
    content:
      'Créez de nouvelles réservations ou consultez votre calendrier directement depuis ici.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="stats-cards"]',
    content: 'Suivez en temps réel vos réservations, occupation et revenus estimés.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="upcoming-reservations"]',
    content: 'Consultez vos réservations du jour et gérez leur statut.',
    placement: 'left',
  },
  {
    target: '[data-tour="menu-summary"]',
    content: "Gérez vos catégories et plats, configurez votre capacité d'accueil.",
    placement: 'right',
  },
  {
    target: '[data-tour="sidebar-settings"]',
    content:
      "Configurez vos heures d'ouverture dans les paramètres. C'est indispensable pour que le formulaire de réservation fonctionne.",
    placement: 'right',
  },
];

const TOUR_STORAGE_KEY = 'tablemaster_tour_status';

export const useTour = () => {
  const [state, setState] = useState<TourState>({
    isRunning: false,
    stepIndex: 0,
    status: 'not-started',
    steps: DEFAULT_STEPS,
  });

  // Load tour status from localStorage on mount
  useEffect(() => {
    const loadTourStatus = () => {
      try {
        const saved = localStorage.getItem(TOUR_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setState((prev) => ({
            ...prev,
            status: parsed.status || 'not-started',
            steps: parsed.steps || DEFAULT_STEPS,
          }));
        }
      } catch (error) {
        console.log('Could not load tour status:', error);
      }
    };

    loadTourStatus();
  }, []);

  // Save tour status to localStorage
  const saveTourStatus = useCallback(
    (status: TourStatus) => {
      try {
        const toSave = {
          status,
          steps: state.steps,
          lastUpdated: new Date().toISOString(),
        };
        localStorage.setItem(TOUR_STORAGE_KEY, JSON.stringify(toSave));
      } catch (error) {
        console.log('Could not save tour status:', error);
      }
    },
    [state.steps]
  );

  const startTour = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      isRunning: true,
      stepIndex: 0,
      status: 'in-progress',
    }));
    await saveTourStatus('in-progress');
  }, [saveTourStatus]);

  const stopTour = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      isRunning: false,
      status: 'skipped',
    }));
    await saveTourStatus('skipped');
  }, [saveTourStatus]);

  const completeTour = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      isRunning: false,
      status: 'completed',
    }));
    await saveTourStatus('completed');
  }, [saveTourStatus]);

  const goToStep = useCallback((index: number) => {
    console.log('Tour: goToStep', index);
    setState((prev) => ({
      ...prev,
      stepIndex: Math.max(0, Math.min(index, prev.steps.length - 1)),
    }));
  }, []);

  const updateSteps = useCallback((steps: TourStep[]) => {
    setState((prev) => ({ ...prev, steps }));
  }, []);

  const resetTour = useCallback(async () => {
    setState({
      isRunning: false,
      stepIndex: 0,
      status: 'not-started',
      steps: DEFAULT_STEPS,
    });
    await saveTourStatus('not-started');
  }, [saveTourStatus]);

  return {
    ...state,
    startTour,
    stopTour,
    completeTour,
    goToStep,
    updateSteps,
    resetTour,
    currentStep: state.steps[state.stepIndex],
  };
};
