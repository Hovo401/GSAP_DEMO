import { useRef } from "react";
import { gsap, useGSAP } from "../lib/gsap";
import { hero, brand } from "../content/site";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useSplitReveal } from "../hooks/useSplitReveal";
import { DURATION, EASE, STAGGER } from "../lib/motion";

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const titleRef = useSplitReveal<HTMLHeadingElement>("lines,words", "words", {
    yPercent: 120,
    opacity: 0,
    duration: DURATION.slower,
    ease: EASE.strongOut,
    stagger: STAGGER.tight,
    delay: 0.15,
  });

  useGSAP(
    () => {
      if (reduced || !contentRef.current) return;

      gsap.from(".hero-meta", {
        opacity: 0,
        duration: DURATION.slower,
        ease: EASE.softOut,
        stagger: STAGGER.base,
        delay: 0.2,
      });

      gsap.from(".hero-fade", {
        y: 24,
        opacity: 0,
        duration: DURATION.slow,
        ease: EASE.out,
        stagger: STAGGER.loose,
        delay: 0.5,
      });

      gsap.to(".hero-glow", {
        scale: 1.18,
        opacity: 0.85,
        duration: 5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 1.4,
      });

      gsap.to(contentRef.current, {
        yPercent: -18,
        scale: 0.92,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          pin: true,
          scrub: true,
        },
      });

      gsap.to(hintRef.current, {
        y: 10,
        repeat: -1,
        yoyo: true,
        duration: 1,
        ease: "sine.inOut",
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  const renderTitle = () =>
    hero.titleLines.map((line) => (
      <span key={line} className="block overflow-hidden">
        <span
          className={
            line === hero.accentWord ? "text-flame" : "text-paper"
          }
        >
          {line}
        </span>
      </span>
    ));

  return (
    <section
      ref={root}
      id="home"
      className="relative flex h-screen items-center justify-center overflow-hidden bg-ink px-6"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="hero-glow glow absolute top-1/4 left-1/4 h-[40vw] w-[40vw] opacity-50" />
        <div className="hero-glow glow absolute right-1/4 bottom-1/4 h-[32vw] w-[32vw] opacity-40" />
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-paper) 1px, transparent 1px), linear-gradient(90deg, var(--color-paper) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      <span className="hero-meta absolute top-24 left-6 hidden text-xs font-medium tracking-[0.3em] text-paper/35 uppercase md:block md:left-10">
        Est. 2026
      </span>
      <span className="hero-meta absolute top-24 right-6 hidden text-right text-xs font-medium tracking-[0.3em] text-paper/35 uppercase md:block md:right-10">
        v1.0 / GSAP
      </span>
      <span className="hero-meta absolute bottom-10 left-6 hidden text-xs font-medium tracking-[0.3em] text-paper/35 uppercase md:block md:left-10">
        40°N — 44°E
      </span>

      <div ref={contentRef} className="relative text-center">
        <p className="hero-fade mb-6 flex items-center justify-center gap-3 text-sm font-medium tracking-[0.4em] text-flame uppercase">
          <span className="h-px w-8 bg-flame/60" />
          {brand.name} — {hero.kicker}
          <span className="h-px w-8 bg-flame/60" />
        </p>
        <h1
          ref={titleRef}
          className="font-display text-[20vw] leading-[0.85] tracking-tight uppercase md:text-[16vw]"
        >
          {renderTitle()}
        </h1>
        <p className="hero-fade mx-auto mt-8 max-w-xl text-lg font-light text-paper/60 md:text-2xl">
          {hero.subtitle}
        </p>
      </div>

      <div
        ref={hintRef}
        className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-xs font-medium tracking-[0.3em] text-paper/40 uppercase"
      >
        {hero.scrollHint}
        <span className="text-flame">↓</span>
      </div>
    </section>
  );
}
