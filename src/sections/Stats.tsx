import { useRef } from "react";
import { gsap, useGSAP } from "../lib/gsap";
import { stats } from "../content/site";
import { useReducedMotion } from "../hooks/useReducedMotion";

export default function Stats() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;

      gsap.utils.toArray<HTMLElement>(".stat-value").forEach((el) => {
        const end = Number(el.dataset.value);
        const counter = { v: 0 };
        gsap.to(counter, {
          v: end,
          duration: 1.6,
          ease: "power2.out",
          onUpdate: () => {
            el.firstChild!.textContent = Math.round(counter.v).toString();
          },
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section ref={root} className="bg-paper px-6 py-24 text-ink md:px-12">
      <div className="mx-auto grid max-w-6xl gap-12 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="border-t-2 border-ink pt-6">
            <p
              className="stat-value font-display text-7xl leading-none md:text-8xl"
              data-value={s.value}
            >
              <span>{s.value}</span>
              <span className="text-flame">{s.suffix}</span>
            </p>
            <p className="mt-4 text-sm font-medium tracking-[0.2em] text-ink/60 uppercase">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
