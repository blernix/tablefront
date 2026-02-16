'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useTour, TourState, TourStep as TourStepType } from './useTour';

interface TourContextType extends ReturnType<typeof useTour> {}

const TourContext = createContext<TourContextType | undefined>(undefined);

export function useTourContext() {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTourContext must be used within a TourProvider');
  }
  return context;
}

interface TourProviderProps {
  children: ReactNode;
  steps?: TourStepType[];
}

export function TourProvider({ children, steps }: TourProviderProps) {
  const tour = useTour();

  // Update steps if provided via props
  if (steps && JSON.stringify(steps) !== JSON.stringify(tour.steps)) {
    tour.updateSteps(steps);
  }

  return <TourContext.Provider value={tour}>{children}</TourContext.Provider>;
}

export default TourProvider;
