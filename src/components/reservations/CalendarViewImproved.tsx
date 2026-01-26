'use client';

import { Reservation, DayBlock } from '@/types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, Ban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
  const monthNames = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
  ];

  const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1;
  };

  // Check if day is blocked
  const isDayBlocked = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const dateStr = new Date(year, month, day).toISOString().split('T')[0];

    return blockedDays.some((block) => {
      const blockDate = new Date(block.date).toISOString().split('T')[0];
      return blockDate === dateStr;
    });
  };

  // Get service stats (lunch vs dinner)
  const getServiceStats = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const dateStr = new Date(year, month, day).toISOString().split('T')[0];

    const dayReservations = reservations.filter((r) => {
      const resDate = new Date(r.date).toISOString().split('T')[0];
      return resDate === dateStr && r.status !== 'cancelled';
    });

    // Lunch: 11:00 - 15:00
    const lunchReservations = dayReservations.filter((r) => {
      const hour = parseInt(r.time.split(':')[0]);
      return hour >= 11 && hour < 15;
    });

    // Dinner: 18:00 - 23:00
    const dinnerReservations = dayReservations.filter((r) => {
      const hour = parseInt(r.time.split(':')[0]);
      return hour >= 18 && hour < 24;
    });

    const lunchGuests = lunchReservations.reduce((sum, r) => sum + r.numberOfGuests, 0);
    const dinnerGuests = dinnerReservations.reduce((sum, r) => sum + r.numberOfGuests, 0);
    const totalGuests = dayReservations.reduce((sum, r) => sum + r.numberOfGuests, 0);

    return {
      total: dayReservations.length,
      totalGuests,
      lunch: {
        count: lunchReservations.length,
        guests: lunchGuests,
      },
      dinner: {
        count: dinnerReservations.length,
        guests: dinnerGuests,
      },
    };
  };

  // Get heatmap color with gradient
  const getHeatmapColor = (guests: number) => {
    if (guests === 0) return 'bg-white hover:bg-slate-50';

    const percentage = (guests / maxCapacity) * 100;

    if (percentage < 20) return 'bg-green-50 hover:bg-green-100 border-green-100';
    if (percentage < 40) return 'bg-green-100 hover:bg-green-200 border-green-200';
    if (percentage < 60) return 'bg-yellow-50 hover:bg-yellow-100 border-yellow-100';
    if (percentage < 80) return 'bg-orange-100 hover:bg-orange-200 border-orange-200';
    if (percentage < 95) return 'bg-red-100 hover:bg-red-200 border-red-200';
    return 'bg-red-200 hover:bg-red-300 border-red-300';
  };

  // Get capacity indicator color
  const getCapacityColor = (guests: number, service: 'lunch' | 'dinner') => {
    const serviceMax = maxCapacity / 2; // Assuming half capacity per service
    const percentage = (guests / serviceMax) * 100;

    if (percentage === 0) return 'bg-slate-200';
    if (percentage < 50) return 'bg-green-400';
    if (percentage < 80) return 'bg-amber-400';
    return 'bg-red-400';
  };

  const isDateSelected = (day: number) => {
    if (!selectedDate) return false;
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    return (
      selectedDate.getFullYear() === year &&
      selectedDate.getMonth() === month &&
      selectedDate.getDate() === day
    );
  };

  const isToday = (day: number) => {
    const today = new Date();
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDayOffset = getFirstDayOfMonth(currentMonth);

  const handlePreviousMonth = () => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    onMonthChange(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    onMonthChange(newDate);
  };

  const handleDayClick = (day: number) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    onDateSelect(selectedDate);
  };

  const handleQuickCreate = (day: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onQuickCreate) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      onQuickCreate(date);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-slate-200 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CalendarIcon className="h-6 w-6 text-slate-700" />
          <h2 className="text-2xl font-bold text-slate-900">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onMonthChange(new Date())}>
            Aujourd&apos;hui
          </Button>
          <Button variant="outline" size="sm" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 md:gap-2">
        {/* Day names */}
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-xs md:text-sm font-semibold text-slate-600 py-2"
          >
            {day}
          </div>
        ))}

        {/* Empty cells for offset */}
        {Array.from({ length: firstDayOffset }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {/* Days */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const stats = getServiceStats(day);
          const isSelected = isDateSelected(day);
          const isTodayDate = isToday(day);
          const isBlocked = isDayBlocked(day);

          return (
            <div
              key={day}
              className={cn(
                'relative aspect-square rounded-lg border-2 transition-all overflow-hidden group',
                isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent',
                isTodayDate && !isSelected ? 'ring-2 ring-slate-300' : '',
                isBlocked ? 'opacity-50' : '',
                getHeatmapColor(stats.totalGuests)
              )}
            >
              {isBlocked && (
                <div className="absolute inset-0 bg-slate-900/10 flex items-center justify-center z-10">
                  <Ban className="h-6 w-6 text-red-600" />
                </div>
              )}

              <button
                onClick={() => !isBlocked && handleDayClick(day)}
                disabled={isBlocked}
                className="w-full h-full p-1 md:p-2 flex flex-col justify-between"
              >
                {/* Day number */}
                <div className="flex items-start justify-between w-full">
                  <div
                    className={cn(
                      'text-xs md:text-sm font-semibold',
                      isTodayDate ? 'text-blue-600' : 'text-slate-900'
                    )}
                  >
                    {day}
                  </div>

                  {/* Quick create button */}
                  {onQuickCreate && !isBlocked && (
                    <button
                      onClick={(e) => handleQuickCreate(day, e)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded-full hover:bg-blue-500 hover:text-white"
                      title="Créer une réservation"
                    >
                      <Plus className="h-3 w-3 md:h-4 md:w-4" />
                    </button>
                  )}
                </div>

                {/* Stats */}
                {!isBlocked && stats.total > 0 && (
                  <div className="space-y-1">
                    {/* Service indicators */}
                    <div className="flex gap-1 justify-center">
                      {/* Lunch */}
                      {stats.lunch.count > 0 && (
                        <div
                          className={cn(
                            'h-1 rounded-full flex-1',
                            getCapacityColor(stats.lunch.guests, 'lunch')
                          )}
                          title={`Déjeuner: ${stats.lunch.count} rés., ${stats.lunch.guests} pers.`}
                        />
                      )}
                      {/* Dinner */}
                      {stats.dinner.count > 0 && (
                        <div
                          className={cn(
                            'h-1 rounded-full flex-1',
                            getCapacityColor(stats.dinner.guests, 'dinner')
                          )}
                          title={`Dîner: ${stats.dinner.count} rés., ${stats.dinner.guests} pers.`}
                        />
                      )}
                    </div>

                    {/* Total */}
                    <div className="text-xs space-y-0.5">
                      <div className="font-medium text-slate-700">{stats.total} rés.</div>
                      <div className="text-slate-600 text-[10px] md:text-xs">
                        {stats.totalGuests} pers.
                      </div>
                    </div>
                  </div>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t space-y-3">
        <div className="flex flex-wrap gap-4 text-xs md:text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
            <span className="text-slate-600">Faible (&lt;40%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-50 border border-yellow-200 rounded"></div>
            <span className="text-slate-600">Moyen (40-60%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-100 border border-orange-200 rounded"></div>
            <span className="text-slate-600">Élevé (60-80%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-200 border border-red-300 rounded"></div>
            <span className="text-slate-600">Complet (&gt;80%)</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-xs md:text-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-1 bg-green-400 rounded"></div>
            <span className="text-slate-600">Déjeuner</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-1 bg-amber-400 rounded"></div>
            <span className="text-slate-600">Dîner</span>
          </div>
          <div className="flex items-center gap-2">
            <Ban className="h-4 w-4 text-red-600" />
            <span className="text-slate-600">Jour bloqué</span>
          </div>
        </div>
      </div>
    </div>
  );
}
