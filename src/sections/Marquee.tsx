import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { gsap, ScrollTrigger, useGSAP } from "../lib/gsap";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { EASE } from "../lib/motion";

export default function Marquee() {
  const { t } = useTranslation();
  const root = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !trackRef.current) return;

      const loop = gsap.to(trackRef.current, {
        xPercent: -50,
        ease: EASE.none,
        duration: 18,
        repeat: -1,
      });

      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const v = self.getVelocity();
          const dir = v < 0 ? -1 : 1;
          loop.timeScale(dir * gsap.utils.clamp(0.3, 4, 1 + Math.abs(v) / 600));
        },
        onEnter: () => loop.play(),
        onLeave: () => loop.pause(),
        onEnterBack: () => loop.play(),
        onLeaveBack: () => loop.pause(),
      });

      return () => st.kill();
    },
    { scope: root, dependencies: [reduced] },
  );

  const marqueeWords = t("marqueeWords", { returnObjects: true }) as string[];
  const words = [...marqueeWords, ...marqueeWords];

  return (
    <div
      ref={root}
      className="relative overflow-hidden border-y-2 border-paper/20 bg-ink py-6"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-linear-to-r from-ink to-transparent md:w-40" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l from-ink to-transparent md:w-40" />

      <div
        ref={trackRef}
        className="flex w-max items-center gap-8 whitespace-nowrap"
      >
        {words.map((word, i) => (
          <span key={i} className="flex items-center gap-8">
            <span className="font-display text-5xl tracking-tight text-paper/80 uppercase md:text-7xl">
              {word}
            </span>
            <span className="text-3xl text-flame md:text-5xl">✳</span>
          </span>
        ))}
      </div>
    </div>
  );
}
