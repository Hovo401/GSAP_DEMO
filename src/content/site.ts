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
  x: number;
  y: number;
};

export type StudioLink = { from: string; to: string };

export type StudioPage = {
  id: string;
  name: string;
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
      name: "Page 1",
      nodes: [
        {
          id: "brief",
          label: "Brief",
          sub: "your goals, mapped",
          kind: "in",
          x: 6,
          y: 50,
        },
        {
          id: "design",
          label: "Design",
          sub: "Figma, pixel-true",
          kind: "fx",
          x: 25,
          y: 32,
        },
        {
          id: "motion",
          label: "Motion",
          sub: "GSAP scroll magic",
          kind: "fx",
          x: 25,
          y: 68,
        },
        {
          id: "build",
          label: "Build",
          sub: "React, built to last",
          kind: "fx",
          x: 45,
          y: 50,
        },
        {
          id: "performance",
          label: "Performance",
          sub: "60fps, sub-second load",
          kind: "fx",
          x: 65,
          y: 32,
        },
        {
          id: "seo",
          label: "SEO",
          sub: "found, not just built",
          kind: "fx",
          x: 65,
          y: 68,
        },
        {
          id: "livesite",
          label: "Live Site",
          sub: "yours, today",
          kind: "out",
          x: 85,
          y: 50,
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
      nodes: [
        {
          id: "brief",
          label: "Brief",
          sub: "your idea, scoped",
          kind: "in",
          x: 5,
          y: 50,
        },
        {
          id: "discovery",
          label: "Discovery",
          sub: "risk mapped early",
          kind: "fx",
          x: 17,
          y: 62,
        },
        {
          id: "design",
          label: "Design",
          sub: "proven before built",
          kind: "fx",
          x: 30,
          y: 28,
        },
        {
          id: "prototype",
          label: "Prototype",
          sub: "click it first",
          kind: "fx",
          x: 30,
          y: 74,
        },
        {
          id: "sprint",
          label: "Sprint",
          sub: "two weeks, shippable",
          kind: "fx",
          x: 44,
          y: 46,
        },
        {
          id: "build",
          label: "Build",
          sub: "reviewed daily",
          kind: "fx",
          x: 58,
          y: 26,
        },
        {
          id: "qa",
          label: "QA",
          sub: "broken on purpose",
          kind: "fx",
          x: 58,
          y: 74,
        },
        {
          id: "review",
          label: "Review",
          sub: "you steer it",
          kind: "fx",
          x: 72,
          y: 54,
        },
        {
          id: "staging",
          label: "Staging",
          sub: "feels real first",
          kind: "fx",
          x: 84,
          y: 66,
        },
        {
          id: "launch",
          label: "Launch",
          sub: "on time, always",
          kind: "out",
          x: 95,
          y: 30,
        },
        {
          id: "support",
          label: "Support",
          sub: "we stay after",
          kind: "out",
          x: 95,
          y: 72,
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
  },
  {
    no: "02",
    title: "Meridian",
    tag: "Brand site",
    body: "A brand world rebuilt for motion. Bold type, fluid transitions, and a homepage that grabs attention from the first frame and never lets the eye rest.",
  },
  {
    no: "03",
    title: "Halcyon",
    tag: "Editorial",
    body: "An editorial platform where reading feels alive. Typographic reveals and parallax imagery add depth without ever fighting the content itself.",
  },
  {
    no: "04",
    title: "Vantage",
    tag: "Case study",
    body: "A data story told through scroll. Animated counters and staged reveals turn dense numbers into a narrative anyone can follow at a glance.",
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
  topLines: [
    "How was your visit",
    "Don't forget to reach out to let me know what you think",
  ],
  bottomLines: [
    "And if you want to create magic",
    "Get in touch and we'll see how we can help",
  ],
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
