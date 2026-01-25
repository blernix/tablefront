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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, X, Calendar as CalendarIcon, Users, Clock, Ban, Check, XCircle, CheckCircle, List, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import CalendarView from '@/components/reservations/CalendarView';

const formSchema = z.object({
  customerName: z.string().min(1, 'Le nom est requis'),
  customerEmail: z.string().email('Email invalide'),
  customerPhone: z.string().min(1, 'Le téléphone est requis'),
  date: z.string().min(1, 'La date est requise'),
  time: z.string().min(1, 'L\'heure est requise'),
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
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRangeStart, setDateRangeStart] = useState('');
  const [dateRangeEnd, setDateRangeEnd] = useState('');
  const [minGuests, setMinGuests] = useState('');
  const [maxGuests, setMaxGuests] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; reservation: Reservation | null }>({
    show: false,
    reservation: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);

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
  const [sendEmail, setSendEmail] = useState(true); // Default: send email

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

  // Load initial reservations and handle loading state
  useEffect(() => {
    const loadInitialReservations = async () => {
      try {
        setIsLoading(true);
        await refreshReservations();
      } catch (err) {
        console.error('Error loading reservations:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialReservations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount - refreshReservations is from hook with internal protection

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

  const validateFormData = (data: FormData): boolean => {
    const numberOfGuests = parseInt(data.numberOfGuests, 10);
    if (isNaN(numberOfGuests) || numberOfGuests < 1) {
      alert('Le nombre de personnes doit être au moins 1');
      return false;
    }
    return true;
  };

  const onSubmit = async (data: FormData) => {
    if (!validateFormData(data)) {
      return;
    }

    // Show email confirmation modal
    const action = editingReservation ? 'update' : 'create';
    openEmailConfirmationModal(
      action,
      editingReservation || undefined,
      undefined,
      data,
      async () => {
        // This callback will be executed after confirmation
        handleCancelForm();
      }
    );
  };

  const handleDelete = async () => {
    if (!deleteModal.reservation) return;

    try {
      setIsDeleting(true);
      await apiClient.deleteReservation(deleteModal.reservation._id);
      toast.success('Réservation supprimée avec succès');
      setDeleteModal({ show: false, reservation: null });
      refreshReservations();
    } catch (err) {
      toast.error('Erreur lors de la suppression');
    } finally {
      setIsDeleting(false);
    }
  };

  const openDeleteModal = (reservation: Reservation) => {
    setDeleteModal({ show: true, reservation });
  };

  const closeDeleteModal = () => {
    if (!isDeleting) {
      setDeleteModal({ show: false, reservation: null });
    }
  };

  // Email confirmation modal functions
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
    setSendEmail(true); // Reset to default
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
    
    if (!reservation && (action === 'status' || action === 'update' || action === 'delete')) {
      toast.error('Réservation non trouvée');
      return;
    }

    try {
      switch (action) {
        case 'status':
          if (reservation && status) {
            await apiClient.updateReservation(reservation._id, { 
              status, 
              sendEmail 
            });
            const statusLabels = {
              confirmed: 'confirmée',
              cancelled: 'annulée',
              completed: 'terminée',
              pending: 'mise à jour',
            };
            toast.success(`Réservation de ${reservation.customerName} ${statusLabels[status]}${sendEmail ? ' - Email envoyé' : ''}`);
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
            toast.success(`Réservation supprimée${sendEmail ? ' - Email envoyé' : ''}`);
          }
          break;
      }

      // Execute callback if provided
      if (callback) {
        await callback();
      }

      // Refresh reservations
      refreshReservations();
      closeEmailConfirmationModal();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors de l\'opération');
    }
  };

  const handleQuickStatusChange = (
    reservation: Reservation,
    newStatus: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  ) => {
    openEmailConfirmationModal('status', reservation, newStatus);
  };


  // Apply all filters
  const filteredReservations = reservations.filter(r => {
    // Filter by status
    if (statusFilter && r.status !== statusFilter) return false;

    // Filter by selected date (from calendar)
    if (selectedDate && viewMode === 'list') {
      const resDate = new Date(r.date).toISOString().split('T')[0];
      const selDate = selectedDate.toISOString().split('T')[0];
      if (resDate !== selDate) return false;
    }

    // Filter by date range
    if (dateRangeStart) {
      const resDate = new Date(r.date).toISOString().split('T')[0];
      if (resDate < dateRangeStart) return false;
    }
    if (dateRangeEnd) {
      const resDate = new Date(r.date).toISOString().split('T')[0];
      if (resDate > dateRangeEnd) return false;
    }

    // Filter by search term (name, email, phone)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesName = r.customerName.toLowerCase().includes(term);
      const matchesEmail = r.customerEmail.toLowerCase().includes(term);
      const matchesPhone = r.customerPhone.toLowerCase().includes(term);
      if (!matchesName && !matchesEmail && !matchesPhone) return false;
    }

    // Filter by number of guests
    if (minGuests && r.numberOfGuests < parseInt(minGuests)) return false;
    if (maxGuests && r.numberOfGuests > parseInt(maxGuests)) return false;

    return true;
  });

  const reservationsByDate = filteredReservations.reduce((acc, reservation) => {
    const dateKey = reservation.date.split('T')[0];
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(reservation);
    return acc;
  }, {} as Record<string, Reservation[]>);

  const sortedDates = Object.keys(reservationsByDate).sort();

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setViewMode('list'); // Switch to list view when date is selected
  };

  const handleExportCSV = () => {
    if (filteredReservations.length === 0) {
      toast.error('Aucune réservation à exporter');
      return;
    }

    // CSV Headers
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
      'Date de création'
    ];

    // CSV Rows
    const rows = filteredReservations.map(r => [
      r._id,
      r.customerName,
      r.customerEmail,
      r.customerPhone,
      format(new Date(r.date), 'dd/MM/yyyy'),
      r.time,
      r.numberOfGuests.toString(),
      statusLabels[r.status].label,
      r.notes || '',
      format(new Date(r.createdAt), 'dd/MM/yyyy HH:mm')
    ]);

    // Build CSV content
    const csvContent = [
      headers.join(';'),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(';'))
    ].join('\n');

    // Create download link
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

    toast.success(`${filteredReservations.length} réservation(s) exportée(s)`);
  };

  if (isLoading && !showForm) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-20 bg-slate-200 rounded-lg" />
        <div className="h-40 bg-slate-200 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
         <div>
           <div className="flex items-center gap-2">
             <h1 className="text-3xl font-semibold text-slate-900">Réservations</h1>
             <div className="flex items-center gap-2">
               <span
                 className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                   isConnected
                     ? 'bg-green-100 text-green-800'
                     : 'bg-yellow-100 text-yellow-800'
                 }`}
                 title={isConnected ? 'Connecté en temps réel' : 'Connexion temps réel inactive'}
               >
                 <span className={`w-2 h-2 rounded-full mr-1 ${isConnected ? 'bg-green-500' : 'bg-yellow-500'}`} />
                 {isConnected ? 'Temps réel' : 'Hors ligne'}
               </span>
             </div>
           </div>
           <p className="mt-2 text-slate-600">
             {filteredReservations.length} réservation{filteredReservations.length > 1 ? 's' : ''} {statusFilter && `• ${statusLabels[statusFilter as keyof typeof statusLabels]?.label || 'Filtrées'}`}
           </p>
         </div>
        {!showForm && (
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              onClick={handleExportCSV}
              disabled={filteredReservations.length === 0}
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export CSV</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard/reservations/blocked-days')}
            >
              <Ban className="h-4 w-4" />
              <span className="hidden sm:inline">Jours bloqués</span>
            </Button>
            <Button onClick={handleStartCreate}>
              <Plus className="h-4 w-4" />
              Nouvelle réservation
            </Button>
          </div>
        )}
      </div>

      {/* View Mode & Filters */}
      {!showForm && (
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>Filtres</CardTitle>
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
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Status Filters */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Statut</Label>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={statusFilter === '' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter('')}
                  >
                    Toutes ({reservations.length})
                  </Button>
                  {Object.entries(statusLabels).map(([status, { label }]) => (
                    <Button
                      key={status}
                      variant={statusFilter === status ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setStatusFilter(status)}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Search Bar */}
              <div>
                <Label htmlFor="search" className="text-sm font-medium mb-2 block">
                  Rechercher
                </Label>
                <Input
                  id="search"
                  type="text"
                  placeholder="Rechercher par nom, email ou téléphone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md"
                />
              </div>

              {/* Date Range Filter */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dateStart" className="text-sm font-medium mb-2 block">
                    Date de début
                  </Label>
                  <Input
                    id="dateStart"
                    type="date"
                    value={dateRangeStart}
                    onChange={(e) => setDateRangeStart(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="dateEnd" className="text-sm font-medium mb-2 block">
                    Date de fin
                  </Label>
                  <Input
                    id="dateEnd"
                    type="date"
                    value={dateRangeEnd}
                    onChange={(e) => setDateRangeEnd(e.target.value)}
                  />
                </div>
              </div>

              {/* Guests Filter */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minGuests" className="text-sm font-medium mb-2 block">
                    Nombre de personnes min
                  </Label>
                  <Input
                    id="minGuests"
                    type="number"
                    min="1"
                    placeholder="Ex: 2"
                    value={minGuests}
                    onChange={(e) => setMinGuests(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="maxGuests" className="text-sm font-medium mb-2 block">
                    Nombre de personnes max
                  </Label>
                  <Input
                    id="maxGuests"
                    type="number"
                    min="1"
                    placeholder="Ex: 10"
                    value={maxGuests}
                    onChange={(e) => setMaxGuests(e.target.value)}
                  />
                </div>
              </div>

              {/* Active Filters Summary */}
              {(selectedDate || searchTerm || dateRangeStart || dateRangeEnd || minGuests || maxGuests) && viewMode === 'list' && (
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
                  <span className="text-sm font-medium">Filtres actifs:</span>
                  {selectedDate && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => setSelectedDate(null)}
                    >
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      {format(selectedDate, 'dd/MM/yyyy')}
                      <X className="h-3 w-3 ml-1" />
                    </Button>
                  )}
                  {searchTerm && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => setSearchTerm('')}
                    >
                      Recherche: &quot;{searchTerm}&quot;
                      <X className="h-3 w-3 ml-1" />
                    </Button>
                  )}
                  {dateRangeStart && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => setDateRangeStart('')}
                    >
                      Du: {format(new Date(dateRangeStart), 'dd/MM/yyyy')}
                      <X className="h-3 w-3 ml-1" />
                    </Button>
                  )}
                  {dateRangeEnd && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => setDateRangeEnd('')}
                    >
                      Au: {format(new Date(dateRangeEnd), 'dd/MM/yyyy')}
                      <X className="h-3 w-3 ml-1" />
                    </Button>
                  )}
                  {minGuests && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => setMinGuests('')}
                    >
                      Min: {minGuests} pers.
                      <X className="h-3 w-3 ml-1" />
                    </Button>
                  )}
                  {maxGuests && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => setMaxGuests('')}
                    >
                      Max: {maxGuests} pers.
                      <X className="h-3 w-3 ml-1" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedDate(null);
                      setSearchTerm('');
                      setDateRangeStart('');
                      setDateRangeEnd('');
                      setMinGuests('');
                      setMaxGuests('');
                    }}
                    className="ml-auto"
                  >
                    Effacer tous les filtres
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
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
                  <Input
                    id="customerName"
                    {...register('customerName')}
                    disabled={isSaving}
                  />
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
                  <Input
                    id="customerPhone"
                    {...register('customerPhone')}
                    disabled={isSaving}
                  />
                  {errors.customerPhone && (
                    <p className="text-sm text-destructive">{errors.customerPhone.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    {...register('date')}
                    disabled={isSaving}
                  />
                  {errors.date && (
                    <p className="text-sm text-destructive">{errors.date.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Heure *</Label>
                  <Input
                    id="time"
                    type="time"
                    {...register('time')}
                    disabled={isSaving}
                  />
                  {errors.time && (
                    <p className="text-sm text-destructive">{errors.time.message}</p>
                  )}
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

      {/* Calendar View */}
      {!showForm && viewMode === 'calendar' && (
        <CalendarView
          reservations={reservations}
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          currentMonth={currentMonth}
          onMonthChange={setCurrentMonth}
        />
      )}

      {/* Reservations list */}
      {!showForm && viewMode === 'list' && (
        <>
          {sortedDates.length === 0 ? (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">
                  Aucune réservation trouvée
                </p>
              </CardContent>
            </Card>
          ) : (
            sortedDates.map(dateKey => (
              <Card key={dateKey}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    {formatDate(dateKey)}
                  </CardTitle>
                  <CardDescription>
                    {reservationsByDate[dateKey].length} réservation{reservationsByDate[dateKey].length > 1 ? 's' : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {reservationsByDate[dateKey]
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map(reservation => (
                      <div
                        key={reservation._id}
                        className="flex items-start gap-4 border rounded-lg p-4"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="font-semibold text-slate-900">{reservation.customerName}</span>
                            <Badge variant={statusLabels[reservation.status].variant}>
                              {statusLabels[reservation.status].label}
                            </Badge>
                          </div>
                          <div className="text-sm text-slate-600 space-y-2">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-slate-400" />
                              <span className="font-medium">{reservation.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-slate-400" />
                              {reservation.numberOfGuests} {reservation.numberOfGuests > 1 ? 'personnes' : 'personne'}
                            </div>
                            <div className="text-slate-500">
                              {reservation.customerEmail} • {reservation.customerPhone}
                            </div>
                            {reservation.notes && (
                              <div className="text-xs text-slate-500 italic mt-3 pt-3 border-t border-slate-200">
                                {reservation.notes}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          {/* Quick status actions */}
                          <div className="flex gap-1">
                             {reservation.status !== 'confirmed' && (
                               <Button
                                 variant="outline"
                                 size="sm"
                                 className="text-green-600 hover:text-green-700"
                                 onClick={() => handleQuickStatusChange(reservation, 'confirmed')}
                                 title="Confirmer"
                               >
                                 <Check className="h-4 w-4" />
                               </Button>
                             )}
                             {reservation.status !== 'cancelled' && (
                               <Button
                                 variant="outline"
                                 size="sm"
                                 className="text-red-600 hover:text-red-700"
                                 onClick={() => handleQuickStatusChange(reservation, 'cancelled')}
                                 title="Annuler"
                               >
                                 <XCircle className="h-4 w-4" />
                               </Button>
                             )}
                             {reservation.status !== 'completed' && reservation.status === 'confirmed' && (
                               <Button
                                 variant="outline"
                                 size="sm"
                                 className="text-blue-600 hover:text-blue-700"
                                 onClick={() => handleQuickStatusChange(reservation, 'completed')}
                                 title="Terminer"
                               >
                                 <CheckCircle className="h-4 w-4" />
                               </Button>
                             )}
                          </div>
                          {/* Edit/Delete actions */}
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStartEdit(reservation)}
                              title="Modifier"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openDeleteModal(reservation)}
                              title="Supprimer"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>
            ))
          )}
        </>
      )}

       {/* Delete Confirmation Modal */}
      {deleteModal.show && deleteModal.reservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  Supprimer la réservation
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Êtes-vous sûr de vouloir supprimer la réservation de{' '}
                  <span className="font-medium text-gray-900">
                    {deleteModal.reservation.customerName}
                  </span>{' '}
                  pour le {formatDate(deleteModal.reservation.date)} à{' '}
                  {deleteModal.reservation.time} ?
                </p>
                <p className="mt-2 text-sm text-red-600 font-medium">
                  Cette action est irréversible.
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1"
              >
                {isDeleting ? 'Suppression...' : 'Supprimer'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Email Confirmation Modal */}
      {emailConfirmationModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-4">
            <div className="flex items-start gap-4">
               <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                 emailConfirmationModal.action === 'delete' 
                   ? 'bg-red-100' 
                   : 'bg-blue-100'
               }`}>
                 {emailConfirmationModal.action === 'delete' ? (
                   <Trash2 className="h-6 w-6 text-red-600" />
                 ) : (
                   <Check className="h-6 w-6 text-blue-600" />
                 )}
               </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {emailConfirmationModal.action === 'create' && 'Créer la réservation'}
                  {emailConfirmationModal.action === 'update' && 'Modifier la réservation'}
                  {emailConfirmationModal.action === 'status' && 'Changer le statut'}
                  {emailConfirmationModal.action === 'delete' && 'Supprimer la réservation'}
                </h3>
                
                {/* Action description */}
                <p className="mt-2 text-sm text-gray-600">
                  {emailConfirmationModal.action === 'create' && (
                    <>Vous allez créer une réservation pour <span className="font-medium text-gray-900">{emailConfirmationModal.formData?.customerName}</span>.</>
                  )}
                  {emailConfirmationModal.action === 'update' && emailConfirmationModal.reservation && (
                    <>Vous allez modifier la réservation de <span className="font-medium text-gray-900">{emailConfirmationModal.reservation.customerName}</span>.</>
                  )}
                  {emailConfirmationModal.action === 'status' && emailConfirmationModal.reservation && emailConfirmationModal.status && (
                    <>Vous allez marquer la réservation de <span className="font-medium text-gray-900">{emailConfirmationModal.reservation.customerName}</span> comme <span className="font-medium text-gray-900">{statusLabels[emailConfirmationModal.status].label.toLowerCase()}</span>.</>
                  )}
                  {emailConfirmationModal.action === 'delete' && emailConfirmationModal.reservation && (
                    <>Vous allez supprimer la réservation de <span className="font-medium text-gray-900">{emailConfirmationModal.reservation.customerName}</span>.</>
                  )}
                </p>

                {/* Email address */}
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">Email du client:</span>
                    <span className="text-sm text-gray-600">
                      {emailConfirmationModal.action === 'create' && emailConfirmationModal.formData?.customerEmail}
                      {emailConfirmationModal.action === 'update' && emailConfirmationModal.formData?.customerEmail}
                      {(emailConfirmationModal.action === 'status' || emailConfirmationModal.action === 'delete') && 
                        emailConfirmationModal.reservation?.customerEmail}
                    </span>
                  </div>
                </div>

                {/* Email sending option */}
                <div className="mt-4 p-3 border rounded-md">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sendEmail}
                      onChange={(e) => setSendEmail(e.target.checked)}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300"
                    />
                    <span className="text-sm font-medium text-gray-900">
                      Envoyer un email de confirmation au client
                    </span>
                  </label>
                  <p className="mt-2 text-xs text-gray-500">
                    {sendEmail ? (
                      <>
                        {emailConfirmationModal.action === 'create' && 'Un email de confirmation avec les détails de la réservation sera envoyé.'}
                        {emailConfirmationModal.action === 'update' && 'Un email de mise à jour avec les nouveaux détails de la réservation sera envoyé.'}
                        {emailConfirmationModal.action === 'status' && emailConfirmationModal.status === 'confirmed' && 'Un email de confirmation avec un lien d\'annulation sera envoyé.'}
                        {emailConfirmationModal.action === 'status' && emailConfirmationModal.status === 'cancelled' && 'Un email de confirmation d\'annulation sera envoyé.'}
                        {emailConfirmationModal.action === 'status' && emailConfirmationModal.status === 'completed' && 'Un email de remerciement sera envoyé.'}
                        {emailConfirmationModal.action === 'delete' && 'Un email de confirmation de suppression sera envoyé.'}
                      </>
                    ) : (
                      'Aucun email ne sera envoyé au client. Utilisez cette option pour les modifications urgentes ou les erreurs.'
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={closeEmailConfirmationModal}
                className="flex-1"
              >
                Annuler
              </Button>
               <Button
                variant={emailConfirmationModal.action === 'delete' ? 'destructive' : 'default'}
                onClick={confirmActionWithEmail}
                className="flex-1"
              >
                {emailConfirmationModal.action === 'create' && 'Créer'}
                {emailConfirmationModal.action === 'update' && 'Modifier'}
                {emailConfirmationModal.action === 'status' && 'Confirmer'}
                {emailConfirmationModal.action === 'delete' && 'Supprimer'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
