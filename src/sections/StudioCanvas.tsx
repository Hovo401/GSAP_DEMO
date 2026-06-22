import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import type { Draggable } from "../lib/gsap";
import { studio } from "../content/site";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { CANVAS_W, CANVAS_H, makeFirstPage, drawWires } from "./studio/geometry";
import { renderBoard } from "./studio/Board";
import { useStudioDraggable } from "./studio/useStudioDraggable";
import type { Note, Page, Pt } from "./studio/types";

export default function StudioCanvas() {
  const root = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const pendingRef = useRef<SVGPathElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const wireRefs = useRef<Record<string, SVGPathElement | null>>({});
  const hitRefs = useRef<Record<string, SVGPathElement | null>>({});
  const dragInstRef = useRef<Record<string, Draggable>>({});
  // Per-node cumulative GSAP x/y already folded into page state, so each new
  // commit only applies the delta since the last one (not the full total).
  const lastPosRef = useRef<Record<string, Pt>>({});

  const reduced = useReducedMotion();

  const [pages, setPages] = useState<Page[]>(() => [makeFirstPage()]);
  const [activePageId, setActivePageId] = useState("page-1");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState({ label: "", sub: "" });
  const [hoverDelete, setHoverDelete] = useState<{ id: string; x: number; y: number } | null>(
    null,
  );

  // Kept in sync after every render so imperative GSAP callbacks (which don't
  // re-bind on every state change) can always read the latest snapshot.
  const pagesRef = useRef(pages);
  const activePageIdRef = useRef(activePageId);
  useEffect(() => {
    pagesRef.current = pages;
  }, [pages]);
  useEffect(() => {
    activePageIdRef.current = activePageId;
  }, [activePageId]);

  const activePage = pages.find((p) => p.id === activePageId) ?? pages[0];
  const noteIds = activePage.notes.map((n) => n.id).join(",");

  // Apply a mutation to the active page. Editing page 1 (the original
  // example) forks a new page instead of touching it, so the example stays
  // intact; every other page is mutated in place. Reads/writes go through
  // refs so back-to-back calls between renders never see stale state.
  function withActivePage(
    mutator: (notes: Note[], links: Page["links"]) => { notes: Note[]; links: Page["links"] },
  ) {
    const prev = pagesRef.current;
    const id = activePageIdRef.current;
    const idx = prev.findIndex((p) => p.id === id);
    if (idx === -1) return;
    const page = prev[idx];
    const { notes, links } = mutator(page.notes, page.links);

    let next: Page[];
    let nextActiveId = id;
    if (page.id === "page-1") {
      nextActiveId = crypto.randomUUID();
      next = [...prev, { id: nextActiveId, name: `Page ${prev.length + 1}`, notes, links }];
    } else {
      next = prev.map((p, i) => (i === idx ? { ...p, notes, links } : p));
    }

    pagesRef.current = next;
    activePageIdRef.current = nextActiveId;
    setPages(next);
    if (nextActiveId !== id) setActivePageId(nextActiveId);
  }

  useStudioDraggable({
    scope: root,
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
  });

  // While a note is being edited, fully disable its Draggable — GSAP's own
  // "ignore clicks on form elements" heuristic isn't reliable enough across
  // browsers to guarantee the input can be focused and typed into.
  useEffect(() => {
    Object.entries(dragInstRef.current).forEach(([id, inst]) => {
      if (id === editingId) inst.disable();
      else inst.enable();
    });
  }, [editingId]);

  // Keep wires drawn whenever the active page's link list changes (add/delete).
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduced) return;
    drawWires(canvas, wireRefs.current, hitRefs.current, activePage.links);
  }, [activePage.links, activePageId, reduced]);

  const onWireEnter = (linkId: string, path: SVGPathElement) => {
    const len = path.getTotalLength();
    const pt = path.getPointAtLength(len / 2);
    setHoverDelete({ id: linkId, x: pt.x, y: pt.y });
  };

  const openEdit = (node: Note) => {
    setDraft({ label: node.label, sub: node.sub });
    setEditingId(node.id);
  };

  const updateDraftLabel = (label: string) => setDraft((d) => ({ ...d, label }));
  const updateDraftSub = (sub: string) => setDraft((d) => ({ ...d, sub }));

  const commitEdit = () => {
    if (!editingId) return;
    const id = editingId;
    withActivePage((notes, links) => ({
      notes: notes.map((n) => (n.id === id ? { ...n, label: draft.label, sub: draft.sub } : n)),
      links,
    }));
    setEditingId(null);
  };

  const handleDeleteNote = (id: string) => {
    withActivePage((notes, links) => ({
      notes: notes.filter((n) => n.id !== id),
      links: links.filter((l) => l.from !== id && l.to !== id),
    }));
  };

  const handleDeleteLink = (id: string) => {
    withActivePage((notes, links) => ({ notes, links: links.filter((l) => l.id !== id) }));
    setHoverDelete(null);
  };

  const handleAddNote = () => {
    const id = crypto.randomUUID();
    withActivePage((notes, links) => ({
      notes: [
        ...notes,
        { id, label: "New note", sub: "", kind: "fx", x: 38 + Math.random() * 24, y: 30 + Math.random() * 40 },
      ],
      links,
    }));
    openEdit({ id, label: "New note", sub: "", kind: "fx", x: 0, y: 0 });
  };

  const handleAddPage = () => {
    const id = crypto.randomUUID();
    setPages((prev) => {
      const next = [...prev, { id, name: `Page ${prev.length + 1}`, notes: [], links: [] }];
      pagesRef.current = next;
      return next;
    });
    activePageIdRef.current = id;
    setActivePageId(id);
  };

  const handleReset = () => {
    const fresh = [makeFirstPage()];
    pagesRef.current = fresh;
    activePageIdRef.current = "page-1";
    setPages(fresh);
    setActivePageId("page-1");
    setEditingId(null);
    setHoverDelete(null);
  };

  const handleDownload = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const dataUrl = await toPng(canvas, { backgroundColor: "#101010", pixelRatio: 2 });
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `studio-${activePage.name.toLowerCase().replace(/\s+/g, "-")}.png`;
      link.click();
    } catch {
      // Export can fail on some browsers/fonts — nothing else to do about it.
    }
  };

  const clearHoverDelete = () => setHoverDelete(null);

  return (
    <section id="studio" ref={root} className="relative bg-ink px-6 py-28 md:px-12">
      <div className="mx-auto mb-12 flex max-w-6xl flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="flex items-center gap-3 text-sm font-medium tracking-[0.4em] text-flame uppercase">
            <span className="h-px w-8 bg-flame/60" />
            {studio.kicker}
          </p>
          <h2 data-skew className="font-display mt-3 text-5xl leading-none uppercase md:text-7xl">
            {studio.title}
          </h2>
        </div>
        <p className="max-w-xs text-sm font-light text-paper/50 md:text-right">{studio.hint}</p>
      </div>

      {!reduced && (
        <div className="mx-auto mb-4 flex max-w-7xl flex-wrap items-center gap-2">
          {pages.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setActivePageId(p.id)}
              className={`cursor-pointer rounded-full border px-4 py-1.5 text-xs font-medium tracking-[0.15em] uppercase transition-colors ${
                p.id === activePageId
                  ? "border-flame bg-flame text-ink"
                  : "border-paper/20 text-paper/55 hover:border-paper/40 hover:text-paper"
              }`}
            >
              {p.name}
            </button>
          ))}
          <button
            type="button"
            onClick={handleAddPage}
            aria-label={studio.newPageLabel}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-paper/20 text-paper/55 hover:border-flame hover:text-flame"
          >
            +
          </button>
        </div>
      )}

      <div
        ref={stageRef}
        className="relative mx-auto h-[80vh] w-full max-w-7xl overflow-hidden rounded-3xl border-2 border-paper/15 bg-[#101010]"
      >
        {reduced ? (
          <>
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
                backgroundSize: "44px 44px",
              }}
            />
            {renderBoard({
              notes: studio.nodes,
              links: studio.links.map((l, i) => ({ id: `seed-${i}`, ...l })),
              interactive: false,
              editingId: null,
              draft,
              hoverDelete: null,
              wireRefs,
              hitRefs,
              pendingRef,
              onWireEnter,
              clearHoverDelete,
              handleDeleteLink,
              openEdit,
              handleDeleteNote,
              updateDraftLabel,
              updateDraftSub,
              commitEdit,
            })}
            <div className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 text-xs tracking-[0.25em] text-paper/40 uppercase">
              The motion pipeline behind every MOTIVE build.
            </div>
          </>
        ) : (
          <>
            <div
              ref={canvasRef}
              className="absolute top-0 left-0 will-change-transform"
              style={{ width: CANVAS_W, height: CANVAS_H }}
            >
              <div
                ref={bgRef}
                className="absolute inset-0 cursor-grab touch-none active:cursor-grabbing"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
                  backgroundSize: "44px 44px",
                }}
              >
                <span className="font-display pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[18rem] leading-none text-paper/3 uppercase">
                  {studio.watermark}
                </span>
              </div>

              {renderBoard({
                notes: activePage.notes,
                links: activePage.links,
                interactive: true,
                editingId,
                draft,
                hoverDelete,
                wireRefs,
                hitRefs,
                pendingRef,
                onWireEnter,
                clearHoverDelete,
                handleDeleteLink,
                openEdit,
                handleDeleteNote,
                updateDraftLabel,
                updateDraftSub,
                commitEdit,
              })}
            </div>

            <div
              ref={hintRef}
              className="pointer-events-none absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-paper/15 bg-ink/60 px-4 py-2 text-xs tracking-[0.25em] text-paper/60 uppercase backdrop-blur-sm"
            >
              <span className="text-flame">⟿</span>
              {studio.dragHint} · drag the wall to roam
            </div>
          </>
        )}
      </div>

      {!reduced && (
        <div className="mx-auto mt-6 flex max-w-7xl flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleAddNote}
            data-magnetic
            className="cursor-pointer rounded-full border-2 border-flame bg-flame px-6 py-2.5 text-sm font-bold tracking-[0.15em] text-ink uppercase transition-colors duration-200 hover:bg-transparent hover:text-flame"
          >
            {studio.addNoteLabel}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            data-magnetic
            className="cursor-pointer rounded-full border-2 border-paper/30 px-6 py-2.5 text-sm font-bold tracking-[0.15em] text-paper/70 uppercase transition-colors duration-200 hover:border-paper hover:text-paper"
          >
            {studio.downloadLabel}
          </button>
          <button
            type="button"
            onClick={handleReset}
            data-magnetic
            className="cursor-pointer rounded-full border-2 border-paper/30 px-6 py-2.5 text-sm font-bold tracking-[0.15em] text-paper/70 uppercase transition-colors duration-200 hover:border-paper hover:text-paper"
          >
            {studio.resetLabel}
          </button>
        </div>
      )}
    </section>
  );
}
