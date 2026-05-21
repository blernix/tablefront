'use client';

import AuthNavbar from '@/components/auth/AuthNavbar';
import Footer from '@/components/layout/Footer';
import { ArrowRight, Check, Star } from 'lucide-react';

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@tablemaster.fr';

export default function SiteSurMesureContent() {
  return (
    <div className="min-h-screen bg-white">
      <AuthNavbar />

      {/* Hero */}
      <section className="py-24 md:py-36 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#0066FF]/[0.03] rounded-full blur-3xl -translate-y-1/4 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-400/[0.03] rounded-full blur-3xl translate-y-1/4 -translate-x-1/4" />
        <div className="max-w-4xl mx-auto text-center relative">
          <p className="text-[#0066FF] text-sm font-light tracking-widest uppercase mb-6">
            Votre restaurant mérite mieux qu&apos;un template
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-[#2A2A2A] mb-8 leading-[1.1] tracking-tight">
            Votre cuisine a une histoire.
            <span className="block text-[#0066FF] mt-4">Votre site aussi.</span>
          </h1>
          <p className="text-lg md:text-xl text-[#666666] font-light max-w-2xl mx-auto mb-12 leading-relaxed">
            Avant de goûter votre cuisine, vos clients vous découvrent en ligne. Nous créons un site à la hauteur de votre salle, de votre service, de votre passion. Un site unique, pensé pour votre restaurant — pas un template générique.
          </p>
          <a
            href={`mailto:${contactEmail}?subject=Projet site web`}
            className="inline-flex items-center justify-center px-10 py-5 bg-[#0066FF] text-white font-light rounded-lg hover:bg-[#0052CC] transition-colors text-lg shadow-lg shadow-[#0066FF]/20 hover:shadow-[#0066FF]/30 hover:-translate-y-0.5 transition-all"
          >
            Nous contacter
            <ArrowRight className="ml-3 w-5 h-5" />
          </a>
          <p className="text-sm text-gray-400 mt-8 font-light">
            Échange sans engagement • Devis personnalisé sous 48h
          </p>
        </div>
      </section>

      {/* La vitrine */}
      <section className="py-24 bg-[#FAFAFA] px-6 relative overflow-hidden">
        <div className="absolute top-1/4 right-0 w-[300px] h-[300px] bg-[#0066FF]/[0.03] rounded-full blur-3xl translate-x-1/4" />
        <div className="max-w-6xl mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-[#0066FF] text-sm font-light tracking-widest uppercase mb-4">
                Plus qu&apos;un site
              </p>
              <h2 className="text-3xl md:text-5xl font-light text-[#2A2A2A] mb-6 leading-tight">
                La première impression de votre restaurant
              </h2>
              <p className="text-[#666666] font-light leading-relaxed mb-6">
                Aujourd&apos;hui, un client regarde votre site <strong className="font-normal">avant</strong> de regarder votre carte. Votre site, c&apos;est l&apos;avant-goût de l&apos;expérience que vous allez lui offrir. Une mise en bouche.
              </p>
              <p className="text-[#666666] font-light leading-relaxed mb-8">
                Nous ne faisons pas des sites génériques. Nous créons une vitrine qui raconte <strong className="font-normal">votre</strong> histoire — celle de votre cuisine, de votre équipe, de votre salle. Chaque photo, chaque police, chaque animation est pensée pour refléter l&apos;identité unique de votre établissement.
              </p>
              <div className="space-y-3">
                {[
                  'Design 100 % unique — aucun template',
                  'Photos, couleurs, typographies à votre image',
                  "Votre ambiance, retranscrite en ligne",
                  "Un site qui fait saliver avant même d'arriver",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#0066FF]/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-[#0066FF]" />
                    </div>
                    <span className="text-sm text-[#2A2A2A] font-light">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
                <div className="space-y-6">
                  {[
                    { label: 'Votre cuisine', desc: 'Des photos qui donnent faim. Une mise en scène qui valorise vos plats signature.' },
                    { label: 'Votre salle', desc: "L'ambiance, la lumière, le service. Ce qui fait que vos clients reviennent." },
                    { label: 'Votre histoire', desc: 'Pourquoi vous faites ce métier. La passion qui rend votre restaurant unique.' },
                    { label: 'Vos clients', desc: 'Des avis Google intégrés. La confiance qui rassure avant même de réserver.' },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex-shrink-0 w-1 bg-[#0066FF] rounded-full" />
                      <div>
                        <h4 className="text-sm font-medium text-[#2A2A2A] mb-1">{item.label}</h4>
                        <p className="text-xs text-[#666666] font-light leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white border border-gray-100 rounded-xl p-4 shadow-lg max-w-[220px]">
                <div className="flex gap-0.5 mb-2">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-xs text-[#666666] font-light italic leading-relaxed mb-2">
                  &ldquo;Mon site reflète enfin la qualité de mon restaurant. Mes clients me le disent.&rdquo;
                </p>
                <p className="text-xs text-[#2A2A2A] font-medium">— Chef étoilé, Paris</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Être trouvé */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0066FF]/[0.03] rounded-full blur-3xl translate-x-1/4 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-amber-400/[0.03] rounded-full blur-3xl -translate-x-1/4 translate-y-1/4" />
        <div className="max-w-4xl mx-auto text-center relative">
          <p className="text-[#0066FF] text-sm font-light tracking-widest uppercase mb-4">
            Être visible
          </p>
          <h2 className="text-3xl md:text-5xl font-light text-[#2A2A2A] mb-6 leading-tight">
            On ne peut pas réserver chez vous si on ne vous trouve pas
          </h2>
          <p className="text-lg text-[#666666] font-light max-w-2xl mx-auto mb-12 leading-relaxed">
            Instagram, Google Maps, TikTok — vos futurs clients sont partout. Votre site est le point d&apos;arrivée de tous ces chemins. Le seul endroit où ils peuvent réserver <strong className="font-normal">directement</strong>, sans intermédiaire, sans commission.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[
              { title: '100 % visible sur Google', desc: 'Référencement naturel optimisé pour que les clients qui cherchent « restaurant italien Lyon » vous trouvent.' },
              { title: 'Réseaux sociaux → réservation', desc: 'Un lien dans votre bio Instagram, un post Facebook, une story — et vos followers réservent en deux clics.' },
              { title: 'Avis Google intégrés', desc: 'Vos meilleurs avis directement sur votre site. La preuve sociale qui rassure et convertit.' },
            ].map((item, i) => (
              <div key={i} className="bg-[#FAFAFA] rounded-xl p-6 border border-gray-50">
                <div className="w-10 h-10 bg-[#0066FF]/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-[#0066FF] text-sm font-light">{i + 1}</span>
                </div>
                <h3 className="font-medium text-[#2A2A2A] mb-2">{item.title}</h3>
                <p className="text-sm text-[#666666] font-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TableMaster intégré */}
      <section className="py-24 bg-[#FAFAFA] px-6 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-[#0066FF]/[0.03] rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />
        <div className="max-w-4xl mx-auto text-center relative">
          <p className="text-[#0066FF] text-sm font-light tracking-widest uppercase mb-4">
            La puissance de l&apos;intégration
          </p>
          <h2 className="text-3xl md:text-5xl font-light text-[#2A2A2A] mb-6 leading-tight">
            Un seul outil. Tout est connecté.
          </h2>
          <p className="text-lg text-[#666666] font-light max-w-2xl mx-auto mb-12 leading-relaxed">
            Votre site, vos réservations, votre menu, vos avis clients — tout vit dans le même écosystème. Plus besoin de jongler entre plusieurs outils.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {[
              'Réservation intégrée au design du site',
              'Menu synchronisé en temps réel',
              'Avis Google automatisés',
              'QR codes pour la salle',
              'Emails automatiques (confirmation, rappel)',
              'Statistiques de réservation',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-white border border-gray-100 rounded-lg p-3.5 text-left">
                <Check className="w-4 h-4 text-[#0066FF] flex-shrink-0" />
                <span className="text-sm text-[#2A2A2A] font-light">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-24 bg-gradient-to-br from-[#0066FF] to-[#0052CC] px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-light text-white mb-6 leading-tight">
            Un site qui fait honneur à votre cuisine
          </h2>
          <p className="text-lg text-white/80 font-light mb-10 leading-relaxed">
            Chaque restaurant est unique. Votre site mérite de l&apos;être aussi. Discutons de votre projet, sans engagement, juste pour voir ce qui est possible.
          </p>
          <a
            href={`mailto:${contactEmail}?subject=Projet site web`}
            className="inline-flex items-center justify-center px-10 py-5 bg-white text-[#0066FF] text-lg font-light rounded-lg hover:bg-white/90 transition-colors shadow-lg"
          >
            Nous contacter
            <ArrowRight className="ml-3 w-5 h-5" />
          </a>
          <p className="text-white/50 text-sm mt-8 font-light">
            Réponse sous 24h • Devis gratuit • Aucun engagement
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
