'use client';

import { Reservation, Restaurant } from '@/types';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus, Sun, Moon, Clock } from 'lucide-react';
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

const statusStyle: Record<string, string> = {
  confirmed: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  pending: 'bg-amber-50 border-amber-200 text-amber-800',
  completed: 'bg-blue-50 border-blue-100 text-blue-700',
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
  const prev = () => onDayChange(subDays(currentDay, 1));
  const next = () => onDayChange(addDays(currentDay, 1));

  const dayOfWeek = currentDay.getDay();
  const availableSlots = restaurant ? getAvailableTimeSlots(restaurant, dayOfWeek) : [];
  const DAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
  const dayName = DAY_KEYS[dayOfWeek];
  const isClosed = restaurant?.openingHours?.[dayName]?.closed || false;

  const currentDayStr = getLocalDateString(currentDay);
  const dayReservations = reservations.filter((r) => {
    return getLocalDateString(r.date) === currentDayStr && r.status !== 'cancelled';
  });

  const advancedCapacity = restaurant ? calculateDailyCapacityAdvanced(reservations, currentDayStr, restaurant) : null;
  const totalGuests = dayReservations.reduce((s, r) => s + r.numberOfGuests, 0);
  const occupationRate = advancedCapacity?.dailyOccupationPercentage ?? (maxCapacity > 0 ? (totalGuests / maxCapacity) * 100 : 0);

  const lunchSlots = availableSlots.filter((s) => parseInt(s.split(':')[0]) < 17);
  const dinnerSlots = availableSlots.filter((s) => parseInt(s.split(':')[0]) >= 17);

  const getReservationsForSlot = (slotTime: string) => {
    const [sh, sm] = slotTime.split(':').map(Number);
    const slotMin = sh * 60 + sm;
    return dayReservations.filter((r) => {
      const [rh, rm] = r.time.split(':').map(Number);
      return Math.abs(rh * 60 + rm - slotMin) <= 15;
    });
  };

  const renderService = (slots: string[], label: string, icon: React.ReactNode) => {
    if (slots.length === 0) return null;

    const svcRes = dayReservations.filter((r) => {
      const h = parseInt(r.time.split(':')[0]);
      return label === 'Midi' ? h < 17 : h >= 17;
    });
    const svcGuests = svcRes.reduce((s, r) => s + r.numberOfGuests, 0);
    let svcCap = maxCapacity / 2;
    if (advancedCapacity) {
      svcCap = label === 'Midi' ? advancedCapacity.serviceCapacities.lunch.maxCapacity : advancedCapacity.serviceCapacities.dinner.maxCapacity;
    }
    const svcOcc = svcCap > 0 ? (svcGuests / svcCap) * 100 : 0;

    return (
      <div className="bg-white rounded-2xl border border-[#E5E5EA] overflow-hidden md:rounded-lg md:border md:border-slate-200 md:shadow-sm">
        {/* Service header */}
        <div className="p-4 md:p-5 border-b border-[#E5E5EA] md:border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {icon}
              <div>
                <h3 className="text-[15px] font-semibold text-[#000000] md:text-lg md:font-light md:text-[#2A2A2A]">{label}</h3>
                <p className="text-[11px] text-[#8E8E93] md:text-sm md:text-[#999999]">{slots[0]} – {slots[slots.length - 1]} · {slots.length} créneau{slots.length > 1 ? 'x' : ''}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-[#8E8E93] md:text-sm md:text-[#666666]">
                {svcRes.length} rés · {svcGuests} pers.
              </div>
              <div className="text-[10px] text-[#8E8E93] mt-0.5 md:text-xs md:text-[#999999]">
                {svcOcc.toFixed(0)}% / {svcCap} cvts
              </div>
            </div>
          </div>
          <div className="w-full bg-[#F2F2F7] rounded-full h-1 mt-3 md:bg-[#F5F5F5] md:h-1.5">
            <div
              className={cn('h-1 rounded-full transition-all md:h-1.5', svcOcc >= 90 ? 'bg-red-500' : svcOcc >= 70 ? 'bg-amber-500' : 'bg-emerald-500')}
              style={{ width: `${Math.min(svcOcc, 100)}%` }}
            />
          </div>
        </div>

        {/* Slots */}
        <div className="divide-y divide-[#E5E5EA] md:divide-slate-50">
          {slots.map((timeStr) => {
            const slotRes = getReservationsForSlot(timeStr);
            return (
              <div key={timeStr} className="flex items-start gap-3 p-3 md:p-3 md:gap-4">
                <div className="flex items-center gap-1.5 pt-1 flex-shrink-0 w-12 md:w-14">
                  <Clock className="h-3 w-3 text-[#8E8E93] md:h-3.5 md:w-3.5 md:text-slate-400" />
                  <span className="text-xs font-mono font-medium text-[#8E8E93] md:text-sm md:text-[#2A2A2A]">{timeStr}</span>
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  {slotRes.map((r) => (
                    <button
                      key={r._id}
                      onClick={() => onReservationClick?.(r)}
                      className={cn(
                        'w-full text-left px-3 py-2 rounded-lg md:rounded-xl border text-xs md:text-sm transition-colors active:ring-1 active:ring-[#0066FF]',
                        statusStyle[r.status] || statusStyle.pending
                      )}
                    >
                      <div className="font-medium truncate">{r.customerName}</div>
                      <div className="text-[10px] opacity-60 md:opacity-75">{r.numberOfGuests} pers.</div>
                    </button>
                  ))}
                  {onQuickCreate && (
                    <button
                      onClick={() => onQuickCreate(timeStr)}
                      className="flex items-center gap-1 text-[11px] text-[#0066FF] font-medium py-1.5 px-2 -mx-2 rounded-lg active:bg-[#0066FF]/5 transition-colors md:text-xs"
                    >
                      <Plus className="h-3.5 w-3.5 md:h-4 md:w-4" />
                      {slotRes.length > 0 ? `Ajouter (${slotRes.length})` : 'Créer'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header card */}
      <div className="bg-white rounded-2xl border border-[#E5E5EA] overflow-hidden md:rounded-lg md:border md:border-slate-200 md:shadow-sm">
        <div className="p-4 md:p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[15px] font-semibold text-[#000000] capitalize md:text-xl md:font-light md:text-[#2A2A2A]">
                {format(currentDay, 'EEEE d MMMM yyyy', { locale: fr })}
              </h2>
              {isToday(currentDay) && (
                <p className="text-[11px] text-[#0066FF] font-medium mt-0.5 md:text-sm">Aujourd&apos;hui</p>
              )}
            </div>
            <div className="flex gap-1.5">
              <Button variant="outline" size="sm" onClick={prev} className="h-9 w-9 md:h-8 md:w-8 p-0"><ChevronLeft className="h-4 w-4" /></Button>
              <Button variant="outline" size="sm" onClick={() => onDayChange(new Date())} className="text-[11px] md:text-xs h-9 md:h-8">Auj.</Button>
              <Button variant="outline" size="sm" onClick={next} className="h-9 w-9 md:h-8 md:w-8 p-0"><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            <div className="text-center rounded-xl bg-[#0066FF]/5 p-2 md:p-3">
              <div className="text-xl font-bold text-[#0066FF] md:text-2xl md:font-light">{dayReservations.length}</div>
              <div className="text-[9px] text-[#8E8E93] md:text-xs">Réservations</div>
            </div>
            <div className="text-center rounded-xl bg-emerald-50 p-2 md:p-3">
              <div className="text-xl font-bold text-emerald-600 md:text-2xl md:font-light">{totalGuests}</div>
              <div className="text-[9px] text-[#8E8E93] md:text-xs">Couverts</div>
            </div>
            <div className="text-center rounded-xl bg-amber-50 p-2 md:p-3">
              <div className="text-xl font-bold text-amber-600 md:text-2xl md:font-light">{occupationRate.toFixed(0)}%</div>
              <div className="text-[9px] text-[#8E8E93] md:text-xs">Occupation</div>
            </div>
          </div>
        </div>
      </div>

      {/* Closed / No restaurant / No slots */}
      {restaurant && isClosed && (
        <div className="bg-white rounded-2xl border border-[#E5E5EA] p-6 text-center md:rounded-lg md:border md:border-slate-200 md:shadow-sm">
          <p className="text-[15px] font-semibold text-[#000000] md:text-lg md:font-light">Restaurant fermé ce jour</p>
          <p className="text-[13px] text-[#8E8E93] mt-1 md:text-sm">Fermé le {format(currentDay, 'EEEE', { locale: fr })}</p>
        </div>
      )}

      {!restaurant && (
        <div className="bg-white rounded-2xl border border-[#E5E5EA] p-6 text-center md:rounded-lg md:border md:border-slate-200 md:shadow-sm">
          <p className="text-[15px] font-semibold text-[#000000] md:text-lg md:font-light">Chargement…</p>
        </div>
      )}

      {restaurant && !isClosed && availableSlots.length === 0 && (
        <div className="bg-white rounded-2xl border border-[#E5E5EA] p-6 text-center md:rounded-lg md:border md:border-slate-200 md:shadow-sm">
          <p className="text-[15px] font-semibold text-[#000000] md:text-lg md:font-light">Aucun créneau</p>
          <p className="text-[13px] text-[#8E8E93] mt-1 md:text-sm">Configurez vos horaires d&apos;ouverture</p>
        </div>
      )}

      {/* Service blocks */}
      {!isClosed && restaurant && (
        <>
          {renderService(lunchSlots, 'Midi', <Sun className="h-5 w-5 text-amber-500" />)}
          {renderService(dinnerSlots, 'Soir', <Moon className="h-5 w-5 text-indigo-400" />)}
        </>
      )}
    </div>
  );
};
