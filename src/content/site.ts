export const brand = {
  name: "Diotek",
  tagline: "Full-stack development studio",
};

export type NavItem = { label: string; href?: string; panel?: "contact" };

export const nav: NavItem[] = [
  { label: "Insights", href: "#showcase" },
  { label: "Services", href: "#features" },
  { label: "Approach", href: "#approach" },
  { label: "About", href: "#stats" },
  { label: "Contact", panel: "contact" },
];

export const contactPanel = {
  eyebrow: "Get in touch",
  title: "Tell us about your project",
  fields: {
    name: { label: "What is your name?", placeholder: "Full Name" },
    email: { label: "What is your email?", placeholder: "Email Address" },
    company: {
      label: "What is the name of your company?",
      placeholder: "Company Name",
    },
    message: {
      label: "Tell us a bit more about your project",
      placeholder: "We are looking to…",
    },
  },
  submit: "Send message",
};

export const hero = {
  kicker: "Full-stack development studio",
  titleLines: ["Build it", "right"],
  accentWord: "right",
  subtitle: "We design, build and ship fast, polished web products — from landing pages to full-stack apps.",
  scrollHint: "Scroll to see how",
  metaTopLeft: "Available for work",
  metaTopRight: "React / TypeScript / Node",
  metaBottom: "Remote — worldwide",
};

export const manifesto =
  "We treat every project like it's our own product. Clean code, fast load times, and pixel-true interfaces — no shortcuts, no excuses.";

export const marqueeWords = [
  "REACT",
  "TYPESCRIPT",
  "NODE",
  "API",
  "SHIP",
  "SCALE",
  "DEPLOY",
  "CLEAN CODE",
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
  kicker: "How we work",
  title: "Sketch how it's built",
  hint: "Drag the notes, wire outputs to inputs, edit the text — make it your own diagram.",
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

export const featuresIntro = {
  kicker: "What we do",
  heading: "Built to ship",
  body: "Four ways we help clients turn an idea into a live, working product.",
};

export const features = [
  {
    no: "01",
    title: "Frontend & interfaces",
    body: "Pixel-true UI built in React — fast, accessible, and animated when it earns its place.",
  },
  {
    no: "02",
    title: "Full-stack web apps",
    body: "End-to-end products: frontend, backend, database and auth, shipped as one cohesive build.",
  },
  {
    no: "03",
    title: "Landing pages",
    body: "Conversion-focused sites for businesses — clear copy, fast load, built to bring in clients.",
  },
  {
    no: "04",
    title: "Backend & API",
    body: "Server-side logic, APIs and third-party integrations that are reliable under real traffic.",
  },
];

export const showcaseIntro = {
  kicker: "Insights",
  title: "What we know",
  body: "A few things worth understanding before you hire anyone to build a website — explained the way we'd explain them to a client.",
  scrollHint: "Scroll sideways",
};

export const showcaseOutro = {
  headingLines: ["We do", "it all"],
  cta: "Start a project ↗",
};

export const showcase = [
  {
    no: "01",
    title: "Types of websites",
    tag: "Strategy",
    body: "Landing page, corporate site, online store, or full web app — each solves a different problem, and picking the wrong one wastes budget.",
    detail:
      "A landing page sells one thing fast. A corporate site builds trust and answers questions. An online store handles catalog, cart and checkout. A web app (or SaaS) is a tool your users log into and use over and over. We start every project by working out which of these you actually need — before any design or code happens.",
  },
  {
    no: "02",
    title: "Frontend vs backend vs full-stack",
    tag: "Architecture",
    body: "Frontend is what users see and click. Backend is the logic, data and security behind it. Full-stack means one team owns both, end to end.",
    detail:
      "Frontend covers layout, interaction and everything rendered in the browser. Backend covers the server, database, business logic and authentication that the frontend talks to. Hiring separately for each often means slow handoffs and finger-pointing when something breaks. We build both ourselves, so the whole product is one team's responsibility.",
  },
  {
    no: "03",
    title: "Speed & SEO",
    tag: "Performance",
    body: "A slow site loses visitors before they see your content, and search engines notice the same thing — speed and findability are the same problem.",
    detail:
      "Every extra second of load time costs conversions, and Google factors page speed directly into search ranking. Technical performance — image sizing, code splitting, server response time, clean markup — isn't a nice-to-have polish step, it's the foundation that decides whether people ever reach your message at all.",
  },
  {
    no: "04",
    title: "DevOps & deployment",
    tag: "Operations",
    body: "Writing the code is half the job — deploying it safely, monitoring it in production, and shipping updates is the other half.",
    detail:
      "A finished codebase isn't a finished product. It needs a reliable deployment pipeline, monitoring to catch problems before users do, and a safe way to ship updates without downtime. We set this up as part of every build, so launch day isn't where the relationship ends.",
  },
];

export const approach = [
  {
    no: "01",
    title: "Discovery",
    body: "We map the real problem before writing a line of code — what the product needs to do, and why it matters to your users.",
    tone: "ink",
  },
  {
    no: "02",
    title: "Design",
    body: "Clear structure and intentional layouts. Interfaces that make sense at a glance and hold up under real use.",
    tone: "flame",
  },
  {
    no: "03",
    title: "Build",
    body: "Clean, typed code — built to be maintained, not just demoed. Every piece reviewed against the original brief.",
    tone: "ink",
  },
  {
    no: "04",
    title: "Ship & support",
    body: "Performance-first and accessible by default, deployed with monitoring in place — and we stay reachable after launch.",
    tone: "flame",
  },
];

export const statsIntro = {
  kicker: "By the numbers",
  heading: "Proof, not promises",
  body: "A track record built across real client projects, not slideware.",
};

export const stats = [
  { value: 6, suffix: "+", label: "years building software" },
  { value: 40, suffix: "+", label: "projects shipped" },
  { value: 99, suffix: "%", label: "on-time delivery" },
  { value: 100, suffix: "%", label: "client satisfaction" },
];

export const magicSection = {
  topLines: ["", ""],
  bottomLines: ["", ""],
  phrase: "Ready to *build something real?*",
};

export const cta = {
  eyebrow: "Ready?",
  title: "Let's build it",
  subtitle: "Tell us what you're building. No credit card, no ceremony — just a conversation.",
  button: "Start a project",
};

export const footer = {
  note: "Available for freelance and contract work.",
  links: ["Email", "GitHub", "LinkedIn", "Telegram"],
};
