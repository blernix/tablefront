'use client';

import { useMemo } from 'react';
import { Reservation, Restaurant } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Users, TrendingUp, AlertCircle, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getLocalDateString } from '@/lib/formatters';
import { calculateDailyTheoreticalCapacity } from '@/lib/capacityCalculations';

interface ReservationsStatsProps {
  reservations: Reservation[];
  maxCapacity?: number;
  averagePrice?: number;
  restaurant?: Restaurant | null;
}

export const ReservationsStats = ({
  reservations,
  maxCapacity = 50,
  averagePrice = 25,
  restaurant = null
}: ReservationsStatsProps) => {
  const stats = useMemo(() => {
    // Filter out cancelled reservations
    const validReservations = reservations.filter(r => r.status !== 'cancelled');
    
    if (validReservations.length === 0) {
      return {
        totalReservations: 0,
        totalGuests: 0,
        estimatedRevenue: 0,
        avgGuestsPerReservation: '0',
        occupationRate: '0',
        displayCapacity: maxCapacity,
        busiestDay: '-',
        busiestDayGuests: 0,
        busiestDayDate: '',
        dateRange: '-',
        statusBreakdown: {
          pending: 0,
          confirmed: 0,
          completed: 0,
        }
      };
    }

    // Total reservations
    const totalReservations = validReservations.length;

    // Total guests
    const totalGuests = validReservations.reduce((sum, r) => sum + r.numberOfGuests, 0);

    // Estimated revenue
    const estimatedRevenue = totalGuests * averagePrice;

    // Average guests per reservation
    const avgGuestsPerReservation = totalReservations > 0
      ? (totalGuests / totalReservations).toFixed(1)
      : '0';

    // Calculate date range
    const dates = validReservations.map(r => new Date(r.date).getTime());
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));
    const dateRange = minDate.getTime() === maxDate.getTime() 
      ? format(minDate, 'd MMMM yyyy', { locale: fr })
      : `${format(minDate, 'd MMM', { locale: fr })} - ${format(maxDate, 'd MMMM yyyy', { locale: fr })}`;

    // Get unique dates for capacity calculations
    const uniqueDates = Array.from(new Set(validReservations.map(r => getLocalDateString(r.date))));
    const daysCount = uniqueDates.length;
    
    // Calculate theoretical capacity for the period
    let totalTheoreticalCapacity = 0;
    let displayCapacity = maxCapacity;
    
    if (restaurant) {
      totalTheoreticalCapacity = uniqueDates.reduce((total, dateStr) => {
        const dailyCapacity = calculateDailyTheoreticalCapacity(restaurant, dateStr);
        return total + dailyCapacity.totalTheoreticalCapacity;
      }, 0);
      
      // Use simultaneous capacity for display consistency
      displayCapacity = maxCapacity;
    } else {
      // Fallback to simultaneous capacity per day
      totalTheoreticalCapacity = maxCapacity * daysCount;
      displayCapacity = maxCapacity;
    }

    // Occupation rate (based on simultaneous capacity for consistency)
    const totalSimultaneousCapacity = maxCapacity * daysCount;
    const occupationRate = totalSimultaneousCapacity > 0
      ? ((totalGuests / totalSimultaneousCapacity) * 100).toFixed(1)
      : '0';

    // Find busiest day
    const reservationsByDay: Record<string, Reservation[]> = {};
    validReservations.forEach(r => {
      const dateKey = getLocalDateString(r.date);
      if (!reservationsByDay[dateKey]) {
        reservationsByDay[dateKey] = [];
      }
      reservationsByDay[dateKey].push(r);
    });

    let busiestDay = { date: '', count: 0, guests: 0 };
    Object.entries(reservationsByDay).forEach(([dateKey, dayReservations]) => {
      const guestsCount = dayReservations.reduce((sum, r) => sum + r.numberOfGuests, 0);
      if (guestsCount > busiestDay.guests) {
        busiestDay = {
          date: dateKey,
          count: dayReservations.length,
          guests: guestsCount
        };
      }
    });

    const busiestDayFormatted = busiestDay.date
      ? format(new Date(busiestDay.date), 'd MMMM', { locale: fr })
      : '-';

    // Status breakdown
    const statusBreakdown = {
      pending: validReservations.filter(r => r.status === 'pending').length,
      confirmed: validReservations.filter(r => r.status === 'confirmed').length,
      completed: validReservations.filter(r => r.status === 'completed').length,
    };

    return {
      totalReservations,
      totalGuests,
      estimatedRevenue,
      avgGuestsPerReservation,
      occupationRate,
      displayCapacity,
      busiestDay: busiestDayFormatted,
      busiestDayGuests: busiestDay.guests,
      busiestDayDate: busiestDay.date,
      dateRange,
      statusBreakdown
    };
  }, [reservations, maxCapacity, averagePrice, restaurant]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Total Reservations */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Réservations</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {stats.totalReservations}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {stats.statusBreakdown.pending} en attente
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Guests */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Couverts</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {stats.totalGuests}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Moy. {stats.avgGuestsPerReservation} / rés.
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Occupation Rate */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Taux d&apos;occupation</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {stats.occupationRate}%
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Capacité max: {stats.displayCapacity}/jour
              </p>
            </div>
            <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
              parseFloat(stats.occupationRate) >= 70 ? 'bg-amber-50' : 'bg-slate-50'
            }`}>
              <TrendingUp className={`h-6 w-6 ${
                parseFloat(stats.occupationRate) >= 70 ? 'text-amber-600' : 'text-slate-600'
              }`} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Busiest Day */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Jour le plus chargé</p>
              <p className="text-lg font-bold text-slate-900 mt-1 capitalize">
                {stats.busiestDay}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {stats.busiestDayGuests} couverts
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estimated Revenue - Full width on mobile, half on desktop */}
      <Card className="col-span-2 md:col-span-4">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Chiffre d&apos;affaires estimé</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">
                {stats.estimatedRevenue.toLocaleString('fr-FR')} €
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-slate-500 mt-1">
                <span>Basé sur {averagePrice}€ de panier moyen par couvert</span>
                <span className="text-slate-400">•</span>
                <span>Période: {stats.dateRange}</span>
              </div>
            </div>
            <div className="h-16 w-16 rounded-full bg-emerald-50 flex items-center justify-center">
              <DollarSign className="h-8 w-8 text-emerald-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};