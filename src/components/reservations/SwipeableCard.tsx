'use client';

import { useSwipeable } from 'react-swipeable';
import { useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Check, XCircle, CheckCircle } from 'lucide-react';

interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeRight?: () => void; // Confirmer
  onSwipeLeft?: () => void; // Annuler
  rightLabel?: string;
  leftLabel?: string;
  rightIcon?: ReactNode;
  leftIcon?: ReactNode;
  rightColor?: string; // Classe Tailwind pour la couleur
  leftColor?: string; // Classe Tailwind pour la couleur
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
  className,
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

  const showRightAction = swipeOffset > 20;
  const showLeftAction = swipeOffset < -20;
  const bgRightColor = rightColor.replace('text-', 'bg-');
  const bgLeftColor = leftColor.replace('text-', 'bg-');

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Left action background (swipe right to reveal) */}
      <div
        className={cn('absolute inset-y-0 left-0 flex items-center justify-start px-5 transition-opacity duration-150', bgLeftColor)}
        style={{ width: Math.abs(swipeOffset) > 0 ? `${Math.min(Math.abs(swipeOffset), 150)}px` : '0px', opacity: showLeftAction ? 1 : 0 }}
      >
        <div className="flex items-center gap-1.5 text-white font-semibold text-[15px]">
          {leftIcon}
          {leftLabel}
        </div>
      </div>
      {/* Right action background (swipe left to reveal) */}
      <div
        className={cn('absolute inset-y-0 right-0 flex items-center justify-end px-5 transition-opacity duration-150', bgRightColor)}
        style={{ width: Math.abs(swipeOffset) > 0 ? `${Math.min(Math.abs(swipeOffset), 150)}px` : '0px', opacity: showRightAction ? 1 : 0 }}
      >
        <div className="flex items-center gap-1.5 text-white font-semibold text-[15px]">
          {rightIcon}
          {rightLabel}
        </div>
      </div>

      {/* Card content */}
      <div
        {...handlers}
        style={{
          transform: `translateX(${swipeOffset}px)`,
          transition: isSwiping ? 'none' : 'transform 0.25s ease-out',
        }}
        className="relative bg-white"
      >
        {children}
      </div>
    </div>
  );
};
