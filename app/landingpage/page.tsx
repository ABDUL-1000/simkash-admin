import Footer from "./footer";
import Header from "./header";
import HeroSection from "./hero-section";
import CtaSection from "./herosection";
import JoinMissionSection from "./join-mission";
import OneAccountSection from "./one-account-section";
import TestimonialsSection from "./testimony";
import WhyChooseSection from "./why-choose";

export default function Home() {
  return (
    <main className="min-h-screen bg-white w-[90%] mx-auto">
      <Header />
      <HeroSection />
      <WhyChooseSection />
      <OneAccountSection />
      <JoinMissionSection />
      <TestimonialsSection />
      <CtaSection />
      <Footer />
    </main>
  )
}
