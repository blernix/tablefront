'use client';

import { cn } from '@/lib/utils';
import { Users } from 'lucide-react';

interface CapacityIndicatorProps {
  currentGuests: number;
  maxCapacity: number;
  date?: string;
  className?: string;
}

export const CapacityIndicator = ({
  currentGuests,
  maxCapacity,
  date,
  className
}: CapacityIndicatorProps) => {
  const percentage = Math.min((currentGuests / maxCapacity) * 100, 100);

  const getColor = () => {
    if (percentage >= 90) return 'text-red-600 bg-red-50 border-red-200';
    if (percentage >= 70) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const getBarColor = () => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-amber-500';
    return 'bg-green-500';
  };

  const getMessage = () => {
    if (percentage >= 90) return 'Complet !';
    if (percentage >= 70) return 'Bientôt complet';
    return 'Disponible';
  };

  return (
    <div className={cn('border rounded-lg p-4', getColor(), className)}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span className="font-semibold">
            {currentGuests} / {maxCapacity} couverts
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {percentage.toFixed(0)}%
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-white/50 font-medium">
            {getMessage()}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-white/50 rounded-full h-2 overflow-hidden">
        <div
          className={cn('h-full transition-all duration-500', getBarColor())}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {date && (
        <p className="text-xs mt-2 opacity-75">
          {date}
        </p>
      )}
    </div>
  );
};
