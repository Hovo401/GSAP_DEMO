import { useRef } from "react";
import { features } from "../content/site";
import { useScramble } from "../hooks/useScramble";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { DURATION, STAGGER, SCROLL_START } from "../lib/motion";
import TiltCard from "../components/ui/TiltCard";

export default function Features() {
  const root = useRef<HTMLElement>(null);
  const headingRef = useScramble<HTMLHeadingElement>("Built to move");

  useScrollReveal(root, ".feature-heading", {
    duration: DURATION.medium,
    trigger: root,
    start: SCROLL_START.late,
  });

  useScrollReveal(root, ".feature-card", {
    yPercent: 30,
    clipPath: "inset(100% 0 0 0)",
    duration: DURATION.slow,
    stagger: STAGGER.loose,
    trigger: ".feature-grid",
  });

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
            <h2
              ref={headingRef}
              className="font-display mt-3 text-6xl leading-none uppercase md:text-8xl"
            >
              Built to move
            </h2>
          </div>
          <p className="max-w-xs text-sm font-light text-paper/50 md:text-right">
            Four primitives that turn scroll position into choreography.
          </p>
        </div>

        <div className="feature-grid grid gap-6 md:grid-cols-2">
          {features.map((f) => (
            <TiltCard
              key={f.no}
              wrapperClassName="feature-card"
              className="group relative h-full overflow-hidden border-2 border-paper/20 bg-ink p-8 transition-colors duration-300 hover:border-flame md:p-10"
            >
              <span className="font-display pointer-events-none absolute -top-6 -right-2 text-[8rem] leading-none text-paper/[0.04] transition-colors duration-300 transform-[translateZ(-60px)] select-none group-hover:text-flame/10 md:text-[10rem]">
                {f.no}
              </span>

              <div className="relative flex items-center justify-between transform-[translateZ(50px)]">
                <span className="font-display text-3xl text-flame">{f.no}</span>
                <span className="text-2xl text-paper/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-flame">
                  ↗
                </span>
              </div>
              <h3 className="relative mt-6 text-2xl font-bold tracking-tight transform-[translateZ(85px)] md:text-3xl">
                {f.title}
              </h3>
              <p className="relative mt-4 text-base font-light text-paper/60 transform-[translateZ(45px)] md:text-lg">
                {f.body}
              </p>

              <span className="absolute bottom-0 left-0 h-[3px] w-0 bg-flame transition-all duration-300 ease-out group-hover:w-full" />
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
