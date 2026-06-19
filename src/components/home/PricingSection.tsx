'use client';

import Link from 'next/link';
import { Check } from 'lucide-react';
import { useSectionView } from '@/hooks/useSectionView';

export default function PricingSection() {
  useSectionView('pricing', 'section-view-pricing');

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-[#2A2A2A] mb-4">
            Tarifs transparents du logiciel réservation restaurant
          </h2>
          <p className="text-xl text-[#666666] font-light max-w-2xl mx-auto">
            Choisissez le plan qui correspond à vos besoins. Sans engagement, résiliable à tout
            moment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Pack Gestion */}
          <div className="border-2 border-[#E5E5E5] bg-white p-10 hover:border-[#0066FF] transition-colors">
            <div className="mb-8">
              <div className="inline-block px-3 py-1 bg-[#F0F0F0] text-[#666666] text-xs font-light uppercase tracking-wider mb-2">
                Pack Gestion
              </div>
              <div className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-light uppercase tracking-wider mb-4">
                14 jours d&apos;essai gratuit
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-5xl font-light text-[#2A2A2A]">39€</span>
                <span className="text-xl text-[#666666]">/mois</span>
              </div>
              <p className="text-[#666666] font-light">
                L&apos;essentiel pour organiser votre salle et supprimer les commissions
              </p>
            </div>

            <ul className="space-y-4 mb-10">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                <span className="text-[#666666] font-light">400 réservations / mois</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                <span className="text-[#666666] font-light">Notifications push en temps réel</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                <span className="text-[#666666] font-light">
                  Widget & URL de réservation non personnalisable
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                <span className="text-[#666666] font-light">
                  Emails de confirmation automatiques aux clients
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                <span className="text-[#666666] font-light">Export CSV</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                <span className="text-[#666666] font-light">Support par email</span>
              </li>
            </ul>

            <Link
              href="/signup"
              data-umami-event="pricing-starter-cta-click"
              className="block w-full text-center px-8 py-4 border-2 border-[#0066FF] text-[#0066FF] font-light hover:bg-[#0066FF] hover:text-white transition-colors"
            >
              Commencer avec le pack gestion
            </Link>
          </div>

          {/* Pack Croissance */}
          <div className="border-2 border-[#0066FF] bg-white p-10 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#0066FF] text-white text-xs font-light uppercase tracking-wider">
              Populaire
            </div>

            <div className="mb-8">
              <div className="inline-block px-3 py-1 bg-[#0066FF]/10 text-[#0066FF] text-xs font-light uppercase tracking-wider mb-2">
                Pack Croissance
              </div>
              <div className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-light uppercase tracking-wider mb-4">
                14 jours d&apos;essai gratuit
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-5xl font-light text-[#0066FF]">69€</span>
                <span className="text-xl text-[#666666]">/mois</span>
              </div>
              <p className="text-[#666666] font-light">
                Le moteur de croissance qui se rentabilise seul
              </p>
            </div>

            <ul className="space-y-4 mb-10">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                <span className="text-[#666666] font-light">Réservations illimitées</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                <span className="text-[#666666] font-light">
                  Toutes les fonctionnalités du Pack Gestion
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                <span className="text-[#666666] font-light">Comptes serveurs illimités</span>
              </li>

              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                <span className="text-[#666666] font-light">Support prioritaire</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                <span className="text-[#666666] font-light">
                  Personnalisation couleur et texte du widget
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                <span className="text-[#666666] font-light">
                  Personnalisation couleur et texte du formulaire
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                <span className="text-[#666666] font-light">Personnalisation de votre url</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                <span className="text-[#666666] font-light">Demandes d&apos;avis automatiques</span>
              </li>
            </ul>

            <Link
              href="/signup"
              data-umami-event="pricing-pro-cta-click"
              className="block w-full text-center px-8 py-4 bg-[#0066FF] text-white font-light hover:bg-[#0052CC] transition-colors"
            >
              Commencer avec le pack croissance
            </Link>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-[#666666] font-light mb-4">
            Sans engagement • Résiliable à tout moment
          </p>
          <p className="text-sm text-[#666666] font-light">
            Tous les plans incluent : Mises à jour gratuites • Hébergement sécurisé • Sauvegardes
            automatiques
          </p>
        </div>
      </div>
    </section>
  );
}
