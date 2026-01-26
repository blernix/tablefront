import Link from 'next/link';
import {
  Sparkles,
  CheckCircle,
  ArrowRight,
  Utensils,
  Settings,
  Calendar,
  Menu,
  Bell,
  BarChart3,
  Clock,
  Users,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Header/Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-900/90 backdrop-blur-sm border-b border-zinc-800">
        <div className="container mx-auto px-8 py-6">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-emerald-600 rounded-full flex items-center justify-center">
                <Utensils className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-light text-zinc-200 tracking-tight">TableMaster</span>
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-10">
              <a
                href="#features"
                className="text-zinc-400 hover:text-emerald-500 font-light text-lg transition-colors duration-300"
              >
                Fonctionnalités
              </a>
              <a
                href="#how-it-works"
                className="text-zinc-400 hover:text-emerald-500 font-light text-lg transition-colors duration-300"
              >
                Comment ça marche
              </a>
              <a
                href="#pricing"
                className="text-zinc-400 hover:text-emerald-500 font-light text-lg transition-colors duration-300"
              >
                Tarifs
              </a>
              <Link
                href="/login"
                className="text-zinc-400 hover:text-emerald-500 font-light text-lg transition-colors duration-300"
              >
                Connexion
              </Link>
            </div>

            {/* CTA Button */}
            <div className="flex items-center">
              <a href="#contact">
                <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-normal px-8 py-4 rounded-lg transition-colors duration-300">
                  <span className="flex items-center">
                    Demander une démo
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </span>
                </button>
              </a>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-8 container mx-auto">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Hero Content */}
            <div className="space-y-10">
              {/* Badge */}
              <div className="inline-flex items-center px-5 py-2 bg-zinc-800 text-emerald-500 rounded-full text-sm font-normal border border-zinc-700">
                <Sparkles className="w-4 h-4 mr-2" />
                Solution sur-mesure pour votre restaurant
              </div>

              {/* Titre */}
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-light text-zinc-200 leading-tight tracking-tight">
                Votre site web
                <span className="block mt-3 text-emerald-500 font-normal">professionnel</span>
              </h1>

              {/* Description */}
              <p className="text-2xl text-zinc-400 leading-relaxed font-light">
                Je développe votre site vitrine sur-mesure pour votre restaurant. En option, ajoutez{' '}
                <strong className="text-emerald-500 font-normal">TableMaster</strong> : un tableau
                de bord complet pour gérer vos menus, réservations et paramètres en toute autonomie.
              </p>

              {/* Boutons */}
              <div className="flex flex-col sm:flex-row gap-5 pt-6">
                <button className="bg-emerald-600 hover:bg-emerald-500 text-white text-lg font-normal py-6 px-10 rounded-lg transition-colors duration-300">
                  Démarrer mon projet
                  <ArrowRight className="ml-3 w-5 h-5 inline" />
                </button>

                <button className="border-2 border-zinc-600 hover:border-emerald-600 text-zinc-200 hover:text-emerald-500 font-normal py-6 px-10 rounded-lg transition-all duration-300">
                  Comment ça marche
                </button>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-10">
                <div className="flex items-center gap-4">
                  <CheckCircle className="w-6 h-6 text-emerald-500" />
                  <span className="text-lg font-light text-zinc-300">Site web sur-mesure</span>
                </div>
                <div className="flex items-center gap-4">
                  <CheckCircle className="w-6 h-6 text-emerald-500" />
                  <span className="text-lg font-light text-zinc-300">Design professionnel</span>
                </div>
                <div className="flex items-center gap-4">
                  <CheckCircle className="w-6 h-6 text-emerald-500" />
                  <span className="text-lg font-light text-zinc-300">
                    Option dashboard (+50€/mois)
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <CheckCircle className="w-6 h-6 text-emerald-500" />
                  <span className="text-lg font-light text-zinc-300">Support personnalisé</span>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative">
              <div className="rounded-3xl overflow-hidden border border-zinc-700 bg-zinc-800">
                <div className="aspect-video flex items-center justify-center p-12">
                  <div className="text-center">
                    <div className="inline-block p-8 bg-zinc-800 rounded-3xl mb-8 border border-zinc-700">
                      <div className="w-24 h-24 mx-auto bg-emerald-600 rounded-full flex items-center justify-center">
                        <BarChart3 className="w-12 h-12 text-white" />
                      </div>
                    </div>
                    <h3 className="text-4xl font-light text-zinc-200 mb-4">
                      Dashboard TableMaster
                    </h3>
                    <p className="text-zinc-400 text-lg">
                      Gérez votre restaurant en toute simplicité
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative py-32 bg-zinc-900 overflow-hidden">
        <div className="container mx-auto px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-5 py-2 bg-zinc-800 text-emerald-500 rounded-full text-sm font-normal mb-8 border border-zinc-700">
              <Settings className="w-4 h-4 mr-2" />
              Un service clé en main
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-zinc-200 mb-8 leading-tight">
              Comment ça marche ?
            </h2>
            <p className="text-2xl text-zinc-400 max-w-3xl mx-auto leading-relaxed font-light">
              Un processus simple en 3 étapes pour digitaliser votre restaurant
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Step 1 */}
            <div className="relative group">
              <div className="bg-zinc-800 rounded-3xl p-10 border border-zinc-700 hover:border-emerald-600/50 transition-all duration-300 h-full">
                <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center mb-8 text-white text-3xl font-light">
                  1
                </div>
                <h3 className="text-3xl font-light text-zinc-200 mb-6">Vous me contactez</h3>
                <p className="text-zinc-400 text-lg leading-relaxed font-light">
                  Parlez-moi de votre restaurant, vos besoins et vos attentes. Je vous présente les
                  fonctionnalités de TableMaster.
                </p>
              </div>
              {/* Arrow */}
              <div className="hidden md:block absolute top-1/2 -right-5 transform -translate-y-1/2 z-10">
                <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="bg-zinc-800 rounded-3xl p-10 border border-zinc-700 hover:border-emerald-600/50 transition-all duration-300 h-full">
                <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center mb-8 text-white text-3xl font-light">
                  2
                </div>
                <h3 className="text-3xl font-light text-zinc-200 mb-6">Je développe votre site</h3>
                <p className="text-zinc-400 text-lg leading-relaxed font-light">
                  Je crée votre site web professionnel sur-mesure avec votre menu, photos,
                  informations et système de réservation intégré.
                </p>
              </div>
              {/* Arrow */}
              <div className="hidden md:block absolute top-1/2 -right-5 transform -translate-y-1/2 z-10">
                <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="group">
              <div className="bg-zinc-800 rounded-3xl p-10 border border-zinc-700 hover:border-emerald-600/50 transition-all duration-300 h-full">
                <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center mb-8 text-white text-3xl font-light">
                  3
                </div>
                <h3 className="text-3xl font-light text-zinc-200 mb-6">Vous gérez en autonomie</h3>
                <p className="text-zinc-400 text-lg leading-relaxed font-light">
                  Avec l&apos;option TableMaster (50€/mois), gérez vos menus, réservations, horaires
                  et recevez des notifications en temps réel. Sinon, je m&apos;occupe des mises à
                  jour pour vous !
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32 bg-zinc-900">
        <div className="container mx-auto px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-5 py-2 bg-zinc-800 text-emerald-500 rounded-full text-sm font-normal mb-8 border border-zinc-700">
              <Sparkles className="w-4 h-4 mr-2" />
              Tout ce dont vous avez besoin
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-zinc-200 mb-8 leading-tight">
              Les fonctionnalités de TableMaster
            </h2>
            <p className="text-2xl text-zinc-400 max-w-3xl mx-auto leading-relaxed font-light">
              Un tableau de bord complet pour gérer tous les aspects de votre restaurant
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 - Reservations */}
            <div className="group">
              <div className="bg-zinc-800 rounded-3xl p-10 border border-zinc-700 hover:border-emerald-600/50 transition-all duration-300 h-full">
                <div className="w-16 h-16 bg-emerald-600/20 rounded-2xl flex items-center justify-center mb-8">
                  <Calendar className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-3xl font-light text-zinc-200 mb-6">Gestion des réservations</h3>
                <p className="text-zinc-400 text-lg leading-relaxed font-light mb-6">
                  Recevez et gérez toutes vos réservations en temps réel avec statuts (en attente,
                  confirmée, annulée, terminée).
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center text-zinc-300">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                    Calendrier temps réel
                  </li>
                  <li className="flex items-center text-zinc-300">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                    Confirmation par email
                  </li>
                  <li className="flex items-center text-zinc-300">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                    Gestion des couverts
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 2 - Menu */}
            <div className="group">
              <div className="bg-zinc-800 rounded-3xl p-10 border border-zinc-700 hover:border-emerald-600/50 transition-all duration-300 h-full">
                <div className="w-16 h-16 bg-emerald-600/20 rounded-2xl flex items-center justify-center mb-8">
                  <Menu className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-3xl font-light text-zinc-200 mb-6">Menu digital & QR Code</h3>
                <p className="text-zinc-400 text-lg leading-relaxed font-light mb-6">
                  Créez et modifiez votre menu en quelques clics. Générez un QR code pour que vos
                  clients consultent le menu facilement.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center text-zinc-300">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                    Catégories personnalisables
                  </li>
                  <li className="flex items-center text-zinc-300">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                    Photos des plats
                  </li>
                  <li className="flex items-center text-zinc-300">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                    Menu PDF téléchargeable
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 3 - Notifications */}
            <div className="group">
              <div className="bg-zinc-800 rounded-3xl p-10 border border-zinc-700 hover:border-emerald-600/50 transition-all duration-300 h-full">
                <div className="w-16 h-16 bg-emerald-600/20 rounded-2xl flex items-center justify-center mb-8">
                  <Bell className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-3xl font-light text-zinc-200 mb-6">Notifications Push (PWA)</h3>
                <p className="text-zinc-400 text-lg leading-relaxed font-light mb-6">
                  Recevez des notifications instantanées sur votre téléphone pour chaque nouvelle
                  réservation ou modification.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center text-zinc-300">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                    Alertes en temps réel
                  </li>
                  <li className="flex items-center text-zinc-300">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                    Installable sur mobile
                  </li>
                  <li className="flex items-center text-zinc-300">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                    Fonctionne hors ligne
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 4 - Opening Hours */}
            <div className="group">
              <div className="bg-zinc-800 rounded-3xl p-10 border border-zinc-700 hover:border-emerald-600/50 transition-all duration-300 h-full">
                <div className="w-16 h-16 bg-emerald-600/20 rounded-2xl flex items-center justify-center mb-8">
                  <Clock className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-3xl font-light text-zinc-200 mb-6">Horaires & Fermetures</h3>
                <p className="text-zinc-400 text-lg leading-relaxed font-light mb-6">
                  Configurez vos horaires d&apos;ouverture et bloquez des jours pour les fermetures
                  exceptionnelles (vacances, jours fériés).
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center text-zinc-300">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                    Horaires par jour
                  </li>
                  <li className="flex items-center text-zinc-300">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                    Jours bloqués
                  </li>
                  <li className="flex items-center text-zinc-300">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                    Fermetures périodes
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 5 - Tables */}
            <div className="group">
              <div className="bg-zinc-800 rounded-3xl p-10 border border-zinc-700 hover:border-emerald-600/50 transition-all duration-300 h-full">
                <div className="w-16 h-16 bg-emerald-600/20 rounded-2xl flex items-center justify-center mb-8">
                  <Users className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-3xl font-light text-zinc-200 mb-6">Configuration des tables</h3>
                <p className="text-zinc-400 text-lg leading-relaxed font-light mb-6">
                  Gérez votre capacité avec un système simple (nombre total) ou détaillé (types de
                  tables avec capacités différentes).
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center text-zinc-300">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                    Mode simple ou détaillé
                  </li>
                  <li className="flex items-center text-zinc-300">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                    Capacité totale
                  </li>
                  <li className="flex items-center text-zinc-300">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                    Taux d&apos;occupation
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 6 - Dashboard */}
            <div className="group">
              <div className="bg-zinc-800 rounded-3xl p-10 border border-zinc-700 hover:border-emerald-600/50 transition-all duration-300 h-full">
                <div className="w-16 h-16 bg-emerald-600/20 rounded-2xl flex items-center justify-center mb-8">
                  <BarChart3 className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-3xl font-light text-zinc-200 mb-6">
                  Statistiques en temps réel
                </h3>
                <p className="text-zinc-400 text-lg leading-relaxed font-light mb-6">
                  Visualisez vos réservations du jour, de la semaine, votre taux d&apos;occupation
                  et vos revenus estimés.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center text-zinc-300">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                    Réservations aujourd&apos;hui
                  </li>
                  <li className="flex items-center text-zinc-300">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                    Revenus estimés
                  </li>
                  <li className="flex items-center text-zinc-300">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                    Taux de remplissage
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-32 bg-zinc-900">
        <div className="container mx-auto px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-5 py-2 bg-zinc-800 text-emerald-500 rounded-full text-sm font-normal mb-8 border border-zinc-700">
              💰 Option TableMaster
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-zinc-200 mb-8 leading-tight">
              Gérez votre restaurant en autonomie
            </h2>
            <p className="text-2xl text-zinc-400 max-w-3xl mx-auto leading-relaxed font-light">
              Ajoutez TableMaster à votre site web pour gérer vous-même menus, réservations et
              paramètres.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-zinc-800 rounded-3xl p-12 border border-zinc-700">
              <div className="text-center mb-10">
                <h3 className="text-4xl font-light text-zinc-200 mb-6">Option TableMaster</h3>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-7xl font-light text-emerald-500">50€</span>
                  <span className="text-2xl text-zinc-400">/mois</span>
                </div>
                <p className="text-zinc-400 mt-6 text-lg">En complément de votre site web</p>
              </div>

              <div className="space-y-6 mb-10">
                <div className="flex items-center gap-4 text-zinc-300">
                  <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                  <span className="text-lg font-light">Accès complet au dashboard TableMaster</span>
                </div>
                <div className="flex items-center gap-4 text-zinc-300">
                  <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                  <span className="text-lg font-light">Gestion illimitée des réservations</span>
                </div>
                <div className="flex items-center gap-4 text-zinc-300">
                  <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                  <span className="text-lg font-light">Notifications push en temps réel (PWA)</span>
                </div>
                <div className="flex items-center gap-4 text-zinc-300">
                  <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                  <span className="text-lg font-light">Gestion autonome du menu & QR code</span>
                </div>
                <div className="flex items-center gap-4 text-zinc-300">
                  <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                  <span className="text-lg font-light">Configuration horaires & fermetures</span>
                </div>
                <div className="flex items-center gap-4 text-zinc-300">
                  <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                  <span className="text-lg font-light">Statistiques & analyses en temps réel</span>
                </div>
                <div className="flex items-center gap-4 text-zinc-300">
                  <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                  <span className="text-lg font-light">Support technique inclus</span>
                </div>
              </div>

              <div className="bg-zinc-700/30 rounded-2xl p-8 mb-10 border border-zinc-700">
                <p className="text-zinc-400 text-center text-lg leading-relaxed font-light">
                  <strong className="text-emerald-500 font-normal">💡 Bon à savoir :</strong>{' '}
                  TableMaster est une option ajoutée à votre site web. Si vous préférez gérer vos
                  contenus vous-même, je m&apos;occupe des mises à jour pour vous sans frais
                  supplémentaires.
                </p>
              </div>

              <a href="#contact" className="block">
                <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-lg font-normal py-6 rounded-lg transition-colors duration-300">
                  <span className="flex items-center justify-center">
                    En savoir plus
                    <ArrowRight className="ml-3 w-5 h-5" />
                  </span>
                </button>
              </a>

              <p className="text-center text-zinc-500 text-sm mt-8">
                Sans engagement • Résiliable à tout moment • Site web vendu séparément
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact/CTA Section */}
      <section id="contact" className="relative py-32 bg-zinc-900 overflow-hidden">
        <div className="container mx-auto px-8 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center px-5 py-2 bg-emerald-600/20 text-emerald-500 rounded-full text-sm font-normal mb-10 border border-emerald-600/30">
              <Sparkles className="w-4 h-4 mr-2" />
              Prêt à digitaliser votre restaurant ?
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-zinc-200 mb-10 leading-tight">
              Discutons de votre projet
              <span className="block mt-3 text-emerald-500 font-normal">ensemble</span>
            </h2>

            <p className="text-2xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
              Contactez-moi pour parler de votre restaurant et découvrir comment TableMaster peut
              simplifier votre gestion quotidienne.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/login" className="group">
                <button className="bg-emerald-600 hover:bg-emerald-500 text-white text-lg font-normal py-7 px-14 rounded-lg transition-colors duration-300">
                  <span className="flex items-center justify-center">
                    Démarrer maintenant
                    <ArrowRight className="ml-4 w-6 h-6" />
                  </span>
                </button>
              </Link>
            </div>

            <p className="text-zinc-500 text-sm mt-10">
              <span className="text-emerald-500">✓</span> Réponse sous 24h •{' '}
              <span className="text-emerald-500">✓</span> Démonstration gratuite •{' '}
              <span className="text-emerald-500">✓</span> Accompagnement personnalisé
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-900 text-white py-20 border-t border-zinc-800">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
                  <Utensils className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-light text-zinc-200">TableMaster</span>
              </div>
              <p className="text-zinc-400 mb-8 leading-relaxed font-light">
                Solution sur-mesure pour la digitalisation de votre restaurant. Site web + tableau
                de bord complet.
              </p>
            </div>

            {/* Links */}
            <div>
              <h3 className="font-light text-white mb-8 text-xl">Navigation</h3>
              <ul className="space-y-4">
                <li>
                  <a
                    href="#features"
                    className="text-zinc-400 hover:text-emerald-500 font-light transition-colors duration-300"
                  >
                    Fonctionnalités
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="text-zinc-400 hover:text-emerald-500 font-light transition-colors duration-300"
                  >
                    Comment ça marche
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="text-zinc-400 hover:text-emerald-500 font-light transition-colors duration-300"
                  >
                    Tarifs
                  </a>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="text-zinc-400 hover:text-emerald-500 font-light transition-colors duration-300"
                  >
                    Connexion
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-light text-white mb-8 text-xl">Service</h3>
              <ul className="space-y-4">
                <li>
                  <a
                    href="#contact"
                    className="text-zinc-400 hover:text-emerald-500 font-light transition-colors duration-300"
                  >
                    Nous contacter
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="text-zinc-400 hover:text-emerald-500 font-light transition-colors duration-300"
                  >
                    Demander une démo
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-zinc-400 hover:text-emerald-500 font-light transition-colors duration-300"
                  >
                    Support
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-zinc-400 hover:text-emerald-500 font-light transition-colors duration-300"
                  >
                    Documentation
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-light text-white mb-8 text-xl">Légal</h3>
              <ul className="space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-zinc-400 hover:text-emerald-500 font-light transition-colors duration-300"
                  >
                    Conditions d&apos;utilisation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-zinc-400 hover:text-emerald-500 font-light transition-colors duration-300"
                  >
                    Politique de confidentialité
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-zinc-400 hover:text-emerald-500 font-light transition-colors duration-300"
                  >
                    Mentions légales
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-zinc-800 mt-12 pt-8 text-center text-zinc-500">
            <p>&copy; {new Date().getFullYear()} TableMaster. Tous droits réservés.</p>
            <p className="text-sm mt-3 font-light">
              Solution sur-mesure pour restaurants • Développé avec passion
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
