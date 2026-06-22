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

export const studio = {
  kicker: "How we build",
  title: "Sketch how it moves",
  hint: "Drag the notes, wire outputs to inputs, edit the text — make it your own diagram.",
  watermark: "MOTION",
  dragHint: "Drag a port to connect",
  addNoteLabel: "Add note",
  downloadLabel: "Download image",
  resetLabel: "Reset",
  pageLabel: "Page",
  newPageLabel: "New page",
  editLabel: "Edit",
  saveLabel: "Save",
  deleteLabel: "Delete",
  nodes: [
    {
      id: "scroll",
      label: "Scroll",
      sub: "the input",
      kind: "in",
      x: 4,
      y: 28,
    },
    {
      id: "pin",
      label: "Pin",
      sub: "hold the scene",
      kind: "fx",
      x: 26,
      y: 62,
    },
    {
      id: "stagger",
      label: "Stagger",
      sub: "sequence it",
      kind: "fx",
      x: 47,
      y: 22,
    },
    {
      id: "reveal",
      label: "Reveal",
      sub: "bring it in",
      kind: "fx",
      x: 64,
      y: 58,
    },
    {
      id: "ship",
      label: "Ship",
      sub: "60fps, accessible",
      kind: "out",
      x: 82,
      y: 26,
    },
  ] satisfies StudioNode[],
  links: [
    { from: "scroll", to: "pin" },
    { from: "pin", to: "stagger" },
    { from: "stagger", to: "reveal" },
    { from: "reveal", to: "ship" },
  ] satisfies StudioLink[],
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
