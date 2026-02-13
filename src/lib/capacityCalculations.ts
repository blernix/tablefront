import { Restaurant, Reservation, DaySchedule, TimeSlot } from '@/types';

/**
 * Determines if a time slot belongs to lunch or dinner service
 * @param time - Time string (HH:MM)
 * @returns 'lunch' or 'dinner'
 */
export const getServiceFromTime = (time: string): 'lunch' | 'dinner' => {
  const [hour] = time.split(':').map(Number);
  // Typically lunch is before 5 PM (17:00), dinner after
  return hour < 17 ? 'lunch' : 'dinner';
};

/**
 * Calculate the number of time slots available based on opening hours and reservation duration
 * @param daySchedule - The day's opening hours schedule
 * @param reservationDuration - Duration of a reservation in minutes (default: 90)
 * @returns Array of available time slots with their start times
 */
export const calculateAvailableTimeSlots = (
  daySchedule: DaySchedule,
  reservationDuration: number = 90
): string[] => {
  if (daySchedule.closed || !daySchedule.slots || daySchedule.slots.length === 0) {
    return [];
  }

  const availableSlots: string[] = [];

  daySchedule.slots.forEach(slot => {
    const [startHour, startMin] = slot.start.split(':').map(Number);
    const [endHour, endMin] = slot.end.split(':').map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    let currentMinutes = startMinutes;
    
    while (currentMinutes + reservationDuration <= endMinutes) {
      const hour = Math.floor(currentMinutes / 60);
      const minute = currentMinutes % 60;
      const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      availableSlots.push(timeStr);
      
      // Move to next possible reservation start time (could be same duration or staggered)
      currentMinutes += reservationDuration;
    }
  });

  return availableSlots;
};

/**
 * Calculate maximum theoretical capacity for a day
 * Takes into account:
 * - Maximum simultaneous capacity (tables × seats)
 * - Opening hours and reservation duration
 * - Lunch vs dinner services
 * 
 * @param restaurant - Restaurant object with opening hours and tables config
 * @param date - Date string (YYYY-MM-DD) to check day of week
 * @returns Object with lunch and dinner capacities and total theoretical capacity
 */
export const calculateDailyTheoreticalCapacity = (
  restaurant: Restaurant | null,
  date: string
): {
  lunchCapacity: number;
  dinnerCapacity: number;
  totalTheoreticalCapacity: number;
  maxSimultaneousCapacity: number;
  availableSlots: { lunch: string[]; dinner: string[] };
} => {
  const defaultResult = {
    lunchCapacity: 0,
    dinnerCapacity: 0,
    totalTheoreticalCapacity: 0,
    maxSimultaneousCapacity: 0,
    availableSlots: { lunch: [], dinner: [] }
  };

  if (!restaurant) return defaultResult;

  // Get max simultaneous capacity (tables × seats)
  const maxSimultaneousCapacity = calculateMaxSimultaneousCapacity(restaurant);
  
  // Get day of week (0 = Sunday)
  const dayDate = new Date(date);
  const dayOfWeek = dayDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayName = dayNames[dayOfWeek] as keyof typeof restaurant.openingHours;
  const daySchedule = restaurant.openingHours[dayName];

  if (!daySchedule || daySchedule.closed || !daySchedule.slots || daySchedule.slots.length === 0) {
    return { ...defaultResult, maxSimultaneousCapacity };
  }

  // Get reservation duration (default 90 minutes)
  const reservationDuration = restaurant.reservationConfig?.defaultDuration || 90;
  
  // Calculate available time slots
  const allSlots = calculateAvailableTimeSlots(daySchedule, reservationDuration);

  
  // Separate slots by service
  const lunchSlots = allSlots.filter(slot => getServiceFromTime(slot) === 'lunch');
  const dinnerSlots = allSlots.filter(slot => getServiceFromTime(slot) === 'dinner');

  
  // Calculate theoretical capacity per service
  const lunchCapacity = lunchSlots.length * maxSimultaneousCapacity;
  const dinnerCapacity = dinnerSlots.length * maxSimultaneousCapacity;
  const totalTheoreticalCapacity = lunchCapacity + dinnerCapacity;

  return {
    lunchCapacity,
    dinnerCapacity,
    totalTheoreticalCapacity,
    maxSimultaneousCapacity,
    availableSlots: {
      lunch: lunchSlots,
      dinner: dinnerSlots
    }
  };
};

/**
 * Calculate maximum simultaneous capacity (tables × seats)
 */
export const calculateMaxSimultaneousCapacity = (restaurant: Restaurant): number => {
  if (!restaurant?.tablesConfig) return 50; // Default fallback

  const { mode, totalTables, averageCapacity, tables } = restaurant.tablesConfig;

  if (mode === 'simple' && totalTables && averageCapacity) {
    return totalTables * averageCapacity;
  }

  if (mode === 'detailed' && tables && tables.length > 0) {
    return tables.reduce((total, table) => total + (table.quantity * table.capacity), 0);
  }

  return 50; // Default fallback
};

/**
 * Group reservations by time slot based on reservation duration
 */
