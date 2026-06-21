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
    <section
      id="stats"
      ref={root}
      className="bg-paper px-6 py-24 text-ink md:px-12"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="flex items-center gap-3 text-sm font-medium tracking-[0.4em] text-flame uppercase">
              <span className="h-px w-8 bg-flame/60" />
              By the numbers
            </p>
            <h2 className="font-display mt-3 text-5xl leading-none uppercase md:text-7xl">
              Proof in motion
            </h2>
          </div>
          <p className="max-w-xs text-sm font-light text-ink/50 md:text-right">
            Built and battle-tested across thousands of production builds.
          </p>
        </div>

        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="group border-t-2 border-ink pt-6 transition-colors duration-300 hover:border-flame"
            >
              <p
                className="stat-value font-display text-7xl leading-none transition-transform duration-300 ease-out group-hover:-translate-y-1 md:text-8xl"
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
      </div>
    </section>
  );
}
