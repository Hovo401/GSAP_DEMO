import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "../lib/gsap";
import { approach } from "../content/site";
import { useReducedMotion } from "../hooks/useReducedMotion";
import OrbitDecor from "../components/ui/OrbitDecor";

export default function Approach() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;

      const cards = gsap.utils.toArray<HTMLElement>(".approach-card");
      const peek = 52; // px of each card left visible above the next one

      cards.forEach((card, i) => {
        // Pin each card a little lower than the last so the previous card's
        // rounded top stays visible as a band; later cards (higher z-index)
        // slide up and cover everything below their top edge. No scaling —
        // the cards keep their exact shape.
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
    <section id="approach" ref={root} className="relative bg-paper">
      {approach.map((step, i) => {
        const dark = step.tone === "ink";
        return (
          <div
            key={step.no}
            className="approach-card relative h-[64vh] px-3 pt-32 md:px-10"
            style={{ zIndex: i + 1 }}
          >
            {/* Inset card floating on the light frame */}
            <div
              className={`card-bg relative mx-auto flex h-[calc(64vh-6.5rem)] w-full max-w-[1500px] flex-col overflow-hidden rounded-[2.5rem] px-8 py-12 md:px-16 md:py-14 ${
                dark ? "bg-ink text-paper" : "bg-flame text-paper"
              }`}
            >
              <span className="text-base font-medium opacity-60 md:text-lg">
                ({step.no})
              </span>
              <h3 className="font-display mt-3 text-[13vw] leading-[0.9] uppercase md:text-[6.5vw]">
                {step.title}
              </h3>
              <p className="mt-auto max-w-md text-base font-light opacity-80 md:text-2xl">
                {step.body}
              </p>

              <OrbitDecor
                className={`pointer-events-none absolute -right-10 -bottom-10 h-[58vh] w-[58vh] md:right-0 md:-bottom-6 ${
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
