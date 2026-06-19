'use client';

import { useSectionView } from '@/hooks/useSectionView';
import { ChefHat, Store, Building2, Users } from 'lucide-react';

export default function TargetAudienceSection() {
  useSectionView('audience', 'section-view-audience');

  return (
    <section id="audience" className="py-20 bg-[#FAFAFA]">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-[#2A2A2A] mb-4">
            Logiciel réservation pour tous types d&apos;établissements
          </h2>
          <p className="text-xl text-[#666666] font-light max-w-2xl mx-auto">
            TableMaster s&apos;adapte à votre activité, quelle que soit sa taille
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-[#E5E5E5] p-6 text-center hover:border-[#0066FF] transition-colors">
            <ChefHat className="w-10 h-10 text-[#0066FF] mx-auto mb-4" />
            <h3 className="text-lg font-light text-[#2A2A2A] mb-2">Restaurants</h3>
            <p className="text-sm text-[#666666] font-light">
              Gastronomique, traditionnel, bistronomique
            </p>
          </div>

          <div className="bg-white border border-[#E5E5E5] p-6 text-center hover:border-[#0066FF] transition-colors">
            <Store className="w-10 h-10 text-[#0066FF] mx-auto mb-4" />
            <h3 className="text-lg font-light text-[#2A2A2A] mb-2">Brasseries</h3>
            <p className="text-sm text-[#666666] font-light">Service continu et forte affluence</p>
          </div>

          <div className="bg-white border border-[#E5E5E5] p-6 text-center hover:border-[#0066FF] transition-colors">
            <Building2 className="w-10 h-10 text-[#0066FF] mx-auto mb-4" />
            <h3 className="text-lg font-light text-[#2A2A2A] mb-2">Cafés & Salons</h3>
            <p className="text-sm text-[#666666] font-light">
              Brunch, afternoon tea, petite restauration
            </p>
          </div>

          <div className="bg-white border border-[#E5E5E5] p-6 text-center hover:border-[#0066FF] transition-colors">
            <Users className="w-10 h-10 text-[#0066FF] mx-auto mb-4" />
            <h3 className="text-lg font-light text-[#2A2A2A] mb-2">Traiteurs</h3>
            <p className="text-sm text-[#666666] font-light">
              Événements et prestations sur-mesure
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
