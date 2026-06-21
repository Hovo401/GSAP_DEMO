import { useRef } from "react";
import { gsap, useGSAP } from "../lib/gsap";
import { showcase, showcaseIntro } from "../content/site";
import { useReducedMotion } from "../hooks/useReducedMotion";

export default function Showcase() {
  const root = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track) return;

      // Vertical scroll drives horizontal travel of the card track.
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

      // Each card's content rises in as the card swings through view.
      gsap.utils.toArray<HTMLElement>(".showcase-card").forEach((card) => {
        const items = card.querySelectorAll(".card-reveal");
        gsap.fromTo(
          items,
          { yPercent: 60, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            ease: "power2.out",
            stagger: 0.08,
            scrollTrigger: {
              trigger: card,
              containerAnimation: horizontal,
              start: "left 88%",
              end: "left 45%",
              scrub: true,
            },
          },
        );
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section
      id="showcase"
      ref={root}
      className="relative h-screen overflow-hidden bg-ink"
    >
      <div
        ref={trackRef}
        className="flex h-screen w-max items-center will-change-transform"
      >
        {/* Intro panel */}
        <div className="flex h-full w-screen shrink-0 flex-col justify-center px-8 md:w-[55vw] md:px-24">
          <p className="text-sm font-medium tracking-[0.4em] text-flame uppercase">
            {showcaseIntro.kicker}
          </p>
          <h2 className="font-display mt-4 text-[18vw] leading-[0.85] uppercase md:text-[9vw]">
            {showcaseIntro.title}
          </h2>
          <p className="mt-8 max-w-md text-lg font-light text-paper/60">
            {showcaseIntro.body}
          </p>
          <p className="mt-10 flex items-center gap-3 text-xs font-medium tracking-[0.3em] text-paper/40 uppercase">
            <span className="h-px w-10 bg-paper/40" />
            Scroll sideways
          </p>
        </div>

        {/* Project cards */}
        {showcase.map((item) => (
          <article
            key={item.no}
            className="showcase-card group flex h-full w-[82vw] shrink-0 items-center px-3 sm:w-[58vw] md:w-[34vw]"
          >
            <div className="flex h-[74vh] w-full flex-col rounded-3xl border border-paper/12 bg-[#161616] p-8 transition-all duration-300 ease-out group-hover:-translate-y-2 group-hover:border-flame/40 md:p-10">
              <span className="card-reveal text-base text-paper/40">
                ({item.no})
              </span>

              <h3 className="card-reveal font-display mt-6 text-5xl leading-[0.95] uppercase text-flame md:text-6xl">
                {item.title}
              </h3>

              <p className="card-reveal mt-3 text-xs font-medium tracking-[0.3em] text-paper/35 uppercase">
                {item.tag}
              </p>

              <p className="card-reveal mt-auto max-w-sm text-base leading-relaxed text-paper/55 md:text-lg">
                {item.body}
              </p>
            </div>
          </article>
        ))}

        {/* Closing CTA panel */}
        <div className="flex h-full w-screen shrink-0 flex-col justify-center px-8 md:w-[55vw] md:px-24">
          <h2 className="font-display text-[14vw] leading-[0.85] uppercase md:text-[7vw]">
            Want
            <br />
            yours?
          </h2>
          <a
            href="#cta"
            className="mt-10 inline-flex w-fit items-center gap-3 border-2 border-paper px-8 py-4 text-sm font-bold tracking-widest text-paper uppercase transition-colors duration-200 hover:bg-paper hover:text-ink"
          >
            Start a project ↗
          </a>
        </div>
      </div>
    </section>
  );
}
