'use client';

import { Reservation } from '@/types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CalendarViewProps {
  reservations: Reservation[];
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
}

export default function CalendarView({
  reservations,
  selectedDate,
  onDateSelect,
  currentMonth,
  onMonthChange,
}: CalendarViewProps) {
  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    // Convert Sunday (0) to 7 for our Monday-first week
    return firstDay === 0 ? 6 : firstDay - 1;
  };

  // Calculate stats for a specific day
  const getDayStats = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const dateStr = new Date(year, month, day).toISOString().split('T')[0];

    const dayReservations = reservations.filter(r => {
      const resDate = new Date(r.date).toISOString().split('T')[0];
      return resDate === dateStr && r.status !== 'cancelled';
    });

    const totalGuests = dayReservations.reduce((sum, r) => sum + r.numberOfGuests, 0);

    return {
      count: dayReservations.length,
      guests: totalGuests,
      reservations: dayReservations,
    };
  };

  // Get color based on number of reservations
  const getDayColor = (count: number) => {
    if (count === 0) return 'bg-white hover:bg-gray-50';
    if (count <= 3) return 'bg-green-50 hover:bg-green-100';
    if (count <= 6) return 'bg-yellow-50 hover:bg-yellow-100';
    return 'bg-red-50 hover:bg-red-100';
  };

  // Check if date is selected
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

  // Check if date is today
  const isToday = (day: number) => {
    const today = new Date();
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
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

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CalendarIcon className="h-6 w-6 text-gray-700" />
          <h2 className="text-2xl font-bold text-gray-900">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h2>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousMonth}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMonthChange(new Date())}
          >
            Aujourd&apos;hui
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextMonth}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day names */}
        {dayNames.map(day => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-gray-600 py-2"
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
          const stats = getDayStats(day);
          const isSelected = isDateSelected(day);
          const isTodayDate = isToday(day);

          return (
            <button
              key={day}
              onClick={() => handleDayClick(day)}
              className={`
                aspect-square p-2 rounded-lg border-2 transition-all
                ${isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent'}
                ${isTodayDate ? 'ring-2 ring-gray-300' : ''}
                ${getDayColor(stats.count)}
              `}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <div className={`text-sm font-semibold mb-1 ${isTodayDate ? 'text-blue-600' : 'text-gray-900'}`}>
                  {day}
                </div>
                {stats.count > 0 && (
                  <div className="text-xs space-y-0.5">
                    <div className="font-medium text-gray-700">
                      {stats.count} rés.
                    </div>
                    <div className="text-gray-600">
                      {stats.guests} pers.
                    </div>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t">
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-50 border border-green-200 rounded"></div>
            <span className="text-gray-600">1-3 réservations</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-50 border border-yellow-200 rounded"></div>
            <span className="text-gray-600">4-6 réservations</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-50 border border-red-200 rounded"></div>
            <span className="text-gray-600">7+ réservations</span>
          </div>
        </div>
      </div>
    </div>
  );
}
