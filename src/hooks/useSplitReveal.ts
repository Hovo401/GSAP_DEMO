import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "../lib/gsap";
import { useReducedMotion } from "./useReducedMotion";

type SplitTarget = "chars" | "words" | "lines";

export function useSplitReveal<T extends HTMLElement>(
  splitType: string,
  target: SplitTarget,
  vars: gsap.TweenVars,
) {
  const ref = useRef<T>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (reduced || !el) return;

      const split = new SplitText(el, { type: splitType });
      gsap.from(split[target], vars);

      return () => split.revert();
    },
    { dependencies: [reduced] },
  );

  return ref;
}