export const groupReservationsByTimeSlot = (
  reservations: Reservation[],
  restaurant: Restaurant | null,
  date: string
): Map<string, Reservation[]> => {
  const slotsMap = new Map<string, Reservation[]>();
  
  if (!restaurant) return slotsMap;
  
  // Get reservation duration
  const reservationDuration = restaurant.reservationConfig?.defaultDuration || 90;
  
  // Get all available slots for this day
  const dayDate = new Date(date);
  const dayOfWeek = dayDate.getDay();
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayName = dayNames[dayOfWeek] as keyof typeof restaurant.openingHours;
  const daySchedule = restaurant.openingHours[dayName];
  
  if (!daySchedule || daySchedule.closed || !daySchedule.slots) return slotsMap;
  
  const availableSlots = calculateAvailableTimeSlots(daySchedule, reservationDuration);
  
  // Initialize map with all available slots
  availableSlots.forEach(slot => {
    slotsMap.set(slot, []);
  });
  
  // Assign each reservation to its time slot
  reservations.forEach(reservation => {
    const reservationTime = reservation.time;
    
    // Find the closest slot start time for this reservation
    let assignedSlot: string | null = null;
    let minDiff = Infinity;
    
    for (const slot of availableSlots) {
      const [slotHour, slotMin] = slot.split(':').map(Number);
      const [resHour, resMin] = reservationTime.split(':').map(Number);
      
      const slotMinutes = slotHour * 60 + slotMin;
      const resMinutes = resHour * 60 + resMin;
      const diff = Math.abs(resMinutes - slotMinutes);
      
      // Reservation should start within the slot's reservation duration window
      if (diff < reservationDuration && diff < minDiff) {
        minDiff = diff;
        assignedSlot = slot;
      }
    }
    
    if (assignedSlot) {
      const current = slotsMap.get(assignedSlot) || [];
      slotsMap.set(assignedSlot, [...current, reservation]);
    }
  });
  
  return slotsMap;
};

/**
 * Calculate actual occupation for each service
 */
export const calculateServiceOccupation = (
  reservations: Reservation[],
  restaurant: Restaurant | null,
  date: string
): {
  lunch: { guests: number; reservationCount: number; occupiedSlots: number; totalSlots: number };
  dinner: { guests: number; reservationCount: number; occupiedSlots: number; totalSlots: number };
  overall: { guests: number; reservationCount: number; occupationRate: number };
} => {
  const result = {
    lunch: { guests: 0, reservationCount: 0, occupiedSlots: 0, totalSlots: 0 },
    dinner: { guests: 0, reservationCount: 0, occupiedSlots: 0, totalSlots: 0 },
    overall: { guests: 0, reservationCount: 0, occupationRate: 0 }
  };
  
  if (!restaurant) return result;
  
  // Get theoretical capacity data
  const theoretical = calculateDailyTheoreticalCapacity(restaurant, date);
  
  // Group reservations by service
  const lunchReservations = reservations.filter(r => getServiceFromTime(r.time) === 'lunch');
  const dinnerReservations = reservations.filter(r => getServiceFromTime(r.time) === 'dinner');
  
  // Calculate guests and reservation counts
  result.lunch.guests = lunchReservations.reduce((sum, r) => sum + r.numberOfGuests, 0);
  result.lunch.reservationCount = lunchReservations.length;
  result.lunch.totalSlots = theoretical.availableSlots.lunch.length;
  
  result.dinner.guests = dinnerReservations.reduce((sum, r) => sum + r.numberOfGuests, 0);
  result.dinner.reservationCount = dinnerReservations.length;
  result.dinner.totalSlots = theoretical.availableSlots.dinner.length;
  
  result.overall.guests = result.lunch.guests + result.dinner.guests;
  result.overall.reservationCount = result.lunch.reservationCount + result.dinner.reservationCount;
  
  // Calculate occupied slots using actual slot grouping
  // Multiple reservations can share a slot if they're at similar times
  const slotsMap = groupReservationsByTimeSlot(reservations, restaurant, date);


  let lunchOccupiedSlots = 0;
  let dinnerOccupiedSlots = 0;
  
  for (const [slotStartTime, slotReservations] of slotsMap.entries()) {
    if (slotReservations.length > 0) {
      const service = getServiceFromTime(slotStartTime);
      if (service === 'lunch') {
        lunchOccupiedSlots++;
      } else {
        dinnerOccupiedSlots++;
      }
    }
  }

  
  result.lunch.occupiedSlots = Math.min(lunchOccupiedSlots, result.lunch.totalSlots);
  result.dinner.occupiedSlots = Math.min(dinnerOccupiedSlots, result.dinner.totalSlots);
  
  // Calculate occupation rate based on theoretical capacity (guests / theoretical capacity)
  const totalTheoreticalCapacity = theoretical.totalTheoreticalCapacity;
  result.overall.occupationRate = totalTheoreticalCapacity > 0 
    ? (result.overall.guests / totalTheoreticalCapacity) * 100 
    : 0;
  
  return result;
};

/**
 * Sort reservations by status (pending → confirmed → completed) and then by time
 * Excludes cancelled reservations unless specifically requested
 * @param reservations - Array of reservations to sort
 * @param includeCancelled - Whether to include cancelled reservations (default: false)
 * @returns Sorted array of reservations
 */
export const sortReservations = (
  reservations: Reservation[],
  includeCancelled: boolean = false
): Reservation[] => {
  // Filter out cancelled reservations unless explicitly requested
  const filteredReservations = includeCancelled
    ? reservations
    : reservations.filter(r => r.status !== 'cancelled');

  // Define status priority: pending (1), confirmed (2), completed (3), cancelled (4)
  const statusPriority: Record<string, number> = {
    pending: 1,
    confirmed: 2,
    completed: 3,
    cancelled: 4
  };

  // Sort by status priority first, then by time
  return filteredReservations.sort((a, b) => {
    // Compare by status priority
    const statusDiff = statusPriority[a.status] - statusPriority[b.status];
    if (statusDiff !== 0) return statusDiff;
    
    // If same status, compare by time
    return a.time.localeCompare(b.time);
  });
};