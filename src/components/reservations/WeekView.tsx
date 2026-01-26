'use client';

import { Reservation, Restaurant } from '@/types';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addWeeks,
  subWeeks,
  isSameDay,
  isToday,
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { getAvailableTimeSlots } from '@/hooks/useRestaurantInfo';

interface WeekViewProps {
  reservations: Reservation[];
  currentWeek: Date;
  onWeekChange: (date: Date) => void;
  onReservationClick?: (reservation: Reservation) => void;
  restaurant?: Restaurant | null;
}

export const WeekView = ({
  reservations,
  currentWeek,
  onWeekChange,
  onReservationClick,
  restaurant,
}: WeekViewProps) => {
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Calculate time range from restaurant opening hours
  let minHour = 11;
  let maxHour = 23;

  if (restaurant?.openingHours) {
    const allSlots: string[] = [];
    weekDays.forEach((day) => {
      const dayOfWeek = day.getDay();
      const slots = getAvailableTimeSlots(restaurant, dayOfWeek);
      allSlots.push(...slots);
    });

    if (allSlots.length > 0) {
      // Find earliest and latest hours
      const hours = allSlots.map((slot) => parseInt(slot.split(':')[0]));
      minHour = Math.min(...hours);
      maxHour = Math.max(...hours) + 1; // Add 1 to include the last hour
    }
  }

  // Generate time slots based on opening hours
  const timeSlots = Array.from({ length: maxHour - minHour + 1 }, (_, i) => i + minHour);

  const handlePreviousWeek = () => {
    onWeekChange(subWeeks(currentWeek, 1));
  };

  const handleNextWeek = () => {
    onWeekChange(addWeeks(currentWeek, 1));
  };

  const handleToday = () => {
    onWeekChange(new Date());
  };

  // Check if a day is closed
  const isDayClosed = (day: Date): boolean => {
    if (!restaurant?.openingHours) return false;
    const dayOfWeek = day.getDay();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[dayOfWeek] as keyof typeof restaurant.openingHours;
    return restaurant.openingHours[dayName]?.closed || false;
  };

  // Get reservations for a specific day and hour
  const getReservationsForSlot = (day: Date, hour: number) => {
    const dayStr = day.toISOString().split('T')[0];

    return reservations.filter((r) => {
      const resDate = new Date(r.date).toISOString().split('T')[0];
      if (resDate !== dayStr || r.status === 'cancelled') return false;

      const resHour = parseInt(r.time.split(':')[0]);
      return resHour === hour;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 border-green-300 text-green-900';
      case 'pending':
        return 'bg-amber-100 border-amber-300 text-amber-900';
      case 'completed':
        return 'bg-slate-100 border-slate-300 text-slate-700';
      default:
        return 'bg-slate-100 border-slate-300 text-slate-700';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-slate-200 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Calendar className="h-6 w-6 text-slate-700" />
          <h2 className="text-xl md:text-2xl font-bold text-slate-900">
            Semaine du {format(weekStart, 'd', { locale: fr })} au{' '}
            {format(weekEnd, 'd MMMM yyyy', { locale: fr })}
          </h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleToday}>
            Aujourd&apos;hui
          </Button>
          <Button variant="outline" size="sm" onClick={handleNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Timeline Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Day headers */}
          <div className="grid grid-cols-8 gap-1 mb-2">
            <div className="text-xs font-semibold text-slate-600 p-2">Heure</div>
            {weekDays.map((day) => {
              const closed = isDayClosed(day);
              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    'text-center p-2 rounded-t-lg',
                    isToday(day) ? 'bg-blue-50' : '',
                    closed ? 'opacity-50' : ''
                  )}
                >
                  <div
                    className={cn(
                      'text-xs font-semibold capitalize',
                      isToday(day) ? 'text-blue-600' : 'text-slate-600'
                    )}
                  >
                    {format(day, 'EEE', { locale: fr })}
                  </div>
                  <div
                    className={cn(
                      'text-lg font-bold mt-1',
                      isToday(day) ? 'text-blue-600' : 'text-slate-900'
                    )}
                  >
                    {format(day, 'd')}
                  </div>
                  {closed && <div className="text-[10px] text-red-600 mt-1">Fermé</div>}
                </div>
              );
            })}
          </div>

          {/* Time slots */}
          {timeSlots.map((hour) => (
            <div key={hour} className="grid grid-cols-8 gap-1 mb-1">
              {/* Hour label */}
              <div className="text-xs font-medium text-slate-500 p-2 flex items-start">
                {hour}:00
              </div>

              {/* Day columns */}
              {weekDays.map((day) => {
                const slotReservations = getReservationsForSlot(day, hour);
                const hasReservations = slotReservations.length > 0;
                const closed = isDayClosed(day);

                return (
                  <div
                    key={`${day.toISOString()}-${hour}`}
                    className={cn(
                      'min-h-[60px] border border-slate-200 rounded p-1',
                      isToday(day) ? 'bg-blue-50/30' : 'bg-white',
                      hasReservations ? 'bg-slate-50' : '',
                      closed ? 'bg-slate-100 opacity-50' : ''
                    )}
                  >
                    {slotReservations.map((reservation) => (
                      <button
                        key={reservation._id}
                        onClick={() => onReservationClick?.(reservation)}
                        className={cn(
                          'w-full text-left p-1.5 rounded border mb-1 text-xs hover:shadow-md transition-shadow',
                          getStatusColor(reservation.status)
                        )}
                      >
                        <div className="font-semibold truncate">
                          {reservation.time} - {reservation.customerName}
                        </div>
                        <div className="text-[10px] opacity-75">
                          {reservation.numberOfGuests} pers.
                        </div>
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t">
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
            <span className="text-slate-600">Confirmée</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-amber-100 border border-amber-300 rounded"></div>
            <span className="text-slate-600">En attente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-slate-100 border border-slate-300 rounded"></div>
            <span className="text-slate-600">Terminée</span>
          </div>
        </div>
      </div>
    </div>
  );
};
