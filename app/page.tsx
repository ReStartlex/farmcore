import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { Calculator } from "@/components/sections/Calculator";
import { WhyVolume } from "@/components/sections/WhyVolume";
import { Scenarios } from "@/components/sections/Scenarios";
import { Comparison } from "@/components/sections/Comparison";
import { Value } from "@/components/sections/Value";
import { Process } from "@/components/sections/Process";
import { About } from "@/components/sections/About";
import { Trust } from "@/components/sections/Trust";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { SeoText } from "@/components/sections/SeoText";
import { Footer } from "@/components/sections/Footer";
import { StickyCta } from "@/components/sections/StickyCta";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <Calculator />
        <WhyVolume />
        <Scenarios />
        <Comparison />
        <Value />
        <Process />
        <About />
        <Trust />
        <Faq />
        <FinalCta />
        <SeoText />
      </main>
      <Footer />
      <StickyCta />
    </>
  );
}
