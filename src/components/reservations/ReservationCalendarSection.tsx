'use client';

import { Button } from '@/components/ui/button';
import CalendarViewImproved from '@/components/reservations/CalendarViewImproved';
import { WeekView } from '@/components/reservations/WeekView';
import { DayView } from '@/components/reservations/DayView';
import { getMaxCapacityFromRestaurant } from '@/hooks/useRestaurantCapacity';
import { cn } from '@/lib/utils';
import { Reservation, Restaurant } from '@/types';

interface ReservationCalendarSectionProps {
  calendarViewType: 'month' | 'week' | 'day';
  filteredReservations: Reservation[];
  blockedDays: any[];
  selectedDate: Date | null;
  currentMonth: Date;
  currentWeek: Date;
  currentDay: Date;
  restaurant: Restaurant | null;
  onCalendarViewTypeChange: (type: 'month' | 'week' | 'day') => void;
  onDateSelectFromMonth: (date: Date) => void;
  onMonthChange: (date: Date) => void;
  onWeekChange: (date: Date) => void;
  onDayChange: (date: Date) => void;
  onReservationClick: (reservation: Reservation) => void;
  onQuickCreateFromCalendar: (date: Date) => void;
  onQuickCreateFromDay: (time: string) => void;
}

export function ReservationCalendarSection({
  calendarViewType,
  filteredReservations,
  blockedDays,
  selectedDate,
  currentMonth,
  currentWeek,
  currentDay,
  restaurant,
  onCalendarViewTypeChange,
  onDateSelectFromMonth,
  onMonthChange,
  onWeekChange,
  onDayChange,
  onReservationClick,
  onQuickCreateFromCalendar,
  onQuickCreateFromDay,
}: ReservationCalendarSectionProps) {
  const maxCapacity = getMaxCapacityFromRestaurant(restaurant);

  return (
    <>
      <div className="flex bg-[#F2F2F7] rounded-xl p-0.5 w-fit md:hidden">
        {(['week', 'day', 'month'] as const).map((t) => (
          <button
            key={t}
            onClick={() => onCalendarViewTypeChange(t)}
            className={cn(
              'px-4 py-1.5 text-[13px] font-medium rounded-lg transition-colors',
              calendarViewType === t ? 'bg-white text-[#000000] shadow-sm' : 'text-[#8E8E93]'
            )}
          >
            {t === 'week' ? 'Sem.' : t === 'day' ? 'Jour' : 'Mois'}
          </button>
        ))}
      </div>

      <div className="hidden md:flex gap-2">
        <Button
          variant={calendarViewType === 'week' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onCalendarViewTypeChange('week')}
        >
          Semaine
        </Button>
        <Button
          variant={calendarViewType === 'day' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onCalendarViewTypeChange('day')}
        >
          Jour
        </Button>
        <Button
          variant={calendarViewType === 'month' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onCalendarViewTypeChange('month')}
        >
          Mois
        </Button>
      </div>

      {calendarViewType === 'month' && (
        <CalendarViewImproved
          reservations={filteredReservations}
          blockedDays={blockedDays}
          selectedDate={selectedDate}
          onDateSelect={(date) => {
            onDateSelectFromMonth(date);
            onCalendarViewTypeChange('day');
          }}
          currentMonth={currentMonth}
          onMonthChange={onMonthChange}
          onQuickCreate={onQuickCreateFromCalendar}
          maxCapacity={maxCapacity}
        />
      )}

      {calendarViewType === 'week' && (
        <WeekView
          reservations={filteredReservations}
          currentWeek={currentWeek}
          onWeekChange={onWeekChange}
          onReservationClick={onReservationClick}
          restaurant={restaurant}
          maxCapacity={maxCapacity}
        />
      )}

      {calendarViewType === 'day' && (
        <DayView
          reservations={filteredReservations}
          currentDay={currentDay}
          onDayChange={onDayChange}
          onReservationClick={onReservationClick}
          onQuickCreate={onQuickCreateFromDay}
          maxCapacity={maxCapacity}
          restaurant={restaurant}
        />
      )}
    </>
  );
}
