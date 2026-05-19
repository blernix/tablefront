'use client';

import { Zap, Shield, Star } from 'lucide-react';

export default function PricingAdvantagesSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-[#0066FF] to-[#0052CC]">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-4">
            Alternative TheFork & Zenchef : pourquoi choisir TableMaster ?
          </h2>
          <p className="text-xl text-white/90 font-light">
            La solution professionnelle sans commission, contrairement aux plateformes
            traditionnelles
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 text-white">
            <Zap className="w-12 h-12 mb-4" />
            <h3 className="text-2xl font-light mb-3">Zero commission vs TheFork</h3>
            <p className="font-light text-white/90 leading-relaxed">
              Fini les 15% prélevés sur chaque couvert comme TheFork. Un tarif fixe de 39€/mois,
              économisez des centaines d&apos;euros.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 text-white">
            <Shield className="w-12 h-12 mb-4" />
            <h3 className="text-2xl font-light mb-3">Flexible vs Zenchef</h3>
            <p className="font-light text-white/90 leading-relaxed">
              Résiliez quand vous voulez, sans frais cachés. Contrairement aux contrats longs des
              alternatives, restez libre.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 text-white">
            <Star className="w-12 h-12 mb-4" />
            <h3 className="text-2xl font-light mb-3">Simple vs complexes</h3>
            <p className="font-light text-white/90 leading-relaxed">
              Widget, notifications push, avis Google automatisés... Installation en 1 minute vs
              solutions complexes des concurrents.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
