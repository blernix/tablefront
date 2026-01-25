'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Reservation } from '@/types';
import { ReservationCard } from './ReservationCard';
import { SwipeableCard } from './SwipeableCard';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { ReservationDetailView } from './ReservationDetailView';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CapacityIndicator } from './CapacityIndicator';
import { calculateDailyCapacity } from '@/hooks/useRestaurantCapacity';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';

interface ReservationsListViewProps {
  reservations: Reservation[];
  onConfirm: (reservation: Reservation) => void;
  onCancel: (reservation: Reservation) => void;
  onEdit?: (reservation: Reservation) => void;
  onDelete?: (reservation: Reservation) => void;
  onStatusChange?: (reservation: Reservation, status: 'pending' | 'confirmed' | 'cancelled' | 'completed') => void;
}

export const ReservationsListView = ({
  reservations,
  onConfirm,
  onCancel,
  onEdit,
  onDelete,
  onStatusChange
}: ReservationsListViewProps) => {
  const router = useRouter();
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  // Group reservations by date
  const reservationsByDate = useMemo(() => {
    const grouped: Record<string, Reservation[]> = {};

    reservations.forEach(reservation => {
      const dateKey = new Date(reservation.date).toISOString().split('T')[0];
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(reservation);
    });

    // Sort reservations within each date by time
    Object.keys(grouped).forEach(dateKey => {
      grouped[dateKey].sort((a, b) => a.time.localeCompare(b.time));
    });

    return grouped;
  }, [reservations]);

  // Sort dates
  const sortedDates = useMemo(() => {
    return Object.keys(reservationsByDate).sort();
  }, [reservationsByDate]);

  const formatDate = (dateKey: string) => {
    const date = new Date(dateKey);
    return format(date, 'EEEE d MMMM yyyy', { locale: fr });
  };

  const handleSwipeRight = (reservation: Reservation) => {
    if (reservation.status !== 'confirmed') {
      onConfirm(reservation);
    }
  };

  const handleSwipeLeft = (reservation: Reservation) => {
    if (reservation.status !== 'cancelled') {
      onCancel(reservation);
    }
  };

  const handleDetailStatusChange = (status: 'pending' | 'confirmed' | 'cancelled' | 'completed') => {
    if (selectedReservation && onStatusChange) {
      onStatusChange(selectedReservation, status);
      setSelectedReservation(null);
    }
  };

  if (sortedDates.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <p className="text-center text-muted-foreground">
            Aucune réservation trouvée
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Mobile View */}
      <div className="md:hidden space-y-6">
        {sortedDates.map(dateKey => {
          const dayReservations = reservationsByDate[dateKey];
          const capacity = calculateDailyCapacity(dayReservations, dateKey);

          return (
            <div key={dateKey} className="space-y-3">
              {/* Date Header */}
              <div className="flex items-center gap-2 px-2">
                <CalendarIcon className="h-5 w-5 text-slate-500" />
                <h3 className="text-lg font-semibold text-slate-900 capitalize">
                  {formatDate(dateKey)}
                </h3>
                <span className="text-sm text-slate-500">
                  ({dayReservations.length})
                </span>
              </div>

              {/* Capacity Indicator */}
              <CapacityIndicator
                currentGuests={capacity.totalGuests}
                maxCapacity={capacity.maxCapacity}
              />

              {/* Reservations */}
              {dayReservations.map(reservation => (
                <SwipeableCard
                  key={reservation._id}
                  onSwipeRight={() => handleSwipeRight(reservation)}
                  onSwipeLeft={() => handleSwipeLeft(reservation)}
                  disabled={reservation.status === 'completed'}
                >
                  <ReservationCard
                    reservation={reservation}
                    variant="compact"
                    onClick={() => setSelectedReservation(reservation)}
                  />
                </SwipeableCard>
              ))}
            </div>
          );
        })}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block space-y-4">
        {sortedDates.map(dateKey => {
          const dayReservations = reservationsByDate[dateKey];
          const capacity = calculateDailyCapacity(dayReservations, dateKey);

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
                      {dayReservations.length} réservation{dayReservations.length > 1 ? 's' : ''}
                    </CardDescription>
                  </div>
                  <CapacityIndicator
                    currentGuests={capacity.totalGuests}
                    maxCapacity={capacity.maxCapacity}
                    className="w-64"
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {dayReservations.map(reservation => (
                  <div
                    key={reservation._id}
                    className="transition-all hover:shadow-md cursor-pointer rounded-lg overflow-hidden"
                    onClick={() => router.push(`/dashboard/reservations/${reservation._id}`)}
                  >
                    <ReservationCard
                      reservation={reservation}
                      variant="full"
                      showActions={true}
                      onEdit={onEdit ? () => {
                        onEdit(reservation);
                      } : undefined}
                      onDelete={onDelete ? () => {
                        onDelete(reservation);
                      } : undefined}
                    />
                  </div>
                ))}
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
            onEdit={onEdit ? () => {
              setSelectedReservation(null);
              onEdit(selectedReservation);
            } : undefined}
            onDelete={onDelete ? () => {
              setSelectedReservation(null);
              onDelete(selectedReservation);
            } : undefined}
            onStatusChange={onStatusChange ? handleDetailStatusChange : undefined}
          />
        )}
      </BottomSheet>
    </>
  );
};
