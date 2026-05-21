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
      question: 'Comment fonctionne la réservation en ligne avec TableMaster ?',
      answer:
        'Vous intégrez notre widget sur votre site en 2 minutes (une simple balise à copier-coller) ou partagez votre lien de réservation sur vos réseaux sociaux. Vos clients réservent en autonomie, vous recevez une notification instantanée et gérez tout depuis votre dashboard.',
      keywords: ['réservation en ligne', 'widget', 'intégration'],
    },
    {
      question: 'Quels sont les tarifs de TableMaster ?',
      answer:
        'Pack Gestion à 39€/mois (jusqu\'à 400 réservations) et Pack Croissance à 69€/mois (réservations illimitées, widget personnalisable). Les deux incluent 14 jours d\'essai gratuit, sans engagement. Pas de commission par couvert, pas de frais cachés.',
      keywords: ['tarifs', 'prix', 'abonnement'],
    },
    {
      question: 'Comment TableMaster aide-t-il à obtenir plus d\'avis Google ?',
      answer:
        'Après chaque réservation, TableMaster envoie automatiquement un email à vos clients pour les inviter à laisser un avis sur votre fiche Google. Le lien direct vers votre page d\'avis maximise le taux de réponse. Résultat : +30% d\'avis en moyenne.',
      keywords: ['avis Google', 'réputation', 'email automatique'],
    },
    {
      question: 'Puis-je tester TableMaster gratuitement ?',
      answer:
        "Oui, vous bénéficiez de 14 jours d'essai gratuit sur les deux packs, sans engagement et sans carte bancaire. Toutes les fonctionnalités sont disponibles pendant l'essai. Si vous n'êtes pas convaincu, vous ne payez rien.",
      keywords: ['essai gratuit', '14 jours', 'sans engagement'],
    },
    {
      question: 'TableMaster fonctionne-t-il sur mobile ?',
      answer:
        "Absolument. Notre dashboard est optimisé pour tous les écrans. Vous recevez des notifications push en temps réel pour chaque nouvelle réservation, annulation ou modification. Gérez vos réservations où que vous soyez, sans installer d'application.",
      keywords: ['mobile', 'smartphone', 'notifications push'],
    },
    {
      question: 'En quoi TableMaster est différent d\'un simple formulaire de contact ?',
      answer:
        "TableMaster est un système complet : gestion de salle avec vue calendrier, validation des réservations, emails automatiques (confirmation, rappel 24h), génération d'avis Google, notifications en temps réel, statistiques détaillées et export CSV. Un simple formulaire ne gère pas les conflits de réservation ni l'occupation de votre salle.",
      keywords: ['gestion de salle', 'système complet', 'vs formulaire contact'],
    },
    {
      question: 'TableMaster gère-t-il les réservations en groupe ?',
      answer:
        'Oui, vous configurez vos créneaux et capacités selon vos besoins. Vous pouvez définir des horaires spécifiques pour les grands groupes ou les événements, avec une durée de réservation ajustable pour optimiser votre service.',
      keywords: ['réservations groupe', 'événements', 'capacité configurable'],
    },
    {
      question: 'Mes données clients sont-elles protégées ?',
      answer:
        'Oui. Toutes vos données sont stockées en France, conformément au RGPD. Vous restez propriétaire de vos données clients : nous ne les partageons jamais avec des tiers, ne les utilisons pas à des fins marketing et vous pouvez les exporter à tout moment.',
      keywords: ['RGPD', 'protection données', 'confidentialité'],
    },
  ];

  return (
    <section id="faq" className="py-20 bg-[#FAFAFA]">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <HelpCircle className="w-8 h-8 text-[#0066FF]" />
            <h2 className="text-4xl md:text-5xl font-light text-[#2A2A2A]">
              Questions fréquentes
            </h2>
          </div>
          <p className="text-xl text-[#666666] font-light max-w-3xl mx-auto">
            Tout ce que vous devez savoir sur TableMaster
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
            Vous avez une autre question ?
          </p>
          <a
            href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@tablemaster.fr'}?subject=Question%20TableMaster`}
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
