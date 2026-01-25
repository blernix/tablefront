'use client';

import { useSwipeable } from 'react-swipeable';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Check, XCircle } from 'lucide-react';

interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeRight?: () => void; // Confirmer
  onSwipeLeft?: () => void;  // Annuler
  rightLabel?: string;
  leftLabel?: string;
  disabled?: boolean;
  className?: string;
}

export const SwipeableCard = ({
  children,
  onSwipeRight,
  onSwipeLeft,
  rightLabel = 'Confirmer',
  leftLabel = 'Annuler',
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
      if (swipeOffset < -100 && onSwipeLeft) {
        onSwipeLeft();
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
            'flex items-center gap-2 text-green-600 font-semibold transition-opacity duration-200',
            showRightAction ? 'opacity-100' : 'opacity-0'
          )}
        >
          <Check className="h-5 w-5" />
          <span className="hidden sm:inline">{rightLabel}</span>
        </div>

        {/* Left swipe action (cancel) */}
        <div
          className={cn(
            'flex items-center gap-2 text-red-600 font-semibold transition-opacity duration-200',
            showLeftAction ? 'opacity-100' : 'opacity-0'
          )}
        >
          <span className="hidden sm:inline">{leftLabel}</span>
          <XCircle className="h-5 w-5" />
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
