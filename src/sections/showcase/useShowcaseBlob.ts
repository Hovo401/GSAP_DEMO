import type { RefObject } from "react";
import { gsap, ScrollTrigger, useGSAP } from "../../lib/gsap";
import { EASE } from "../../lib/motion";

type BlobRefs = {
  lead: RefObject<HTMLDivElement | null>;
  satellites: RefObject<(HTMLDivElement | null)[]>;
};

const PALETTE = ["#f55438", "#38e0d0", "#9b5cf6", "#c6f553"];

const POINTS = 16;
const poly = (radiusAt: (i: number) => number) =>
  "polygon(" +
  Array.from({ length: POINTS }, (_, i) => {
    const a = (-90 + i * (360 / POINTS)) * (Math.PI / 180);
    const r = radiusAt(i);
    return `${(50 + r * Math.cos(a)).toFixed(1)}% ${(50 + r * Math.sin(a)).toFixed(1)}%`;
  }).join(", ") +
  ")";

const SHAPES = {
  blob: poly((i) => 45 + 4 * Math.sin((i / POINTS) * Math.PI * 6)),
  squircle: poly((i) => 38 + 7 * Math.cos(i * (Math.PI / 2))),
  star: poly((i) => (i % 2 === 0 ? 48 : 21)),
  hexagon: poly((i) => 42 + 5 * Math.cos(i * (Math.PI * 0.75))),
  diamond: poly((i) => 36 + 14 * Math.cos(i * (Math.PI / 2))),
};

const CARD_SHAPES = [SHAPES.blob, SHAPES.hexagon, SHAPES.squircle, SHAPES.star];

