'use client';

import { useSwipeable } from 'react-swipeable';
import { useState, ReactNode, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Check, XCircle, CheckCircle } from 'lucide-react';

interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeRight?: () => void;
  onSwipeLeft?: () => void;
  rightLabel?: string;
  leftLabel?: string;
  rightIcon?: ReactNode;
  leftIcon?: ReactNode;
  rightColor?: string;
  leftColor?: string;
  sameActionOnBothSides?: boolean;
  disabled?: boolean;
  className?: string;
}

const colorMap: Record<string, string> = {
  'text-emerald-500': 'bg-emerald-500',
  'text-red-500': 'bg-red-500',
  'text-[#0066FF]': 'bg-[#0066FF]',
};

const resolveBgColor = (textColor: string): string => {
  if (colorMap[textColor]) return colorMap[textColor];
  const match = textColor.match(/text-\[(.+)\]/);
  if (match) return `bg-[${match[1]}]`;
  return textColor.replace('text-', 'bg-');
};

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
  const THRESHOLD = 100;
  const MAX_SWIPE = 150;

  // Reset offset when disabled changes or component mounts
  useEffect(() => {
    setSwipeOffset(0);
  }, [disabled]);

  const handlers = useSwipeable({
    onSwiping: (e) => {
      if (disabled) return;
      setIsSwiping(true);
      const limited = Math.max(-MAX_SWIPE, Math.min(MAX_SWIPE, e.deltaX));
      setSwipeOffset(limited);
    },
    onSwipedLeft: () => {
      if (disabled) return;
      if (swipeOffset < -THRESHOLD) {
        if (sameActionOnBothSides && onSwipeRight) {
          onSwipeRight();
          return;
        }
        if (!sameActionOnBothSides && onSwipeLeft) {
          onSwipeLeft();
          return;
        }
      }
      setSwipeOffset(0);
      setIsSwiping(false);
    },
    onSwipedRight: () => {
      if (disabled) return;
      if (swipeOffset > THRESHOLD && onSwipeRight) {
        onSwipeRight();
        return;
      }
      setSwipeOffset(0);
      setIsSwiping(false);
    },
    onTouchEndOrOnMouseUp: () => {
      if (Math.abs(swipeOffset) < THRESHOLD) {
        setSwipeOffset(0);
      }
      setIsSwiping(false);
    },
    trackMouse: false,
    trackTouch: true,
    preventScrollOnSwipe: true,
  });

  // Calculate progressive opacity based on swipe distance
  const leftProgress = Math.max(0, Math.min(1, swipeOffset / THRESHOLD));
  const rightProgress = Math.max(0, Math.min(1, Math.abs(swipeOffset) / THRESHOLD));

  // Ensure we have valid background colors
  const bgRight = resolveBgColor(rightColor);
  const bgLeft = resolveBgColor(leftColor);

  // Pulsing when past threshold
  const leftTriggered = swipeOffset > THRESHOLD;
  const rightTriggered = swipeOffset < -THRESHOLD;

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Left action (appears when swiping right) */}
      {(leftProgress > 0 || leftTriggered) && (
        <div
          className={cn(
            'absolute inset-y-0 left-0 flex items-center justify-start px-5 rounded-l-lg transition-all duration-150',
            bgLeft,
            leftTriggered && 'opacity-100',
            !leftTriggered && leftProgress > 0 && 'opacity-90'
          )}
          style={{
            width: `${Math.min(Math.abs(swipeOffset), MAX_SWIPE)}px`,
          }}
        >
          <div className={cn(
            'flex items-center gap-1.5 text-white font-semibold text-[15px] transition-transform duration-200',
            leftTriggered && 'scale-110'
          )}>
            {leftIcon}
            {leftLabel}
          </div>
        </div>
      )}

      {/* Right action (appears when swiping left) */}
      {(rightProgress > 0 || rightTriggered) && (
        <div
          className={cn(
            'absolute inset-y-0 right-0 flex items-center justify-end px-5 rounded-r-lg transition-all duration-150',
            bgRight,
            rightTriggered && 'opacity-100',
            !rightTriggered && rightProgress > 0 && 'opacity-90'
          )}
          style={{
            width: `${Math.min(Math.abs(swipeOffset), MAX_SWIPE)}px`,
          }}
        >
          <div className={cn(
            'flex items-center gap-1.5 text-white font-semibold text-[15px] transition-transform duration-200',
            rightTriggered && 'scale-110'
          )}>
            {rightIcon}
            {rightLabel}
          </div>
        </div>
      )}

      {/* Card content */}
      <div
        {...handlers}
        style={{
          transform: `translateX(${swipeOffset}px)`,
          transition: isSwiping ? 'none' : 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          borderRadius: swipeOffset !== 0 ? (swipeOffset > 0 ? '0 12px 12px 0' : '12px 0 0 12px') : '0',
        }}
        className="relative bg-white"
      >
        {children}
      </div>
    </div>
  );
};
