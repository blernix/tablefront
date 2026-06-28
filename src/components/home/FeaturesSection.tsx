'use client';

import Link from 'next/link';
import { useSectionView } from '@/hooks/useSectionView';
import {
  ArrowRight,
  Check,
  Calendar,
  Globe,
  MessageSquare,
  Bell,
  UserCheck,
  BarChart3,
  Clock,
  Users,
  BellRing,
  type LucideIcon,
} from 'lucide-react';

export interface FeatureCard {
  icon: LucideIcon;
  title: string;
  description: string;
  bullets: string[];
  links?: { href: string; text: string }[];
}

export interface FeaturesSectionProps {
  heading?: string;
  subheading?: string;
  features?: FeatureCard[];
}

const defaultFeatures: FeatureCard[] = [
  {
    icon: Calendar,
    title: 'Gestion des réservations',
    description: 'Interface intuitive avec vue calendrier. Séparez clairement les réservations à venir et passées.',
    bullets: ['Réservations à venir et historique séparés', 'Validation manuelle', 'Gestion de la durée moyenne des réservations', 'Exportation CSV pour analyses'],
  },
  {
    icon: Globe,
    title: 'Widget & Page de réservation',
    description: 'Intégrez facilement les réservations sur votre site web ou partagez une URL unique.',
    bullets: ['Widget intégrable en 1 ligne de code', 'URL unique pour réseaux sociaux et partage', 'Personnalisation aux couleurs de votre marque', 'Compatible avec tous les navigateurs'],
    links: [
      { href: '/integrations', text: 'Voir toutes les intégrations' },
      { href: '/demo', text: 'Voir la démo interactive' },
    ],
  },
  {
    icon: MessageSquare,
    title: 'Emails automatiques & Avis',
    description: 'Communication automatique avec vos clients pour maximiser vos avis Google.',
    bullets: ['Email de réservation en attente', 'Email de confirmation de la réservation', "Demande d'avis Google après le service", 'Emails professionnels avec le nom de votre restaurant'],
  },
  {
    icon: Bell,
    title: 'Notifications push en temps réel',
    description: 'Soyez alerté instantanément de chaque nouvelle réservation ou modification.',
    bullets: ['Push notifications sur mobile et desktop', 'Alertes pour nouvelles réservations', "Notifications d'annulation", 'Paramétrable selon vos besoins'],
  },
  {
    icon: UserCheck,
    title: 'Délégation à votre équipe',
    description: 'Créez des comptes serveurs pour déléguer la gestion des réservations en toute sécurité.',
    bullets: ['Comptes serveurs avec accès limité', "Pas d'accès aux paramètres sensibles", 'Vue uniquement réservations', 'Gardez le contrôle total'],
  },
  {
    icon: BarChart3,
    title: 'Analyses & Export',
    description: 'Suivez vos performances et exportez vos données pour analyses approfondies.',
    bullets: ['Tableau de bord avec statistiques clés', 'Suivi des réservations par période', 'Export CSV des réservations', 'Historique complet consultable'],
  },
  {
    icon: Clock,
    title: 'Optimisation & Horaires',
    description: 'Configurez précisément vos horaires et optimisez votre système de réservation.',
    bullets: ["Horaires d'ouverture par jour", 'Durée moyenne de réservation configurable', 'Évitez la sur-acceptation', 'Jours de fermeture & vacances'],
  },
  {
    icon: Users,
    title: 'Base de données clients & CRM',
    description: 'Chaque réservation enrichit automatiquement votre base clients. Exportez vos contacts pour vos campagnes d\'emailing.',
    bullets: ['Enrichissement automatique à chaque réservation', 'Fiches clients : nom, email, téléphone, historique', 'Export CSV pour vos campagnes marketing (Mailchimp, Brevo...)', 'Tags (VIP, Fidèle) et filtrage — 100% RGPD'],
  },
  {
    icon: BellRing,
    title: 'Rappels automatiques',
    description: 'Réduisez les no-show avec des rappels envoyés automatiquement 24h avant chaque réservation.',
    bullets: ['Rappel automatique 24h avant la réservation', 'Réduction des no-show jusqu\'à 40 %', 'Email personnalisé avec les détails de la réservation', 'Aucune configuration nécessaire — 100 % automatique'],
  },
];

export default function FeaturesSection({
  heading = 'Fonctionnalités complètes',
  subheading = 'Tout ce dont vous avez besoin pour gérer vos réservations, sans commission par couvert',
  features = defaultFeatures,
}: FeaturesSectionProps) {
  useSectionView('features', 'section-view-features');

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-[#2A2A2A] mb-4">
            {heading}
          </h2>
          <p className="text-xl text-[#666666] font-light max-w-2xl mx-auto">
            {subheading}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div key={i} className="border-2 border-[#E5E5E5] p-8 hover:border-[#0066FF] transition-colors">
                <Icon className="w-10 h-10 text-[#0066FF] mb-6" />
                <h3 className="text-2xl font-light text-[#2A2A2A] mb-4">{feature.title}</h3>
                <p className="text-[#666666] font-light mb-6 leading-relaxed">
                  {feature.description}
                </p>
                <ul className="space-y-3">
                  {feature.bullets.map((bullet, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                      <span className="text-[#666666] font-light">{bullet}</span>
                    </li>
                  ))}
                </ul>
                {feature.links?.map((link, j) => (
                  <Link
                    key={j}
                    href={link.href}
                    className="inline-flex items-center gap-1 mt-5 text-sm text-[#0066FF] font-light hover:underline"
                  >
                    {link.text}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
