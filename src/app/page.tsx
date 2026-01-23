import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Menu,
  Bell,
  BarChart3,
  Clock,
  Users,
  QrCode,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Utensils,
  Settings
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/50">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-amber-100/20 rounded-full blur-3xl animate-pulse-subtle"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-slate-100/30 rounded-full blur-3xl animate-pulse-subtle animation-delay-1000"></div>
        <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-amber-50/10 rounded-full blur-3xl animate-float"></div>
      </div>

      {/* Header/Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50 animate-slide-up">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo with animation */}
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                <Utensils className="w-5 h-5 text-amber-500" />
              </div>
              <span className="text-2xl font-heading font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                TableMaster
              </span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-700 hover:text-slate-900 font-medium transition-all duration-300 hover:-translate-y-0.5 relative group">
                Fonctionnalités
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#how-it-works" className="text-slate-700 hover:text-slate-900 font-medium transition-all duration-300 hover:-translate-y-0.5 relative group">
                Comment ça marche
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#pricing" className="text-slate-700 hover:text-slate-900 font-medium transition-all duration-300 hover:-translate-y-0.5 relative group">
                Tarifs
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <Link href="/login" className="text-slate-700 hover:text-slate-900 font-medium transition-all duration-300 hover:-translate-y-0.5 relative group">
                Connexion
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </nav>

            {/* CTA Button */}
            <div className="flex items-center space-x-4">
              <a href="#contact">
                <Button className="bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white font-medium px-6 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 animate-glow">
                  <span className="flex items-center">
                    Demander une démo
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </span>
                </Button>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 container mx-auto">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Hero Content */}
            <div className="space-y-8 animate-slide-in-left">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 rounded-full text-sm font-medium mb-6 shadow-sm border border-amber-200/50">
                <Sparkles className="w-4 h-4 mr-2 animate-pulse-subtle" />
                Solution sur-mesure pour votre restaurant
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-slate-900 leading-tight">
                Votre site web
                <span className="block mt-2 bg-gradient-to-r from-slate-900 via-amber-600 to-slate-900 bg-clip-text text-transparent animate-gradient-shift">
                  professionnel
                </span>
              </h1>

              <p className="text-xl text-slate-600 leading-relaxed">
                Je développe votre <strong>site vitrine sur-mesure</strong> pour votre restaurant.
                En option, ajoutez <strong>TableMaster</strong> : un tableau de bord complet pour gérer
                vos menus, réservations et paramètres en toute autonomie.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a href="#contact" className="flex-1 group">
                  <Button className="w-full bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white text-lg font-semibold py-7 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-1">
                    <span className="flex items-center justify-center">
                      Démarrer mon projet
                      <ArrowRight className="ml-3 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </a>
                <a href="#how-it-works" className="flex-1 group">
                  <Button variant="outline" className="w-full text-slate-700 border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-lg font-medium py-7 rounded-2xl transition-all duration-300 transform group-hover:-translate-y-1">
                    <span className="flex items-center justify-center">
                      Comment ça marche
                      <svg className="ml-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                      </svg>
                    </span>
                  </Button>
                </a>
              </div>

              {/* Key benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8">
                <div className="flex items-center gap-3 text-slate-700">
                  <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <span className="font-medium">Site web sur-mesure</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700">
                  <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <span className="font-medium">Design professionnel</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700">
                  <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <span className="font-medium">Option dashboard (+50€/mois)</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700">
                  <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <span className="font-medium">Support personnalisé</span>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative animate-slide-in-right">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/50 bg-gradient-to-br from-slate-900 to-slate-800">
                <div className="aspect-video flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="inline-block p-6 bg-slate-800/50 rounded-2xl mb-6 backdrop-blur-sm border border-slate-700/50">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg animate-float">
                        <BarChart3 className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-3">Dashboard TableMaster</h3>
                    <p className="text-slate-300 text-lg">Gérez votre restaurant en toute simplicité</p>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-full blur-2xl animate-pulse-subtle"></div>
              <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-gradient-to-br from-slate-900/20 to-slate-800/10 rounded-full blur-2xl animate-pulse-subtle animation-delay-500"></div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative py-24 bg-gradient-to-b from-white via-slate-50/30 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20 animate-slide-up">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 rounded-full text-sm font-medium mb-6 shadow-sm border border-amber-200/50">
              <Settings className="w-4 h-4 mr-2" />
              Un service clé en main
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-slate-900 mb-6">
              Comment ça marche ?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Un processus simple en 3 étapes pour digitaliser votre restaurant
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative group">
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mb-6 text-white text-2xl font-bold shadow-lg">
                  1
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Vous me contactez
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Parlez-moi de votre restaurant, vos besoins et vos attentes.
                  Je vous présente les fonctionnalités de TableMaster.
                </p>
              </div>
              {/* Arrow */}
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                <ArrowRight className="w-8 h-8 text-amber-500" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mb-6 text-white text-2xl font-bold shadow-lg">
                  2
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Je développe votre site
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Je crée votre site web professionnel sur-mesure avec votre menu,
                  photos, informations et système de réservation intégré.
                </p>
              </div>
              {/* Arrow */}
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                <ArrowRight className="w-8 h-8 text-amber-500" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="group">
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mb-6 text-white text-2xl font-bold shadow-lg">
                  3
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Vous gérez en autonomie
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Avec l&apos;option TableMaster (50€/mois), gérez vos menus, réservations,
                  horaires et recevez des notifications en temps réel. Sinon, je m&apos;occupe
                  des mises à jour pour vous !
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20 animate-slide-up">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 rounded-full text-sm font-medium mb-6 shadow-sm border border-amber-200/50">
              <Sparkles className="w-4 h-4 mr-2" />
              Tout ce dont vous avez besoin
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-slate-900 mb-6">
              Les fonctionnalités de TableMaster
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Un tableau de bord complet pour gérer tous les aspects de votre restaurant
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 - Reservations */}
            <div className="group animate-slide-up animation-delay-200">
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200/50 hover:shadow-2xl hover:border-slate-300/50 transition-all duration-500 hover:-translate-y-2 h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-amber-600 transition-colors duration-300">
                  Gestion des réservations
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Recevez et gérez toutes vos réservations en temps réel avec statuts
                  (en attente, confirmée, annulée, terminée).
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center text-slate-700">
                    <CheckCircle className="w-5 h-5 text-amber-500 mr-3 flex-shrink-0" />
                    Calendrier temps réel
                  </li>
                  <li className="flex items-center text-slate-700">
                    <CheckCircle className="w-5 h-5 text-amber-500 mr-3 flex-shrink-0" />
                    Confirmation par email
                  </li>
                  <li className="flex items-center text-slate-700">
                    <CheckCircle className="w-5 h-5 text-amber-500 mr-3 flex-shrink-0" />
                    Gestion des couverts
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 2 - Menu */}
            <div className="group animate-slide-up animation-delay-400">
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200/50 hover:shadow-2xl hover:border-slate-300/50 transition-all duration-500 hover:-translate-y-2 h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                  <Menu className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-amber-600 transition-colors duration-300">
                  Menu digital & QR Code
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Créez et modifiez votre menu en quelques clics. Générez un QR code
                  pour que vos clients consultent le menu facilement.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center text-slate-700">
                    <CheckCircle className="w-5 h-5 text-amber-500 mr-3 flex-shrink-0" />
                    Catégories personnalisables
                  </li>
                  <li className="flex items-center text-slate-700">
                    <CheckCircle className="w-5 h-5 text-amber-500 mr-3 flex-shrink-0" />
                    Photos des plats
                  </li>
                  <li className="flex items-center text-slate-700">
                    <CheckCircle className="w-5 h-5 text-amber-500 mr-3 flex-shrink-0" />
                    Menu PDF téléchargeable
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 3 - Notifications */}
            <div className="group animate-slide-up animation-delay-600">
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200/50 hover:shadow-2xl hover:border-slate-300/50 transition-all duration-500 hover:-translate-y-2 h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                  <Bell className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-amber-600 transition-colors duration-300">
                  Notifications Push (PWA)
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Recevez des notifications instantanées sur votre téléphone pour
                  chaque nouvelle réservation ou modification.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center text-slate-700">
                    <CheckCircle className="w-5 h-5 text-amber-500 mr-3 flex-shrink-0" />
                    Alertes en temps réel
                  </li>
                  <li className="flex items-center text-slate-700">
                    <CheckCircle className="w-5 h-5 text-amber-500 mr-3 flex-shrink-0" />
                    Installable sur mobile
                  </li>
                  <li className="flex items-center text-slate-700">
                    <CheckCircle className="w-5 h-5 text-amber-500 mr-3 flex-shrink-0" />
                    Fonctionne hors ligne
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 4 - Opening Hours */}
            <div className="group animate-slide-up animation-delay-200">
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200/50 hover:shadow-2xl hover:border-slate-300/50 transition-all duration-500 hover:-translate-y-2 h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-amber-600 transition-colors duration-300">
                  Horaires & Fermetures
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Configurez vos horaires d&apos;ouverture et bloquez des jours pour
                  les fermetures exceptionnelles (vacances, jours fériés).
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center text-slate-700">
                    <CheckCircle className="w-5 h-5 text-amber-500 mr-3 flex-shrink-0" />
                    Horaires par jour
                  </li>
                  <li className="flex items-center text-slate-700">
                    <CheckCircle className="w-5 h-5 text-amber-500 mr-3 flex-shrink-0" />
                    Jours bloqués
                  </li>
                  <li className="flex items-center text-slate-700">
                    <CheckCircle className="w-5 h-5 text-amber-500 mr-3 flex-shrink-0" />
                    Fermetures périodes
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 5 - Tables */}
            <div className="group animate-slide-up animation-delay-400">
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200/50 hover:shadow-2xl hover:border-slate-300/50 transition-all duration-500 hover:-translate-y-2 h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-amber-600 transition-colors duration-300">
                  Configuration des tables
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Gérez votre capacité avec un système simple (nombre total) ou
                  détaillé (types de tables avec capacités différentes).
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center text-slate-700">
                    <CheckCircle className="w-5 h-5 text-amber-500 mr-3 flex-shrink-0" />
                    Mode simple ou détaillé
                  </li>
                  <li className="flex items-center text-slate-700">
                    <CheckCircle className="w-5 h-5 text-amber-500 mr-3 flex-shrink-0" />
                    Capacité totale
                  </li>
                  <li className="flex items-center text-slate-700">
                    <CheckCircle className="w-5 h-5 text-amber-500 mr-3 flex-shrink-0" />
                    Taux d&apos;occupation
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 6 - Dashboard */}
            <div className="group animate-slide-up animation-delay-600">
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200/50 hover:shadow-2xl hover:border-slate-300/50 transition-all duration-500 hover:-translate-y-2 h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-amber-600 transition-colors duration-300">
                  Statistiques en temps réel
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Visualisez vos réservations du jour, de la semaine, votre taux
                  d&apos;occupation et vos revenus estimés.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center text-slate-700">
                    <CheckCircle className="w-5 h-5 text-amber-500 mr-3 flex-shrink-0" />
                    Réservations aujourd&apos;hui
                  </li>
                  <li className="flex items-center text-slate-700">
                    <CheckCircle className="w-5 h-5 text-amber-500 mr-3 flex-shrink-0" />
                    Revenus estimés
                  </li>
                  <li className="flex items-center text-slate-700">
                    <CheckCircle className="w-5 h-5 text-amber-500 mr-3 flex-shrink-0" />
                    Taux de remplissage
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 rounded-full text-sm font-medium mb-6 shadow-sm border border-amber-200/50">
              💰 Option TableMaster
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-slate-900 mb-6">
              Gérez votre restaurant en autonomie
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Ajoutez TableMaster à votre site web pour gérer vous-même menus, réservations et paramètres.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-12 shadow-2xl border border-slate-700/50 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-600/10 rounded-full blur-3xl"></div>

              <div className="relative z-10">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-white mb-4">Option TableMaster</h3>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-6xl font-bold text-amber-400">50€</span>
                    <span className="text-2xl text-slate-300">/mois</span>
                  </div>
                  <p className="text-slate-300 mt-4">En complément de votre site web</p>
                </div>

                <div className="space-y-4 mb-10">
                  <div className="flex items-center gap-3 text-white">
                    <CheckCircle className="w-6 h-6 text-amber-400 flex-shrink-0" />
                    <span className="text-lg">Accès complet au dashboard TableMaster</span>
                  </div>
                  <div className="flex items-center gap-3 text-white">
                    <CheckCircle className="w-6 h-6 text-amber-400 flex-shrink-0" />
                    <span className="text-lg">Gestion illimitée des réservations</span>
                  </div>
                  <div className="flex items-center gap-3 text-white">
                    <CheckCircle className="w-6 h-6 text-amber-400 flex-shrink-0" />
                    <span className="text-lg">Notifications push en temps réel (PWA)</span>
                  </div>
                  <div className="flex items-center gap-3 text-white">
                    <CheckCircle className="w-6 h-6 text-amber-400 flex-shrink-0" />
                    <span className="text-lg">Gestion autonome du menu & QR code</span>
                  </div>
                  <div className="flex items-center gap-3 text-white">
                    <CheckCircle className="w-6 h-6 text-amber-400 flex-shrink-0" />
                    <span className="text-lg">Configuration horaires & fermetures</span>
                  </div>
                  <div className="flex items-center gap-3 text-white">
                    <CheckCircle className="w-6 h-6 text-amber-400 flex-shrink-0" />
                    <span className="text-lg">Statistiques & analyses en temps réel</span>
                  </div>
                  <div className="flex items-center gap-3 text-white">
                    <CheckCircle className="w-6 h-6 text-amber-400 flex-shrink-0" />
                    <span className="text-lg">Support technique inclus</span>
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-2xl p-6 mb-8 border border-slate-700">
                  <p className="text-slate-300 text-center text-sm leading-relaxed">
                    <strong className="text-white">💡 Bon à savoir :</strong> TableMaster est une option ajoutée à votre site web.
                    Si vous préférez gérer vos contenus vous-même, je m&apos;occupe des mises à jour
                    pour vous sans frais supplémentaires.
                  </p>
                </div>

                <a href="#contact" className="block">
                  <Button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-lg font-semibold py-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <span className="flex items-center justify-center">
                      En savoir plus
                      <ArrowRight className="ml-3 w-5 h-5" />
                    </span>
                  </Button>
                </a>

                <p className="text-center text-slate-400 text-sm mt-6">
                  Sans engagement • Résiliable à tout moment • Site web vendu séparément
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact/CTA Section */}
      <section id="contact" className="relative py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse-subtle"></div>
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl animate-pulse-subtle animation-delay-500"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center animate-scale-in">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-200 rounded-full text-sm font-medium mb-8 backdrop-blur-sm border border-amber-500/30">
              <Sparkles className="w-4 h-4 mr-2 animate-pulse-subtle" />
              Prêt à digitaliser votre restaurant ?
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-8">
              Discutons de votre projet
              <span className="block mt-3 text-amber-300">ensemble</span>
            </h2>

            <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Contactez-moi pour parler de votre restaurant et découvrir comment TableMaster
              peut simplifier votre gestion quotidienne.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/login" className="group">
                <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-lg font-semibold px-12 py-7 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform group-hover:-translate-y-1 group-hover:scale-105 animate-glow">
                  <span className="flex items-center justify-center">
                    Démarrer maintenant
                    <ArrowRight className="ml-4 w-6 h-6 transform group-hover:translate-x-2 transition-transform" />
                  </span>
                </Button>
              </Link>
            </div>

            <p className="text-slate-400 text-sm mt-10">
              <span className="text-amber-400">✓</span> Réponse sous 24h • <span className="text-amber-400">✓</span> Démonstration gratuite • <span className="text-amber-400">✓</span> Accompagnement personnalisé
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-white py-16 border-t border-slate-800/50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Brand */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center shadow-lg">
                  <Utensils className="w-5 h-5 text-amber-500" />
                </div>
                <span className="text-2xl font-heading font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  TableMaster
                </span>
              </div>
              <p className="text-slate-400 mb-8 leading-relaxed">
                Solution sur-mesure pour la digitalisation de votre restaurant.
                Site web + tableau de bord complet.
              </p>
            </div>

            {/* Links */}
            <div>
              <h3 className="font-bold text-white mb-6 text-lg">Navigation</h3>
              <ul className="space-y-4">
                <li><a href="#features" className="text-slate-400 hover:text-amber-400 transition-colors duration-300">Fonctionnalités</a></li>
                <li><a href="#how-it-works" className="text-slate-400 hover:text-amber-400 transition-colors duration-300">Comment ça marche</a></li>
                <li><a href="#pricing" className="text-slate-400 hover:text-amber-400 transition-colors duration-300">Tarifs</a></li>
                <li><Link href="/login" className="text-slate-400 hover:text-amber-400 transition-colors duration-300">Connexion</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-white mb-6 text-lg">Service</h3>
              <ul className="space-y-4">
                <li><a href="#contact" className="text-slate-400 hover:text-amber-400 transition-colors duration-300">Nous contacter</a></li>
                <li><a href="#contact" className="text-slate-400 hover:text-amber-400 transition-colors duration-300">Demander une démo</a></li>
                <li><a href="#" className="text-slate-400 hover:text-amber-400 transition-colors duration-300">Support</a></li>
                <li><a href="#" className="text-slate-400 hover:text-amber-400 transition-colors duration-300">Documentation</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-white mb-6 text-lg">Légal</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-slate-400 hover:text-amber-400 transition-colors duration-300">Conditions d&apos;utilisation</a></li>
                <li><a href="#" className="text-slate-400 hover:text-amber-400 transition-colors duration-300">Politique de confidentialité</a></li>
                <li><a href="#" className="text-slate-400 hover:text-amber-400 transition-colors duration-300">Mentions légales</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800/50 mt-12 pt-8 text-center text-slate-500">
            <p>&copy; {new Date().getFullYear()} TableMaster. Tous droits réservés.</p>
            <p className="text-sm mt-3">Solution sur-mesure pour restaurants • Développé avec passion</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
