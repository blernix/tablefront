'use client';

import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

interface FloatingWidgetDemoProps {
  isActive?: boolean;
}

export default function FloatingWidgetDemo({ isActive = true }: FloatingWidgetDemoProps) {
  return (
    <div className="relative h-48 w-full flex items-center justify-center">
      {/* Site background simulation */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200" />

      {/* Content placeholder */}
      <div className="absolute top-4 sm:top-6 left-4 sm:left-6 w-16 h-4 sm:w-24 sm:h-5 bg-gray-300 rounded" />
      <div className="absolute top-4 sm:top-6 right-4 sm:right-6 w-24 h-4 sm:w-32 sm:h-5 bg-gray-300 rounded" />
      <div className="absolute top-8 sm:top-16 left-4 sm:left-6 w-32 h-24 sm:w-48 sm:h-32 bg-gray-200 rounded" />
      <div className="absolute top-8 sm:top-16 right-4 sm:right-6 w-40 h-24 sm:w-56 sm:h-32 bg-gray-200 rounded" />

      {/* Floating widget */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={
          isActive
            ? {
                scale: [0.8, 1, 0.8],
                opacity: [0, 1, 1],
                y: [20, 0, 0],
              }
            : { scale: 0.8, opacity: 0, y: 20 }
        }
        transition={
          isActive
            ? {
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
                times: [0, 0.2, 1],
              }
            : { duration: 0 }
        }
        className="absolute right-4 bottom-4 sm:right-8 sm:bottom-8"
      >
        <motion.div
          initial={{ y: 0, scale: 1 }}
          animate={
            isActive
              ? {
                  y: [0, -8, 0],
                  scale: [1, 1.1, 1],
                }
              : { y: 0, scale: 1 }
          }
          transition={
            isActive
              ? {
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
              : { duration: 0 }
          }
          className="relative"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#0066FF] rounded-full flex items-center justify-center shadow-xl shadow-[#0066FF]/40">
            <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </div>

          {/* Pulse effect */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={isActive ? { scale: 1.8, opacity: 0 } : { scale: 0.8, opacity: 0.5 }}
            transition={
              isActive
                ? {
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeOut',
                  }
                : { duration: 0 }
            }
            className="absolute inset-0 border-2 border-[#0066FF] rounded-full"
          />
        </motion.div>
      </motion.div>

      {/* Tooltip text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: [0, 1, 0] } : { opacity: 0 }}
        transition={
          isActive
            ? {
                duration: 3,
                repeat: Infinity,
                times: [0, 0.3, 0.6],
                delay: 1,
              }
            : { duration: 0 }
        }
        className="absolute bottom-16 right-4 sm:bottom-20 sm:right-8 bg-gray-800 text-white text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-md whitespace-nowrap shadow-lg"
      >
        Réserver une table
      </motion.div>
    </div>
  );
}
