'use client';

import { useSectionView } from '@/hooks/useSectionView';

export interface StatItem {
  value: string;
  label: string;
}

export interface StatsSectionProps {
  heading?: string;
  subheading?: string;
  stats?: StatItem[];
  footerText?: string;
}

const defaultStats: StatItem[] = [
  { value: '90%', label: 'Clients satisfaits' },
  { value: '55+', label: 'Restaurants actifs' },
  { value: '99%', label: 'Disponibilité système' },
  { value: '30%', label: 'Avis Google en plus' },
];

export default function StatsSection({
  heading = 'Nos chiffres clés',
  subheading = 'Des résultats concrets pour nos restaurants partenaires',
  stats = defaultStats,
  footerText = 'Basé sur les retours de nos clients et nos analyses internes',
}: StatsSectionProps) {
  useSectionView('stats', 'section-view-stats');

  return (
    <section id="stats" className="py-20 bg-white">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-[#2A2A2A] mb-4">{heading}</h2>
          <p className="text-xl text-[#666666] font-light max-w-2xl mx-auto">
            {subheading}
          </p>
        </div>

        <div className={`grid gap-6 ${stats.length === 4 ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 md:grid-cols-3'}`}>
          {stats.map((stat, i) => (
            <div key={i} className="bg-blue-50 border border-blue-100 p-6 text-center rounded-xl">
              <div className="text-4xl md:text-5xl font-bold text-[#0066FF] mb-2">{stat.value}</div>
              <p className="text-sm font-light text-[#666666]">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-[#666666] font-light text-sm">
            {footerText}
          </p>
        </div>
      </div>
    </section>
  );
}
