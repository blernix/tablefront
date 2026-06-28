import { Metadata } from 'next';
import Link from 'next/link';
import { cities, getCityBySlug } from '@/data/cities';
import AuthNavbar from '@/components/auth/AuthNavbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import StatsSection from '@/components/home/StatsSection';
import PricingSection from '@/components/home/PricingSection';
import FAQSection from '@/components/home/FAQSection';
import type { FAQItem } from '@/components/home/FAQSection';
import CTASection from '@/components/home/CTASection';
import StickyCTA from '@/components/home/StickyCTA';
import FeaturesSection from '@/components/home/FeaturesSection';
import { CheckCircle2, MapPin } from 'lucide-react';

export async function generateStaticParams() {
  return cities.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const city = getCityBySlug(params.slug);
  if (!city) return { title: 'Ville introuvable — TableMaster' };

  const title = `${city.introTitle} — TableMaster`;
  const description = `${city.name} (${city.population} hab., ${city.nbRestaurants} restaurants). Logiciel de réservation sans commission à ${city.name}. Gérez vos réservations en ligne, réduisez les no-shows. Essai gratuit 14 jours.`;

  return {
    title,
    description,
    alternates: { canonical: `https://tablemaster.fr/ville/${city.slug}` },
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'fr_FR',
      url: `https://tablemaster.fr/ville/${city.slug}`,
      siteName: 'TableMaster',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default function CityPage({ params }: { params: { slug: string } }) {
  const city = getCityBySlug(params.slug);

  if (!city) {
    return (
      <>
        <AuthNavbar activePage="home" />
        <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
          <p className="text-[#8E8E93]">Ville introuvable.</p>
        </div>
        <Footer />
      </>
    );
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `TableMaster — Réservation restaurant ${city.name}`,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web, iOS, Android',
    description: `Logiciel de réservation pour restaurants à ${city.name}. Sans commission, 39€/mois. Widget intégrable, gestion des tables, rappels automatiques.`,
    offers: { '@type': 'Offer', price: '39', priceCurrency: 'EUR' },
    areaServed: { '@type': 'City', name: city.name },
  };

  const cityStats = [
    { value: city.population, label: 'habitants' },
    { value: city.nbRestaurants, label: 'restaurants' },
    { value: '4.8', label: 'note moyenne' },
    { value: '39€', label: 'par mois' },
  ];

  const cityFaqs: FAQItem[] = city.faq.map((item) => ({
    question: item.question,
    answer: item.answer,
    keywords: [city.name, 'réservation', 'restaurant'],
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AuthNavbar activePage="home" />

      <HeroSection
        headlineLine1={`Logiciel de réservation`}
        headlineLine2={`pour restaurants à ${city.name}`}
        subtitle={`Rejoignez les restaurateurs de ${city.name} qui utilisent TableMaster. Widget intégrable, notifications en temps réel, avis Google automatisés. Sans commission, concentrez-vous sur votre cuisine.`}
        badgeText="À partir de 39€/mois · Sans engagement · Résiliable à tout moment"
        ctaText="Créer mon compte gratuitement"
        ctaHref="/signup"
        secondaryCtaText="Voir une démo"
        secondaryCtaHref="/demo"
        trialText="14 jours d'essai · Aucune carte bancaire requise"
        checkItems={['Sans engagement', 'Installation en 5 min', 'Forfait fixe · 0€/couvert', 'Widget intégrable']}
      />

      <StatsSection
        heading={`${city.name} en chiffres`}
        subheading={`Le marché de la restauration à ${city.name}`}
        stats={cityStats}
        footerText={`${city.nbRestaurants} restaurants à ${city.name} et ses environs — ${city.region}`}
      />

      {/* Intro + Pourquoi */}
      <section className="py-20 bg-[#FAFAFA]">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#0066FF]/20 bg-[#0066FF]/[0.04] text-[#0066FF] text-sm font-light mb-6">
              <MapPin className="h-3.5 w-3.5" />
              {city.name}, {city.region}
            </span>
            <h2 className="text-4xl md:text-5xl font-light text-[#2A2A2A] mb-6">
              {city.nbRestaurants} restaurants à {city.name}, une seule solution
            </h2>
            <p className="text-lg text-[#666666] font-light leading-relaxed">
              {city.introText}
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-8">
              {city.quartiers.map((q) => (
                <span key={q} className="text-xs bg-white border border-[#E5E5EA] text-[#666666] rounded-full px-3 py-1">
                  {q}
                </span>
              ))}
            </div>
          </div>

          <h3 className="text-2xl md:text-3xl font-light text-[#2A2A2A] text-center mb-3">
            Pourquoi les restaurateurs de {city.name} choisissent TableMaster
          </h3>
          <p className="text-[#8E8E93] text-center mb-10 max-w-xl mx-auto font-light">
            Une solution pensée pour les indépendants, les brasseries, les restaurants gastronomiques et les chaînes locales.
          </p>
          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {city.pourquoi.map((item, i) => (
              <div key={i} className="flex gap-3 p-5 bg-white rounded-xl border border-[#E5E5EA] hover:border-[#0066FF]/20 transition-colors">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <p className="text-[15px] text-[#444444] font-light leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PricingSection />

      <FeaturesSection
        heading={`Fonctionnalités pour votre restaurant à ${city.name}`}
        subheading={`Tous les outils pour gérer votre restaurant à ${city.name}, sans commission par couvert`}
      />

      <FAQSection
        heading={`Questions de restaurateurs à ${city.name}`}
        subheading={`Tout ce que vous devez savoir sur TableMaster à ${city.name}`}
        faqs={cityFaqs}
      />

      <CTASection
        heading={`Prêt à digitaliser votre restaurant à ${city.name} ?`}
        subtext={`Rejoignez les restaurateurs de ${city.name} qui ont déjà adopté TableMaster. Essayez gratuitement pendant 14 jours, sans engagement.`}
        ctaText="Commencer l'essai gratuit"
        ctaHref="/signup"
        secondaryCtaText=""
        secondaryCtaHref=""
        footerText="• Sans engagement • Installation en 5 minutes • Support inclus • 14 jours d'essai"
      />

      <StickyCTA
        ctaText={`Essayer à ${city.name}`}
        ctaHref="/signup"
        captionText="14 jours d'essai · Aucune carte bancaire"
      />

      <nav className="bg-white border-t border-[#E5E5EA] px-4 py-3" aria-label="Fil d'Ariane">
        <ol className="max-w-6xl mx-auto flex flex-wrap items-center gap-1.5 text-xs text-[#8E8E93]">
          <li><Link href="/" className="hover:text-[#0066FF] transition-colors">Accueil</Link></li>
          <li>/</li>
          <li className="text-[#1A1A1A]">Réservation restaurant {city.name}</li>
        </ol>
      </nav>

      <Footer />
    </>
  );
}
