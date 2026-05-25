'use client';

import { useState } from 'react';
import { Reservation, Restaurant } from '@/types';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addWeeks,
  subWeeks,
  isToday,
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { getLocalDateString } from '@/lib/formatters';
import { getAvailableTimeSlots } from '@/store/restaurantStore';

interface WeekViewProps {
  reservations: Reservation[];
  currentWeek: Date;
  onWeekChange: (date: Date) => void;
  onReservationClick?: (reservation: Reservation) => void;
  restaurant?: Restaurant | null;
  maxCapacity?: number;
}

const statusConfig: Record<string, string> = {
  confirmed: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  pending: 'bg-amber-50 border-amber-200 text-amber-800',
  completed: 'bg-blue-50 border-blue-100 text-blue-700',
};

export const WeekView = ({
  reservations,
  currentWeek,
  onWeekChange,
  onReservationClick,
  restaurant,
  maxCapacity = 50,
}: WeekViewProps) => {
  const [showLegend, setShowLegend] = useState(false);

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  let minHour = 11;
  let maxHour = 23;
  if (restaurant?.openingHours) {
    const allHours: number[] = [];
    weekDays.forEach((d) => {
      const slots = getAvailableTimeSlots(restaurant, d.getDay());
      slots.forEach((s) => allHours.push(parseInt(s.split(':')[0])));
    });
    if (allHours.length > 0) {
      minHour = Math.min(...allHours);
      maxHour = Math.max(...allHours) + 1;
    }
  }

  const timeSlots = Array.from({ length: maxHour - minHour + 1 }, (_, i) => i + minHour);

  const prev = () => onWeekChange(subWeeks(currentWeek, 1));
  const next = () => onWeekChange(addWeeks(currentWeek, 1));

  const isDayClosed = (day: Date) => {
    if (!restaurant?.openingHours) return false;
    const d = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return restaurant.openingHours[d[day.getDay()] as keyof typeof restaurant.openingHours]?.closed || false;
  };

  const getSlotReservations = (day: Date, hour: number) => {
    const dayStr = getLocalDateString(day);
    return reservations.filter((r) => {
      if (getLocalDateString(r.date) !== dayStr || r.status === 'cancelled') return false;
      return parseInt(r.time.split(':')[0]) === hour;
    });
  };

  const getOccupancyPct = (guests: number) => Math.min((guests / maxCapacity) * 100, 100);

  const getBarColor = (pct: number) => {
    if (pct >= 90) return 'bg-red-500';
    if (pct >= 60) return 'bg-orange-400';
    if (pct >= 30) return 'bg-yellow-400';
    return 'bg-emerald-400';
  };

  return (
    <div className="bg-white md:rounded-lg md:shadow-md md:border md:border-slate-200 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-1 md:px-0">
        <h2 className="text-base font-semibold text-[#000000] md:text-2xl md:font-bold md:text-slate-900">
          <span className="md:hidden">Sem. {format(weekStart, 'd')}-{format(weekEnd, 'd MMM', { locale: fr })}</span>
          <span className="hidden md:inline">Semaine du {format(weekStart, 'd')} au {format(weekEnd, 'd MMMM yyyy', { locale: fr })}</span>
        </h2>
        <div className="flex gap-1.5">
          <Button variant="outline" size="sm" onClick={prev} className="h-9 w-9 md:h-8 md:w-8 p-0"><ChevronLeft className="h-4 w-4" /></Button>
          <Button variant="outline" size="sm" onClick={next} className="h-9 w-9 md:h-8 md:w-8 p-0"><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>

      {/* Timeline */}
      <div className="overflow-x-auto no-scrollbar -mx-4 md:mx-0" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="min-w-[640px] md:min-w-0">
          {/* Day headers */}
          <div className="grid grid-cols-[44px_repeat(7,1fr)] md:grid-cols-[52px_repeat(7,1fr)] gap-px mb-px">
            <div className="p-1 md:p-2" />
            {weekDays.map((day) => {
              const closed = isDayClosed(day);
              const todayFlag = isToday(day);
              return (
                <div key={day.toISOString()} className={cn('text-center py-2 md:py-2.5 rounded-t-lg md:rounded-t-xl', todayFlag && 'bg-[#0066FF]/5', closed && 'opacity-40')}>
                  <div className={cn('text-[10px] font-semibold uppercase md:text-xs', todayFlag ? 'text-[#0066FF]' : 'text-[#8E8E93] md:text-slate-600')}>
                    {format(day, 'EEE', { locale: fr }).replace('.', '')}
                  </div>
                  <div className={cn('text-sm font-bold mt-0.5 md:text-lg', todayFlag ? 'text-[#0066FF]' : 'text-[#000000] md:text-slate-900')}>
                    {format(day, 'd')}
                  </div>
                  {closed && <div className="text-[9px] text-red-400 mt-0.5 md:text-[10px] md:text-red-600">Fermé</div>}
                </div>
              );
            })}
          </div>

          {/* Time rows */}
          {timeSlots.map((hour) => (
            <div key={hour} className="grid grid-cols-[44px_repeat(7,1fr)] md:grid-cols-[52px_repeat(7,1fr)] gap-px mb-px">
              <div className="flex items-start justify-end p-1 md:p-2">
                <span className="text-[9px] font-medium text-[#8E8E93] tabular-nums md:text-xs">{hour}:00</span>
              </div>
              {weekDays.map((day) => {
                const slotRes = getSlotReservations(day, hour);
                const closed = isDayClosed(day);
                const totalGuests = slotRes.reduce((s, r) => s + r.numberOfGuests, 0);
                const pct = getOccupancyPct(totalGuests);

                return (
                  <div
                    key={`${day.toISOString()}-${hour}`}
                    className={cn(
                      'min-h-[44px] md:min-h-[60px] rounded md:rounded-lg border p-0.5 md:p-1 relative',
                      isToday(day) ? 'border-[#0066FF]/20 bg-[#0066FF]/[0.02]' : 'border-[#E5E5EA] md:border-slate-200',
                      closed && 'bg-[#F2F2F7] md:bg-slate-100 opacity-50'
                    )}
                  >
                    {slotRes.map((r) => (
                      <button
                        key={r._id}
                        onClick={() => onReservationClick?.(r)}
                        className={cn(
                          'w-full text-left px-1.5 py-0.5 md:px-2 md:py-1 rounded md:rounded-md border text-[9px] md:text-xs transition-colors mb-0.5',
                          statusConfig[r.status] || statusConfig.pending,
                          'active:ring-1 active:ring-[#0066FF]'
                        )}
                      >
                        <div className="font-medium truncate">{r.customerName}</div>
                        <div className="opacity-60 md:hidden">{r.numberOfGuests}p</div>
                        <div className="opacity-75 hidden md:block text-[10px]">{r.numberOfGuests} pers.</div>
                      </button>
                    ))}
                    {totalGuests > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 md:h-1 overflow-hidden rounded-b md:rounded-b-lg">
                        <div className={cn('h-full transition-all', getBarColor(pct))} style={{ width: `${pct}%` }} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend toggle */}
      <button onClick={() => setShowLegend(!showLegend)} className="md:hidden mt-4 mx-auto flex items-center gap-1 text-[11px] text-[#8E8E93] font-medium">
        Légende
        <ChevronRight className={cn('h-3 w-3 transition-transform', showLegend && 'rotate-90')} />
      </button>

      {/* Legend */}
      <div className={cn('mt-4 pt-4 border-t space-y-2', !showLegend && 'hidden md:block')}>
        <div className="flex flex-wrap gap-3 text-[10px] md:text-xs">
          {[
            ['Confirmée', 'bg-emerald-50 border-emerald-200'],
            ['En attente', 'bg-amber-50 border-amber-200'],
            ['Terminée', 'bg-blue-50 border-blue-100'],
          ].map(([l, c]) => (
            <div key={l} className="flex items-center gap-1.5">
              <div className={cn('w-3 h-3 md:w-4 md:h-4 rounded border', c)} />
              <span className="text-[#8E8E93] md:text-slate-600">{l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
