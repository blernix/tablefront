import { useState, useMemo } from 'react';
import { Reservation } from '@/types';
import { isToday, isThisWeek } from 'date-fns';

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
    return reservations.filter(r => {
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
        const resDate = new Date(r.date).toISOString().split('T')[0];
        if (resDate < dateRangeStart) return false;
      }
      if (dateRangeEnd) {
        const resDate = new Date(r.date).toISOString().split('T')[0];
        if (resDate > dateRangeEnd) return false;
      }

      // Guests filter
      if (minGuests && r.numberOfGuests < parseInt(minGuests, 10)) return false;
      if (maxGuests && r.numberOfGuests > parseInt(maxGuests, 10)) return false;

      return true;
    });
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
    suggestions
  };
};
