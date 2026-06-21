import { useRef } from "react";
import { gsap, useGSAP } from "../lib/gsap";
import { pricing } from "../content/site";
import { useReducedMotion } from "../hooks/useReducedMotion";

export default function Pricing() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      gsap.from(".price-card", {
        y: 60,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: ".price-grid", start: "top 80%" },
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section id="pricing" ref={root} className="bg-ink px-6 py-28 md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p className="text-sm font-medium tracking-[0.4em] text-flame uppercase">
            Plans
          </p>
          <h2 className="font-display mt-3 text-6xl leading-none uppercase md:text-8xl">
            Pick a lane
          </h2>
        </div>

        <div className="price-grid grid gap-6 md:grid-cols-3">
          {pricing.map((tier) => (
            <div
              key={tier.name}
              className={`price-card flex flex-col border-2 p-8 ${
                tier.featured
                  ? "border-flame bg-flame text-ink"
                  : "border-paper/20 bg-ink text-paper"
              }`}
            >
              <h3 className="text-xl font-bold tracking-wide uppercase">
                {tier.name}
              </h3>
              <div className="mt-6 flex items-end gap-2">
                <span className="font-display text-6xl leading-none">
                  {tier.price}
                </span>
                {tier.period && (
                  <span className="mb-1 text-sm opacity-70">{tier.period}</span>
                )}
              </div>
              <ul className="mt-8 flex-1 space-y-3 text-sm">
                {tier.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-2">
                    <span className={tier.featured ? "text-ink" : "text-flame"}>
                      —
                    </span>
                    {feat}
                  </li>
                ))}
              </ul>
              <button
                className={`mt-10 cursor-pointer border-2 py-3 text-sm font-bold tracking-wide uppercase transition-colors duration-200 ${
                  tier.featured
                    ? "border-ink bg-ink text-paper hover:bg-transparent hover:text-ink"
                    : "border-flame text-flame hover:bg-flame hover:text-ink"
                }`}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
