'use client';

import { Button } from '@/components/ui/button';
import { Play, HelpCircle, Sparkles } from 'lucide-react';
import { useTourContext } from './TourProvider';

interface TourTriggerProps {
  variant?: 'button' | 'badge' | 'floating';
  className?: string;
}

export function TourTrigger({ variant = 'button', className }: TourTriggerProps) {
  const tour = useTourContext();

  // Don't show trigger if tour is already running or completed
  if (tour.status === 'in-progress' || tour.status === 'completed') {
    return null;
  }

  const handleStartTour = () => {
    tour.startTour();
  };

  if (variant === 'badge') {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleStartTour}
        className={`gap-2 border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 ${className}`}
      >
        <Sparkles className="h-3 w-3" />
        Démarrer le tutoriel
      </Button>
    );
  }

  if (variant === 'floating') {
    return (
      <button
        onClick={handleStartTour}
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-transform hover:scale-105 ${className}`}
        aria-label="Démarrer le tutoriel"
        title="Démarrer le tutoriel"
      >
        <Play className="h-6 w-6 text-white" />
      </button>
    );
  }

  // Default button variant
  return (
    <Button variant="outline" onClick={handleStartTour} className={`gap-2 ${className}`}>
      <HelpCircle className="h-4 w-4" />
      Démarrer le tutoriel
    </Button>
  );
}

export default TourTrigger;
