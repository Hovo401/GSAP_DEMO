import { useRef, useState } from "react";
import { gsap, SplitText, useGSAP } from "../../lib/gsap";
import { brand } from "../../content/site";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const COLUMNS = 6;

export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLHeadingElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      if (reduced) {
        setDone(true);
        globalThis.dispatchEvent(new Event("app:preload-done"));
        return;
      }

      document.body.style.overflow = "hidden";

      const split = new SplitText(wordRef.current, { type: "chars" });
      const counter = { v: 0 };

      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: () => {
          document.body.style.overflow = "";
          setDone(true);
          globalThis.dispatchEvent(new Event("app:preload-done"));
        },
      });

      tl.from(split.chars, {
        yPercent: 120,
        opacity: 0,
        duration: 0.8,
        ease: "power4.out",
        stagger: 0.06,
      })
        .from(".loader-tag", { opacity: 0, y: 16, duration: 0.5 }, "-=0.35")
        .to(".loader-bar", { scaleX: 1, duration: 1.9, ease: "power1.inOut" }, "<")
        .to(
          counter,
          {
            v: 100,
            duration: 1.9,
            ease: "power1.inOut",
            onUpdate: () => {
              if (countRef.current) {
                countRef.current.textContent = Math.round(counter.v).toString();
              }
            },
          },
          "<",
        )
        .to(
          ".loader-content",
          { yPercent: -115, duration: 0.6, ease: "power3.in" },
          "+=0.25",
        )
        .to(
          ".loader-col",
          { yPercent: -100, duration: 0.7, ease: "power4.inOut", stagger: 0.08 },
          "-=0.25",
        );
    },
    { scope: root, dependencies: [reduced] },
  );

  if (done) return null;

  return (
    <div ref={root} className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 flex">
        {Array.from({ length: COLUMNS }).map((_, i) => (
          <div key={i} className="loader-col h-full flex-1 bg-ink" />
        ))}
      </div>

      <div className="loader-content absolute inset-0 flex flex-col items-center justify-center px-6">
        <div className="overflow-hidden pb-[0.12em]">
          <h1
            ref={wordRef}
            className="font-display text-[22vw] leading-none uppercase text-paper md:text-[15vw]"
          >
            {brand.name}
          </h1>
        </div>
        <p className="loader-tag mt-2 text-xs font-medium tracking-[0.5em] text-flame uppercase md:text-sm">
          {brand.tagline}
        </p>

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-6 pb-6 md:px-12">
          <span className="text-xs font-medium tracking-[0.3em] text-paper/40 uppercase">
            Loading
          </span>
          <span className="font-display text-5xl leading-none text-paper md:text-7xl">
            <span ref={countRef}>0</span>
            <span className="text-flame">%</span>
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-flame loader-bar" />
      </div>
    </div>
  );
}
