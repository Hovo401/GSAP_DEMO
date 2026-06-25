import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "../lib/gsap";
import { approach } from "../content/site";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { approachDecor } from "./approach/decor";

export default function Approach() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;

      const cards = gsap.utils.toArray<HTMLElement>(".approach-card");
      const peek = 52;

      cards.forEach((card, i) => {
        ScrollTrigger.create({
          trigger: card,
          start: () => `top top+=${i * peek}`,
          endTrigger: root.current,
          end: "bottom bottom",
          pin: true,
          pinSpacing: false,
          invalidateOnRefresh: true,
        });
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section id="approach" ref={root} className="relative bg-paper pb-[36vh]">
      {approach.map((step, i) => {
        const dark = step.tone === "ink";
        const Decor = approachDecor[i];
        return (
          <div
            key={step.no}
            className="approach-card relative h-[64vh] px-3 pt-32 md:px-10"
            style={{ zIndex: i + 1 }}
          >
            <div
              className={`card-bg relative mx-auto flex h-[calc(64vh-6.5rem)] w-full max-w-[min(92vw,2200px)] flex-col overflow-hidden rounded-[2.5rem] px-8 py-12 md:px-16 md:py-14 ${
                dark ? "bg-ink text-paper" : "bg-flame text-paper"
              }`}
            >
              <span className="relative z-10 text-sm font-medium tracking-[0.3em] opacity-60 md:text-base">
                ({step.no})
              </span>
              <h3 className="font-display relative z-10 mt-4 text-[13vw] leading-[0.9] uppercase md:text-[6.5vw]">
                {step.title}
              </h3>
              <p className="relative z-10 mt-auto max-w-sm text-base font-light text-balance opacity-80 md:max-w-md md:text-2xl">
                {step.body}
              </p>

              <Decor
                className={`pointer-events-none absolute -right-8 -bottom-8 h-[42vh] w-[42vh] opacity-50 md:right-0 md:-bottom-6 md:h-[58vh] md:w-[58vh] md:opacity-100 ${
                  dark ? "text-paper/70" : "text-paper/80"
                }`}
              />
            </div>
          </div>
        );
      })}
    </section>
  );
}
