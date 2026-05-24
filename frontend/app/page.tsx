import { Navbar }           from "@/components/landing/Navbar";
import { HeroSection }      from "@/components/landing/HeroSection";
import { StatsSection }     from "@/components/landing/StatsSection";
import { FeaturesSection }  from "@/components/landing/FeaturesSection";
import { HowItWorksSection} from "@/components/landing/HowItWorksSection";
import { CtaSection }       from "@/components/landing/CtaSection";
import { Footer }           from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="w-full flex-1">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CtaSection />
      <Footer />
    </main>
  );
}
