'use client';

import { motion } from 'framer-motion';
import FloatingWidgetDemo from './FloatingWidgetDemo';
import ReservationFormDemo from './ReservationFormDemo';
import SwipeValidationDemo from './SwipeValidationDemo';
import DashboardStatsDemo from './DashboardStatsDemo';
import DirectLinkFormDemo from './DirectLinkFormDemo';
import CalendarViewDemo from './CalendarViewDemo';
import ListViewDemo from './ListViewDemo';
import EmailReviewDemo from './EmailReviewDemo';
import DemoChapter from './DemoChapter';
import { useChapterScroll } from '@/hooks/useChapterScroll';

// Icons for chapters
import {
  Sparkles,
  FileText,
  Smartphone,
  BarChart3,
  Link as LinkIcon,
  Calendar,
  List,
  Star,
} from 'lucide-react';

export default function ParallaxDemoSection() {
  // Define chapters data
  const chapters = [
    {
      id: 1,
      title: 'Découverte',
      description: 'Widget flottant discret sur votre site',
      detailedDescription:
        "Intégrez notre widget flottant en 1 ligne de code. Son design et épuré reste discret tout en étant accessible.",
      component: <FloatingWidgetDemo />,
      icon: <Sparkles className="w-4 h-4" />,
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
      title: 'Réservation',
      description: 'Formulaire intelligent en quelques secondes',
      detailedDescription:
        "Vos clients remplissent un formulaire optimisé qui pré-remplit les informations lorsque c'est possible. Validation instantanée.",
      component: <ReservationFormDemo />,
      icon: <FileText className="w-4 h-4" />,
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
          description: 'Ne propose que les créneaux que vous avez ouvert.',
        },
      ],
    },
    {
      id: 3,
      title: 'Validation',
      description: 'Gestion rapide depuis mobile',
      detailedDescription:
        "Acceptez ou refusez les réservations d'un simple geste sur votre mobile. Idéal pour gérer votre établissement en déplacement.",
      component: <SwipeValidationDemo />,
      icon: <Smartphone className="w-4 h-4" />,
      features: [
        {
          title: 'Gestion au pouce',
          description: 'Un swipe à droite pour confirmer, un swipe à gauche pour décliner.',
        },
        {
          title: 'Réponses instantanées',
          description: 'Le client reçoit un email de confirmation instantannément.',
        },
        {
          title: 'Liberté totale',
          description: 'Gérez votre salle depuis votre terrasse ou votre domicile.',
        },
      ],
    },
    {
      id: 4,
      title: 'Suivi',
      description: 'Statistiques et performances en temps réel',
      detailedDescription:
        "Suivez vos réservations, votre taux d'occupation et vos revenus estimés en temps réel. Exportez vos données pour analyses.",
      component: <DashboardStatsDemo />,
      icon: <BarChart3 className="w-4 h-4" />,
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
      title: 'Accessibilité',
      description: 'URL dédiée',
      detailedDescription:
        'Partagez un lien unique sur vos réseaux sociaux. Vos clients accèdent directement à votre formulaire de réservation optimisé.',
      component: <DirectLinkFormDemo />,
      icon: <LinkIcon className="w-4 h-4" />,
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
          title: "Prêt pour utilisation",
          description: 'Dès votre inscription, commencez à utiliser le formulaire.',
        },
      ],
    },
    {
      id: 6,
      title: 'Planification',
      description: 'Planning visuel des réservations',
      detailedDescription:
        'Visualisez toutes vos réservations sur un calendrier interactif. Survolez une date pour voir les détails et gérez facilement les créneaux surchargés.',
      component: <CalendarViewDemo />,
      icon: <Calendar className="w-4 h-4" />,
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
      title: 'Gestion',
      description: 'Organisation rapide par statut',
      detailedDescription:
        'Consultez toutes vos réservations dans une liste triable et filtrable. Confirmez, refusez ou terminez les réservations en un clic. Parfait pour le service en salle.',
      component: <ListViewDemo />,
      icon: <List className="w-4 h-4" />,
      features: [
        {
          title: 'Recherche ultra-rapide',
          description: 'Retrouvez rapidement une reservation grâce à la recherche intelligente.',
        },
        {
          title: 'Pointage des arrivées',
          description: 'Marquez les clients présents pour libérer les tables des "No-shows".',
        },
        {
          title: 'Filtres intelligents',
          description: 'Affichez uniquement ce qui compte (ex: "En attente" ou "réservation du jour").',
        },
      ],
    },
    {
      id: 8,
      title: 'Fidélisation',
      description: 'Terminer + avis Google automatique',
      detailedDescription:
        "Terminez une réservation d'un simple swipe et déclenchez automatiquement l'envoi d'un email pour demander un avis Google. Suivez vos statistiques d'avis en temps réel.",
      component: <EmailReviewDemo />,
      icon: <Star className="w-4 h-4" />,
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

  // Use scroll tracking hook
  const {
    activeChapter,
    progress,
    chapterProgress,
    isSectionVisible,
    containerRef,
    scrollToChapter,
  } = useChapterScroll({
    chapterCount: chapters.length,
    chapterHeight: 100, // Each chapter takes full viewport height
    offset: 0.3, // Chapter becomes active when 30% in view
    intersectionThreshold: 0.1, // Section must be 10% visible to activate animations
  });

  // Debug logging
  // console.log(
  //   `ParallaxDemoSection: isSectionVisible=${isSectionVisible}, activeChapter=${activeChapter}, chapterProgress=${chapterProgress}`
  // );

  return (
    <section
      id="demo"
      className={`relative bg-[#FAFAFA] transition-colors duration-1000 ${isSectionVisible ? 'bg-gradient-to-b from-[#FAFAFA] to-[#F5F5F5]' : ''}`}
    >
      {/* Section header */}
      <div className="container mx-auto max-w-6xl px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0066FF]/10 text-[#0066FF] text-sm font-light rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Démonstration interactive</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-[#2A2A2A] mb-4">
            Découvrez les 8 fonctionnalités clés
          </h2>
          <p className="text-xl text-[#666666] font-light max-w-3xl mx-auto">
            Parcourez chaque fonctionnalité en scrollant. De la réservation à l&apos;avis Google.
          </p>
        </motion.div>

        {/* Chapters container */}
        <div ref={containerRef} className="relative" style={{ position: 'relative' }}>
          {chapters.map((chapter, index) => (
            <DemoChapter
              key={chapter.id}
              id={chapter.id}
              title={chapter.title}
              description={chapter.description}
              detailedDescription={chapter.detailedDescription}
              demoComponent={chapter.component}
              icon={chapter.icon}
              features={chapter.features}
              isActive={index === activeChapter}
              isPast={index < activeChapter}
              isFuture={index > activeChapter}
              sectionActive={isSectionVisible}
              invertLayout={index % 2 === 1}
              scrollProgress={0} // Each chapter handles its own scroll progress
              className=""
            />
          ))}
        </div>

        {/* Call to action at the end */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="pt-20 pb-10 text-center"
        >
          <div className="max-w-2xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-light text-[#2A2A2A] mb-6">
              Prêt à offrir cette expérience à vos clients ?
            </h3>
            <p className="text-xl text-[#666666] font-light mb-8 leading-relaxed">
              Toutes ces fonctionnalités sont incluses dans votre abonnement TableMaster avec le pack croissance. Installez
              le système en 5 minutes et commencez dès aujourd&apos;hui.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/signup"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center px-8 py-4 bg-[#0066FF] text-white font-light hover:bg-[#0052CC] transition-colors rounded-lg text-lg"
              >
                Commencer gratuitement
              </motion.a>
              <motion.a
                href="#pricing"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-[#E5E5E5] text-[#2A2A2A] font-light hover:border-[#0066FF] transition-colors rounded-lg text-lg"
              >
                Voir les tarifs
              </motion.a>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-4 max-w-lg mx-auto">
              <div className="text-center">
                <div className="text-2xl font-light text-[#0066FF]">8</div>
                <div className="text-sm text-[#666666] font-light">fonctionnalités clés</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-light text-[#0066FF]">5 min</div>
                <div className="text-sm text-[#666666] font-light">installation</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-light text-[#0066FF]">0€</div>
                <div className="text-sm text-[#666666] font-light">frais de démarrage</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Decorative elements - reduced opacity for better widget visibility */}
      <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />
    </section>
  );
}
