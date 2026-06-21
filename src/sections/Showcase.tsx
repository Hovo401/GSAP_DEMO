import { useRef } from "react";
import { gsap, useGSAP } from "../lib/gsap";
import { showcase } from "../content/site";
import { useReducedMotion } from "../hooks/useReducedMotion";

export default function Showcase() {
  const root = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track) return;

      // Vertical scroll drives horizontal travel of the panel track.
      const distance = () => track.scrollWidth - window.innerWidth;

      const horizontal = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          start: "top top",
          end: () => `+=${distance()}`,
        },
      });

      if (reduced) return;

      // Depth: the card content drifts against its panel as it crosses the view.
      gsap.utils.toArray<HTMLElement>(".showcase-depth").forEach((el) => {
        gsap.fromTo(
          el,
          { xPercent: -12 },
          {
            xPercent: 12,
            ease: "none",
            scrollTrigger: {
              trigger: el.closest(".showcase-panel"),
              containerAnimation: horizontal,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          },
        );
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section id="showcase" ref={root} className="relative h-screen overflow-hidden bg-ink">
      <div ref={trackRef} className="flex h-screen w-max will-change-transform">
        {/* Intro panel */}
        <div className="showcase-panel flex h-full w-screen shrink-0 flex-col justify-center border-r-2 border-paper/15 px-8 md:px-24">
          <p className="text-sm font-medium tracking-[0.4em] text-flame uppercase">
            Selected work
          </p>
          <h2 className="font-display mt-4 text-[16vw] leading-[0.85] uppercase md:text-[10vw]">
            Showcase
          </h2>
          <p className="mt-6 max-w-md text-lg font-light text-paper/50">
            Keep scrolling — the gallery moves sideways.
          </p>
        </div>

        {/* Case cards */}
        {showcase.map((item) => (
          <div
            key={item.no}
            className={`showcase-panel relative flex h-full w-screen shrink-0 items-center justify-center overflow-hidden ${item.accent}`}
          >
            <span className="absolute top-8 left-8 font-display text-2xl opacity-60">
              {item.no}
            </span>
            <span className="absolute top-8 right-8 text-xs font-medium tracking-[0.3em] uppercase opacity-70">
              {item.tag}
            </span>
            <div className="showcase-depth text-center">
              <h3 className="font-display text-[18vw] leading-none uppercase md:text-[12vw]">
                {item.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
