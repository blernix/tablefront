'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useSectionView } from '@/hooks/useSectionView';

export interface CTASectionProps {
  heading?: string;
  subtext?: string;
  trialText?: string;
  ctaText?: string;
  ctaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  footerText?: string;
}

export default function CTASection({
  heading = 'Arrêtez de payer pour vos propres clients.',
  subtext = 'Rejoignez les restaurateurs qui économisent en moyenne 250€ par mois en supprimant les commissions.',
  trialText = "14 jours d'essai · Aucune carte bancaire requise",
  ctaText = "S'inscrire gratuitement maintenant",
  ctaHref = '/signup',
  secondaryCtaText = 'Voir les tarifs',
  secondaryCtaHref = '/#pricing',
  footerText = '• Installation en 5 minutes • Support inclus',
}: CTASectionProps) {
  useSectionView('cta', 'section-view-cta');

  return (
    <section id="cta" className="py-20 bg-gradient-to-br from-[#0066FF] to-[#0052CC]">
      <div className="container mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6">
            {heading}
          </h2>
          <p className="text-xl text-white/90 font-light mb-4 max-w-2xl mx-auto">
            {subtext}
          </p>
          <p className="text-sm text-white/70 font-light mb-10">
            {trialText}
          </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={ctaHref}
            data-umami-event="cta-section-signup-click"
            className="inline-flex items-center justify-center px-10 py-5 bg-white text-[#0066FF] text-lg font-light hover:bg-white/90 transition-colors"
          >
            {ctaText}
            <ArrowRight className="ml-3 w-5 h-5" />
          </Link>
          {secondaryCtaText && (
            <Link
              href={secondaryCtaHref}
              data-umami-event="cta-section-pricing-click"
              className="inline-flex items-center justify-center px-10 py-5 border-2 border-white text-white text-lg font-light hover:bg-white/10 transition-colors"
            >
              {secondaryCtaText}
            </Link>
          )}
        </div>
        <p className="text-sm text-white/80 font-light mt-6">
          {footerText}
        </p>
      </div>
    </section>
  );
}
