// All landing copy lives here. Rebrand the whole site by editing this file.

export const brand = {
  name: "MOTIVE",
  tagline: "Motion design engine",
};

export const nav = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "Showcase", href: "#showcase" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#cta" },
];

export const hero = {
  kicker: "Motion design engine",
  // Split into lines for the SplitText reveal.
  titleLines: ["Animate", "anything"],
  accentWord: "anything",
  subtitle: "Ship buttery scroll experiences without fighting the timeline.",
  scrollHint: "Scroll to feel it",
};

// Word-by-word highlighted statement (TextReveal section).
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

// Horizontal showcase slides.
export const showcase = [
  {
    no: "01",
    title: "Aurora",
    tag: "Product launch",
    accent: "bg-flame text-ink",
  },
  {
    no: "02",
    title: "Meridian",
    tag: "Brand site",
    accent: "bg-blue-700 text-paper",
  },
  {
    no: "03",
    title: "Halcyon",
    tag: "Editorial",
    accent: "bg-teal-600 text-ink",
  },
  {
    no: "04",
    title: "Vantage",
    tag: "Case study",
    accent: "bg-orange-500 text-ink",
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

export const cta = {
  title: "Make it move",
  subtitle: "Start animating in minutes. No credit card, no ceremony.",
  button: "Get MOTIVE",
};

export const footer = {
  note: "Built as a GSAP scroll demo.",
  links: ["Twitter", "GitHub", "Dribbble", "Email"],
};
