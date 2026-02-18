'use client';

import { motion } from 'framer-motion';
import {
  List,
  User,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  Clock as ClockIcon,
  XCircle,
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

type ReservationStatus = 'confirmed' | 'pending' | 'completed';

interface Reservation {
  id: number;
  name: string;
  guests: number;
  date: string;
  time: string;
  status: ReservationStatus;
  timeAgo: string;
}

interface ListViewDemoProps {
  isActive?: boolean;
}

export default function ListViewDemo({ isActive = true }: ListViewDemoProps) {
  const [filter, setFilter] = useState<ReservationStatus | 'all'>('all');
  const [visibleReservations, setVisibleReservations] = useState<Reservation[]>([]);

  const reservations: Reservation[] = useMemo(
    () => [
      {
        id: 1,
        name: 'Marie Lambert',
        guests: 4,
        date: '20/02',
        time: '20:00',
        status: 'confirmed',
        timeAgo: 'Il y a 5 min',
      },
      {
        id: 2,
        name: 'Jean Dupont',
        guests: 2,
        date: '20/02',
        time: '19:30',
        status: 'pending',
        timeAgo: 'Il y a 12 min',
      },
      {
        id: 3,
        name: 'Sophie Martin',
        guests: 6,
        date: '20/02',
        time: '21:00',
        status: 'confirmed',
        timeAgo: 'Il y a 25 min',
      },
      {
        id: 4,
        name: 'Thomas Leroy',
        guests: 3,
        date: '21/02',
        time: '20:30',
        status: 'pending',
        timeAgo: 'Il y a 45 min',
      },
      {
        id: 5,
        name: 'Emma Bernard',
        guests: 2,
        date: '19/02',
        time: '20:00',
        status: 'completed',
        timeAgo: 'Terminé',
      },
      {
        id: 6,
        name: 'Lucas Petit',
        guests: 5,
        date: '21/02',
        time: '19:00',
        status: 'confirmed',
        timeAgo: 'Il y a 1h',
      },
    ],
    []
  );

  useEffect(() => {
    if (!isActive) {
      setVisibleReservations([]);
      setFilter('all');
      return;
    }

    // Animate reservations appearing one by one
    const timers = reservations.map((res, index) => {
      return setTimeout(() => {
        setVisibleReservations((prev) => [...prev, res]);
      }, index * 400);
    });

    // Cycle through filters every 5 seconds
    const filterCycle = setInterval(() => {
      setFilter((prev) => {
        const filters: Array<ReservationStatus | 'all'> = [
          'all',
          'confirmed',
          'pending',
          'completed',
        ];
        const currentIndex = filters.indexOf(prev);
        return filters[(currentIndex + 1) % filters.length];
      });
    }, 5000);

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      clearInterval(filterCycle);
    };
  }, [reservations, isActive]);

  const filteredReservations =
    filter === 'all' ? visibleReservations : visibleReservations.filter((r) => r.status === filter);

  const getStatusColor = (status: ReservationStatus) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getStatusIcon = (status: ReservationStatus) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-2 w-2 sm:h-3 sm:w-3" />;
      case 'pending':
        return <ClockIcon className="h-2 w-2 sm:h-3 sm:w-3" />;
      case 'completed':
        return <XCircle className="h-2 w-2 sm:h-3 sm:w-3" />;
    }
  };

  return (
    <div className="h-48 w-full flex items-center justify-center p-6">
      <div className="relative w-full max-w-full sm:max-w-xl md:max-w-2xl bg-white rounded-xl border border-gray-200 p-3 sm:p-4 md:p-6 shadow-md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-4"
        >
          <div className="flex items-center gap-2">
            <List className="h-5 w-5 text-[#0066FF]" />
            <span className="text-sm sm:text-base font-medium text-gray-800">
              Liste des réservations
            </span>
          </div>
          <div className="text-xs sm:text-sm text-gray-500">Aujourd&apos;hui</div>
        </motion.div>

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
          {(['all', 'confirmed', 'pending', 'completed'] as const).map((filterType) => (
            <motion.button
              key={filterType}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(filterType)}
              className={`
                 px-2 py-1 sm:px-3 sm:py-1.5 text-xs rounded-lg transition-all duration-300
                ${
                  filter === filterType
                    ? 'bg-[#0066FF] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              {filterType === 'all' && 'Toutes'}
              {filterType === 'confirmed' && 'Confirmées'}
              {filterType === 'pending' && 'En attente'}
              {filterType === 'completed' && 'Terminées'}
            </motion.button>
          ))}
        </div>

        {/* Reservations list */}
        <div className="space-y-1 sm:space-y-2 max-h-32 overflow-y-auto pr-1 sm:pr-2">
          {filteredReservations.map((reservation, index) => (
            <motion.div
              key={reservation.id}
              initial={{ opacity: 0, x: -20 }}
              animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-[#0066FF] transition-colors"
            >
              {/* Client info */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-800">{reservation.name}</div>
                  <div className="flex items-center gap-1 sm:gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users className="h-2 w-2 sm:h-3 sm:w-3" />
                      {reservation.guests} pers.
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-2 w-2 sm:h-3 sm:w-3" />
                      {reservation.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-2 w-2 sm:h-3 sm:w-3" />
                      {reservation.time}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status and actions */}
              <div className="flex items-center gap-2 sm:gap-4">
                {/* Status badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getStatusColor(reservation.status)}`}
                >
                  {getStatusIcon(reservation.status)}
                  <span>
                    {reservation.status === 'confirmed' && 'Confirmée'}
                    {reservation.status === 'pending' && 'En attente'}
                    {reservation.status === 'completed' && 'Terminée'}
                  </span>
                </motion.div>

                {/* Time ago */}
                <div className="text-xs text-gray-400">{reservation.timeAgo}</div>

                {/* Action buttons */}
                <div className="flex gap-1">
                  {reservation.status === 'pending' && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 text-white rounded flex items-center justify-center"
                      >
                        <CheckCircle className="h-3 w-3" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-5 h-5 sm:w-6 sm:h-6 bg-red-500 text-white rounded flex items-center justify-center"
                      >
                        <XCircle className="h-3 w-3" />
                      </motion.button>
                    </>
                  )}
                  {reservation.status === 'completed' && (
                    <motion.div
                      animate={isActive ? { rotate: [0, 360] } : { rotate: 0 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 text-white rounded flex items-center justify-center"
                    >
                      <svg
                        className="h-3 w-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 2 }}
          className="mt-4 flex items-center justify-between text-xs text-gray-500"
        >
          <div>
            <span className="font-medium text-gray-700">{visibleReservations.length}</span>{' '}
            réservations affichées
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>
                {visibleReservations.filter((r) => r.status === 'confirmed').length} confirmées
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              <span>
                {visibleReservations.filter((r) => r.status === 'pending').length} en attente
              </span>
            </div>
          </div>
        </motion.div>

        {/* Auto-filter animation indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: [0, 1, 0] } : { opacity: 0 }}
          transition={{ duration: 2, repeat: Infinity, delay: 3 }}
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1 rounded whitespace-nowrap"
        >
          Filtrage automatique en cours
        </motion.div>
      </div>
    </div>
  );
}
