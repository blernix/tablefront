'use client';

import { motion } from 'framer-motion';
import { Check, X, User, Calendar, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SwipeValidationDemoProps {
  isActive?: boolean;
}

export default function SwipeValidationDemo({ isActive = true }: SwipeValidationDemoProps) {
  const [swipeState, setSwipeState] = useState<'idle' | 'right' | 'left'>('idle');

  useEffect(() => {
    if (!isActive) {
      setSwipeState('idle');
      return;
    }

    const states: Array<'idle' | 'right' | 'left'> = ['idle', 'right', 'idle', 'left', 'idle'];
    let index = 0;

    const interval = setInterval(() => {
      setSwipeState(states[index]);
      index = (index + 1) % states.length;
    }, 3000);

    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className="h-48 w-full flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div className="relative w-full max-w-sm md:max-w-md">
        {/* Background actions */}
        <div className="absolute inset-0 flex items-center justify-between px-4 sm:px-6 pointer-events-none">
          {/* Right swipe action (confirm) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: swipeState === 'right' ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-1 sm:gap-2 text-green-600"
          >
            <Check className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-sm font-medium">Confirmer</span>
          </motion.div>

          {/* Left swipe action (cancel) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: swipeState === 'left' ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-1 sm:gap-2 text-red-600"
          >
            <span className="text-sm font-medium">Annuler</span>
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </motion.div>
        </div>

        {/* Swipeable card */}
        <motion.div
          animate={{
            x: swipeState === 'right' ? 150 : swipeState === 'left' ? -150 : 0,
            opacity: swipeState === 'idle' ? 1 : 0.9,
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20,
          }}
          className="relative bg-white rounded-lg border border-gray-200 shadow-sm p-3 sm:p-4"
        >
          {/* Card content */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-gray-800">Marie Lambert</div>
                <div className="text-sm text-gray-500">4 personnes</div>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 text-gray-500">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-sm">20/02</span>
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 ml-2" />
              <span className="text-sm">20:00</span>
            </div>
          </div>

          {/* Status badge */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              <span className="text-xs text-gray-600">En attente</span>
            </div>
            <div className="text-xs text-gray-500">Il y a 5 min</div>
          </div>

          {/* Swipe hint */}
          <motion.div
            initial={{ opacity: 0.5 }}
            animate={{ opacity: swipeState === 'idle' ? 0.5 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-400"
          >
            Glissez pour valider
          </motion.div>
        </motion.div>

        {/* Success/error feedback */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: swipeState === 'right' ? 1 : 0,
            scale: swipeState === 'right' ? 1 : 0.8,
          }}
          transition={{ duration: 0.3 }}
          className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
        >
          <Check className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: swipeState === 'left' ? 1 : 0,
            scale: swipeState === 'left' ? 1 : 0.8,
          }}
          transition={{ duration: 0.3 }}
          className="absolute -top-2 -left-2 w-6 h-6 sm:w-8 sm:h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg"
        >
          <X className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
        </motion.div>
      </div>
    </div>
  );
}
