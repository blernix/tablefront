'use client';

import { useState } from 'react';
import { Star, Quote, TrendingUp, Users, Euro, Calendar } from 'lucide-react';
import Image from 'next/image';

type CaseStudy = {
  id: number;
  restaurantName: string;
  location: string;
  cuisine: string;
  previousPlatform: 'TheFork' | 'Zenchef' | 'Les deux';
  monthlyCovers: number;
  monthlySavings: number;
  testimonial: string;
  rating: number;
  image: string;
  highlights: string[];
};

export default function CaseStudiesSection() {
  const [selectedCase, setSelectedCase] = useState<number>(0);

  const caseStudies: CaseStudy[] = [
    {
      id: 0,
      restaurantName: 'Le Bistrot Parisien',
      location: 'Paris 11ème',
      cuisine: 'Bistrot français',
      previousPlatform: 'TheFork',
      monthlyCovers: 420,
      monthlySavings: 650,
      testimonial:
        "Après 3 ans avec TheFork, nous payions plus de 800€/mois de commissions. Avec TableMaster à 39€, nous avons réduit nos coûts de plus de 90%. La transition s'est faite en douceur et nos clients apprécient les réservations directes via notre site.",
      rating: 5,
      image: '/api/placeholder/400/300',
      highlights: ['Économie de 650€/mois', 'Réservations directes', '+25% avis Google'],
    },
    {
      id: 1,
      restaurantName: 'La Table Lyonnaise',
      location: 'Lyon 2ème',
      cuisine: 'Gastronomie lyonnaise',
      previousPlatform: 'Zenchef',
      monthlyCovers: 280,
      monthlySavings: 140,
      testimonial:
        "Zenchef coûtait 179€/mois pour des fonctionnalités que nous n'utilisions pas à 100%. TableMaster à 39€ nous offre l'essentiel : réservations en ligne, gestion mobile et avis Google automatiques. L'interface est plus simple et nos serveurs l'ont adoptée immédiatement.",
      rating: 5,
      image: '/api/placeholder/400/300',
      highlights: ['-78% sur les coûts', 'Interface simplifiée', 'Fonctionnalités essentielles'],
    },
    {
      id: 2,
      restaurantName: 'Le Comptoir Méditerranéen',
      location: 'Marseille',
      cuisine: 'Cuisine méditerranéenne',
      previousPlatform: 'Les deux',
      monthlyCovers: 550,
      monthlySavings: 800,
      testimonial:
        'Nous utilisions TheFork pour la visibilité (600€/mois de commissions) et Zenchef pour la gestion (179€/mois). Avec TableMaster Pack Croissance à 69€, nous avons tout en un. En 6 mois, nous avons économisé plus de 4 800€ et augmenté nos réservations directes de 20%.',
      rating: 5,
      image: '/api/placeholder/400/300',
      highlights: ['Économie de 800€/mois', 'Solution unique', '+20% réservations directes'],
    },
    {
      id: 3,
      restaurantName: 'Brasserie du Port',
      location: 'Bordeaux',
      cuisine: 'Brasserie',
      previousPlatform: 'TheFork',
      monthlyCovers: 380,
      monthlySavings: 550,
      testimonial:
        'TheFork nous apportait des clients mais à un coût prohibitif (2€ par couvert). Avec TableMaster, nous encourageons les réservations directes via notre site et réseaux sociaux. Les avis Google ont augmenté de 30% grâce aux emails automatiques, boostant notre référencement local.',
      rating: 4,
      image: '/api/placeholder/400/300',
      highlights: ['Contrôle total', '+30% avis Google', 'Indépendance'],
    },
  ];

  const selectedStudy = caseStudies[selectedCase];

  return (
    <section id="case-studies" className="py-20 bg-[#FAFAFA]">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <Quote className="w-8 h-8 text-[#0066FF]" />
            <h2 className="text-4xl md:text-5xl font-light text-[#2A2A2A]">
              Ils ont choisi TableMaster vs TheFork & Zenchef
            </h2>
          </div>
          <p className="text-xl text-[#666666] font-light max-w-3xl mx-auto">
            Découvrez comment des restaurants ont réduit leurs coûts tout en simplifiant leur
            gestion
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Case Study Selector */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h3 className="text-2xl font-light text-[#2A2A2A] mb-8">Témoignages</h3>

              <div className="space-y-4">
                {caseStudies.map((study) => (
                  <button
                    key={study.id}
                    onClick={() => setSelectedCase(study.id)}
                    className={`w-full text-left p-6 border rounded-xl transition-all ${selectedCase === study.id ? 'border-[#0066FF] bg-white shadow-lg' : 'border-[#E5E5E5] hover:border-[#0066FF]'}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-lg font-light text-[#2A2A2A]">
                          {study.restaurantName}
                        </div>
                        <div className="text-sm text-[#666666] font-light">{study.location}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < study.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <span className="inline-block px-3 py-1 bg-[#F5F5F5] text-[#666666] text-xs font-light rounded-full">
                        Anciennement sur {study.previousPlatform}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#666666]" />
                        <span className="text-sm text-[#666666] font-light">
                          {study.monthlyCovers} couverts/mois
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-light text-green-600">
                          Économise {study.monthlySavings}€/mois
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-8 p-6 border border-[#E5E5E5] rounded-xl bg-white">
                <h4 className="text-lg font-light text-[#2A2A2A] mb-4">En moyenne</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[#666666] font-light">Économie mensuelle</span>
                    <span className="text-xl font-light text-green-600">535€</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#666666] font-light">Taux de satisfaction</span>
                    <span className="text-xl font-light text-[#0066FF]">96%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#666666] font-light">Temps d&apos;adoption</span>
                    <span className="text-xl font-light text-[#0066FF]">3 jours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Case Study Details */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-[#E5E5E5] rounded-2xl overflow-hidden">
              <div className="p-8 border-b border-[#E5E5E5]">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                  <div>
                    <h3 className="text-3xl font-light text-[#2A2A2A] mb-2">
                      {selectedStudy.restaurantName}
                    </h3>
                    <div className="flex items-center gap-4 text-[#666666] font-light">
                      <span>{selectedStudy.location}</span>
                      <span>•</span>
                      <span>{selectedStudy.cuisine}</span>
                      <span>•</span>
                      <span className="text-[#0066FF]">
                        Anciennement sur {selectedStudy.previousPlatform}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-2xl font-light text-green-600">
                        {selectedStudy.monthlySavings}€/mois
                      </div>
                      <div className="text-sm text-[#666666] font-light">d&apos;économies</div>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-[#0066FF] to-blue-500 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="border border-[#E5E5E5] rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-[#0066FF]" />
                      </div>
                      <div>
                        <div className="text-2xl font-light text-[#2A2A2A]">
                          {selectedStudy.monthlyCovers}
                        </div>
                        <div className="text-sm text-[#666666] font-light">Couverts/mois</div>
                      </div>
                    </div>
                    <div className="text-sm text-[#666666] font-light">
                      Volume de réservations mensuel
                    </div>
                  </div>

                  <div className="border border-[#E5E5E5] rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                        <Euro className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-light text-green-600">
                          {selectedStudy.monthlySavings}€
                        </div>
                        <div className="text-sm text-[#666666] font-light">Économies/mois</div>
                      </div>
                    </div>
                    <div className="text-sm text-[#666666] font-light">
                      vs {selectedStudy.previousPlatform}
                    </div>
                  </div>

                  <div className="border border-[#E5E5E5] rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-light text-purple-600">3 jours</div>
                        <div className="text-sm text-[#666666] font-light">Adoption</div>
                      </div>
                    </div>
                    <div className="text-sm text-[#666666] font-light">
                      Temps pour former l&apos;équipe
                    </div>
                  </div>
                </div>

                {/* Testimonial */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Quote className="w-6 h-6 text-[#0066FF]" />
                    <h4 className="text-xl font-light text-[#2A2A2A]">Témoignage</h4>
                  </div>
                  <div className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl p-8">
                    <p className="text-lg text-[#666666] font-light leading-relaxed italic mb-6">
                      &quot;{selectedStudy.testimonial}&quot;
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${i < selectedStudy.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                        <span className="text-[#666666] font-light ml-2">
                          {selectedStudy.rating}.0/5.0
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-[#666666] font-light">Restaurant vérifié</div>
                        <div className="text-sm text-[#0066FF] font-light">
                          Client depuis 6+ mois
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Highlights */}
                <div>
                  <h4 className="text-xl font-light text-[#2A2A2A] mb-6">Points clés</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {selectedStudy.highlights.map((highlight, index) => (
                      <div
                        key={index}
                        className="border border-[#E5E5E5] rounded-xl p-6 text-center hover:border-[#0066FF] transition-colors"
                      >
                        <div className="text-2xl font-light text-[#2A2A2A] mb-3">
                          {highlight.split(' ')[0]}
                        </div>
                        <div className="text-[#666666] font-light">
                          {highlight.split(' ').slice(1).join(' ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-[#FAFAFA] to-white p-8 border-t border-[#E5E5E5]">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h4 className="text-xl font-light text-[#2A2A2A] mb-2">
                      Vous aussi, économisez comme {selectedStudy.restaurantName}
                    </h4>
                    <p className="text-[#666666] font-light">
                      Testez TableMaster gratuitement pendant 14 jours, sans engagement
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a
                      href="/signup"
                      className="px-8 py-3 bg-[#0066FF] text-white font-light rounded-lg hover:bg-[#0052CC] transition-colors text-center"
                    >
                      Essai gratuit 14 jours
                    </a>
                    <a
                      href={`mailto:contact@tablemaster.fr?subject=Transition%20depuis%20${selectedStudy.previousPlatform}&body=Bonjour,%20je%20suis%20intéressé%20par%20TableMaster%20comme%20${selectedStudy.restaurantName}`}
                      className="px-8 py-3 border border-[#0066FF] text-[#0066FF] font-light rounded-lg hover:bg-[#0066FF]/5 transition-colors text-center"
                    >
                      Demander une démo
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison Summary */}
            <div className="mt-8 p-8 border border-[#E5E5E5] rounded-2xl bg-white">
              <h4 className="text-2xl font-light text-[#2A2A2A] mb-6 text-center">
                Pourquoi choisir TableMaster ?
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h5 className="text-lg font-light text-[#2A2A2A] mb-4 flex items-center gap-2">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 text-sm">✗</span>
                    </div>
                    Avec TheFork/Zenchef
                  </h5>
                  <ul className="space-y-3">
                    {[
                      'TheFork: commissions de 1,50€ à 2,50€ par couvert',
                      'Zenchef: forfaits de 129€ à 249€/mois',
                      'Fonctionnalités complexes souvent sous-utilisées',
                      'Dépendance aux plateformes pour la visibilité',
                      'Données clients partagées (TheFork)',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 flex-shrink-0 mt-0.5">
                          <div className="w-4 h-4 border border-red-300 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-red-400 rounded-full" />
                          </div>
                        </div>
                        <span className="text-[#666666] font-light">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="text-lg font-light text-[#2A2A2A] mb-4 flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                    Avec TableMaster
                  </h5>
                  <ul className="space-y-3">
                    {[
                      'Forfaits fixes: 39€ ou 69€/mois (0% commission)',
                      '2 à 6 fois moins cher que Zenchef',
                      'Fonctionnalités essentielles simplifiées',
                      'Indépendance totale - votre marque en avant',
                      'Données clients 100% confidentielles',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 flex-shrink-0 mt-0.5">
                          <div className="w-4 h-4 border border-green-300 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-green-400 rounded-full" />
                          </div>
                        </div>
                        <span className="text-[#666666] font-light">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
