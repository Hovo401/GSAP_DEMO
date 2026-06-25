import { useRef } from "react";
import { createPortal } from "react-dom";
import { Flip, gsap, useGSAP } from "../../lib/gsap";
import { DURATION, EASE, STAGGER } from "../../lib/motion";
import type { Project } from "./types";

const FLIP_EASE = "power3.inOut";

function isOnscreen(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  return (
    r.width > 0 &&
    r.height > 0 &&
    r.bottom > 0 &&
    r.right > 0 &&
    r.top < globalThis.innerHeight &&
    r.left < globalThis.innerWidth
  );
}

export function CaseOverlay({
  item,
  sourceEl,
  reduced,
  onClose,
}: {
  item: Project;
  sourceEl: HTMLElement | null;
  reduced: boolean;
  onClose: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef(false);

  const fadeOutClose = () => {
    const backdrop = backdropRef.current;
    const panel = panelRef.current;
    if (reduced || !backdrop || !panel) {
      onClose();
      return;
    }
    gsap
      .timeline({ onComplete: onClose })
      .to(panel, { autoAlpha: 0, y: 24, scale: 0.97, duration: DURATION.fast, ease: EASE.in })
      .to(backdrop, { opacity: 0, duration: DURATION.fast }, 0);
  };

  const close = () => {
    const backdrop = backdropRef.current;
    const panel = panelRef.current;
    if (closingRef.current) return;
    closingRef.current = true;

    if (reduced || !backdrop || !panel || !sourceEl || !isOnscreen(sourceEl)) {
      fadeOutClose();
      return;
    }

    gsap.to(panel.querySelectorAll(".case-stagger"), {
      opacity: 0,
      y: 12,
      duration: DURATION.fast / 2,
      ease: EASE.in,
    });
    gsap.to(backdrop, { opacity: 0, duration: DURATION.base, ease: EASE.in });

    const state = Flip.getState(panel, { props: "borderRadius" });
    Flip.fit(panel, sourceEl, { scale: true, props: "borderRadius" });
    Flip.from(state, {
      duration: DURATION.base,
      ease: FLIP_EASE,
      scale: true,
      props: "borderRadius",
      onComplete: () => {
        gsap.set(sourceEl, { autoAlpha: 1 });
        onClose();
      },
    });
  };

  const closeRef = useRef(close);
  closeRef.current = close;

  useGSAP(
    () => {
      const backdrop = backdropRef.current;
      const panel = panelRef.current;
      if (!backdrop || !panel) return;

      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") closeRef.current();
      };
      globalThis.addEventListener("keydown", onKey);

      const reveal = panel.querySelectorAll(".case-stagger");

      if (reduced || !sourceEl || !isOnscreen(sourceEl)) {
        gsap.set(backdrop, { opacity: 1 });
        gsap.set(reveal, { opacity: 1, y: 0 });
      } else {
        gsap.set(reveal, { opacity: 0, y: 20 });

        Flip.fit(panel, sourceEl, { scale: true, props: "borderRadius" });
        const state = Flip.getState(panel, { props: "borderRadius" });
        gsap.set(panel, { clearProps: "all" });
        gsap.set(sourceEl, { autoAlpha: 0 });

        gsap.to(backdrop, { opacity: 1, duration: DURATION.base, ease: EASE.softOut });
        Flip.from(state, {
          duration: DURATION.slow,
          ease: FLIP_EASE,
          scale: true,
          props: "borderRadius",
        });
        gsap.to(reveal, {
          opacity: 1,
          y: 0,
          stagger: STAGGER.tight,
          duration: DURATION.fast,
          ease: EASE.out,
          delay: DURATION.slow * 0.55,
        });
      }

      return () => {
        globalThis.removeEventListener("keydown", onKey);
        document.body.style.overflow = prevOverflow;
        if (sourceEl) gsap.set(sourceEl, { autoAlpha: 1 });
      };
    },
    { scope: rootRef, dependencies: [reduced, sourceEl] },
  );

  return createPortal(
    <div ref={rootRef} className="fixed inset-0 z-90">
      <button
        type="button"
        ref={backdropRef}
        aria-label="Close case study"
        onClick={close}
        className="absolute inset-0 cursor-pointer bg-ink/80 backdrop-blur-md"
      />

      <div
        ref={panelRef}
        className="absolute inset-0 overflow-y-auto bg-[#161616] p-8 text-paper md:p-14"
      >
        <span className="font-display pointer-events-none absolute -bottom-16 -left-4 text-[40vw] leading-none text-flame/6 select-none md:text-[26vw]">
          {item.no}
        </span>

        <div className="case-stagger relative flex items-start justify-between gap-4">
          <span className="inline-block rounded-full border border-paper/20 px-4 py-1.5 text-xs font-medium tracking-[0.25em] text-paper/70 uppercase">
            {item.tag}
          </span>
          <button
            type="button"
            data-magnetic
            onClick={close}
            aria-label="Close case study"
            className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-paper/20 text-lg transition-colors hover:bg-paper/10"
          >
            ✕
          </button>
        </div>

        <p className="case-stagger relative mt-12 text-sm font-medium text-paper/40 md:mt-20">
          ({item.no})
        </p>
        <h3 className="case-stagger font-display relative mt-2 text-[clamp(2.5rem,9vw,8rem)] leading-[0.9] text-flame uppercase">
          {item.title}
        </h3>
        <p className="case-stagger relative mt-8 max-w-xl text-lg leading-relaxed text-paper/65 md:text-xl">
          {item.body}
        </p>
      </div>
    </div>,
    document.body,
  );
}
