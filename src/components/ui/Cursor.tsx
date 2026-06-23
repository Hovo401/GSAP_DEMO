import { useRef, useState, useEffect } from "react";
import { gsap, useGSAP } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import VisitBadge from "./VisitBadge";

export default function Cursor() {
  const reduced = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [onCard, setOnCard] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const mq = window.matchMedia("(pointer: fine)");
    setEnabled(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setEnabled(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [reduced]);

  useEffect(() => {
    document.documentElement.classList.toggle("custom-cursor-active", enabled);
    return () => document.documentElement.classList.remove("custom-cursor-active");
  }, [enabled]);

  useGSAP(
    () => {
      const wrap = wrapRef.current;
      const dot = dotRef.current;
      const badge = badgeRef.current;
      if (!enabled || !wrap || !dot || !badge) return;

      gsap.set(wrap, { xPercent: -50, yPercent: -50 });
      gsap.set(badge, { scale: 0, autoAlpha: 0 });
      const xTo = gsap.quickTo(wrap, "x", { duration: 0.45, ease: "power3" });
      const yTo = gsap.quickTo(wrap, "y", { duration: 0.45, ease: "power3" });

      let magnet: HTMLElement | null = null;

      const setCursorState = (state: "card" | "target" | "default" | "hidden") => {
        if (state === "hidden") {
          gsap.to([dot, badge], {
            scale: 0,
            autoAlpha: 0,
            duration: 0.25,
            ease: "power3.out",
          });
          return;
        }
        if (state === "card") {
          gsap.to(dot, {
            scale: 0,
            autoAlpha: 0,
            duration: 0.25,
            ease: "power3.out",
          });
          gsap.to(badge, {
            scale: 1,
            autoAlpha: 1,
            duration: 0.35,
            ease: "back.out(1.6)",
          });
          return;
        }
        gsap.to(badge, {
          scale: 0,
          autoAlpha: 0,
          duration: 0.25,
          ease: "power3.out",
        });
        gsap.to(dot, {
          scale: state === "target" ? 1.8 : 1,
          autoAlpha: 1,
          duration: 0.3,
          ease: "power3.out",
        });
      };

      const onMove = (e: PointerEvent) => {
        if (magnet) {
          const r = magnet.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          xTo(cx + (e.clientX - cx) * 0.25);
          yTo(cy + (e.clientY - cy) * 0.25);
        } else {
          xTo(e.clientX);
          yTo(e.clientY);
        }
      };

      const onOver = (e: PointerEvent) => {
        const target = (e.target as HTMLElement)?.closest<HTMLElement>(
          "[data-magnetic], a, button",
        );
        const card = (e.target as HTMLElement)?.closest(".showcase-card");
        const studioNode = (e.target as HTMLElement)?.closest(".studio-stage");
        if (studioNode) {
          setOnCard(false);
          magnet = null;
          setCursorState("hidden");
        } else if (card) {
          setOnCard(true);
          magnet = null;
          setCursorState("card");
        } else if (target) {
          setOnCard(false);
          const r = target.getBoundingClientRect();
          const oversized =
            r.width > globalThis.innerWidth * 0.6 ||
            r.height > globalThis.innerHeight * 0.6;
          magnet = oversized ? null : target;
          setCursorState("target");
        } else {
          setOnCard(false);
          magnet = null;
          setCursorState("default");
        }
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerover", onOver);
      return () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerover", onOver);
      };
    },
    { dependencies: [enabled] },
  );

  if (!enabled) return null;

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-200 flex items-center justify-center"
    >
      <div
        ref={dotRef}
        className="absolute h-8 w-8 rounded-full backdrop-invert"
      />
      <div ref={badgeRef} className="absolute">
        {onCard && <VisitBadge />}
      </div>
    </div>
  );
}
