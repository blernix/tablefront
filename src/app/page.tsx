import AuthNavbar from '@/components/auth/AuthNavbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import WorkflowSection from '@/components/home/WorkflowSection';
import PricingSection from '@/components/home/PricingSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import CTASection from '@/components/home/CTASection';
import StatsSection from '@/components/home/StatsSection';
import FAQSection from '@/components/home/FAQSection';
import StickyCTA from '@/components/home/StickyCTA';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <AuthNavbar activePage="home" />
      <HeroSection />
      <WorkflowSection />
      <StatsSection />
      <FeaturesSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <StickyCTA />
      <Footer />
    </div>
  );
}
