import { useEffect } from "react";
import { ScrollTrigger } from "../lib/gsap";
import ScrollProgress from "../components/ui/ScrollProgress";
import Hero from "../sections/Hero";
import Marquee from "../sections/Marquee";
import TextReveal from "../sections/TextReveal";
import Showcase from "../sections/Showcase";
import Features from "../sections/Features";
import Stats from "../sections/Stats";
import Pricing from "../sections/Pricing";
import CTA from "../sections/CTA";
import Footer from "../sections/Footer";

export default function Home() {
  // Fonts change line wrapping / element heights, which shifts every pin point.
  // Recalculate once the display fonts are ready.
  useEffect(() => {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }, []);

  return (
    <div className="bg-ink text-paper">
      <ScrollProgress />
      <Hero />
      <Marquee />
      <TextReveal />
      <Showcase />
      <Features />
      <Stats />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
}
