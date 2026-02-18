'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Reservation, Restaurant } from '@/types';
import { ReservationCard } from './ReservationCard';
import { SwipeableCard } from './SwipeableCard';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { ReservationDetailView } from './ReservationDetailView';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CapacityIndicator } from './CapacityIndicator';
import { calculateDailyCapacity } from '@/hooks/useRestaurantCapacity';
import { getServiceFromTime } from '@/lib/capacityCalculations';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarIcon, Check, XCircle, CheckCircle } from 'lucide-react';
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

  // Group reservations by date and service
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

    // Reservations are already sorted by status (pending → confirmed → completed) then by time
    // via the useReservationsFilters hook, so we maintain that order

    return grouped;
  }, [reservations]);

  // Sort dates
  const sortedDates = useMemo(() => {
    return Object.keys(reservationsByDateAndService).sort();
  }, [reservationsByDateAndService]);

  const formatDate = (dateKey: string) => {
    const date = new Date(dateKey);
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
        // Vérifier que les handlers existent
        if (!onConfirm || !onCancel) {
          return {
            disabled: true,
            rightAction: null,
            leftAction: null,
            sameActionOnBothSides: false,
          };
        }
        return {
          disabled: false,
          rightAction: {
            label: 'Confirmer',
            icon: <Check className="h-5 w-5" />,
            color: 'text-green-600',
            handler: () => onConfirm(reservation),
          },
          leftAction: {
            label: 'Annuler',
            icon: <XCircle className="h-5 w-5" />,
            color: 'text-red-600',
            handler: () => onCancel(reservation),
          },
          sameActionOnBothSides: false,
        };
      case 'confirmed':
        // Vérifier que le handler existe
        if (!onComplete) {
          return {
            disabled: true,
            rightAction: null,
            leftAction: null,
            sameActionOnBothSides: false,
          };
        }
        return {
          disabled: false,
          rightAction: {
            label: 'Terminer',
            icon: <CheckCircle className="h-5 w-5" />,
            color: 'text-blue-600',
            handler: () => onComplete(reservation),
          },
          leftAction: {
            label: 'Terminer',
            icon: <CheckCircle className="h-5 w-5" />,
            color: 'text-blue-600',
            handler: () => onComplete(reservation),
          },
          sameActionOnBothSides: true,
        };
      case 'cancelled':
      case 'completed':
        return {
          disabled: true,
          rightAction: null,
          leftAction: null,
          sameActionOnBothSides: false,
        };
      default:
        return {
          disabled: true,
          rightAction: null,
          leftAction: null,
          sameActionOnBothSides: false,
        };
    }
  };

  if (sortedDates.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <p className="text-center text-muted-foreground">Aucune réservation trouvée</p>
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
              {/* Date Header */}
              <div className="flex items-center gap-2 px-2">
                <CalendarIcon className="h-5 w-5 text-slate-500" />
                <h3 className="text-lg font-semibold text-slate-900 capitalize">
                  {formatDate(dateKey)}
                </h3>
                <span className="text-sm text-slate-500">({allDayReservations.length})</span>
              </div>

              {/* Capacity Indicator */}
              <CapacityIndicator
                currentGuests={capacity.totalGuests}
                maxCapacity={capacity._advanced?.maxDailyCapacity || capacity.maxCapacity}
                maxDailyCapacity={capacity._advanced?.maxDailyCapacity}
                simultaneousCapacity={capacity._advanced?.maxSimultaneousCapacity}
                serviceCapacities={capacity._advanced?.serviceCapacities}
              />

              {/* Service du midi */}
              {services.lunch.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-2">
                    <h4 className="text-md font-medium text-slate-700">Service du midi</h4>
                    <span className="text-sm text-slate-500">({services.lunch.length})</span>
                  </div>
                  {services.lunch.map((reservation) => {
                    const config = getSwipeConfig(reservation);
                    return (
                      <SwipeableCard
                        key={reservation._id}
                        onSwipeRight={config.rightAction?.handler}
                        onSwipeLeft={
                          config.sameActionOnBothSides
                            ? config.rightAction?.handler
                            : config.leftAction?.handler
                        }
                        disabled={config.disabled}
                        rightLabel={config.rightAction?.label}
                        leftLabel={config.leftAction?.label}
                        rightIcon={config.rightAction?.icon}
                        leftIcon={config.leftAction?.icon}
                        rightColor={config.rightAction?.color}
                        leftColor={config.leftAction?.color}
                        sameActionOnBothSides={config.sameActionOnBothSides}
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

              {/* Service du soir */}
              {services.dinner.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-2">
                    <h4 className="text-md font-medium text-slate-700">Service du soir</h4>
                    <span className="text-sm text-slate-500">({services.dinner.length})</span>
                  </div>
                  {services.dinner.map((reservation) => {
                    const config = getSwipeConfig(reservation);
                    return (
                      <SwipeableCard
                        key={reservation._id}
                        onSwipeRight={config.rightAction?.handler}
                        onSwipeLeft={
                          config.sameActionOnBothSides
                            ? config.rightAction?.handler
                            : config.leftAction?.handler
                        }
                        disabled={config.disabled}
                        rightLabel={config.rightAction?.label}
                        leftLabel={config.leftAction?.label}
                        rightIcon={config.rightAction?.icon}
                        leftIcon={config.leftAction?.icon}
                        rightColor={config.rightAction?.color}
                        leftColor={config.leftAction?.color}
                        sameActionOnBothSides={config.sameActionOnBothSides}
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
      <div className="hidden md:block space-y-4">
        {sortedDates.map((dateKey) => {
          const services = reservationsByDateAndService[dateKey];
          const allDayReservations = [...services.lunch, ...services.dinner];
          const capacity = calculateDailyCapacity(allDayReservations, dateKey, restaurant);

          return (
            <Card key={dateKey}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 capitalize">
                      <CalendarIcon className="h-5 w-5" />
                      {formatDate(dateKey)}
                    </CardTitle>
                    <CardDescription>
                      {allDayReservations.length} réservation
                      {allDayReservations.length > 1 ? 's' : ''} (midi: {services.lunch.length},
                      soir: {services.dinner.length})
                    </CardDescription>
                  </div>
                  <CapacityIndicator
                    currentGuests={capacity.totalGuests}
                    maxCapacity={capacity._advanced?.maxDailyCapacity || capacity.maxCapacity}
                    maxDailyCapacity={capacity._advanced?.maxDailyCapacity}
                    simultaneousCapacity={capacity._advanced?.maxSimultaneousCapacity}
                    serviceCapacities={capacity._advanced?.serviceCapacities}
                    className="w-64"
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Service du midi */}
                {services.lunch.length > 0 && (
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-semibold text-slate-900">Service du midi</h4>
                      <span className="text-sm text-slate-500">({services.lunch.length})</span>
                    </div>
                    <div className="space-y-3">
                      {services.lunch.map((reservation) => (
                        <div
                          key={reservation._id}
                          className="transition-all hover:shadow-md cursor-pointer rounded-lg overflow-hidden"
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

                {/* Service du soir */}
                {services.dinner.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-semibold text-slate-900">Service du soir</h4>
                      <span className="text-sm text-slate-500">({services.dinner.length})</span>
                    </div>
                    <div className="space-y-3">
                      {services.dinner.map((reservation) => (
                        <div
                          key={reservation._id}
                          className="transition-all hover:shadow-md cursor-pointer rounded-lg overflow-hidden"
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

      {/* Mobile BottomSheet for Details */}
      <BottomSheet
        isOpen={!!selectedReservation}
        onClose={() => setSelectedReservation(null)}
        title="Détails de la réservation"
      >
        {selectedReservation && (
          <ReservationDetailView
            reservation={selectedReservation}
            onEdit={
              onEdit
                ? () => {
                    setSelectedReservation(null);
                    onEdit(selectedReservation);
                  }
                : undefined
            }
            onDelete={
              onDelete
                ? () => {
                    setSelectedReservation(null);
                    onDelete(selectedReservation);
                  }
                : undefined
            }
            onStatusChange={onStatusChange ? handleDetailStatusChange : undefined}
          />
        )}
      </BottomSheet>
    </>
  );
};
