import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { gsap, useGSAP } from "../lib/gsap";
import { stats as statValues, aboutStack } from "../content/site";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useScramble } from "../hooks/useScramble";
import { useTypewriter } from "../hooks/useTypewriter";
import { EASE, SCROLL_START } from "../lib/motion";
import TiltCard from "../components/ui/TiltCard";

type StatLabel = { label: string };

export default function Stats() {
  const { t } = useTranslation();
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const heading = t("statsIntro.heading");
  const headingRef = useScramble<HTMLHeadingElement>(heading);
  const bio = t("statsIntro.bio");
  const bioRef = useTypewriter<HTMLParagraphElement>(bio);
  const stats = (t("stats.items", { returnObjects: true }) as StatLabel[]).map(
    (item, i) => ({ ...statValues[i], ...item }),
  );
  const stack = [
    { label: t("statsIntro.stack.backend"), items: aboutStack[0].items },
    { label: t("statsIntro.stack.frontend"), items: aboutStack[1].items },
  ];

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
        <div className="mb-16">
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

        <div className="grid gap-12 md:grid-cols-[280px_1fr] md:gap-16">
          <TiltCard wrapperClassName="feature-card" className="">
            <div className="relative aspect-square w-full max-w-70 overflow-hidden rounded-2xl border-2 border-ink ring-4 ring-flame/20">
              <img
                src="/avatar.jpeg"
                alt={heading}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <span
                aria-hidden
                className="font-display flex h-full w-full items-center justify-center bg-ink/5 text-7xl text-ink/30"
              >
                HK
              </span>
            </div>
          </TiltCard>

          <div>
            <p className="text-sm font-medium tracking-[0.2em] text-flame uppercase">
              {t("statsIntro.role")}
            </p>
            <p
              ref={bioRef}
              className="mt-5 max-w-xl text-lg leading-relaxed font-light text-ink/70"
            >
              {bio}
            </p>

            <div className="mt-10 grid gap-x-12 gap-y-6 sm:grid-cols-2">
              {stack.map((group) => (
                <div key={group.label}>
                  <p className="text-xs font-medium tracking-[0.3em] text-flame uppercase">
                    {group.label}
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {group.items.map((tech) => (
                      <li
                        key={tech}
                        className="rounded-full border border-ink/15 px-3 py-1 text-sm font-light text-ink/70"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-12 grid max-w-md grid-cols-2 gap-8">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="group border-t-2 border-ink pt-5 transition-colors duration-300 hover:border-flame"
                >
                  <p
                    className="stat-value font-display text-5xl leading-none transition-transform duration-300 ease-out group-hover:-translate-y-1 md:text-6xl"
                    data-value={s.value}
                  >
                    <span>{s.value}</span>
                    <span className="text-flame">{s.suffix}</span>
                  </p>
                  <p className="mt-3 text-xs font-medium tracking-[0.2em] text-ink/60 uppercase">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
