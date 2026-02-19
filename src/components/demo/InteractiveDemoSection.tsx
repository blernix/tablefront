'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import FloatingWidgetDemo from './FloatingWidgetDemo';
import ReservationFormDemo from './ReservationFormDemo';
import SwipeValidationDemo from './SwipeValidationDemo';
import DashboardStatsDemo from './DashboardStatsDemo';
import DirectLinkFormDemo from './DirectLinkFormDemo';
import CalendarViewDemo from './CalendarViewDemo';
import ListViewDemo from './ListViewDemo';
import EmailReviewDemo from './EmailReviewDemo';

export default function InteractiveDemoSection() {
  const [activeTab, setActiveTab] = useState(0);

  const demos = [
    {
      id: 1,
      title: 'Widget flottant',
      description: 'Bouton discret sur votre site',
      detailedDescription:
        "Intégrez notre widget flottant en 2 lignes de code. Il s'adapte automatiquement à votre design et reste discret tout en étant accessible.",
      component: <FloatingWidgetDemo />,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      features: [
        {
          title: 'Intégration invisible',
          description: "S'adapte aux couleurs de votre charte graphique en un clic.",
        },
        {
          title: 'Conversion maximale',
          description: 'Toujours accessible, même quand le client scrolle votre carte.',
        },
        {
          title: 'Zéro maintenance',
          description: 'Une fois installé, il se met à jour tout seul.',
        },
      ],
    },
    {
      id: 2,
      title: 'Formulaire intelligent',
      description: 'Réservation en quelques secondes',
      detailedDescription:
        "Vos clients remplissent un formulaire optimisé qui pré-remplit les informations lorsque c'est possible. Validation instantanée.",
      component: <ReservationFormDemo />,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      features: [
        {
          title: 'Expérience "sans friction"',
          description: 'Moins de champs à remplir pour un taux de complétion plus élevé.',
        },
        {
          title: 'Mémoire intelligente',
          description: 'Reconnaît vos clients réguliers pour pré-remplir leurs coordonnées.',
        },
        {
          title: 'Disponibilités réelles',
          description: 'Ne propose que les créneaux où vous avez encore de la place.',
        },
      ],
    },
    {
      id: 3,
      title: 'Validation par swipe',
      description: 'Gestion rapide depuis mobile',
      detailedDescription:
        "Acceptez ou refusez les réservations d'un simple geste sur votre mobile. Idéal pour gérer votre établissement en déplacement.",
      component: <SwipeValidationDemo />,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
      ),
      features: [
        {
          title: 'Gestion au pouce',
          description: 'Un swipe à droite pour confirmer, un swipe à gauche pour décliner.',
        },
        {
          title: 'Réponses instantanées',
          description: 'Le client reçoit son email de confirmation instantanément.',
        },
        {
          title: 'Liberté totale',
          description: 'Gérez votre salle depuis votre terrasse ou votre domicile.',
        },
      ],
    },
    {
      id: 4,
      title: 'Dashboard en temps réel',
      description: 'Statistiques et performances',
      detailedDescription:
        "Suivez vos réservations, votre taux d'occupation et vos revenus estimés en temps réel. Exportez vos données pour analyses.",
      component: <DashboardStatsDemo />,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      features: [
        {
          title: 'Prévisions de CA',
          description: 'Visualisez vos revenus estimés avant même le début du service.',
        },
        {
          title: "Analyse d'occupation",
          description: 'Identifiez vos services creux pour lancer des offres spéciales.',
        },
        {
          title: 'Export comptable',
          description: 'Téléchargez vos données en CSV pour votre comptabilité en un clic.',
        },
      ],
    },
    {
      id: 5,
      title: 'Formulaire par lien direct',
      description: 'URL dédiée',
      detailedDescription:
        'Partagez un lien unique sur vos réseaux sociaux. Vos clients accèdent directement à votre formulaire de réservation optimisé.',
      component: <DirectLinkFormDemo />,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>
      ),
      features: [
        {
          title: 'Bio Instagram optimisée',
          description: 'Un lien court et pro qui rassure vos followers.',
        },
        {
          title: 'QR Codes de table',
          description:
            'Permettez aux clients de réserver leur prochaine table avant même de partir.',
        },
        {
          title: "Prêt pour être utilisé",
          description: 'Dès votre inscription, commencez à utiliser votre formulaire.',
        },
      ],
    },
    {
      id: 6,
      title: 'Vue calendrier',
      description: 'Planning visuel des réservations',
      detailedDescription:
        'Visualisez toutes vos réservations sur un calendrier interactif. Survolez une date pour voir les détails et gérez facilement les créneaux surchargés.',
      component: <CalendarViewDemo />,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      features: [
        {
          title: 'Alerte "Heure de pointe"',
          description: 'Visualisez immédiatement quand votre cuisine sera sous pression.',
        },
        {
          title: 'Vue globale',
          description: 'Basculez entre vue journalière, hebdomadaire ou mensuelle.',
        },
        {
          title: 'Notes de service',
          description:
            "Ajoutez des annotations (anniversaire, allergie) visibles par toute l'équipe.",
        },
      ],
    },
    {
      id: 7,
      title: 'Vue liste',
      description: 'Gestion rapide par statut',
      detailedDescription:
        'Consultez toutes vos réservations dans une liste triable et filtrable. Confirmez, refusez ou terminez les réservations en un clic. Parfait pour le service en salle.',
      component: <ListViewDemo />,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 10h16M4 14h16M4 18h16"
          />
        </svg>
      ),
      features: [
        {
          title: 'Recherche ultra-rapide',
          description: 'Retrouvez une résa par nom ou téléphone en moins de 3 secondes.',
        },
        {
          title: 'Pointage des arrivées',
          description: 'Marquez les clients présents pour libérer les tables des "No-shows".',
        },
        {
          title: 'Filtres intelligents',
          description: 'Affichez uniquement ce qui compte (ex: "En attente" ou "Ce soir").',
        },
      ],
    },
    {
      id: 8,
      title: 'Terminer + avis automatique',
      description: 'Star feature !',
      detailedDescription:
        "Terminez une réservation d'un simple swipe et déclenchez automatiquement l'envoi d'un email pour demander un avis Google. Suivez vos statistiques d'avis en temps réel.",
      component: <EmailReviewDemo />,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      ),
      features: [
        {
          title: 'Timing parfait',
          description: "L'email part pile au moment où le client quitte l'établissement.",
        },
        {
          title: 'Lien direct',
          description:
            "Le client arrive directement sur l'interface d'avis, pas de recherche à faire.",
        },
        {
          title: 'Cercle vertueux',
          description: "Plus d'avis = plus de visibilité = plus de réservations.",
        },
      ],
    },
  ];

  const activeDemo = demos[activeTab];

  return (
    <section id="demo" className="py-20 bg-[#FAFAFA]">
      <div className="container mx-auto max-w-6xl px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-light text-[#2A2A2A] mb-4">
            Fonctionnalités en action
          </h2>
          <p className="text-xl text-[#666666] font-light max-w-2xl mx-auto">
            Découvrez comment TableMaster simplifie votre quotidien avec des démonstrations
            interactives
          </p>
        </motion.div>

        {/* Tabs navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {demos.map((demo, index) => (
            <button
              key={demo.id}
              onClick={() => setActiveTab(index)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-300 ${
                activeTab === index
                  ? 'bg-[#0066FF] text-white shadow-md'
                  : 'bg-white text-[#666666] border border-[#E5E5E5] hover:border-[#0066FF] hover:text-[#2A2A2A]'
              }`}
            >
              {demo.icon}
              <span className="font-light">{demo.title}</span>
            </button>
          ))}
        </div>

        {/* Main demo area */}
        <div className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden shadow-sm mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Demo visualization */}
            <div className="p-8 lg:p-12 bg-gradient-to-br from-gray-50 to-white border-r border-[#E5E5E5]">
              <div className="h-64 md:h-80 flex items-center justify-center">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-full max-w-lg"
                >
                  {activeDemo.component}
                </motion.div>
              </div>
            </div>

            {/* Demo description */}
            <div className="p-8 lg:p-12">
              <motion.div
                key={`desc-${activeTab}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0066FF]/10 text-[#0066FF] text-sm font-light rounded-full mb-4">
                  {activeDemo.icon}
                  <span>Démonstration en direct</span>
                </div>

                <h3 className="text-2xl md:text-3xl font-light text-[#2A2A2A] mb-4">
                  {activeDemo.title}
                </h3>

                <p className="text-lg text-[#666666] font-light mb-6 leading-relaxed">
                  {activeDemo.detailedDescription}
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#0066FF]/10 flex items-center justify-center rounded-full flex-shrink-0 mt-0.5">
                      <svg
                        className="w-3 h-3 text-[#0066FF]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-normal text-[#2A2A2A]">Intuitif et rapide</h4>
                      <p className="text-sm text-[#666666] font-light mt-1">
                        Interface optimisée pour une prise en main immédiate
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#0066FF]/10 flex items-center justify-center rounded-full flex-shrink-0 mt-0.5">
                      <svg
                        className="w-3 h-3 text-[#0066FF]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-normal text-[#2A2A2A]">Compatible mobile</h4>
                      <p className="text-sm text-[#666666] font-light mt-1">
                        Fonctionne parfaitement sur smartphone et tablette
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#0066FF]/10 flex items-center justify-center rounded-full flex-shrink-0 mt-0.5">
                      <svg
                        className="w-3 h-3 text-[#0066FF]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-normal text-[#2A2A2A]">Inclus dans tous les plans</h4>
                      <p className="text-sm text-[#666666] font-light mt-1">
                        Aucun supplément, disponible dès l&apos;inscription
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Tab indicator */}
          <div className="h-1 bg-gradient-to-r from-[#0066FF] to-[#0052CC]" />
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center"
        >
          <p className="text-[#666666] font-light mb-6">
            Toutes ces fonctionnalités sont incluses dans votre abonnement TableMaster
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="/signup"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center px-8 py-3 bg-[#0066FF] text-white font-light hover:bg-[#0052CC] transition-colors rounded-md"
            >
              Essayer gratuitement
            </motion.a>
            <motion.a
              href="#features"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-[#E5E5E5] text-[#2A2A2A] font-light hover:border-[#0066FF] transition-colors rounded-md"
            >
              Voir toutes les fonctionnalités
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
