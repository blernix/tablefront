import Link from 'next/link';
import Image from 'next/image';
import {
  Check,
  ArrowRight,
  Calendar,
  Menu as MenuIcon,
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
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#E5E5E5]">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#0066FF]" />
              <span className="text-xl font-light text-[#2A2A2A]">TableMaster</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-[#666666] hover:text-[#0066FF] font-light">
                Fonctionnalités
              </a>
              <a href="#pricing" className="text-[#666666] hover:text-[#0066FF] font-light">
                Tarifs
              </a>
              <a href="#faq" className="text-[#666666] hover:text-[#0066FF] font-light">
                FAQ
              </a>
              <Link
                href="/login"
                className="px-6 py-2 bg-[#0066FF] text-white font-light hover:bg-[#0052CC] transition-colors"
              >
                Connexion
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-block px-4 py-1 border border-[#E5E5E5] text-[#666666] text-sm font-light">
                Solution de gestion pour restaurants
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-[#2A2A2A] leading-tight">
                Gérez votre restaurant
                <span className="block text-[#0066FF] font-normal mt-2">en toute simplicité</span>
              </h1>

              <p className="text-xl text-[#666666] leading-relaxed font-light">
                TableMaster centralise la gestion de vos menus, réservations et paramètres dans une
                interface claire et efficace. Gagnez du temps au quotidien.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-8 py-4 bg-[#0066FF] text-white font-light hover:bg-[#0052CC] transition-colors"
                >
                  Commencer gratuitement
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-[#E5E5E5] text-[#2A2A2A] font-light hover:border-[#0066FF] transition-colors"
                >
                  Voir les fonctionnalités
                </a>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-8">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-[#0066FF]" />
                  <span className="text-sm font-light text-[#666666]">Sans engagement</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-[#0066FF]" />
                  <span className="text-sm font-light text-[#666666]">Support inclus</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-[#0066FF]" />
                  <span className="text-sm font-light text-[#666666]">Mises à jour gratuites</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-[#0066FF]" />
                  <span className="text-sm font-light text-[#666666]">Sécurisé & fiable</span>
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

      {/* Bénéfices Clés */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-[#2A2A2A] mb-4">
              Pourquoi TableMaster ?
            </h2>
            <p className="text-xl text-[#666666] font-light max-w-2xl mx-auto">
              Une solution pensée pour simplifier votre quotidien
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-[#E5E5E5] p-8">
              <Zap className="w-12 h-12 text-[#0066FF] mb-6" />
              <h3 className="text-2xl font-light text-[#2A2A2A] mb-4">Rapide & efficace</h3>
              <p className="text-[#666666] font-light leading-relaxed">
                Interface intuitive pour gérer vos opérations en quelques clics. Pas de formation
                nécessaire.
              </p>
            </div>

            <div className="border border-[#E5E5E5] p-8">
              <Shield className="w-12 h-12 text-[#0066FF] mb-6" />
              <h3 className="text-2xl font-light text-[#2A2A2A] mb-4">Sécurisé</h3>
              <p className="text-[#666666] font-light leading-relaxed">
                Vos données sont protégées et sauvegardées automatiquement. Conformité RGPD garantie.
              </p>
            </div>

            <div className="border border-[#E5E5E5] p-8">
              <Smartphone className="w-12 h-12 text-[#0066FF] mb-6" />
              <h3 className="text-2xl font-light text-[#2A2A2A] mb-4">Accessible partout</h3>
              <p className="text-[#666666] font-light leading-relaxed">
                Application web responsive, accessible depuis n&apos;importe quel appareil. Notifications
                push incluses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* À qui ça s'adresse */}
      <section className="py-20 bg-[#FAFAFA]">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-[#2A2A2A] mb-4">
              Pour qui ?
            </h2>
            <p className="text-xl text-[#666666] font-light max-w-2xl mx-auto">
              TableMaster s&apos;adapte à tous les types d&apos;établissements
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-[#E5E5E5] p-6 text-center">
              <ChefHat className="w-10 h-10 text-[#0066FF] mx-auto mb-4" />
              <h3 className="text-lg font-light text-[#2A2A2A] mb-2">Restaurants</h3>
              <p className="text-sm text-[#666666] font-light">
                Gastronomique, traditionnel, bistronomique
              </p>
            </div>

            <div className="bg-white border border-[#E5E5E5] p-6 text-center">
              <Store className="w-10 h-10 text-[#0066FF] mx-auto mb-4" />
              <h3 className="text-lg font-light text-[#2A2A2A] mb-2">Brasseries</h3>
              <p className="text-sm text-[#666666] font-light">
                Service continu et forte affluence
              </p>
            </div>

            <div className="bg-white border border-[#E5E5E5] p-6 text-center">
              <Building2 className="w-10 h-10 text-[#0066FF] mx-auto mb-4" />
              <h3 className="text-lg font-light text-[#2A2A2A] mb-2">Cafés & Salons</h3>
              <p className="text-sm text-[#666666] font-light">
                Brunch, afternoon tea, petite restauration
              </p>
            </div>

            <div className="bg-white border border-[#E5E5E5] p-6 text-center">
              <Users className="w-10 h-10 text-[#0066FF] mx-auto mb-4" />
              <h3 className="text-lg font-light text-[#2A2A2A] mb-2">Traiteurs</h3>
              <p className="text-sm text-[#666666] font-light">
                Événements et prestations sur-mesure
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Fonctionnalités */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-[#2A2A2A] mb-4">
              Fonctionnalités complètes
            </h2>
            <p className="text-xl text-[#666666] font-light max-w-2xl mx-auto">
              Tout ce dont vous avez besoin pour gérer votre établissement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Réservations */}
            <div className="border-2 border-[#E5E5E5] p-8 hover:border-[#0066FF] transition-colors">
              <Calendar className="w-10 h-10 text-[#0066FF] mb-6" />
              <h3 className="text-2xl font-light text-[#2A2A2A] mb-4">Gestion des réservations</h3>
              <p className="text-[#666666] font-light mb-6 leading-relaxed">
                Calendrier en temps réel, confirmations automatiques, gestion des couverts et
                disponibilités.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                  <span className="text-[#666666] font-light">Vue calendrier intuitive</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                  <span className="text-[#666666] font-light">Emails de confirmation</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                  <span className="text-[#666666] font-light">Gestion des statuts</span>
                </li>
              </ul>
            </div>

            {/* Menu */}
            <div className="border-2 border-[#E5E5E5] p-8 hover:border-[#0066FF] transition-colors">
              <MenuIcon className="w-10 h-10 text-[#0066FF] mb-6" />
              <h3 className="text-2xl font-light text-[#2A2A2A] mb-4">Menu digital & QR Code</h3>
              <p className="text-[#666666] font-light mb-6 leading-relaxed">
                Créez et modifiez votre menu facilement. Générez un QR code pour vos clients.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                  <span className="text-[#666666] font-light">Catégories & plats illimités</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                  <span className="text-[#666666] font-light">Photos et descriptions</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                  <span className="text-[#666666] font-light">Export PDF automatique</span>
                </li>
              </ul>
            </div>

            {/* Notifications */}
            <div className="border-2 border-[#E5E5E5] p-8 hover:border-[#0066FF] transition-colors">
              <Bell className="w-10 h-10 text-[#0066FF] mb-6" />
              <h3 className="text-2xl font-light text-[#2A2A2A] mb-4">Notifications en temps réel</h3>
              <p className="text-[#666666] font-light mb-6 leading-relaxed">
                Soyez alerté instantanément de chaque nouvelle réservation ou modification.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                  <span className="text-[#666666] font-light">Push notifications (PWA)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                  <span className="text-[#666666] font-light">Emails automatiques</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                  <span className="text-[#666666] font-light">Alertes personnalisables</span>
                </li>
              </ul>
            </div>

            {/* Statistiques */}
            <div className="border-2 border-[#E5E5E5] p-8 hover:border-[#0066FF] transition-colors">
              <BarChart3 className="w-10 h-10 text-[#0066FF] mb-6" />
              <h3 className="text-2xl font-light text-[#2A2A2A] mb-4">Tableau de bord analytique</h3>
              <p className="text-[#666666] font-light mb-6 leading-relaxed">
                Suivez vos performances avec des statistiques claires et actionnables.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                  <span className="text-[#666666] font-light">Taux d&apos;occupation</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                  <span className="text-[#666666] font-light">Revenus estimés</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                  <span className="text-[#666666] font-light">Rapports hebdomadaires</span>
                </li>
              </ul>
            </div>

            {/* Horaires */}
            <div className="border-2 border-[#E5E5E5] p-8 hover:border-[#0066FF] transition-colors">
              <Clock className="w-10 h-10 text-[#0066FF] mb-6" />
              <h3 className="text-2xl font-light text-[#2A2A2A] mb-4">Horaires & fermetures</h3>
              <p className="text-[#666666] font-light mb-6 leading-relaxed">
                Configurez vos horaires d&apos;ouverture et gérez les fermetures exceptionnelles.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                  <span className="text-[#666666] font-light">Horaires par jour</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                  <span className="text-[#666666] font-light">Jours de fermeture</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                  <span className="text-[#666666] font-light">Périodes de vacances</span>
                </li>
              </ul>
            </div>

            {/* Tables */}
            <div className="border-2 border-[#E5E5E5] p-8 hover:border-[#0066FF] transition-colors">
              <Users className="w-10 h-10 text-[#0066FF] mb-6" />
              <h3 className="text-2xl font-light text-[#2A2A2A] mb-4">Configuration des tables</h3>
              <p className="text-[#666666] font-light mb-6 leading-relaxed">
                Gérez votre capacité avec précision selon votre organisation.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                  <span className="text-[#666666] font-light">Mode simple ou détaillé</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                  <span className="text-[#666666] font-light">Gestion des couverts</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
                  <span className="text-[#666666] font-light">Types de tables</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Preuve Sociale (Fictive) */}
      <section className="py-20 bg-[#FAFAFA]">
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
            <div className="bg-white border border-[#E5E5E5] p-8">
              <div className="mb-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-5 h-5 bg-[#0066FF]" />
                  ))}
                </div>
                <p className="text-[#666666] font-light leading-relaxed">
                  &quot;TableMaster a transformé notre gestion quotidienne. Interface claire, fonctionnalités
                  complètes. Je recommande vivement.&quot;
                </p>
              </div>
              <div>
                <p className="text-[#2A2A2A] font-normal">Sophie Martin</p>
                <p className="text-sm text-[#666666] font-light">Le Jardin Gourmand, Paris</p>
              </div>
            </div>

            <div className="bg-white border border-[#E5E5E5] p-8">
              <div className="mb-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-5 h-5 bg-[#0066FF]" />
                  ))}
                </div>
                <p className="text-[#666666] font-light leading-relaxed">
                  &quot;Simplicité et efficacité. Les notifications en temps réel changent vraiment la donne
                  pour gérer les réservations.&quot;
                </p>
              </div>
              <div>
                <p className="text-[#2A2A2A] font-normal">Jean Dupont</p>
                <p className="text-sm text-[#666666] font-light">Brasserie du Port, Lyon</p>
              </div>
            </div>

            <div className="bg-white border border-[#E5E5E5] p-8">
              <div className="mb-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-5 h-5 bg-[#0066FF]" />
                  ))}
                </div>
                <p className="text-[#666666] font-light leading-relaxed">
                  &quot;Le menu digital avec QR code est un vrai plus pour nos clients. Simple à mettre à
                  jour, toujours à jour.&quot;
                </p>
              </div>
              <div>
                <p className="text-[#2A2A2A] font-normal">Marie Lefevre</p>
                <p className="text-sm text-[#666666] font-light">Chez Marie, Bordeaux</p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <div className="inline-block border border-[#E5E5E5] px-8 py-4">
              <div className="flex items-center gap-12">
                <div>
                  <p className="text-4xl font-light text-[#2A2A2A]">50+</p>
                  <p className="text-sm text-[#666666] font-light mt-1">Restaurants</p>
                </div>
                <div>
                  <p className="text-4xl font-light text-[#2A2A2A]">10k+</p>
                  <p className="text-sm text-[#666666] font-light mt-1">Réservations</p>
                </div>
                <div>
                  <p className="text-4xl font-light text-[#2A2A2A]">99%</p>
                  <p className="text-sm text-[#666666] font-light mt-1">Satisfaction</p>
                </div>
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
              Tarif simple et transparent
            </h2>
            <p className="text-xl text-[#666666] font-light max-w-2xl mx-auto">
              Une formule unique qui inclut toutes les fonctionnalités
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="border-2 border-[#0066FF] bg-white p-12">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-light text-[#2A2A2A] mb-6">Formule Complète</h3>
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <span className="text-6xl font-light text-[#0066FF]">50€</span>
                  <span className="text-xl text-[#666666]">/mois</span>
                </div>
                <p className="text-[#666666] font-light">Sans engagement • Résiliable à tout moment</p>
              </div>

              <div className="space-y-4 mb-10">
                <div className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-[#0066FF] flex-shrink-0 mt-0.5" />
                  <span className="text-[#666666] font-light">Toutes les fonctionnalités incluses</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-[#0066FF] flex-shrink-0 mt-0.5" />
                  <span className="text-[#666666] font-light">Réservations illimitées</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-[#0066FF] flex-shrink-0 mt-0.5" />
                  <span className="text-[#666666] font-light">Menu digital avec QR code</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-[#0066FF] flex-shrink-0 mt-0.5" />
                  <span className="text-[#666666] font-light">Notifications push en temps réel</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-[#0066FF] flex-shrink-0 mt-0.5" />
                  <span className="text-[#666666] font-light">Statistiques et rapports</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-[#0066FF] flex-shrink-0 mt-0.5" />
                  <span className="text-[#666666] font-light">Support technique prioritaire</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-[#0066FF] flex-shrink-0 mt-0.5" />
                  <span className="text-[#666666] font-light">Mises à jour automatiques</span>
                </div>
              </div>

              <Link
                href="/login"
                className="block w-full text-center px-8 py-4 bg-[#0066FF] text-white font-light hover:bg-[#0052CC] transition-colors"
              >
                Commencer maintenant
              </Link>

              <p className="text-center text-[#666666] text-sm mt-6 font-light">
                Essai gratuit 14 jours • Aucune carte bancaire requise
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-[#FAFAFA]">
        <div className="container mx-auto max-w-4xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-[#2A2A2A] mb-4">
              Questions fréquentes
            </h2>
            <p className="text-xl text-[#666666] font-light">
              Tout ce que vous devez savoir sur TableMaster
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-[#E5E5E5] p-8">
              <h3 className="text-xl font-normal text-[#2A2A2A] mb-3">
                Puis-je essayer TableMaster gratuitement ?
              </h3>
              <p className="text-[#666666] font-light leading-relaxed">
                Oui, vous bénéficiez de 14 jours d&apos;essai gratuit sans engagement. Aucune carte bancaire
                n&apos;est requise pour démarrer.
              </p>
            </div>

            <div className="bg-white border border-[#E5E5E5] p-8">
              <h3 className="text-xl font-normal text-[#2A2A2A] mb-3">
                Puis-je résilier à tout moment ?
              </h3>
              <p className="text-[#666666] font-light leading-relaxed">
                Absolument. Il n&apos;y a aucun engagement de durée. Vous pouvez arrêter votre abonnement quand
                vous le souhaitez depuis votre tableau de bord.
              </p>
            </div>

            <div className="bg-white border border-[#E5E5E5] p-8">
              <h3 className="text-xl font-normal text-[#2A2A2A] mb-3">
                Les mises à jour sont-elles incluses ?
              </h3>
              <p className="text-[#666666] font-light leading-relaxed">
                Oui, toutes les mises à jour et nouvelles fonctionnalités sont incluses gratuitement dans
                votre abonnement.
              </p>
            </div>

            <div className="bg-white border border-[#E5E5E5] p-8">
              <h3 className="text-xl font-normal text-[#2A2A2A] mb-3">
                Mes données sont-elles sécurisées ?
              </h3>
              <p className="text-[#666666] font-light leading-relaxed">
                Vos données sont hébergées en France, chiffrées et sauvegardées quotidiennement. Nous
                sommes conformes au RGPD.
              </p>
            </div>

            <div className="bg-white border border-[#E5E5E5] p-8">
              <h3 className="text-xl font-normal text-[#2A2A2A] mb-3">
                Avez-vous un support client ?
              </h3>
              <p className="text-[#666666] font-light leading-relaxed">
                Oui, notre équipe support est disponible par email et chat. Les clients premium bénéficient
                d&apos;un support prioritaire.
              </p>
            </div>

            <div className="bg-white border border-[#E5E5E5] p-8">
              <h3 className="text-xl font-normal text-[#2A2A2A] mb-3">
                Puis-je importer mes données existantes ?
              </h3>
              <p className="text-[#666666] font-light leading-relaxed">
                Oui, nous pouvons vous aider à migrer vos données depuis votre système actuel. Contactez
                notre équipe pour en discuter.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-light text-[#2A2A2A] mb-6">
            Prêt à simplifier la gestion de votre restaurant ?
          </h2>
          <p className="text-xl text-[#666666] font-light mb-10 max-w-2xl mx-auto">
            Rejoignez les restaurateurs qui font confiance à TableMaster pour gérer leur activité au
            quotidien.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center px-10 py-5 bg-[#0066FF] text-white text-lg font-light hover:bg-[#0052CC] transition-colors"
          >
            Essayer gratuitement 14 jours
            <ArrowRight className="ml-3 w-5 h-5" />
          </Link>
          <p className="text-sm text-[#666666] font-light mt-6">
            Sans carte bancaire • Installation en 5 minutes • Support inclus
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#FAFAFA] border-t border-[#E5E5E5] py-16">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 bg-[#0066FF]" />
                <span className="text-lg font-light text-[#2A2A2A]">TableMaster</span>
              </div>
              <p className="text-[#666666] font-light leading-relaxed text-sm">
                Solution de gestion complète pour restaurants et établissements de restauration.
              </p>
            </div>

            <div>
              <h3 className="font-normal text-[#2A2A2A] mb-4">Produit</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#features" className="text-[#666666] hover:text-[#0066FF] font-light text-sm">
                    Fonctionnalités
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-[#666666] hover:text-[#0066FF] font-light text-sm">
                    Tarifs
                  </a>
                </li>
                <li>
                  <a href="#faq" className="text-[#666666] hover:text-[#0066FF] font-light text-sm">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-normal text-[#2A2A2A] mb-4">Support</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/login" className="text-[#666666] hover:text-[#0066FF] font-light text-sm">
                    Connexion
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-[#666666] hover:text-[#0066FF] font-light text-sm">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#666666] hover:text-[#0066FF] font-light text-sm">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-normal text-[#2A2A2A] mb-4">Légal</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-[#666666] hover:text-[#0066FF] font-light text-sm">
                    Mentions légales
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#666666] hover:text-[#0066FF] font-light text-sm">
                    Confidentialité
                  </a>
                </li>
                <li>
                  <a href="#" className="text-[#666666] hover:text-[#0066FF] font-light text-sm">
                    CGU
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#E5E5E5] pt-8 text-center">
            <p className="text-[#666666] text-sm font-light">
              © {new Date().getFullYear()} TableMaster. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
