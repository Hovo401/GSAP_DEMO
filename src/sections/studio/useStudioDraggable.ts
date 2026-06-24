import { useEffect, useRef, type RefObject } from "react";
import { flushSync } from "react-dom";
import { gsap, useGSAP } from "../../lib/gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";

gsap.registerPlugin(Draggable, InertiaPlugin);
import { DURATION, EASE } from "../../lib/motion";
import {
  canvasSize,
  centerOf,
  wirePath,
  drawWires,
  addLinkIfMissing,
  foldPositions,
} from "./geometry";
import type { Note, Link, Page, Pt } from "./types";

type PanBounds = { minX: number; minY: number; maxX: number; maxY: number };

type UseStudioDraggableParams = {
  scope: RefObject<HTMLElement | null>;
  stageRef: RefObject<HTMLDivElement | null>;
  canvasRef: RefObject<HTMLDivElement | null>;
  zoomLayerRef: RefObject<HTMLDivElement | null>;
  bgRef: RefObject<HTMLDivElement | null>;
  watermarkRef: RefObject<HTMLSpanElement | null>;
  pendingRef: RefObject<SVGPathElement | null>;
  hintRef: RefObject<HTMLDivElement | null>;
  wireRefs: RefObject<Record<string, SVGPathElement | null>>;
  hitRefs: RefObject<Record<string, SVGPathElement | null>>;
  dragInstRef: RefObject<Record<string, Draggable>>;
  lastPosRef: RefObject<Record<string, Pt>>;
  pagesRef: RefObject<Page[]>;
  reduced: boolean;
  activePageId: string;
  noteIds: string;
  activePage: Page;
  zoom: number;
  zoomRef: RefObject<number>;
  setPages: (pages: Page[]) => void;
  withActivePage: (
    mutator: (notes: Note[], links: Link[]) => { notes: Note[]; links: Link[] },
  ) => void;
};

