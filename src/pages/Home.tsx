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
  MagicReveal: () => import("../sections/MagicReveal"),
  Footer: () => import("../sections/Footer"),
};

const Showcase = lazy(sectionLoaders.Showcase);
const Features = lazy(sectionLoaders.Features);
const StudioCanvas = lazy(sectionLoaders.StudioCanvas);
const Approach = lazy(sectionLoaders.Approach);
const Stats = lazy(sectionLoaders.Stats);
const MagicReveal = lazy(sectionLoaders.MagicReveal);
const Footer = lazy(sectionLoaders.Footer);

export default function Home() {
  useEffect(() => {
    let cancelled = false;
    const onPreloadDone = () => {
      const loaders = Object.values(sectionLoaders);
      const idle =
        "requestIdleCallback" in globalThis
          ? globalThis.requestIdleCallback
          : (cb: () => void) => setTimeout(cb, 100);
      const next = (i: number) => {
        if (cancelled) return;
        if (i >= loaders.length) {
          requestAnimationFrame(() =>
            globalThis.dispatchEvent(new Event("app:sections-ready")),
          );
          return;
        }
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

    if ("fonts" in document) {
      document.fonts.ready.then(() => {
        fontsDone = true;
        maybeRefresh();
      });
    } else {
      fontsDone = true;
    }

    // Slow/blocked font fetch (e.g. Google Fonts unreachable) can leave
    // fonts.ready pending indefinitely — don't let that stall the only
    // ScrollTrigger.refresh() forever.
    const fontsTimeout = setTimeout(() => {
      fontsDone = true;
      maybeRefresh();
    }, 2500);

    return () => {
      globalThis.removeEventListener("app:preload-done", onPreloadDone);
      clearTimeout(fontsTimeout);
    };
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
        <MagicReveal />
        <Stats />
        <Footer />
      </Suspense>
    </div>
  );
}
