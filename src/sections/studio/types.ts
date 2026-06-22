import type { StudioNode } from "../../content/site";

export type Pt = { x: number; y: number };

export type Note = {
  id: string;
  label: string;
  sub: string;
  kind: StudioNode["kind"];
  x: number;
  y: number;
};

export type Link = { id: string; from: string; to: string };

export type Page = { id: string; name: string; notes: Note[]; links: Link[] };
