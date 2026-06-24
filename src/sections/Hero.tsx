import { useRef } from "react";
import { gsap, useGSAP } from "../lib/gsap";
import { hero, brand } from "../content/site";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useSplitReveal } from "../hooks/useSplitReveal";
import { DURATION, EASE, STAGGER } from "../lib/motion";

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const titleWrapRef = useRef<HTMLDivElement>(null);
  const kickerWrapRef = useRef<HTMLDivElement>(null);
  const subtitleWrapRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const glowARef = useRef<HTMLDivElement>(null);
  const glowBRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const titleRef = useSplitReveal<HTMLHeadingElement>(
    "lines,words",
    "words",
    {
      yPercent: 120,
      opacity: 0,
      duration: DURATION.slower,
      ease: EASE.strongOut,
      stagger: STAGGER.tight,
      delay: 0.15,
    },
    { startEvent: "app:preload-done" },
  );

  useGSAP(
    () => {
      if (reduced || !contentRef.current) return;

      const metaReveal = gsap.from(".hero-meta", {
        opacity: 0,
        duration: DURATION.slower,
        ease: EASE.softOut,
        stagger: STAGGER.base,
        delay: 0.2,
        paused: true,
      });

      const fadeReveal = gsap.from(".hero-fade", {
        y: 24,
        opacity: 0,
        duration: DURATION.slow,
        ease: EASE.out,
        stagger: STAGGER.loose,
        delay: 0.5,
        paused: true,
      });

      const glowLoop = gsap.to(".hero-glow", {
        scale: 1.18,
        opacity: 0.85,
        duration: 5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 1.4,
        paused: true,
      });

      const spotlightLoop = gsap.to(spotlightRef.current, {
        filter: "hue-rotate(25deg)",
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        paused: true,
      });

      gsap.to(contentRef.current, {
        yPercent: -18,
        scale: 0.92,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          pin: true,
          scrub: true,
        },
      });

      gsap.set(spotlightRef.current, { xPercent: -50, yPercent: -50 });
      gsap.set(hintRef.current, { xPercent: -50 });

      const hintLoop = gsap.to(hintRef.current, {
        y: 10,
        repeat: -1,
        yoyo: true,
        duration: 1,
        ease: "sine.inOut",
        paused: true,
      });

      const revealHero = () => {
        metaReveal.play();
        fadeReveal.play();
        glowLoop.play();
        spotlightLoop.play();
        hintLoop.play();
      };
      window.addEventListener("app:preload-done", revealHero, {
        once: true,
      });
      const cleanups = [
        () => window.removeEventListener("app:preload-done", revealHero),
      ];

      if (!window.matchMedia("(pointer: fine)").matches) {
        return () => cleanups.forEach((fn) => fn());
      }

      const quickToOpts = { duration: DURATION.medium, ease: "power3" };
      const gridX = gsap.quickTo(gridRef.current, "x", quickToOpts);
      const gridY = gsap.quickTo(gridRef.current, "y", quickToOpts);
      const glowAX = gsap.quickTo(glowARef.current, "x", quickToOpts);
      const glowAY = gsap.quickTo(glowARef.current, "y", quickToOpts);
      const glowBX = gsap.quickTo(glowBRef.current, "x", quickToOpts);
      const glowBY = gsap.quickTo(glowBRef.current, "y", quickToOpts);
      const tiltX = gsap.quickTo(tiltRef.current, "rotateX", quickToOpts);
      const tiltY = gsap.quickTo(tiltRef.current, "rotateY", quickToOpts);
      const titleX = gsap.quickTo(titleWrapRef.current, "x", quickToOpts);
      const titleY = gsap.quickTo(titleWrapRef.current, "y", quickToOpts);
      const kickerX = gsap.quickTo(kickerWrapRef.current, "x", quickToOpts);
      const kickerY = gsap.quickTo(kickerWrapRef.current, "y", quickToOpts);
      const subtitleX = gsap.quickTo(subtitleWrapRef.current, "x", quickToOpts);
      const subtitleY = gsap.quickTo(subtitleWrapRef.current, "y", quickToOpts);
      const hintX = gsap.quickTo(hintRef.current, "x", quickToOpts);
      const spotlightX = gsap.quickTo(spotlightRef.current, "x", {
        duration: 0.5,
        ease: "power3",
      });
      const spotlightY = gsap.quickTo(spotlightRef.current, "y", {
        duration: 0.5,
        ease: "power3",
      });
      const metaSetters = Array.from(
        root.current!.querySelectorAll<HTMLElement>(".hero-meta"),
      ).map((el, i) => {
        const sign = i % 2 === 0 ? 1 : -1;
        return {
          x: gsap.quickTo(el, "x", quickToOpts),
          y: gsap.quickTo(el, "y", quickToOpts),
          sign,
        };
      });

      let lastX = 0;
      let lastY = 0;
      let rect = root.current!.getBoundingClientRect();
      const remeasure = () => {
        rect = root.current!.getBoundingClientRect();
      };
      window.addEventListener("resize", remeasure);
      window.addEventListener("scroll", remeasure, { passive: true });

      const onPointerMove = (e: PointerEvent) => {
        const nx = gsap.utils.clamp(
          -1,
          1,
          (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2),
        );
        const ny = gsap.utils.clamp(
          -1,
          1,
          (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2),
        );

        const speed = Math.hypot(e.clientX - lastX, e.clientY - lastY);
        lastX = e.clientX;
        lastY = e.clientY;
        const boost = gsap.utils.clamp(1, 1.7, 1 + speed / 35);

        gridX(nx * -32);
        gridY(ny * -32);
        glowAX(nx * -60 * boost);
        glowAY(ny * -46 * boost);
        glowBX(nx * -52 * boost);
        glowBY(ny * -64 * boost);
        tiltY(nx * 8);
        tiltX(ny * -8);
        titleX(nx * 26);
        titleY(ny * 18);
        kickerX(nx * 16);
        kickerY(ny * 10);
        subtitleX(nx * 14);
        subtitleY(ny * 10);
        hintX(nx * 10);
        spotlightX(e.clientX - (rect.left + rect.width / 2));
        spotlightY(e.clientY - (rect.top + rect.height / 2));
        metaSetters.forEach(({ x, y, sign }) => {
          x(nx * 12 * sign);
          y(ny * 12 * sign);
        });
      };

      window.addEventListener("pointermove", onPointerMove);
      return () => {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("resize", remeasure);
        window.removeEventListener("scroll", remeasure);
        cleanups.forEach((fn) => fn());
      };
    },
    { scope: root, dependencies: [reduced] },
  );

  const renderTitle = () =>
    hero.titleLines.map((line) => (
      <span key={line} className="block overflow-hidden">
        <span
          className={line === hero.accentWord ? "text-flame" : "text-paper"}
        >
          {line}
        </span>
      </span>
    ));

  return (
    <section
      ref={root}
      id="home"
      className="relative flex h-screen items-center justify-center overflow-hidden bg-ink px-6"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          ref={glowARef}
          className="hero-glow glow absolute top-1/4 left-1/4 h-[40vw] w-[40vw] opacity-50 will-change-transform"
        />
        <div
          ref={glowBRef}
          className="hero-glow glow absolute right-1/4 bottom-1/4 h-[32vw] w-[32vw] opacity-40 will-change-transform"
        />
      </div>

      <div
        ref={gridRef}
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-paper) 1px, transparent 1px), linear-gradient(90deg, var(--color-paper) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 80%)",
        }}
      />

      <div
        ref={spotlightRef}
        className="pointer-events-none absolute top-1/2 left-1/2 h-[40vw] w-[40vw] rounded-full will-change-transform"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--color-flame) 35%, transparent) 0%, transparent 60%)",
          mixBlendMode: "screen",
          filter: "hue-rotate(0deg)",
        }}
      />

      <span className="hero-meta absolute top-24 left-6 hidden text-xs font-medium tracking-[0.3em] text-paper/35 uppercase md:block md:left-10">
        Est. 2026
      </span>
      <span className="hero-meta absolute top-24 right-6 hidden text-right text-xs font-medium tracking-[0.3em] text-paper/35 uppercase md:block md:right-10">
        v1.0 / GSAP
      </span>
      <span className="hero-meta absolute bottom-10 left-6 hidden text-xs font-medium tracking-[0.3em] text-paper/35 uppercase md:block md:left-10">
        40°N — 44°E
      </span>

      <div
        ref={contentRef}
        className="relative text-center"
        style={{ perspective: "1200px" }}
      >
        <div ref={tiltRef} className="will-change-transform">
          <div ref={kickerWrapRef} className="will-change-transform">
            <p className="hero-fade mb-6 flex items-center justify-center gap-3 text-sm font-medium tracking-[0.4em] text-flame uppercase">
              <span className="h-px w-8 bg-flame/60" />
              {brand.name} — {hero.kicker}
              <span className="h-px w-8 bg-flame/60" />
            </p>
          </div>
          <div ref={titleWrapRef} className="will-change-transform">
            <h1
              ref={titleRef}
              className="font-display text-[20vw] leading-[0.85] tracking-tight uppercase md:text-[16vw]"
            >
              {renderTitle()}
            </h1>
          </div>
          <div ref={subtitleWrapRef} className="will-change-transform">
            <p className="hero-fade mx-auto mt-8 max-w-xl text-lg font-light text-paper/60 md:text-2xl">
              {hero.subtitle}
            </p>
          </div>
        </div>
      </div>

      <div
        ref={hintRef}
        className="absolute bottom-10 left-1/2 flex flex-col items-center gap-2 text-xs font-medium tracking-[0.3em] text-paper/40 uppercase"
      >
        {hero.scrollHint}
        <span className="text-flame">↓</span>
      </div>
    </section>
  );
}
