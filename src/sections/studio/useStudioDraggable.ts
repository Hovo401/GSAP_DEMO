import type { RefObject } from "react";
import { gsap, Draggable, useGSAP } from "../../lib/gsap";
import { CANVAS_W, CANVAS_H, centerOf, wirePath, drawWires, addLinkIfMissing, foldPositions } from "./geometry";
import type { Note, Link, Page, Pt } from "./types";

type UseStudioDraggableParams = {
  scope: RefObject<HTMLElement | null>;
  stageRef: RefObject<HTMLDivElement | null>;
  canvasRef: RefObject<HTMLDivElement | null>;
  bgRef: RefObject<HTMLDivElement | null>;
  pendingRef: RefObject<SVGPathElement | null>;
  hintRef: RefObject<HTMLDivElement | null>;
  wireRefs: RefObject<Record<string, SVGPathElement | null>>;
  hitRefs: RefObject<Record<string, SVGPathElement | null>>;
  dragInstRef: RefObject<Record<string, Draggable>>;
  lastPosRef: RefObject<Record<string, Pt>>;
  pagesRef: RefObject<Page[]>;
  activePageIdRef: RefObject<string>;
  reduced: boolean;
  activePageId: string;
  noteIds: string;
  activePage: Page;
  setPages: (pages: Page[]) => void;
  withActivePage: (
    mutator: (notes: Note[], links: Link[]) => { notes: Note[]; links: Link[] },
  ) => void;
};

