import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "../lib/gsap";
import { hero, brand } from "../content/site";
import { useReducedMotion } from "../hooks/useReducedMotion";

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !titleRef.current) return;

      // Word-by-word entrance for the headline.
      const split = new SplitText(titleRef.current, { type: "lines,words" });
      gsap.from(split.words, {
        yPercent: 120,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
        stagger: 0.08,
        delay: 0.15,
      });

      // The kicker / subtitle fade up under it.
      gsap.from(".hero-fade", {
        y: 24,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.5,
      });

      // Pin the hero and let the content drift up + dim as you scroll past.
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

      // Looping nudge on the scroll hint.
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
      <div ref={contentRef} className="text-center">
        <p className="hero-fade mb-6 text-sm font-medium tracking-[0.4em] text-flame uppercase">
          {brand.name} — {hero.kicker}
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
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-xs font-medium tracking-[0.3em] text-paper/40 uppercase"
      >
        {hero.scrollHint} ↓
      </div>
    </section>
  );
}
