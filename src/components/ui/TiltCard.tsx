import type { ReactNode, PointerEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

type Props = {
  children: ReactNode;
  /** Classes on the tilting card surface (border, background, padding). */
  className?: string;
  /** Classes on the outer perspective wrapper (e.g. the scroll-reveal target). */
  wrapperClassName?: string;
};

const MAX_DEG = 8;

export default function TiltCard({
  children,
  className,
  wrapperClassName,
}: Readonly<Props>) {
  const reduced = useReducedMotion();

  // Normalized pointer position within the card, each axis in [-0.5, 0.5].
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  // Spring the rotation so the tilt eases instead of snapping rigidly.
  const spring = { stiffness: 150, damping: 18, mass: 0.6 };
  // Map pointer X to rotateY, and (inverted) pointer Y to rotateX: moving the
  // cursor up/right tips the card's far edges away, like a physical surface.
  const rotateX = useSpring(
    useTransform(py, [-0.5, 0.5], [MAX_DEG, -MAX_DEG]),
    spring,
  );
  const rotateY = useSpring(
    useTransform(px, [-0.5, 0.5], [-MAX_DEG, MAX_DEG]),
    spring,
  );

  // Glare follows the raw pointer position across the card face.
  const glareX = useTransform(px, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(py, [-0.5, 0.5], ["0%", "100%"]);
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
    // Reset to a flat resting state; the springs ease rotation back to 0.
    px.set(0);
    py.set(0);
    glareOpacity.set(0);
  };

  return (
    <div className={wrapperClassName} style={{ perspective: 600 }}>
      <motion.article
        data-magnetic
        className={className}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      >
        {children}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10"
          style={{ opacity: glareOpacity, background: glare }}
        />
      </motion.article>
    </div>
  );
}
