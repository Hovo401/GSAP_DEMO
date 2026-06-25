export const brand = {
  name: "MOTIVE",
  tagline: "Motion design engine",
};

export type NavItem = { label: string; href?: string; panel?: "contact" };

export const nav: NavItem[] = [
  { label: "Work", href: "#showcase" },
  { label: "Services", href: "#features" },
  { label: "Approach", href: "#approach" },
  { label: "About", href: "#stats" },
  { label: "Contact", panel: "contact" },
];

export const contactPanel = {
  eyebrow: "Contact us",
  title: "Have a project you’d like to talk about?",
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
  kicker: "Motion design engine",
  titleLines: ["Animate", "anything"],
  accentWord: "anything",
  subtitle: "Ship buttery scroll experiences without fighting the timeline.",
  scrollHint: "Scroll to feel it",
};

export const manifesto =
  "We build the web's future, pixel by pixel. Obsessive about detail, ruthless about smoothness — that is the whole point.";

export const marqueeWords = [
  "SCROLL",
  "PIN",
  "PARALLAX",
  "STAGGER",
  "SCRUB",
  "TIMELINE",
  "EASE",
  "REVEAL",
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
  kicker: "How we build",
  title: "Sketch how it moves",
  hint: "Drag the notes, wire outputs to inputs, edit the text — make it your own diagram.",
  watermark: "Studio",
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
      name: "SITE",
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
          id: "motion",
          label: "Motion",
          sub: "GSAP scroll magic",
          kind: "fx",
          x: 425,
          y: 782,
        },
        {
          id: "build",
          label: "Build",
          sub: "React, built to last",
          kind: "fx",
          x: 765,
          y: 575,
        },
        {
          id: "performance",
          label: "Performance",
          sub: "60fps, sub-second load",
          kind: "fx",
          x: 1105,
          y: 368,
        },
        {
          id: "seo",
          label: "SEO",
          sub: "found, not just built",
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
        { from: "brief", to: "motion" },
        { from: "design", to: "build" },
        { from: "motion", to: "build" },
        { from: "build", to: "performance" },
        { from: "build", to: "seo" },
        { from: "performance", to: "livesite" },
        { from: "seo", to: "livesite" },
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

export const features = [
  {
    no: "01",
    title: "Scroll-linked timelines",
    body: "Bind any timeline to scroll progress with a single scrub value. No math, no jank.",
  },
  {
    no: "02",
    title: "Pin & release",
    body: "Pin sections in place while content plays out, then hand scroll back seamlessly.",
  },
  {
    no: "03",
    title: "Split & stagger",
    body: "Break headlines into lines, words or chars and reveal them with one call.",
  },
  {
    no: "04",
    title: "Reduced-motion aware",
    body: "Respects user preferences out of the box — accessible by default, premium by choice.",
  },
];

export const showcaseIntro = {
  kicker: "Selected work",
  title: "Our work",
  body: "Teams trust MOTIVE to push creative boundaries and move fast when it matters — buttery scroll work, shipped.",
};

export const showcase = [
  {
    no: "01",
    title: "Aurora",
    tag: "Product launch",
    body: "A launch site built to convert. Scroll-linked product reveals and pinned feature beats keep visitors moving toward the buy — every frame earns the next scroll.",
    detail:
      "Built in six weeks alongside the product team, the launch site pairs a horizontal feature reel with a sticky add-to-cart bar. Conversion lifted 34% over the static page it replaced.",
  },
  {
    no: "02",
    title: "Meridian",
    tag: "Brand site",
    body: "A brand world rebuilt for motion. Bold type, fluid transitions, and a homepage that grabs attention from the first frame and never lets the eye rest.",
    detail:
      "The homepage swaps in three hero treatments depending on referrer, but every path lands on the same physics-driven type system — built once, reused across every campaign page since.",
  },
  {
    no: "03",
    title: "Halcyon",
    tag: "Editorial",
    body: "An editorial platform where reading feels alive. Typographic reveals and parallax imagery add depth without ever fighting the content itself.",
    detail:
      "Each article gets its own pacing: drop caps animate in, inline imagery parallaxes against the reading column, and a progress rail tracks how far there is left to go.",
  },
  {
    no: "04",
    title: "Vantage",
    tag: "Case study",
    body: "A data story told through scroll. Animated counters and staged reveals turn dense numbers into a narrative anyone can follow at a glance.",
    detail:
      "Three years of usage data compressed into a single scroll: counters tick up against scrubbed line charts, and every section ends on the number that mattered most to the client.",
  },
];

export const approach = [
  {
    no: "01",
    title: "Strategy",
    body: "We map the scroll story before a single pixel moves — what the visitor should feel at every beat, and exactly why it matters.",
    tone: "ink",
  },
  {
    no: "02",
    title: "Design",
    body: "Bold, brutal layouts with intent. Type that commands the page and structure that earns every single scroll.",
    tone: "flame",
  },
  {
    no: "03",
    title: "Motion",
    body: "Every transition tuned by hand — scrubbed to scroll, eased for weight, never janky and never gratuitous.",
    tone: "ink",
  },
  {
    no: "04",
    title: "Ship",
    body: "Performance-first and accessible by default. Reduced-motion aware, sixty frames a second, ready for real users.",
    tone: "flame",
  },
];

export const stats = [
  { value: 120, suffix: "fps", label: "buttery target" },
  { value: 40, suffix: "k+", label: "sites shipped" },
  { value: 9, suffix: "ms", label: "median frame" },
  { value: 100, suffix: "%", label: "scroll-native" },
];

export const pricing = [
  {
    name: "Solo",
    price: "$0",
    period: "forever",
    features: ["1 project", "Core scroll triggers", "Community support"],
    cta: "Start free",
    featured: false,
  },
  {
    name: "Studio",
    price: "$24",
    period: "/ month",
    features: [
      "Unlimited projects",
      "All plugins unlocked",
      "Pin & SplitText",
      "Priority support",
    ],
    cta: "Go Studio",
    featured: true,
  },
  {
    name: "Agency",
    price: "Let's talk",
    period: "",
    features: ["Everything in Studio", "Team seats", "Onboarding", "SLA"],
    cta: "Contact us",
    featured: false,
  },
];

export const magicSection = {
  topLines: ["", ""],
  bottomLines: ["", ""],
  phrase: "Ready to create *maaaaaaaaaagic?*",
};

export const cta = {
  title: "Make it move",
  subtitle: "Start animating in minutes. No credit card, no ceremony.",
  button: "Get MOTIVE",
};

export const footer = {
  note: "Built as a GSAP scroll demo.",
  links: ["Twitter", "GitHub", "Dribbble", "Email"],
};
