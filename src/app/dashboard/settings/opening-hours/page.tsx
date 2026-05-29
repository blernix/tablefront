'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { OpeningHours, DaySchedule, TimeSlot } from '@/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Minus, Clock, Check, Loader2 } from 'lucide-react';

const DAYS: Array<keyof OpeningHours> = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
];

const DAY_LABELS: Record<keyof OpeningHours, string> = {
  monday: 'Lundi', tuesday: 'Mardi', wednesday: 'Mercredi',
  thursday: 'Jeudi', friday: 'Vendredi', saturday: 'Samedi', sunday: 'Dimanche',
};

const DAY_SHORT: Record<keyof OpeningHours, string> = {
  monday: 'Lun', tuesday: 'Mar', wednesday: 'Mer',
  thursday: 'Jeu', friday: 'Ven', saturday: 'Sam', sunday: 'Dim',
};

export default function OpeningHoursPage() {
  const router = useRouter();
  const [openingHours, setOpeningHours] = useState<OpeningHours | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const isFetchingRef = useRef(false);

  useEffect(() => {
    fetchOpeningHours();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOpeningHours = async () => {
    if (isFetchingRef.current) return;
    try {
      isFetchingRef.current = true;
      setIsLoading(true);
      const response = await apiClient.getMyRestaurant();
      setOpeningHours(response.restaurant.openingHours);
    } catch (err) {
      console.error('Error fetching opening hours:', err);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  };

  const handleToggleClosed = (day: keyof OpeningHours) => {
    if (!openingHours) return;
    setOpeningHours({
      ...openingHours,
      [day]: { ...openingHours[day], closed: !openingHours[day].closed },
    });
  };

  const handleAddSlot = (day: keyof OpeningHours) => {
    if (!openingHours) return;
    setOpeningHours({
      ...openingHours,
      [day]: {
        ...openingHours[day],
        slots: [...openingHours[day].slots, { start: '12:00', end: '14:00' }],
      },
    });
  };

  const handleRemoveSlot = (day: keyof OpeningHours, index: number) => {
    if (!openingHours) return;
    setOpeningHours({
      ...openingHours,
      [day]: { ...openingHours[day], slots: openingHours[day].slots.filter((_, i) => i !== index) },
    });
  };

  const handleSlotChange = (day: keyof OpeningHours, index: number, field: 'start' | 'end', value: string) => {
    if (!openingHours) return;
    const newSlots = [...openingHours[day].slots];
    newSlots[index] = { ...newSlots[index], [field]: value };
    setOpeningHours({
      ...openingHours,
      [day]: { ...openingHours[day], slots: newSlots },
    });
  };

  const handleSave = async () => {
    if (!openingHours) return;
    try {
      setIsSaving(true);
      setSuccessMessage('');
      await apiClient.updateOpeningHours(openingHours);
      setSuccessMessage('Horaires enregistrés ✓');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !openingHours) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-slate-200 rounded-lg w-32 hidden md:block animate-pulse" />
        <div className="h-8 bg-slate-200 rounded-lg w-48 animate-pulse" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-slate-200 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Back button — desktop only */}
      <div className="hidden md:block">
        <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/settings')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-[28px] font-bold text-[#000000] leading-tight tracking-tight md:text-3xl">Horaires d&apos;ouverture</h1>
        <p className="mt-1 text-[15px] text-[#8E8E93] md:text-gray-600">Définissez vos horaires pour chaque jour</p>
      </div>

      {/* Success toast */}
      {successMessage && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4 text-[15px] font-medium text-emerald-700 text-center md:rounded-xl md:text-sm">
          {successMessage}
        </div>
      )}

      {/* Days */}
      <div className="space-y-2 md:space-y-3">
        {DAYS.map((day) => {
          const schedule = openingHours[day];
          const isClosed = schedule.closed;

          return (
            <div key={day} className="bg-white rounded-2xl border border-[#E5E5EA] overflow-hidden md:rounded-xl">
              {/* Day header with toggle */}
              <div className="flex items-center justify-between p-4 md:p-5">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-semibold text-[#8E8E93] uppercase w-8 md:hidden">
                    {DAY_SHORT[day]}
                  </span>
                  <span className="hidden md:inline text-[15px] font-medium text-[#000000] md:text-base">
                    {DAY_LABELS[day]}
                  </span>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={!isClosed}
                  onClick={() => handleToggleClosed(day)}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200 ${
                    !isClosed ? 'bg-[#0066FF]' : 'bg-[#E5E5EA]'
                  }`}
                >
                  <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-sm transition duration-200 ${
                    !isClosed ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {/* Slots */}
              {!isClosed && (
                <div className="border-t border-[#E5E5EA] p-4 md:p-5 space-y-3">
                  {schedule.slots.length === 0 && (
                    <p className="text-[13px] text-[#8E8E93] text-center py-2 md:text-sm">Aucun créneau — ajoutez-en un</p>
                  )}

                  {schedule.slots.map((slot, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="flex-1 flex items-center gap-2">
                        <div className="relative flex-1">
                          <input
                            type="time"
                            value={slot.start}
                            onChange={(e) => handleSlotChange(day, index, 'start', e.target.value)}
                            className="w-full h-11 px-3 rounded-xl border border-[#E5E5EA] bg-white text-[15px] text-[#000000] focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/20 md:h-10 md:text-sm"
                          />
                        </div>
                        <span className="text-[#8E8E93] font-medium">–</span>
                        <div className="relative flex-1">
                          <input
                            type="time"
                            value={slot.end}
                            onChange={(e) => handleSlotChange(day, index, 'end', e.target.value)}
                            className="w-full h-11 px-3 rounded-xl border border-[#E5E5EA] bg-white text-[15px] text-[#000000] focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/20 md:h-10 md:text-sm"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveSlot(day, index)}
                        className="h-11 w-11 flex items-center justify-center rounded-xl text-[#8E8E93] active:bg-[#F2F2F7] active:text-red-500 transition-colors flex-shrink-0 md:h-10 md:w-10"
                        aria-label="Supprimer le créneau"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={() => handleAddSlot(day)}
                    className="flex items-center gap-2 w-full py-2.5 justify-center rounded-xl text-[13px] font-medium text-[#0066FF] active:bg-[#0066FF]/5 transition-colors md:text-sm"
                  >
                    <Plus className="h-4 w-4" />
                    Ajouter un créneau
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Save button */}
      <div className="pb-4 md:pb-0">
        <Button onClick={handleSave} disabled={isSaving} className="w-full h-12 rounded-xl text-[15px] font-semibold md:w-auto md:h-10 md:text-sm">
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
          {isSaving ? 'Enregistrement...' : 'Enregistrer les horaires'}
        </Button>
      </div>
    </div>
  );
}
