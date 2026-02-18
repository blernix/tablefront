'use client';

import { motion } from 'framer-motion';
import { Mail, Check, User, Calendar, Clock, Send } from 'lucide-react';
import { useState, useEffect } from 'react';

interface EmailReviewDemoProps {
  isActive?: boolean;
}

export default function EmailReviewDemo({ isActive = true }: EmailReviewDemoProps) {
  const [phase, setPhase] = useState<'swipe' | 'email'>('swipe');
  const [swipeState, setSwipeState] = useState<'idle' | 'right'>('idle');
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setPhase('swipe');
      setSwipeState('idle');
      setEmailSent(false);
      return;
    }

    // Cycle between swipe and email every 8 seconds
    const phaseTimer = setInterval(() => {
      setPhase((prev) => {
        if (prev === 'swipe') {
          // Trigger swipe animation before switching to email
          setSwipeState('right');
          setTimeout(() => {
            setPhase('email');
            setEmailSent(false);
          }, 1500);
          return 'swipe'; // Will be immediately followed by setPhase
        } else {
          // After email, go back to swipe
          setSwipeState('idle');
          return 'swipe';
        }
      });
    }, 8000);

    // Auto-swipe animation when in swipe phase
    if (phase === 'swipe') {
      const swipeTimer = setTimeout(() => {
        setSwipeState('right');
      }, 2000);

      return () => {
        clearTimeout(swipeTimer);
        clearInterval(phaseTimer);
      };
    }

    // Email sent animation
    if (phase === 'email') {
      const emailTimer = setTimeout(() => {
        setEmailSent(true);
      }, 2000);

      return () => {
        clearTimeout(emailTimer);
        clearInterval(phaseTimer);
      };
    }

    return () => clearInterval(phaseTimer);
  }, [phase, isActive]);

  return (
    <div className="h-48 w-full flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div className="relative w-full max-w-sm md:max-w-2xl lg:max-w-3xl bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-md">
        {/* Phase indicator */}
        <motion.div
          key={phase}
          initial={{ opacity: 0, y: -10 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-1 sm:gap-2 mb-4 sm:mb-6"
        >
          {phase === 'swipe' && <Check className="h-4 w-4 sm:h-5 sm:w-5 text-[#0066FF]" />}
          {phase === 'email' && <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-[#0066FF]" />}
          <span className="text-sm sm:text-base font-medium text-gray-800">
            {phase === 'swipe' && 'Terminer une réservation'}
            {phase === 'email' && 'Email automatique pour avis'}
          </span>
          <div className="ml-auto flex items-center gap-2">
            {['swipe', 'email'].map((p) => (
              <div
                key={p}
                className={`w-2 h-2 rounded-full ${phase === p ? 'bg-[#0066FF]' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        </motion.div>

        {/* Swipe Phase */}
        {phase === 'swipe' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isActive ? { opacity: 1 } : { opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {/* Background action indicator */}
            <div className="absolute inset-0 flex items-center justify-between px-6 pointer-events-none">
              <div className="w-24" /> {/* Spacer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: swipeState === 'right' ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2 text-green-600"
              >
                <Check className="h-5 w-5" />
                <span className="text-sm font-medium">Terminer et demander un avis</span>
              </motion.div>
            </div>

            {/* Swipeable card */}
            <motion.div
              animate={{
                x: swipeState === 'right' ? 150 : 0,
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
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">Marie Lambert</div>
                    <div className="text-sm text-gray-500">Table 4 - Service terminé</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 text-gray-500">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm">20/02</span>
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 ml-2" />
                  <span className="text-xs sm:text-sm">20:00</span>
                </div>
              </div>

              {/* Status badge */}
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  <span className="text-xs text-gray-600">En attente de terminaison</span>
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
                Glissez pour terminer
              </motion.div>
            </motion.div>

            {/* Success feedback */}
            {swipeState === 'right' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
              >
                <Check className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Email Phase */}
        {phase === 'email' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isActive ? { opacity: 1 } : { opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {/* Email header */}
            <div className="border-b border-gray-200 pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#0066FF] rounded-full flex items-center justify-center">
                    <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">TableMaster</div>
                    <div className="text-xs text-gray-500">avis@tablemaster.com</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">Il y a 2 min</div>
              </div>
            </div>

            {/* Email content */}
            <div className="space-y-3">
              <div className="text-sm">
                <span className="font-medium">Bonjour Marie,</span>
                <p className="text-gray-600 mt-1">
                  Nous espérons que vous avez passé un excellent moment au restaurant. Pourriez-vous
                  nous donner votre avis en cliquant sur le lien ci-dessous ?
                </p>
              </div>

              {/* Google review link */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ duration: 0.5, delay: 1 }}
                className="bg-blue-50 border border-blue-100 rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
                      <svg className="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">Donnez votre avis sur Google</div>
                      <div className="text-xs text-gray-500">
                        Cliquez pour noter votre expérience
                      </div>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[#0066FF] text-white text-xs sm:text-sm rounded-lg flex items-center gap-2"
                  >
                    <Send className="h-3 w-3" />
                    Noter
                  </motion.button>
                </div>
              </motion.div>

              {/* Email sent confirmation */}
              {emailSent && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={isActive ? { opacity: 1 } : { opacity: 0 }}
                  className="flex items-center justify-center gap-2 text-green-600"
                >
                  <Check className="h-4 w-4" />
                  <span className="text-sm">Email envoyé avec succès !</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Phase indicator bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 rounded-b-xl overflow-hidden">
          <motion.div
            animate={{
              x: phase === 'swipe' ? '0%' : '50%',
            }}
            transition={{ duration: 0.5 }}
            className="h-full w-1/2 bg-gradient-to-r from-[#0066FF] to-[#0052CC]"
          />
        </div>

        {/* Instruction */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: [0, 1, 0] } : { opacity: 0 }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-0.5 sm:px-3 sm:py-1 rounded whitespace-nowrap"
        >
          Terminez → Email automatique
        </motion.div>
      </div>
    </div>
  );
}
