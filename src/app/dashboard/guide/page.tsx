'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Clock,
  Utensils,
  Calendar,
  Code2,
  Bell,
  UserPlus,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

const steps = [
  {
    num: 1,
    title: 'Configurez vos horaires d’ouverture',
    icon: Clock,
    desc: 'Définissez les jours d’ouverture de votre restaurant et les créneaux de service (midi et/ou soir).',
    details: [
      'Activez ou désactivez chaque jour avec le bouton on/off.',
      'Ajoutez un ou plusieurs créneaux par jour (ex : 12h00–14h00, 19h00–22h00).',
      'Les jours désactivés n’apparaîtront pas sur votre widget de réservation.',
      'Vous pouvez modifier vos horaires à tout moment, les réservations futures s’adapteront.',
    ],
    href: '/dashboard/settings/opening-hours',
    action: 'Configurer les horaires',
  },
  {
    num: 2,
    title: 'Définissez la durée d’un service',
    icon: Calendar,
    desc: 'La durée d’un service détermine l’espacement entre deux créneaux de réservation.',
    details: [
      'Par défaut, un service dure 1h30 (90 minutes).',
      'Si vous réglez 60 minutes, un client pourra réserver à 19h et le suivant à 20h.',
      'Si vous réglez 120 minutes, l’espacement sera de 2 heures entre chaque réservation.',
      'Activez « Créneaux basés sur les horaires » pour que seuls les créneaux dans vos heures d’ouverture soient proposés.',
      'Vous pouvez aussi définir un prix moyen par client pour estimer vos revenus.',
    ],
    href: '/dashboard/settings/reservations',
    action: 'Configurer les créneaux',
  },
  {
    num: 3,
    title: 'Configurez le nombre de tables',
    icon: Utensils,
    desc: 'Indiquez combien de tables vous avez et leur capacité pour gérer la disponibilité.',
    details: [
      'Le mode Simple vous permet de définir un nombre total de tables et une capacité moyenne.',
      'Le mode Détaillé (recommandé) vous permet de créer des types de tables précis : tables de 2, 4, 6 personnes, etc.',
      'Plus vous êtes précis, plus TableMaster pourra optimiser le placement de vos réservations.',
      'La capacité totale (tables × couverts) est utilisée pour calculer le taux d’occupation affiché dans le dashboard.',
    ],
    href: '/dashboard/settings/tables',
    action: 'Configurer les tables',
  },
  {
    num: 4,
    title: 'Intégrez le widget sur votre site',
    icon: Code2,
    desc: 'Ajoutez un bouton de réservation sur votre site web pour que vos clients réservent directement.',
    details: [
      'Vous obtenez un lien direct à partager sur vos réseaux sociaux, emails ou QR codes.',
      'Le script JavaScript ajoute un bouton flottant « Réserver une table » sur votre site.',
      'Des instructions détaillées sont disponibles pour WordPress, Wix, Shopify, Webflow et tout site HTML.',
      'Le formulaire de réservation s’affiche dans une fenêtre sans que le client quitte votre site.',
    ],
    href: '/dashboard/settings/integrations',
    action: 'Intégrer le widget',
  },
  {
    num: 5,
    title: 'Activez les notifications',
    icon: Bell,
    desc: 'Soyez alerté en temps réel à chaque nouvelle réservation ou modification.',
    details: [
      'Activez les notifications push pour recevoir une alerte sur votre téléphone ou ordinateur à chaque nouvelle réservation.',
      'Vous pouvez valider ou refuser une réservation directement depuis la notification, sans ouvrir l’application.',
      'Les emails de confirmation sont envoyés automatiquement à vos clients.',
      'Vous pouvez choisir pour quel type d’événement vous souhaitez être notifié (nouvelle, confirmée, annulée, modifiée).',
    ],
    href: '/dashboard/settings/notifications',
    action: 'Configurer les notifications',
  },
  {
    num: 6,
    title: 'Ajoutez votre équipe (optionnel)',
    icon: UserPlus,
    desc: 'Créez des comptes serveur pour que votre personnel puisse gérer les réservations sans accéder aux paramètres.',
    details: [
      'Un compte serveur peut voir et gérer les réservations, mais ne peut pas modifier les paramètres du restaurant.',
      'Idéal pour les chefs de salle ou le personnel en contact avec les clients.',
      'Vous pouvez activer ou désactiver un compte serveur à tout moment.',
    ],
    href: '/dashboard/settings/servers',
    action: 'Gérer les serveurs',
  },
];

export default function GuidePage() {
  const router = useRouter();

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-[28px] font-bold text-[#000000] leading-tight tracking-tight md:text-3xl">
          Premiers pas avec TableMaster
        </h1>
        <p className="mt-2 text-[15px] text-[#8E8E93] md:text-gray-600 leading-relaxed">
          Bienvenue ! Suivez ces 6 étapes pour configurer votre restaurant et commencer à recevoir des réservations.
        </p>
      </div>

      <div className="space-y-3 md:space-y-4">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className="bg-white rounded-2xl border border-[#E5E5EA] overflow-hidden md:rounded-xl"
            >
              <div className="p-4 md:p-5">
                <div className="flex items-start gap-3 md:gap-4">
                  {/* Numéro */}
                  <div className="h-10 w-10 rounded-xl bg-[#0066FF] text-white flex items-center justify-center font-bold text-lg flex-shrink-0 md:text-xl">
                    {step.num}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="h-4 w-4 text-[#0066FF] flex-shrink-0 md:h-5 md:w-5" />
                      <h2 className="text-[17px] font-semibold text-[#000000] md:text-lg">
                        {step.title}
                      </h2>
                    </div>
                    <p className="text-[14px] text-[#8E8E93] leading-relaxed md:text-sm">
                      {step.desc}
                    </p>

                    <ul className="mt-3 space-y-1.5">
                      {step.details.map((detail, i) => (
                        <li key={i} className="flex items-start gap-2 text-[13px] text-[#8E8E93] leading-relaxed md:text-sm">
                          <span className="text-[#0066FF] font-bold mt-0.5 flex-shrink-0">•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4">
                      <Button
                        onClick={() => router.push(step.href)}
                        className="h-11 rounded-xl text-[14px] font-medium md:h-10 md:text-sm"
                      >
                        {step.action}
                        <ArrowRight className="ml-1.5 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E5EA] p-5 md:rounded-xl md:p-6 text-center">
        <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-3" />
        <h2 className="text-[20px] font-bold text-[#000000] mb-2 md:text-xl">Vous êtes prêt !</h2>
        <p className="text-[14px] text-[#8E8E93] leading-relaxed max-w-md mx-auto md:text-sm">
          Une fois ces étapes terminées, votre restaurant est configuré et vos clients peuvent réserver.
          Pensez à tester votre widget de réservation pour vérifier que tout fonctionne.
        </p>
        <Button
          onClick={() => router.push('/dashboard/reservations')}
          className="mt-4 h-11 rounded-xl text-[14px] font-medium md:h-10 md:text-sm"
        >
          Voir mes réservations
          <ArrowRight className="ml-1.5 h-4 w-4" />
        </Button>
      </div>

      <p className="text-center text-[12px] text-[#C7C7CC] md:text-xs">
        Des questions ? Consultez la{' '}
        <a href="/legal" target="_blank" rel="noopener noreferrer" className="text-[#0066FF] hover:underline">
          documentation complète
        </a>{' '}
        ou{' '}
        <a href="mailto:support@tablemaster.fr" className="text-[#0066FF] hover:underline">
          contactez le support
        </a>
        .
      </p>
    </div>
  );
}
