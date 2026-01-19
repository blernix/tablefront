import Link from 'next/link';
import { Button } from '@/components/ui/button';

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
                <div className="w-5 h-5 bg-gradient-to-br from-amber-500 to-amber-600 rounded-md shadow-inner"></div>
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
              <a href="#testimonials" className="text-slate-700 hover:text-slate-900 font-medium transition-all duration-300 hover:-translate-y-0.5 relative group">
                Témoignages
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <Link href="/login" className="text-slate-700 hover:text-slate-900 font-medium transition-all duration-300 hover:-translate-y-0.5 relative group">
                Connexion
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </nav>

            {/* CTA Button */}
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button className="bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white font-medium px-6 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 animate-glow">
                  <span className="flex items-center">
                    Démarrer gratuitement
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                    </svg>
                  </span>
                </Button>
              </Link>
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
                <span className="w-2 h-2 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full mr-2 animate-pulse-subtle"></span>
                Plateforme professionnelle pour restaurants
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-slate-900 leading-tight">
                L&apos;art de gérer
                <span className="block mt-2 bg-gradient-to-r from-slate-900 via-amber-600 to-slate-900 bg-clip-text text-transparent animate-gradient-shift">
                  votre restaurant
                </span>
              </h1>
              
              <p className="text-xl text-slate-600 leading-relaxed">
                TableMaster élève la gestion de votre restaurant avec une interface raffinée, 
                des outils puissants et des analyses précises pour optimiser chaque aspect de votre activité.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/login" className="flex-1 group">
                  <Button className="w-full bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white text-lg font-semibold py-7 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-1">
                    <span className="flex items-center justify-center">
                      Essai gratuit 14 jours
                      <svg className="ml-3 w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                      </svg>
                    </span>
                  </Button>
                </Link>
                <Link href="#features" className="flex-1 group">
                  <Button variant="outline" className="w-full text-slate-700 border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-lg font-medium py-7 rounded-2xl transition-all duration-300 transform group-hover:-translate-y-1">
                    <span className="flex items-center justify-center">
                      Découvrir les fonctionnalités
                      <svg className="ml-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                      </svg>
                    </span>
                  </Button>
                </Link>
              </div>

              {/* Stats with animations */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center group">
                  <div className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-amber-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">99%</div>
                  <div className="text-sm text-slate-600 mt-2">Satisfaction clients</div>
                </div>
                <div className="text-center group">
                  <div className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-amber-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">+500</div>
                  <div className="text-sm text-slate-600 mt-2">Restaurants utilisateurs</div>
                </div>
                <div className="text-center group">
                  <div className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-amber-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">24/7</div>
                  <div className="text-sm text-slate-600 mt-2">Support disponible</div>
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
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-3">Dashboard TableMaster</h3>
                    <p className="text-slate-300 text-lg">Interface d&apos;administration moderne et intuitive</p>
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

      {/* Features Section */}
      <section id="features" className="relative py-24 bg-gradient-to-b from-white via-slate-50/30 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20 animate-slide-up">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 rounded-full text-sm font-medium mb-6 shadow-sm border border-amber-200/50">
              <span className="w-2 h-2 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full mr-2"></span>
              Une suite complète d&apos;outils
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-slate-900 mb-6">
              Tout ce dont votre restaurant a besoin
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Conçue spécifiquement pour les restaurants modernes, notre plateforme combine 
              élégance et performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group animate-slide-up animation-delay-200">
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200/50 hover:shadow-2xl hover:border-slate-300/50 transition-all duration-500 hover:-translate-y-2 h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-amber-600 transition-colors duration-300">
                  Gestion des réservations
                </h3>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  Gérez toutes vos réservations en temps réel avec un calendrier intuitif, 
                  confirmations automatiques et gestion intelligente des disponibilités.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center text-slate-700 group/item">
                    <svg className="w-5 h-5 text-amber-500 mr-3 group-hover/item:scale-125 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Calendrier en temps réel
                  </li>
                  <li className="flex items-center text-slate-700 group/item">
                    <svg className="w-5 h-5 text-amber-500 mr-3 group-hover/item:scale-125 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Confirmations automatiques
                  </li>
                  <li className="flex items-center text-slate-700 group/item">
                    <svg className="w-5 h-5 text-amber-500 mr-3 group-hover/item:scale-125 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Gestion des tables avancée
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group animate-slide-up animation-delay-500">
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200/50 hover:shadow-2xl hover:border-slate-300/50 transition-all duration-500 hover:-translate-y-2 h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-amber-600 transition-colors duration-300">
                  Menu digital élégant
                </h3>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  Créez et gérez vos menus avec une interface intuitive. 
                  Générez des QR codes dynamiques, exportez en PDF et mettez à jour en temps réel.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center text-slate-700 group/item">
                    <svg className="w-5 h-5 text-amber-500 mr-3 group-hover/item:scale-125 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Éditeur visuel avancé
                  </li>
                  <li className="flex items-center text-slate-700 group/item">
                    <svg className="w-5 h-5 text-amber-500 mr-3 group-hover/item:scale-125 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    QR codes dynamiques
                  </li>
                  <li className="flex items-center text-slate-700 group/item">
                    <svg className="w-5 h-5 text-amber-500 mr-3 group-hover/item:scale-125 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Synchronisation instantanée
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group animate-slide-up animation-delay-1000">
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200/50 hover:shadow-2xl hover:border-slate-300/50 transition-all duration-500 hover:-translate-y-2 h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-amber-600 transition-colors duration-300">
                  Analyses détaillées
                </h3>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  Obtenez des insights précieux sur votre activité avec des rapports détaillés, 
                  analyses de performance et prévisions intelligentes basées sur l&apos;IA.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center text-slate-700 group/item">
                    <svg className="w-5 h-5 text-amber-500 mr-3 group-hover/item:scale-125 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Tableaux de bord interactifs
                  </li>
                  <li className="flex items-center text-slate-700 group/item">
                    <svg className="w-5 h-5 text-amber-500 mr-3 group-hover/item:scale-125 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Rapports personnalisables
                  </li>
                  <li className="flex items-center text-slate-700 group/item">
                    <svg className="w-5 h-5 text-amber-500 mr-3 group-hover/item:scale-125 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Prévisions de revenus
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20 animate-slide-up">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 rounded-full text-sm font-medium mb-6 shadow-sm border border-amber-200/50">
              <span className="w-2 h-2 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full mr-2"></span>
              Ils nous font confiance
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-slate-900 mb-6">
              Ce que disent nos clients
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Des restaurants de toute la France ont transformé leur gestion quotidienne avec TableMaster
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Testimonial 1 */}
            <div className="group animate-slide-up animation-delay-200">
              <div className="bg-white rounded-3xl p-8 border border-slate-200/50 shadow-lg hover:shadow-2xl hover:border-slate-300/50 transition-all duration-500 hover:-translate-y-2 h-full">
                <div className="flex items-center mb-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full mr-4 flex items-center justify-center text-amber-800 font-bold text-xl">
                    SM
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Sophie Martin</h4>
                    <p className="text-slate-600 text-sm">Le Bistrot Parisien, Paris</p>
                  </div>
                </div>
                <p className="text-slate-700 italic mb-8 leading-relaxed">
                  &ldquo;TableMaster a transformé notre gestion des réservations. L&apos;interface est intuitive 
                  et le support réactif. Une vraie révolution pour notre restaurant.&rdquo;
                </p>
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="group animate-slide-up animation-delay-500">
              <div className="bg-white rounded-3xl p-8 border border-slate-200/50 shadow-lg hover:shadow-2xl hover:border-slate-300/50 transition-all duration-500 hover:-translate-y-2 h-full">
                <div className="flex items-center mb-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full mr-4 flex items-center justify-center text-amber-800 font-bold text-xl">
                    PD
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Pierre Dubois</h4>
                    <p className="text-slate-600 text-sm">La Table Lyonnaise, Lyon</p>
                  </div>
                </div>
                <p className="text-slate-700 italic mb-8 leading-relaxed">
                  &ldquo;La gestion des menus avec QR codes a été un vrai plus pour nos clients. 
                  Simple à mettre en place et très professionnel.&rdquo;
                </p>
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="group animate-slide-up animation-delay-1000">
              <div className="bg-white rounded-3xl p-8 border border-slate-200/50 shadow-lg hover:shadow-2xl hover:border-slate-300/50 transition-all duration-500 hover:-translate-y-2 h-full">
                <div className="flex items-center mb-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full mr-4 flex items-center justify-center text-amber-800 font-bold text-xl">
                    EM
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Élise Moreau</h4>
                    <p className="text-slate-600 text-sm">Le Petit Provençal, Marseille</p>
                  </div>
                </div>
                <p className="text-slate-700 italic mb-8 leading-relaxed">
                  &ldquo;Les analyses détaillées nous ont permis d&apos;optimiser notre carte et 
                  d&apos;augmenter notre chiffre d&apos;affaires de 15% en 3 mois.&rdquo;
                </p>
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse-subtle"></div>
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl animate-pulse-subtle animation-delay-500"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center animate-scale-in">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-200 rounded-full text-sm font-medium mb-8 backdrop-blur-sm border border-amber-500/30">
              <span className="w-2 h-2 bg-gradient-to-r from-amber-300 to-amber-400 rounded-full mr-2 animate-pulse-subtle"></span>
              Prêt à transformer votre restaurant ?
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-8">
              Rejoignez la révolution
              <span className="block mt-3 text-amber-300">des restaurants modernes</span>
            </h2>
            
            <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Plus de 500 restaurants font déjà confiance à TableMaster pour optimiser 
              leur gestion quotidienne et augmenter leurs revenus.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/login" className="group">
                <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-lg font-semibold px-12 py-7 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform group-hover:-translate-y-1 group-hover:scale-105 animate-glow">
                  <span className="flex items-center justify-center">
                    Essai gratuit 14 jours
                    <svg className="ml-4 w-6 h-6 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                    </svg>
                  </span>
                </Button>
              </Link>
              <Link href="#features" className="group">
                <Button variant="outline" className="text-white border-white/30 hover:border-white hover:bg-white/10 text-lg font-medium px-10 py-7 rounded-2xl backdrop-blur-sm transition-all duration-300 transform group-hover:-translate-y-1">
                  <span className="flex items-center justify-center">
                    Voir la démo
                    <svg className="ml-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </span>
                </Button>
              </Link>
            </div>
            
            <p className="text-slate-400 text-sm mt-10">
              <span className="text-amber-400">✓</span> Pas de carte bancaire requise • <span className="text-amber-400">✓</span> Annulation à tout moment • <span className="text-amber-400">✓</span> Support 24/7 inclus
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
                  <div className="w-5 h-5 bg-gradient-to-br from-amber-500 to-amber-600 rounded-md"></div>
                </div>
                <span className="text-2xl font-heading font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  TableMaster
                </span>
              </div>
              <p className="text-slate-400 mb-8 leading-relaxed">
                Plateforme d&apos;administration pour restaurants — gestion des réservations, 
                menus et paramètres avec élégance et performance.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-slate-400 hover:text-amber-400 transition-colors duration-300 hover:-translate-y-1">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.270 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.7471.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"></path>
                  </svg>
                </a>
                <a href="#" className="text-slate-400 hover:text-amber-400 transition-colors duration-300 hover:-translate-y-1">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.213c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path>
                  </svg>
                </a>
                <a href="#" className="text-slate-400 hover:text-amber-400 transition-colors duration-300 hover:-translate-y-1">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
                  </svg>
                </a>
              </div>
            </div>

            {/* Links */}
            <div>
              <h3 className="font-bold text-white mb-6 text-lg">Produit</h3>
              <ul className="space-y-4">
                <li><a href="#features" className="text-slate-400 hover:text-amber-400 transition-colors duration-300">Fonctionnalités</a></li>
                <li><a href="#testimonials" className="text-slate-400 hover:text-amber-400 transition-colors duration-300">Témoignages</a></li>
                <li><Link href="/login" className="text-slate-400 hover:text-amber-400 transition-colors duration-300">Connexion</Link></li>
                <li><a href="#" className="text-slate-400 hover:text-amber-400 transition-colors duration-300">Documentation</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-white mb-6 text-lg">Entreprise</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-slate-400 hover:text-amber-400 transition-colors duration-300">À propos</a></li>
                <li><a href="#" className="text-slate-400 hover:text-amber-400 transition-colors duration-300">Blog</a></li>
                <li><a href="#" className="text-slate-400 hover:text-amber-400 transition-colors duration-300">Carrières</a></li>
                <li><a href="#" className="text-slate-400 hover:text-amber-400 transition-colors duration-300">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-white mb-6 text-lg">Légal</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-slate-400 hover:text-amber-400 transition-colors duration-300">Conditions d&apos;utilisation</a></li>
                <li><a href="#" className="text-slate-400 hover:text-amber-400 transition-colors duration-300">Politique de confidentialité</a></li>
                <li><a href="#" className="text-slate-400 hover:text-amber-400 transition-colors duration-300">Mentions légales</a></li>
                <li><a href="#" className="text-slate-400 hover:text-amber-400 transition-colors duration-300">RGPD</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800/50 mt-12 pt-8 text-center text-slate-500">
            <p>&copy; {new Date().getFullYear()} TableMaster. Tous droits réservés.</p>
            <p className="text-sm mt-3">Plateforme d&apos;administration pour restaurants — Conçu avec passion en France</p>
          </div>
        </div>
      </footer>
    </div>
  );
}