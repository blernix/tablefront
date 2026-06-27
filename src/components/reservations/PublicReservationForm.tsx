'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Users, Minus, Plus, Clock, Loader2 } from 'lucide-react';
import { track } from '@/lib/umami';

const DAY_NAMES = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'] as const;
const MONTH_NAMES = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'] as const;

interface RestaurantInfo {
  name: string;
  address: string;
  phone: string;
  openingHours: any;
  reservationConfig: { defaultDuration: number; useOpeningHours: boolean };
  widgetConfig?: {
    primaryColor?: string;
    secondaryColor?: string;
    fontFamily?: string;
    borderRadius?: string;
  };
}

interface SlotData {
  time: string;
  guestCount: number;
  isFull: boolean;
}

interface PublicReservationFormProps {
  slug: string;
  isEmbed?: boolean;
}

export default function PublicReservationForm({ slug, isEmbed = false }: PublicReservationFormProps) {
  const [restaurant, setRestaurant] = useState<RestaurantInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [date, setDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState(2);
  const [notes, setNotes] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [consentDataProcessing, setConsentDataProcessing] = useState(false);
  const [consentMarketing, setConsentMarketing] = useState(false);

  const [availableSlots, setAvailableSlots] = useState<SlotData[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [maxCapacity, setMaxCapacity] = useState(50);
  const [dateScrollIndex, setDateScrollIndex] = useState(0);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    (async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/api/v1/public/restaurant-info`, {
          headers: { 'x-slug': slug },
        });
        if (!response.ok) throw new Error('Restaurant not found');
        const data = await response.json();
        if (!cancelled) {
          setRestaurant(data.restaurant);
          track('public-reservation-form-view', { slug });
        }
      } catch {
        if (!cancelled) setError('Impossible de charger les informations du restaurant.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [slug, API_URL]);

  useEffect(() => {
    if (!date || !slug) return;
    let cancelled = false;
    (async () => {
      try {
        setIsLoadingSlots(true);
        const response = await fetch(`${API_URL}/api/v1/public/time-slots/${date}`, {
          headers: { 'x-slug': slug },
        });
        if (!response.ok) throw new Error('Failed to fetch time slots');
        const data = await response.json();
        const guestsBySlot: Record<string, number> = data.guestsBySlot || {};
        const cap = data.maxCapacityPerSlot || 50;
        if (!cancelled) {
          setMaxCapacity(cap);
          const slots: SlotData[] = (data.slots || []).map((time: string) => ({
            time,
            guestCount: guestsBySlot[time] || 0,
            isFull: (guestsBySlot[time] || 0) >= cap,
          }));
          setAvailableSlots(slots);
          setSelectedTime('');
        }
      } catch {
        if (!cancelled) setAvailableSlots([]);
      } finally {
        if (!cancelled) setIsLoadingSlots(false);
      }
    })();
    return () => { cancelled = true; };
  }, [date, slug, API_URL]);

  const dateCards = useMemo(() => {
    const cards = [];
    const today = new Date();
    for (let i = 0; i < 60; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      cards.push({
        iso,
        day: d.getDate(),
        dayName: DAY_NAMES[d.getDay()],
        month: MONTH_NAMES[d.getMonth()],
        isToday: i === 0,
      });
    }
    return cards;
  }, []);

  const [cardsPerView, setCardsPerView] = useState(7);

  useEffect(() => {
    const update = () => setCardsPerView(window.innerWidth < 640 ? 5 : 7);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    setDateScrollIndex((prev) => Math.min(prev, Math.max(0, dateCards.length - cardsPerView)));
  }, [cardsPerView, dateCards.length]);
  const canScrollLeft = dateScrollIndex > 0;
  const maxScrollIndex = Math.max(0, dateCards.length - cardsPerView);
  const canScrollRight = dateScrollIndex < maxScrollIndex;

  const scrollDates = (direction: 'left' | 'right') => {
    setDateScrollIndex((prev) => {
      const step = cardsPerView - 1;
      const next = direction === 'left' ? Math.max(0, prev - step) : Math.min(prev + step, maxScrollIndex);
      return next;
    });
  };

  const visibleDates = dateCards.slice(dateScrollIndex, dateScrollIndex + cardsPerView);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!customerName || !customerEmail || !customerPhone || !date || !selectedTime) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    if (customerName.length < 2 || customerName.length > 100) {
      setError('Le nom doit contenir entre 2 et 100 caractères.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      setError('Veuillez entrer une adresse email valide.');
      return;
    }
    if (customerPhone.length < 10 || customerPhone.length > 20) {
      setError('Le numéro de téléphone doit contenir entre 10 et 20 caractères.');
      return;
    }
    if (numberOfGuests < 1 || numberOfGuests > 20) {
      setError('Le nombre de personnes doit être entre 1 et 20.');
      return;
    }
    if (notes.length > 500) {
      setError('Les notes ne doivent pas dépasser 500 caractères.');
      return;
    }
    if (!consentDataProcessing) {
      setError('Vous devez accepter le traitement de vos données pour continuer.');
      return;
    }
    if (honeypot) {
      setError('Une erreur est survenue. Veuillez réessayer.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(`${API_URL}/api/v1/public/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-slug': slug },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          date,
          time: selectedTime,
          numberOfGuests,
          notes: notes || undefined,
          consentDataProcessing,
          consentMarketing,
          _honeypot: honeypot,
        }),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || 'Erreur lors de la réservation');
      }
      setSuccess(true);
      track('public-reservation-form-submit', { slug });
      if (isEmbed && typeof window !== 'undefined' && window.parent !== window) {
        window.parent.postMessage({ type: 'tablemaster:close' }, '*');
      }
      setCustomerName('');
      setCustomerEmail('');
      setCustomerPhone('');
      setDate('');
      setSelectedTime('');
      setNumberOfGuests(2);
      setNotes('');
      setHoneypot('');
    } catch (err: any) {
      track('public-reservation-form-error', { slug });
      setError(err.message || 'Une erreur est survenue lors de la réservation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const primaryColor = restaurant?.widgetConfig?.primaryColor || '#0066FF';
  const secondaryColor = restaurant?.widgetConfig?.secondaryColor || '#2A2A2A';
  const fontFamily = restaurant?.widgetConfig?.fontFamily || 'system-ui, sans-serif';
  const borderRadius = restaurant?.widgetConfig?.borderRadius || '8px';

  const rootStyle = {
    fontFamily,
    '--tm-primary': primaryColor,
    '--tm-secondary': secondaryColor,
    '--tm-radius': borderRadius,
  } as React.CSSProperties;

  if (isLoading) {
    return (
      <div className="tm-root" style={rootStyle}>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin" style={{ color: primaryColor }} />
        </div>
      </div>
    );
  }

  if (error && !restaurant) {
    return (
      <div className="tm-root" style={rootStyle}>
        <div className="mx-4 mt-4 p-4 rounded-lg text-center text-sm" style={{ background: '#FEF2F2', color: '#DC2626' }}>
          {error}
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="tm-root" style={rootStyle}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-10 px-6">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }} className="w-16 h-16 mx-auto mb-5 rounded-full flex items-center justify-center text-white text-3xl" style={{ background: primaryColor }}>
            ✓
          </motion.div>
          <h2 className="text-2xl font-light mb-3" style={{ color: secondaryColor }}>Réservation confirmée</h2>
          <p className="text-sm leading-relaxed mb-6" style={{ color: '#666' }}>
            Merci {customerName}, votre réservation a été enregistrée.<br />
            Un email de confirmation sera envoyé à {customerEmail}.
          </p>
          <button onClick={() => setSuccess(false)} className="px-6 py-3 rounded-lg text-white text-sm font-medium transition-opacity hover:opacity-90" style={{ background: primaryColor, borderRadius }}>
            Faire une nouvelle réservation
          </button>
        </motion.div>
      </div>
    );
  }

  const hasNoSlots = date && !isLoadingSlots && availableSlots.length === 0;
  const isStep1Complete = !!(date && selectedTime);
  const hasAllRequired = !!(customerName && customerEmail && customerPhone && date && selectedTime);

  return (
    <div className="tm-root" style={rootStyle}>
      <div className="max-w-[480px] mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="w-10 h-1 mx-auto mb-4 rounded-full" style={{ background: primaryColor }} />
          <h1 className="text-2xl font-light tracking-tight" style={{ color: secondaryColor }}>
            {restaurant?.name}
          </h1>
          {restaurant?.address && (
            <p className="text-xs mt-1.5 font-light" style={{ color: '#999' }}>{restaurant.address}</p>
          )}
        </motion.div>

        {/* Steps indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="flex items-center gap-2 mb-8">
          {[0, 1].map((step) => {
            const isStep1Complete = date && selectedTime;
            const isCurrent = step === 0 ? !isStep1Complete : isStep1Complete;
            const isComplete = step === 0 ? isStep1Complete : (isStep1Complete && hasAllRequired);
            return (
              <div key={step} className="flex items-center gap-2 flex-1 last:flex-none">
                <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium transition-all duration-300 ${isComplete ? 'bg-[var(--tm-primary)] text-white' : isCurrent ? 'border-2 text-[var(--tm-primary)]' : 'border border-gray-200 text-gray-300'}`} style={isCurrent && !isComplete ? { borderColor: primaryColor, color: primaryColor } : isComplete ? { background: primaryColor } : {}}>
                  {isComplete ? '✓' : step + 1}
                </div>
                <span className={`text-xs font-light transition-colors duration-300 ${isCurrent || isComplete ? '' : 'text-gray-300'}`} style={{ color: isCurrent || isComplete ? secondaryColor : undefined }}>
                  {step === 0 ? 'Date & heure' : 'Vos informations'}
                </span>
                {step === 0 && <div className={`flex-1 h-px transition-colors duration-300 ${isStep1Complete ? '' : 'bg-gray-200'}`} style={{ background: isStep1Complete ? primaryColor : undefined }} />}
              </div>
            );
          })}
        </motion.div>

        <form onSubmit={handleSubmit}>
          {/* === STEP 1: Date & Time & Guests === */}
          <AnimatePresence mode="wait">
            {!isStep1Complete ? (
              <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                {/* Date selector */}
                <div>
                  <label className="block text-sm font-medium mb-3" style={{ color: secondaryColor }}>
                    Quand souhaitez-vous venir ?
                  </label>
                  <div className="relative">
                    {canScrollLeft && (
                      <button type="button" onClick={() => scrollDates('left')} className="absolute left-0 top-1/2 -translate-y-1/2 -ml-2.5 z-20 w-7 h-7 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center hover:border-gray-400 transition-colors">
                        <ChevronLeft className="h-3.5 w-3.5 text-gray-500" />
                      </button>
                    )}
                    <div className="overflow-hidden px-3 relative">
                      {canScrollLeft && (
                        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                      )}
                      {canScrollRight && (
                        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
                      )}
                      <motion.div className="flex gap-1.5" layout>
                        <AnimatePresence mode="popLayout">
                          {visibleDates.map((d) => {
                            const isSelected = date === d.iso;
                            return (
                              <motion.button
                                key={d.iso}
                                type="button"
                                layout
                                initial={{ opacity: 0, scale: 0.85 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.85 }}
                                onClick={() => { setDate(d.iso); setSelectedTime(''); }}
                                className={`flex-1 min-w-0 flex flex-col items-center py-2 sm:py-2.5 rounded-xl transition-all duration-200 border ${isSelected ? 'border-transparent text-white shadow-md scale-105' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                                style={isSelected ? { background: primaryColor } : {}}
                              >
                                <span className="text-[10px] uppercase tracking-wider font-medium opacity-70">{d.dayName}</span>
                                <span className="text-lg font-semibold my-0.5">{d.day}</span>
                                <span className="text-[10px] opacity-70">{d.month}</span>
                                {d.isToday && !isSelected && <span className="w-1 h-1 rounded-full mt-1" style={{ background: primaryColor }} />}
                              </motion.button>
                            );
                          })}
                        </AnimatePresence>
                      </motion.div>
                    </div>
                    {canScrollRight && (
                      <button type="button" onClick={() => scrollDates('right')} className="absolute right-0 top-1/2 -translate-y-1/2 -mr-2.5 z-20 w-7 h-7 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center hover:border-gray-400 transition-colors">
                        <ChevronRight className="h-3.5 w-3.5 text-gray-500" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Guest counter */}
                <div>
                  <label className="block text-sm font-medium mb-3" style={{ color: secondaryColor }}>
                    Nombre de personnes
                  </label>
                  <div className="flex items-center justify-center gap-4">
                    <button type="button" onClick={() => setNumberOfGuests((g) => Math.max(1, g - 1))} disabled={numberOfGuests <= 1} className="w-11 h-11 rounded-xl border border-gray-200 flex items-center justify-center hover:border-gray-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed bg-white">
                      <Minus className="h-4 w-4" style={{ color: secondaryColor }} />
                    </button>
                    <div className="flex items-baseline gap-2 min-w-[80px] justify-center">
                      <span className="text-3xl font-light" style={{ color: secondaryColor }}>{numberOfGuests}</span>
                      <Users className="h-5 w-5" style={{ color: primaryColor, opacity: 0.6 }} />
                    </div>
                    <button type="button" onClick={() => setNumberOfGuests((g) => Math.min(20, g + 1))} disabled={numberOfGuests >= 20} className="w-11 h-11 rounded-xl border border-gray-200 flex items-center justify-center hover:border-gray-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed bg-white">
                      <Plus className="h-4 w-4" style={{ color: secondaryColor }} />
                    </button>
                  </div>
                </div>

                {/* Time slots (appear when date selected) */}
                <AnimatePresence>
                  {date && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <label className="block text-sm font-medium mb-3" style={{ color: secondaryColor }}>
                        Choix de l&apos;horaire
                      </label>
                      {isLoadingSlots ? (
                        <div className="flex items-center justify-center gap-2 py-8 text-sm text-gray-400">
                          <Loader2 className="h-4 w-4 animate-spin" style={{ color: primaryColor }} />
                          Chargement des créneaux...
                        </div>
                      ) : availableSlots.length > 0 ? (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {availableSlots.map((slot, i) => (
                            <motion.button
                              key={slot.time}
                              type="button"
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.04 }}
                              onClick={() => !slot.isFull && setSelectedTime(slot.time)}
                              disabled={slot.isFull}
                              className={`relative py-3 px-2 rounded-xl text-center transition-all duration-200 border ${slot.isFull ? 'opacity-30 cursor-not-allowed bg-gray-50 border-gray-100' : selectedTime === slot.time ? 'border-transparent text-white shadow-md' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                              style={selectedTime === slot.time && !slot.isFull ? { background: primaryColor } : {}}
                              >
                               <div className="text-sm font-medium">{slot.time}</div>
                               {slot.isFull && <div className="mt-1 text-[10px] text-gray-400">Complet</div>}
                             </motion.button>
                          ))}
                        </div>
                      ) : hasNoSlots ? (
                        <div className="py-8 text-center rounded-xl bg-gray-50 border border-gray-100">
                          <Clock className="h-5 w-5 mx-auto mb-2 text-gray-300" />
                          <p className="text-sm text-gray-400">Aucun créneau pour cette date</p>
                        </div>
                      ) : null}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Continue button */}
                <AnimatePresence>
                  {date && selectedTime && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium" style={{ background: `${primaryColor}10`, color: primaryColor }}>
                        <Clock className="h-4 w-4" />
                        {new Date(date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} à {selectedTime} · {numberOfGuests} {numberOfGuests > 1 ? 'personnes' : 'personne'}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              /* === STEP 2: Personal Info === */
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-5">
                {/* Recap of selection */}
                <button type="button" onClick={() => { setSelectedTime(''); setDate(''); }} className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity" style={{ color: primaryColor }}>
                  <ChevronLeft className="h-4 w-4" />
                  {new Date(date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} à {selectedTime} · {numberOfGuests} {numberOfGuests > 1 ? 'pers.' : 'pers.'}
                </button>

                {error && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-lg text-sm" style={{ background: '#FEF2F2', color: '#DC2626' }}>
                    {error}
                  </motion.div>
                )}

                {/* Name */}
                <div>
                  <label htmlFor="tm-name" className="block text-xs font-medium mb-1.5" style={{ color: secondaryColor }}>Nom complet</label>
                  <input id="tm-name" type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required minLength={2} maxLength={100} placeholder="Jean Dupont" className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0" style={{ borderRadius, '--tw-ring-color': `${primaryColor}30` } as React.CSSProperties} />
                </div>

                {/* Email + Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="tm-email" className="block text-xs font-medium mb-1.5" style={{ color: secondaryColor }}>Email</label>
                    <input id="tm-email" type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} required maxLength={255} placeholder="jean@exemple.fr" className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0" style={{ borderRadius, '--tw-ring-color': `${primaryColor}30` } as React.CSSProperties} />
                  </div>
                  <div>
                    <label htmlFor="tm-phone" className="block text-xs font-medium mb-1.5" style={{ color: secondaryColor }}>Téléphone</label>
                    <input id="tm-phone" type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} required minLength={10} maxLength={20} placeholder="06 12 34 56 78" className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0" style={{ borderRadius, '--tw-ring-color': `${primaryColor}30` } as React.CSSProperties} />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label htmlFor="tm-notes" className="block text-xs font-medium mb-1.5" style={{ color: secondaryColor }}>Notes <span className="font-normal" style={{ color: '#999' }}>(optionnel)</span></label>
                  <textarea id="tm-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Allergies, préférences de table..." rows={2} maxLength={500} className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 resize-none" style={{ borderRadius, '--tw-ring-color': `${primaryColor}30` } as React.CSSProperties} />
                  {notes.length > 0 && <span className="block text-right text-[10px] mt-1" style={{ color: '#999' }}>{notes.length}/500</span>}
                </div>

                {/* GDPR */}
                <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-3">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input type="checkbox" checked={consentDataProcessing} onChange={(e) => setConsentDataProcessing(e.target.checked)} required className="mt-0.5 w-4 h-4 flex-shrink-0" style={{ accentColor: primaryColor }} />
                    <span className="text-xs leading-relaxed" style={{ color: '#666' }}>
                      J&apos;accepte que mes données soient traitées par TableMaster et transmises au restaurant {restaurant?.name}.{' '}
                      <a href="https://tablemaster.fr/privacy" target="_blank" rel="noopener noreferrer" className="underline font-medium" style={{ color: primaryColor }}>Politique de confidentialité</a>
                    </span>
                  </label>
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input type="checkbox" checked={consentMarketing} onChange={(e) => setConsentMarketing(e.target.checked)} className="mt-0.5 w-4 h-4 flex-shrink-0" style={{ accentColor: primaryColor }} />
                    <span className="text-xs leading-relaxed" style={{ color: '#666' }}>
                      Je souhaite recevoir des offres et actualités du restaurant {restaurant?.name} par email
                    </span>
                  </label>
                </div>

                {/* Hidden honeypot */}
                <input type="text" name="_honeypot" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} style={{ display: 'none' }} tabIndex={-1} autoComplete="off" aria-hidden="true" />

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 rounded-xl text-white font-medium text-base transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                  style={{ background: primaryColor, borderRadius, boxShadow: `${primaryColor}30 0 4px 14px` }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Réservation en cours...
                    </>
                  ) : (
                    'Confirmer la réservation'
                  )}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
}
