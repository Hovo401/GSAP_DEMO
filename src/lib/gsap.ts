// Single source of truth for GSAP plugin registration.
// Import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap" everywhere
// instead of registering plugins ad-hoc in components.
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

export { gsap, ScrollTrigger, SplitText, useGSAP };
