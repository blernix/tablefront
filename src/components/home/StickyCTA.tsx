'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export interface StickyCTAProps {
  ctaText?: string;
  ctaHref?: string;
  captionText?: string;
}

export default function StickyCTA({
  ctaText = 'Essayer gratuitement',
  ctaHref = '/signup',
  captionText = "14 jours d'essai · Aucune carte bancaire",
}: StickyCTAProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-3 md:hidden bg-white/90 backdrop-blur-md border-t border-[#E5E5EA] safe-area-inset-bottom">
      <Link
        href={ctaHref}
        data-umami-event="sticky-cta-signup-click"
        className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#0066FF] text-white font-medium rounded-xl text-[15px] shadow-lg shadow-[#0066FF]/20 active:bg-[#0052CC] transition-colors"
      >
        {ctaText}
        <ArrowRight className="w-4 h-4" />
      </Link>
      <p className="text-center text-[11px] text-[#8E8E93] mt-1.5">
        {captionText}
      </p>
    </div>
  );
}
