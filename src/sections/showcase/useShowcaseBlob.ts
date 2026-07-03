import type { RefObject } from "react";
import { gsap, ScrollTrigger, useGSAP } from "../../lib/gsap";
import { EASE } from "../../lib/motion";

type BlobRefs = {
  carrier: RefObject<HTMLDivElement | null>;
  leadFill: RefObject<HTMLDivElement | null>;
  droplets: RefObject<(HTMLDivElement | null)[]>;
  sparks: RefObject<(HTMLDivElement | null)[]>;
};

const PALETTE = ["#f55438", "#38e0d0", "#9b5cf6", "#c6f553"];

const BOUNCE_PX = 150;
const END_RUSH = 0.7;

type Kind = "start" | "card" | "end";
type Target = { cx: number; topY: number; p: number; kind: Kind };

export function useShowcaseBlob(
  root: RefObject<HTMLElement | null>,
  track: RefObject<HTMLDivElement | null>,
  blobs: BlobRefs,
  reduced: boolean,
) {
  useGSAP(
    () => {
      const trackEl = track.current;
      const carrier = blobs.carrier.current;
      const leadFill = blobs.leadFill.current;
      const droplets = (blobs.droplets.current ?? []).filter(
        (el): el is HTMLDivElement => el !== null,
      );
      const sparks = (blobs.sparks.current ?? []).filter(
        (el): el is HTMLDivElement => el !== null,
      );
      const goodEnoughWebKit =
        typeof CSS !== "undefined" &&
        CSS.supports?.("overflow", "clip") !== false;
      if (reduced || !goodEnoughWebKit || !trackEl || !carrier || !leadFill)
        return;

      const fills = [leadFill, ...droplets];

      const distance = () => trackEl.scrollWidth - window.innerWidth;

      const offsetIn = (el: HTMLElement) => {
        let x = 0;
        let y = 0;
        let node: HTMLElement | null = el;
        while (node && node !== trackEl) {
          x += node.offsetLeft;
          y += node.offsetTop;
          node = node.offsetParent as HTMLElement | null;
        }
        return { x, y };
      };

      const compute = () => {
        const dist = distance();
        const half = window.innerWidth / 2;
        const headerEl = document.querySelector("header");
        const safeTop = (headerEl?.getBoundingClientRect().bottom ?? 76) + 16;
        const bounce = Math.min(BOUNCE_PX, window.innerHeight * 0.16);

        const at = (cx: number, kind: Kind): number => {
          if (kind === "start") return 0;
          if (kind === "end") return 1;
          return gsap.utils.clamp(0.04, 0.96, (cx - half) / dist);
        };

        const targets: Target[] = [];

        const startEl = trackEl.querySelector<HTMLElement>("[data-blob-start]");
        if (startEl) {
          const o = offsetIn(startEl);
          const cx = o.x + startEl.offsetWidth * 0.32;
          targets.push({ cx, topY: o.y, p: 0, kind: "start" });
        }

        trackEl
          .querySelectorAll<HTMLElement>(".showcase-card")
          .forEach((card) => {
            const btn = card.querySelector<HTMLElement>("[data-magnetic]");
            if (!btn) return;
            const o = offsetIn(btn);
            const cx = o.x + btn.offsetWidth / 2;
            targets.push({ cx, topY: o.y, p: at(cx, "card"), kind: "card" });
          });

        const endEl = trackEl.querySelector<HTMLElement>("[data-blob-end]");
        if (endEl) {
          const o = offsetIn(endEl);
          const cx = o.x + endEl.offsetWidth / 2;
          targets.push({ cx, topY: o.y, p: 1, kind: "end" });
        }

        return { targets, safeTop, bounce };
      };

      const restY = (t: Target, radius: number) =>
        t.topY - radius - (t.kind === "card" ? 2 : 10);
      const apexY = (
        t: Target,
        radius: number,
        bounce: number,
        safeTop: number,
      ) => Math.max(restY(t, radius) - bounce, safeTop + radius);

      const buildJourney = (
        targets: Target[],
        bounce: number,
        safeTop: number,
      ) => {
        const radius = carrier.offsetHeight / 2;
        const first = targets[0];

        tl.set(
          carrier,
          {
            xPercent: -50,
            yPercent: -50,
            transformOrigin: "50% 100%",
            x: first.cx,
            y: restY(first, radius),
            scaleX: 0,
            scaleY: 0,
            "--goo-glow": PALETTE[0],
          },
          0,
        );
        tl.set(fills, { backgroundColor: PALETTE[0] }, 0);

        const emerge = Math.min(0.05, (targets[1]?.p ?? 0.1) * 0.6);
        tl.to(
          carrier,
          { scaleX: 1, scaleY: 1, duration: emerge, ease: "back.out(1.8)" },
          0,
        );

        let fadeAt = 1 + emerge;

        for (let i = 1; i < targets.length; i++) {
          const prev = targets[i - 1];
          const t = targets[i];
          const start = prev.p;
          const land = t.p;
          const isEnd = t.kind === "end";
          const dur = Math.max((land - start) * (isEnd ? END_RUSH : 1), 0.001);
          const finish = start + dur;
          const color = PALETTE[i % PALETTE.length];

          tl.to(carrier, { x: t.cx, duration: dur, ease: EASE.none }, start);
          tl.to(
            carrier,
            {
              y: apexY(t, radius, bounce, safeTop),
              duration: dur * 0.5,
              ease: EASE.softOut,
            },
            start,
          );
          tl.to(
            carrier,
            { y: restY(t, radius), duration: dur * 0.5, ease: EASE.in },
            start + dur * 0.5,
          );

          tl.to(
            carrier,
            {
              scaleX: 0.88,
              scaleY: 1.16,
              duration: dur * 0.4,
              ease: EASE.softOut,
            },
            start,
          );

          tl.to(
            fills,
            { backgroundColor: color, duration: dur * 0.4 },
            finish - dur * 0.25,
          );
          tl.set(carrier, { "--goo-glow": color }, finish - dur * 0.1);

          if (t.kind === "card") {
            tl.to(
              carrier,
              {
                scaleX: 1.32,
                scaleY: 0.62,
                duration: dur * 0.14,
                ease: EASE.in,
              },
              land - dur * 0.14,
            );
            tl.to(
              carrier,
              {
                scaleX: 1,
                scaleY: 1,
                duration: dur * 0.3,
                ease: "elastic.out(1, 0.45)",
              },
              land,
            );
          } else if (t.kind === "end") {
            const settle = dur * 0.55;
            const squishAt = finish - settle;
            const squishDur = settle * 0.18;
            const recoverDur = settle * 0.42;
            fadeAt = squishAt + squishDur + recoverDur;
            tl.to(
              carrier,
              { scaleX: 1.4, scaleY: 0.7, duration: squishDur, ease: EASE.in },
              squishAt,
            );
            tl.to(
              carrier,
              {
                scaleX: 1,
                scaleY: 1,
                duration: recoverDur,
                ease: "elastic.out(1, 0.5)",
              },
              squishAt + squishDur,
            );
            tl.to(
              carrier,
              {
                scaleX: 0,
                scaleY: 0,
                duration: finish - fadeAt,
                ease: "back.in(1.8)",
              },
              fadeAt,
            );
          }
        }

        return fadeAt;
      };

      const buildSpark = (
        spark: HTMLDivElement,
        targets: Target[],
        idx: number,
        bounce: number,
        safeTop: number,
        fadeAt: number,
      ) => {
        const radius = spark.offsetHeight / 2;
        const gap = 46 + idx * 26;
        const lag = 0.04 + idx * 0.03;
        const sparkBounce = bounce * (0.85 + idx * 0.18);
        const first = targets[0];
        const sRest = (t: Target) => t.topY - radius - gap;
        const sApex = (t: Target) =>
          Math.max(sRest(t) - sparkBounce, safeTop + radius);

        tl.set(
          spark,
          {
            xPercent: -50,
            yPercent: -50,
            x: first.cx,
            y: sRest(first),
            scale: 0,
            backgroundColor: PALETTE[(idx + 1) % PALETTE.length],
            color: PALETTE[(idx + 1) % PALETTE.length],
          },
          0,
        );
        const restScale = 1.35 - idx * 0.32;
        tl.to(
          spark,
          { scale: restScale, duration: 0.05, ease: "back.out(2)" },
          lag,
        );

        for (let i = 1; i < targets.length; i++) {
          const prev = targets[i - 1];
          const t = targets[i];
          const start = gsap.utils.clamp(0, 1, prev.p + lag);
          const land = gsap.utils.clamp(0, 1, t.p + lag);
          const dur = Math.max(land - start, 0.001);
          const color = PALETTE[(i + idx + 1) % PALETTE.length];

          tl.to(spark, { x: t.cx, duration: dur, ease: EASE.none }, start);
          tl.to(
            spark,
            { y: sApex(t), duration: dur * 0.5, ease: EASE.softOut },
            start,
          );
          tl.to(
            spark,
            { y: sRest(t), duration: dur * 0.5, ease: EASE.in },
            start + dur * 0.5,
          );
          tl.to(
            spark,
            { backgroundColor: color, color, duration: dur * 0.4 },
            land - dur * 0.2,
          );
        }

        tl.to(
          spark,
          { scale: 0, duration: 1 - fadeAt, ease: "back.in(1.8)" },
          fadeAt,
        );
      };

      const tl = gsap.timeline({ paused: true });

      const build = () => {
        tl.clear();
        const { targets, safeTop, bounce } = compute();
        if (targets.length < 2) return;
        const fadeAt = buildJourney(targets, bounce, safeTop);
        sparks.forEach((spark, i) =>
          buildSpark(spark, targets, i, bounce, safeTop, fadeAt),
        );
      };

      build();

      ScrollTrigger.create({
        animation: tl,
        trigger: root.current,
        start: "top top",
        end: () => "+=" + distance(),
        scrub: 1.5,
        onRefresh: build,
      });

      // Continuous liquid life — scroll-independent, only local offsets/shape
      // (never the carrier's journey x/y or squash), so the cluster stays alive
      // when scroll stops and droplets drift in/out of the lead to merge/split.
      gsap.to(leadFill, {
        borderRadius: "58% 42% 39% 61% / 47% 56% 44% 53%",
        duration: 3.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
      gsap.to(leadFill, {
        scale: 1.06,
        duration: 2.4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      droplets.forEach((drop, i) => {
        const orbit = carrier.offsetHeight * (0.42 + i * 0.18);
        gsap.set(drop, { xPercent: -50, yPercent: -50 });
        gsap.fromTo(
          drop,
          { x: -orbit },
          {
            x: orbit,
            duration: 1.6 + i * 0.5,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          },
        );
        gsap.fromTo(
          drop,
          { y: orbit * 0.5 },
          {
            y: -orbit * 0.4,
            duration: 2.1 + i * 0.6,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          },
        );
      });
    },
    { scope: root, dependencies: [reduced] },
  );
}
