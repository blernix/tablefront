'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Reservation, Restaurant } from '@/types';
import { ReservationCard } from './ReservationCard';
import { SwipeableCard } from './SwipeableCard';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { ReservationDetailView } from './ReservationDetailView';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CapacityIndicator } from './CapacityIndicator';
import { calculateDailyCapacity } from '@/hooks/useRestaurantCapacity';
import { getServiceFromTime } from '@/lib/capacityCalculations';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarIcon, Sun, Moon, Check, XCircle, CheckCircle } from 'lucide-react';
import { getLocalDateString } from '@/lib/formatters';

interface ReservationsListViewProps {
  reservations: Reservation[];
  onConfirm: (reservation: Reservation) => void;
  onCancel: (reservation: Reservation) => void;
  onComplete?: (reservation: Reservation) => void;
  onEdit?: (reservation: Reservation) => void;
  onDelete?: (reservation: Reservation) => void;
  onStatusChange?: (
    reservation: Reservation,
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  ) => void;
  restaurant?: Restaurant | null;
}

export const ReservationsListView = ({
  reservations,
  onConfirm,
  onCancel,
  onComplete,
  onEdit,
  onDelete,
  onStatusChange,
  restaurant,
}: ReservationsListViewProps) => {
  const router = useRouter();
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  const reservationsByDateAndService = useMemo(() => {
    const grouped: Record<string, { lunch: Reservation[]; dinner: Reservation[] }> = {};
    reservations.forEach((reservation) => {
      const dateKey = getLocalDateString(reservation.date);
      if (!grouped[dateKey]) {
        grouped[dateKey] = { lunch: [], dinner: [] };
      }
      const service = getServiceFromTime(reservation.time);
      grouped[dateKey][service].push(reservation);
    });
    return grouped;
  }, [reservations]);

  const sortedDates = useMemo(() => {
    return Object.keys(reservationsByDateAndService).sort();
  }, [reservationsByDateAndService]);

  const formatDateHeader = (dateKey: string) => {
    const date = new Date(dateKey);
    const now = new Date();
    const todayStr = getLocalDateString(now);
    if (dateKey === todayStr) return "Aujourd'hui";
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (dateKey === getLocalDateString(tomorrow)) return 'Demain';
    return format(date, 'EEEE d MMMM yyyy', { locale: fr });
  };

  const handleDetailStatusChange = (
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  ) => {
    if (selectedReservation && onStatusChange) {
      onStatusChange(selectedReservation, status);
      setSelectedReservation(null);
    }
  };

  const getSwipeConfig = (reservation: Reservation) => {
    switch (reservation.status) {
      case 'pending':
        if (!onConfirm || !onCancel) return { disabled: true, rightAction: null, leftAction: null, sameActionOnBothSides: false };
        return {
          disabled: false,
          rightAction: { label: 'Confirmer', icon: <Check className="h-5 w-5" />, color: 'text-emerald-500', handler: () => onConfirm(reservation) },
          leftAction: { label: 'Annuler', icon: <XCircle className="h-5 w-5" />, color: 'text-red-500', handler: () => onCancel(reservation) },
          sameActionOnBothSides: false,
        };
      case 'confirmed':
        if (!onComplete) return { disabled: true, rightAction: null, leftAction: null, sameActionOnBothSides: false };
        return {
          disabled: false,
          rightAction: { label: 'Terminer', icon: <CheckCircle className="h-5 w-5" />, color: 'text-[#0066FF]', handler: () => onComplete(reservation) },
          leftAction: { label: 'Terminer', icon: <CheckCircle className="h-5 w-5" />, color: 'text-[#0066FF]', handler: () => onComplete(reservation) },
          sameActionOnBothSides: true,
        };
      default:
        return { disabled: true, rightAction: null, leftAction: null, sameActionOnBothSides: false };
    }
  };

  if (sortedDates.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <p className="text-center text-[#666666] font-light">Aucune réservation trouvée</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Mobile View */}
      <div className="md:hidden space-y-6">
        {sortedDates.map((dateKey) => {
          const services = reservationsByDateAndService[dateKey];
          const allDayReservations = [...services.lunch, ...services.dinner];
          const capacity = calculateDailyCapacity(allDayReservations, dateKey, restaurant);

          return (
            <div key={dateKey} className="space-y-3">
              <div className="relative">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-[#0066FF]" />
                <div className="flex items-center gap-2 px-2 pt-2 pb-1">
                  <CalendarIcon className="h-4 w-4 text-[#0066FF]" />
                  <h3 className="text-base font-light text-[#2A2A2A] capitalize">
                    {formatDateHeader(dateKey)}
                  </h3>
                  <span className="text-xs text-[#999999]">({allDayReservations.length})</span>
                </div>
              </div>

              <CapacityIndicator
                currentGuests={capacity.totalGuests}
                maxCapacity={capacity._advanced?.maxDailyCapacity || capacity.maxCapacity}
                maxDailyCapacity={capacity._advanced?.maxDailyCapacity}
                simultaneousCapacity={capacity._advanced?.maxSimultaneousCapacity}
                serviceCapacities={capacity._advanced?.serviceCapacities}
              />

              {services.lunch.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-2">
                    <Sun className="h-4 w-4 text-amber-500" />
                    <h4 className="text-sm font-medium text-[#666666]">Midi</h4>
                    <span className="text-xs text-[#999999]">{services.lunch.length} résa{services.lunch.length > 1 ? 's' : ''}</span>
                  </div>
                  {services.lunch.map((reservation) => {
                    const cfg = getSwipeConfig(reservation);
                    return (
                      <SwipeableCard
                        key={reservation._id}
                        onSwipeRight={cfg.rightAction?.handler}
                        onSwipeLeft={cfg.sameActionOnBothSides ? cfg.rightAction?.handler : cfg.leftAction?.handler}
                        disabled={cfg.disabled}
                        rightLabel={cfg.rightAction?.label}
                        leftLabel={cfg.leftAction?.label}
                        rightIcon={cfg.rightAction?.icon}
                        leftIcon={cfg.leftAction?.icon}
                        rightColor={cfg.rightAction?.color}
                        leftColor={cfg.leftAction?.color}
                        sameActionOnBothSides={cfg.sameActionOnBothSides}
                      >
                        <ReservationCard
                          reservation={reservation}
                          variant="compact"
                          onClick={() => setSelectedReservation(reservation)}
                          onConfirm={() => onConfirm(reservation)}
                          onCancel={() => onCancel(reservation)}
                          onComplete={onComplete ? () => onComplete(reservation) : undefined}
                          onEdit={onEdit ? () => onEdit(reservation) : undefined}
                          onDelete={onDelete ? () => onDelete(reservation) : undefined}
                        />
                      </SwipeableCard>
                    );
                  })}
                </div>
              )}

              {services.dinner.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-2">
                    <Moon className="h-4 w-4 text-indigo-400" />
                    <h4 className="text-sm font-medium text-[#666666]">Soir</h4>
                    <span className="text-xs text-[#999999]">{services.dinner.length} résa{services.dinner.length > 1 ? 's' : ''}</span>
                  </div>
                  {services.dinner.map((reservation) => {
                    const cfg = getSwipeConfig(reservation);
                    return (
                      <SwipeableCard
                        key={reservation._id}
                        onSwipeRight={cfg.rightAction?.handler}
                        onSwipeLeft={cfg.sameActionOnBothSides ? cfg.rightAction?.handler : cfg.leftAction?.handler}
                        disabled={cfg.disabled}
                        rightLabel={cfg.rightAction?.label}
                        leftLabel={cfg.leftAction?.label}
                        rightIcon={cfg.rightAction?.icon}
                        leftIcon={cfg.leftAction?.icon}
                        rightColor={cfg.rightAction?.color}
                        leftColor={cfg.leftAction?.color}
                        sameActionOnBothSides={cfg.sameActionOnBothSides}
                      >
                        <ReservationCard
                          reservation={reservation}
                          variant="compact"
                          onClick={() => setSelectedReservation(reservation)}
                          onConfirm={() => onConfirm(reservation)}
                          onCancel={() => onCancel(reservation)}
                          onComplete={onComplete ? () => onComplete(reservation) : undefined}
                          onEdit={onEdit ? () => onEdit(reservation) : undefined}
                          onDelete={onDelete ? () => onDelete(reservation) : undefined}
                        />
                      </SwipeableCard>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block space-y-6">
        {sortedDates.map((dateKey) => {
          const services = reservationsByDateAndService[dateKey];
          const allDayReservations = [...services.lunch, ...services.dinner];
          const capacity = calculateDailyCapacity(allDayReservations, dateKey, restaurant);

          return (
            <Card key={dateKey} className="overflow-hidden">
              {/* Blue accent bar + date header */}
              <div className="relative">
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#0066FF]" />
                <CardHeader className="pt-5 pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2.5 capitalize text-xl font-light">
                        <CalendarIcon className="h-5 w-5 text-[#0066FF]" />
                        {formatDateHeader(dateKey)}
                      </CardTitle>
                      <p className="text-sm text-[#999999] font-light mt-1">
                        {allDayReservations.length} réservation{allDayReservations.length > 1 ? 's' : ''} · {services.lunch.length} midi, {services.dinner.length} soir
                      </p>
                    </div>
                    <CapacityIndicator
                      currentGuests={capacity.totalGuests}
                      maxCapacity={capacity._advanced?.maxDailyCapacity || capacity.maxCapacity}
                      maxDailyCapacity={capacity._advanced?.maxDailyCapacity}
                      simultaneousCapacity={capacity._advanced?.maxSimultaneousCapacity}
                      serviceCapacities={capacity._advanced?.serviceCapacities}
                      className="w-56"
                    />
                  </div>
                </CardHeader>
              </div>
              <CardContent className="pb-6">
                {services.lunch.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50">
                        <Sun className="h-4 w-4 text-amber-500" />
                      </div>
                      <h4 className="text-sm font-medium text-[#666666] uppercase tracking-[0.1em]">Midi</h4>
                      <span className="text-xs text-[#999999]">{services.lunch.length} résa{services.lunch.length > 1 ? 's' : ''}</span>
                    </div>
                    <div className="space-y-2">
                      {services.lunch.map((reservation) => (
                        <div
                          key={reservation._id}
                          className="cursor-pointer"
                          onClick={() => router.push(`/dashboard/reservations/${reservation._id}`)}
                        >
                          <ReservationCard
                            reservation={reservation}
                            variant="full"
                            showActions={true}
                            onConfirm={() => onConfirm(reservation)}
                            onCancel={() => onCancel(reservation)}
                            onComplete={onComplete ? () => onComplete(reservation) : undefined}
                            onEdit={onEdit ? () => onEdit(reservation) : undefined}
                            onDelete={onDelete ? () => onDelete(reservation) : undefined}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {services.dinner.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50">
                        <Moon className="h-4 w-4 text-indigo-400" />
                      </div>
                      <h4 className="text-sm font-medium text-[#666666] uppercase tracking-[0.1em]">Soir</h4>
                      <span className="text-xs text-[#999999]">{services.dinner.length} résa{services.dinner.length > 1 ? 's' : ''}</span>
                    </div>
                    <div className="space-y-2">
                      {services.dinner.map((reservation) => (
                        <div
                          key={reservation._id}
                          className="cursor-pointer"
                          onClick={() => router.push(`/dashboard/reservations/${reservation._id}`)}
                        >
                          <ReservationCard
                            reservation={reservation}
                            variant="full"
                            showActions={true}
                            onConfirm={() => onConfirm(reservation)}
                            onCancel={() => onCancel(reservation)}
                            onComplete={onComplete ? () => onComplete(reservation) : undefined}
                            onEdit={onEdit ? () => onEdit(reservation) : undefined}
                            onDelete={onDelete ? () => onDelete(reservation) : undefined}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <BottomSheet
        isOpen={!!selectedReservation}
        onClose={() => setSelectedReservation(null)}
        title="Détails de la réservation"
      >
        {selectedReservation && (
          <ReservationDetailView
            reservation={selectedReservation}
            onEdit={onEdit ? () => { setSelectedReservation(null); onEdit(selectedReservation); } : undefined}
            onDelete={onDelete ? () => { setSelectedReservation(null); onDelete(selectedReservation); } : undefined}
            onStatusChange={onStatusChange ? handleDetailStatusChange : undefined}
          />
        )}
      </BottomSheet>
    </>
  );
};
