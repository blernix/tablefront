'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useSectionView } from '@/hooks/useSectionView';

export default function CTASection() {
  useSectionView('cta', 'section-view-cta');

  return (
    <section id="cta" className="py-20 bg-gradient-to-br from-[#0066FF] to-[#0052CC]">
      <div className="container mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-light text-white mb-6">
          Prêt à transformer votre gestion de réservations ?
        </h2>
        <p className="text-xl text-white/90 font-light mb-10 max-w-2xl mx-auto">
          Rejoignez les restaurateurs qui économisent des centaines d&apos;euros par mois avec
          TableMaster.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup"
            data-umami-event="cta-section-signup-click"
            className="inline-flex items-center justify-center px-10 py-5 bg-white text-[#0066FF] text-lg font-light hover:bg-white/90 transition-colors"
          >
            S&apos;inscrire gratuitement maintenant
            <ArrowRight className="ml-3 w-5 h-5" />
          </Link>
          <Link
            href="/#pricing"
            data-umami-event="cta-section-pricing-click"
            className="inline-flex items-center justify-center px-10 py-5 border-2 border-white text-white text-lg font-light hover:bg-white/10 transition-colors"
          >
            Voir les tarifs
          </Link>
        </div>
        <p className="text-sm text-white/80 font-light mt-6">
          • Installation en 5 minutes • Support inclus
        </p>
      </div>
    </section>
  );
}
