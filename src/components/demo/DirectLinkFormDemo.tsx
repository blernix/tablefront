'use client';

import { motion } from 'framer-motion';
import { Link, QrCode } from 'lucide-react';

interface DirectLinkFormDemoProps {
  isActive?: boolean;
}

export default function DirectLinkFormDemo({ isActive = true }: DirectLinkFormDemoProps) {
  return (
    <div className="h-48 w-full flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div className="relative w-full max-w-sm md:max-w-lg bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-md">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-1 sm:gap-2 text-base font-medium text-gray-800 mb-6"
        >
          <Link className="h-4 w-4 sm:h-5 sm:w-5 text-[#0066FF]" />
          <span>Formulaire par lien direct</span>
        </motion.div>

        {/* URL display */}
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-2">Partagez ce lien sur vos réseaux</div>
          <div className="relative">
            <motion.div
              initial={{ width: '0%' }}
              animate={isActive ? { width: '100%' } : { width: '0%' }}
              transition={{ duration: 2, ease: 'easeInOut' }}
              className="h-8 sm:h-10 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden"
            >
              <motion.div
                initial={{ x: '-100%' }}
                animate={isActive ? { x: '0%' } : { x: '-100%' }}
                transition={{ duration: 2, ease: 'easeInOut' }}
                className="h-full bg-gradient-to-r from-blue-50 to-blue-100"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={isActive ? { opacity: [0, 1, 1] } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: 2 }}
              className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-xs sm:text-sm text-gray-700 font-mono truncate"
            >
              tablemaster.fr/embed/reservation/restaurant-dupont
            </motion.div>

            {/* Copy button animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, delay: 2.5 }}
              className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2"
            >
              <div className="w-6 h-6 bg-[#0066FF] rounded flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </motion.div>
          </div>
        </div>

        {/* QR Code section */}
        {/* <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500 mb-1">Ou scannez le QR Code</div>
            <div className="text-xs text-gray-400">Idéal pour carte de table ou affiche</div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
            transition={{ duration: 0.5, delay: 3 }}
            className="relative"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center">
              <QrCode className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
            </div> */}

            {/* QR code scanning animation */}
            {/* <motion.div
              initial={{ opacity: 0, x: -20, y: -20 }}
              animate={
                isActive
                  ? { opacity: [0, 1, 0], x: [20, -20, 20], y: [20, -20, 20] }
                  : { opacity: 0, x: -20, y: -20 }
              }
              transition={{ duration: 2, repeat: Infinity, delay: 4 }}
              className="absolute inset-0 border-2 border-[#0066FF] rounded-lg pointer-events-none"
            />
          </motion.div>
        </div> */}

        {/* Success indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={isActive ? { opacity: [0, 1, 1], scale: [0, 1.2, 1] } : { opacity: 0, scale: 0 }}
          transition={{ duration: 0.5, delay: 3.5, times: [0, 0.7, 1] }}
          className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
        >
          <svg
            className="w-3 h-3 sm:w-4 sm:h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>

        {/* Click simulation */}
        {/* <motion.div
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: [0, 1, 0] } : { opacity: 0 }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 5, times: [0, 0.3, 1] }}
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-0.5 sm:px-3 sm:py-1 rounded-full whitespace-nowrap"
        >
          Cliquez pour tester
        </motion.div> */}
      </div>
    </div>
  );
}
