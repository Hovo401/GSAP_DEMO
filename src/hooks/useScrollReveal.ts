import type { RefObject } from "react";
import { gsap, useGSAP } from "../lib/gsap";
import { useReducedMotion } from "./useReducedMotion";
import { DURATION, EASE, STAGGER, REVEAL_Y, SCROLL_START } from "../lib/motion";

type RevealTrigger = string | Element | RefObject<Element | null>;

type ScrollRevealOptions = gsap.TweenVars & {
  trigger?: RevealTrigger;
  start?: string;
};

const BASE_VARS: gsap.TweenVars = {
  opacity: 0,
  duration: DURATION.base,
  ease: EASE.out,
  stagger: STAGGER.base,
};

function resolveTrigger(trigger: RevealTrigger | undefined, fallback: string) {
  if (!trigger) return fallback;
  if (typeof trigger === "string") return trigger;
  return "current" in trigger ? trigger.current : trigger;
}

export function useScrollReveal(
  scope: RefObject<Element | null>,
  selector: string,
  options: ScrollRevealOptions = {},
) {
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;

      const { trigger, start = SCROLL_START.base, ...vars } = options;
      const offset =
        vars.yPercent === undefined && vars.y === undefined
          ? { y: REVEAL_Y }
          : {};

      gsap.from(selector, {
        ...BASE_VARS,
        ...offset,
        ...vars,
        scrollTrigger: {
          trigger: resolveTrigger(trigger, selector),
          start,
        },
      });
    },
    { scope, dependencies: [reduced] },
  );
}
