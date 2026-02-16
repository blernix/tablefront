'use client';

import { useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, Step, ACTIONS } from 'react-joyride';
import { useTourContext } from './TourProvider';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export function TourStep() {
  const tour = useTourContext();
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    console.log('TourStep: state changed', {
      isRunning: tour.isRunning,
      stepIndex: tour.stepIndex,
      status: tour.status,
      stepsCount: tour.steps.length,
    });
  }, [tour.isRunning, tour.stepIndex, tour.status, tour.steps.length]);

  if (!tour.isRunning) {
    return null;
  }

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { action, index, status, type } = data;
    console.log('Tour callback:', { action, index, status, type, stepIndex: tour.stepIndex });

    // Handle tour completion
    if (status === STATUS.FINISHED) {
      console.log('Tour: FINISHED - completing tour');
      tour.completeTour();
      return;
    }

    // Handle tour skip/close
    if (status === STATUS.SKIPPED || action === ACTIONS.CLOSE) {
      console.log('Tour: SKIPPED/CLOSED - stopping tour');
      tour.stopTour();
      return;
    }

    // Handle target not found - skip to next step
    if (type === 'error:target_not_found') {
      console.error('Tour target not found for step:', index);
      if (index < tour.steps.length - 1) {
        console.log('Tour: skipping to next step');
        tour.goToStep(index + 1);
      } else {
        tour.completeTour();
      }
      return;
    }

    // Handle step navigation - sync our state with Joyride's current step
    // When a step is completed (after), update to the next step
    if (type === 'step:after') {
      console.log('Tour: step:after', { action, index });

      if (action === ACTIONS.NEXT) {
        const nextIndex = index + 1;
        if (nextIndex < tour.steps.length) {
          console.log('Tour: moving to next step', nextIndex);
          tour.goToStep(nextIndex);
        } else {
          console.log('Tour: last step completed');
          tour.completeTour();
        }
      } else if (action === ACTIONS.PREV) {
        const prevIndex = Math.max(0, index - 1);
        console.log('Tour: moving to previous step', prevIndex);
        tour.goToStep(prevIndex);
      }
      return;
    }
  };

  // Convert our steps to Joyride steps
  const joyrideSteps: Step[] = tour.steps.map((step, index) => {
    // Adjust placement for mobile screens
    let placement = step.placement || 'bottom';
    let target = step.target;
    let content = step.content;
    let title = step.title;

    if (isMobile) {
      // On mobile, prefer 'bottom' or 'top' placements for better visibility
      // 'left' and 'right' placements often don't work well on small screens
      if (placement === 'left' || placement === 'right') {
        // Check if we should use 'top' or 'bottom' based on step index
        // For steps that might be near the top of screen, use 'bottom'
        // For steps near the bottom, use 'top'
        placement = index < tour.steps.length / 2 ? 'bottom' : 'top';
      }

      // Center placement should stay as 'center' for welcome modal
      if (placement === 'center') {
        placement = 'center';
      }

      // For the settings step on mobile, target the mobile menu toggle button
      // instead of the sidebar settings link (which is hidden)
      if (target === '[data-tour="sidebar-settings"]') {
        target = '[data-tour="mobile-menu-toggle"]';
        title = 'Paramètres de votre restaurant';
        content =
          "Ouvrez le menu de navigation pour accéder aux paramètres. Configurez vos heures d'ouverture, votre capacité, et toutes les options de votre restaurant.";
      }
    }

    return {
      target,
      content,
      title,
      placement,
      disableBeacon: step.disableBeacon || false,
      spotlightClicks: false,
      hideCloseButton: false,
      disableOverlayClose: false,
      showSkipButton: true,
      showProgress: true,
    };
  });

  return (
    <Joyride
      steps={joyrideSteps}
      run={tour.isRunning}
      stepIndex={tour.stepIndex}
      callback={handleJoyrideCallback}
      continuous={true}
      hideCloseButton={false}
      showProgress
      showSkipButton
      disableOverlayClose={false}
      disableScrolling={false}
      scrollToFirstStep={true}
      scrollOffset={isMobile ? 80 : 100}
      spotlightClicks={false}
      spotlightPadding={isMobile ? 5 : 10}
      floaterProps={{
        disableAnimation: false,
        styles: {
          floater: {
            filter: 'none',
          },
        },
      }}
      locale={{
        back: 'Précédent',
        close: 'Fermer',
        last: 'Terminer',
        next: 'Suivant',
        skip: 'Passer',
      }}
      debug={false}
      styles={{
        options: {
          primaryColor: '#3b82f6', // blue-500
          textColor: '#1f2937', // gray-800
          backgroundColor: '#ffffff',
          overlayColor: 'rgba(0, 0, 0, 0.5)',
          arrowColor: '#ffffff',
          zIndex: 10000,
        },
        buttonNext: {
          backgroundColor: '#3b82f6',
          color: '#ffffff',
        },
        buttonBack: {
          color: '#6b7280',
        },
        buttonSkip: {
          color: '#6b7280',
        },
        beaconInner: {
          backgroundColor: '#3b82f6',
        },
        beaconOuter: {
          backgroundColor: 'rgba(59, 130, 246, 0.3)',
        },
        tooltip: {
          maxWidth: isMobile ? '90vw' : '400px',
          borderRadius: '8px',
          padding: '16px',
        },
        tooltipContainer: {
          textAlign: 'left',
        },
        tooltipTitle: {
          fontSize: isMobile ? '16px' : '18px',
          fontWeight: '600',
          marginBottom: '8px',
        },
        tooltipContent: {
          fontSize: isMobile ? '14px' : '15px',
          lineHeight: '1.5',
        },
      }}
    />
  );
}

export default TourStep;