// Pans the wall + drags nodes + wires ports together. Pulled out of
// StudioCanvas because the gesture wiring (pan/drag/port-connect) is a large,
// self-contained imperative block that doesn't need to live next to the
// component's render/state plumbing.
export function useStudioDraggable(params: UseStudioDraggableParams) {
  const {
    scope,
    stageRef,
    canvasRef,
    bgRef,
    pendingRef,
    hintRef,
    wireRefs,
    hitRefs,
    dragInstRef,
    lastPosRef,
    pagesRef,
    activePageIdRef,
    reduced,
    activePageId,
    noteIds,
    activePage,
    setPages,
    withActivePage,
  } = params;

  useGSAP(
    () => {
      const stage = stageRef.current;
      const canvas = canvasRef.current;
      const bg = bgRef.current;
      const pending = pendingRef.current;
      if (reduced || !stage || !canvas || !bg || !pending) return;

      const pageIdAtMount = activePageId;
      const nodeEls = gsap.utils.toArray<HTMLElement>(canvas.querySelectorAll(".studio-node"));
      nodeEls.forEach((n) => {
        gsap.set(n, { x: 0, y: 0 });
        const id = n.dataset.node ?? "";
        if (id) lastPosRef.current[id] = { x: 0, y: 0 };
      });

      const fadeHint = () => {
        if (hintRef.current) gsap.to(hintRef.current, { autoAlpha: 0, duration: 0.3 });
      };
      const currentLinks = () =>
        (pagesRef.current.find((p) => p.id === activePageIdRef.current) ?? activePage).links;
      const redraw = () => drawWires(canvas, wireRefs.current, hitRefs.current, currentLinks());

      // Fold the delta since the last commit into the page's stored note
      // position, so it survives switching tabs, forking, adding notes, etc.
      // — not just whatever GSAP's transform happens to be at unmount time.
      const commitNodePosition = (id: string, x: number, y: number) => {
        const last = lastPosRef.current[id] ?? { x: 0, y: 0 };
        const dx = x - last.x;
        const dy = y - last.y;
        lastPosRef.current[id] = { x, y };
        if (!dx && !dy) return;
        const next = foldPositions(pagesRef.current, pageIdAtMount, { [id]: { x: dx, y: dy } });
        pagesRef.current = next;
        setPages(next);
      };

      // Start centred on the wall.
      gsap.set(canvas, {
        x: (stage.clientWidth - CANVAS_W) / 2,
        y: (stage.clientHeight - CANVAS_H) / 2,
      });

      const panBounds = () => ({
        minX: stage.clientWidth - CANVAS_W,
        minY: stage.clientHeight - CANVAS_H,
        maxX: 0,
        maxY: 0,
      });

      // Pan: triggered only from the background layer, so node/port presses
      // never start a pan (no nested-drag conflict). Wires live inside the
      // canvas, so they move with the pan for free — no redraw needed here.
      const [pan] = Draggable.create(canvas, {
        type: "x,y",
        trigger: bg,
        bounds: panBounds(),
        inertia: true,
        edgeResistance: 0.9,
        onPress: fadeHint,
      });

      const drags = nodeEls.map((node) => {
        const id = node.dataset.node ?? "";
        const commit = () => commitNodePosition(id, inst.x, inst.y);
        const [inst] = Draggable.create(node, {
          type: "x,y",
          bounds: canvas,
          inertia: true,
          edgeResistance: 0.9,
          onPress: () => {
            fadeHint();
            gsap.set(node, { zIndex: 20 });
          },
          onDrag: redraw,
          onThrowUpdate: redraw,
          onDragEnd: commit,
          onThrowComplete: commit,
        });
        if (id) dragInstRef.current[id] = inst;
        return inst;
      });

      // --- Wire gesture: pointerdown on an output port drags a wire out.
      let fromId: string | null = null;
      const boardPoint = (e: PointerEvent): Pt => {
        const b = canvas.getBoundingClientRect();
        return { x: e.clientX - b.left, y: e.clientY - b.top };
      };

      const onMove = (e: PointerEvent) => {
        if (!fromId) return;
        const out = canvas.querySelector(`[data-port="${fromId}:out"]`);
        if (out) pending.setAttribute("d", wirePath(centerOf(out, canvas), boardPoint(e)));
      };

      const onUp = (e: PointerEvent) => {
        globalThis.removeEventListener("pointermove", onMove);
        globalThis.removeEventListener("pointerup", onUp);
        pending.style.opacity = "0";
        const startId = fromId;
        fromId = null;
        if (!startId) return;

        // Forgiving hit-test: nearest input port within 52px of the drop.
        let best: HTMLElement | null = null;
        let bestDist = 52;
        const drop = boardPoint(e);
        canvas.querySelectorAll<HTMLElement>("[data-port$=':in']").forEach((el) => {
          const c = centerOf(el, canvas);
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
            { scale: 1.8, duration: 0.25, yoyo: true, repeat: 1, ease: "power2.out" },
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
        pe.stopPropagation(); // don't let the node/pan Draggable start
        pe.preventDefault();
        fromId = (pe.currentTarget as HTMLElement).dataset.port?.split(":")[0] ?? null;
        pending.style.opacity = "1";
        fadeHint();
        onMove(pe);
        globalThis.addEventListener("pointermove", onMove);
        globalThis.addEventListener("pointerup", onUp);
      };

      const outPorts = Array.from(canvas.querySelectorAll<HTMLElement>("[data-port$=':out']"));
      outPorts.forEach((p) => p.addEventListener("pointerdown", onPortDown));

      redraw();
      const onResize = () => {
        pan.applyBounds(panBounds());
        drags.forEach((d) => d.applyBounds(canvas));
      };
      globalThis.addEventListener("resize", onResize);

      return () => {
        globalThis.removeEventListener("resize", onResize);
        globalThis.removeEventListener("pointermove", onMove);
        globalThis.removeEventListener("pointerup", onUp);
        outPorts.forEach((p) => p.removeEventListener("pointerdown", onPortDown));

        // Most moves are already committed by onDragEnd/onThrowComplete; this
        // only catches a still-in-flight inertia glide interrupted by
        // switching tabs mid-throw.
        nodeEls.forEach((node) => {
          const id = node.dataset.node ?? "";
          if (!id) return;
          commitNodePosition(
            id,
            (gsap.getProperty(node, "x") as number) || 0,
            (gsap.getProperty(node, "y") as number) || 0,
          );
          delete lastPosRef.current[id];
          delete dragInstRef.current[id];
        });

        pan.kill();
        drags.forEach((d) => d.kill());
      };
    },
    { scope, dependencies: [reduced, activePageId, noteIds] },
  );
}
