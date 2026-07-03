import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";

// Core plugins used across many (eagerly-loaded) sections. Heavier plugins
// that only a single code-split section needs — Draggable + InertiaPlugin
// (StudioCanvas) and ScrambleTextPlugin (useScramble) — are imported and
// registered inside those modules so they ship in their own lazy chunks
// instead of the initial bundle.
gsap.registerPlugin(ScrollTrigger, SplitText, Flip, useGSAP);

// Old iOS Safari fires resize on every address-bar show/hide during scroll;
// without this, pinned sections re-measure mid-gesture and drift/jump.
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger, SplitText, Flip, useGSAP };
