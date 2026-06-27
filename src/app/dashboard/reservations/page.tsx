'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
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
  subYears,
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { apiClient } from '@/lib/api';
import { getLocalDateString } from '@/lib/formatters';
import { Reservation, Restaurant } from '@/types';
import { useRealtimeReservationsManager } from '@/hooks/useRealtimeReservations';
import { useReservationsFilters } from '@/hooks/useReservationsFilters';
import { getMaxCapacityFromRestaurant } from '@/hooks/useRestaurantCapacity';
import { useRestaurantStore, isTimeWithinOpeningHours } from '@/store/restaurantStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Ban, Filter, List, Calendar as CalendarIcon, MoreVertical, Plus, ArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { ReservationsListView } from '@/components/reservations/ReservationsListView';
import { ReservationDetailView } from '@/components/reservations/ReservationDetailView';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { QuickFilters, QuickFilter } from '@/components/reservations/QuickFilters';
import { ReservationsStats } from '@/components/reservations/ReservationsStats';
import { SearchWithSuggestions } from '@/components/reservations/SearchWithSuggestions';
import { ReservationForm } from '@/components/reservations/ReservationForm';
import { ReservationCalendarSection } from '@/components/reservations/ReservationCalendarSection';
import { EmailConfirmationModal } from '@/components/reservations/EmailConfirmationModal';
import { ReservationHeader } from '@/components/reservations/ReservationHeader';
import { ReservationTabs } from '@/components/reservations/ReservationTabs';

const createFormSchema = (restaurant: Restaurant | null) =>
  z
    .object({
      customerName: z.string().min(1, 'Le nom est requis'),
      customerEmail: z.string().email('Email invalide'),
      customerPhone: z.string().min(1, 'Le téléphone est requis'),
      date: z.string().min(1, 'La date est requise'),
      time: z.string().min(1, "L'heure est requise"),
      numberOfGuests: z.string().min(1, 'Le nombre de personnes est requis'),
      status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
      notes: z.string().optional(),
    })
    .refine(
      (data) => {
        if (!restaurant?.openingHours || !restaurant?.reservationConfig?.useOpeningHours) return true;
        const dayOfWeek = new Date(data.date).getDay();
        return isTimeWithinOpeningHours(restaurant, dayOfWeek, data.time);
      },
      { message: "L'heure sélectionnée n'est pas dans les horaires d'ouverture du restaurant", path: ['time'] }
    );

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

const statusLabels: Record<string, { label: string; variant: 'warning' | 'success' | 'danger' | 'default' }> = {
  pending: { label: 'En attente', variant: 'warning' },
  confirmed: { label: 'Confirmée', variant: 'success' },
  cancelled: { label: 'Annulée', variant: 'danger' },
  completed: { label: 'Terminée', variant: 'default' },
};

