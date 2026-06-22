import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "../lib/gsap";
import { cta } from "../content/site";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { DURATION, EASE, STAGGER } from "../lib/motion";

export default function CTA() {
  const root = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !titleRef.current) return;

      const split = new SplitText(titleRef.current, { type: "chars" });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });

      tl.from(".cta-plate", {
        scaleX: 0,
        transformOrigin: "left",
        duration: 0.7,
        ease: "power3.inOut",
      })
        .from(
          split.chars,
          {
            yPercent: 110,
            opacity: 0,
            duration: DURATION.medium,
            ease: EASE.strongOut,
            stagger: 0.03,
          },
          "-=0.2",
        )
        .from(
          ".cta-fade",
          { y: 24, opacity: 0, duration: DURATION.base, ease: EASE.softOut, stagger: STAGGER.base },
          "-=0.3",
        );

      return () => split.revert();
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section
      id="cta"
      ref={root}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-flame px-6 text-ink"
    >
      <div className="cta-plate absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-ink/20" />

      <p className="cta-fade relative text-sm font-medium tracking-[0.4em] uppercase">
        Ready?
      </p>
      <h2
        ref={titleRef}
        className="font-display relative mt-4 text-center text-[22vw] leading-[0.85] uppercase md:text-[16vw]"
      >
        {cta.title}
      </h2>
      <p className="cta-fade relative mt-6 max-w-md text-center text-lg font-light text-ink/70">
        {cta.subtitle}
      </p>
      <button className="cta-fade relative mt-10 cursor-pointer border-2 border-ink bg-ink px-10 py-4 text-sm font-bold tracking-widest text-paper uppercase transition-colors duration-200 hover:bg-transparent hover:text-ink">
        {cta.button}
      </button>
    </section>
  );
}
