import { gsap } from "../../../lib/gsap";
import { DECOR, useDecorMotion, type DecorProps } from "./shared";

const NODES = [
  { x: 70, y: 318 },
  { x: 150, y: 232 },
  { x: 214, y: 286 },
  { x: 292, y: 176 },
  { x: 342, y: 244 },
] as const;

const ROUTE = `M ${NODES.map((n) => `${n.x} ${n.y}`).join(" L ")}`;

export default function StrategyDecor({ className = "" }: DecorProps) {
  const root = useDecorMotion((q) => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.8 });

    tl.fromTo(
      q(".strat-route"),
      { strokeDashoffset: 1 },
      { strokeDashoffset: 0, duration: 2.6, ease: "none" },
    )
      .fromTo(
        q(".strat-node"),
        { opacity: DECOR.dimOpacity },
        { opacity: 1, stagger: 0.3, duration: 0.35, ease: "power2.out" },
        0.5,
      )
      .to(q(".strat-node"), { opacity: DECOR.dimOpacity, duration: 0.9 }, "+=0.6");

    return [tl];
  });

  return (
    <svg ref={root} viewBox="0 0 400 400" className={className} fill="none">
      <line
        x1={40}
        y1={130}
        x2={360}
        y2={130}
        stroke="currentColor"
        strokeWidth={DECOR.structuralWidth}
        opacity={DECOR.dimOpacity * 0.5}
      />
      <line
        x1={130}
        y1={40}
        x2={130}
        y2={360}
        stroke="currentColor"
        strokeWidth={DECOR.structuralWidth}
        opacity={DECOR.dimOpacity * 0.5}
      />

      <path
        className="strat-route"
        d={ROUTE}
        pathLength={1}
        strokeDasharray={1}
        stroke="currentColor"
        strokeWidth={DECOR.dottedWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={DECOR.midOpacity}
      />

      {NODES.map((n) => (
        <circle
          key={`${n.x}-${n.y}`}
          className="strat-node"
          cx={n.x}
          cy={n.y}
          r={DECOR.dotR}
          fill="currentColor"
          opacity={DECOR.dimOpacity}
        />
      ))}
    </svg>
  );
}
