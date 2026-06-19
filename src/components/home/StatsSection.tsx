'use client';

import { useSectionView } from '@/hooks/useSectionView';

export default function StatsSection() {
  useSectionView('stats', 'section-view-stats');

  return (
    <section id="stats" className="py-20 bg-white">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-[#2A2A2A] mb-4">Nos chiffres clés</h2>
          <p className="text-xl text-[#666666] font-light max-w-2xl mx-auto">
            Des résultats concrets pour nos restaurants partenaires
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-blue-50 border border-blue-100 p-6 text-center rounded-xl">
            <div className="text-4xl md:text-5xl font-bold text-[#0066FF] mb-2">90%</div>
            <p className="text-sm font-light text-[#666666]">Clients satisfaits</p>
          </div>

          <div className="bg-blue-50 border border-blue-100 p-6 text-center rounded-xl">
            <div className="text-4xl md:text-5xl font-bold text-[#0066FF] mb-2">55+</div>
            <p className="text-sm font-light text-[#666666]">Restaurants actifs</p>
          </div>

          <div className="bg-blue-50 border border-blue-100 p-6 text-center rounded-xl">
            <div className="text-4xl md:text-5xl font-bold text-[#0066FF] mb-2">99%</div>
            <p className="text-sm font-light text-[#666666]">Disponibilité système</p>
          </div>

          <div className="bg-blue-50 border border-blue-100 p-6 text-center rounded-xl">
            <div className="text-4xl md:text-5xl font-bold text-[#0066FF] mb-2">30%</div>
            <p className="text-sm font-light text-[#666666]">Avis Google en plus</p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-[#666666] font-light text-sm">
            Basé sur les retours de nos clients et nos analyses internes
          </p>
        </div>
      </div>
    </section>
  );
}
