import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { useTranslation } from "react-i18next";
import type { Draggable } from "gsap/Draggable";
import { studio } from "../content/site";
import { useReducedMotion } from "../hooks/useReducedMotion";
import {
  ZOOM_MIN,
  ZOOM_MAX,
  ZOOM_STEP,
  canvasSize,
  makeSeedPages,
  drawWires,
} from "./studio/geometry";
import { renderBoard } from "./studio/Board";
import { useStudioDraggable } from "./studio/useStudioDraggable";
import type { Note, Page, Pt } from "./studio/types";

const seedPageIds = new Set(studio.pages.map((p) => p.id));

export default function StudioCanvas() {
  const { t } = useTranslation();
  const root = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const zoomLayerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLSpanElement>(null);
  const pendingRef = useRef<SVGPathElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const wireRefs = useRef<Record<string, SVGPathElement | null>>({});
  const hitRefs = useRef<Record<string, SVGPathElement | null>>({});
  const dragInstRef = useRef<Record<string, Draggable>>({});
  const lastPosRef = useRef<Record<string, Pt>>({});

  const reduced = useReducedMotion();

  const [pages, setPages] = useState<Page[]>(() => makeSeedPages());
  const [activePageId, setActivePageId] = useState(studio.pages[0].id);
  const [zoom, setZoom] = useState(1);
  const zoomRef = useRef(zoom);
  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState({ label: "", sub: "" });
  const [hoverDelete, setHoverDelete] = useState<{
    id: string;
    x: number;
    y: number;
  } | null>(null);
  const hoverDeleteTimer = useRef<number | null>(null);
  useEffect(() => {
    return () => {
      if (hoverDeleteTimer.current !== null)
        globalThis.clearTimeout(hoverDeleteTimer.current);
    };
  }, []);

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
  const { w: canvasW, h: canvasH } = canvasSize(activePage);

  const [minZoom, setMinZoom] = useState(ZOOM_MIN);
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const updateMinZoom = () => {
      const fit = Math.min(stage.clientWidth / canvasW, stage.clientHeight / canvasH);
      setMinZoom(Math.min(ZOOM_MIN, fit));
    };
    updateMinZoom();
    globalThis.addEventListener("resize", updateMinZoom);
    return () => globalThis.removeEventListener("resize", updateMinZoom);
  }, [canvasW, canvasH]);
  useEffect(() => {
    setZoom((z) => Math.max(minZoom, Math.min(ZOOM_MAX, z)));
  }, [minZoom]);

  function withActivePage(
    mutator: (
      notes: Note[],
      links: Page["links"],
    ) => { notes: Note[]; links: Page["links"] },
  ) {
    const prev = pagesRef.current;
    const id = activePageIdRef.current;
    const idx = prev.findIndex((p) => p.id === id);
    if (idx === -1) return;
    const page = prev[idx];
    const { notes, links } = mutator(page.notes, page.links);

    let next: Page[];
    let nextActiveId = id;
    if (seedPageIds.has(page.id)) {
      nextActiveId = crypto.randomUUID();
      next = [
        ...prev,
        {
          id: nextActiveId,
          name: `Page ${prev.length + 1}`,
          width: page.width,
          height: page.height,
          origin: page.origin ?? page.id,
          notes,
          links,
        },
      ];
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
  });

  const handleZoomIn = () =>
    setZoom((z) => Math.min(ZOOM_MAX, Math.round((z + ZOOM_STEP) * 100) / 100));
  const handleZoomOut = () =>
    setZoom((z) => Math.max(minZoom, Math.round((z - ZOOM_STEP) * 100) / 100));

  useEffect(() => {
    Object.entries(dragInstRef.current).forEach(([id, inst]) => {
      if (id === editingId) inst.disable();
      else inst.enable();
    });
  }, [editingId]);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduced) return;
    drawWires(canvas, wireRefs.current, hitRefs.current, activePage.links, zoomRef.current);
  }, [activePage.links, activePageId, reduced]);

  const onWireEnter = (linkId: string, path: SVGPathElement) => {
    keepHoverDelete();
    const len = path.getTotalLength();
    const pt = path.getPointAtLength(len / 2);
    setHoverDelete({ id: linkId, x: pt.x, y: pt.y });
  };

  const keepHoverDelete = () => {
    if (hoverDeleteTimer.current === null) return;
    globalThis.clearTimeout(hoverDeleteTimer.current);
    hoverDeleteTimer.current = null;
  };

  const openEdit = (node: Note) => {
    setDraft({ label: node.label, sub: node.sub });
    setEditingId(node.id);
  };

  const updateDraftLabel = (label: string) =>
    setDraft((d) => ({ ...d, label }));
  const updateDraftSub = (sub: string) => setDraft((d) => ({ ...d, sub }));

  const commitEdit = () => {
    if (!editingId) return;
    const id = editingId;
    withActivePage((notes, links) => ({
      notes: notes.map((n) =>
        n.id === id ? { ...n, label: draft.label, sub: draft.sub } : n,
      ),
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
    withActivePage((notes, links) => ({
      notes,
      links: links.filter((l) => l.id !== id),
    }));
    setHoverDelete(null);
  };

  const handleAddNote = () => {
    const id = crypto.randomUUID();
    withActivePage((notes, links) => ({
      notes: [
        ...notes,
        {
          id,
          label: "New note",
          sub: "",
          kind: "fx",
          x: canvasW * 0.38 + Math.random() * canvasW * 0.24,
          y: canvasH * 0.3 + Math.random() * canvasH * 0.4,
        },
      ],
      links,
    }));
    openEdit({ id, label: "New note", sub: "", kind: "fx", x: 0, y: 0 });
  };

  const handleAddPage = () => {
    const id = crypto.randomUUID();
    setPages((prev) => {
      const next = [
        ...prev,
        { id, name: `Page ${prev.length + 1}`, notes: [], links: [] },
      ];
      pagesRef.current = next;
      return next;
    });
    activePageIdRef.current = id;
    setActivePageId(id);
  };

  const handleResetPage = () => {
    const page = activePage;
    const seed = studio.pages.find((sp) => sp.id === page.origin);
    if (!seed) return;
    const next = pagesRef.current.map((p) =>
      p.id !== page.id
        ? p
        : {
            ...p,
            width: seed.width,
            height: seed.height,
            notes: seed.nodes.map((n) => ({ ...n })),
            links: seed.links.map((l, i) => ({ id: `${seed.id}-seed-${i}`, ...l })),
          },
    );
    pagesRef.current = next;
    setPages(next);
    setEditingId(null);
    setHoverDelete(null);
  };

  const handleDownload = async () => {
    const stage = stageRef.current;
    if (!stage) return;
    try {
      const dataUrl = await toPng(stage, {
        backgroundColor: "#101010",
        pixelRatio: 2,
        filter: (node) => node !== hintRef.current,
      });
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `studio-${activePage.name.toLowerCase().replace(/\s+/g, "-")}.png`;
      link.click();
    } catch {
      // Export can fail on some browsers/fonts — nothing else to do about it.
    }
  };

  const clearHoverDelete = () => {
    keepHoverDelete();
    hoverDeleteTimer.current = globalThis.setTimeout(
      () => setHoverDelete(null),
      150,
    );
  };

  return (
    <section
      id="studio"
      ref={root}
      className="relative bg-ink px-6 py-28 md:px-12"
    >
      <div className="mx-auto mb-12 flex max-w-6xl flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="flex items-center gap-3 text-sm font-medium tracking-[0.4em] text-flame uppercase">
            <span className="h-px w-8 bg-flame/60" />
            {t("studio.kicker")}
          </p>
          <h2
            data-skew
            className="font-display mt-3 text-5xl leading-none uppercase md:text-7xl"
          >
            {t("studio.title")}
          </h2>
        </div>
        <p className="max-w-xs text-sm font-light text-paper/50 md:text-right">
          {t("studio.hint")}
        </p>
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
        className="studio-stage relative mx-auto h-[60vh] w-full max-w-7xl overflow-hidden rounded-3xl border-2 border-paper/15 bg-[#101010] md:h-[80vh]"
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
              notes: studio.pages[0].nodes,
              links: studio.pages[0].links.map((l, i) => ({ id: `seed-${i}`, ...l })),
              width: canvasSize(studio.pages[0]).w,
              height: canvasSize(studio.pages[0]).h,
              interactive: false,
              editingId: null,
              draft,
              hoverDelete: null,
              wireRefs,
              hitRefs,
              pendingRef,
              onWireEnter,
              clearHoverDelete,
              keepHoverDelete,
              handleDeleteLink,
              openEdit,
              handleDeleteNote,
              updateDraftLabel,
              updateDraftSub,
              commitEdit,
            })}
            <div className="pointer-events-none absolute bottom-[20px] left-1/2 -translate-x-1/2 text-[12px] tracking-[0.25em] text-paper/40 uppercase">
              {studio.footnote}
            </div>
          </>
        ) : (
          <>
            {activePage.origin && (
              <button
                type="button"
                onClick={handleResetPage}
                aria-label={studio.resetLabel}
                className="absolute top-[20px] right-[20px] z-30 cursor-pointer rounded-full border border-paper/20 bg-ink/60 px-[16px] py-[6px] text-[12px] font-medium tracking-[0.15em] text-paper/70 uppercase backdrop-blur-sm hover:border-flame hover:text-flame"
              >
                {studio.resetLabel}
              </button>
            )}

            <div ref={zoomLayerRef} className="absolute inset-0 origin-top-left">
              <div
                ref={canvasRef}
                className="absolute top-0 left-0 will-change-transform"
                style={{ width: canvasW, height: canvasH }}
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
                  <span
                    ref={watermarkRef}
                    className="font-display pointer-events-none absolute top-[40%] left-[48%] text-[480px] leading-none text-paper/3 uppercase will-change-transform"
                  >
                    {studio.watermark}
                  </span>
                </div>

                {renderBoard({
                  notes: activePage.notes,
                  links: activePage.links,
                  width: canvasW,
                  height: canvasH,
                  interactive: true,
                  editingId,
                  draft,
                  hoverDelete,
                  wireRefs,
                  hitRefs,
                  pendingRef,
                  onWireEnter,
                  clearHoverDelete,
                  keepHoverDelete,
                  handleDeleteLink,
                  openEdit,
                  handleDeleteNote,
                  updateDraftLabel,
                  updateDraftSub,
                  commitEdit,
                })}
              </div>
            </div>

            <div
              ref={hintRef}
              className="pointer-events-none absolute bottom-[20px] left-1/2 flex -translate-x-1/2 items-center gap-[8px] rounded-full border border-paper/15 bg-ink/60 px-[16px] py-[8px] text-[12px] tracking-[0.25em] text-paper/60 uppercase backdrop-blur-sm"
            >
              <span className="text-flame">⟿</span>
              {studio.dragHint} · drag the wall to roam
            </div>

            <div className="absolute right-[20px] bottom-[20px] z-30 flex flex-col gap-[6px]">
              <button
                type="button"
                onClick={handleZoomIn}
                disabled={zoom >= ZOOM_MAX}
                aria-label="Zoom in"
                className="flex h-[36px] w-[36px] cursor-pointer items-center justify-center rounded-full border border-paper/20 bg-ink/60 text-[16px] text-paper/70 backdrop-blur-sm hover:border-flame hover:text-flame disabled:cursor-not-allowed disabled:opacity-30"
              >
                +
              </button>
              <button
                type="button"
                onClick={handleZoomOut}
                disabled={zoom <= minZoom}
                aria-label="Zoom out"
                className="flex h-[36px] w-[36px] cursor-pointer items-center justify-center rounded-full border border-paper/20 bg-ink/60 text-[16px] text-paper/70 backdrop-blur-sm hover:border-flame hover:text-flame disabled:cursor-not-allowed disabled:opacity-30"
              >
                −
              </button>
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
        </div>
      )}
    </section>
  );
}
