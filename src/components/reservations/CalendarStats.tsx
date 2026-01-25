'use client';

import { useMemo } from 'react';
import { Reservation } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Users, TrendingUp, AlertCircle, DollarSign } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CalendarStatsProps {
  reservations: Reservation[];
  currentMonth: Date;
  maxCapacity?: number;
  averagePrice?: number;
}

export const CalendarStats = ({
  reservations,
  currentMonth,
  maxCapacity = 50,
  averagePrice = 25
}: CalendarStatsProps) => {
  const stats = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);

    // Filter reservations for current month
    const monthReservations = reservations.filter(r => {
      const resDate = new Date(r.date);
      return resDate >= monthStart && resDate <= monthEnd && r.status !== 'cancelled';
    });

    // Total reservations
    const totalReservations = monthReservations.length;

    // Total guests
    const totalGuests = monthReservations.reduce((sum, r) => sum + r.numberOfGuests, 0);

    // Estimated revenue
    const estimatedRevenue = totalGuests * averagePrice;

    // Average guests per reservation
    const avgGuestsPerReservation = totalReservations > 0
      ? (totalGuests / totalReservations).toFixed(1)
      : '0';

    // Days in month
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd }).length;

    // Occupation rate (based on max capacity per day)
    const maxMonthCapacity = maxCapacity * daysInMonth;
    const occupationRate = maxMonthCapacity > 0
      ? ((totalGuests / maxMonthCapacity) * 100).toFixed(1)
      : '0';

    // Find busiest day
    const reservationsByDay: Record<string, Reservation[]> = {};
    monthReservations.forEach(r => {
      const dateKey = new Date(r.date).toISOString().split('T')[0];
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
      pending: monthReservations.filter(r => r.status === 'pending').length,
      confirmed: monthReservations.filter(r => r.status === 'confirmed').length,
      completed: monthReservations.filter(r => r.status === 'completed').length,
    };

    return {
      totalReservations,
      totalGuests,
      estimatedRevenue,
      avgGuestsPerReservation,
      occupationRate,
      busiestDay: busiestDayFormatted,
      busiestDayGuests: busiestDay.guests,
      statusBreakdown
    };
  }, [reservations, currentMonth, maxCapacity, averagePrice]);

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
                Capacité max: {maxCapacity}/jour
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
              <p className="text-xs text-slate-500 mt-1">
                Basé sur {averagePrice}€ de panier moyen par couvert
              </p>
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
