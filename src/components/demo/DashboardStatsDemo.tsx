'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Users, Calendar, Euro } from 'lucide-react';
import { useState, useEffect } from 'react';

interface DashboardStatsDemoProps {
  isActive?: boolean;
}

export default function DashboardStatsDemo({ isActive = true }: DashboardStatsDemoProps) {
  const [todayReservations, setTodayReservations] = useState(0);
  const [weekReservations, setWeekReservations] = useState(0);
  const [occupationRate, setOccupationRate] = useState(0);
  const [estimatedRevenue, setEstimatedRevenue] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setTodayReservations(0);
      setWeekReservations(0);
      setOccupationRate(0);
      setEstimatedRevenue(0);
      return;
    }

    // Animate counters
    const todayTimer = setTimeout(() => setTodayReservations(12), 500);
    const weekTimer = setTimeout(() => setWeekReservations(45), 1000);
    const occupationTimer = setTimeout(() => setOccupationRate(78), 1500);
    const revenueTimer = setTimeout(() => setEstimatedRevenue(1250), 2000);

    return () => {
      clearTimeout(todayTimer);
      clearTimeout(weekTimer);
      clearTimeout(occupationTimer);
      clearTimeout(revenueTimer);
    };
  }, [isActive]);

  return (
    <div className="h-48 w-full p-4 sm:p-6">
      <div className="grid grid-cols-2 gap-2 sm:gap-3 h-full">
        {/* Today reservations */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-2 sm:p-3 border border-blue-100"
        >
          <div className="flex items-center justify-between mb-2">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
            <div className="text-xs text-blue-800 font-medium">Aujourd&apos;hui</div>
          </div>
          <motion.div
            initial={{ scale: 0.9 }}
            animate={isActive ? { scale: 1 } : { scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="text-xl sm:text-2xl font-light text-blue-900"
          >
            {todayReservations}
          </motion.div>
          <div className="text-xs text-blue-700 mt-1">réservations</div>

          {/* Animated bar */}
          <motion.div
            initial={{ width: 0 }}
            animate={isActive ? { width: '70%' } : { width: '0%' }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-1 bg-blue-500 rounded-full mt-2"
          />
        </motion.div>

        {/* Week reservations */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-2 sm:p-3 border border-green-100"
        >
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
            <div className="text-xs text-green-800 font-medium">Cette semaine</div>
          </div>
          <motion.div
            initial={{ scale: 0.9 }}
            animate={isActive ? { scale: 1 } : { scale: 0.9 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-xl sm:text-2xl font-light text-green-900"
          >
            {weekReservations}
          </motion.div>
          <div className="text-xs text-green-700 mt-1">réservations</div>

          {/* Animated bar */}
          <motion.div
            initial={{ width: 0 }}
            animate={isActive ? { width: '85%' } : { width: '0%' }}
            transition={{ duration: 1, delay: 0.6 }}
            className="h-1 bg-green-500 rounded-full mt-2"
          />
        </motion.div>

        {/* Occupation rate */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-2 sm:p-3 border border-purple-100"
        >
          <div className="flex items-center justify-between mb-2">
            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
            <div className="text-xs text-purple-800 font-medium">Occupation</div>
          </div>
          <motion.div
            initial={{ scale: 0.9 }}
            animate={isActive ? { scale: 1 } : { scale: 0.9 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="text-xl sm:text-2xl font-light text-purple-900"
          >
            {occupationRate}%
          </motion.div>
          <div className="text-xs text-purple-700 mt-1">taux moyen</div>

          {/* Animated circle progress */}
          <div className="relative mt-2">
            <div className="h-1 w-full bg-purple-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${occupationRate}%` }}
                transition={{ duration: 1.5, delay: 0.7 }}
                className="h-full bg-purple-500"
              />
            </div>
          </div>
        </motion.div>

        {/* Estimated revenue */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-2 sm:p-3 border border-amber-100"
        >
          <div className="flex items-center justify-between mb-2">
            <Euro className="h-3 w-3 sm:h-4 sm:w-4 text-amber-600" />
            <div className="text-xs text-amber-800 font-medium">CA estimé</div>
          </div>
          <motion.div
            initial={{ scale: 0.9 }}
            animate={isActive ? { scale: 1 } : { scale: 0.9 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="text-xl sm:text-2xl font-light text-amber-900"
          >
            {estimatedRevenue}€
          </motion.div>
          <div className="text-xs text-amber-700 mt-1">aujourd&apos;hui</div>

          {/* Animated bar with gradient */}
          <motion.div
            initial={{ width: 0 }}
            animate={isActive ? { width: '60%' } : { width: '0%' }}
            transition={{ duration: 1, delay: 0.8 }}
            className="h-1 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full mt-2"
          />
        </motion.div>
      </div>

      {/* Animated sparkle effect */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={isActive ? { opacity: [0, 1, 0], scale: [0, 1, 0] } : { opacity: 0, scale: 0 }}
        transition={{ duration: 2, repeat: Infinity, delay: 3 }}
        className="absolute top-4 right-4"
      >
        <div className="w-2 h-2 bg-blue-400 rounded-full" />
      </motion.div>
    </div>
  );
}