export function useStudioDraggable(params: UseStudioDraggableParams) {
  const {
    scope,
    stageRef,
    canvasRef,
    zoomLayerRef,
    bgRef,
    watermarkRef,
    pendingRef,
    hintRef,
    wireRefs,
    hitRefs,
    dragInstRef,
    lastPosRef,
    pagesRef,
    reduced,
    activePageId,
    noteIds,
    activePage,
    zoom,
    zoomRef,
    setPages,
    withActivePage,
  } = params;

  const panInstRef = useRef<Draggable | null>(null);
  const panBoundsFnRef = useRef<(() => PanBounds) | null>(null);

  useGSAP(
    () => {
      const stage = stageRef.current;
      const canvas = canvasRef.current;
      const zoomLayer = zoomLayerRef.current;
      const bg = bgRef.current;
      const watermark = watermarkRef.current;
      const pending = pendingRef.current;
      if (reduced || !stage || !canvas || !zoomLayer || !bg || !pending) return;

      const pageIdAtMount = activePageId;
      const { w: canvasW, h: canvasH } = canvasSize(activePage);
      const nodeEls = gsap.utils.toArray<HTMLElement>(
        canvas.querySelectorAll(".studio-node"),
      );
      nodeEls.forEach((n) => {
        gsap.set(n, { x: 0, y: 0 });
        const id = n.dataset.node ?? "";
        if (id) lastPosRef.current[id] = { x: 0, y: 0 };
      });

      const fadeHint = () => {
        if (hintRef.current)
          gsap.to(hintRef.current, { autoAlpha: 0, duration: 0.3 });
      };
      const currentLinks = () =>
        (pagesRef.current.find((p) => p.id === pageIdAtMount) ?? activePage)
          .links;
      const redraw = () =>
        drawWires(
          canvas,
          wireRefs.current,
          hitRefs.current,
          currentLinks(),
          zoomRef.current,
        );

      const settleNode = (
        id: string,
        node: HTMLElement,
        x: number,
        y: number,
      ) => {
        const last = lastPosRef.current[id] ?? { x: 0, y: 0 };
        const dx = x - last.x;
        const dy = y - last.y;
        lastPosRef.current[id] = { x: 0, y: 0 };
        if (!dx && !dy) return;
        const next = foldPositions(pagesRef.current, pageIdAtMount, {
          [id]: { x: dx, y: dy },
        });
        pagesRef.current = next;
        flushSync(() => setPages(next));
        gsap.set(node, { x: 0, y: 0 });
      };

      gsap.set(zoomLayer, { scale: zoomRef.current });

      let originX = (stage.clientWidth / zoomRef.current - canvasW) / 2;
      let originY = (stage.clientHeight / zoomRef.current - canvasH) / 2;
      gsap.set(canvas, { x: originX, y: originY });

      if (watermark) gsap.set(watermark, { xPercent: -50, yPercent: -50 });

      const WATERMARK_DRIFT = 0.25;
      const updateParallax = () => {
        if (!watermark) return;
        const dx = (gsap.getProperty(canvas, "x") as number) - originX;
        const dy = (gsap.getProperty(canvas, "y") as number) - originY;
        gsap.set(watermark, {
          x: -dx * (1 - WATERMARK_DRIFT),
          y: -dy * (1 - WATERMARK_DRIFT),
        });
      };

      const panBounds = (): PanBounds => ({
        minX: stage.clientWidth / zoomRef.current - canvasW,
        minY: stage.clientHeight / zoomRef.current - canvasH,
        maxX: 0,
        maxY: 0,
      });

      let lastTouchY: number | null = null;

      const [pan] = Draggable.create(canvas, {
        type: "x,y",
        trigger: bg,
        bounds: panBounds(),
        dragClickables: false,
        inertia: true,
        resistance: 3650,
        edgeResistance: 0.9,
        onPress: function (this: Draggable) {
          fadeHint();
          const pe = this.pointerEvent as PointerEvent | undefined;
          lastTouchY = pe?.pointerType === "touch" ? this.pointerY : null;
        },
        onDrag: function (this: Draggable) {
          updateParallax();
          if (lastTouchY === null) return;
          const currentY = this.pointerY;
          const deltaY = currentY - lastTouchY;
          lastTouchY = currentY;
          if (!deltaY) return;
          const bounds = panBounds();
          const EPS = 1;
          const atTop = this.y >= bounds.maxY - EPS;
          const atBottom = this.y <= bounds.minY + EPS;
          if ((atTop && deltaY > 0) || (atBottom && deltaY < 0)) {
            globalThis.scrollBy(0, -deltaY);
          }
        },
        onThrowUpdate: updateParallax,
      });

      panInstRef.current = pan;
      panBoundsFnRef.current = panBounds;

      const drags = nodeEls.map((node) => {
        const id = node.dataset.node ?? "";
        const [inst] = Draggable.create(node, {
          type: "x,y",
          bounds: canvas,
          dragClickables: false,
          inertia: true,
          resistance: 3650,
          edgeResistance: 0.9,
          onPress: () => {
            fadeHint();
            gsap.set(node, { zIndex: 20 });
          },
          onDrag: redraw,
          onThrowUpdate: redraw,
          onThrowComplete: () => settleNode(id, node, inst.x, inst.y),
        });
        if (id) dragInstRef.current[id] = inst;
        return inst;
      });

      let fromId: string | null = null;
      let wiringBoardRect: DOMRect | null = null;
      const boardPoint = (e: PointerEvent): Pt => {
        const b = wiringBoardRect ?? canvas.getBoundingClientRect();
        const z = zoomRef.current;
        return { x: (e.clientX - b.left) / z, y: (e.clientY - b.top) / z };
      };

      const onMove = (e: PointerEvent) => {
        if (!fromId) return;
        const out = canvas.querySelector(`[data-port="${fromId}:out"]`);
        if (out)
          pending.setAttribute(
            "d",
            wirePath(
              centerOf(out, wiringBoardRect!, zoomRef.current),
              boardPoint(e),
            ),
          );
      };

      const onUp = (e: PointerEvent) => {
        globalThis.removeEventListener("pointermove", onMove);
        globalThis.removeEventListener("pointerup", onUp);
        pending.style.opacity = "0";
        const startId = fromId;
        fromId = null;
        if (!startId) return;

        let best: HTMLElement | null = null;
        let bestDist = 52;
        const drop = boardPoint(e);
        const boardRect = wiringBoardRect!;
        wiringBoardRect = null;
        canvas
          .querySelectorAll<HTMLElement>("[data-port$=':in']")
          .forEach((el) => {
            const c = centerOf(el, boardRect, zoomRef.current);
            const dist = Math.hypot(c.x - drop.x, c.y - drop.y);
            if (dist < bestDist) {
              bestDist = dist;
              best = el;
            }
          });
        if (!best) return;
        const target: HTMLElement = best;

        const toId = target.dataset.port?.split(":")[0] ?? "";
        let added = false;
        withActivePage((notes, links) => {
          const out = addLinkIfMissing(notes, links, startId, toId);
          added = out.added;
          return out.page;
        });

        if (added) {
          gsap.fromTo(
            target,
            { scale: 1 },
            {
              scale: 1.8,
              duration: 0.25,
              yoyo: true,
              repeat: 1,
              ease: "power2.out",
            },
          );
        } else {
          gsap.fromTo(
            target,
            { x: 0 },
            { x: 6, duration: 0.07, repeat: 5, yoyo: true, ease: "none" },
          );
        }
      };

      const onPortDown = (e: Event) => {
        const pe = e as PointerEvent;
        pe.stopPropagation();
        pe.preventDefault();
        fromId =
          (pe.currentTarget as HTMLElement).dataset.port?.split(":")[0] ?? null;
        wiringBoardRect = canvas.getBoundingClientRect();
        pending.style.opacity = "1";
        fadeHint();
        onMove(pe);
        globalThis.addEventListener("pointermove", onMove);
        globalThis.addEventListener("pointerup", onUp);
      };

      const outPorts = Array.from(
        canvas.querySelectorAll<HTMLElement>("[data-port$=':out']"),
      );
      outPorts.forEach((p) => p.addEventListener("pointerdown", onPortDown));

      redraw();
      const onResize = () => {
        const bounds = panBounds();
        pan.applyBounds(bounds);
        drags.forEach((d) => d.applyBounds(canvas));

        const x = gsap.getProperty(canvas, "x") as number;
        const y = gsap.getProperty(canvas, "y") as number;
        const clampedX = Math.min(bounds.maxX, Math.max(bounds.minX, x));
        const clampedY = Math.min(bounds.maxY, Math.max(bounds.minY, y));
        if (clampedX !== x || clampedY !== y) {
          gsap.set(canvas, { x: clampedX, y: clampedY });
        }

        originX = (stage.clientWidth / zoomRef.current - canvasW) / 2;
        originY = (stage.clientHeight / zoomRef.current - canvasH) / 2;
        updateParallax();
      };
      globalThis.addEventListener("resize", onResize);

      return () => {
        globalThis.removeEventListener("resize", onResize);
        globalThis.removeEventListener("pointermove", onMove);
        globalThis.removeEventListener("pointerup", onUp);
        outPorts.forEach((p) =>
          p.removeEventListener("pointerdown", onPortDown),
        );

        nodeEls.forEach((node) => {
          const id = node.dataset.node ?? "";
          if (!id) return;
          settleNode(
            id,
            node,
            (gsap.getProperty(node, "x") as number) || 0,
            (gsap.getProperty(node, "y") as number) || 0,
          );
          delete lastPosRef.current[id];
          delete dragInstRef.current[id];
        });

        pan.kill();
        drags.forEach((d) => d.kill());

        panInstRef.current = null;
        panBoundsFnRef.current = null;
      };
    },
    { scope, dependencies: [reduced, activePageId, noteIds] },
  );

  useEffect(() => {
    if (reduced) return;
    const layer = zoomLayerRef.current;
    if (!layer) return;
    gsap.to(layer, {
      scale: zoom,
      duration: DURATION.fast,
      ease: EASE.softOut,
    });
    if (panBoundsFnRef.current) {
      panInstRef.current?.applyBounds(panBoundsFnRef.current());
    }
  }, [zoom, reduced, zoomLayerRef]);
}
