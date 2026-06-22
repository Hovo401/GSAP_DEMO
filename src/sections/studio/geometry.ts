import { studio } from "../../content/site";
import type { Pt, Note, Link, Page } from "./types";

// The pannable wall is larger than the viewport so there's room to roam.
export const CANVAS_W = 1700;
export const CANVAS_H = 1150;

export const ZOOM_MIN = 0.6;
export const ZOOM_MAX = 1.6;
export const ZOOM_STEP = 0.2;

export function makeSeedPages(): Page[] {
  return studio.pages.map((page) => ({
    id: page.id,
    name: page.name,
    notes: page.nodes.map((n) => ({ ...n })),
    links: page.links.map((l, i) => ({ id: `${page.id}-seed-${i}`, ...l })),
  }));
}

// `zoom` is the CSS scale applied to an ancestor of `board`, so the raw
// screen-pixel delta must be divided back down to board-local units.
export function centerOf(el: Element, board: HTMLElement, zoom = 1): Pt {
  const r = el.getBoundingClientRect();
  const b = board.getBoundingClientRect();
  return {
    x: (r.left + r.width / 2 - b.left) / zoom,
    y: (r.top + r.height / 2 - b.top) / zoom,
  };
}

export function wirePath(a: Pt, b: Pt): string {
  if (b.x >= a.x) {
    const dx = Math.max(40, Math.abs(b.x - a.x) * 0.5);
    return `M ${a.x} ${a.y} C ${a.x + dx} ${a.y}, ${b.x - dx} ${b.y}, ${b.x} ${b.y}`;
  }
  // Backward link (feedback loop): scaling the control offset by the
  // horizontal span would overshoot across the whole canvas, so dip
  // below both ports instead of bowing sideways.
  const dip = 70;
  const midY = Math.max(a.y, b.y) + dip;
  return `M ${a.x} ${a.y} C ${a.x + dip} ${midY}, ${b.x - dip} ${midY}, ${b.x} ${b.y}`;
}

// Redraw every wire's visible + hit path, in `board`-local coordinates.
export function drawWires(
  board: HTMLElement,
  wires: Record<string, SVGPathElement | null>,
  hits: Record<string, SVGPathElement | null>,
  links: Link[],
  zoom = 1,
) {
  links.forEach((link) => {
    const out = board.querySelector(`[data-port="${link.from}:out"]`);
    const inp = board.querySelector(`[data-port="${link.to}:in"]`);
    if (!out || !inp) return;
    const d = wirePath(centerOf(out, board, zoom), centerOf(inp, board, zoom));
    wires[link.id]?.setAttribute("d", d);
    hits[link.id]?.setAttribute("d", d);
  });
}

export const hasInput = (kind: Note["kind"]) => kind !== "in";
export const hasOutput = (kind: Note["kind"]) => kind !== "out";

// Add a link unless that exact pair is already wired.
export function addLinkIfMissing(
  notes: Note[],
  links: Link[],
  from: string,
  to: string,
): { page: { notes: Note[]; links: Link[] }; added: boolean } {
  if (links.some((l) => l.from === from && l.to === to)) {
    return { page: { notes, links }, added: false };
  }
  return { page: { notes, links: [...links, { id: crypto.randomUUID(), from, to }] }, added: true };
}

// Fold each node's live drag offset (in canvas pixels) back into its stored
// percentage position on the given page.
export function foldPositions(pages: Page[], pageId: string, positions: Record<string, Pt>): Page[] {
  return pages.map((p) => {
    if (p.id !== pageId) return p;
    return {
      ...p,
      notes: p.notes.map((n) => {
        const pos = positions[n.id];
        if (!pos) return n;
        return { ...n, x: n.x + (pos.x / CANVAS_W) * 100, y: n.y + (pos.y / CANVAS_H) * 100 };
      }),
    };
  });
}
