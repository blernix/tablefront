import { useMemo } from 'react';
import { Reservation } from '@/types';

export const useRestaurantCapacity = (reservations: Reservation[], date?: string) => {
  // TODO: Get this from restaurant.tablesConfig or settings
  // For now, using a default value
  const maxCapacity = 50;

  const capacity = useMemo(() => {
    let relevantReservations = reservations;

    // Filter by date if provided
    if (date) {
      relevantReservations = reservations.filter(r => {
        const resDate = new Date(r.date).toISOString().split('T')[0];
        return resDate === date && r.status !== 'cancelled';
      });
    } else {
      // Filter out cancelled reservations
      relevantReservations = reservations.filter(r => r.status !== 'cancelled');
    }

    const currentGuests = relevantReservations.reduce(
      (sum, r) => sum + r.numberOfGuests,
      0
    );

    const percentage = maxCapacity > 0 ? (currentGuests / maxCapacity) * 100 : 0;

    return {
      currentGuests,
      maxCapacity,
      percentage: Math.min(percentage, 100),
      isNearCapacity: percentage >= 70,
      isAtCapacity: percentage >= 90,
      reservationCount: relevantReservations.length
    };
  }, [reservations, date, maxCapacity]);

  return capacity;
};

// Helper to calculate capacity for a specific date
export const calculateDailyCapacity = (
  reservations: Reservation[],
  date: string,
  maxCapacity: number = 50
) => {
  const dayReservations = reservations.filter(r => {
    const resDate = new Date(r.date).toISOString().split('T')[0];
    return resDate === date && r.status !== 'cancelled';
  });

  const totalGuests = dayReservations.reduce((sum, r) => sum + r.numberOfGuests, 0);

  return {
    totalGuests,
    maxCapacity,
    reservationCount: dayReservations.length,
    percentage: maxCapacity > 0 ? (totalGuests / maxCapacity) * 100 : 0
  };
};
