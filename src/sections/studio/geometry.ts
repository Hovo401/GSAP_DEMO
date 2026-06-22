import { studio } from "../../content/site";
import type { Pt, Note, Link, Page } from "./types";

// The pannable wall is larger than the viewport so there's room to roam.
export const CANVAS_W = 1700;
export const CANVAS_H = 1150;

export function makeFirstPage(): Page {
  return {
    id: "page-1",
    name: "Page 1",
    notes: studio.nodes.map((n) => ({ ...n })),
    links: studio.links.map((l, i) => ({ id: `seed-${i}`, ...l })),
  };
}

export function centerOf(el: Element, board: HTMLElement): Pt {
  const r = el.getBoundingClientRect();
  const b = board.getBoundingClientRect();
  return { x: r.left + r.width / 2 - b.left, y: r.top + r.height / 2 - b.top };
}

export function wirePath(a: Pt, b: Pt): string {
  const dx = Math.max(40, Math.abs(b.x - a.x) * 0.5);
  return `M ${a.x} ${a.y} C ${a.x + dx} ${a.y}, ${b.x - dx} ${b.y}, ${b.x} ${b.y}`;
}

// Redraw every wire's visible + hit path, in `board`-local coordinates.
export function drawWires(
  board: HTMLElement,
  wires: Record<string, SVGPathElement | null>,
  hits: Record<string, SVGPathElement | null>,
  links: Link[],
) {
  links.forEach((link) => {
    const out = board.querySelector(`[data-port="${link.from}:out"]`);
    const inp = board.querySelector(`[data-port="${link.to}:in"]`);
    if (!out || !inp) return;
    const d = wirePath(centerOf(out, board), centerOf(inp, board));
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
