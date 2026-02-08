'use client';

import Link from 'next/link';
import Image from 'next/image';
import AuthNavbar from '@/components/auth/AuthNavbar';
import {
  Check,
  ArrowRight,
  Calendar,
  MenuIcon,
  Bell,
  BarChart3,
  Clock,
  Users,
  Building2,
  ChefHat,
  Store,
  Zap,
  Shield,
  Smartphone,
  QrCode,
  Globe,
  Share2,
  FileDown,
  UserCheck,
  MessageSquare,
  Star,
  Code,
  Palette,
  Sparkles,
} from 'lucide-react';

export default function HomePage() {

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <AuthNavbar activePage="home" />

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-block px-4 py-1 border border-[#0066FF] text-[#0066FF] text-sm font-light">
                À partir de 39€/mois • Sans engagement
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-[#2A2A2A] leading-tight">
                Gérez votre restaurant
                <span className="block text-[#0066FF] font-normal mt-2">sans vous ruiner</span>
              </h1>

              <p className="text-xl text-[#666666] leading-relaxed font-light">
                La solution de réservation la plus abordable du marché. Tarifs transparents,
                fonctionnalités complètes, sans engagement. Payez uniquement ce dont vous avez besoin.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center px-8 py-4 bg-[#0066FF] text-white font-light hover:bg-[#0052CC] transition-colors"
                >
                  Cr&eacute;er mon compte
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
                <a
                  href="#pricing"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-[#E5E5E5] text-[#2A2A2A] font-light hover:border-[#0066FF] transition-colors"
                >
                  Voir les tarifs
                </a>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-8">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-[#0066FF]" />
                  <span className="text-sm font-light text-[#666666]">Sans engagement</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-[#0066FF]" />
                  <span className="text-sm font-light text-[#666666]">Installation rapide</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-[#0066FF]" />
                  <span className="text-sm font-light text-[#666666]">Tarifs compétitifs</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-[#0066FF]" />
                  <span className="text-sm font-light text-[#666666]">Widget intégrable</span>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-[#E5E5E5] p-8">
              <div className="relative aspect-square bg-[#FAFAFA] overflow-hidden">
                <Image
                  src="/hero_tablemaster.png"
                  alt="TableMaster Dashboard"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Avantages Tarifaires */}
      <section className="py-16 bg-gradient-to-br from-[#0066FF] to-[#0052CC]">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-light text-white mb-4">
              Pourquoi choisir TableMaster ?
            </h2>
            <p className="text-xl text-white/90 font-light">
              La meilleure alternative aux solutions hors de prix
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 text-white">
              <Zap className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-light mb-3">Tarifs compétitifs</h3>
              <p className="font-light text-white/90 leading-relaxed">
                 À partir de 39€/mois seulement. 3 à 10 fois moins cher que TheFork ou Zenchef.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 text-white">
              <Shield className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-light mb-3">Sans engagement</h3>
              <p className="font-light text-white/90 leading-relaxed">
                Résiliez quand vous voulez, sans frais cachés. Payez uniquement le temps que vous utilisez.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 text-white">
              <Star className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-light mb-3">Tout inclus</h3>
              <p className="font-light text-white/90 leading-relaxed">
                Notifications push, widget, emails automatiques, avis Google... Pas de frais supplémentaires.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Fonctionnalités Principales */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-[#2A2A2A] mb-4">
              Fonctionnalités complètes
            </h2>
            <p className="text-xl text-[#666666] font-light max-w-2xl mx-auto">
              Tout ce dont vous avez besoin pour gérer votre établissement efficacement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Réservations */}
            <div className="border-2 border-[#E5E5E5] p-8 hover:border-[#0066FF] transition-colors">
              <Calendar className="w-10 h-10 text-[#0066FF] mb-6" />
              <h3 className="text-2xl font-light text-[#2A2A2A] mb-4">Gestion des réservations</h3>
              <p className="text-[#666666] font-light mb-6 leading-relaxed">
                Interface intuitive avec vue calendrier. Séparez clairement les réservations à venir et passées.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                  <span className="text-[#666666] font-light">Réservations à venir et historique séparés</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                  <span className="text-[#666666] font-light">Validation manuelle ou automatique</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                  <span className="text-[#666666] font-light">Gestion de la durée moyenne des réservations</span>
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
              <h3 className="text-2xl font-light text-[#2A2A2A] mb-4">Widget & Page de réservation</h3>
              <p className="text-[#666666] font-light mb-6 leading-relaxed">
                Intégrez facilement les réservations sur votre site web ou partagez une URL unique.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                  <span className="text-[#666666] font-light">Widget intégrable en 2 lignes de code</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                  <span className="text-[#666666] font-light">URL unique pour réseaux sociaux et partage</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                  <span className="text-[#666666] font-light">Personnalisation aux couleurs de votre marque</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                  <span className="text-[#666666] font-light">Compatible avec tous les navigateurs</span>
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
                  <span className="text-[#666666] font-light">Email de confirmation automatique</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                  <span className="text-[#666666] font-light">Email de rappel avant la réservation</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                  <span className="text-[#666666] font-light">Demande d&apos;avis Google après le service</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                  <span className="text-[#666666] font-light">Emails professionnels avec votre nom</span>
                </li>
              </ul>
            </div>

            {/* Notifications */}
            <div className="border-2 border-[#E5E5E5] p-8 hover:border-[#0066FF] transition-colors">
              <Bell className="w-10 h-10 text-[#0066FF] mb-6" />
              <h3 className="text-2xl font-light text-[#2A2A2A] mb-4">Notifications push en temps réel</h3>
              <p className="text-[#666666] font-light mb-6 leading-relaxed">
                Soyez alerté instantanément de chaque nouvelle réservation ou modification.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                  <span className="text-[#666666] font-light">Push notifications sur mobile et desktop</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                  <span className="text-[#666666] font-light">Alertes pour nouvelles réservations</span>
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
                Créez des comptes serveurs pour déléguer la gestion des réservations en toute sécurité.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                  <span className="text-[#666666] font-light">Comptes serveurs avec accès limité</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                  <span className="text-[#666666] font-light">Pas d&apos;accès aux paramètres sensibles</span>
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
                  <span className="text-[#666666] font-light">Tableau de bord avec statistiques clés</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                  <span className="text-[#666666] font-light">Suivi des réservations par période</span>
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
                  <span className="text-[#666666] font-light">Horaires d&apos;ouverture par jour</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                  <span className="text-[#666666] font-light">Durée moyenne de réservation configurable</span>
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
          </div>
        </div>
      </section>

      {/* Section Développement sur mesure */}
      <section id="custom-dev" className="py-20 bg-[#FAFAFA]">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0066FF]/10 text-[#0066FF] text-sm font-light mb-4">
              <Sparkles className="w-4 h-4" />
              Service Premium
            </div>
            <h2 className="text-4xl md:text-5xl font-light text-[#2A2A2A] mb-4">
              Développement de site web sur mesure
            </h2>
            <p className="text-xl text-[#666666] font-light max-w-2xl mx-auto">
              Nous créons votre site web 100% personnalisé avec toutes les fonctionnalités intégrées
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-white border-2 border-[#E5E5E5] p-12">
              <Code className="w-12 h-12 text-[#0066FF] mb-6" />
              <h3 className="text-3xl font-light text-[#2A2A2A] mb-6">
                Un site qui vous ressemble
              </h3>
              <p className="text-[#666666] font-light leading-relaxed mb-8">
                Obtenez un site web professionnel, unique et en parfaite adéquation avec l&apos;identité
                de votre restaurant. Design sur mesure, développement custom, intégration complète.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#0066FF]/10 flex items-center justify-center flex-shrink-0">
                    <Palette className="w-4 h-4 text-[#0066FF]" />
                  </div>
                  <div>
                    <h4 className="font-normal text-[#2A2A2A] mb-1">Design 100% personnalisé</h4>
                    <p className="text-sm text-[#666666] font-light">
                      Interface unique reflétant l&apos;identité visuelle de votre établissement
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#0066FF]/10 flex items-center justify-center flex-shrink-0">
                    <Globe className="w-4 h-4 text-[#0066FF]" />
                  </div>
                  <div>
                    <h4 className="font-normal text-[#2A2A2A] mb-1">Formulaire de réservation intégré</h4>
                    <p className="text-sm text-[#666666] font-light">
                      Système de réservation directement intégré dans le code de votre site
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#0066FF]/10 flex items-center justify-center flex-shrink-0">
                    <MenuIcon className="w-4 h-4 text-[#0066FF]" />
                  </div>
                  <div>
                    <h4 className="font-normal text-[#2A2A2A] mb-1">Gestion du menu dynamique</h4>
                    <p className="text-sm text-[#666666] font-light">
                      Mettez à jour votre menu depuis le dashboard, changements visibles instantanément
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#0066FF]/10 flex items-center justify-center flex-shrink-0">
                    <QrCode className="w-4 h-4 text-[#0066FF]" />
                  </div>
                  <div>
                    <h4 className="font-normal text-[#2A2A2A] mb-1">Génération QR code automatique</h4>
                    <p className="text-sm text-[#666666] font-light">
                      QR codes pour menu et réservations générés automatiquement
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white border border-[#E5E5E5] p-8">
                <h4 className="text-xl font-light text-[#2A2A2A] mb-4">Fonctionnalités étendues</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                    <span className="text-[#666666] font-light">Site responsive (mobile, tablette, desktop)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                    <span className="text-[#666666] font-light">SEO optimisé pour Google</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                    <span className="text-[#666666] font-light">Galerie photos de vos plats</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                    <span className="text-[#666666] font-light">Intégration Google Maps</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                    <span className="text-[#666666] font-light">Formulaire de contact personnalisé</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                    <span className="text-[#666666] font-light">Hébergement & nom de domaine inclus</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-[#0066FF] to-[#0052CC] p-8 text-white">
                <h4 className="text-2xl font-light mb-3">Intéressé ?</h4>
                <p className="font-light mb-6 text-white/90">
                  Contactez-nous pour discuter de votre projet et obtenir un devis personnalisé.
                </p>
                <a
                  href="mailto:contact@tablemaster.fr"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#0066FF] font-light hover:bg-white/90 transition-colors"
                >
                  Demander un devis
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-[#2A2A2A] mb-4">
              Tarifs transparents et compétitifs
            </h2>
            <p className="text-xl text-[#666666] font-light max-w-2xl mx-auto">
              Choisissez le plan qui correspond à vos besoins. Sans engagement, résiliable à tout moment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Plan Starter */}
            <div className="border-2 border-[#E5E5E5] bg-white p-10 hover:border-[#0066FF] transition-colors">
              <div className="mb-8">
                <div className="inline-block px-3 py-1 bg-[#F0F0F0] text-[#666666] text-xs font-light uppercase tracking-wider mb-4">
                  Starter
                </div>
                <div className="flex items-baseline gap-2 mb-3">
                   <span className="text-5xl font-light text-[#2A2A2A]">39€</span>
                  <span className="text-xl text-[#666666]">/mois</span>
                </div>
                <p className="text-[#666666] font-light">Parfait pour débuter</p>
              </div>

              <ul className="space-y-4 mb-10">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                  <span className="text-[#666666] font-light">50 réservations / mois</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                  <span className="text-[#666666] font-light">Notifications push en temps réel</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                  <span className="text-[#666666] font-light">Widget & URL de réservation</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                  <span className="text-[#666666] font-light">Emails automatiques aux clients</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                  <span className="text-[#666666] font-light">Demandes d&apos;avis Google</span>
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
                className="block w-full text-center px-8 py-4 border-2 border-[#0066FF] text-[#0066FF] font-light hover:bg-[#0066FF] hover:text-white transition-colors"
              >
                Commencer avec Starter
              </Link>
            </div>

            {/* Plan Pro */}
            <div className="border-2 border-[#0066FF] bg-white p-10 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#0066FF] text-white text-xs font-light uppercase tracking-wider">
                Populaire
              </div>

              <div className="mb-8">
                <div className="inline-block px-3 py-1 bg-[#0066FF]/10 text-[#0066FF] text-xs font-light uppercase tracking-wider mb-4">
                  Pro
                </div>
                <div className="flex items-baseline gap-2 mb-3">
                   <span className="text-5xl font-light text-[#0066FF]">69€</span>
                  <span className="text-xl text-[#666666]">/mois</span>
                </div>
                <p className="text-[#666666] font-light">Pour les établissements actifs</p>
              </div>

              <ul className="space-y-4 mb-10">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                  <span className="text-[#666666] font-light">Réservations illimitées</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                  <span className="text-[#666666] font-light">Toutes les fonctionnalités Starter</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                  <span className="text-[#666666] font-light">Comptes serveurs illimités</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                  <span className="text-[#666666] font-light">Statistiques avancées</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                  <span className="text-[#666666] font-light">Support prioritaire</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                  <span className="text-[#666666] font-light">Personnalisation avancée</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                  <span className="text-[#666666] font-light">Demandes d&apos;avis automatiques</span>
                </li>
              </ul>

              <Link
                href="/signup"
                className="block w-full text-center px-8 py-4 bg-[#0066FF] text-white font-light hover:bg-[#0052CC] transition-colors"
              >
                Commencer avec Pro
              </Link>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-[#666666] font-light mb-4">
              Sans engagement • Résiliable à tout moment
            </p>
            <p className="text-sm text-[#666666] font-light">
              Tous les plans incluent : Mises à jour gratuites • Hébergement sécurisé • Sauvegardes automatiques
            </p>
          </div>
        </div>
      </section>

      {/* À qui ça s'adresse */}
      <section className="py-20 bg-[#FAFAFA]">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-[#2A2A2A] mb-4">
              Pour tous types d&apos;établissements
            </h2>
            <p className="text-xl text-[#666666] font-light max-w-2xl mx-auto">
              TableMaster s&apos;adapte à votre activité, quelle que soit sa taille
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-[#E5E5E5] p-6 text-center hover:border-[#0066FF] transition-colors">
              <ChefHat className="w-10 h-10 text-[#0066FF] mx-auto mb-4" />
              <h3 className="text-lg font-light text-[#2A2A2A] mb-2">Restaurants</h3>
              <p className="text-sm text-[#666666] font-light">
                Gastronomique, traditionnel, bistronomique
              </p>
            </div>

            <div className="bg-white border border-[#E5E5E5] p-6 text-center hover:border-[#0066FF] transition-colors">
              <Store className="w-10 h-10 text-[#0066FF] mx-auto mb-4" />
              <h3 className="text-lg font-light text-[#2A2A2A] mb-2">Brasseries</h3>
              <p className="text-sm text-[#666666] font-light">
                Service continu et forte affluence
              </p>
            </div>

            <div className="bg-white border border-[#E5E5E5] p-6 text-center hover:border-[#0066FF] transition-colors">
              <Building2 className="w-10 h-10 text-[#0066FF] mx-auto mb-4" />
              <h3 className="text-lg font-light text-[#2A2A2A] mb-2">Cafés & Salons</h3>
              <p className="text-sm text-[#666666] font-light">
                Brunch, afternoon tea, petite restauration
              </p>
            </div>

            <div className="bg-white border border-[#E5E5E5] p-6 text-center hover:border-[#0066FF] transition-colors">
              <Users className="w-10 h-10 text-[#0066FF] mx-auto mb-4" />
              <h3 className="text-lg font-light text-[#2A2A2A] mb-2">Traiteurs</h3>
              <p className="text-sm text-[#666666] font-light">
                Événements et prestations sur-mesure
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Preuve Sociale */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-[#2A2A2A] mb-4">
              Ils nous font confiance
            </h2>
            <p className="text-xl text-[#666666] font-light max-w-2xl mx-auto">
              Des restaurateurs satisfaits à travers la France
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#FAFAFA] border border-[#E5E5E5] p-8">
              <div className="mb-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-5 h-5 bg-[#0066FF]" />
                  ))}
                </div>
                <p className="text-[#666666] font-light leading-relaxed">
                  &quot;Enfin une solution abordable ! Le widget s&apos;est intégré parfaitement sur notre
                  site. Les clients adorent la simplicité de réservation.&quot;
                </p>
              </div>
              <div>
                <p className="text-[#2A2A2A] font-normal">Sophie Martin</p>
                <p className="text-sm text-[#666666] font-light">Le Jardin Gourmand, Paris</p>
              </div>
            </div>

            <div className="bg-[#FAFAFA] border border-[#E5E5E5] p-8">
              <div className="mb-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-5 h-5 bg-[#0066FF]" />
                  ))}
                </div>
                <p className="text-[#666666] font-light leading-relaxed">
                  &quot;Les notifications push sont un game changer. Plus de réservations ratées.
                  Et le prix est imbattable comparé à la concurrence.&quot;
                </p>
              </div>
              <div>
                <p className="text-[#2A2A2A] font-normal">Jean Dupont</p>
                <p className="text-sm text-[#666666] font-light">Brasserie du Port, Lyon</p>
              </div>
            </div>

            <div className="bg-[#FAFAFA] border border-[#E5E5E5] p-8">
              <div className="mb-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-5 h-5 bg-[#0066FF]" />
                  ))}
                </div>
                <p className="text-[#666666] font-light leading-relaxed">
                  &quot;Les emails automatiques qui demandent des avis Google ont boosté notre note.
                  Simple, efficace, et très bon rapport qualité-prix.&quot;
                </p>
              </div>
              <div>
                <p className="text-[#2A2A2A] font-normal">Marie Lefevre</p>
                <p className="text-sm text-[#666666] font-light">Chez Marie, Bordeaux</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-br from-[#0066FF] to-[#0052CC]">
        <div className="container mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6">
            Prêt à transformer votre gestion de réservations ?
          </h2>
          <p className="text-xl text-white/90 font-light mb-10 max-w-2xl mx-auto">
            Rejoignez les restaurateurs qui économisent des centaines d&apos;euros par mois avec TableMaster.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-10 py-5 bg-white text-[#0066FF] text-lg font-light hover:bg-white/90 transition-colors"
            >
              S&apos;inscrire maintenant
              <ArrowRight className="ml-3 w-5 h-5" />
            </Link>
            <a
              href="#pricing"
              className="inline-flex items-center justify-center px-10 py-5 border-2 border-white text-white text-lg font-light hover:bg-white/10 transition-colors"
            >
              Voir les tarifs
            </a>
          </div>
          <p className="text-sm text-white/80 font-light mt-6">
            Sans carte bancaire • Installation en 5 minutes • Support inclus
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2A2A2A] text-white py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 bg-[#0066FF]" />
                <span className="text-lg font-light">TableMaster</span>
              </div>
              <p className="text-white/70 font-light leading-relaxed text-sm">
                La solution de réservation la plus abordable et complète pour restaurants.
              </p>
            </div>

            <div>
              <h3 className="font-normal mb-4">Produit</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#features" className="text-white/70 hover:text-white font-light text-sm">
                    Fonctionnalités
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-white/70 hover:text-white font-light text-sm">
                    Tarifs
                  </a>
                </li>
                <li>
                  <a href="#custom-dev" className="text-white/70 hover:text-white font-light text-sm">
                    Développement sur mesure
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-normal mb-4">Support</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/signup" className="text-white/70 hover:text-white font-light text-sm">
                    S&apos;inscrire
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-white/70 hover:text-white font-light text-sm">
                    Connexion
                  </Link>
                </li>
                <li>
                  <a href="mailto:contact@tablemaster.fr" className="text-white/70 hover:text-white font-light text-sm">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-normal mb-4">Légal</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-white/70 hover:text-white font-light text-sm">
                    Mentions légales
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/70 hover:text-white font-light text-sm">
                    Confidentialité
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/70 hover:text-white font-light text-sm">
                    CGU
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-white/70 text-sm font-light">
              © {new Date().getFullYear()} TableMaster. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
