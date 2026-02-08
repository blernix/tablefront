'use client';

import { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  startOfYear, 
  endOfYear,
  addMonths,
  addWeeks,
  addYears,
  subMonths,
  subWeeks,
  subYears 
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { apiClient } from '@/lib/api';
import { formatDate, getLocalDateString } from '@/lib/formatters';
import { Reservation, Restaurant } from '@/types';
import { useRealtimeReservationsManager } from '@/hooks/useRealtimeReservations';
import { useReservationsFilters } from '@/hooks/useReservationsFilters';
import { useRestaurantCapacity, getMaxCapacityFromRestaurant } from '@/hooks/useRestaurantCapacity';
import { useRestaurantStore, isTimeWithinOpeningHours, getAvailableTimeSlots } from '@/store/restaurantStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Ban, List, Calendar as CalendarIcon, X, Filter, Search, Users, Check, ArrowLeft, MoreVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import CalendarViewImproved from '@/components/reservations/CalendarViewImproved';
import { CalendarStats } from '@/components/reservations/CalendarStats';
import { ReservationsStats } from '@/components/reservations/ReservationsStats';
import { WeekView } from '@/components/reservations/WeekView';
import { DayView } from '@/components/reservations/DayView';
import { ReservationsListView } from '@/components/reservations/ReservationsListView';
import { QuickFilters, QuickFilter } from '@/components/reservations/QuickFilters';
import { CapacityIndicator } from '@/components/reservations/CapacityIndicator';
import { SearchWithSuggestions } from '@/components/reservations/SearchWithSuggestions';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const createFormSchema = (restaurant: Restaurant | null) => z.object({
  customerName: z.string().min(1, 'Le nom est requis'),
  customerEmail: z.string().email('Email invalide'),
  customerPhone: z.string().min(1, 'Le téléphone est requis'),
  date: z.string().min(1, 'La date est requise'),
  time: z.string().min(1, "L'heure est requise"),
  numberOfGuests: z.string().min(1, 'Le nombre de personnes est requis'),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
  notes: z.string().optional(),
}).refine((data) => {
  // Skip validation if no restaurant data or if config doesn't enforce opening hours
  if (!restaurant?.openingHours || !restaurant?.reservationConfig?.useOpeningHours) {
    return true;
  }

  // Get day of week from selected date
  const selectedDate = new Date(data.date);
  const dayOfWeek = selectedDate.getDay();

  // Validate time against opening hours
  return isTimeWithinOpeningHours(restaurant, dayOfWeek, data.time);
}, {
  message: "L'heure sélectionnée n'est pas dans les horaires d'ouverture du restaurant",
  path: ['time'],
});

type FormData = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  numberOfGuests: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
};

const statusLabels = {
  pending: { label: 'En attente', variant: 'warning' as const },
  confirmed: { label: 'Confirmée', variant: 'success' as const },
  cancelled: { label: 'Annulée', variant: 'danger' as const },
  completed: { label: 'Terminée', variant: 'default' as const },
};

