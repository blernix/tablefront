import { useMemo } from 'react';
import { Reservation, Restaurant } from '@/types';
import { getLocalDateString } from '@/lib/formatters';
import {
  calculateDailyTheoreticalCapacity,
  calculateMaxSimultaneousCapacity,
  calculateServiceOccupation,
  getServiceFromTime
} from '@/lib/capacityCalculations';

/**
 * Calculate maximum capacity from restaurant tables configuration
 */
export const getMaxCapacityFromRestaurant = (restaurant: Restaurant | null | undefined): number => {
  if (!restaurant?.tablesConfig) {
    return 50; // Default fallback
  }

  const { mode, totalTables, averageCapacity, tables } = restaurant.tablesConfig;

  if (mode === 'simple' && totalTables && averageCapacity) {
    return totalTables * averageCapacity;
  }

  if (mode === 'detailed' && tables && tables.length > 0) {
    return tables.reduce((total, table) => total + (table.quantity * table.capacity), 0);
  }

  // Fallback to existing configuration or default
  return 50;
};

/**
 * Advanced daily capacity calculation with service separation
 */
export const calculateDailyCapacityAdvanced = (
  reservations: Reservation[],
  date: string,
  restaurant: Restaurant | null
) => {
  // Get max simultaneous capacity
  const maxSimultaneousCapacity = getMaxCapacityFromRestaurant(restaurant);
  
  // Calculate theoretical capacity based on opening hours
  const theoreticalCapacity = calculateDailyTheoreticalCapacity(restaurant, date);
  
  // Calculate service occupation
  const serviceOccupation = calculateServiceOccupation(reservations, restaurant, date);
  
  // Filter reservations for this date
  const dayReservations = reservations.filter(r => {
    const resDate = getLocalDateString(r.date);
    return resDate === date && r.status !== 'cancelled';
  });

  const totalGuests = dayReservations.reduce((sum, r) => sum + r.numberOfGuests, 0);
  
  // Calculate percentage based on simultaneous capacity (for backward compatibility)
  const simultaneousPercentage = maxSimultaneousCapacity > 0 
    ? (totalGuests / maxSimultaneousCapacity) * 100 
    : 0;
  
  // Calculate daily occupation percentage
  const dailyPercentage = theoreticalCapacity.totalTheoreticalCapacity > 0
    ? (totalGuests / theoreticalCapacity.totalTheoreticalCapacity) * 100
    : 0;
  


  return {
    // Backward compatibility properties
    totalGuests,
    maxCapacity: maxSimultaneousCapacity, // Keep same name for compatibility
    reservationCount: dayReservations.length,
    percentage: Math.min(simultaneousPercentage, 100), // Based on simultaneous capacity
    
    // New advanced properties
    maxSimultaneousCapacity,
    maxDailyCapacity: theoreticalCapacity.totalTheoreticalCapacity,
    dailyOccupationPercentage: Math.min(dailyPercentage, 100),
    serviceCapacities: {
      lunch: {
        maxCapacity: theoreticalCapacity.lunchCapacity,
        currentGuests: serviceOccupation.lunch.guests,
        reservationCount: serviceOccupation.lunch.reservationCount,
        occupiedSlots: serviceOccupation.lunch.occupiedSlots,
        totalSlots: serviceOccupation.lunch.totalSlots
      },
      dinner: {
        maxCapacity: theoreticalCapacity.dinnerCapacity,
        currentGuests: serviceOccupation.dinner.guests,
        reservationCount: serviceOccupation.dinner.reservationCount,
        occupiedSlots: serviceOccupation.dinner.occupiedSlots,
        totalSlots: serviceOccupation.dinner.totalSlots
      }
    },
    theoreticalCapacity,
    serviceOccupation
  };
};

export const useRestaurantCapacity = (
  reservations: Reservation[], 
  date?: string,
  restaurant?: Restaurant | null
) => {
  const maxCapacity = getMaxCapacityFromRestaurant(restaurant);

  const capacity = useMemo(() => {
    let relevantReservations = reservations;

    // Filter by date if provided
    if (date) {
      relevantReservations = reservations.filter(r => {
        const resDate = getLocalDateString(r.date);
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
// Maintains backward compatibility while supporting advanced calculations
export const calculateDailyCapacity = (
  reservations: Reservation[],
  date: string,
  maxCapacityOrRestaurant: number | Restaurant | null = 50,
  restaurant?: Restaurant | null
) => {
  // Determine if we have a restaurant object for advanced calculations
  let restaurantForAdvanced: Restaurant | null = null;
  let maxCapacity = 50;
  
  if (typeof maxCapacityOrRestaurant === 'number') {
    // Simple number mode - use backward compatibility
    maxCapacity = maxCapacityOrRestaurant;
  } else if (maxCapacityOrRestaurant && 'tablesConfig' in maxCapacityOrRestaurant) {
    // Restaurant object provided as third parameter
    restaurantForAdvanced = maxCapacityOrRestaurant;
    maxCapacity = getMaxCapacityFromRestaurant(maxCapacityOrRestaurant);
  }
  
  // If separate restaurant parameter is provided (fourth parameter), use it (overrides)
  if (restaurant) {
    restaurantForAdvanced = restaurant;
    maxCapacity = getMaxCapacityFromRestaurant(restaurant);
  }

  // If we have a restaurant, use advanced calculations
  if (restaurantForAdvanced) {
    const advanced = calculateDailyCapacityAdvanced(reservations, date, restaurantForAdvanced);
    
    // Return backward compatible format with enhanced data
    return {
      totalGuests: advanced.totalGuests,
      maxCapacity: advanced.maxSimultaneousCapacity, // Use simultaneous for compatibility
      reservationCount: advanced.reservationCount,
      percentage: advanced.percentage,
      
      // Include advanced data for components that can use it
      _advanced: {
        maxSimultaneousCapacity: advanced.maxSimultaneousCapacity,
        maxDailyCapacity: advanced.maxDailyCapacity,
        dailyOccupationPercentage: advanced.dailyOccupationPercentage,
        serviceCapacities: advanced.serviceCapacities
      }
    };
  }
  
  // Fallback to simple calculation (backward compatibility)
  const dayReservations = reservations.filter(r => {
    const resDate = getLocalDateString(r.date);
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
