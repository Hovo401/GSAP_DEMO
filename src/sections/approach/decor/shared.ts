import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "../../../lib/gsap";
import { useReducedMotion } from "../../../hooks/useReducedMotion";

export type DecorProps = { className?: string };

export const DECOR = {
  structuralWidth: 1.5,
  dottedWidth: 2,
  dottedDash: "1 10",
  dimOpacity: 0.45,
  midOpacity: 0.65,
  dotR: 8,
} as const;

type Selector = ReturnType<typeof gsap.utils.selector>;

/**
 * Builds a decor's looping animations and links their speed to scroll velocity:
 * the graphic subtly accelerates while the page scrolls, settling back to 1.
 * `build` receives a scoped selector and returns the running animations to modulate.
 * Skipped entirely under prefers-reduced-motion (static SVG stays as-is).
 */
export function useDecorMotion(
  build: (q: Selector) => gsap.core.Animation[],
) {
  const root = useRef<SVGSVGElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;

      const q = gsap.utils.selector(root);
      const anims = build(q);

      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const ts = gsap.utils.clamp(1, 3.5, 1 + Math.abs(self.getVelocity()) / 700);
          anims.forEach((a) => a.timeScale(ts));
        },
      });

      return () => st.kill();
    },
    { scope: root, dependencies: [reduced] },
  );

  return root;
}
