import { useState, useEffect } from 'react';
import { Restaurant } from '@/types';

export const useRestaurantInfo = () => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurantInfo = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');

        const response = await fetch('/api/restaurant', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch restaurant info');
        }

        const data = await response.json();
        setRestaurant(data.restaurant);
      } catch (err) {
        console.error('Error fetching restaurant info:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurantInfo();
  }, []);

  return { restaurant, isLoading, error };
};

// Helper to get available time slots for a specific day
export const getAvailableTimeSlots = (
  restaurant: Restaurant | null,
  dayOfWeek: number // 0 = Sunday, 1 = Monday, etc.
): string[] => {
  if (!restaurant || !restaurant.openingHours) return [];

  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayName = dayNames[dayOfWeek] as keyof typeof restaurant.openingHours;
  const daySchedule = restaurant.openingHours[dayName];

  if (!daySchedule || daySchedule.closed || !daySchedule.slots || daySchedule.slots.length === 0) {
    return [];
  }

  const allSlots: string[] = [];

  // Generate 30-minute slots for each opening period
  daySchedule.slots.forEach(slot => {
    const [startHour, startMin] = slot.start.split(':').map(Number);
    const [endHour, endMin] = slot.end.split(':').map(Number);

    let currentHour = startHour;
    let currentMin = startMin;

    while (
      currentHour < endHour ||
      (currentHour === endHour && currentMin < endMin)
    ) {
      const timeStr = `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`;
      allSlots.push(timeStr);

      // Add 30 minutes
      currentMin += 30;
      if (currentMin >= 60) {
        currentMin = 0;
        currentHour += 1;
      }
    }
  });

  return allSlots;
};

// Helper to check if a time is within opening hours
export const isTimeWithinOpeningHours = (
  restaurant: Restaurant | null,
  dayOfWeek: number,
  time: string
): boolean => {
  if (!restaurant || !restaurant.openingHours) return true; // Allow if no restrictions
  if (!restaurant.reservationConfig?.useOpeningHours) return true; // Allow if not enforced

  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayName = dayNames[dayOfWeek] as keyof typeof restaurant.openingHours;
  const daySchedule = restaurant.openingHours[dayName];

  if (!daySchedule || daySchedule.closed) return false;

  const [inputHour, inputMin] = time.split(':').map(Number);
  const inputMinutes = inputHour * 60 + inputMin;

  return daySchedule.slots.some(slot => {
    const [startHour, startMin] = slot.start.split(':').map(Number);
    const [endHour, endMin] = slot.end.split(':').map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    return inputMinutes >= startMinutes && inputMinutes < endMinutes;
  });
};
