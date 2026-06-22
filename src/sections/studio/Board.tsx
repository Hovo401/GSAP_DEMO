import type { RefObject } from "react";
import { studio, type StudioNode } from "../../content/site";
import { CANVAS_W, CANVAS_H, hasInput, hasOutput } from "./geometry";
import type { Note, Link } from "./types";

export const KIND_META: Record<StudioNode["kind"], { label: string; color: string }> = {
  in: { label: "input", color: "text-emerald-400" },
  out: { label: "output", color: "text-flame" },
  fx: { label: "effect", color: "text-paper/40" },
};

type BoardProps = {
  notes: Note[];
  links: Link[];
  interactive: boolean;
  editingId: string | null;
  draft: { label: string; sub: string };
  hoverDelete: { id: string; x: number; y: number } | null;
  wireRefs: RefObject<Record<string, SVGPathElement | null>>;
  hitRefs: RefObject<Record<string, SVGPathElement | null>>;
  pendingRef: RefObject<SVGPathElement | null>;
  onWireEnter: (linkId: string, path: SVGPathElement) => void;
  clearHoverDelete: () => void;
  handleDeleteLink: (id: string) => void;
  openEdit: (node: Note) => void;
  handleDeleteNote: (id: string) => void;
  updateDraftLabel: (v: string) => void;
  updateDraftSub: (v: string) => void;
  commitEdit: () => void;
};

// Shared board content (SVG wires + notes), reused by both the interactive
// and reduced-motion modes. Kept at module scope (rather than as a closure
// inside the component) so its JSX-nested handlers stay shallow.
export function renderBoard(props: BoardProps) {
  const {
    notes,
    links,
    interactive,
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
  } = props;

  return (
    <>
      <svg
        className="pointer-events-none absolute top-0 left-0"
        width={interactive ? CANVAS_W : "100%"}
        height={interactive ? CANVAS_H : "100%"}
      >
        {links.map((link) => (
          <path
            key={link.id}
            ref={(el) => {
              wireRefs.current[link.id] = el;
            }}
            fill="none"
            className="opacity-60"
            style={{ stroke: "var(--color-flame)", strokeWidth: 2.5 }}
            strokeLinecap="round"
          />
        ))}
        {interactive &&
          links.map((link) => (
            <path
              key={`hit-${link.id}`}
              ref={(el) => {
                hitRefs.current[link.id] = el;
              }}
              fill="none"
              stroke="transparent"
              strokeWidth={16}
              style={{ pointerEvents: "stroke", cursor: "pointer" }}
              onPointerEnter={(e) => onWireEnter(link.id, e.currentTarget)}
              onPointerLeave={clearHoverDelete}
            />
          ))}
        {interactive && (
          <path
            ref={pendingRef}
            fill="none"
            style={{ stroke: "var(--color-flame)", strokeWidth: 2.5, opacity: 0 }}
            strokeDasharray="6 7"
            strokeLinecap="round"
          />
        )}
      </svg>

      {interactive && hoverDelete && (
        <button
          type="button"
          aria-label={studio.deleteLabel}
          onClick={() => handleDeleteLink(hoverDelete.id)}
          onMouseLeave={clearHoverDelete}
          style={{ left: hoverDelete.x, top: hoverDelete.y }}
          className="absolute z-30 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-flame bg-ink text-xs text-flame hover:bg-flame hover:text-ink"
        >
          ×
        </button>
      )}

      {notes.map((node) =>
        renderNote(node, {
          interactive,
          isEditing: interactive && editingId === node.id,
          draft,
          openEdit,
          handleDeleteNote,
          updateDraftLabel,
          updateDraftSub,
          commitEdit,
        }),
      )}
    </>
  );
}

function renderNote(
  node: Note,
  opts: {
    interactive: boolean;
    isEditing: boolean;
    draft: { label: string; sub: string };
    openEdit: (node: Note) => void;
    handleDeleteNote: (id: string) => void;
    updateDraftLabel: (v: string) => void;
    updateDraftSub: (v: string) => void;
    commitEdit: () => void;
  },
) {
  const { interactive, isEditing, draft, openEdit, handleDeleteNote, updateDraftLabel, updateDraftSub, commitEdit } =
    opts;
  const meta = KIND_META[node.kind];

  return (
    <div
      key={node.id}
      data-node={node.id}
      className={`studio-node absolute z-10 ${
        interactive ? "cursor-grab touch-none active:cursor-grabbing" : ""
      }`}
      style={{ left: `${node.x}%`, top: `${node.y}%` }}
    >
      <div className="node-card relative w-44 rounded-xl border border-paper/20 bg-[#191919] px-5 py-4 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)] md:w-52">
        {interactive && !isEditing && (
          <div onPointerDown={(e) => e.stopPropagation()} className="absolute top-2 right-2 flex gap-1">
            <button
              type="button"
              aria-label={studio.editLabel}
              onClick={() => openEdit(node)}
              className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-paper/40 hover:bg-paper/10 hover:text-paper"
            >
              ✎
            </button>
            <button
              type="button"
              aria-label={studio.deleteLabel}
              onClick={() => handleDeleteNote(node.id)}
              className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-paper/40 hover:bg-paper/10 hover:text-flame"
            >
              ✕
            </button>
          </div>
        )}

        {isEditing ? (
          <div onPointerDown={(e) => e.stopPropagation()} className="flex flex-col gap-2 pt-1">
            <input
              value={draft.label}
              onChange={(e) => updateDraftLabel(e.target.value)}
              placeholder="Label"
              className="rounded border border-paper/20 bg-ink px-2 py-1 text-sm text-paper outline-none focus:border-flame"
            />
            <input
              value={draft.sub}
              onChange={(e) => updateDraftSub(e.target.value)}
              placeholder="Note"
              className="rounded border border-paper/20 bg-ink px-2 py-1 text-xs text-paper/70 outline-none focus:border-flame"
            />
            <button
              type="button"
              onClick={commitEdit}
              className="cursor-pointer self-end rounded-full bg-flame px-3 py-1 text-xs font-bold tracking-widest text-ink uppercase"
            >
              {studio.saveLabel}
            </button>
          </div>
        ) : (
          <>
            <span className={`text-[0.6rem] font-bold tracking-[0.25em] uppercase ${meta.color}`}>
              {meta.label}
            </span>
            <p className="font-display mt-1 text-2xl leading-[0.95] text-paper uppercase wrap-break-word hyphens-auto md:text-3xl">
              {node.label}
            </p>
            {node.sub && (
              <p className="mt-1 text-xs font-light wrap-break-word text-paper/45">{node.sub}</p>
            )}
          </>
        )}

        {hasInput(node.kind) && (
          <span
            data-port={`${node.id}:in`}
            className="absolute top-1/2 left-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-flame bg-ink"
          />
        )}
        {hasOutput(node.kind) && (
          <span
            data-port={`${node.id}:out`}
            className={`absolute top-1/2 right-0 h-4 w-4 translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-flame bg-flame/80 ${
              interactive ? "cursor-crosshair" : ""
            }`}
          />
        )}
      </div>
    </div>
  );
}
