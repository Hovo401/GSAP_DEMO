import { useRef } from "react";
import { gsap, useGSAP } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const FLAME = "#f55438";
const INK_WASH = "rgba(10, 10, 10, 0.22)";

function buildSprite() {
  const size = 48;
  const sprite = document.createElement("canvas");
  sprite.width = size;
  sprite.height = size;
  const sctx = sprite.getContext("2d");
  if (!sctx) return null;
  const gradient = sctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  gradient.addColorStop(0, FLAME);
  gradient.addColorStop(1, "rgba(245, 84, 56, 0)");
  sctx.fillStyle = gradient;
  sctx.fillRect(0, 0, size, size);
  return sprite;
}

export default function GravityField({
  className = "",
}: {
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const sprite = buildSprite();
      if (!sprite) return;

      let w = 0;
      let h = 0;
      let canvasRect = canvas.getBoundingClientRect();

      const resize = () => {
        canvasRect = canvas.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        w = canvasRect.width;
        h = canvasRect.height;
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      resize();

      const ro = new ResizeObserver(resize);
      ro.observe(canvas);

      const onScroll = () => {
        canvasRect = canvas.getBoundingClientRect();
      };
      window.addEventListener("scroll", onScroll, { passive: true });

      const count = Math.round(
        Math.min(36, Math.max(14, (w * h) / 42000)),
      );

      const px = new Float64Array(count);
      const py = new Float64Array(count);
      const vx = new Float64Array(count);
      const vy = new Float64Array(count);
      const size = new Float64Array(count);
      const seed = new Float64Array(count);

      for (let i = 0; i < count; i++) {
        px[i] = Math.random() * w;
        py[i] = Math.random() * h;
        vx[i] = (Math.random() - 0.5) * 0.15;
        vy[i] = (Math.random() - 0.5) * 0.15;
        size[i] = 0.5 + Math.random() * 0.7;
        seed[i] = Math.random() * Math.PI * 2;
      }

      const drawDot = (x: number, y: number, s: number, alpha: number) => {
        ctx.globalAlpha = alpha;
        ctx.drawImage(sprite, x - s / 2, y - s / 2, s, s);
      };

      if (reduced) {
        ctx.clearRect(0, 0, w, h);
        ctx.globalCompositeOperation = "screen";
        for (let i = 0; i < count; i++) {
          drawDot(px[i], py[i], size[i] * 14, 0.18);
        }
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";
        return () => ro.disconnect();
      }

      let cx = w / 2;
      let cy = h / 2;
      let influence = 0;
      let active = false;
      let lastMove = 0;
      let t = 0;

      const pointerFine = window.matchMedia("(pointer: fine)").matches;

      const onPointerMove = (e: PointerEvent) => {
        cx = e.clientX - canvasRect.left;
        cy = e.clientY - canvasRect.top;
        active = true;
        lastMove = performance.now();
      };

      const onPointerLeave = () => {
        active = false;
      };

      if (pointerFine) {
        window.addEventListener("pointermove", onPointerMove);
        canvas.addEventListener("pointerleave", onPointerLeave);
      }

      const core = 70;
      const G = 5;
      const S = 7;

      const tick = () => {
        if (w <= 0 || h <= 0) return;
        t += 1;
        const now = performance.now();
        if (active && now - lastMove > 1200) active = false;
        influence += ((active ? 1 : 0) - influence) * 0.06;

        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = INK_WASH;
        ctx.fillRect(0, 0, w, h);

        ctx.globalCompositeOperation = "screen";

        const influenceR = Math.min(w, h) * 0.45;

        for (let i = 0; i < count; i++) {
          vx[i] += Math.sin(t * 0.01 + seed[i]) * 0.003;
          vy[i] += Math.cos(t * 0.012 + seed[i]) * 0.003;

          if (influence > 0.001) {
            const dx = cx - px[i];
            const dy = cy - py[i];
            const d = Math.max(Math.hypot(dx, dy), 1);
            if (d < influenceR) {
              const nx = dx / d;
              const ny = dy / d;
              const denom = Math.max(d, core);
              vx[i] += nx * (G / denom) * influence;
              vy[i] += ny * (G / denom) * influence;
              vx[i] += -ny * (S / denom) * influence;
              vy[i] += nx * (S / denom) * influence;
              if (d < core) {
                const push = (1 - d / core) * 0.5 * influence;
                vx[i] -= nx * push;
                vy[i] -= ny * push;
              }
            }
          }

          vx[i] *= 0.94;
          vy[i] *= 0.94;

          px[i] += vx[i];
          py[i] += vy[i];

          if (px[i] < 0) px[i] += w;
          if (px[i] > w) px[i] -= w;
          if (py[i] < 0) py[i] += h;
          if (py[i] > h) py[i] -= h;

          drawDot(
            px[i],
            py[i],
            size[i] * 14,
            0.32 + 0.14 * Math.sin(t * 0.02 + seed[i]),
          );
        }

        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";
      };

      gsap.ticker.add(tick);

      return () => {
        gsap.ticker.remove(tick);
        ro.disconnect();
        window.removeEventListener("scroll", onScroll);
        if (pointerFine) {
          window.removeEventListener("pointermove", onPointerMove);
          canvas.removeEventListener("pointerleave", onPointerLeave);
        }
      };
    },
    { scope: canvasRef, dependencies: [reduced] },
  );

  return <canvas ref={canvasRef} className={className} />;
}
