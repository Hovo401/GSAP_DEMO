import { useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { gsap } from "../../lib/gsap";
import { cardScale } from "./utils";
import type { Project } from "./types";

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
  const panelRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLButtonElement>(null);
  const closingRef = useRef(false);

  const close = () => {
    const panel = panelRef.current;
    const inner = innerRef.current;
    const backdrop = backdropRef.current;
    if (
      reduced ||
      !panel ||
      !inner ||
      !backdrop ||
      !sourceEl ||
      closingRef.current
    ) {
      onClose();
      return;
    }
    closingRef.current = true;
    const to = cardScale(sourceEl);
    gsap
      .timeline({ onComplete: onClose })
      .to(inner, { autoAlpha: 0, duration: 0.2, ease: "power2.in" }, 0)
      .to(
        panel,
        {
          x: to.x,
          y: to.y,
          scaleX: to.scaleX,
          scaleY: to.scaleY,
          borderRadius: 24,
          duration: 0.5,
          ease: "power3.inOut",
        },
        0.08,
      )
      .to(backdrop, { opacity: 0, duration: 0.45, ease: "power2.in" }, 0.12);
  };

  // Point the Escape handler at the latest close without re-running the effect.
  const closeRef = useRef(close);
  closeRef.current = close;

  useLayoutEffect(() => {
    const panel = panelRef.current;
    const inner = innerRef.current;
    const backdrop = backdropRef.current;
    if (!panel || !inner || !backdrop) return;

    // Freeze background scroll so the morph target stays put.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Escape closes the case — standard modal affordance.
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeRef.current();
    };
    globalThis.addEventListener("keydown", onKey);

    let tl: gsap.core.Timeline | undefined;

    if (reduced || !sourceEl) {
      gsap.set(backdrop, { opacity: 1 });
      gsap.set(inner, { autoAlpha: 1 });
    } else {
      const from = cardScale(sourceEl);
      // Panel grows from the card as a solid block; content is hidden until it
      // reaches full size, so nothing ever overflows mid-morph.
      gsap.set(panel, {
        transformOrigin: "top left",
        x: from.x,
        y: from.y,
        scaleX: from.scaleX,
        scaleY: from.scaleY,
        borderRadius: 24,
      });
      gsap.set(inner, { autoAlpha: 0 });
      gsap.set(backdrop, { opacity: 0 });

      const reveal = inner.querySelectorAll(".case-stagger");
      tl = gsap.timeline();
      tl.to(backdrop, { opacity: 1, duration: 0.4, ease: "power2.out" }, 0)
        .to(
          panel,
          {
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
            borderRadius: 0,
            duration: 0.6,
            ease: "power3.inOut",
          },
          0,
        )
        .to(inner, { autoAlpha: 1, duration: 0.3, ease: "power2.out" }, 0.42)
        .from(
          reveal,
          {
            y: 30,
            opacity: 0,
            stagger: 0.07,
            duration: 0.55,
            ease: "power3.out",
          },
          0.46,
        );
    }

    return () => {
      globalThis.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      tl?.kill();
    };
  }, [reduced, sourceEl]);

  const dark = Number(item.no) % 2 === 0;

  return createPortal(
    <div className="fixed inset-0 z-[90]">
      <button
        type="button"
        ref={backdropRef}
        aria-label="Close case study"
        onClick={close}
        className="absolute inset-0 cursor-pointer bg-ink/70 backdrop-blur-sm"
      />
      <div
        ref={panelRef}
        className={`absolute inset-0 overflow-hidden ${
          dark ? "bg-ink text-paper" : "bg-flame text-paper"
        }`}
      >
        <div
          ref={innerRef}
          className="relative flex h-full flex-col justify-between p-8 md:p-16"
        >
          <span className="font-display pointer-events-none absolute -bottom-16 -left-4 text-[40vw] leading-none opacity-[0.06] select-none md:text-[26vw]">
            {item.no}
          </span>

          <div className="case-stagger relative flex items-start justify-between">
            <span className="inline-block rounded-full border border-current/25 px-4 py-1.5 text-xs font-medium tracking-[0.25em] uppercase opacity-80">
              {item.tag}
            </span>
            <button
              type="button"
              data-magnetic
              onClick={close}
              className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-current/30 text-xl transition-colors hover:bg-current/10"
              aria-label="Close case study"
            >
              ✕
            </button>
          </div>

          <div className="relative max-w-4xl">
            <p className="case-stagger text-base font-medium opacity-60">
              ({item.no})
            </p>
            <h3 className="case-stagger font-display mt-2 text-[18vw] leading-[0.85] uppercase md:text-[10vw]">
              {item.title}
            </h3>
            <p className="case-stagger mt-8 max-w-2xl text-lg leading-relaxed opacity-80 md:text-2xl">
              {item.body}
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
