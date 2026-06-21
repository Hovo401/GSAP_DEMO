import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "../lib/gsap";
import { marqueeWords } from "../content/site";
import { useReducedMotion } from "../hooks/useReducedMotion";

export default function Marquee() {
  const root = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !trackRef.current) return;

      // The track holds two identical word-sets; sliding 50% loops seamlessly.
      const loop = gsap.to(trackRef.current, {
        xPercent: -50,
        ease: "none",
        duration: 18,
        repeat: -1,
      });

      // Scroll velocity briefly speeds up / flips the strip — a brutal staple.
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const v = self.getVelocity();
          const dir = v < 0 ? -1 : 1;
          loop.timeScale(dir * gsap.utils.clamp(0.3, 4, 1 + Math.abs(v) / 600));
        },
      });

      return () => st.kill();
    },
    { scope: root, dependencies: [reduced] },
  );

  const words = [...marqueeWords, ...marqueeWords];

  return (
    <div
      ref={root}
      className="overflow-hidden border-y-2 border-paper/20 bg-ink py-6"
    >
      <div ref={trackRef} className="flex w-max items-center gap-8 whitespace-nowrap">
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
