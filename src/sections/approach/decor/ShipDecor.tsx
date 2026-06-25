import { gsap } from "../../../lib/gsap";
import { DECOR, useDecorMotion, type DecorProps } from "./shared";

export default function ShipDecor({ className = "" }: DecorProps) {
  const root = useDecorMotion((q) => {
    const satA = gsap.to(q(".ship-sat-a"), {
      rotation: 360,
      svgOrigin: "200 200",
      duration: 10,
      ease: "none",
      repeat: -1,
    });
    const satB = gsap.to(q(".ship-sat-b"), {
      rotation: -360,
      svgOrigin: "200 200",
      duration: 16,
      ease: "none",
      repeat: -1,
    });
    const thrust = gsap.fromTo(
      q(".ship-thrust"),
      { opacity: DECOR.dimOpacity },
      {
        opacity: 1,
        stagger: 0.18,
        duration: 0.5,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
      },
    );

    return [satA, satB, thrust];
  });

  return (
    <svg ref={root} viewBox="0 0 400 400" className={className} fill="none">
      <circle
        cx={200}
        cy={200}
        r={150}
        stroke="currentColor"
        strokeWidth={DECOR.structuralWidth}
        opacity={DECOR.dimOpacity}
      />
      <circle
        cx={200}
        cy={200}
        r={108}
        stroke="currentColor"
        strokeWidth={DECOR.dottedWidth}
        strokeDasharray={DECOR.dottedDash}
        strokeLinecap="round"
        opacity={DECOR.midOpacity}
      />

      <g className="ship-sat-a">
        <circle cx={350} cy={200} r={DECOR.dotR} fill="currentColor" />
      </g>
      <g className="ship-sat-b">
        <circle cx={92} cy={200} r={6} fill="currentColor" opacity={DECOR.midOpacity} />
      </g>

      <circle className="ship-thrust" cx={262} cy={262} r={5} fill="currentColor" />
      <circle className="ship-thrust" cx={284} cy={284} r={4} fill="currentColor" />
      <circle className="ship-thrust" cx={304} cy={304} r={3} fill="currentColor" />
    </svg>
  );
}
