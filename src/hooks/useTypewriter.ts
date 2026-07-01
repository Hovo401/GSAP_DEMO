import { useRef } from "react";
import { gsap, useGSAP } from "../lib/gsap";
import { TextPlugin } from "gsap/TextPlugin";
import { useReducedMotion } from "./useReducedMotion";
import { SCROLL_START } from "../lib/motion";

gsap.registerPlugin(TextPlugin);

const CHARS_PER_SECOND = 65;

export function useTypewriter<T extends HTMLElement = HTMLParagraphElement>(
  text: string,
) {
  const ref = useRef<T>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (reduced || !el) return;

      el.textContent = "";
      gsap.to(el, {
        duration: text.length / CHARS_PER_SECOND,
        ease: "none",
        text,
        scrollTrigger: { trigger: el, start: SCROLL_START.base, once: true },
      });
    },
    { dependencies: [reduced, text] },
  );

  return ref;
}
