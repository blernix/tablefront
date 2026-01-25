'use client';

import { Reservation } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Calendar, Plus, Users, Clock } from 'lucide-react';
import { format, addDays, subDays, isToday } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface DayViewProps {
  reservations: Reservation[];
  currentDay: Date;
  onDayChange: (date: Date) => void;
  onReservationClick?: (reservation: Reservation) => void;
  onQuickCreate?: (time: string) => void;
  maxCapacity?: number;
}

export const DayView = ({
  reservations,
  currentDay,
  onDayChange,
  onReservationClick,
  onQuickCreate,
  maxCapacity = 50
}: DayViewProps) => {
  // Services time ranges
  const services = [
    { name: 'Déjeuner', start: 11, end: 15, slots: 30 },
    { name: 'Dîner', start: 18, end: 23, slots: 30 }
  ];

  const handlePreviousDay = () => {
    onDayChange(subDays(currentDay, 1));
  };

  const handleNextDay = () => {
    onDayChange(addDays(currentDay, 1));
  };

  const handleToday = () => {
    onDayChange(new Date());
  };

  // Get reservations for current day
  const dayReservations = reservations.filter(r => {
    const resDate = new Date(r.date).toISOString().split('T')[0];
    const currentDayStr = currentDay.toISOString().split('T')[0];
    return resDate === currentDayStr && r.status !== 'cancelled';
  });

  // Calculate stats
  const totalGuests = dayReservations.reduce((sum, r) => sum + r.numberOfGuests, 0);
  const occupationRate = maxCapacity > 0 ? (totalGuests / maxCapacity) * 100 : 0;

  // Get reservations for a specific time slot
  const getReservationsForTime = (hour: number, minute: number) => {
    const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

    return dayReservations.filter(r => {
      const [resHour, resMin] = r.time.split(':').map(Number);
      return resHour === hour && Math.abs(resMin - minute) < 30;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 border-green-300 text-green-900 hover:bg-green-200';
      case 'pending':
        return 'bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200';
      case 'completed':
        return 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200';
      default:
        return 'bg-slate-100 border-slate-300 text-slate-700';
    }
  };

  // Generate time slots for a service
  const generateTimeSlots = (startHour: number, endHour: number, interval: number) => {
    const slots = [];
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        slots.push({ hour, minute });
      }
    }
    return slots;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-6 w-6 text-slate-700" />
              <div>
                <h2 className="text-2xl font-bold text-slate-900 capitalize">
                  {format(currentDay, 'EEEE d MMMM yyyy', { locale: fr })}
                </h2>
                {isToday(currentDay) && (
                  <p className="text-sm text-blue-600 font-medium mt-1">Aujourd&apos;hui</p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handlePreviousDay}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleToday}>
                Aujourd&apos;hui
              </Button>
              <Button variant="outline" size="sm" onClick={handleNextDay}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Day Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-900">
                {dayReservations.length}
              </div>
              <div className="text-xs text-blue-700">Réservations</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-900">
                {totalGuests}
              </div>
              <div className="text-xs text-green-700">Couverts</div>
            </div>
            <div className="text-center p-3 bg-amber-50 rounded-lg">
              <div className="text-2xl font-bold text-amber-900">
                {occupationRate.toFixed(0)}%
              </div>
              <div className="text-xs text-amber-700">Occupation</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Timeline */}
      {services.map(service => {
        const serviceReservations = dayReservations.filter(r => {
          const hour = parseInt(r.time.split(':')[0]);
          return hour >= service.start && hour < service.end;
        });

        const serviceGuests = serviceReservations.reduce((sum, r) => sum + r.numberOfGuests, 0);
        const serviceCapacity = maxCapacity / 2; // Half capacity per service
        const serviceOccupation = serviceCapacity > 0 ? (serviceGuests / serviceCapacity) * 100 : 0;

        const timeSlots = generateTimeSlots(service.start, service.end, service.slots);

        return (
          <Card key={service.name}>
            <CardContent className="pt-6">
              {/* Service Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-slate-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {service.name}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {service.start}h - {service.end}h
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm text-slate-600">
                      <Users className="inline h-4 w-4 mr-1" />
                      {serviceReservations.length} rés. · {serviceGuests} pers.
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      Occupation: {serviceOccupation.toFixed(0)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Capacity Bar */}
              <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
                <div
                  className={cn(
                    'h-2 rounded-full transition-all',
                    serviceOccupation >= 90 ? 'bg-red-500' :
                    serviceOccupation >= 70 ? 'bg-amber-500' :
                    'bg-green-500'
                  )}
                  style={{ width: `${Math.min(serviceOccupation, 100)}%` }}
                />
              </div>

              {/* Timeline */}
              <div className="space-y-1">
                {timeSlots.map(({ hour, minute }) => {
                  const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                  const slotReservations = getReservationsForTime(hour, minute);
                  const hasReservations = slotReservations.length > 0;

                  return (
                    <div
                      key={timeStr}
                      className={cn(
                        'flex items-center gap-2 p-2 rounded border transition-colors',
                        hasReservations ? 'bg-slate-50 border-slate-300' : 'bg-white border-slate-200 hover:bg-slate-50'
                      )}
                    >
                      {/* Time */}
                      <div className="w-16 text-sm font-medium text-slate-600 flex-shrink-0">
                        {timeStr}
                      </div>

                      {/* Reservations or Empty Slot */}
                      <div className="flex-1">
                        {hasReservations ? (
                          <div className="flex flex-wrap gap-2">
                            {slotReservations.map(reservation => (
                              <button
                                key={reservation._id}
                                onClick={() => onReservationClick?.(reservation)}
                                className={cn(
                                  'px-3 py-1.5 rounded border text-sm transition-colors',
                                  getStatusColor(reservation.status)
                                )}
                              >
                                <div className="font-semibold">
                                  {reservation.customerName}
                                </div>
                                <div className="text-xs opacity-75">
                                  {reservation.numberOfGuests} pers.
                                </div>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-400">Créneau libre</span>
                            {onQuickCreate && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onQuickCreate(timeStr)}
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Créer
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
