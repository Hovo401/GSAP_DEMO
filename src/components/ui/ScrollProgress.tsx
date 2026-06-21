import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "../../lib/gsap";

/** Thin top progress bar tied to total page scroll. */
export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        gsap.set(barRef.current, { scaleX: self.progress });
      },
    });
    return () => st.kill();
  });

  return (
    <div className="pointer-events-none fixed top-0 right-0 left-0 z-[60] h-1 bg-transparent">
      <div
        ref={barRef}
        className="h-full origin-left scale-x-0 bg-flame"
      />
    </div>
  );
}
