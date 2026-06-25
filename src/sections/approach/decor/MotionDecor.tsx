import { gsap } from "../../../lib/gsap";
import { DECOR, useDecorMotion, type DecorProps } from "./shared";

export default function MotionDecor({ className = "" }: DecorProps) {
  const root = useDecorMotion((q) => {
    const draw = gsap.fromTo(
      q(".motion-curve"),
      { strokeDashoffset: 1 },
      { strokeDashoffset: 0, duration: 2.2, ease: "none", repeat: -1, repeatDelay: 0.5 },
    );

    // x linear + y eased = the dot traces the ease-in-out curve shape.
    const dx = gsap.to(q(".motion-dot"), {
      x: 260,
      duration: 2.4,
      ease: "none",
      repeat: -1,
      yoyo: true,
    });
    const dy = gsap.to(q(".motion-dot"), {
      y: -150,
      duration: 2.4,
      ease: "power3.inOut",
      repeat: -1,
      yoyo: true,
    });

    return [draw, dx, dy];
  });

  return (
    <svg ref={root} viewBox="0 0 400 400" className={className} fill="none">
      <line
        x1={70}
        y1={300}
        x2={350}
        y2={300}
        stroke="currentColor"
        strokeWidth={DECOR.structuralWidth}
        opacity={DECOR.dimOpacity}
      />
      <line
        x1={70}
        y1={120}
        x2={70}
        y2={320}
        stroke="currentColor"
        strokeWidth={DECOR.structuralWidth}
        opacity={DECOR.dimOpacity}
      />

      <path
        className="motion-curve"
        d="M 70 300 C 190 300 210 150 330 150"
        pathLength={1}
        strokeDasharray={1}
        stroke="currentColor"
        strokeWidth={DECOR.dottedWidth}
        strokeLinecap="round"
        opacity={DECOR.midOpacity}
      />

      <circle
        className="motion-dot"
        cx={70}
        cy={300}
        r={DECOR.dotR}
        fill="currentColor"
      />
    </svg>
  );
}
