export const DURATION = {
  fast: 0.4,
  base: 0.6,
  medium: 0.8,
  slow: 0.9,
  slower: 1,
} as const;

export const EASE = {
  out: "power3.out",
  softOut: "power2.out",
  in: "power2.in",
  strongOut: "power4.out",
  none: "none",
} as const;

export const STAGGER = {
  tight: 0.08,
  base: 0.1,
  loose: 0.12,
} as const;

export const REVEAL_Y = 40;

export const SCROLL_START = {
  early: "top 85%",
  base: "top 80%",
  late: "top 75%",
} as const;
