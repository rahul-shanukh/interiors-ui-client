import { HomeHeader } from "./ui/HomeHeader";
import { HeroSection } from "./ui/HeroSection";
import { PriceCalculatorTeaser } from "./ui/PriceCalculatorTeaser";
import { CustomerReviews } from "./ui/FeaturesGrid";
import { ProjectJourneySection } from "./ui/DeepDiveSection";
import { FaqSection } from "./ui/FaqSection";
import { HomeFooter } from "./ui/HomeFooter";
import FloatWhatsapp from "../../features/communication/FloatWhatsapp";
import SocialSidebar from "../../features/communication/SocialSidebar";

export const HomePage = () => {
  return (
    <>
      <HomeHeader />
      <main>
        <HeroSection />
        <PriceCalculatorTeaser />
        <CustomerReviews />
        <ProjectJourneySection />
        <FaqSection />
      </main>
      <HomeFooter />
      <FloatWhatsapp />
      <SocialSidebar />
    </>
  );
};

