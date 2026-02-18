'use client';

import { motion } from 'framer-motion';
import { User, Users, Calendar, Clock } from 'lucide-react';

interface ReservationFormDemoProps {
  isActive?: boolean;
}

export default function ReservationFormDemo({ isActive = true }: ReservationFormDemoProps) {
  return (
    <div className="h-48 w-full flex items-center justify-center p-6">
      <div className="relative w-full max-w-full sm:max-w-sm bg-white rounded-xl border border-gray-200 p-3 sm:p-6 shadow-md">
        {/* Form title */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="text-base font-medium text-gray-800 mb-4"
        >
          Réserver une table
        </motion.div>

        {/* Form fields */}
        <div className="space-y-3">
          {/* Name field */}
          <div className="relative">
            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <motion.div
              initial={{ width: '0%' }}
              animate={isActive ? { width: '100%' } : { width: '0%' }}
              transition={{ duration: 1, delay: 0.5, ease: 'easeInOut' }}
              className="h-10 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden"
            >
              <motion.div
                initial={{ x: '-100%' }}
                animate={isActive ? { x: '0%' } : { x: '-100%' }}
                transition={{ duration: 1, delay: 0.5, ease: 'easeInOut' }}
                className="h-full bg-gradient-to-r from-blue-50 to-blue-100"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={isActive ? { opacity: [0, 1, 1] } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: 1.5 }}
              className="absolute left-10 top-1/2 transform -translate-y-1/2 text-xs text-gray-600"
            >
              Jean Dupont
            </motion.div>
          </div>

          {/* Guests field */}
          <div className="relative">
            <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <motion.div
              initial={{ width: '0%' }}
              animate={isActive ? { width: '100%' } : { width: '0%' }}
              transition={{ duration: 1, delay: 1, ease: 'easeInOut' }}
              className="h-8 bg-gray-100 rounded border border-gray-200 overflow-hidden"
            >
              <motion.div
                initial={{ x: '-100%' }}
                animate={isActive ? { x: '0%' } : { x: '-100%' }}
                transition={{ duration: 1, delay: 1, ease: 'easeInOut' }}
                className="h-full bg-gradient-to-r from-blue-50 to-blue-100"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={isActive ? { opacity: [0, 1, 1] } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: 2 }}
              className="absolute left-10 top-1/2 transform -translate-y-1/2 text-xs text-gray-600"
            >
              4 personnes
            </motion.div>
          </div>

          {/* Date & Time row */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <motion.div
                initial={{ width: '0%' }}
                animate={isActive ? { width: '100%' } : { width: '0%' }}
                transition={{ duration: 1, delay: 1.5, ease: 'easeInOut' }}
                className="h-10 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden"
              >
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={isActive ? { x: '0%' } : { x: '-100%' }}
                  transition={{ duration: 1, delay: 1.5, ease: 'easeInOut' }}
                  className="h-full bg-gradient-to-r from-blue-50 to-blue-100"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={isActive ? { opacity: [0, 1, 1] } : { opacity: 0 }}
                transition={{ duration: 0.5, delay: 2.5 }}
                className="absolute left-12 top-1/2 transform -translate-y-1/2 text-sm text-gray-600"
              >
                20/02
              </motion.div>
            </div>

            <div className="relative flex-1">
              <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <motion.div
                initial={{ width: '0%' }}
                animate={isActive ? { width: '100%' } : { width: '0%' }}
                transition={{ duration: 1, delay: 2, ease: 'easeInOut' }}
                className="h-10 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden"
              >
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={isActive ? { x: '0%' } : { x: '-100%' }}
                  transition={{ duration: 1, delay: 2, ease: 'easeInOut' }}
                  className="h-full bg-gradient-to-r from-blue-50 to-blue-100"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={isActive ? { opacity: [0, 1, 1] } : { opacity: 0 }}
                transition={{ duration: 0.5, delay: 3 }}
                className="absolute left-12 top-1/2 transform -translate-y-1/2 text-sm text-gray-600"
              >
                20:00
              </motion.div>
            </div>
          </div>
        </div>

        {/* Submit button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5, delay: 3.5 }}
          className="mt-4"
        >
          <div className="h-10 bg-[#0066FF] rounded-lg text-white text-base font-medium flex items-center justify-center">
            Réserver
          </div>
        </motion.div>

        {/* Success checkmark */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={isActive ? { opacity: [0, 1, 1], scale: [0, 1.2, 1] } : { opacity: 0, scale: 0 }}
          transition={{ duration: 0.5, delay: 4.5, times: [0, 0.7, 1] }}
          className="absolute -top-3 -right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
}
