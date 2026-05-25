'use client';

import { useState } from 'react';
import { Reservation, DayBlock } from '@/types';
import { ChevronLeft, ChevronRight, Plus, Ban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getLocalDateString } from '@/lib/formatters';

interface CalendarViewImprovedProps {
  reservations: Reservation[];
  blockedDays?: DayBlock[];
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  onQuickCreate?: (date: Date) => void;
  maxCapacity?: number;
}

const MONTH_NAMES = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

const DAY_NAMES = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const DAY_NAMES_DESKTOP = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export default function CalendarViewImproved({
  reservations,
  blockedDays = [],
  selectedDate,
  onDateSelect,
  currentMonth,
  onMonthChange,
  onQuickCreate,
  maxCapacity = 50,
}: CalendarViewImprovedProps) {
  const [showLegend, setShowLegend] = useState(false);

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const getFirstDayOfMonth = (date: Date) => {
    const fd = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return fd === 0 ? 6 : fd - 1;
  };

  const isDayBlocked = (day: number) => {
    const dateStr = getLocalDateString(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    );
    return blockedDays.some((b) => getLocalDateString(b.date) === dateStr);
  };

  const getServiceStats = (day: number) => {
    const dateStr = getLocalDateString(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    );
    const dayReservations = reservations.filter((r) => {
      return getLocalDateString(r.date) === dateStr && r.status !== 'cancelled';
    });
    const totalGuests = dayReservations.reduce((sum, r) => sum + r.numberOfGuests, 0);

    const lunchGuests = dayReservations
      .filter((r) => { const h = parseInt(r.time.split(':')[0]); return h >= 11 && h < 15; })
      .reduce((sum, r) => sum + r.numberOfGuests, 0);
    const dinnerGuests = dayReservations
      .filter((r) => { const h = parseInt(r.time.split(':')[0]); return h >= 18 && h < 24; })
      .reduce((sum, r) => sum + r.numberOfGuests, 0);

    return {
      total: dayReservations.length,
      totalGuests,
      lunch: { count: 0, guests: lunchGuests },
      dinner: { count: 0, guests: dinnerGuests },
    };
  };

  const getCellBg = (guests: number) => {
    if (guests === 0) return '';
    const pct = (guests / maxCapacity) * 100;
    if (pct < 20) return 'bg-green-50 border-green-100';
    if (pct < 40) return 'bg-green-100 border-green-200';
    if (pct < 60) return 'bg-yellow-50 border-yellow-100';
    if (pct < 80) return 'bg-orange-100 border-orange-200';
    return 'bg-red-100 border-red-200';
  };

  const getDotColor = (guests: number) => {
    if (guests === 0) return 'bg-[#E5E5EA]';
    const pct = (guests / (maxCapacity / 2)) * 100;
    if (pct < 50) return 'bg-emerald-400';
    if (pct < 80) return 'bg-amber-400';
    return 'bg-red-400';
  };

  const isDateSelected = (day: number) =>
    !!selectedDate &&
    selectedDate.getFullYear() === currentMonth.getFullYear() &&
    selectedDate.getMonth() === currentMonth.getMonth() &&
    selectedDate.getDate() === day;

  const isTodayDate = (day: number) => {
    const t = new Date();
    return t.getFullYear() === currentMonth.getFullYear() &&
      t.getMonth() === currentMonth.getMonth() &&
      t.getDate() === day;
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDayOffset = getFirstDayOfMonth(currentMonth);

  const prev = () => onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const next = () => onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  return (
    <div className="bg-white md:rounded-lg md:shadow-md md:border md:border-slate-200 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-1 md:px-0">
        <h2 className="text-lg font-semibold text-[#000000] md:text-2xl md:font-bold md:text-slate-900">
          {MONTH_NAMES[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>
        <div className="flex gap-1.5">
          <Button variant="outline" size="sm" onClick={prev} className="h-9 w-9 md:h-8 md:w-8 p-0"><ChevronLeft className="h-4 w-4" /></Button>
          <Button variant="outline" size="sm" onClick={next} className="h-9 w-9 md:h-8 md:w-8 p-0"><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-px md:gap-2">
        {DAY_NAMES.map((d, i) => (
          <div key={i} className="text-center text-[10px] font-semibold text-[#8E8E93] py-1.5 md:text-xs md:text-slate-600 md:py-2">
            <span className="md:hidden">{d}</span>
            <span className="hidden md:inline">{DAY_NAMES_DESKTOP[i]}</span>
          </div>
        ))}
        {Array.from({ length: firstDayOffset }).map((_, i) => (
          <div key={`e-${i}`} className="aspect-square" />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const stats = getServiceStats(day);
          const selected = isDateSelected(day);
          const today = isTodayDate(day);
          const blocked = isDayBlocked(day);

          return (
            <button
              key={day}
              onClick={() => !blocked && onDateSelect(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))}
              disabled={blocked}
              className={cn(
                'relative aspect-square rounded-lg md:rounded-xl border transition-all flex flex-col items-center justify-between p-0.5 md:p-2',
                selected && 'border-[#0066FF] ring-1 ring-[#0066FF]/30 z-10',
                today && !selected && 'ring-1 ring-[#0066FF]/40',
                blocked && 'opacity-40',
                !selected && !blocked && getCellBg(stats.totalGuests)
              )}
            >
              {blocked && <Ban className="absolute inset-0 m-auto h-4 w-4 md:h-6 md:w-6 text-red-400" />}

              <span className={cn('text-xs font-semibold md:text-sm', today && 'text-[#0066FF]')}>
                {day}
              </span>

              {!blocked && onQuickCreate && (
                <button
                  onClick={(e) => { e.stopPropagation(); onQuickCreate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)); }}
                  className="p-0.5 rounded-full text-[#8E8E93] active:bg-[#0066FF] active:text-white transition-colors md:opacity-0 md:group-hover:opacity-100"
                  aria-label="Ajouter"
                >
                  <Plus className="h-3 w-3" />
                </button>
              )}

              {!blocked && stats.total > 0 && (
                <>
                  <div className="flex gap-0.5 md:hidden">
                    <div className={cn('w-1.5 h-1.5 rounded-full', getDotColor(stats.lunch.guests))} />
                    <div className={cn('w-1.5 h-1.5 rounded-full', getDotColor(stats.dinner.guests))} />
                  </div>
                  <div className="hidden md:block w-full space-y-0.5">
                    <div className="flex gap-1 justify-center">
                      {stats.lunch.guests > 0 && <div className={cn('h-1 rounded-full flex-1', getDotColor(stats.lunch.guests))} />}
                      {stats.dinner.guests > 0 && <div className={cn('h-1 rounded-full flex-1', getDotColor(stats.dinner.guests))} />}
                    </div>
                    <div className="text-xs font-medium text-slate-700">{stats.total} rés.</div>
                    <div className="text-[10px] text-slate-600">{stats.totalGuests} pers.</div>
                  </div>
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend toggle mobile */}
      <button onClick={() => setShowLegend(!showLegend)} className="md:hidden mt-4 mx-auto flex items-center gap-1 text-[11px] text-[#8E8E93] font-medium">
        Légende
        <ChevronRight className={cn('h-3 w-3 transition-transform', showLegend && 'rotate-90')} />
      </button>

      {/* Legend */}
      <div className={cn('mt-4 pt-4 border-t space-y-3', !showLegend && 'hidden md:block')}>
        <div className="flex flex-wrap gap-3 md:gap-4 text-[10px] md:text-xs">
          {[
            ['Faible', 'bg-green-50 border-green-200'],
            ['Moyen', 'bg-yellow-50 border-yellow-200'],
            ['Élevé', 'bg-orange-100 border-orange-200'],
            ['Complet', 'bg-red-100 border-red-200'],
          ].map(([label, cls]) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className={cn('w-3 h-3 md:w-4 md:h-4 rounded border', cls)} />
              <span className="text-[#8E8E93] md:text-slate-600">{label}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 md:gap-4 text-[10px] md:text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-emerald-400" />
            <span className="text-[#8E8E93] md:text-slate-600">Midi</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-amber-400" />
            <span className="text-[#8E8E93] md:text-slate-600">Soir</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Ban className="h-3 w-3 md:h-4 md:w-4 text-red-400" />
            <span className="text-[#8E8E93] md:text-slate-600">Bloqué</span>
          </div>
        </div>
      </div>
    </div>
  );
}
