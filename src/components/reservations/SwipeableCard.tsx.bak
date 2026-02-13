'use client';

import { useSwipeable } from 'react-swipeable';
import { useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Check, XCircle, CheckCircle } from 'lucide-react';

interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeRight?: () => void; // Confirmer
  onSwipeLeft?: () => void;  // Annuler
  rightLabel?: string;
  leftLabel?: string;
  rightIcon?: ReactNode;
  leftIcon?: ReactNode;
  rightColor?: string; // Classe Tailwind pour la couleur
  leftColor?: string;  // Classe Tailwind pour la couleur
  sameActionOnBothSides?: boolean; // Si vrai, les deux directions déclenchent onSwipeRight
  disabled?: boolean;
  className?: string;
}

export const SwipeableCard = ({
  children,
  onSwipeRight,
  onSwipeLeft,
  rightLabel = 'Confirmer',
  leftLabel = 'Annuler',
  rightIcon = <Check className="h-5 w-5" />,
  leftIcon = <XCircle className="h-5 w-5" />,
  rightColor = 'text-green-600',
  leftColor = 'text-red-600',
  sameActionOnBothSides = false,
  disabled = false,
  className
}: SwipeableCardProps) => {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const handlers = useSwipeable({
    onSwiping: (e) => {
      if (disabled) return;
      setIsSwiping(true);
      // Limit swipe distance to prevent over-swiping
      const maxSwipe = 150;
      const limitedOffset = Math.max(-maxSwipe, Math.min(maxSwipe, e.deltaX));
      setSwipeOffset(limitedOffset);
    },
    onSwipedLeft: () => {
      if (disabled) return;
      if (swipeOffset < -100) {
        if (sameActionOnBothSides && onSwipeRight) {
          onSwipeRight();
        } else if (!sameActionOnBothSides && onSwipeLeft) {
          onSwipeLeft();
        }
      }
      setSwipeOffset(0);
      setIsSwiping(false);
    },
    onSwipedRight: () => {
      if (disabled) return;
      if (swipeOffset > 100 && onSwipeRight) {
        onSwipeRight();
      }
      setSwipeOffset(0);
      setIsSwiping(false);
    },
    onTouchEndOrOnMouseUp: () => {
      // Reset if swipe wasn't strong enough
      if (Math.abs(swipeOffset) < 100) {
        setSwipeOffset(0);
      }
      setIsSwiping(false);
    },
    trackMouse: true, // Enable mouse tracking for desktop testing
    trackTouch: true,
  });

  const showRightAction = swipeOffset > 50;
  const showLeftAction = swipeOffset < -50;

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Background actions */}
      <div className="absolute inset-0 flex items-center justify-between px-6 pointer-events-none">
        {/* Right swipe action (confirm) */}
        <div
          className={cn(
            'flex items-center gap-2 font-semibold transition-opacity duration-200',
            rightColor,
            showRightAction ? 'opacity-100' : 'opacity-0'
          )}
        >
          {rightIcon}
          <span className="hidden sm:inline">{rightLabel}</span>
        </div>

        {/* Left swipe action (cancel) */}
        <div
          className={cn(
            'flex items-center gap-2 font-semibold transition-opacity duration-200',
            leftColor,
            showLeftAction ? 'opacity-100' : 'opacity-0'
          )}
        >
          <span className="hidden sm:inline">{leftLabel}</span>
          {leftIcon}
        </div>
      </div>

      {/* Card content */}
      <div
        {...handlers}
        style={{
          transform: `translateX(${swipeOffset}px)`,
          transition: isSwiping ? 'none' : 'transform 0.3s ease-out'
        }}
        className="relative bg-white touch-pan-y"
      >
        {children}
      </div>
    </div>
  );
};
