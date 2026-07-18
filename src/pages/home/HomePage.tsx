import { HomeHeader } from "./ui/HomeHeader";
import { HeroSection } from "./ui/HeroSection";
import { PriceCalculatorTeaser } from "./ui/PriceCalculatorTeaser";
import { CustomerReviews } from "./ui/FeaturesGrid";
import { ProjectJourneySection } from "./ui/DeepDiveSection";
import { FaqSection } from "./ui/FaqSection";
import { HomeFooter } from "./ui/HomeFooter";
import { useRef } from "react";
import { useInView } from "framer-motion";
import FloatWhatsapp from "../../features/communication/FloatWhatsapp";
import SocialSidebar from "../../features/communication/SocialSidebar";

export const HomePage = () => {
  const faqRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const isFaqInView = useInView(faqRef);
  const isFooterInView = useInView(footerRef);

  const showSidebar = !isFaqInView && !isFooterInView;

  return (
    <>
      <HomeHeader />
      <main>
        <HeroSection />
        <PriceCalculatorTeaser />
        <CustomerReviews />
        <ProjectJourneySection />
        <div ref={faqRef}>
          <FaqSection />
        </div>
      </main>
      <div ref={footerRef}>
        <HomeFooter />
      </div>
      <FloatWhatsapp />
      <SocialSidebar isVisible={showSidebar} />
    </>
  );
};

