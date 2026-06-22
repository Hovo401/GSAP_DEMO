import { useRef } from "react";
import { gsap, useGSAP } from "../lib/gsap";
import { useReducedMotion } from "./useReducedMotion";
import { SCROLL_START } from "../lib/motion";

export function useScramble<T extends HTMLElement = HTMLHeadingElement>(
  text: string,
) {
  const ref = useRef<T>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (reduced || !el) return;

      gsap.to(el, {
        duration: 1.1,
        ease: "none",
        scrambleText: {
          text,
          chars: "upperCase",
          revealDelay: 0.3,
          speed: 0.6,
        },
        scrollTrigger: { trigger: el, start: SCROLL_START.base, once: true },
      });
    },
    { dependencies: [reduced, text] },
  );

  return ref;
}
