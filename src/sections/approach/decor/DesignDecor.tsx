import { gsap } from "../../../lib/gsap";
import { DECOR, useDecorMotion, type DecorProps } from "./shared";

const BLOCKS = [
  { x: 60, y: 70, w: 280, h: 46 },
  { x: 60, y: 140, w: 130, h: 190 },
  { x: 210, y: 140, w: 130, h: 86 },
  { x: 210, y: 246, w: 130, h: 84 },
] as const;

export default function DesignDecor({ className = "" }: DecorProps) {
  const root = useDecorMotion((q) => {
    const tl = gsap.timeline({ repeat: -1, yoyo: true, repeatDelay: 0.6 });
    tl.from(q(".design-block"), {
      yPercent: 10,
      opacity: 0.15,
      transformOrigin: "center",
      stagger: 0.18,
      duration: 0.9,
      ease: "power2.out",
    });

    const accent = gsap.to(q(".design-accent"), {
      y: 106,
      duration: 2.8,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true,
    });

    return [tl, accent];
  });

  return (
    <svg ref={root} viewBox="0 0 400 400" className={className} fill="none">
      <rect
        x={40}
        y={48}
        width={320}
        height={304}
        rx={10}
        stroke="currentColor"
        strokeWidth={DECOR.structuralWidth}
        opacity={DECOR.dimOpacity}
      />

      {BLOCKS.map((b) => (
        <rect
          key={`${b.x}-${b.y}`}
          className="design-block"
          x={b.x}
          y={b.y}
          width={b.w}
          height={b.h}
          rx={6}
          stroke="currentColor"
          strokeWidth={DECOR.dottedWidth}
          opacity={DECOR.midOpacity}
        />
      ))}

      <rect
        className="design-accent"
        x={72}
        y={152}
        width={106}
        height={36}
        rx={6}
        fill="currentColor"
        opacity={DECOR.dimOpacity}
      />
    </svg>
  );
}
