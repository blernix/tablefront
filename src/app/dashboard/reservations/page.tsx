'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { apiClient } from '@/lib/api';
import { formatDate } from '@/lib/formatters';
import { Reservation } from '@/types';
import { useRealtimeReservationsManager } from '@/hooks/useRealtimeReservations';
import { useReservationsFilters } from '@/hooks/useReservationsFilters';
import { useRestaurantCapacity } from '@/hooks/useRestaurantCapacity';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Download, Ban, List, Calendar as CalendarIcon, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import CalendarViewImproved from '@/components/reservations/CalendarViewImproved';
import { CalendarStats } from '@/components/reservations/CalendarStats';
import { WeekView } from '@/components/reservations/WeekView';
import { DayView } from '@/components/reservations/DayView';
import { ReservationsListView } from '@/components/reservations/ReservationsListView';
import { QuickFilters, QuickFilter } from '@/components/reservations/QuickFilters';
import { CapacityIndicator } from '@/components/reservations/CapacityIndicator';
import { SearchWithSuggestions } from '@/components/reservations/SearchWithSuggestions';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const formSchema = z.object({
  customerName: z.string().min(1, 'Le nom est requis'),
  customerEmail: z.string().email('Email invalide'),
  customerPhone: z.string().min(1, 'Le téléphone est requis'),
  date: z.string().min(1, 'La date est requise'),
  time: z.string().min(1, "L'heure est requise"),
  numberOfGuests: z.string().min(1, 'Le nombre de personnes est requis'),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const statusLabels = {
  pending: { label: 'En attente', variant: 'warning' as const },
  confirmed: { label: 'Confirmée', variant: 'success' as const },
  cancelled: { label: 'Annulée', variant: 'danger' as const },
  completed: { label: 'Terminée', variant: 'default' as const },
};

export default function ReservationsPage() {
  const router = useRouter();
  const { reservations, isConnected, refreshReservations } = useRealtimeReservationsManager();
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [calendarViewType, setCalendarViewType] = useState<'month' | 'week' | 'day'>('month');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [currentDay, setCurrentDay] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [blockedDays, setBlockedDays] = useState<any[]>([]);

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
  const capacity = useRestaurantCapacity(filters.filteredReservations);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: 'pending',
    },
  });

  // Load initial data
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

  // Quick filters configuration
  const quickFilters: QuickFilter[] = [
    {
      id: 'today',
      label: 'Aujourd&apos;hui',
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

  const handleQuickCreateFromCalendar = (date: Date) => {
    handleStartCreate();
    // Pre-fill date in form
    const dateStr = date.toISOString().split('T')[0];
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
    const dateStr = currentDay.toISOString().split('T')[0];
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

  const handleExportCSV = () => {
    if (filters.filteredReservations.length === 0) {
      toast.error('Aucune réservation à exporter');
      return;
    }

    const headers = [
      'ID',
      'Nom du client',
      'Email',
      'Téléphone',
      'Date',
      'Heure',
      'Nombre de personnes',
      'Statut',
      'Notes',
      'Date de création',
    ];

    const rows = filters.filteredReservations.map((r) => [
      r._id,
      r.customerName,
      r.customerEmail,
      r.customerPhone,
      format(new Date(r.date), 'dd/MM/yyyy'),
      r.time,
      r.numberOfGuests.toString(),
      statusLabels[r.status].label,
      r.notes || '',
      format(new Date(r.createdAt), 'dd/MM/yyyy HH:mm'),
    ]);

    const csvContent = [
      headers.join(';'),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(';')),
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const date = format(new Date(), 'yyyy-MM-dd_HHmm');

    link.setAttribute('href', url);
    link.setAttribute('download', `reservations_${date}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`${filters.filteredReservations.length} réservation(s) exportée(s)`);
  };

  if (isLoading && !showForm) {
    return (
      <div className="space-y-6 animate-pulse p-4 md:p-6">
        <div className="h-20 bg-slate-200 rounded-lg" />
        <div className="h-40 bg-slate-200 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-semibold text-slate-900">Réservations</h1>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  isConnected ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}
                title={isConnected ? 'Connecté en temps réel' : 'Connexion temps réel inactive'}
              >
                <span
                  className={`w-2 h-2 rounded-full mr-1 ${isConnected ? 'bg-green-500' : 'bg-yellow-500'}`}
                />
                {isConnected ? 'Temps réel' : 'Hors ligne'}
              </span>
            </div>
          </div>
          <p className="mt-2 text-slate-600">
            {filters.filteredReservations.length} réservation
            {filters.filteredReservations.length > 1 ? 's' : ''}
          </p>
        </div>
        {!showForm && (
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              onClick={handleExportCSV}
              disabled={filters.filteredReservations.length === 0}
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Export CSV</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard/reservations/blocked-days')}
            >
              <Ban className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Jours bloqués</span>
            </Button>
            <Button onClick={handleStartCreate}>
              <Plus className="h-4 w-4" />
              <span className="ml-2">Nouvelle réservation</span>
            </Button>
          </div>
        )}
      </div>

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
                  <Input id="date" type="date" {...register('date')} disabled={isSaving} />
                  {errors.date && <p className="text-sm text-destructive">{errors.date.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Heure *</Label>
                  <Input id="time" type="time" {...register('time')} disabled={isSaving} />
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

      {/* Capacity Indicator */}
      {!showForm && (
        <CapacityIndicator
          currentGuests={capacity.currentGuests}
          maxCapacity={capacity.maxCapacity}
        />
      )}

      {/* Quick Filters */}
      {!showForm && <QuickFilters filters={quickFilters} onClearAll={filters.clearAllFilters} />}

      {/* Search */}
      {!showForm && (
        <SearchWithSuggestions
          value={filters.searchTerm}
          onChange={filters.setSearchTerm}
          suggestions={filters.suggestions}
          placeholder="Rechercher par nom, email ou téléphone..."
        />
      )}

      {/* Advanced Filters */}
      {!showForm && (
        <Collapsible open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm">
              {showAdvancedFilters ? 'Masquer' : 'Afficher'} les filtres avancés
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <Card>
              <CardContent className="pt-6 space-y-4">
                {/* Status Filters */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Statut</Label>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant={filters.statusFilter === '' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => filters.setStatusFilter('')}
                    >
                      Toutes ({reservations.length})
                    </Button>
                    {Object.entries(statusLabels).map(([status, { label }]) => (
                      <Button
                        key={status}
                        variant={filters.statusFilter === status ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => filters.setStatusFilter(status)}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dateRangeStart">Date de début</Label>
                    <Input
                      id="dateRangeStart"
                      type="date"
                      value={filters.dateRangeStart}
                      onChange={(e) => filters.setDateRangeStart(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateRangeEnd">Date de fin</Label>
                    <Input
                      id="dateRangeEnd"
                      type="date"
                      value={filters.dateRangeEnd}
                      onChange={(e) => filters.setDateRangeEnd(e.target.value)}
                    />
                  </div>
                </div>

                {/* Guests Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="minGuests">Nombre minimum de personnes</Label>
                    <Input
                      id="minGuests"
                      type="number"
                      min="1"
                      value={filters.minGuests}
                      onChange={(e) => filters.setMinGuests(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxGuests">Nombre maximum de personnes</Label>
                    <Input
                      id="maxGuests"
                      type="number"
                      min="1"
                      value={filters.maxGuests}
                      onChange={(e) => filters.setMaxGuests(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* View Mode Toggle */}
      {!showForm && (
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="flex-1 sm:flex-none"
          >
            <List className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Liste</span>
          </Button>
          <Button
            variant={viewMode === 'calendar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('calendar')}
            className="flex-1 sm:flex-none"
          >
            <CalendarIcon className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Calendrier</span>
          </Button>
        </div>
      )}

      {/* Calendar Stats */}
      {!showForm && viewMode === 'calendar' && (
        <CalendarStats
          reservations={filters.filteredReservations}
          currentMonth={currentMonth}
          maxCapacity={50}
          averagePrice={25}
        />
      )}

      {/* Calendar View Type Toggle */}
      {!showForm && viewMode === 'calendar' && (
        <div className="flex gap-2">
          <Button
            variant={calendarViewType === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCalendarViewType('month')}
          >
            Mois
          </Button>
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
              maxCapacity={50}
            />
          )}

          {calendarViewType === 'week' && (
            <WeekView
              reservations={filters.filteredReservations}
              currentWeek={currentWeek}
              onWeekChange={setCurrentWeek}
              onReservationClick={handleReservationClickFromCalendar}
            />
          )}

          {calendarViewType === 'day' && (
            <DayView
              reservations={filters.filteredReservations}
              currentDay={currentDay}
              onDayChange={setCurrentDay}
              onReservationClick={handleReservationClickFromCalendar}
              onQuickCreate={handleQuickCreateFromDay}
              maxCapacity={50}
            />
          )}
        </>
      )}

      {!showForm && viewMode === 'list' && (
        <ReservationsListView
          reservations={filters.filteredReservations}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          onEdit={handleStartEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Email Confirmation Modal */}
      {emailConfirmationModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Confirmer l&apos;action</h3>
              <p className="mt-2 text-sm text-gray-600">
                Voulez-vous envoyer un email de confirmation au client ?
              </p>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="sendEmailCheckbox"
                checked={sendEmail}
                onChange={(e) => setSendEmail(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="sendEmailCheckbox" className="text-sm text-gray-700">
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
