import AuthNavbar from '@/components/auth/AuthNavbar';
import Footer from '@/components/layout/Footer';
import dynamic from 'next/dynamic';
import HeroSection from '@/components/home/HeroSection';
import WorkflowSection from '@/components/home/WorkflowSection';
// import PricingAdvantagesSection from '@/components/home/PricingAdvantagesSection';
// import SavingsCalculatorSection from '@/components/home/SavingsCalculatorSection';
import FeaturesSection from '@/components/home/FeaturesSection';
// import CaseStudiesSection from '@/components/home/CaseStudiesSection';
// import ResourcesSection from '@/components/home/ResourcesSection';
import PricingSection from '@/components/home/PricingSection';
// import CustomDevSection from '@/components/home/CustomDevSection';
import TargetAudienceSection from '@/components/home/TargetAudienceSection';
import StatsSection from '@/components/home/StatsSection';
import FAQSection from '@/components/home/FAQSection';
import CTASection from '@/components/home/CTASection';

// Lazy load heavy components
const ParallaxDemoSection = dynamic(() => import('@/components/demo/ParallaxDemoSection'), {
  ssr: false,
  loading: () => (
    <div className="py-20 bg-[#FAFAFA]">
      <div className="container mx-auto max-w-6xl px-6 text-center">Chargement de la démo...</div>
    </div>
  ),
});

const IntegrationCarousel = dynamic(() => import('@/components/IntegrationCarousel'), {
  ssr: false,
  loading: () => (
    <div className="py-20 bg-white">
      <div className="container mx-auto max-w-6xl px-6 text-center">
        Chargement des intégrations...
      </div>
    </div>
  ),
});

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <AuthNavbar activePage="home" />
      <HeroSection />
      <WorkflowSection />
      <ParallaxDemoSection />
      {/* <PricingAdvantagesSection /> */}
      {/* <SavingsCalculatorSection /> */}
      <FeaturesSection />
      <IntegrationCarousel />
      {/* <CaseStudiesSection /> */}
      {/* <ResourcesSection /> */}
      <PricingSection />
      {/* <CustomDevSection /> */}
      <TargetAudienceSection />
      <StatsSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
}
