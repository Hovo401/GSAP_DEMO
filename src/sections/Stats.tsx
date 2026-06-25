import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { gsap, useGSAP } from "../lib/gsap";
import { stats as statValues } from "../content/site";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useScramble } from "../hooks/useScramble";
import { EASE, SCROLL_START } from "../lib/motion";

type StatLabel = { label: string };

export default function Stats() {
  const { t } = useTranslation();
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const heading = t("statsIntro.heading");
  const headingRef = useScramble<HTMLHeadingElement>(heading);
  const stats = (t("stats.items", { returnObjects: true }) as StatLabel[]).map(
    (item, i) => ({ ...statValues[i], ...item }),
  );

  useGSAP(
    () => {
      if (reduced) return;

      gsap.utils.toArray<HTMLElement>(".stat-value").forEach((el) => {
        const end = Number(el.dataset.value);
        const counter = { v: 0 };
        gsap.to(counter, {
          v: end,
          duration: 1.6,
          ease: EASE.softOut,
          onUpdate: () => {
            el.firstChild!.textContent = Math.round(counter.v).toString();
          },
          scrollTrigger: { trigger: el, start: SCROLL_START.early, once: true },
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
              {t("statsIntro.kicker")}
            </p>
            <h2
              ref={headingRef}
              className="font-display mt-3 text-5xl leading-none uppercase md:text-7xl"
            >
              {heading}
            </h2>
          </div>
          <p className="max-w-xs text-sm font-light text-ink/50 md:text-right">
            {t("statsIntro.body")}
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
