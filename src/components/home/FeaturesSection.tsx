'use client';

import {
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
} from 'lucide-react';

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-[#2A2A2A] mb-4">
            Fonctionnalités complètes
          </h2>
          <p className="text-xl text-[#666666] font-light max-w-2xl mx-auto">
            Tout ce dont vous avez besoin pour gérer vos réservations, sans commission par couvert
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Réservations */}
          <div className="border-2 border-[#E5E5E5] p-8 hover:border-[#0066FF] transition-colors">
            <Calendar className="w-10 h-10 text-[#0066FF] mb-6" />
            <h3 className="text-2xl font-light text-[#2A2A2A] mb-4">Gestion des réservations</h3>
            <p className="text-[#666666] font-light mb-6 leading-relaxed">
              Interface intuitive avec vue calendrier. Séparez clairement les réservations à venir
              et passées.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                <span className="text-[#666666] font-light">
                  Réservations à venir et historique séparés
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                <span className="text-[#666666] font-light">Validation manuelle</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                <span className="text-[#666666] font-light">
                  Gestion de la durée moyenne des réservations
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                <span className="text-[#666666] font-light">Exportation CSV pour analyses</span>
              </li>
            </ul>
          </div>

          {/* Widget & URL */}
          <div className="border-2 border-[#E5E5E5] p-8 hover:border-[#0066FF] transition-colors">
            <Globe className="w-10 h-10 text-[#0066FF] mb-6" />
            <h3 className="text-2xl font-light text-[#2A2A2A] mb-4">
              Widget & Page de réservation
            </h3>
            <p className="text-[#666666] font-light mb-6 leading-relaxed">
              Intégrez facilement les réservations sur votre site web ou partagez une URL unique.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                <span className="text-[#666666] font-light">
                  Widget intégrable en 1 ligne de code
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                <span className="text-[#666666] font-light">
                  URL unique pour réseaux sociaux et partage
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                <span className="text-[#666666] font-light">
                  Personnalisation aux couleurs de votre marque
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                <span className="text-[#666666] font-light">
                  Compatible avec tous les navigateurs
                </span>
              </li>
            </ul>
          </div>

          {/* Emails & Avis */}
          <div className="border-2 border-[#E5E5E5] p-8 hover:border-[#0066FF] transition-colors">
            <MessageSquare className="w-10 h-10 text-[#0066FF] mb-6" />
            <h3 className="text-2xl font-light text-[#2A2A2A] mb-4">Emails automatiques & Avis</h3>
            <p className="text-[#666666] font-light mb-6 leading-relaxed">
              Communication automatique avec vos clients pour maximiser vos avis Google.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                <span className="text-[#666666] font-light">Email de réservation en attente</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                <span className="text-[#666666] font-light">
                  Email de confirmation de la réservation
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                <span className="text-[#666666] font-light">
                  Demande d&apos;avis Google après le service
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                <span className="text-[#666666] font-light">
                  Emails professionnels avec le nom de votre restaurant
                </span>
              </li>
            </ul>
          </div>

          {/* Notifications */}
          <div className="border-2 border-[#E5E5E5] p-8 hover:border-[#0066FF] transition-colors">
            <Bell className="w-10 h-10 text-[#0066FF] mb-6" />
            <h3 className="text-2xl font-light text-[#2A2A2A] mb-4">
              Notifications push en temps réel
            </h3>
            <p className="text-[#666666] font-light mb-6 leading-relaxed">
              Soyez alerté instantanément de chaque nouvelle réservation ou modification.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                <span className="text-[#666666] font-light">
                  Push notifications sur mobile et desktop
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                <span className="text-[#666666] font-light">
                  Alertes pour nouvelles réservations
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                <span className="text-[#666666] font-light">Notifications d&apos;annulation</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                <span className="text-[#666666] font-light">Paramétrable selon vos besoins</span>
              </li>
            </ul>
          </div>

          {/* Délégation équipe */}
          <div className="border-2 border-[#E5E5E5] p-8 hover:border-[#0066FF] transition-colors">
            <UserCheck className="w-10 h-10 text-[#0066FF] mb-6" />
            <h3 className="text-2xl font-light text-[#2A2A2A] mb-4">Délégation à votre équipe</h3>
            <p className="text-[#666666] font-light mb-6 leading-relaxed">
              Créez des comptes serveurs pour déléguer la gestion des réservations en toute
              sécurité.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                <span className="text-[#666666] font-light">
                  Comptes serveurs avec accès limité
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                <span className="text-[#666666] font-light">
                  Pas d&apos;accès aux paramètres sensibles
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                <span className="text-[#666666] font-light">Vue uniquement réservations</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                <span className="text-[#666666] font-light">Gardez le contrôle total</span>
              </li>
            </ul>
          </div>

          {/* Statistiques */}
          <div className="border-2 border-[#E5E5E5] p-8 hover:border-[#0066FF] transition-colors">
            <BarChart3 className="w-10 h-10 text-[#0066FF] mb-6" />
            <h3 className="text-2xl font-light text-[#2A2A2A] mb-4">Analyses & Export</h3>
            <p className="text-[#666666] font-light mb-6 leading-relaxed">
              Suivez vos performances et exportez vos données pour analyses approfondies.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                <span className="text-[#666666] font-light">
                  Tableau de bord avec statistiques clés
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                <span className="text-[#666666] font-light">
                  Suivi des réservations par période
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                <span className="text-[#666666] font-light">Export CSV des réservations</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                <span className="text-[#666666] font-light">Historique complet consultable</span>
              </li>
            </ul>
          </div>

          {/* Horaires & Optimisation */}
          <div className="border-2 border-[#E5E5E5] p-8 hover:border-[#0066FF] transition-colors">
            <Clock className="w-10 h-10 text-[#0066FF] mb-6" />
            <h3 className="text-2xl font-light text-[#2A2A2A] mb-4">Optimisation & Horaires</h3>
            <p className="text-[#666666] font-light mb-6 leading-relaxed">
              Configurez précisément vos horaires et optimisez votre système de réservation.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                <span className="text-[#666666] font-light">
                  Horaires d&apos;ouverture par jour
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                <span className="text-[#666666] font-light">
                  Durée moyenne de réservation configurable
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                <span className="text-[#666666] font-light">Évitez la sur-acceptation</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                <span className="text-[#666666] font-light">Jours de fermeture & vacances</span>
              </li>
            </ul>
          </div>

          {/* CRM & Base clients */}
          <div className="border-2 border-[#E5E5E5] p-8 hover:border-[#0066FF] transition-colors">
            <Users className="w-10 h-10 text-[#0066FF] mb-6" />
            <h3 className="text-2xl font-light text-[#2A2A2A] mb-4">
              Base de données clients & CRM
            </h3>
            <p className="text-[#666666] font-light mb-6 leading-relaxed">
              Chaque réservation enrichit automatiquement votre base clients. Exportez vos contacts
              pour vos campagnes d&apos;emailing.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                <span className="text-[#666666] font-light">
                  Enrichissement automatique à chaque réservation
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                <span className="text-[#666666] font-light">
                  Fiches clients : nom, email, téléphone, historique
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                <span className="text-[#666666] font-light">
                  Export CSV pour vos campagnes marketing (Mailchimp, Brevo...)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                <span className="text-[#666666] font-light">
                  Tags (VIP, Fidèle) et filtrage — 100% RGPD
                </span>
              </li>
            </ul>
          </div>

          {/* Rappels automatiques */}
          <div className="border-2 border-[#E5E5E5] p-8 hover:border-[#0066FF] transition-colors">
            <BellRing className="w-10 h-10 text-[#0066FF] mb-6" />
            <h3 className="text-2xl font-light text-[#2A2A2A] mb-4">
              Rappels automatiques
            </h3>
            <p className="text-[#666666] font-light mb-6 leading-relaxed">
              Réduisez les no-show avec des rappels envoyés automatiquement 24h avant chaque réservation.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                <span className="text-[#666666] font-light">
                  Rappel automatique 24h avant la réservation
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                <span className="text-[#666666] font-light">
                  Réduction des no-show jusqu&apos;à 40 %
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                <span className="text-[#666666] font-light">
                  Email personnalisé avec les détails de la réservation
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                <span className="text-[#666666] font-light">
                  Aucune configuration nécessaire — 100 % automatique
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
