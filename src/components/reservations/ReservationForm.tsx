'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { X, Search, Minus, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Restaurant } from '@/types';
import { getAvailableTimeSlots } from '@/store/restaurantStore';
import { apiClient } from '@/lib/api';

const DAY_NAMES = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'] as const;
const MONTH_NAMES = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'] as const;

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

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: 'En attente', color: 'bg-amber-100 text-amber-800' },
  confirmed: { label: 'Confirmée', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Annulée', color: 'bg-red-100 text-red-800' },
  completed: { label: 'Terminée', color: 'bg-blue-100 text-blue-800' },
};

interface CustomerSuggestion {
  _id: string;
  name: string;
  email: string;
  phone: string;
  totalReservations: number;
  lastVisit: string | null;
}

interface ReservationFormProps {
  form: UseFormReturn<FormData>;
  restaurant: Restaurant | null;
  editing: boolean;
  isSaving: boolean;
  onCancel: () => void;
  onSubmit: (data: FormData) => void;
}

export function ReservationForm({
  form,
  restaurant,
  editing,
  isSaving,
  onCancel,
  onSubmit,
}: ReservationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = form;

  const selectedFormDate = watch('date');
  const customerName = watch('customerName');
  const numberOfGuests = watch('numberOfGuests') || '1';

  const [customerSearch, setCustomerSearch] = useState('');
  const [suggestions, setSuggestions] = useState<CustomerSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (customerSearch.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const result = await apiClient.customers.searchCustomers(customerSearch);
        setSuggestions(result.customers);
        setShowSuggestions(result.customers.length > 0);
      } catch {
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [customerSearch]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectCustomer = (cust: CustomerSuggestion) => {
    setValue('customerName', cust.name);
    setValue('customerEmail', cust.email);
    setValue('customerPhone', cust.phone);
    setCustomerSearch('');
    setSelectedCustomerId(cust._id);
    setShowSuggestions(false);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('customerName', e.target.value);
    setCustomerSearch(e.target.value);
    setSelectedCustomerId(null);
  };

  const dateCards = useMemo(() => {
    const cards = [];
    const today = new Date();
    for (let i = 0; i < 60; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      cards.push({
        iso: d.toISOString().split('T')[0],
        day: d.getDate(),
        dayName: DAY_NAMES[d.getDay()],
        month: MONTH_NAMES[d.getMonth()],
        isToday: i === 0,
      });
    }
    return cards;
  }, []);

  const handleDateSelect = (iso: string) => {
    setValue('date', iso);
    setValue('time', '');
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-light text-[#2A2A2A]">
            {editing ? 'Modifier la réservation' : 'Nouvelle réservation'}
          </h2>
          {editing && restaurant && (
            <p className="text-xs text-gray-400 mt-0.5">{restaurant.name}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="w-10 h-10 rounded-full hover:bg-gray-50 flex items-center justify-center transition-colors"
        >
          <X className="h-5 w-5 text-gray-400" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        {/* ===== STEP 1: Date & Time & Guests ===== */}
        <div className="space-y-5">
          {/* Date selector */}
          <div>
            <Label className="text-xs font-medium text-[#2A2A2A] mb-2 block">Date</Label>
            <div className="overflow-x-auto no-scrollbar -mx-2 px-2" style={{ WebkitOverflowScrolling: 'touch' }}>
              <div className="flex gap-1.5 snap-x snap-mandatory">
                {dateCards.map((d) => {
                  const isSelected = selectedFormDate === d.iso;
                  return (
                    <button
                      key={d.iso}
                      type="button"
                      onClick={() => handleDateSelect(d.iso)}
                      disabled={isSaving}
                      className={`flex-shrink-0 snap-start w-[52px] flex flex-col items-center py-2 rounded-xl transition-all duration-200 border ${
                        isSelected
                          ? 'border-transparent text-white shadow-md scale-105 bg-[#0066FF]'
                          : 'border-gray-100 hover:border-gray-200 bg-white'
                      }`}
                    >
                      <span className="text-[10px] uppercase tracking-wider font-medium opacity-70">
                        {d.dayName}
                      </span>
                      <span className="text-base font-semibold my-0.5">{d.day}</span>
                      <span className="text-[10px] opacity-70">{d.month}</span>
                      {d.isToday && !isSelected && (
                        <span className="w-1 h-1 rounded-full mt-0.5 bg-[#0066FF]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date.message}</p>}
            <input type="hidden" {...register('date')} />
          </div>

          {/* Time + Guests row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Time slot */}
            <div>
              <Label className="text-xs font-medium text-[#2A2A2A] mb-2 block">Heure</Label>
              {selectedFormDate &&
              restaurant?.reservationConfig?.useOpeningHours ? (
                <TimeSlotChips
                  selectedFormDate={selectedFormDate}
                  value={watch('time')}
                  onChange={(t) => setValue('time', t)}
                  isSaving={isSaving}
                  restaurant={restaurant}
                />
              ) : (
                <input
                  type="time"
                  {...register('time')}
                  disabled={isSaving}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] transition-all"
                />
              )}
              {errors.time && <p className="text-xs text-red-500 mt-1">{errors.time.message}</p>}
            </div>

            {/* Guests */}
            <div>
              <Label className="text-xs font-medium text-[#2A2A2A] mb-2 block">Personnes</Label>
              <div className="flex items-center justify-center gap-3 border border-gray-200 rounded-xl p-2">
                <button
                  type="button"
                  onClick={() => {
                    const v = Math.max(1, parseInt(numberOfGuests || '1') - 1);
                    setValue('numberOfGuests', String(v));
                  }}
                  disabled={isSaving || parseInt(numberOfGuests || '1') <= 1}
                  className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:border-gray-300 transition-colors disabled:opacity-30"
                >
                  <Minus className="h-3.5 w-3.5 text-gray-500" />
                </button>
                <span className="text-xl font-light text-[#2A2A2A] min-w-[44px] text-center tabular-nums">
                  {numberOfGuests}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const v = Math.min(20, parseInt(numberOfGuests || '1') + 1);
                    setValue('numberOfGuests', String(v));
                  }}
                  disabled={isSaving || parseInt(numberOfGuests || '1') >= 20}
                  className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:border-gray-300 transition-colors disabled:opacity-30"
                >
                  <Plus className="h-3.5 w-3.5 text-gray-500" />
                </button>
              </div>
              {errors.numberOfGuests && (
                <p className="text-xs text-red-500 mt-1">{errors.numberOfGuests.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="h-px bg-gray-50" />

        {/* ===== STEP 2: Customer Info ===== */}
        <div className="space-y-4">
          <div className="relative" ref={suggestionsRef}>
            <Label htmlFor="customerName" className="text-xs font-medium text-[#2A2A2A] mb-1.5 block">
              Nom du client
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                id="customerName"
                type="text"
                value={customerName}
                onChange={handleNameChange}
                disabled={isSaving}
                placeholder="Rechercher un client existant..."
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] transition-all"
                autoComplete="off"
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 animate-spin text-gray-400" />
              )}
            </div>
            {errors.customerName && (
              <p className="text-xs text-red-500 mt-1">{errors.customerName.message}</p>
            )}

            {/* Suggestions dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden">
                {suggestions.map((cust) => (
                  <button
                    key={cust._id}
                    type="button"
                    onClick={() => selectCustomer(cust)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center justify-between group"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-[#2A2A2A] truncate">
                        {cust.name}
                      </div>
                      <div className="text-xs text-gray-400 truncate">{cust.email}</div>
                    </div>
                    <div className="flex-shrink-0 text-right ml-3">
                      <div className="text-xs text-gray-500">
                        {cust.totalReservations} résa{cust.totalReservations > 1 ? 's' : ''}
                      </div>
                      {cust.lastVisit && (
                        <div className="text-[10px] text-gray-300">
                          {new Date(cust.lastVisit).toLocaleDateString('fr-FR')}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="customerEmail"
                className="text-xs font-medium text-[#2A2A2A] mb-1.5 block"
              >
                Email
              </Label>
              <input
                id="customerEmail"
                type="email"
                {...register('customerEmail')}
                disabled={isSaving}
                placeholder="client@exemple.fr"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] transition-all"
              />
              {errors.customerEmail && (
                <p className="text-xs text-red-500 mt-1">{errors.customerEmail.message}</p>
              )}
            </div>
            <div>
              <Label
                htmlFor="customerPhone"
                className="text-xs font-medium text-[#2A2A2A] mb-1.5 block"
              >
                Téléphone
              </Label>
              <input
                id="customerPhone"
                type="tel"
                {...register('customerPhone')}
                disabled={isSaving}
                placeholder="06 12 34 56 78"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] transition-all"
              />
              {errors.customerPhone && (
                <p className="text-xs text-red-500 mt-1">{errors.customerPhone.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="h-px bg-gray-50" />

        {/* ===== Status + Notes ===== */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="status" className="text-xs font-medium text-[#2A2A2A] mb-1.5 block">
              Statut
            </Label>
            <div className="flex gap-1.5 flex-wrap">
              {Object.entries(statusLabels)
                .filter(([value]) => (editing ? true : value === 'pending' || value === 'confirmed'))
                .map(([value, { label, color }]) => {
                const isSelected = watch('status') === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setValue('status', value as FormData['status'])}
                    disabled={isSaving}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? `${color} ring-2 ring-offset-1 ring-[#0066FF]/30`
                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <Label htmlFor="notes" className="text-xs font-medium text-[#2A2A2A] mb-1.5 block">
              Notes
            </Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Notes internes..."
              rows={2}
              disabled={isSaving}
              className="text-xs min-h-[60px] resize-none rounded-xl border-gray-200 focus:ring-[#0066FF]/20 focus:border-[#0066FF]"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSaving}
            className="flex-1 rounded-xl"
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={isSaving}
            className="flex-1 rounded-xl bg-[#0066FF] hover:bg-[#0052CC]"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Enregistrement...
              </>
            ) : editing ? (
              'Modifier'
            ) : (
              'Valider'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

function TimeSlotChips({
  selectedFormDate,
  value,
  onChange,
  isSaving,
  restaurant,
}: {
  selectedFormDate: string;
  value: string;
  onChange: (time: string) => void;
  isSaving: boolean;
  restaurant: Restaurant;
}) {
  const date = new Date(selectedFormDate);
  const dayOfWeek = date.getDay();
  const availableSlots = getAvailableTimeSlots(restaurant, dayOfWeek);
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayName = dayNames[dayOfWeek] as keyof typeof restaurant.openingHours;
  const isClosed = restaurant.openingHours[dayName]?.closed;

  if (isClosed) {
    return (
      <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
        <p className="text-xs text-amber-700">Fermé ce jour</p>
      </div>
    );
  }

  if (availableSlots.length === 0) {
    return (
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={isSaving}
        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]"
      />
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1.5 max-h-[160px] overflow-y-auto">
      {availableSlots.map((slot) => {
        const isSelected = value === slot;
        return (
          <button
            key={slot}
            type="button"
            onClick={() => onChange(slot)}
            disabled={isSaving}
            className={`py-2 px-1 rounded-lg text-xs font-medium transition-all ${
              isSelected
                ? 'bg-[#0066FF] text-white shadow-sm'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            {slot}
          </button>
        );
      })}
    </div>
  );
}