const BOUNCE_PX = 150;

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
      const lead = blobs.lead.current;
      const core = lead?.querySelector<HTMLElement>(".showcase-blob-shape") ?? null;
      const aura = lead?.querySelector<HTMLElement>(".showcase-blob-aura") ?? null;
      if (reduced || !trackEl || !lead || !core || !aura) return;

      const satellites = (blobs.satellites.current ?? []).filter(
        (el): el is HTMLDivElement => el !== null,
      );

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
        const safeTop =
          (headerEl?.getBoundingClientRect().bottom ?? 76) + 16;
        const bounce = Math.min(BOUNCE_PX, window.innerHeight * 0.16);

        const at = (cx: number, kind: Kind): number =>
          kind === "start" ? 0 : kind === "end" ? 1 : gsap.utils.clamp(0.04, 0.96, (cx - half) / dist);

        const targets: Target[] = [];

        const startEl = trackEl.querySelector<HTMLElement>("[data-blob-start]");
        if (startEl) {
          const o = offsetIn(startEl);
          const cx = o.x + startEl.offsetWidth * 0.32;
          targets.push({ cx, topY: o.y, p: 0, kind: "start" });
        }

        trackEl.querySelectorAll<HTMLElement>(".showcase-card").forEach((card) => {
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
      const apexY = (t: Target, radius: number, bounce: number, safeTop: number) =>
        Math.max(restY(t, radius) - bounce, safeTop + radius);

      const buildLead = (targets: Target[], bounce: number, safeTop: number) => {
        const radius = lead.offsetHeight / 2;
        const first = targets[0];

        tl.set(
          lead,
          {
            xPercent: -50,
            yPercent: -50,
            transformOrigin: "50% 100%",
            x: first.cx,
            y: restY(first, radius),
            scaleX: 0,
            scaleY: 0,
          },
          0,
        );
        tl.set(core, { clipPath: SHAPES.star, backgroundColor: PALETTE[0] }, 0);
        tl.set(aura, { color: PALETTE[0] }, 0);

        const emerge = Math.min(0.05, (targets[1]?.p ?? 0.1) * 0.6);
        tl.to(lead, { scaleX: 1, scaleY: 1, duration: emerge, ease: "back.out(1.8)" }, 0);
        tl.to(core, { clipPath: SHAPES.blob, duration: emerge * 1.6, ease: EASE.softOut }, 0);

        for (let i = 1; i < targets.length; i++) {
          const prev = targets[i - 1];
          const t = targets[i];
          const start = prev.p;
          const land = t.p;
          const dur = Math.max(land - start, 0.001);
          const color = PALETTE[i % PALETTE.length];

          tl.to(lead, { x: t.cx, duration: dur, ease: EASE.none }, start);
          tl.to(lead, { y: apexY(t, radius, bounce, safeTop), duration: dur * 0.5, ease: EASE.softOut }, start);
          tl.to(lead, { y: restY(t, radius), duration: dur * 0.5, ease: EASE.in }, start + dur * 0.5);

          const shape = t.kind === "end" ? SHAPES.diamond : CARD_SHAPES[i % CARD_SHAPES.length];
          tl.to(core, { clipPath: shape, duration: dur * 0.6, ease: "sine.inOut" }, start + dur * 0.2);
          tl.to(core, { backgroundColor: color, duration: dur * 0.4 }, land - dur * 0.2);
          tl.to(aura, { color, duration: dur * 0.4 }, land - dur * 0.2);

          if (t.kind === "card") {
            tl.to(lead, { scaleX: 1.3, scaleY: 0.64, duration: dur * 0.14, ease: EASE.in }, land - dur * 0.14);
            tl.to(lead, { scaleX: 1, scaleY: 1, duration: dur * 0.3, ease: "elastic.out(1, 0.45)" }, land);
          } else if (t.kind === "end") {
            tl.to(lead, { scaleX: 1.25, scaleY: 0.82, duration: dur * 0.12, ease: EASE.in }, land - dur * 0.12);
            tl.to(lead, { scaleX: 1, scaleY: 1, duration: dur * 0.32, ease: "elastic.out(1, 0.5)" }, land);
          }
        }
      };

      const buildSat = (sat: HTMLDivElement, targets: Target[], idx: number, bounce: number, safeTop: number) => {
        const radius = sat.offsetHeight / 2;
        const gap = 34 + idx * 22;
        const lag = 0.03 + idx * 0.025;
        const satBounce = bounce * (0.6 - idx * 0.12);
        const first = targets[0];
        const sRest = (t: Target) => t.topY - radius - gap;
        const sApex = (t: Target) => Math.max(sRest(t) - satBounce, safeTop + radius);

        tl.set(
          sat,
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
        tl.to(sat, { scale: 1, duration: 0.05, ease: "back.out(2)" }, lag);

        for (let i = 1; i < targets.length; i++) {
          const prev = targets[i - 1];
          const t = targets[i];
          const start = gsap.utils.clamp(0, 1, prev.p + lag);
          const land = gsap.utils.clamp(0, 1, t.p + lag);
          const dur = Math.max(land - start, 0.001);
          const color = PALETTE[(i + idx + 1) % PALETTE.length];

          tl.to(sat, { x: t.cx, duration: dur, ease: EASE.none }, start);
          tl.to(sat, { y: sApex(t), duration: dur * 0.5, ease: EASE.softOut }, start);
          tl.to(sat, { y: sRest(t), duration: dur * 0.5, ease: EASE.in }, start + dur * 0.5);
          tl.to(sat, { backgroundColor: color, color, duration: dur * 0.4 }, land - dur * 0.2);
        }
      };

      const tl = gsap.timeline({ paused: true });

      const build = () => {
        tl.clear();
        const { targets, safeTop, bounce } = compute();
        if (targets.length < 2) return;
        buildLead(targets, bounce, safeTop);
        satellites.forEach((sat, i) => buildSat(sat, targets, i, bounce, safeTop));
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

      gsap.set(core, { rotation: -5 });
      gsap.to(core, { rotation: 5, duration: 1.8, ease: "sine.inOut", repeat: -1, yoyo: true });
      gsap.to(core, { scale: 1.07, duration: 2.4, ease: "sine.inOut", repeat: -1, yoyo: true });
      gsap.to(aura, { scale: 1.12, duration: 3.2, ease: "sine.inOut", repeat: -1, yoyo: true });
    },
    { scope: root, dependencies: [reduced] },
  );
}