export default function ReservationsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  // Pagination for past reservations
  const [pastPeriodType, setPastPeriodType] = useState<'month' | 'week' | 'year'>('month');
  const [pastPeriodDate, setPastPeriodDate] = useState<Date>(() => {
    const date = new Date();
    date.setDate(date.getDate() - 1); // Start with yesterday as reference
    return date;
  });

  // Calculate date filters based on active tab (memoized to prevent unnecessary re-renders)
  const dateParams = useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    if (activeTab === 'upcoming') {
      return { startDate: todayStr }; // Show reservations from today onwards
    } else {
      // Past reservations with pagination
      let startDate: Date;
      let endDate: Date;

      switch (pastPeriodType) {
        case 'week':
          startDate = startOfWeek(pastPeriodDate, { weekStartsOn: 1 });
          endDate = endOfWeek(pastPeriodDate, { weekStartsOn: 1 });
          break;
        case 'year':
          startDate = startOfYear(pastPeriodDate);
          endDate = endOfYear(pastPeriodDate);
          break;
        case 'month':
        default:
          startDate = startOfMonth(pastPeriodDate);
          endDate = endOfMonth(pastPeriodDate);
          break;
      }

      // Format dates as YYYY-MM-DD
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];

      return { startDate: startDateStr, endDate: endDateStr };
    }
  }, [activeTab, pastPeriodType, pastPeriodDate]);

  const { reservations, isConnected, refreshReservations } = useRealtimeReservationsManager(dateParams);

  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [calendarViewType, setCalendarViewType] = useState<'month' | 'week' | 'day'>('week');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [currentDay, setCurrentDay] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showMobileActions, setShowMobileActions] = useState(false);
  const [blockedDays, setBlockedDays] = useState<any[]>([]);
  const [upcomingCount, setUpcomingCount] = useState<number>(0);
  const [pastCount, setPastCount] = useState<number>(0);



  // Email confirmation modal
  const [emailConfirmationModal, setEmailConfirmationModal] = useState<{
    show: boolean;
    action: 'create' | 'update' | 'status' | 'delete';
    reservation?: Reservation;
    status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    formData?: FormData;
    callback?: () => Promise<void>;
  }>({
    show: false,
    action: 'create',
  });
  const [sendEmail, setSendEmail] = useState(true);

  // Use our new hooks
  const filters = useReservationsFilters(reservations);
  const { restaurant, isLoading: isLoadingRestaurant } = useRestaurantStore();
  const capacity = useRestaurantCapacity(filters.filteredReservations, undefined, restaurant);

  const form = useForm<FormData>({
    resolver: zodResolver(createFormSchema(restaurant)),
    defaultValues: {
      status: 'pending',
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = form;

  // Watch selected date to show available times
  const selectedFormDate = watch('date');

  // Update form resolver when restaurant data changes
  useEffect(() => {
    form.clearErrors();
  }, [restaurant, form]);

  // Load initial data and counts
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        await refreshReservations();

        // Load blocked days (if API exists)
        try {
          const response = await fetch('/api/blocked-days', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setBlockedDays(data.blockedDays || []);
          }
        } catch (err) {
          console.error('Error loading blocked days:', err);
          // Not critical, continue without blocked days
        }
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update tab counts whenever reservations change
  useEffect(() => {
    const updateCounts = async () => {
      const today = new Date();
    const todayStr = getLocalDateString(today);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = getLocalDateString(yesterday);

      try {
        const [upcomingRes, pastRes] = await Promise.all([
          apiClient.getReservations({ startDate: todayStr }),
          apiClient.getReservations({ endDate: yesterdayStr }),
        ]);
        setUpcomingCount(upcomingRes.reservations.length);
        setPastCount(pastRes.reservations.length);
      } catch (err) {
        console.error('Error updating reservation counts:', err);
      }
    };

    updateCounts();
  }, [reservations]);

  // Quick filters configuration
  const quickFilters: QuickFilter[] = [
    {
      id: 'today',
      label: "Aujourd'hui",
      action: () => filters.setQuickFilter(filters.quickFilter === 'today' ? null : 'today'),
      isActive: filters.quickFilter === 'today',
    },
    {
      id: 'week',
      label: 'Cette semaine',
      action: () => filters.setQuickFilter(filters.quickFilter === 'week' ? null : 'week'),
      isActive: filters.quickFilter === 'week',
    },
    {
      id: 'pending',
      label: 'À confirmer',
      action: () => filters.setQuickFilter(filters.quickFilter === 'pending' ? null : 'pending'),
      isActive: filters.quickFilter === 'pending',
    },
  ];

  const handleStartCreate = () => {
    setEditingReservation(null);
    reset({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      date: '',
      time: '',
      numberOfGuests: '',
      status: 'pending',
      notes: '',
    });
    setShowForm(true);
  };

  const handleStartEdit = (reservation: Reservation) => {
    setEditingReservation(reservation);
    reset({
      customerName: reservation.customerName,
      customerEmail: reservation.customerEmail,
      customerPhone: reservation.customerPhone,
      date: reservation.date.split('T')[0],
      time: reservation.time,
      numberOfGuests: reservation.numberOfGuests.toString(),
      status: reservation.status,
      notes: reservation.notes || '',
    });
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingReservation(null);
    reset();
  };

  const openEmailConfirmationModal = (
    action: 'create' | 'update' | 'status' | 'delete',
    reservation?: Reservation,
    status?: 'pending' | 'confirmed' | 'cancelled' | 'completed',
    formData?: FormData,
    callback?: () => Promise<void>
  ) => {
    setEmailConfirmationModal({
      show: true,
      action,
      reservation,
      status,
      formData,
      callback,
    });
    setSendEmail(true);
  };

  const closeEmailConfirmationModal = () => {
    setEmailConfirmationModal({
      show: false,
      action: 'create',
    });
    setSendEmail(true);
  };

  const confirmActionWithEmail = async () => {
    const { action, reservation, status, formData, callback } = emailConfirmationModal;

    try {
      setIsSaving(true);

      switch (action) {
        case 'status':
          if (reservation && status) {
            await apiClient.updateReservation(reservation._id, {
              status,
              sendEmail,
            });
            const statusLabelsText = {
              confirmed: 'confirmée',
              cancelled: 'annulée',
              completed: 'terminée',
              pending: 'mise à jour',
            };
            toast.success(
              `Réservation de ${reservation.customerName} ${statusLabelsText[status]}${sendEmail ? ' - Email envoyé' : ''}`
            );
          }
          break;
        case 'update':
          if (reservation && formData) {
            const numberOfGuests = parseInt(formData.numberOfGuests, 10);
            const reservationData = {
              customerName: formData.customerName,
              customerEmail: formData.customerEmail,
              customerPhone: formData.customerPhone,
              date: formData.date,
              time: formData.time,
              numberOfGuests,
              status: formData.status,
              notes: formData.notes || '',
              sendEmail,
            };
            await apiClient.updateReservation(reservation._id, reservationData);
            toast.success(`Réservation modifiée${sendEmail ? ' - Email envoyé' : ''}`);
          }
          break;
        case 'create':
          if (formData) {
            const numberOfGuests = parseInt(formData.numberOfGuests, 10);
            const reservationData = {
              customerName: formData.customerName,
              customerEmail: formData.customerEmail,
              customerPhone: formData.customerPhone,
              date: formData.date,
              time: formData.time,
              numberOfGuests,
              status: formData.status,
              notes: formData.notes || '',
              sendEmail,
            };
            await apiClient.createReservation(reservationData);
            toast.success(`Réservation créée${sendEmail ? ' - Email envoyé' : ''}`);
          }
          break;
        case 'delete':
          if (reservation) {
            await apiClient.deleteReservation(reservation._id);
            toast.success('Réservation supprimée avec succès');
          }
          break;
      }

      if (callback) {
        await callback();
      }

      refreshReservations();
      closeEmailConfirmationModal();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de l'opération");
    } finally {
      setIsSaving(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    const numberOfGuests = parseInt(data.numberOfGuests, 10);
    if (isNaN(numberOfGuests) || numberOfGuests < 1) {
      toast.error('Le nombre de personnes doit être au moins 1');
      return;
    }

    const action = editingReservation ? 'update' : 'create';
    openEmailConfirmationModal(
      action,
      editingReservation || undefined,
      undefined,
      data,
      async () => {
        handleCancelForm();
      }
    );
  };

  const handleConfirm = (reservation: Reservation) => {
    openEmailConfirmationModal('status', reservation, 'confirmed');
  };

  const handleCancel = (reservation: Reservation) => {
    openEmailConfirmationModal('status', reservation, 'cancelled');
  };

  const handleComplete = (reservation: Reservation) => {
    openEmailConfirmationModal('status', reservation, 'completed');
  };

  const handleDelete = (reservation: Reservation) => {
    if (
      confirm(`Êtes-vous sûr de vouloir supprimer la réservation de ${reservation.customerName} ?`)
    ) {
      openEmailConfirmationModal('delete', reservation);
    }
  };

  const handleStatusChange = (
    reservation: Reservation,
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  ) => {
    openEmailConfirmationModal('status', reservation, status);
  };

  // Past reservations pagination functions
  const formatCurrentPeriod = () => {
    switch (pastPeriodType) {
      case 'week':
        const weekStart = startOfWeek(pastPeriodDate, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(pastPeriodDate, { weekStartsOn: 1 });
        return `Semaine du ${format(weekStart, 'd MMM yyyy', { locale: fr })} au ${format(weekEnd, 'd MMM yyyy', { locale: fr })}`;
      case 'year':
        return format(pastPeriodDate, 'yyyy', { locale: fr });
      case 'month':
      default:
        return format(pastPeriodDate, 'MMMM yyyy', { locale: fr });
    }
  };

  const goToPreviousPeriod = () => {
    switch (pastPeriodType) {
      case 'week':
        setPastPeriodDate(subWeeks(pastPeriodDate, 1));
        break;
      case 'year':
        setPastPeriodDate(subYears(pastPeriodDate, 1));
        break;
      case 'month':
      default:
        setPastPeriodDate(subMonths(pastPeriodDate, 1));
        break;
    }
  };

  const goToNextPeriod = () => {
    switch (pastPeriodType) {
      case 'week':
        setPastPeriodDate(addWeeks(pastPeriodDate, 1));
        break;
      case 'year':
        setPastPeriodDate(addYears(pastPeriodDate, 1));
        break;
      case 'month':
      default:
        setPastPeriodDate(addMonths(pastPeriodDate, 1));
        break;
    }
  };

  const resetToCurrentPeriod = () => {
    const date = new Date();
    date.setDate(date.getDate() - 1); // Yesterday as reference for past
    setPastPeriodDate(date);
  };

  const handleQuickCreateFromCalendar = (date: Date) => {
    handleStartCreate();
    // Pre-fill date in form
    const dateStr = getLocalDateString(date);
    reset({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      date: dateStr,
      time: '',
      numberOfGuests: '',
      status: 'pending',
      notes: '',
    });
  };

  const handleQuickCreateFromDay = (time: string) => {
    handleStartCreate();
    const dateStr = getLocalDateString(currentDay);
    reset({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      date: dateStr,
      time: time,
      numberOfGuests: '',
      status: 'pending',
      notes: '',
    });
  };

  const handleReservationClickFromCalendar = (reservation: Reservation) => {
    router.push(`/dashboard/reservations/${reservation._id}`);
  };


  if (isLoading && !showForm) {
    return (
      <div className="space-y-6 animate-pulse p-4 md:p-6">
        <div className="h-20 bg-[#E5E5E5]" />
        <div className="h-40 bg-[#E5E5E5]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 animate-fade-in">
      {/* Header */}
      <div className="relative">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-[#0066FF]" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
          {/* Titre et info */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-light text-[#2A2A2A]">Réservations</h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
                <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <span className="text-xs text-[#666666] font-medium">
                  {isConnected ? 'Temps réel' : 'Hors ligne'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-[#666666]">
              <span>
                {filters.filteredReservations.length} réservation{filters.filteredReservations.length !== 1 ? 's' : ''}
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">
                {activeTab === 'upcoming' ? 'À venir' : 'Passées'} ({activeTab === 'upcoming' ? upcomingCount : pastCount})
              </span>
            </div>
          </div>

          {/* Actions */}
      {!showForm && (
            <div className="flex gap-2">
              {/* Menu mobile actions */}
              <div className="sm:hidden relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMobileActions(!showMobileActions)}
                  className="h-10 w-10 p-0"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
                
                {/* Dropdown mobile actions */}
                {showMobileActions && (
                  <>
                    <div 
                      className="fixed inset-0 z-30"
                      onClick={() => setShowMobileActions(false)}
                    />
                     <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-xl z-40 animate-slide-up">
                       <button
                         className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center gap-3 text-sm"
                         onClick={() => {
                           router.push('/dashboard/reservations/blocked-days');
                           setShowMobileActions(false);
                         }}
                       >
                         <Ban className="h-4 w-4" />
                         Jours bloqués
                       </button>
                     </div>
                  </>
                )}
              </div>
              
               {/* Desktop actions */}
               <div className="hidden sm:flex gap-2">
                 <Button
                   variant="outline"
                   size="sm"
                   onClick={() => router.push('/dashboard/reservations/blocked-days')}
                   title="Gérer les jours bloqués"
                 >
                   <Ban className="h-4 w-4" />
                 </Button>
               </div>
              
              {/* New reservation button */}
              <Button onClick={handleStartCreate} className="min-w-[140px] sm:min-w-[180px]">
                <Plus className="h-4 w-4" />
                <span className="ml-2 hidden xs:inline">Nouvelle réservation</span>
                <span className="ml-2 xs:hidden">Nouvelle</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs for Upcoming / Past reservations - Optimisé mobile */}
      {!showForm && (
        <div className="space-y-4">
          <div className="flex gap-2 p-1 bg-slate-100 rounded-lg w-full sm:w-fit">
          <Button
            variant={activeTab === 'upcoming' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 sm:flex-initial h-10 sm:h-9 px-4 sm:px-4 ${activeTab === 'upcoming' ? 'shadow-sm' : ''}`}
          >
            <span className="text-sm font-medium">À venir</span>
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
              activeTab === 'upcoming'
                ? 'bg-white text-[#0066FF]'
                : 'bg-slate-200 text-slate-600'
            }`}>
              {upcomingCount}
            </span>
          </Button>
          <Button
            variant={activeTab === 'past' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('past')}
            className={`flex-1 sm:flex-initial h-10 sm:h-9 px-4 sm:px-4 ${activeTab === 'past' ? 'shadow-sm' : ''}`}
          >
            <span className="text-sm font-medium">Passées</span>
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
              activeTab === 'past'
                ? 'bg-white text-[#0066FF]'
                : 'bg-slate-200 text-slate-600'
            }`}>
              {pastCount}
            </span>
          </Button>
         </div>

         {/* Pagination controls for past reservations */}
         {activeTab === 'past' && (
            <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full">
             <div className="flex items-center gap-2">
               <span className="text-sm font-medium text-slate-700">Période :</span>
                <div className="flex bg-slate-100 rounded-lg p-0.5 sm:p-1 w-full sm:w-auto justify-center">
                  <button
                    type="button"
                    onClick={() => setPastPeriodType('year')}
                    className={`px-2 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm font-medium rounded-md transition-colors ${pastPeriodType === 'year'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Année
                  </button>
                 <button
                   type="button"
                   onClick={() => setPastPeriodType('week')}
                   className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                     pastPeriodType === 'week'
                       ? 'bg-white text-slate-900 shadow-sm'
                       : 'text-slate-600 hover:text-slate-900'
                   }`}
                 >
                   Semaine
                 </button>
                 <button
                   type="button"
                   onClick={() => setPastPeriodType('year')}
                   className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                     pastPeriodType === 'year'
                       ? 'bg-white text-slate-900 shadow-sm'
                       : 'text-slate-600 hover:text-slate-900'
                   }`}
                 >
                   Année
                 </button>
               </div>
             </div>

             <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPreviousPeriod}
                  title="Période précédente"
                  className="min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0"
                >
                  ←
                </Button>
               
                <div className="text-center w-full sm:w-auto">
                 <div className="font-medium text-slate-900">{formatCurrentPeriod()}</div>
                 <button
                   type="button"
                   onClick={resetToCurrentPeriod}
                   className="text-xs text-slate-500 hover:text-slate-700 hover:underline mt-0.5"
                 >
                    Revenir à aujourd&apos;hui
                 </button>
               </div>
               
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextPeriod}
                  title="Période suivante"
                  className="min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0"
                >
                  →
                </Button>
             </div>
            </div>
           )}
         </div>
       )}


       {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingReservation ? 'Modifier la réservation' : 'Nouvelle réservation'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Nom du client *</Label>
                  <Input id="customerName" {...register('customerName')} disabled={isSaving} />
                  {errors.customerName && (
                    <p className="text-sm text-destructive">{errors.customerName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Email *</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    {...register('customerEmail')}
                    disabled={isSaving}
                  />
                  {errors.customerEmail && (
                    <p className="text-sm text-destructive">{errors.customerEmail.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerPhone">Téléphone *</Label>
                  <Input id="customerPhone" {...register('customerPhone')} disabled={isSaving} />
                  {errors.customerPhone && (
                    <p className="text-sm text-destructive">{errors.customerPhone.message}</p>
                  )}
                </div>
              </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <div className="relative">
                    <Input 
                      id="date" 
                      type="date" 
                      {...register('date')} 
                      disabled={isSaving}
                      className="w-full pl-3 pr-10 py-2"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <CalendarIcon className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  {selectedFormDate && (
                    <p className="text-sm text-slate-600">
                      {new Date(selectedFormDate).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  )}
                  {errors.date && <p className="text-sm text-destructive">{errors.date.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Heure *</Label>
                  {selectedFormDate && restaurant && restaurant.reservationConfig?.useOpeningHours ? (
                    (() => {
                      const date = new Date(selectedFormDate);
                      const dayOfWeek = date.getDay();
                      const availableSlots = getAvailableTimeSlots(restaurant, dayOfWeek);
                      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
                      const dayName = dayNames[dayOfWeek] as keyof typeof restaurant.openingHours;
                      const isClosed = restaurant.openingHours[dayName]?.closed;

                      if (isClosed) {
                        return (
                          <div className="space-y-2">
                            <Input 
                              id="time" 
                              type="time" 
                              {...register('time')} 
                              disabled={true}
                              className="opacity-50"
                              placeholder="Restaurant fermé"
                            />
                            <p className="text-sm text-amber-600">
                              Restaurant fermé ce jour. Veuillez choisir une autre date.
                            </p>
                          </div>
                        );
                      }

                      if (availableSlots.length > 0) {
                        return (
                          <select
                            id="time"
                            {...register('time')}
                            disabled={isSaving}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                          >
                            <option value="">Sélectionnez un créneau</option>
                            {availableSlots.map((slot) => (
                              <option key={slot} value={slot}>
                                {slot}
                              </option>
                            ))}
                          </select>
                        );
                      }

                      // No slots defined but not closed - allow free time input
                      return <Input id="time" type="time" {...register('time')} disabled={isSaving} />;
                    })()
                  ) : (
                    // Opening hours not enforced - allow free time input
                    <Input id="time" type="time" {...register('time')} disabled={isSaving} />
                  )}
                  {errors.time && <p className="text-sm text-destructive">{errors.time.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numberOfGuests">Nombre de personnes *</Label>
                  <Input
                    id="numberOfGuests"
                    type="number"
                    min="1"
                    {...register('numberOfGuests')}
                    disabled={isSaving}
                  />
                  {errors.numberOfGuests && (
                    <p className="text-sm text-destructive">{errors.numberOfGuests.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Statut *</Label>
                <select
                  id="status"
                  {...register('status')}
                  disabled={isSaving}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  {Object.entries(statusLabels).map(([value, { label }]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  {...register('notes')}
                  placeholder="Notes internes..."
                  rows={2}
                  disabled={isSaving}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelForm}
                  disabled={isSaving}
                >
                  <X className="mr-2 h-4 w-4" />
                  Annuler
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? 'Enregistrement...' : editingReservation ? 'Modifier' : 'Créer'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Barre d'outils et filtres */}
      {!showForm && (
        <div className="space-y-4">
           {/* Filtres et recherche */}
           <div className="flex flex-col sm:flex-row gap-3 w-full">
              {/* Bouton filtres avancés */}
               <Button 
                 variant="outline" 
                 size="sm" 
                 onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                 className="flex-shrink-0"
               >
                 <Filter className="h-4 w-4 mr-2" />
                 Filtres
                 {filters.activeFilterCount > 0 && (
                   <span className="ml-2 h-5 w-5 rounded-full bg-[#0066FF] text-white text-xs flex items-center justify-center">
                     {filters.activeFilterCount}
                   </span>
                 )}
               </Button>
             
              {/* Recherche avec suggestions */}
              <div className="relative flex-1 max-w-full sm:max-w-md">
                 <SearchWithSuggestions
                   value={filters.searchTerm}
                   onChange={filters.setSearchTerm}
                   suggestions={filters.suggestions}
                   placeholder="Rechercher..."
                 />
              </div>
             
              {/* Quick Filters intégrés avec scroll mobile */}
              <div className="w-full sm:flex-initial">
                <div className="flex gap-2 overflow-x-auto pb-2 mx-0 px-0 sm:mx-0 sm:px-0 sm:pb-0">
                  {quickFilters.map((filter) => (
                    <Button
                      key={filter.id}
                      variant={filter.isActive ? 'default' : 'outline'}
                      size="sm"
                      onClick={filter.action}
                      className="flex-shrink-0 snap-start"
                    >
                      {filter.label}
                    </Button>
                  ))}
                </div>
              </div>
           </div>
           
           {/* Boutons de vue Liste/Calendrier */}
           <div className="flex justify-center sm:justify-start gap-2">
             <Button
               variant={viewMode === 'list' ? 'default' : 'outline'}
               size="sm"
               onClick={() => setViewMode('list')}
             >
               <List className="h-4 w-4 sm:mr-2" />
               <span className="hidden sm:inline">Liste</span>
             </Button>
             <Button
               variant={viewMode === 'calendar' ? 'default' : 'outline'}
               size="sm"
               onClick={() => setViewMode('calendar')}
             >
               <CalendarIcon className="h-4 w-4 sm:mr-2" />
               <span className="hidden sm:inline">Calendrier</span>
             </Button>
           </div>
          
          {/* Indicateur de capacité compact - Optimisé mobile */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Users className="h-4 w-4 text-slate-600" />
              <div>
                <span className="text-sm font-medium block sm:hidden">
                  {capacity.currentGuests}/{capacity.maxCapacity}
                </span>
                <span className="text-sm font-medium hidden sm:block">
                  {capacity.currentGuests} / {capacity.maxCapacity} couverts
                </span>
                <div className="flex items-center gap-2 mt-1 sm:hidden">
                  <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        (capacity.currentGuests / capacity.maxCapacity) >= 0.9 ? 'bg-red-500' :
                        (capacity.currentGuests / capacity.maxCapacity) >= 0.7 ? 'bg-amber-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min((capacity.currentGuests / capacity.maxCapacity) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-600">
                    {Math.min(Math.round((capacity.currentGuests / capacity.maxCapacity) * 100), 100)}%
                  </span>
                </div>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${
                    (capacity.currentGuests / capacity.maxCapacity) >= 0.9 ? 'bg-red-500' :
                    (capacity.currentGuests / capacity.maxCapacity) >= 0.7 ? 'bg-amber-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min((capacity.currentGuests / capacity.maxCapacity) * 100, 100)}%` }}
                />
              </div>
              <span className="text-xs text-slate-600">
                {Math.min(Math.round((capacity.currentGuests / capacity.maxCapacity) * 100), 100)}%
              </span>
            </div>
          </div>
          
          {/* Filtres avancés (sidebar) - Optimisée mobile */}
          {showAdvancedFilters && (
            <>
              {/* Overlay tactile */}
              <div 
                className="fixed inset-0 bg-[#0A0A0A] bg-opacity-50 z-40 active:bg-opacity-60 transition-opacity"
                onClick={() => setShowAdvancedFilters(false)}
              />
              
              {/* Sidebar avec swipe gesture */}
              <div className="fixed right-0 top-0 h-full w-full max-w-full sm:max-w-md bg-white shadow-2xl z-50 animate-slide-in-right">
                <div className="h-full flex flex-col">
                  {/* Header avec grip pour swipe */}
                  <div className="pt-2 px-6 pb-1">
                    <div className="h-1 w-12 mx-auto bg-slate-300 rounded-full" />
                  </div>
                  
                  <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                      <button
                        onClick={() => setShowAdvancedFilters(false)}
                        className="p-3 hover:bg-slate-100 active:bg-slate-200 rounded-lg transition-colors touch-manipulation"
                        aria-label="Fermer"
                      >
                        <ArrowLeft className="h-5 w-5" />
                      </button>
                      <div>
                        <h3 className="text-lg font-light text-[#2A2A2A]">Filtres avancés</h3>
                        <p className="text-sm text-[#666666]">
                          {filters.filteredReservations.length} résultat{filters.filteredReservations.length !== 1 ? 's' : ''}
                          {filters.activeFilterCount > 0 && ` • ${filters.activeFilterCount} filtre${filters.activeFilterCount !== 1 ? 's' : ''} actif`}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={filters.clearAllFilters}
                      disabled={filters.activeFilterCount === 0}
                      className="hidden sm:inline-flex"
                    >
                      Tout effacer
                    </Button>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Status Filters */}
                    <div>
                      <Label className="text-sm font-medium mb-3 block">Statut</Label>
                      <div className="flex gap-2 flex-wrap">
                        <Button
                          variant={filters.statusFilter === '' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => filters.setStatusFilter('')}
                          className="min-h-[40px] px-4"
                        >
                          Toutes ({reservations.length})
                        </Button>
                        {Object.entries(statusLabels).map(([status, { label }]) => (
                          <Button
                            key={status}
                            variant={filters.statusFilter === status ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => filters.setStatusFilter(status)}
                            className="min-h-[40px] px-4"
                          >
                            {label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Date Range */}
                    <div>
                      <Label className="text-sm font-medium mb-3 block">Période</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="dateRangeStart" className="text-xs">Date de début</Label>
                          <Input
                            id="dateRangeStart"
                            type="date"
                            value={filters.dateRangeStart}
                            onChange={(e) => filters.setDateRangeStart(e.target.value)}
                            className="mt-1 h-12 text-base"
                          />
                        </div>
                        <div>
                          <Label htmlFor="dateRangeEnd" className="text-xs">Date de fin</Label>
                          <Input
                            id="dateRangeEnd"
                            type="date"
                            value={filters.dateRangeEnd}
                            onChange={(e) => filters.setDateRangeEnd(e.target.value)}
                            className="mt-1 h-12 text-base"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Guests Range */}
                    <div>
                      <Label className="text-sm font-medium mb-3 block">Nombre de personnes</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="minGuests" className="text-xs">Minimum</Label>
                          <Input
                            id="minGuests"
                            type="number"
                            min="1"
                            value={filters.minGuests}
                            onChange={(e) => filters.setMinGuests(e.target.value)}
                            className="mt-1 h-12 text-base"
                          />
                        </div>
                        <div>
                          <Label htmlFor="maxGuests" className="text-xs">Maximum</Label>
                          <Input
                            id="maxGuests"
                            type="number"
                            min="1"
                            value={filters.maxGuests}
                            onChange={(e) => filters.setMaxGuests(e.target.value)}
                            className="mt-1 h-12 text-base"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Quick Filters */}
                    <div>
                      <Label className="text-sm font-medium mb-3 block">Filtres rapides</Label>
                      <div className="flex gap-2 flex-wrap">
                        {quickFilters.map((filter) => (
                          <Button
                            key={filter.id}
                            variant={filter.isActive ? 'default' : 'outline'}
                            size="sm"
                            onClick={filter.action}
                            className="min-h-[40px] px-4"
                          >
                            {filter.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Footer mobile */}
                  <div className="p-6 border-t bg-white sticky bottom-0">
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1 h-12 text-base"
                        onClick={filters.clearAllFilters}
                        disabled={filters.activeFilterCount === 0}
                      >
                        Tout effacer
                      </Button>
                      <Button 
                        className="flex-1 h-12 text-base" 
                        onClick={() => setShowAdvancedFilters(false)}
                      >
                        Appliquer
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Calendar Stats */}
      {!showForm && viewMode === 'calendar' && (
        <CalendarStats
          reservations={filters.filteredReservations}
          currentMonth={currentMonth}
          maxCapacity={getMaxCapacityFromRestaurant(restaurant)}
          averagePrice={25}
          restaurant={restaurant}
        />
      )}

      {/* Calendar View Type Toggle */}
      {!showForm && viewMode === 'calendar' && (
        <div className="flex gap-2">
          <Button
            variant={calendarViewType === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCalendarViewType('week')}
          >
            Semaine
          </Button>
          <Button
            variant={calendarViewType === 'day' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCalendarViewType('day')}
          >
            Jour
          </Button>
          <Button
            variant={calendarViewType === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCalendarViewType('month')}
          >
            Mois
          </Button>
        </div>
      )}

      {/* Calendar Content */}
      {!showForm && viewMode === 'calendar' && (
        <>
          {calendarViewType === 'month' && (
            <CalendarViewImproved
              reservations={filters.filteredReservations}
              blockedDays={blockedDays}
              selectedDate={selectedDate}
              onDateSelect={(date) => {
                setSelectedDate(date);
                setCurrentDay(date);
                setCalendarViewType('day');
              }}
              currentMonth={currentMonth}
              onMonthChange={setCurrentMonth}
              onQuickCreate={handleQuickCreateFromCalendar}
              maxCapacity={getMaxCapacityFromRestaurant(restaurant)}
            />
          )}

          {calendarViewType === 'week' && (
            <WeekView
              reservations={filters.filteredReservations}
              currentWeek={currentWeek}
              onWeekChange={setCurrentWeek}
              onReservationClick={handleReservationClickFromCalendar}
              restaurant={restaurant}
              maxCapacity={getMaxCapacityFromRestaurant(restaurant)}
            />
          )}

          {calendarViewType === 'day' && (
            <DayView
              reservations={filters.filteredReservations}
              currentDay={currentDay}
              onDayChange={setCurrentDay}
              onReservationClick={handleReservationClickFromCalendar}
              onQuickCreate={handleQuickCreateFromDay}
              maxCapacity={getMaxCapacityFromRestaurant(restaurant)}
              restaurant={restaurant}
            />
          )}
        </>
      )}

      {!showForm && viewMode === 'list' && (
        <>
          <ReservationsStats
            reservations={filters.filteredReservations}
            maxCapacity={getMaxCapacityFromRestaurant(restaurant)}
            averagePrice={25}
            restaurant={restaurant}
          />
          <div className="mt-6">
            <ReservationsListView
              reservations={filters.filteredReservations}
              onConfirm={handleConfirm}
              onCancel={handleCancel}
              onComplete={handleComplete}
              onEdit={handleStartEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
              restaurant={restaurant}
            />
          </div>
        </>
      )}

      {/* Email Confirmation Modal */}
      {emailConfirmationModal.show && (
        <div className="fixed inset-0 bg-[#0A0A0A] bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-[#E5E5E5] max-w-md w-full p-8 space-y-4">
            <div>
              <h3 className="text-lg font-light text-[#2A2A2A]">Confirmer l&apos;action</h3>
              <p className="mt-2 text-sm text-[#666666]">
                Voulez-vous envoyer un email de confirmation au client ?
              </p>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="sendEmailCheckbox"
                checked={sendEmail}
                onChange={(e) => setSendEmail(e.target.checked)}
                className="h-4 w-4 border-[#E5E5E5]"
              />
              <label htmlFor="sendEmailCheckbox" className="text-sm text-[#2A2A2A]">
                Envoyer un email au client
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={closeEmailConfirmationModal}
                disabled={isSaving}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button onClick={confirmActionWithEmail} disabled={isSaving} className="flex-1">
                {isSaving ? 'En cours...' : 'Confirmer'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
