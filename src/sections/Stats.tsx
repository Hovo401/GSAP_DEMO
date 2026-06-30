import { useTranslation } from "react-i18next";
import { aboutStack } from "../content/site";
import { useScramble } from "../hooks/useScramble";
import { useTypewriter } from "../hooks/useTypewriter";
import { useContactPanelStore } from "../store/useContactPanelStore";
import TiltCard from "../components/ui/TiltCard";

export default function Stats() {
  const { t } = useTranslation();
  const openContact = useContactPanelStore((s) => s.openContact);
  const heading = t("statsIntro.heading");
  const headingRef = useScramble<HTMLHeadingElement>(heading);
  const bio = t("statsIntro.bio");
  const bioRef = useTypewriter<HTMLParagraphElement>(bio);
  const stack = [
    { label: t("statsIntro.stack.backend"), items: aboutStack[0].items },
    { label: t("statsIntro.stack.frontend"), items: aboutStack[1].items },
    { label: t("statsIntro.stack.devops"), items: aboutStack[2].items },
  ];

  return (
    <section id="stats" className="bg-paper px-6 py-24 text-ink md:px-12">
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

            <div className="mt-10 grid gap-x-12 gap-y-6 sm:grid-cols-2 md:grid-cols-3">
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

            <button
              type="button"
              onClick={openContact}
              className="mt-10 inline-flex w-fit items-center gap-3 border-2 border-ink px-8 py-4 text-sm font-bold tracking-widest text-ink uppercase transition-colors duration-200 hover:bg-ink hover:text-paper"
            >
              {t("statsIntro.contactCta")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
