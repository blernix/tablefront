import AuthNavbar from '@/components/auth/AuthNavbar';
import Footer from '@/components/layout/Footer';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const ParallaxDemoSection = dynamic(() => import('@/components/demo/ParallaxDemoSection'), {
  ssr: false,
  loading: () => (
    <div className="py-40 flex items-center justify-center">
      <p className="text-[#8E8E93] font-light">Chargement de la démo...</p>
    </div>
  ),
});

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <AuthNavbar activePage="home" />

      <section className="pt-28 pb-12 bg-white border-b border-[#E5E5EA]">
        <div className="container mx-auto max-w-4xl px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[#8E8E93] hover:text-[#0066FF] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l&apos;accueil
          </Link>
          <h1 className="text-4xl md:text-5xl font-light text-[#2A2A2A] leading-tight mb-4">
            Découvrez TableMaster
            <span className="block text-[#0066FF] font-normal mt-2">en action.</span>
          </h1>
          <p className="text-lg text-[#666666] font-light max-w-2xl leading-relaxed">
            Explorez l&apos;interface et les fonctionnalités comme si vous y étiez. Widget, formulaire, dashboard, calendrier — tout est interactif.
          </p>
        </div>
      </section>

      <ParallaxDemoSection />

      <section className="py-16 bg-[#0066FF]">
        <div className="container mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-light text-white mb-4">Convaincu par la démo ?</h2>
          <p className="text-lg text-white/80 font-light mb-8">
            14 jours d&apos;essai gratuit, aucune carte bancaire.
          </p>
          <Link
            href="/signup"
            data-umami-event="demo-page-cta-click"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#0066FF] font-light hover:bg-white/90 transition-colors rounded-lg text-lg"
          >
            Créer mon compte gratuitement
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
