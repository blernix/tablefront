'use client';

import { Sparkles, Code, Palette, Globe, MenuIcon, QrCode, ArrowRight, Check } from 'lucide-react';

export default function CustomDevSection() {
  return (
    <section id="custom-dev" className="py-20 bg-gradient-to-br from-[#FAFAFA] to-white">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0066FF]/10 text-[#0066FF] text-sm font-light mb-4">
            <Sparkles className="w-4 h-4" />
            Service Optionnel
          </div>
          <h2 className="text-4xl md:text-5xl font-light text-[#2A2A2A] mb-4">
            Vous n&apos;avez pas de site web ou souhaitez le refaire ?
          </h2>
          <p className="text-xl text-[#666666] font-light max-w-2xl mx-auto">
            Nous créons votre site web sur mesure avec TableMaster intégré nativement
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="bg-white border-2 border-[#E5E5E5] p-6 md:p-8 lg:p-12">
            <Code className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-[#0066FF] mb-4 md:mb-6" />
            <h3 className="text-2xl md:text-3xl font-light text-[#2A2A2A] mb-4 md:mb-6">
              Exploitez TableMaster à son plein potentiel
            </h3>
            <p className="text-[#666666] font-light leading-relaxed mb-8">
              Un site web conçu spécifiquement pour votre restaurant, avec toutes les
              fonctionnalités de TableMaster directement intégrées dans son code source. Plus
              qu&apos;un simple widget, une expérience client complètement unifiée.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#0066FF]/10 flex items-center justify-center flex-shrink-0">
                  <Palette className="w-4 h-4 text-[#0066FF]" />
                </div>
                <div>
                  <h4 className="font-normal text-[#2A2A2A] mb-1">Intégration native</h4>
                  <p className="text-sm text-[#666666] font-light">
                    TableMaster n&apos;est plus un simple widget mais fait partie intégrante de
                    votre site
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#0066FF]/10 flex items-center justify-center flex-shrink-0">
                  <Globe className="w-4 h-4 text-[#0066FF]" />
                </div>
                <div>
                  <h4 className="font-normal text-[#2A2A2A] mb-1">
                    Réservation fluide et cohérente
                  </h4>
                  <p className="text-sm text-[#666666] font-light">
                    L&apos;expérience de réservation s&apos;intègre parfaitement au design de votre
                    site
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#0066FF]/10 flex items-center justify-center flex-shrink-0">
                  <MenuIcon className="w-4 h-4 text-[#0066FF]" />
                </div>
                <div>
                  <h4 className="font-normal text-[#2A2A2A] mb-1">Menu dynamique intégré</h4>
                  <p className="text-sm text-[#666666] font-light">
                    Gérez votre menu depuis TableMaster, visible instantanément sur votre site
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#0066FF]/10 flex items-center justify-center flex-shrink-0">
                  <QrCode className="w-4 h-4 text-[#0066FF]" />
                </div>
                <div>
                  <h4 className="font-normal text-[#2A2A2A] mb-1">Écosystème unifié</h4>
                  <p className="text-sm text-[#666666] font-light">
                    QR codes, avis Google, gestion des tables - tout fonctionne ensemble
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-[#E5E5E5] p-6 md:p-8">
              <h4 className="text-xl font-light text-[#2A2A2A] mb-4">Dans quel cas êtes-vous ?</h4>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-[#0066FF]/20 flex items-center justify-center rounded-full">
                      <span className="text-[#0066FF] text-sm font-light">1</span>
                    </div>
                    <h5 className="font-normal text-[#2A2A2A]">Vous avez déjà un site web</h5>
                  </div>
                  <p className="text-sm text-[#666666] font-light pl-8">
                    Nous intégrons TableMaster directement dans votre site existant. Pas besoin de
                    tout refaire, nous adaptons le formulaire de réservation à votre design actuel.
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-[#0066FF]/20 flex items-center justify-center rounded-full">
                      <span className="text-[#0066FF] text-sm font-light">2</span>
                    </div>
                    <h5 className="font-normal text-[#2A2A2A]">
                      Vous avez besoin d&apos;un nouveau site
                    </h5>
                  </div>
                  <p className="text-sm text-[#666666] font-light pl-8">
                    Nous créons votre site web de A à Z, avec TableMaster intégré nativement dès la
                    conception. Design unique, développement sur mesure, hébergement inclus.
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#E5E5E5]">
                <h5 className="font-normal text-[#2A2A2A] mb-3">Tout est compris :</h5>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#0066FF] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[#666666] font-light">
                      Design 100% personnalisé
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#0066FF] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[#666666] font-light">
                      Développement sur mesure
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#0066FF] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[#666666] font-light">
                      Intégration native de TableMaster
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#0066FF] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[#666666] font-light">
                      Hébergement & nom de domaine
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#0066FF] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[#666666] font-light">
                      Support technique inclus
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#0066FF] to-[#0052CC] p-8 text-white">
              <h4 className="text-2xl font-light mb-3">Solution clé en main</h4>
              <p className="font-light mb-6 text-white/90">
                Concentrez-vous sur votre restaurant, nous nous occupons de votre présence digitale.
                De la conception à la maintenance, tout est géré pour vous.
              </p>
              <a
                href="mailto:contact@tablemaster.fr"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#0066FF] font-light hover:bg-white/90 transition-colors"
              >
                Discuter de mon projet
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
