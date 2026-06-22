import { useRef } from "react";
import { gsap, useGSAP } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";

export default function OrbitDecor({ className = "" }: { className?: string }) {
  const root = useRef<SVGSVGElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;

      gsap.to(".orbit-dot-a", {
        rotation: 360,
        svgOrigin: "158 205",
        duration: 9,
        ease: "none",
        repeat: -1,
      });
      gsap.to(".orbit-dot-b", {
        rotation: -360,
        svgOrigin: "242 205",
        duration: 12,
        ease: "none",
        repeat: -1,
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <svg ref={root} viewBox="0 0 400 400" className={className} fill="none">
      <circle
        cx={200}
        cy={200}
        r={178}
        stroke="currentColor"
        strokeWidth={1.5}
        opacity={0.45}
      />

      <circle
        cx={158}
        cy={205}
        r={120}
        stroke="currentColor"
        strokeWidth={2}
        strokeDasharray="1 10"
        strokeLinecap="round"
        opacity={0.65}
      />
      <circle
        cx={242}
        cy={205}
        r={120}
        stroke="currentColor"
        strokeWidth={2}
        strokeDasharray="1 10"
        strokeLinecap="round"
        opacity={0.65}
      />

      <g className="orbit-dot-a">
        <circle cx={278} cy={205} r={8} fill="currentColor" />
      </g>
      <g className="orbit-dot-b">
        <circle cx={122} cy={205} r={8} fill="currentColor" />
      </g>
    </svg>
  );
}