export default function ReservationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [pastPeriodType, setPastPeriodType] = useState<'month' | 'week' | 'year'>('month');
  const [pastPeriodDate, setPastPeriodDate] = useState<Date>(() => {
    const d = new Date(); d.setDate(d.getDate() - 1); return d;
  });

  const dateParams = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    if (activeTab === 'upcoming') return { startDate: todayStr };
    let start: Date, end: Date;
    switch (pastPeriodType) {
      case 'week': start = startOfWeek(pastPeriodDate, { weekStartsOn: 1 }); end = endOfWeek(pastPeriodDate, { weekStartsOn: 1 }); break;
      case 'year': start = startOfYear(pastPeriodDate); end = endOfYear(pastPeriodDate); break;
      default: start = startOfMonth(pastPeriodDate); end = endOfMonth(pastPeriodDate); break;
    }
    return { startDate: start.toISOString().split('T')[0], endDate: end.toISOString().split('T')[0] };
  }, [activeTab, pastPeriodType, pastPeriodDate]);

  const { reservations, isConnected, refreshReservations } = useRealtimeReservationsManager(dateParams);

  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>(() => {
    const v = searchParams.get('view');
    return v === 'calendar' ? 'calendar' : 'list';
  });

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (viewMode === 'calendar') {
      params.set('view', 'calendar');
    } else {
      params.delete('view');
    }
    const qs = params.toString();
    router.replace(qs ? `?${qs}` : window.location.pathname, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode]);
  const [calendarViewType, setCalendarViewType] = useState<'month' | 'week' | 'day'>('week');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [currentDay, setCurrentDay] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedCalendarReservation, setSelectedCalendarReservation] = useState<Reservation | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showMobileActions, setShowMobileActions] = useState(false);
  const [blockedDays, setBlockedDays] = useState<any[]>([]);
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [pastCount, setPastCount] = useState(0);

  const [emailConfirmationModal, setEmailConfirmationModal] = useState<{
    show: boolean; action: 'create' | 'update' | 'status' | 'delete';
    reservation?: Reservation; status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    formData?: FormData; callback?: () => Promise<void>;
    modalTitle?: string; modalMessage?: string; showEmailOption?: boolean;
  }>({ show: false, action: 'create' });
  const [dontAskAgain, setDontAskAgain] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('tablemaster_hide_email_confirmation') === 'true') setDontAskAgain(true);
  }, []);
  useEffect(() => {
    dontAskAgain ? localStorage.setItem('tablemaster_hide_email_confirmation', 'true') : localStorage.removeItem('tablemaster_hide_email_confirmation');
  }, [dontAskAgain]);

  const filters = useReservationsFilters(reservations);
  const { restaurant } = useRestaurantStore();

  const form = useForm<FormData>({ resolver: zodResolver(createFormSchema(restaurant)), defaultValues: { status: 'pending' } });
  const { reset } = form;

  useEffect(() => { form.clearErrors(); }, [restaurant, form]);

  const prefillHandled = useRef(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (prefillHandled.current) return;
    const n = searchParams.get('customerName'), e = searchParams.get('customerEmail');
    if (n && e) { reset({ customerName: n, customerEmail: e, customerPhone: searchParams.get('customerPhone') || '', date: '', time: '', numberOfGuests: '', status: 'pending', notes: '' }); setShowForm(true); prefillHandled.current = true; }
  }, []);

  useEffect(() => {
    (async () => {
      try { setIsLoading(true); await refreshReservations();
        try { const r = await fetch('/api/v1/day-blocks', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }); if (r.ok) { const d = await r.json(); setBlockedDays(d.blockedDays || []); } } catch {} }
      catch {} finally { setIsLoading(false); }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (async () => {
      const t = new Date(), ts = getLocalDateString(t), y = new Date(t); y.setDate(y.getDate() - 1);
      try { const [u, p] = await Promise.all([apiClient.getReservations({ startDate: ts }), apiClient.getReservations({ endDate: getLocalDateString(y) })]); setUpcomingCount(u.reservations.length); setPastCount(p.reservations.length); } catch {}
    })();
  }, [reservations]);

  const quickFilters: QuickFilter[] = [
    { id: 'today', label: "Aujourd'hui", action: () => filters.setQuickFilter(filters.quickFilter === 'today' ? null : 'today'), isActive: filters.quickFilter === 'today' },
    { id: 'week', label: 'Cette semaine', action: () => filters.setQuickFilter(filters.quickFilter === 'week' ? null : 'week'), isActive: filters.quickFilter === 'week' },
    { id: 'pending', label: 'À confirmer', action: () => filters.setQuickFilter(filters.quickFilter === 'pending' ? null : 'pending'), isActive: filters.quickFilter === 'pending' },
  ];

  const handleStartCreate = () => { setEditingReservation(null); reset({ customerName: '', customerEmail: '', customerPhone: '', date: '', time: '', numberOfGuests: '', status: 'pending', notes: '' }); setShowForm(true); };
  const handleStartEdit = (r: Reservation) => { setEditingReservation(r); reset({ customerName: r.customerName, customerEmail: r.customerEmail, customerPhone: r.customerPhone, date: r.date.split('T')[0], time: r.time, numberOfGuests: r.numberOfGuests.toString(), status: r.status, notes: r.notes || '' }); setShowForm(true); };
  const handleCancelForm = () => { setShowForm(false); setEditingReservation(null); reset(); };

  const executeReservationAction = async (action: 'create' | 'update' | 'status' | 'delete', reservation?: Reservation, status?: 'pending' | 'confirmed' | 'cancelled' | 'completed', formData?: FormData, callback?: () => Promise<void>) => {
    try { setIsSaving(true);
      const labels: Record<string, string> = { confirmed: 'confirmée', cancelled: 'annulée', completed: 'terminée', pending: 'mise à jour' };
      if (action === 'status' && reservation && status) { await apiClient.updateReservation(reservation._id, { status }); toast.success(`Réservation de ${reservation.customerName} ${labels[status]}`); }
      else if (action === 'update' && reservation && formData) { await apiClient.updateReservation(reservation._id, { customerName: formData.customerName, customerEmail: formData.customerEmail, customerPhone: formData.customerPhone, date: formData.date, time: formData.time, numberOfGuests: parseInt(formData.numberOfGuests, 10), status: formData.status, notes: formData.notes || '' }); toast.success('Réservation modifiée'); }
      else if (action === 'create' && formData) { await apiClient.createReservation({ customerName: formData.customerName, customerEmail: formData.customerEmail, customerPhone: formData.customerPhone, date: formData.date, time: formData.time, numberOfGuests: parseInt(formData.numberOfGuests, 10), status: formData.status, notes: formData.notes || '' }); toast.success('Réservation créée'); }
      else if (action === 'delete' && reservation) { await apiClient.deleteReservation(reservation._id); toast.success('Réservation supprimée'); }
      if (callback) await callback();
      refreshReservations();
    } catch (e) { console.error(e); toast.error('Une erreur est survenue'); } finally { setIsSaving(false); }
  };

  const openEmailConfirmationModal = (action: 'create' | 'update' | 'status' | 'delete', reservation?: Reservation, status?: 'pending' | 'confirmed' | 'cancelled' | 'completed', formData?: FormData, callback?: () => Promise<void>, options?: { modalTitle?: string; modalMessage?: string; showEmailOption?: boolean }) => {
    if (dontAskAgain && action !== 'delete') { executeReservationAction(action, reservation, status, formData, callback); return; }
    const d = { modalTitle: action === 'delete' ? 'Supprimer la réservation' : "Confirmer l'action", modalMessage: action === 'delete' ? `Êtes-vous sûr de vouloir supprimer définitivement la réservation de ${reservation?.customerName} ? Cette action est irréversible.` : 'Un email sera envoyé au client pour confirmer cette action.', showEmailOption: action !== 'delete' };
    setEmailConfirmationModal({ show: true, action, reservation, status, formData, callback, modalTitle: options?.modalTitle || d.modalTitle, modalMessage: options?.modalMessage || d.modalMessage, showEmailOption: options?.showEmailOption !== undefined ? options.showEmailOption : d.showEmailOption });
  };

  const closeEmailConfirmationModal = () => setEmailConfirmationModal({ show: false, action: 'create' });
  const confirmActionWithEmail = async () => { const { action, reservation, status, formData, callback } = emailConfirmationModal; try { setIsSaving(true); await executeReservationAction(action, reservation, status, formData, callback); closeEmailConfirmationModal(); } catch (e: any) { toast.error(e?.message || "Erreur lors de l'opération"); } finally { setIsSaving(false); } };
  const onSubmit = async (data: FormData) => { const n = parseInt(data.numberOfGuests, 10); if (isNaN(n) || n < 1) { toast.error('Le nombre de personnes doit être au moins 1'); return; } openEmailConfirmationModal(editingReservation ? 'update' : 'create', editingReservation || undefined, undefined, data, async () => { handleCancelForm(); }); };
  const handleConfirm = (r: Reservation) => openEmailConfirmationModal('status', r, 'confirmed');
  const handleCancel = (r: Reservation) => openEmailConfirmationModal('status', r, 'cancelled');
  const handleComplete = (r: Reservation) => openEmailConfirmationModal('status', r, 'completed');
  const handleDelete = (r: Reservation) => openEmailConfirmationModal('delete', r);
  const handleStatusChange = (r: Reservation, s: 'pending' | 'confirmed' | 'cancelled' | 'completed') => openEmailConfirmationModal('status', r, s);

  const formatCurrentPeriod = () => {
    switch (pastPeriodType) {
      case 'week': const ws = startOfWeek(pastPeriodDate, { weekStartsOn: 1 }), we = endOfWeek(pastPeriodDate, { weekStartsOn: 1 }); return `Semaine du ${format(ws, 'd MMM yyyy', { locale: fr })} au ${format(we, 'd MMM yyyy', { locale: fr })}`;
      case 'year': return format(pastPeriodDate, 'yyyy', { locale: fr });
      default: return format(pastPeriodDate, 'MMMM yyyy', { locale: fr });
    }
  };
  const goToPreviousPeriod = () => { switch (pastPeriodType) { case 'week': setPastPeriodDate(subWeeks(pastPeriodDate, 1)); break; case 'year': setPastPeriodDate(subYears(pastPeriodDate, 1)); break; default: setPastPeriodDate(subMonths(pastPeriodDate, 1)); } };
  const goToNextPeriod = () => { switch (pastPeriodType) { case 'week': setPastPeriodDate(addWeeks(pastPeriodDate, 1)); break; case 'year': setPastPeriodDate(addYears(pastPeriodDate, 1)); break; default: setPastPeriodDate(addMonths(pastPeriodDate, 1)); } };
  const resetToCurrentPeriod = () => { const d = new Date(); d.setDate(d.getDate() - 1); setPastPeriodDate(d); };
  const handleQuickCreateFromCalendar = (date: Date) => { handleStartCreate(); reset({ customerName: '', customerEmail: '', customerPhone: '', date: getLocalDateString(date), time: '', numberOfGuests: '', status: 'pending', notes: '' }); };
  const handleQuickCreateFromDay = (time: string) => { handleStartCreate(); reset({ customerName: '', customerEmail: '', customerPhone: '', date: getLocalDateString(currentDay), time, numberOfGuests: '', status: 'pending', notes: '' }); };
  const handleReservationClickFromCalendar = (r: Reservation) => setSelectedCalendarReservation(r);

  const handleCalendarDetailStatusChange = (status: 'pending' | 'confirmed' | 'cancelled' | 'completed') => {
    if (selectedCalendarReservation) {
      handleStatusChange(selectedCalendarReservation, status);
      setSelectedCalendarReservation(null);
    }
  };

  if (isLoading && !showForm) return <div className="space-y-6 animate-pulse md:p-6"><div className="h-20 bg-[#E5E5E5] mx-4 md:mx-0 rounded-lg" /><div className="h-40 bg-[#E5E5E5] mx-4 md:mx-0 rounded-lg" /></div>;

  return (
    <div className="space-y-6 animate-fade-in md:p-6">
      <ReservationHeader isConnected={isConnected} totalCount={filters.filteredReservations.length} upcomingCount={upcomingCount} pastCount={pastCount} activeTab={activeTab} onNewReservation={handleStartCreate} />

      {!showForm && showMobileActions && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setShowMobileActions(false)} />
          <div className="fixed right-4 top-20 w-48 bg-white border border-slate-200 rounded-lg shadow-xl z-40 animate-slide-up">
            <button className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center gap-3 text-sm" onClick={() => { router.push('/dashboard/reservations/blocked-days'); setShowMobileActions(false); }}>
              <Ban className="h-4 w-4" /> Jours bloqués
            </button>
          </div>
        </>
      )}

      {!showForm && (
        <div className="space-y-3">
          <ReservationTabs activeTab={activeTab} upcomingCount={upcomingCount} pastCount={pastCount} onTabChange={setActiveTab} />

          {activeTab === 'past' && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full px-4 md:px-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[#8E8E93] md:text-slate-700">Période :</span>
                <div className="flex bg-[#E5E5EA] md:bg-slate-100 rounded-lg p-0.5 w-full sm:w-auto justify-center">
                  {(['month', 'week', 'year'] as const).map((t) => (
                    <button key={t} type="button" onClick={() => setPastPeriodType(t)} className={`px-2 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm font-medium rounded-md transition-colors capitalize flex-1 sm:flex-initial ${pastPeriodType === t ? 'bg-white text-[#000000] md:text-slate-900 shadow-sm' : 'text-[#6D6D72] md:text-slate-600'}`}>
                      {t === 'month' ? 'Mois' : t === 'week' ? 'Semaine' : 'Année'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={goToPreviousPeriod} className="min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0">←</Button>
                <div className="text-center w-full sm:w-auto"><div className="font-medium text-[#000000] md:text-slate-900 text-[15px] md:text-base">{formatCurrentPeriod()}</div><button type="button" onClick={resetToCurrentPeriod} className="text-xs text-[#0066FF] md:text-slate-500 hover:underline mt-0.5">Revenir à aujourd&apos;hui</button></div>
                <Button variant="outline" size="sm" onClick={goToNextPeriod} className="min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0">→</Button>
              </div>
            </div>
          )}
        </div>
      )}

      {showForm && (
        <>
          {/* Mobile: full-screen overlay */}
          <div className="md:hidden fixed inset-0 z-50 bg-white overflow-y-auto [&_>_div]:rounded-none [&_>_div]:border-0 [&_>_div]:shadow-none">
            <div className="min-h-full" style={{ paddingBottom: 'calc(5rem + env(safe-area-inset-bottom, 0px))' }}>
              <ReservationForm form={form} restaurant={restaurant} editing={!!editingReservation} isSaving={isSaving} onCancel={handleCancelForm} onSubmit={onSubmit} />
            </div>
          </div>

          {/* Desktop: inline card */}
          <div className="hidden md:block">
            <ReservationForm form={form} restaurant={restaurant} editing={!!editingReservation} isSaving={isSaving} onCancel={handleCancelForm} onSubmit={onSubmit} />
          </div>
        </>
      )}

      {!showForm && (
        <div className="space-y-3">
          {/* Mobile: Search + chips */}
          <div className="md:hidden px-4 space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <SearchWithSuggestions value={filters.searchTerm} onChange={filters.setSearchTerm} suggestions={[]} placeholder="Rechercher..." />
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)} className={`h-9 w-9 rounded-lg flex-shrink-0 ${showAdvancedFilters ? 'bg-[#0066FF]/10 text-[#0066FF]' : 'text-[#8E8E93]'}`}>
                <Filter className="h-5 w-5" />
              </Button>
              <div className="flex bg-[#E5E5EA] rounded-lg p-0.5 flex-shrink-0">
                <Button variant={viewMode === 'list' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('list')} className={`h-8 w-8 p-0 ${viewMode === 'list' ? 'shadow-sm' : ''}`}>
                  <List className="h-4 w-4" />
                </Button>
                <Button variant={viewMode === 'calendar' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('calendar')} className={`h-8 w-8 p-0 ${viewMode === 'calendar' ? 'shadow-sm' : ''}`}>
                  <CalendarIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <QuickFilters filters={quickFilters} />
          </div>

          {/* Desktop filter bar */}
          <div className="hidden md:flex gap-2 flex-wrap items-center justify-between">
            <div className="flex gap-2 flex-wrap items-center">
              <Button variant="outline" size="sm" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)} className={showAdvancedFilters ? 'border-[#0066FF] text-[#0066FF]' : ''}><Filter className="h-4 w-4" /></Button>
              <QuickFilters filters={quickFilters} />
              <SearchWithSuggestions value={filters.searchTerm} onChange={filters.setSearchTerm} suggestions={[]} placeholder="Rechercher..." />
            </div>
            <div className="flex gap-2 items-center">
              <div className="flex bg-slate-100 rounded-lg p-1">
                <Button variant={viewMode === 'list' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('list')} className={viewMode === 'list' ? 'shadow-sm' : ''}><List className="h-4 w-4" /></Button>
                <Button variant={viewMode === 'calendar' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('calendar')} className={viewMode === 'calendar' ? 'shadow-sm' : ''}><CalendarIcon className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>

          {showAdvancedFilters && (
            <>
              <div className="fixed inset-0 bg-[#0A0A0A] bg-opacity-50 z-40 active:bg-opacity-60 transition-opacity" onClick={() => setShowAdvancedFilters(false)} />
              <div className="fixed right-0 top-0 h-full w-full max-w-full sm:max-w-md bg-white shadow-2xl z-50 animate-slide-in-right">
                <div className="h-full flex flex-col">
                  <div className="pt-2 px-6 pb-1"><div className="h-1 w-12 mx-auto bg-slate-300 rounded-full" /></div>
                  <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex items-center gap-3">
                      <button onClick={() => setShowAdvancedFilters(false)} className="p-3 hover:bg-slate-100 active:bg-slate-200 rounded-lg transition-colors touch-manipulation" aria-label="Fermer"><ArrowLeft className="h-5 w-5" /></button>
                      <div>
                        <h3 className="text-lg font-light text-[#2A2A2A]">Filtres avancés</h3>
                        <p className="text-sm text-[#666666]">{filters.filteredReservations.length} résultat{filters.filteredReservations.length !== 1 ? 's' : ''}{filters.activeFilterCount > 0 && ` • ${filters.activeFilterCount} filtre${filters.activeFilterCount !== 1 ? 's' : ''} actif`}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={filters.clearAllFilters} disabled={filters.activeFilterCount === 0} className="hidden sm:inline-flex">Tout effacer</Button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div>
                      <Label className="text-sm font-medium mb-3 block">Statut</Label>
                      <div className="flex gap-2 flex-wrap">
                        <Button variant={filters.statusFilter === '' ? 'default' : 'outline'} size="sm" onClick={() => filters.setStatusFilter('')} className="min-h-[40px] px-4">Toutes ({reservations.length})</Button>
                        {Object.entries(statusLabels).map(([s, { label }]) => <Button key={s} variant={filters.statusFilter === s ? 'default' : 'outline'} size="sm" onClick={() => filters.setStatusFilter(s)} className="min-h-[40px] px-4">{label}</Button>)}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-3 block">Période</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div><Label htmlFor="dateRangeStart" className="text-xs">Date de début</Label><Input id="dateRangeStart" type="date" value={filters.dateRangeStart} onChange={(e) => filters.setDateRangeStart(e.target.value)} className="mt-1 h-12 text-base" /></div>
                        <div><Label htmlFor="dateRangeEnd" className="text-xs">Date de fin</Label><Input id="dateRangeEnd" type="date" value={filters.dateRangeEnd} onChange={(e) => filters.setDateRangeEnd(e.target.value)} className="mt-1 h-12 text-base" /></div>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-3 block">Nombre de personnes</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div><Label htmlFor="minGuests" className="text-xs">Minimum</Label><Input id="minGuests" type="number" min="1" value={filters.minGuests} onChange={(e) => filters.setMinGuests(e.target.value)} className="mt-1 h-12 text-base" /></div>
                        <div><Label htmlFor="maxGuests" className="text-xs">Maximum</Label><Input id="maxGuests" type="number" min="1" value={filters.maxGuests} onChange={(e) => filters.setMaxGuests(e.target.value)} className="mt-1 h-12 text-base" /></div>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-3 block">Filtres rapides</Label>
                      <div className="flex gap-2 flex-wrap">
                        {quickFilters.map((f) => <Button key={f.id} variant={f.isActive ? 'default' : 'outline'} size="sm" onClick={f.action} className="min-h-[40px] px-4">{f.label}</Button>)}
                      </div>
                    </div>
                  </div>
                  <div className="p-6 border-t bg-white sticky bottom-0 md:pb-6 pb-[calc(1.5rem+3.5rem+env(safe-area-inset-bottom,0px))]">
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1 h-10 text-sm" onClick={filters.clearAllFilters} disabled={filters.activeFilterCount === 0}>Tout effacer</Button>
                      <Button className="flex-1 h-10 text-sm" onClick={() => setShowAdvancedFilters(false)}>Appliquer</Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {!showForm && (
        <ReservationsStats
          reservations={filters.filteredReservations}
          maxCapacity={getMaxCapacityFromRestaurant(restaurant)}
          averagePrice={restaurant?.reservationConfig?.averagePrice || 25}
          restaurant={restaurant}
        />
      )}

      {!showForm && viewMode === 'calendar' && (
        <div className="px-4 md:px-0">
          <ReservationCalendarSection
            calendarViewType={calendarViewType} filteredReservations={filters.filteredReservations} blockedDays={blockedDays} selectedDate={selectedDate}
            currentMonth={currentMonth} currentWeek={currentWeek} currentDay={currentDay} restaurant={restaurant}
            onCalendarViewTypeChange={setCalendarViewType}
            onDateSelectFromMonth={(d) => { setSelectedDate(d); setCurrentDay(d); }}
            onMonthChange={setCurrentMonth} onWeekChange={setCurrentWeek} onDayChange={setCurrentDay}
            onReservationClick={handleReservationClickFromCalendar}
            onQuickCreateFromCalendar={handleQuickCreateFromCalendar}
            onQuickCreateFromDay={handleQuickCreateFromDay}
          />
        </div>
      )}

      {!showForm && viewMode === 'list' && (
        <ReservationsListView reservations={filters.filteredReservations} onConfirm={handleConfirm} onCancel={handleCancel} onComplete={handleComplete} onEdit={handleStartEdit} onDelete={handleDelete} onStatusChange={handleStatusChange} restaurant={restaurant} />
      )}

      <BottomSheet
        isOpen={!!selectedCalendarReservation}
        onClose={() => setSelectedCalendarReservation(null)}
        title="Détails de la réservation"
      >
        {selectedCalendarReservation && (
          <ReservationDetailView
            reservation={selectedCalendarReservation}
            onEdit={() => { setSelectedCalendarReservation(null); handleStartEdit(selectedCalendarReservation); }}
            onDelete={() => { setSelectedCalendarReservation(null); handleDelete(selectedCalendarReservation); }}
            onStatusChange={handleCalendarDetailStatusChange}
          />
        )}
      </BottomSheet>

      <EmailConfirmationModal modal={emailConfirmationModal} dontAskAgain={dontAskAgain} onDontAskAgainChange={setDontAskAgain} isSaving={isSaving} onConfirm={confirmActionWithEmail} onClose={closeEmailConfirmationModal} />
    </div>
  );
}
