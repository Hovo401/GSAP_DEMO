import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "../lib/gsap";
import { magicSection } from "../content/site";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useLowPower } from "../hooks/useLowPower";

export default function MagicReveal() {
  const { t } = useTranslation();
  const root = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLHeadingElement>(null);
  const reducedMotion = useReducedMotion();
  const lowPower = useLowPower();
  const reduced = reducedMotion || lowPower;

  useGSAP(
    () => {
      const track = trackRef.current;
      const section = root.current;
      if (reduced || !track || !section) return;

      const split = new SplitText(track, { type: "chars" });
      const chars = split.chars as HTMLElement[];
      const setY = chars.map((c) => gsap.quickSetter(c, "y", "px"));
      const setRot = chars.map((c) => gsap.quickSetter(c, "rotate", "deg"));

      const curY = new Float64Array(chars.length);
      const curR = new Float64Array(chars.length);
      let curX = 0;

      let centers: number[] = [];
      let travel = 0;
      let vw = 0;
      let amp = 0;
      let omega = 0;
      let lambda = 0;
      let targetP = 0;

      const measure = () => {
        vw = window.innerWidth;
        centers = chars.map((c) => c.offsetLeft + c.offsetWidth / 2);
        travel = track.scrollWidth + vw;
        amp = window.innerHeight * 0.32;
        omega = Math.PI / (vw * 0.28);
        lambda = vw * 0.18;
        curX = vw - travel * targetP;
      };

      const pathY = (vx: number) => {
        const d = Math.max(0, vw - vx);
        return -amp * Math.cos(omega * d) * Math.exp(-d / lambda);
      };

      const tick = () => {
        const xTarget = vw - travel * targetP;
        curX += (xTarget - curX) * 0.1;
        gsap.set(track, { x: curX });
        for (let i = 0; i < chars.length; i++) {
          const vx = curX + centers[i];
          const tY = pathY(vx);
          const slope = (pathY(vx + 3) - pathY(vx - 3)) / 6;
          let tR = (Math.atan(slope) * 180) / Math.PI;
          tR = Math.max(-48, Math.min(48, tR));
          const e = 0.2 - (i / chars.length) * 0.1;
          curY[i] += (tY - curY[i]) * e;
          curR[i] += (tR - curR[i]) * e;
          setY[i](curY[i]);
          setRot[i](curR[i]);
        }
      };

      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => "+=" + (track.scrollWidth + window.innerWidth) * 0.75,
        pin: true,
        scrub: true,
        invalidateOnRefresh: true,
        onRefresh: (self) => {
          targetP = self.progress;
          measure();
        },
        onUpdate: (self) => {
          targetP = self.progress;
        },
      });

      targetP = st.progress;
      measure();
      gsap.ticker.add(tick);
      return () => gsap.ticker.remove(tick);
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section
      id="magic"
      ref={root}
      className="relative flex min-h-screen items-center overflow-hidden bg-ink text-white"
    >
      <div className="pointer-events-none absolute inset-x-0 top-20 z-10 px-6 text-center text-sm leading-relaxed text-white/85 md:text-base">
        {magicSection.topLines.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-20 z-10 px-6 text-center text-sm leading-relaxed text-white/85 md:text-base">
        {magicSection.bottomLines.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>

      <h2
        ref={trackRef}
        className={`font-medium leading-none tracking-tight select-none ${
          reduced
            ? "w-full px-6 text-center text-[8vw]"
            : "w-max whitespace-nowrap text-[12vw] will-change-transform"
        }`}
      >
        {t("magicSection.phrase")}
      </h2>
    </section>
  );
}
