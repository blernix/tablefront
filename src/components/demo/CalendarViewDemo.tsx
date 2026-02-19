'use client';

import { motion } from 'framer-motion';
import { CalendarDays, Users, Clock } from 'lucide-react';

interface CalendarViewDemoProps {
  isActive?: boolean;
}

export default function CalendarViewDemo({ isActive = true }: CalendarViewDemoProps) {
  const days = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  const dates = [
    { day: 15, reservations: 0 },
    { day: 16, reservations: 0 },
    { day: 17, reservations: 1 },
    { day: 18, reservations: 2 },
    { day: 19, reservations: 3 },
    { day: 20, reservations: 4 },
    { day: 21, reservations: 2 },
    { day: 22, reservations: 1 },
    { day: 23, reservations: 0 },
    { day: 24, reservations: 1 },
    { day: 25, reservations: 3 },
    { day: 26, reservations: 2 },
    { day: 27, reservations: 1 },
    { day: 28, reservations: 0 },
  ];

  return (
    <div className="h-48 w-full flex items-center justify-center p-6">
      <div className="relative w-full max-w-full sm:max-w-lg bg-white rounded-xl border border-gray-200 p-3 sm:p-4 md:p-6 shadow-md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-4"
        >
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-[#0066FF]" />
            <span className="text-base font-medium text-gray-800">Calendrier des réservations</span>
          </div>
          <div className="text-sm text-gray-500">Février 2025</div>
        </motion.div>

        {/* Calendar grid */}
        <div className="mb-6">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-1 sm:mb-2">
            {days.map((day, index) => (
              <div key={index} className="text-center text-xs text-gray-500 font-medium">
                {day}
              </div>
            ))}
          </div>

          {/* Date cells */}
          <div className="grid grid-cols-7 gap-1">
            {dates.map((date, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`
                   relative h-6 sm:h-7 md:h-8 flex items-center justify-center rounded text-xs sm:text-sm
                   ${date.day === 20 ? 'bg-[#0066FF] text-white' : 'bg-gray-50 text-gray-700'}
                   ${date.reservations > 0 ? 'border border-blue-100' : ''}
                 `}
              >
                {date.day}

                {/* Reservation indicators */}
                {date.reservations > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                    transition={{ duration: 0.3, delay: 0.7 + index * 0.02 }}
                    className="absolute -top-1 -right-1"
                  >
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-[6px] sm:text-[8px] text-white font-bold">
                        {date.reservations}
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* Today highlight animation */}
                {date.day === 20 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={
                      isActive
                        ? { opacity: [0, 1, 0], scale: [0, 1.2, 0] }
                        : { opacity: 0, scale: 0 }
                    }
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    className="absolute inset-0 border-2 border-[#0066FF] rounded pointer-events-none"
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Reservation details panel */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="bg-blue-50 rounded-lg p-2 sm:p-3 border border-blue-100"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-xs sm:text-sm font-medium text-gray-800">20 février</span>
              </div>
              <div className="text-xs text-gray-600">4 réservations aujourd&apos;hui</div>
            </div>

            <div className="flex items-center gap-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={isActive ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="flex items-center gap-1"
              >
                <Users className="h-2 w-2 sm:h-3 sm:w-3 text-gray-500" />
                <span className="text-xs text-gray-700">16 couverts</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={isActive ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.5, delay: 1.4 }}
                className="flex items-center gap-1"
              >
                <Clock className="h-2 w-2 sm:h-3 sm:w-3 text-gray-500" />
                <span className="text-xs text-gray-700">20:00 peak</span>
              </motion.div>
            </div>
          </div>

          {/* Time slots animation */}
          <div className="mt-2 flex gap-1">
            {['18:00', '19:00', '20:00', '21:00', '22:00'].map((time, index) => (
              <motion.div
                key={time}
                initial={{ width: 0, opacity: 0 }}
                animate={isActive ? { width: '100%', opacity: 1 } : { width: 0, opacity: 0 }}
                transition={{ duration: 0.5, delay: 1.6 + index * 0.1 }}
                className={`flex-1 h-2 rounded ${
                  time === '20:00' ? 'bg-[#0066FF]' : index < 3 ? 'bg-blue-300' : 'bg-blue-100'
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* Hover tooltip simulation */}
        {/* <motion.div
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: [0, 1, 0] } : { opacity: 0 }}
          transition={{ duration: 2, repeat: Infinity, delay: 2.5, times: [0, 0.3, 1] }}
          className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1 rounded whitespace-nowrap"
        >
          Survolez une date pour voir les réservations
        </motion.div> */}
      </div>
    </div>
  );
}
