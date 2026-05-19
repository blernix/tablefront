'use client';

import { useState, useEffect, useRef } from 'react';
import { Reservation, Restaurant } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Calendar, Plus, Users, Clock, Sun, Moon, Eye } from 'lucide-react';
import { format, addDays, subDays, isToday } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { getLocalDateString } from '@/lib/formatters';
import { getAvailableTimeSlots } from '@/store/restaurantStore';
import { calculateDailyCapacityAdvanced } from '@/hooks/useRestaurantCapacity';

interface DayViewProps {
  reservations: Reservation[];
  currentDay: Date;
  onDayChange: (date: Date) => void;
  onReservationClick?: (reservation: Reservation) => void;
  onQuickCreate?: (time: string) => void;
  maxCapacity?: number;
  restaurant?: Restaurant | null;
}

const statusConfig = {
  confirmed: 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100',
  pending: 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100',
  completed: 'bg-blue-50 border-blue-100 text-blue-700 hover:bg-blue-100',
  cancelled: 'bg-red-50 border-red-100 text-red-700',
};

export const DayView = ({
  reservations,
  currentDay,
  onDayChange,
  onReservationClick,
  onQuickCreate,
  maxCapacity = 50,
  restaurant,
}: DayViewProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setSelectedId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleReservationTap = (reservation: Reservation) => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    if (!isMobile) {
      onReservationClick?.(reservation);
      return;
    }
    if (selectedId === reservation._id) {
      onReservationClick?.(reservation);
    } else {
      setSelectedId(reservation._id);
    }
  };

  const dayOfWeek = currentDay.getDay();

  const availableSlots = restaurant ? getAvailableTimeSlots(restaurant, dayOfWeek) : [];

  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
  const dayName = dayNames[dayOfWeek];
  const isClosed = restaurant?.openingHours?.[dayName]?.closed || false;

  const handlePreviousDay = () => onDayChange(subDays(currentDay, 1));
  const handleNextDay = () => onDayChange(addDays(currentDay, 1));
  const handleToday = () => onDayChange(new Date());

  const currentDayStr = getLocalDateString(currentDay);
  const dayReservations = reservations.filter((r) => {
    const resDate = getLocalDateString(r.date);
    return resDate === currentDayStr && r.status !== 'cancelled';
  });

  const advancedCapacity = restaurant
    ? calculateDailyCapacityAdvanced(reservations, currentDayStr, restaurant)
    : null;

  const totalGuests = dayReservations.reduce((sum, r) => sum + r.numberOfGuests, 0);
  const occupationRate =
    advancedCapacity?.dailyOccupationPercentage ??
    (maxCapacity > 0 ? (totalGuests / maxCapacity) * 100 : 0);

  // Group available slots by service (lunch < 17h, dinner >= 17h)
  const lunchSlots = availableSlots.filter((s) => parseInt(s.split(':')[0]) < 17);
  const dinnerSlots = availableSlots.filter((s) => parseInt(s.split(':')[0]) >= 17);

  // Match reservations to the closest available slot (15-min tolerance)
  const getReservationsForSlot = (slotTime: string) => {
    const [sh, sm] = slotTime.split(':').map(Number);
    const slotMin = sh * 60 + sm;
    return dayReservations.filter((r) => {
      const [rh, rm] = r.time.split(':').map(Number);
      const resMin = rh * 60 + rm;
      return Math.abs(resMin - slotMin) <= 15;
    });
  };

  const renderTimeline = (slots: string[], serviceName: string, icon: React.ReactNode) => {
    if (slots.length === 0) return null;

    const serviceReservations = dayReservations.filter((r) => {
      const hour = parseInt(r.time.split(':')[0]);
      return serviceName === 'Midi' ? hour < 17 : hour >= 17;
    });
    const serviceGuests = serviceReservations.reduce((sum, r) => sum + r.numberOfGuests, 0);
    let serviceCapacity = maxCapacity / 2;
    if (advancedCapacity) {
      serviceCapacity = serviceName === 'Midi'
        ? advancedCapacity.serviceCapacities.lunch.maxCapacity
        : advancedCapacity.serviceCapacities.dinner.maxCapacity;
    }
    const serviceOccupation = serviceCapacity > 0 ? (serviceGuests / serviceCapacity) * 100 : 0;

    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {icon}
              <div>
                <h3 className="text-lg font-light text-[#2A2A2A]">{serviceName}</h3>
                <p className="text-sm text-[#999999]">
                  {slots[0]} - {slots[slots.length - 1]} ({slots.length} créneau{slots.length > 1 ? 'x' : ''})
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-[#666666]">
                <Users className="inline h-4 w-4 mr-1" />
                {serviceReservations.length} rés. · {serviceGuests} pers.
              </div>
              <div className="text-xs text-[#999999] mt-1">
                {serviceOccupation.toFixed(0)}% {serviceCapacity > 0 && `/ ${serviceCapacity} couverts`}
              </div>
            </div>
          </div>

          <div className="w-full bg-[#F5F5F5] rounded-full h-1.5 mb-4">
            <div
              className={cn(
                'h-1.5 rounded-full transition-all',
                serviceOccupation >= 90 ? 'bg-red-500' : serviceOccupation >= 70 ? 'bg-amber-500' : 'bg-emerald-500'
              )}
              style={{ width: `${Math.min(serviceOccupation, 100)}%` }}
            />
          </div>

          <div className="space-y-1">
            {slots.map((timeStr) => {
              const slotReservations = getReservationsForSlot(timeStr);
              const hasReservations = slotReservations.length > 0;

              return (
                <div
                  key={timeStr}
                  className={cn(
                    'flex items-center gap-2 p-2 rounded-lg border transition-colors',
                    hasReservations ? 'bg-white border-[#E5E5E5]' : 'bg-white border-[#E5E5E5] hover:bg-[#FAFAFA]'
                  )}
                >
                  <div className="w-14 text-sm font-mono font-medium text-[#2A2A2A] flex-shrink-0">
                    {timeStr}
                  </div>
                  <div className="flex-1">
                    {hasReservations && (
                      <div className="flex flex-wrap gap-1.5 mb-1">
                        {slotReservations.map((reservation) => {
                          const isExpanded = selectedId === reservation._id;
                          return (
                            <div key={reservation._id} className="group">
                              <button
                                onClick={() => handleReservationTap(reservation)}
                                className={cn(
                                  'px-3 py-1.5 rounded-lg border text-sm transition-colors text-left',
                                  statusConfig[reservation.status as keyof typeof statusConfig] || statusConfig.pending,
                                  isExpanded ? 'ring-2 ring-[#0066FF] shadow-md z-10 relative' : ''
                                )}
                              >
                                <div className="font-medium">{reservation.customerName}</div>
                                <div className="text-xs opacity-75">{reservation.numberOfGuests} pers.</div>
                              </button>
                              {isExpanded && (
                                <div className="mt-0.5 p-2 bg-white border border-[#0066FF]/30 rounded-md text-xs space-y-1.5 shadow-sm sm:hidden">
                                  <div className="font-medium text-[#2A2A2A]">{reservation.customerName}</div>
                                  <div className="text-gray-500">{reservation.time} · {reservation.numberOfGuests} pers.</div>
                                  <div className="text-gray-400">{reservation.customerEmail}</div>
                                  <button
                                    onClick={() => { onReservationClick?.(reservation); setSelectedId(null); }}
                                    className="flex items-center gap-1 text-[#0066FF] text-xs font-medium hover:underline mt-1"
                                  >
                                    <Eye className="h-3 w-3" />
                                    Voir la réservation
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {onQuickCreate && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onQuickCreate(timeStr)}
                        className="text-[#0066FF] hover:text-[#0052CC] hover:bg-[#0066FF]/5"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        {hasReservations ? `+ Ajouter (${slotReservations.length})` : 'Créer'}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 space-y-2 md:space-y-0">
            <div className="flex items-center gap-3">
              <Calendar className="h-6 w-6 text-[#0066FF]" />
              <div>
                <h2 className="text-xl font-light text-[#2A2A2A] capitalize">
                  {format(currentDay, 'EEEE d MMMM yyyy', { locale: fr })}
                </h2>
                {isToday(currentDay) && (
                  <p className="text-sm text-[#0066FF] font-medium mt-1">Aujourd&apos;hui</p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handlePreviousDay} className="min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 p-2 md:p-1.5">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleToday}>Aujourd&apos;hui</Button>
              <Button variant="outline" size="sm" onClick={handleNextDay} className="min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 p-2 md:p-1.5">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center rounded-lg bg-[#0066FF]/5 p-3">
              <div className="text-2xl font-light text-[#0066FF]">{dayReservations.length}</div>
              <div className="text-xs text-[#666666]">Réservations</div>
            </div>
            <div className="text-center rounded-lg bg-emerald-50 p-3">
              <div className="text-2xl font-light text-emerald-600">{totalGuests}</div>
              <div className="text-xs text-[#666666]">Couverts</div>
            </div>
            <div className="text-center rounded-lg bg-amber-50 p-3">
              <div className="text-2xl font-light text-amber-600">{occupationRate.toFixed(0)}%</div>
              <div className="text-xs text-[#666666]">Occupation</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {restaurant && isClosed && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-lg font-light text-[#2A2A2A]">Restaurant fermé ce jour</p>
              <p className="text-sm text-[#666666] mt-2">
                Le restaurant est fermé le {format(currentDay, 'EEEE', { locale: fr })}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {!restaurant && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-lg font-light text-[#2A2A2A]">Chargement des créneaux...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {restaurant && !isClosed && availableSlots.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-lg font-light text-[#2A2A2A]">Aucun créneau configuré</p>
              <p className="text-sm text-[#666666] mt-2">
                Configurez vos horaires d&apos;ouverture dans les paramètres pour voir les créneaux.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {!isClosed && (
        <>
          {renderTimeline(lunchSlots, 'Midi', <Sun className="h-5 w-5 text-amber-500" />)}
          {renderTimeline(dinnerSlots, 'Soir', <Moon className="h-5 w-5 text-indigo-400" />)}
        </>
      )}
    </div>
  );
};
