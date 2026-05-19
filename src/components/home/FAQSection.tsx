'use client';

import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

type FAQItem = {
  question: string;
  answer: string;
  keywords: string[];
};

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs: FAQItem[] = [
    {
      question: 'TableMaster vs TheFork : quelle est la principale différence de coût ?',
      answer:
        'TableMaster coûte 39€/mois (Pack Gestion) ou 69€/mois (Pack Croissance) forfait fixe, tandis que TheFork prend une commission de 1,50€ à 2,50€ par couvert. Pour un restaurant avec 300 couverts/mois, TableMaster à 39€ vous fait économiser 400€ à 700€ par mois vs TheFork qui coûterait 450€ à 750€.',
      keywords: ['TheFork commission', 'coût TableMaster', 'économie vs TheFork'],
    },
    {
      question: 'TableMaster vs Zenchef : lequel est le plus économique ?',
      answer:
        'Zenchef propose des forfaits mensuels de 129€ à 249€ sans commission. TableMaster est 2 à 6 fois moins cher avec des forfaits à 39€ et 69€. Pour les mêmes fonctionnalités essentielles (réservations en ligne, gestion mobile, avis Google), TableMaster offre un meilleur rapport qualité-prix.',
      keywords: ['Zenchef prix', 'comparatif Zenchef', 'alternative Zenchef économique'],
    },
    {
      question: 'Comment TableMaster génère-t-il des avis Google sans commission ?',
      answer:
        'TableMaster envoie automatiquement des emails après chaque réservation pour inviter vos clients à laisser un avis Google directement sur votre fiche. Contrairement à TheFork qui redirige vers sa propre plateforme, nous favorisons votre visibilité Google locale sans intermédiaire.',
      keywords: ['avis Google', 'génération avis', 'sans commission'],
    },
    {
      question: 'Puis-je tester TableMaster en parallèle de ma solution actuelle ?',
      answer:
        "Oui, TableMaster peut fonctionner en parallèle de TheFork ou Zenchef pendant notre période d'essai de 14 jours. Cela vous permet de comparer les interfaces, tester les fonctionnalités et voir le retour de vos clients sans interrompre votre service actuel.",
      keywords: ["période d'essai", 'test parallèle', 'comparaison solution'],
    },
    {
      question: 'TableMaster offre-t-il une interface mobile comme TheFork Manager ?',
      answer:
        "Oui, TableMaster propose une interface mobile optimisée qui fonctionne sur tous les smartphones. Vous recevez des notifications push en temps réel pour les nouvelles réservations, annulations et modifications, sans besoin d'installer une application dédiée.",
      keywords: ['application mobile', 'TheFork Manager', 'notifications push'],
    },
    {
      question: 'Quelle est la différence entre TableMaster et un simple formulaire de contact ?',
      answer:
        "TableMaster est un système complet : gestion de salle avec vue calendrier, validation manuelle, emails automatiques, génération d'avis Google, notifications temps réel, statistiques détaillées et export CSV. Un simple formulaire ne gère pas les conflits de réservation ni l'optimisation des horaires.",
      keywords: ['gestion de salle', 'système complet', 'vs formulaire contact'],
    },
    {
      question: 'TableMaster prend-il en charge les réservations en groupe ?',
      answer:
        'Oui, TableMaster gère les réservations en groupe avec des paramètres spécifiques (durée moyenne, nombre de couverts). Vous pouvez configurer des événements spéciaux avec des horaires et capacités différents de votre fonctionnement habituel.',
      keywords: ['réservations groupe', 'événements', 'capacité configurable'],
    },
    {
      question: 'Comment TableMaster protège-t-il mes données clients vs TheFork ?',
      answer:
        'TableMaster stocke vos données en France (RGPD) et ne les partage jamais avec des tiers. Contrairement à TheFork qui utilise vos données pour son marketplace, TableMaster est un outil propriétaire : vos données clients restent 100% confidentielles.',
      keywords: ['RGPD', 'protection données', 'confidentialité TheFork'],
    },
  ];

  return (
    <section id="faq" className="py-20 bg-[#FAFAFA]">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <HelpCircle className="w-8 h-8 text-[#0066FF]" />
            <h2 className="text-4xl md:text-5xl font-light text-[#2A2A2A]">
              Questions fréquentes : TableMaster vs TheFork & Zenchef
            </h2>
          </div>
          <p className="text-xl text-[#666666] font-light max-w-3xl mx-auto">
            Comparatif honnête des solutions de réservation pour restaurants
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="mb-4 border border-[#E5E5E5] bg-white rounded-lg overflow-hidden hover:border-[#0066FF] transition-colors"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left px-8 py-6 flex items-center justify-between hover:bg-[#FAFAFA] transition-colors"
                aria-expanded={openIndex === index}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#0066FF]/10 rounded-full flex items-center justify-center">
                    <span className="text-[#0066FF] font-light">{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-light text-[#2A2A2A] mb-2">{faq.question}</h3>
                    <div className="flex flex-wrap gap-2">
                      {faq.keywords.map((keyword, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-[#F5F5F5] text-[#666666] text-xs font-light rounded-full"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-4">
                  {openIndex === index ? (
                    <ChevronUp className="w-6 h-6 text-[#0066FF]" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-[#666666]" />
                  )}
                </div>
              </button>

              {openIndex === index && (
                <div className="px-8 pb-6 pt-2 border-t border-[#E5E5E5]">
                  <div className="pl-12">
                    <p className="text-[#666666] font-light leading-relaxed text-lg">
                      {faq.answer}
                    </p>
                    <div className="mt-4 pt-4 border-t border-[#E5E5E5]/50">
                      <p className="text-sm text-[#0066FF] font-light">
                        💡 Cette question concerne : {faq.keywords.join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12 pt-8 border-t border-[#E5E5E5]">
          <p className="text-[#666666] font-light mb-6">
            Vous avez une autre question sur la comparaison avec TheFork ou Zenchef ?
          </p>
          <a
            href="mailto:contact@tablemaster.fr?subject=Question%20comparaison%20TheFork%20Zenchef"
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#0066FF] text-white font-light rounded-lg hover:bg-[#0052CC] transition-colors"
          >
            <HelpCircle className="w-5 h-5" />
            Poser une question spécifique
          </a>
        </div>
      </div>
    </section>
  );
}
