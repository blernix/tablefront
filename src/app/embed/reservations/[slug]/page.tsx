'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface RestaurantInfo {
  name: string;
  address: string;
  phone: string;
  openingHours: any;
  reservationConfig: {
    defaultDuration: number;
    useOpeningHours: boolean;
  };
  widgetConfig?: {
    primaryColor?: string;
    secondaryColor?: string;
    fontFamily?: string;
    borderRadius?: string;
  };
}

interface TimeSlot {
  time: string;
  available: boolean;
}

export default function EmbedReservationPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [restaurant, setRestaurant] = useState<RestaurantInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Form state
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [date, setDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState(2);
  const [notes, setNotes] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Bot detection field - should stay empty

  // UI state
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Use direct backend URL for API calls
  // This works in both development and production
  // The backend has CORS enabled for all origins (public endpoints are protected by API key)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  // Fetch restaurant info on mount
  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!slug) return;

      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/api/public/restaurant-info`, {
          headers: {
            'x-slug': slug,
          },
        });

        if (!response.ok) {
          throw new Error('Restaurant not found');
        }

        const data = await response.json();
        setRestaurant(data.restaurant);
      } catch (err: any) {
        setError('Impossible de charger les informations du restaurant.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurant();
  }, [slug, API_URL]);

  // Fetch available time slots when date changes
  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (!date || !slug) return;

      try {
        setIsLoadingSlots(true);
        const response = await fetch(`${API_URL}/api/public/time-slots/${date}`, {
          headers: {
            'x-slug': slug,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch time slots');
        }

        const data = await response.json();
        setAvailableSlots(data.slots?.map((time: string) => ({ time, available: true })) || []);
      } catch (err) {
        setAvailableSlots([]);
      } finally {
        setIsLoadingSlots(false);
      }
    };

    fetchTimeSlots();
  }, [date, slug, API_URL]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (!customerName || !customerEmail || !customerPhone || !date || !selectedTime) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    // Validate name length
    if (customerName.length < 2 || customerName.length > 100) {
      setError('Le nom doit contenir entre 2 et 100 caractères.');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      setError('Veuillez entrer une adresse email valide.');
      return;
    }

    // Validate phone length
    if (customerPhone.length < 10 || customerPhone.length > 20) {
      setError('Le numéro de téléphone doit contenir entre 10 et 20 caractères.');
      return;
    }

    // Validate number of guests
    if (numberOfGuests < 1 || numberOfGuests > 20) {
      setError('Le nombre de personnes doit être entre 1 et 20.');
      return;
    }

    // Validate notes length
    if (notes && notes.length > 500) {
      setError('Les notes ne peuvent pas dépasser 500 caractères.');
      return;
    }

    // Validate date is not in the past
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      setError('La date ne peut pas être dans le passé.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/public/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-slug': slug,
        },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim().toLowerCase(),
          customerPhone: customerPhone.trim(),
          date,
          time: selectedTime,
          numberOfGuests,
          notes: notes.trim(),
          _honeypot: honeypot, // Bot detection field
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Erreur lors de la réservation');
      }

      setSuccess(true);
      
      // Send message to parent window to close modal (for floating widget)
      if (window.parent !== window) {
        window.parent.postMessage({ type: 'tablemaster:close' }, '*');
      }
      
      // Reset form
      setCustomerName('');
      setCustomerEmail('');
      setCustomerPhone('');
      setDate('');
      setSelectedTime('');
      setNumberOfGuests(2);
      setNotes('');
      setHoneypot(''); // Reset honeypot field
    } catch (err: any) {
      console.error('Reservation error:', err);
      setError(err.message || 'Une erreur est survenue lors de la réservation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Apply custom styles from widgetConfig
  const widgetStyles = restaurant?.widgetConfig
    ? {
        '--tm-primary-color': restaurant.widgetConfig.primaryColor || '#0066FF',
        '--tm-secondary-color': restaurant.widgetConfig.secondaryColor || '#2A2A2A',
        '--tm-font-family': restaurant.widgetConfig.fontFamily || 'system-ui, sans-serif',
        '--tm-border-radius': restaurant.widgetConfig.borderRadius || '4px',
      }
    : {
        '--tm-primary-color': '#0066FF',
        '--tm-secondary-color': '#2A2A2A',
        '--tm-font-family': 'system-ui, sans-serif',
        '--tm-border-radius': '4px',
      };

  if (isLoading) {
    return (
      <div className="tm-widget" style={widgetStyles as React.CSSProperties}>
        <div className="tm-loading">Chargement...</div>
        <style jsx>{`
          .tm-widget {
            font-family: var(--tm-font-family);
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .tm-loading {
            text-align: center;
            padding: 40px;
            color: var(--tm-secondary-color);
          }
        `}</style>
      </div>
    );
  }

  if (error && !restaurant) {
    return (
      <div className="tm-widget" style={widgetStyles as React.CSSProperties}>
        <div className="tm-error">{error}</div>
        <style jsx>{`
          .tm-widget {
            font-family: var(--tm-font-family);
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .tm-error {
            padding: 20px;
            background: #fee;
            border: 1px solid #fcc;
            border-radius: var(--tm-border-radius);
            color: #c00;
            text-align: center;
          }
        `}</style>
      </div>
    );
  }

  if (success) {
    return (
      <div className="tm-widget" style={widgetStyles as React.CSSProperties}>
        <div className="tm-success">
          <div className="tm-success-icon">✓</div>
          <h2>Réservation confirmée !</h2>
          <p>
            Merci {customerName}, votre réservation a été enregistrée.
            <br />
            Vous recevrez un email de confirmation à {customerEmail}.
          </p>
          <button className="tm-button" onClick={() => setSuccess(false)}>
            Faire une nouvelle réservation
          </button>
        </div>
        <style jsx>{`
          .tm-widget {
            font-family: var(--tm-font-family);
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .tm-success {
            text-align: center;
            padding: 40px 20px;
          }
          .tm-success-icon {
            width: 60px;
            height: 60px;
            margin: 0 auto 20px;
            background: var(--tm-primary-color);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            font-weight: bold;
          }
          .tm-success h2 {
            color: var(--tm-secondary-color);
            margin-bottom: 12px;
            font-size: 24px;
          }
          .tm-success p {
            color: #666;
            margin-bottom: 24px;
            line-height: 1.6;
          }
          .tm-button {
            background: var(--tm-primary-color);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: var(--tm-border-radius);
            font-size: 16px;
            cursor: pointer;
            font-family: var(--tm-font-family);
            transition: opacity 0.2s;
          }
          .tm-button:hover {
            opacity: 0.9;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="tm-widget" style={widgetStyles as React.CSSProperties}>
      <div className="tm-header">
        <h2>{restaurant?.name}</h2>
        <p>{restaurant?.address}</p>
      </div>

      <form className="tm-form" onSubmit={handleSubmit}>
        {error && <div className="tm-error">{error}</div>}

        {/* Honeypot field - hidden from users, should remain empty */}
        <input
          type="text"
          name="_honeypot"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          style={{ display: 'none' }}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        <div className="tm-form-group">
          <label htmlFor="tm-name">Nom complet *</label>
          <input
            id="tm-name"
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
            minLength={2}
            maxLength={100}
            placeholder="Jean Dupont"
          />
        </div>

        <div className="tm-form-row">
          <div className="tm-form-group">
            <label htmlFor="tm-email">Email *</label>
            <input
              id="tm-email"
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              required
              maxLength={255}
              placeholder="jean@example.com"
            />
          </div>

          <div className="tm-form-group">
            <label htmlFor="tm-phone">Téléphone *</label>
            <input
              id="tm-phone"
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              required
              minLength={10}
              maxLength={20}
              placeholder="+33612345678"
            />
          </div>
        </div>

        <div className="tm-form-row">
          <div className="tm-form-group">
            <label htmlFor="tm-date">Date *</label>
            <div className="tm-date-wrapper">
              <input
                id="tm-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={getMinDate()}
                required
                className="tm-date-input"
              />
            </div>
            {date && (
              <p className="tm-date-hint">
                {new Date(date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            )}
          </div>

          <div className="tm-form-group">
            <label htmlFor="tm-guests">Nombre de personnes *</label>
            <select
              id="tm-guests"
              value={numberOfGuests}
              onChange={(e) => setNumberOfGuests(parseInt(e.target.value))}
              required
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((num) => (
                <option key={num} value={num}>
                  {num} {num > 1 ? 'personnes' : 'personne'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {date && (
          <div className="tm-form-group">
            <label htmlFor="tm-time">Heure *</label>
            {isLoadingSlots ? (
              <div className="tm-loading-slots">Chargement des créneaux...</div>
            ) : availableSlots.length > 0 ? (
              <div className="tm-time-slots">
                {availableSlots.map((slot) => (
                  <button
                    key={slot.time}
                    type="button"
                    className={`tm-time-slot ${selectedTime === slot.time ? 'selected' : ''} ${
                      !slot.available ? 'disabled' : ''
                    }`}
                    onClick={() => slot.available && setSelectedTime(slot.time)}
                    disabled={!slot.available}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            ) : (
              <div className="tm-no-slots">Aucun créneau disponible pour cette date.</div>
            )}
          </div>
        )}

        <div className="tm-form-group">
          <label htmlFor="tm-notes">Notes (optionnel)</label>
          <textarea
            id="tm-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Allergies, préférences de table, etc."
            rows={3}
            maxLength={500}
          />
          {notes.length > 0 && (
            <span className="tm-char-count">
              {notes.length} / 500 caractères
            </span>
          )}
        </div>

        <button type="submit" className="tm-button tm-button-submit" disabled={isSubmitting}>
          {isSubmitting ? 'Réservation en cours...' : 'Réserver'}
        </button>
      </form>

      <style jsx>{`
        .tm-widget {
          font-family: var(--tm-font-family);
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          box-sizing: border-box;
        }

        .tm-header {
          text-align: center;
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 2px solid var(--tm-primary-color);
        }

        .tm-header h2 {
          color: var(--tm-secondary-color);
          font-size: 28px;
          margin: 0 0 8px 0;
          font-weight: 600;
        }

        .tm-header p {
          color: #666;
          margin: 0;
          font-size: 14px;
        }

        .tm-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .tm-form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .tm-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        @media (max-width: 640px) {
          .tm-form-row {
            grid-template-columns: 1fr;
          }
        }

        .tm-form-group label {
          font-size: 14px;
          font-weight: 500;
          color: var(--tm-secondary-color);
        }

        .tm-form-group input,
        .tm-form-group select,
        .tm-form-group textarea {
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: var(--tm-border-radius);
          font-size: 16px;
          font-family: var(--tm-font-family);
          transition: border-color 0.2s;
        }

        .tm-form-group input:focus,
        .tm-form-group select:focus,
        .tm-form-group textarea:focus {
          outline: none;
          border-color: var(--tm-primary-color);
        }

        .tm-time-slots {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 8px;
        }

        .tm-time-slot {
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: var(--tm-border-radius);
          background: white;
          cursor: pointer;
          font-family: var(--tm-font-family);
          font-size: 14px;
          transition: all 0.2s;
        }

        .tm-time-slot:hover:not(.disabled) {
          border-color: var(--tm-primary-color);
          background: rgba(0, 102, 255, 0.05);
        }

        .tm-time-slot.selected {
          background: var(--tm-primary-color);
          color: white;
          border-color: var(--tm-primary-color);
        }

        .tm-time-slot.disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background: #f5f5f5;
        }

        .tm-loading-slots,
        .tm-no-slots {
          padding: 16px;
          text-align: center;
          color: #666;
          background: #f9f9f9;
          border-radius: var(--tm-border-radius);
          font-size: 14px;
        }

        .tm-button {
          background: var(--tm-primary-color);
          color: white;
          border: none;
          padding: 14px 24px;
          border-radius: var(--tm-border-radius);
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          font-family: var(--tm-font-family);
          transition: opacity 0.2s;
        }

        .tm-button:hover:not(:disabled) {
          opacity: 0.9;
        }

        .tm-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .tm-button-submit {
          margin-top: 8px;
          width: 100%;
        }

        .tm-error {
          padding: 12px 16px;
          background: #fee;
          border: 1px solid #fcc;
          border-radius: var(--tm-border-radius);
          color: #c00;
          font-size: 14px;
        }

        .tm-char-count {
          display: block;
          margin-top: 4px;
          font-size: 12px;
          color: #666;
          text-align: right;
        }

        .tm-date-wrapper {
          position: relative;
        }

        .tm-date-input {
          width: 100%;
          padding-right: 40px;
        }

        .tm-date-wrapper::after {
          content: '📅';
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          font-size: 16px;
          color: #666;
        }

        .tm-date-hint {
          margin-top: 4px;
          font-size: 13px;
          color: #666;
          font-style: italic;
        }

        /* Reset all styles to prevent conflicts */
        .tm-widget * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
