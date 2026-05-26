'use client';

import { useSwipeable } from 'react-swipeable';
import { useRef, useCallback, ReactNode } from 'react';
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

const THRESHOLD = 100;
const MAX_SWIPE = 140;

const resolveBg = (color: string): string => {
  const map: Record<string, string> = {
    'text-emerald-500': 'bg-emerald-500',
    'text-red-500': 'bg-red-500',
    'text-[#0066FF]': 'bg-[#0066FF]',
    'text-green-600': 'bg-green-600',
  };
  if (map[color]) return map[color];
  const m = color.match(/text-\[(.+)\]/);
  return m ? `bg-[${m[1]}]` : color.replace('text-', 'bg-');
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
  const cardRef = useRef<HTMLDivElement>(null);
  const leftBgRef = useRef<HTMLDivElement>(null);
  const rightBgRef = useRef<HTMLDivElement>(null);
  const leftLabelRef = useRef<HTMLDivElement>(null);
  const rightLabelRef = useRef<HTMLDivElement>(null);
  const leftTriggeredRef = useRef(false);
  const rightTriggeredRef = useRef(false);

  const updateUI = useCallback((offset: number) => {
    const abs = Math.abs(offset);
    const clamped = Math.min(abs, MAX_SWIPE);
    const progress = Math.min(abs / THRESHOLD, 1);

    if (cardRef.current) {
      cardRef.current.style.transform = `translateX(${offset}px)`;
      cardRef.current.style.transition = 'none';
    }

    if (leftBgRef.current) {
      leftBgRef.current.style.width = `${clamped}px`;
      leftBgRef.current.style.opacity = String(progress);
    }
    if (leftLabelRef.current) {
      leftLabelRef.current.style.transform = progress >= 1 ? 'scale(1.08)' : 'scale(1)';
      leftLabelRef.current.style.opacity = progress < 0.15 ? '0' : '1';
    }

    if (rightBgRef.current) {
      rightBgRef.current.style.width = `${clamped}px`;
      rightBgRef.current.style.opacity = String(progress);
    }
    if (rightLabelRef.current) {
      rightLabelRef.current.style.transform = progress >= 1 ? 'scale(1.08)' : 'scale(1)';
      rightLabelRef.current.style.opacity = progress < 0.15 ? '0' : '1';
    }

    leftTriggeredRef.current = offset >= THRESHOLD;
    rightTriggeredRef.current = offset <= -THRESHOLD;
  }, []);

  const resetCard = useCallback(() => {
    if (cardRef.current) {
      cardRef.current.style.transition = 'transform 0.35s cubic-bezier(0.25, 0.8, 0.25, 1.2)';
      cardRef.current.style.transform = 'translateX(0)';
    }
    if (leftBgRef.current) {
      leftBgRef.current.style.transition = 'width 0.35s ease, opacity 0.35s ease';
      leftBgRef.current.style.width = '0px';
      leftBgRef.current.style.opacity = '0';
    }
    if (rightBgRef.current) {
      rightBgRef.current.style.transition = 'width 0.35s ease, opacity 0.35s ease';
      rightBgRef.current.style.width = '0px';
      rightBgRef.current.style.opacity = '0';
    }
    if (leftLabelRef.current) leftLabelRef.current.style.transform = 'scale(1)';
    if (rightLabelRef.current) rightLabelRef.current.style.transform = 'scale(1)';
    leftTriggeredRef.current = false;
    rightTriggeredRef.current = false;
  }, []);

  const handlers = useSwipeable({
    onSwiping: (e) => {
      if (disabled) return;
      updateUI(Math.max(-MAX_SWIPE, Math.min(MAX_SWIPE, e.deltaX)));
    },
    onSwipedLeft: () => {
      if (disabled) return;
      if (rightTriggeredRef.current) {
        const handler = sameActionOnBothSides ? onSwipeRight : onSwipeLeft;
        handler?.();
      }
      resetCard();
    },
    onSwipedRight: () => {
      if (disabled) return;
      if (leftTriggeredRef.current) {
        onSwipeRight?.();
      }
      resetCard();
    },
    onTouchEndOrOnMouseUp: () => {
      resetCard();
    },
    trackMouse: false,
    trackTouch: true,
    preventScrollOnSwipe: true,
  });

  const { ref: swipeRef, ...swipeHandlers } = handlers;
  const setCardRef = useCallback((node: HTMLDivElement | null) => {
    (cardRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
    if (typeof swipeRef === 'function') swipeRef(node);
  }, [swipeRef]);

  const bgRight = resolveBg(rightColor);
  const bgLeft = resolveBg(leftColor);

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Left action bg */}
      <div
        ref={leftBgRef}
        className={cn('absolute inset-y-0 left-0 flex items-center justify-start px-5', bgLeft)}
        style={{ width: '0px', opacity: '0' }}
      >
        <div ref={leftLabelRef} className="flex items-center gap-1.5 text-white font-semibold text-[15px]" style={{ transform: 'scale(1)', transition: 'transform 0.2s ease' }}>
          {leftIcon}
          {leftLabel}
        </div>
      </div>

      {/* Right action bg */}
      <div
        ref={rightBgRef}
        className={cn('absolute inset-y-0 right-0 flex items-center justify-end px-5', bgRight)}
        style={{ width: '0px', opacity: '0' }}
      >
        <div ref={rightLabelRef} className="flex items-center gap-1.5 text-white font-semibold text-[15px]" style={{ transform: 'scale(1)', transition: 'transform 0.2s ease' }}>
          {rightIcon}
          {rightLabel}
        </div>
      </div>

      {/* Card */}
      <div
        ref={setCardRef}
        {...swipeHandlers}
        className="relative bg-white select-none touch-pan-y"
        style={{ willChange: 'transform' }}
      >
        {children}
      </div>
    </div>
  );
};
