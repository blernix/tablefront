'use client';

import { FileText, TrendingUp, BarChart, Target, ExternalLink } from 'lucide-react';
import Link from 'next/link';

type Resource = {
  title: string;
  description: string;
  type: 'guide' | 'comparison' | 'case-study' | 'calculator';
  cta: string;
  ctaLink: string;
  keywords: string[];
};

export default function ResourcesSection() {
  const resources: Resource[] = [
    {
      title: 'Guide : Transition depuis TheFork vers TableMaster',
      description:
        "Étapes pour commencer avec TableMaster tout en utilisant TheFork en parallèle pendant la période d'essai. Inclut la configuration, la formation de l'équipe et la communication aux clients.",
      type: 'guide',
      cta: 'Lire le guide',
      ctaLink: '#',
      keywords: ['transition TheFork', 'remplacement TheFork', 'période test'],
    },
    {
      title: 'Comparatif économique : TableMaster vs Zenchef 2025',
      description:
        'Analyse détaillée des coûts et fonctionnalités. Zenchef (129€-249€/mois) vs TableMaster (39€-69€/mois). Quel choix pour votre type de restaurant ?',
      type: 'comparison',
      cta: 'Voir le comparatif',
      ctaLink: '#',
      keywords: ['TableMaster vs Zenchef', 'comparatif économique', 'alternative Zenchef'],
    },
    {
      title: 'Calculateur d’économies : combien économiser vs TheFork ?',
      description:
        'Outil interactif pour estimer vos économies mensuelles et annuelles en fonction de votre volume de réservations actuel avec TheFork.',
      type: 'calculator',
      cta: 'Calculer mes économies',
      ctaLink: '#calculator',
      keywords: ['calculateur économies', 'économie vs TheFork', 'simulateur coûts'],
    },
    {
      title: 'Étude : Impact des avis Google sur la fréquentation restaurant',
      description:
        'Comment les restaurants utilisant TableMaster ont augmenté leurs avis Google de 40% en moyenne et l’impact sur leur fréquentation.',
      type: 'case-study',
      cta: 'Voir l’étude',
      ctaLink: '#case-studies',
      keywords: ['études avis Google', 'impact avis', 'boost avis Google'],
    },
  ];

  const getIcon = (type: Resource['type']) => {
    switch (type) {
      case 'guide':
        return <FileText className="w-6 h-6" />;
      case 'comparison':
        return <BarChart className="w-6 h-6" />;
      case 'calculator':
        return <TrendingUp className="w-6 h-6" />;
      case 'case-study':
        return <Target className="w-6 h-6" />;
    }
  };

  const getTypeLabel = (type: Resource['type']) => {
    switch (type) {
      case 'guide':
        return 'Guide pratique';
      case 'comparison':
        return 'Comparatif économique';
      case 'calculator':
        return 'Outil interactif';
      case 'case-study':
        return 'Étude de cas';
    }
  };

  return (
    <section id="resources" className="py-20 bg-white">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-[#2A2A2A] mb-4">
            Ressources comparatives TheFork & Zenchef
          </h2>
          <p className="text-xl text-[#666666] font-light max-w-3xl mx-auto">
            Guides, comparatifs et outils pour comprendre les différences et faire le bon choix
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {resources.map((resource, index) => (
            <div
              key={index}
              className="border border-[#E5E5E5] rounded-2xl p-8 hover:border-[#0066FF] transition-colors group"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${resource.type === 'guide' ? 'bg-blue-50 text-blue-600' : resource.type === 'comparison' ? 'bg-green-50 text-green-600' : resource.type === 'calculator' ? 'bg-purple-50 text-purple-600' : 'bg-orange-50 text-orange-600'}`}
                  >
                    {getIcon(resource.type)}
                  </div>
                  <div>
                    <span
                      className={`text-sm font-light px-3 py-1 rounded-full ${resource.type === 'guide' ? 'bg-blue-50 text-blue-600' : resource.type === 'comparison' ? 'bg-green-50 text-green-600' : resource.type === 'calculator' ? 'bg-purple-50 text-purple-600' : 'bg-orange-50 text-orange-600'}`}
                    >
                      {getTypeLabel(resource.type)}
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-5 h-5 text-[#666666] group-hover:text-[#0066FF] transition-colors" />
              </div>

              <h3 className="text-2xl font-light text-[#2A2A2A] mb-4">{resource.title}</h3>
              <p className="text-[#666666] font-light mb-6 leading-relaxed">
                {resource.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {resource.keywords.map((keyword, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-[#F5F5F5] text-[#666666] text-xs font-light rounded-full"
                  >
                    {keyword}
                  </span>
                ))}
              </div>

              <a
                href={resource.ctaLink}
                className="inline-flex items-center gap-2 text-[#0066FF] font-light hover:text-[#0052CC] transition-colors"
              >
                {resource.cta}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </a>
            </div>
          ))}
        </div>

        <div className="border-t border-[#E5E5E5] pt-16">
          <div className="text-center">
            <h3 className="text-3xl font-light text-[#2A2A2A] mb-8">
              Questions fréquentes sur TheFork vs TableMaster vs Zenchef
            </h3>

            <div className="max-w-4xl mx-auto text-left">
              <div className="prose prose-lg max-w-none">
                <div className="mb-8">
                  <h4 className="text-xl font-light text-[#2A2A2A] mb-4">
                    Pourquoi TableMaster est plus économique que TheFork ?
                  </h4>
                  <p className="text-[#666666] font-light">
                    TheFork prend une commission de 1,50€ à 2,50€ par couvert. Pour un restaurant
                    avec 300 couverts/mois, cela coûte 450€ à 750€. TableMaster coûte 39€ à 69€/mois
                    forfait fixe, soit 2 à 10 fois moins cher pour la même fréquentation.
                  </p>
                </div>

                <div className="mb-8">
                  <h4 className="text-xl font-light text-[#2A2A2A] mb-4">
                    Comment générer des avis Google sans TheFork ?
                  </h4>
                  <p className="text-[#666666] font-light">
                    TheFork redirige les avis vers sa propre plateforme, ce qui ne bénéficie pas
                    directement à votre référencement local. TableMaster envoie automatiquement des
                    emails après chaque réservation pour inviter vos clients à laisser un avis
                    directement sur votre fiche Google Business, boostant ainsi votre visibilité
                    locale et votre référencement.
                  </p>
                </div>

                <div className="mb-8">
                  <h4 className="text-xl font-light text-[#2A2A2A] mb-4">
                    TableMaster est-il vraiment moins cher que Zenchef ?
                  </h4>
                  <p className="text-[#666666] font-light">
                    Zenchef propose des forfaits de 129€ à 249€/mois. TableMaster coûte 39€ (Pack
                    Gestion) ou 69€ (Pack Croissance). Pour les mêmes fonctionnalités essentielles
                    (réservations en ligne, gestion mobile, avis Google), TableMaster est 2 à 6 fois
                    moins cher.
                  </p>
                </div>

                <div className="mb-8">
                  <h4 className="text-xl font-light text-[#2A2A2A] mb-4">
                    TableMaster offre-t-il une visibilité comparable à TheFork ?
                  </h4>
                  <p className="text-[#666666] font-light">
                    TheFork est un marketplace qui apporte de la visibilité mais au prix de
                    commissions élevées et du partage de vos données clients. TableMaster vous aide
                    à développer vos réservations directes via votre site web, vos réseaux sociaux
                    et vos avis Google, vous rendant indépendant des plateformes tierces tout en
                    réduisant vos coûts.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#0066FF] text-white font-light rounded-lg hover:bg-[#0052CC] transition-colors text-lg"
              >
                <FileText className="w-5 h-5" />
                Tester TableMaster gratuitement
              </Link>
              <p className="text-sm text-[#666666] font-light mt-4">
                14 jours d&apos;essai gratuit - Aucune carte bancaire requise
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
