import { createContext, useContext, useMemo } from "react";
import type { ReactNode, PointerEvent } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

type Props = {
  children: ReactNode;
  /** Classes on the tilting card surface (border, background, padding). */
  className?: string;
  /** Classes on the outer perspective wrapper (e.g. the scroll-reveal target). */
  wrapperClassName?: string;
};

const MAX_DEG = 8;
// How far a layer slides per unit of depth, per normalized pointer unit.
const PARALLAX_K = 0.4;

// Smoothed pointer position within the card, each axis in [-0.5, 0.5].
type TiltPointer = { px: MotionValue<number>; py: MotionValue<number> };
const TiltContext = createContext<TiltPointer | null>(null);

export default function TiltCard({
  children,
  className,
  wrapperClassName,
}: Readonly<Props>) {
  const reduced = useReducedMotion();

  const px = useMotionValue(0);
  const py = useMotionValue(0);

  // Spring the pointer so rotation, glare, and layer parallax all ease together.
  const spring = { stiffness: 150, damping: 18, mass: 0.6 };
  const pxs = useSpring(px, spring);
  const pys = useSpring(py, spring);
  const pointer = useMemo<TiltPointer>(
    () => ({ px: pxs, py: pys }),
    [pxs, pys],
  );

  // Map pointer X to rotateY, and (inverted) pointer Y to rotateX: moving the
  // cursor up/right tips the card's far edges away, like a physical surface.
  const rotateX = useTransform(pys, [-0.5, 0.5], [MAX_DEG, -MAX_DEG]);
  const rotateY = useTransform(pxs, [-0.5, 0.5], [-MAX_DEG, MAX_DEG]);

  // Glare follows the raw pointer position across the card face.
  const glareX = useTransform(pxs, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(pys, [-0.5, 0.5], ["0%", "100%"]);
  const glareOpacity = useMotionValue(0);
  const glare = useTransform(
    [glareX, glareY],
    ([x, y]: string[]) =>
      `radial-gradient(circle at ${x} ${y}, color-mix(in srgb, var(--color-paper) 22%, transparent), transparent 55%)`,
  );

  if (reduced) {
    return (
      <div className={wrapperClassName}>
        <article className={className}>{children}</article>
      </div>
    );
  }

  const onMove = (e: PointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
    glareOpacity.set(1);
  };

  const onLeave = () => {
    // Reset to a flat resting state; the springs ease everything back to 0.
    px.set(0);
    py.set(0);
    glareOpacity.set(0);
  };

  return (
    <div className={wrapperClassName} style={{ perspective: 600 }}>
      <motion.article
        className={className}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      >
        <TiltContext.Provider value={pointer}>{children}</TiltContext.Provider>
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10"
          style={{ opacity: glareOpacity, background: glare }}
        />
      </motion.article>
    </div>
  );
}

type LayerProps = {
  children: ReactNode;
  /** Depth toward the viewer (px). Deeper-forward layers lift and shift more. */
  z: number;
  className?: string;
};

export function TiltLayer({ children, z, className }: Readonly<LayerProps>) {
  const pointer = useContext(TiltContext);

  // Fallback values keep hook order stable when used outside a TiltCard.
  const fallbackX = useMotionValue(0);
  const fallbackY = useMotionValue(0);
  const px = pointer?.px ?? fallbackX;
  const py = pointer?.py ?? fallbackY;

  // Slide toward the cursor in proportion to depth, on top of the Z lift:
  // farther-forward layers travel more, a negative z drifts the opposite way.
  const transform = useTransform([px, py], ([x, y]: number[]) => {
    const shift = z * PARALLAX_K;
    return `translate3d(${x * shift}px, ${y * shift}px, ${z}px)`;
  });

  if (!pointer) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} style={{ transform }}>
      {children}
    </motion.div>
  );
}
