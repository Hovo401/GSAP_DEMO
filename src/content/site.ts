export const brand = {
  name: "Diotek",
};

export type NavItem = {
  key: "insights" | "services" | "approach" | "about" | "contact";
  href?: string;
  panel?: "contact";
};

export const nav: NavItem[] = [
  { key: "insights", href: "#showcase" },
  { key: "services", href: "#features" },
  { key: "approach", href: "#approach" },
  { key: "about", href: "#stats" },
  { key: "contact", panel: "contact" },
];

export type StudioNode = {
  id: string;
  label: string;
  sub: string;
  kind: "in" | "fx" | "out";
  /** Absolute pixel position on the page's board (see studio/geometry.ts canvasSize). */
  x: number;
  y: number;
};

export type StudioLink = { from: string; to: string };

export type StudioPage = {
  id: string;
  name: string;
  width?: number;
  height?: number;
  nodes: StudioNode[];
  links: StudioLink[];
};

export const studio = {
  watermark: "Studio",
  footnote: "The build pipeline behind every Diotek project.",
  dragHint: "Drag a port to connect",
  addNoteLabel: "Add note",
  downloadLabel: "Download image",
  resetLabel: "Reset",
  pageLabel: "Page",
  newPageLabel: "New page",
  editLabel: "Edit",
  saveLabel: "Save",
  deleteLabel: "Delete",
  pages: [
    {
      id: "page-1",
      name: "Web App",
      nodes: [
        {
          id: "brief",
          label: "Brief",
          sub: "your goals, mapped",
          kind: "in",
          x: 102,
          y: 575,
        },
        {
          id: "design",
          label: "Design",
          sub: "Figma, pixel-true",
          kind: "fx",
          x: 425,
          y: 368,
        },
        {
          id: "frontend",
          label: "Frontend",
          sub: "React, built to last",
          kind: "fx",
          x: 425,
          y: 782,
        },
        {
          id: "backend",
          label: "Backend",
          sub: "API, database, auth",
          kind: "fx",
          x: 765,
          y: 575,
        },
        {
          id: "performance",
          label: "Performance",
          sub: "fast load, no jank",
          kind: "fx",
          x: 1105,
          y: 368,
        },
        {
          id: "testing",
          label: "Testing",
          sub: "checked, not hoped",
          kind: "fx",
          x: 1105,
          y: 782,
        },
        {
          id: "livesite",
          label: "Live Site",
          sub: "yours, today",
          kind: "out",
          x: 1445,
          y: 575,
        },
      ],
      links: [
        { from: "brief", to: "design" },
        { from: "brief", to: "frontend" },
        { from: "design", to: "backend" },
        { from: "frontend", to: "backend" },
        { from: "backend", to: "performance" },
        { from: "backend", to: "testing" },
        { from: "performance", to: "livesite" },
        { from: "testing", to: "livesite" },
      ],
    },
    {
      id: "page-2",
      name: "Agile",
      width: 2800,
      height: 1300,
      nodes: [
        {
          id: "brief",
          label: "Brief",
          sub: "your idea, scoped",
          kind: "in",
          x: 392,
          y: 650,
        },
        {
          id: "discovery",
          label: "Discovery",
          sub: "risk mapped early",
          kind: "fx",
          x: 672,
          y: 806,
        },
        {
          id: "design",
          label: "Design",
          sub: "proven before built",
          kind: "fx",
          x: 952,
          y: 364,
        },
        {
          id: "prototype",
          label: "Prototype",
          sub: "click it first",
          kind: "fx",
          x: 952,
          y: 962,
        },
        {
          id: "sprint",
          label: "Sprint",
          sub: "two weeks, shippable",
          kind: "fx",
          x: 1260,
          y: 598,
        },
        {
          id: "build",
          label: "Build",
          sub: "reviewed daily",
          kind: "fx",
          x: 1568,
          y: 338,
        },
        {
          id: "qa",
          label: "QA",
          sub: "broken on purpose",
          kind: "fx",
          x: 1568,
          y: 962,
        },
        {
          id: "review",
          label: "Review",
          sub: "you steer it",
          kind: "fx",
          x: 1904,
          y: 702,
        },
        {
          id: "staging",
          label: "Staging",
          sub: "feels real first",
          kind: "fx",
          x: 2156,
          y: 858,
        },
        {
          id: "launch",
          label: "Launch",
          sub: "on time, always",
          kind: "out",
          x: 2408,
          y: 390,
        },
        {
          id: "support",
          label: "Support",
          sub: "we stay after",
          kind: "out",
          x: 2408,
          y: 936,
        },
      ],
      links: [
        { from: "brief", to: "discovery" },
        { from: "discovery", to: "design" },
        { from: "discovery", to: "prototype" },
        { from: "design", to: "sprint" },
        { from: "prototype", to: "sprint" },
        { from: "sprint", to: "build" },
        { from: "sprint", to: "qa" },
        { from: "build", to: "review" },
        { from: "qa", to: "review" },
        { from: "review", to: "sprint" },
        { from: "review", to: "staging" },
        { from: "staging", to: "launch" },
        { from: "staging", to: "support" },
      ],
    },
  ] satisfies StudioPage[],
};

export const approachTones: ("ink" | "flame")[] = ["ink", "flame", "ink", "flame"];

export const stats = [
  { value: 6, suffix: "+" },
  { value: 40, suffix: "+" },
  { value: 99, suffix: "%" },
  { value: 100, suffix: "%" },
];

export const magicSection = {
  topLines: ["", ""],
  bottomLines: ["", ""],
};
