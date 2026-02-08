'use client';

import { cn } from '@/lib/utils';
import { Users, Info } from 'lucide-react';

interface CapacityIndicatorProps {
  currentGuests: number;
  maxCapacity: number;
  date?: string;
  className?: string;
  // Advanced capacity data (optional)
  maxDailyCapacity?: number;
  simultaneousCapacity?: number;
  serviceCapacities?: {
    lunch?: { maxCapacity: number; currentGuests: number; reservationCount?: number; occupiedSlots?: number; totalSlots?: number };
    dinner?: { maxCapacity: number; currentGuests: number; reservationCount?: number; occupiedSlots?: number; totalSlots?: number };
  };
}

export const CapacityIndicator = ({
  currentGuests,
  maxCapacity,
  date,
  className,
  maxDailyCapacity,
  simultaneousCapacity,
  serviceCapacities
}: CapacityIndicatorProps) => {
  // Determine which capacity to display
  const displayCapacity = maxDailyCapacity !== undefined ? maxDailyCapacity : maxCapacity;
  const hasAdvancedData = maxDailyCapacity !== undefined || simultaneousCapacity !== undefined;
  
  // Calculate percentages
  const dailyPercentage = maxDailyCapacity !== undefined && maxDailyCapacity > 0 ? Math.min((currentGuests / maxDailyCapacity) * 100, 100) : 0;
  const simultaneousPercentage = simultaneousCapacity !== undefined && simultaneousCapacity > 0 ? Math.min((currentGuests / simultaneousCapacity) * 100, 100) : 
    (maxCapacity > 0 ? Math.min((currentGuests / maxCapacity) * 100, 100) : 0);
  
  // Use daily percentage if defined (even if 0), otherwise fallback to simultaneous
  const percentage = maxDailyCapacity !== undefined ? dailyPercentage : simultaneousPercentage;

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
          <div>
            <span className="font-semibold">
              {currentGuests} / {displayCapacity} couverts
            </span>
            {hasAdvancedData && simultaneousCapacity && simultaneousCapacity !== displayCapacity && (
              <span 
                className="ml-2 text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full flex items-center gap-1 cursor-help"
                title={`Capacité simultanée: ${simultaneousCapacity} couverts (tables × places)\nCapacité théorique: ${displayCapacity} couverts (basé sur les horaires d'ouverture)`}
              >
                Simultané: {simultaneousCapacity}
                <Info className="h-3 w-3" />
              </span>
            )}
          </div>
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
      <div className="w-full bg-white/50 rounded-full h-2 overflow-hidden mb-1">
        <div
          className={cn('h-full transition-all duration-500', getBarColor())}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {/* Show both percentages if significantly different */}
      {hasAdvancedData && simultaneousCapacity !== undefined && maxDailyCapacity !== undefined && 
       simultaneousCapacity > 0 && maxDailyCapacity > 0 &&
       Math.abs(dailyPercentage - simultaneousPercentage) > 5 && (
        <div className="flex justify-between text-xs text-slate-500">
          <span title="Occupation basée sur la capacité théorique (horaires d'ouverture)">
            Journalier: {dailyPercentage.toFixed(0)}%
          </span>
          <span title="Occupation basée sur la capacité simultanée (tables × places)">
            Simultané: {simultaneousPercentage.toFixed(0)}%
          </span>
        </div>
      )}
      
      {/* Info message if capacities are equal (only one time slot) */}
      {hasAdvancedData && simultaneousCapacity !== undefined && maxDailyCapacity !== undefined &&
       simultaneousCapacity > 0 && maxDailyCapacity > 0 && maxDailyCapacity === simultaneousCapacity && (
        <div className="mt-1 text-[10px] text-slate-400" title="La capacité théorique est égale à la capacité simultanée. Cela signifie qu'il n'y a qu'un seul créneau de réservation possible. Vérifiez les horaires d'ouverture et la durée des réservations.">
          ℹ️ Un seul créneau de réservation
        </div>
      )}

      {/* Service breakdown if available */}
      {serviceCapacities && (serviceCapacities.lunch || serviceCapacities.dinner) && (
        <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
          {serviceCapacities.lunch && (
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <span className="text-slate-600">Déjeuner</span>
                {serviceCapacities.lunch.totalSlots !== undefined && (
                  <span 
                    className="text-xs text-slate-400"
                    title={`${serviceCapacities.lunch.occupiedSlots || 0}/${serviceCapacities.lunch.totalSlots} créneaux occupés`}
                  >
                    ({serviceCapacities.lunch.occupiedSlots || 0}/{serviceCapacities.lunch.totalSlots})
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium">
                  {serviceCapacities.lunch.currentGuests} / {serviceCapacities.lunch.maxCapacity}
                </span>
                {serviceCapacities.lunch.totalSlots !== undefined && serviceCapacities.lunch.totalSlots === 1 && (
                  <span 
                    className="text-[10px] text-amber-600 bg-amber-50 px-1 rounded"
                    title="Un seul créneau de réservation - vérifiez les horaires d'ouverture"
                  >
                    1 créneau
                  </span>
                )}
              </div>
            </div>
          )}
          {serviceCapacities.dinner && (
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <span className="text-slate-600">Dîner</span>
                {serviceCapacities.dinner.totalSlots !== undefined && serviceCapacities.dinner.totalSlots > 0 && (
                  <span 
                    className="text-xs text-slate-400"
                    title={`${serviceCapacities.dinner.occupiedSlots || 0}/${serviceCapacities.dinner.totalSlots} créneaux occupés`}
                  >
                    ({serviceCapacities.dinner.occupiedSlots || 0}/{serviceCapacities.dinner.totalSlots})
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {serviceCapacities.dinner.maxCapacity > 0 ? (
                  <span className="font-medium">
                    {serviceCapacities.dinner.currentGuests} / {serviceCapacities.dinner.maxCapacity}
                  </span>
                ) : (
                  <span 
                    className="text-slate-400 italic"
                    title="Le restaurant n'est pas ouvert le soir ou les horaires du dîner ne sont pas configurés"
                  >
                    Fermé
                  </span>
                )}
                {serviceCapacities.dinner.maxCapacity > 0 && serviceCapacities.dinner.totalSlots !== undefined && serviceCapacities.dinner.totalSlots === 1 && (
                  <span 
                    className="text-[10px] text-amber-600 bg-amber-50 px-1 rounded"
                    title="Un seul créneau de réservation - vérifiez les horaires d'ouverture"
                  >
                    1 créneau
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {date && (
        <p className="text-xs mt-2 opacity-75">
          {date}
        </p>
      )}
    </div>
  );
};
