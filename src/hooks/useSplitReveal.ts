import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "../lib/gsap";
import { useReducedMotion } from "./useReducedMotion";

type SplitTarget = "chars" | "words" | "lines";

export function useSplitReveal<T extends HTMLElement>(
  splitType: string,
  target: SplitTarget,
  vars: gsap.TweenVars,
  options?: { startEvent?: string },
) {
  const ref = useRef<T>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (reduced || !el) return;

      const split = new SplitText(el, { type: splitType });
      const startEvent = options?.startEvent;
      const tween = gsap.from(split[target], {
        ...vars,
        paused: !!startEvent,
      });

      if (!startEvent) return () => split.revert();

      const onStart = () => tween.play();
      globalThis.addEventListener(startEvent, onStart, { once: true });
      return () => {
        globalThis.removeEventListener(startEvent, onStart);
        split.revert();
      };
    },
    { dependencies: [reduced] },
  );

  return ref;
}
