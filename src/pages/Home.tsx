import { useEffect, lazy, Suspense } from "react";
import { ScrollTrigger } from "../lib/gsap";
import Preloader from "../components/ui/Preloader";
import ScrollProgress from "../components/ui/ScrollProgress";
import Hero from "../sections/Hero";
import Marquee from "../sections/Marquee";
import TextReveal from "../sections/TextReveal";

const sectionLoaders = {
  Showcase: () => import("../sections/Showcase"),
  Features: () => import("../sections/Features"),
  StudioCanvas: () => import("../sections/StudioCanvas"),
  Approach: () => import("../sections/Approach"),
  Stats: () => import("../sections/Stats"),
  Pricing: () => import("../sections/Pricing"),
  CTA: () => import("../sections/CTA"),
  MagicReveal: () => import("../sections/MagicReveal"),
  Footer: () => import("../sections/Footer"),
};

const Showcase = lazy(sectionLoaders.Showcase);
const Features = lazy(sectionLoaders.Features);
const StudioCanvas = lazy(sectionLoaders.StudioCanvas);
const Approach = lazy(sectionLoaders.Approach);
const Stats = lazy(sectionLoaders.Stats);
const Pricing = lazy(sectionLoaders.Pricing);
const CTA = lazy(sectionLoaders.CTA);
const MagicReveal = lazy(sectionLoaders.MagicReveal);
const Footer = lazy(sectionLoaders.Footer);

export default function Home() {
  // Mounting all sections at once forces every below-fold section's
  // ScrollTrigger/SplitText/Draggable setup to run in the same tick as the
  // Preloader's own animation. Splitting them into separate chunks and
  // prefetching once the preloader finishes spreads that work out instead
  // of bursting it all at navigation start, without delaying when content
  // is actually ready by the time the user scrolls to it.
  useEffect(() => {
    let cancelled = false;
    const onPreloadDone = () => {
      const loaders = Object.values(sectionLoaders);
      // Prefetch one chunk per idle slice (in scroll order) so the
      // parse/eval of nine modules doesn't merge into one long task.
      const idle =
        "requestIdleCallback" in globalThis
          ? globalThis.requestIdleCallback
          : (cb: () => void) => setTimeout(cb, 100);
      const next = (i: number) => {
        if (cancelled || i >= loaders.length) return;
        idle(() => {
          loaders[i]().finally(() => next(i + 1));
        });
      };
      next(0);
    };
    globalThis.addEventListener("app:preload-done", onPreloadDone);
    return () => {
      cancelled = true;
      globalThis.removeEventListener("app:preload-done", onPreloadDone);
    };
  }, []);

  useEffect(() => {
    let preloadDone = false;
    let fontsDone = false;
    let refreshed = false;

    const maybeRefresh = () => {
      if (refreshed || !preloadDone || !fontsDone) return;
      refreshed = true;
      ScrollTrigger.refresh();
      globalThis.dispatchEvent(new Event("app:layout-ready"));
    };

    const onPreloadDone = () => {
      preloadDone = true;
      maybeRefresh();
    };
    globalThis.addEventListener("app:preload-done", onPreloadDone);
    document.fonts.ready.then(() => {
      fontsDone = true;
      maybeRefresh();
    });

    return () => globalThis.removeEventListener("app:preload-done", onPreloadDone);
  }, []);

  return (
    <div className="grain bg-ink text-paper">
      <Preloader />
      <ScrollProgress />
      <Hero />
      <Marquee />
      <TextReveal />
      <Suspense fallback={null}>
        <Showcase />
        <Features />
        <StudioCanvas />
        <Approach />
        <Stats />
        <Pricing />
        <CTA />
        <MagicReveal />
        <Footer />
      </Suspense>
    </div>
  );
}
