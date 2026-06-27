import AuthNavbar from '@/components/auth/AuthNavbar';
import Footer from '@/components/layout/Footer';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const IntegrationCarousel = dynamic(() => import('@/components/IntegrationCarousel'), {
  ssr: false,
  loading: () => (
    <div className="py-20 bg-white">
      <div className="container mx-auto max-w-6xl px-6 text-center text-[#8E8E93]">
        Chargement...
      </div>
    </div>
  ),
});

export default function IntegrationsPage() {
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
            Intégrez TableMaster
            <span className="block text-[#0066FF] font-normal mt-2">sur votre site actuel.</span>
          </h1>
          <p className="text-lg text-[#666666] font-light max-w-2xl leading-relaxed">
            Un lien, un QR code, ou un bouton. TableMaster s&apos;intègre sur WordPress, Wix,
            Shopify, Instagram ou n&apos;importe quel site HTML. Copiez-collez, c&apos;est tout.
          </p>
        </div>
      </section>

      <IntegrationCarousel />

      <section className="py-16 bg-[#0066FF]">
        <div className="container mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-light text-white mb-4">Prêt à installer votre widget ?</h2>
          <p className="text-lg text-white/80 font-light mb-8">
            14 jours d&apos;essai gratuit, aucune carte bancaire.
          </p>
          <Link
            href="/signup"
            data-umami-event="integrations-page-cta-click"
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
