import { useRef } from "react";
import { gsap, useGSAP } from "../lib/gsap";
import { features } from "../content/site";
import { useReducedMotion } from "../hooks/useReducedMotion";

export default function Features() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;

      gsap.from(".feature-heading", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });

      gsap.from(".feature-card", {
        yPercent: 30,
        opacity: 0,
        clipPath: "inset(100% 0 0 0)",
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: ".feature-grid", start: "top 80%" },
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section
      id="features"
      ref={root}
      className="relative bg-ink px-6 py-28 md:px-12"
    >
      <div className="mx-auto max-w-6xl">
        <div className="feature-heading mb-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="flex items-center gap-3 text-sm font-medium tracking-[0.4em] text-flame uppercase">
              <span className="h-px w-8 bg-flame/60" />
              What it does
            </p>
            <h2 className="font-display mt-3 text-6xl leading-none uppercase md:text-8xl">
              Built to move
            </h2>
          </div>
          <p className="max-w-xs text-sm font-light text-paper/50 md:text-right">
            Four primitives that turn scroll position into choreography.
          </p>
        </div>

        <div className="feature-grid grid gap-6 md:grid-cols-2">
          {features.map((f) => (
            <article
              key={f.no}
              className="feature-card group relative overflow-hidden border-2 border-paper/20 bg-ink p-8 transition-colors duration-300 hover:border-flame md:p-10"
            >
              {/* Ghost watermark number */}
              <span className="font-display pointer-events-none absolute -top-6 -right-2 text-[8rem] leading-none text-paper/[0.04] transition-colors duration-300 select-none group-hover:text-flame/10 md:text-[10rem]">
                {f.no}
              </span>

              <div className="relative flex items-center justify-between">
                <span className="font-display text-3xl text-flame">{f.no}</span>
                <span className="text-2xl text-paper/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-flame">
                  ↗
                </span>
              </div>
              <h3 className="relative mt-6 text-2xl font-bold tracking-tight md:text-3xl">
                {f.title}
              </h3>
              <p className="relative mt-4 text-base font-light text-paper/60 md:text-lg">
                {f.body}
              </p>

              {/* Accent underline grows on hover */}
              <span className="absolute bottom-0 left-0 h-[3px] w-0 bg-flame transition-all duration-300 ease-out group-hover:w-full" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
