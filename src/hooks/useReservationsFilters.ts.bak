import { useState, useMemo } from 'react';
import { Reservation } from '@/types';
import { isToday, isThisWeek } from 'date-fns';
import { getLocalDateString } from '@/lib/formatters';
import { sortReservations } from '@/lib/capacityCalculations';

export type QuickFilterType = 'today' | 'week' | 'pending' | null;

export const useReservationsFilters = (reservations: Reservation[]) => {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRangeStart, setDateRangeStart] = useState('');
  const [dateRangeEnd, setDateRangeEnd] = useState('');
  const [minGuests, setMinGuests] = useState('');
  const [maxGuests, setMaxGuests] = useState('');
  const [quickFilter, setQuickFilter] = useState<QuickFilterType>(null);

  const filteredReservations = useMemo(() => {
    const filtered = reservations.filter(r => {
      // Status filter
      if (statusFilter && r.status !== statusFilter) return false;

      // Quick filters
      if (quickFilter === 'today') {
        const resDate = new Date(r.date);
        if (!isToday(resDate)) return false;
      }
      if (quickFilter === 'week') {
        const resDate = new Date(r.date);
        if (!isThisWeek(resDate, { weekStartsOn: 1 })) return false; // Week starts on Monday
      }
      if (quickFilter === 'pending' && r.status !== 'pending') return false;

      // Search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        if (
          !r.customerName.toLowerCase().includes(term) &&
          !r.customerEmail.toLowerCase().includes(term) &&
          !r.customerPhone.toLowerCase().includes(term)
        ) {
          return false;
        }
      }

      // Date range filter
      if (dateRangeStart) {
        const resDate = getLocalDateString(r.date);
        if (resDate < dateRangeStart) return false;
      }
      if (dateRangeEnd) {
        const resDate = getLocalDateString(r.date);
        if (resDate > dateRangeEnd) return false;
      }

      // Guests filter
      if (minGuests && r.numberOfGuests < parseInt(minGuests, 10)) return false;
      if (maxGuests && r.numberOfGuests > parseInt(maxGuests, 10)) return false;

      return true;
    });

    // Sort reservations by status (pending → confirmed → completed) then by time
    // Include cancelled reservations only when explicitly filtering by cancelled status
    const includeCancelled = statusFilter === 'cancelled';
    return sortReservations(filtered, includeCancelled);
  }, [
    reservations,
    statusFilter,
    searchTerm,
    dateRangeStart,
    dateRangeEnd,
    minGuests,
    maxGuests,
    quickFilter
  ]);

  const clearAllFilters = () => {
    setStatusFilter('');
    setSearchTerm('');
    setDateRangeStart('');
    setDateRangeEnd('');
    setMinGuests('');
    setMaxGuests('');
    setQuickFilter(null);
  };

  // Generate suggestions from unique customer names
  const suggestions = useMemo(() => {
    return Array.from(new Set(reservations.map(r => r.customerName))).sort();
  }, [reservations]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (statusFilter) count++;
    if (searchTerm) count++;
    if (dateRangeStart) count++;
    if (dateRangeEnd) count++;
    if (minGuests) count++;
    if (maxGuests) count++;
    if (quickFilter) count++;
    return count;
  }, [statusFilter, searchTerm, dateRangeStart, dateRangeEnd, minGuests, maxGuests, quickFilter]);

  return {
    filteredReservations,
    statusFilter,
    setStatusFilter,
    searchTerm,
    setSearchTerm,
    dateRangeStart,
    setDateRangeStart,
    dateRangeEnd,
    setDateRangeEnd,
    minGuests,
    setMinGuests,
    maxGuests,
    setMaxGuests,
    quickFilter,
    setQuickFilter,
    clearAllFilters,
    suggestions,
    activeFilterCount
  };
};
