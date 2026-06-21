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
    <section id="features" ref={root} className="bg-ink px-6 py-28 md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="feature-heading mb-16">
          <p className="text-sm font-medium tracking-[0.4em] text-flame uppercase">
            What it does
          </p>
          <h2 className="font-display mt-3 text-6xl leading-none uppercase md:text-8xl">
            Built to move
          </h2>
        </div>

        <div className="feature-grid grid gap-6 md:grid-cols-2">
          {features.map((f) => (
            <article
              key={f.no}
              className="feature-card group border-2 border-paper/20 bg-ink p-8 transition-colors duration-300 hover:border-flame md:p-10"
            >
              <span className="font-display text-3xl text-flame">{f.no}</span>
              <h3 className="mt-6 text-2xl font-bold tracking-tight md:text-3xl">
                {f.title}
              </h3>
              <p className="mt-4 text-base font-light text-paper/60 md:text-lg">
                {f.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
