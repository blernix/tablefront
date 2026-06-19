'use client';

import Link from 'next/link';
import { Check, ArrowRight, Calendar, Users, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSectionView } from '@/hooks/useSectionView';

const floatingCards = [
  {
    icon: <Calendar className="h-3 w-3 text-blue-400" />,
    text: 'Réservation confirmée',
    sub: '20:00 · 4 pers.',
    x: '15%',
    y: '10%',
    rotation: -6,
    delay: 0,
    duration: 18,
  },
  {
    icon: <Users className="h-3 w-3 text-green-400" />,
    text: 'Marie Lambert',
    sub: 'VIP · 24 résas',
    x: '78%',
    y: '18%',
    rotation: 4,
    delay: 2,
    duration: 22,
  },
  {
    icon: <Clock className="h-3 w-3 text-amber-400" />,
    text: 'Service du soir',
    sub: '78% occupation',
    x: '22%',
    y: '72%',
    rotation: 3,
    delay: 4,
    duration: 20,
  },
  {
    icon: <Check className="h-3 w-3 text-blue-400" />,
    text: 'Widget installé',
    sub: '1 ligne de code',
    x: '82%',
    y: '65%',
    rotation: -4,
    delay: 1,
    duration: 24,
  },
  {
    icon: <Calendar className="h-3 w-3 text-purple-400" />,
    text: '12 réservations',
    sub: 'Aujourd\'hui',
    x: '50%',
    y: '85%',
    rotation: 5,
    delay: 3,
    duration: 16,
  },
];

const checkItems = [
  'Sans engagement',
  'Installation rapide',
  'Forfait fixe · 0€/couvert',
  'Widget intégrable',
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function HeroSection() {
  useSectionView('hero', 'section-view-hero');

  return (
    <section id="hero" className="relative min-h-[92vh] flex items-center justify-center px-6 pt-20 pb-8 overflow-hidden">
      {/* Subtle radial gradient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#0066FF]/[0.03] rounded-full blur-3xl -translate-y-1/4 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#0066FF]/[0.02] rounded-full blur-3xl translate-y-1/4 -translate-x-1/4" />
      </div>

      {/* Floating cards */}
      {floatingCards.map((card, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 40 }}
          animate={{
            opacity: [0.35, 0.55, 0.35],
            y: [0, -12, 0],
            rotate: [card.rotation, card.rotation + 1, card.rotation],
            x: [0, 6, -4, 0],
          }}
          transition={{
            opacity: {
              duration: card.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: card.delay,
            },
            y: {
              duration: card.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: card.delay,
            },
            rotate: {
              duration: card.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: card.delay,
            },
            x: {
              duration: card.duration * 1.3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: card.delay,
            },
          }}
          className="absolute hidden lg:block pointer-events-none"
          style={{ left: card.x, top: card.y }}
        >
          <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-lg px-3 py-2 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center">
                {card.icon}
              </div>
              <div>
                <div className="text-xs font-medium text-gray-700 leading-tight">
                  {card.text}
                </div>
                <div className="text-xs text-gray-400 leading-tight">{card.sub}</div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Main content */}
      <div className="relative z-10 container mx-auto max-w-4xl text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Title */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-6xl lg:text-7xl font-light text-[#2A2A2A] leading-[1.1] tracking-tight max-w-3xl mx-auto"
          >
            Votre système de réservation
            <span className="block text-[#0066FF] font-normal mt-3">
              installé avant le prochain service.
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-[#666666] leading-relaxed font-light max-w-2xl mx-auto"
          >
            Logiciel de réservation restaurant sans commission (0€/couvert).
            Simple, mobile. TableMaster s&apos;occupe de tout : widget sur votre site, avis Google automatisés, rappels 24h.
            Gérez vos réservations en temps réel.
          </motion.p>

          {/* Badge */}
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#0066FF]/20 bg-[#0066FF]/[0.04] text-[#0066FF] text-sm font-light">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF] animate-pulse" />
              À partir de 39€/mois · Sans engagement · Résiliable à tout moment
            </span>
          </motion.div>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
          >
            <Link
              href="/signup"
              data-umami-event="hero-signup-cta-click"
              className="group inline-flex items-center justify-center px-8 py-4 bg-[#0066FF] text-white font-light hover:bg-[#0052CC] transition-all rounded-lg text-lg shadow-lg shadow-[#0066FF]/20 hover:shadow-[#0066FF]/30 hover:-translate-y-0.5"
            >
              Créer mon compte gratuitement
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="ml-2"
              >
                <ArrowRight className="w-4 h-4" />
              </motion.span>
            </Link>
            <Link
              href="/#pricing"
              data-umami-event="hero-pricing-cta-click"
              className="inline-flex items-center justify-center px-8 py-4 border border-gray-200 text-[#2A2A2A] font-light hover:border-[#0066FF] hover:text-[#0066FF] transition-all rounded-lg text-lg bg-white/50 backdrop-blur-sm"
            >
              Voir les tarifs
            </Link>
          </motion.div>

          {/* Checkmarks */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 pt-6"
          >
            {checkItems.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#0066FF]/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-[#0066FF]" />
                </div>
                <span className="text-sm font-light text-[#666666]">{item}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FAFAFA] to-transparent pointer-events-none" />
    </section>
  );
}
