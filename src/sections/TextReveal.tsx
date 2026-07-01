import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { gsap, SplitText, useGSAP } from "../lib/gsap";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { EASE } from "../lib/motion";

export default function TextReveal() {
  const { t } = useTranslation();
  const root = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !textRef.current) return;

      const split = new SplitText(textRef.current, { type: "chars", tag: "span" });

      gsap.fromTo(
        split.chars,
        { opacity: 0.15 },
        {
          opacity: 1,
          duration: 0.18,
          ease: EASE.none,
          stagger: 0.025,
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=120%",
            pin: true,
            scrub: true,
          },
        },
      );

      return () => split.revert();
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section
      id="manifesto"
      ref={root}
      className="flex min-h-screen items-center justify-center bg-paper px-6 py-24 text-ink"
    >
      <p
        ref={textRef}
        className="max-w-5xl text-3xl leading-[1.15] font-bold tracking-tight md:text-6xl"
      >
        {t("manifesto")}
      </p>
    </section>
  );
}
