'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { OpeningHours, DaySchedule, TimeSlot } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, X } from 'lucide-react';

const DAYS: Array<keyof OpeningHours> = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const DAY_LABELS: Record<keyof OpeningHours, string> = {
  monday: 'Lundi',
  tuesday: 'Mardi',
  wednesday: 'Mercredi',
  thursday: 'Jeudi',
  friday: 'Vendredi',
  saturday: 'Samedi',
  sunday: 'Dimanche',
};

export default function OpeningHoursPage() {
  const router = useRouter();
  const [openingHours, setOpeningHours] = useState<OpeningHours | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchOpeningHours();
  }, []);

  const fetchOpeningHours = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getMyRestaurant();
      setOpeningHours(response.restaurant.openingHours);
    } catch (err) {
      console.error('Error fetching opening hours:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleClosed = (day: keyof OpeningHours) => {
    if (!openingHours) return;

    setOpeningHours({
      ...openingHours,
      [day]: {
        ...openingHours[day],
        closed: !openingHours[day].closed,
      },
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
      [day]: {
        ...openingHours[day],
        slots: openingHours[day].slots.filter((_, i) => i !== index),
      },
    });
  };

  const handleSlotChange = (
    day: keyof OpeningHours,
    index: number,
    field: 'start' | 'end',
    value: string
  ) => {
    if (!openingHours) return;

    const newSlots = [...openingHours[day].slots];
    newSlots[index] = { ...newSlots[index], [field]: value };

    setOpeningHours({
      ...openingHours,
      [day]: {
        ...openingHours[day],
        slots: newSlots,
      },
    });
  };

  const handleSave = async () => {
    if (!openingHours) return;

    try {
      setIsSaving(true);
      setSuccessMessage('');
      await apiClient.updateOpeningHours(openingHours);
      setSuccessMessage('Horaires enregistrés avec succès !');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !openingHours) {
    return <div className="text-muted-foreground">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/dashboard/settings')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Horaires d&apos;ouverture</h1>
          <p className="mt-2 text-gray-600">
            Définissez vos horaires pour chaque jour de la semaine
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {DAYS.map((day) => (
          <Card key={day}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{DAY_LABELS[day]}</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant={openingHours[day].closed ? 'destructive' : 'outline'}
                    size="sm"
                    onClick={() => handleToggleClosed(day)}
                  >
                    {openingHours[day].closed ? 'Fermé' : 'Ouvert'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            {!openingHours[day].closed && (
              <CardContent className="space-y-3">
                {openingHours[day].slots.map((slot, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={slot.start}
                        onChange={(e) => handleSlotChange(day, index, 'start', e.target.value)}
                        className="w-32"
                      />
                      <span className="text-muted-foreground">-</span>
                      <Input
                        type="time"
                        value={slot.end}
                        onChange={(e) => handleSlotChange(day, index, 'end', e.target.value)}
                        className="w-32"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSlot(day, index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddSlot(day)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un créneau
                </Button>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {successMessage && (
        <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">
          {successMessage}
        </div>
      )}

      <div className="flex gap-2">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Enregistrement...' : 'Enregistrer les horaires'}
        </Button>
      </div>
    </div>
  );
}
