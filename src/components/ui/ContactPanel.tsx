import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { gsap, useGSAP } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { socialLinks, type SocialLink } from "../../content/site";

const icons: Record<SocialLink["key"], React.ReactNode> = {
  email: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect width="20" height="16" x="2" y="4" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  github: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4M9 18c-4.51 2-5-2-7-2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  linkedin: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <rect width="4" height="12" x="2" y="9" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="4" cy="4" r="2" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  telegram: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="m21.854 2.147-10.94 10.939" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ContactPanel({ open, onClose }: Props) {
  const { t } = useTranslation();
  const root = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const flameRef = useRef<HTMLDivElement>(null);
  const inkRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      gsap.set(backdropRef.current, {
        autoAlpha: 0,
        backgroundColor: "rgba(0,0,0,0)",
      });
      gsap.set([flameRef.current, inkRef.current, formRef.current], {
        xPercent: 100,
      });

      const tl = gsap.timeline({ paused: true });
      tl.set(backdropRef.current, { autoAlpha: 1 }, 0)
        .to(
          backdropRef.current,
          { backgroundColor: "rgba(0,0,0,0.85)", duration: 0.4 },
          0,
        )
        .to(
          flameRef.current,
          { xPercent: 0, duration: 0.6, ease: "power3.out" },
          0.05,
        )
        .to(
          inkRef.current,
          { xPercent: 0, duration: 0.6, ease: "power3.out" },
          0.17,
        )
        .to(
          formRef.current,
          { xPercent: 0, duration: 0.65, ease: "power3.out" },
          0.29,
        )
        .from(
          ".contact-stagger",
          {
            y: 22,
            opacity: 0,
            duration: 0.5,
            ease: "power2.out",
            stagger: 0.07,
          },
          0.55,
        );

      tlRef.current = tl;
    },
    { scope: root },
  );

  useEffect(() => {
    const tl = tlRef.current;
    if (!tl) return;
    if (reduced) {
      tl.progress(open ? 1 : 0).pause();
      return;
    }
    if (open) tl.play();
    else tl.reverse();
  }, [open, reduced]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <div
      ref={root}
      className="fixed inset-0 z-60"
      style={{ pointerEvents: open ? "auto" : "none" }}
      aria-hidden={!open}
    >
      <div
        ref={backdropRef}
        onClick={onClose}
        className="absolute inset-0 cursor-pointer"
      />

      <div className="absolute inset-y-0 right-0 w-full max-w-170">
        <div ref={flameRef} className="absolute inset-0 bg-flame" />
        <div ref={inkRef} className="absolute inset-0 bg-ink" />

        <div
          ref={formRef}
          role="dialog"
          aria-modal="true"
          aria-label={t("contactPanel.ariaContactUs")}
          className="absolute inset-0 overflow-y-auto bg-[#e9e8e6] text-ink"
        >
          <div className="flex min-h-full flex-col px-8 py-10 sm:px-12 sm:py-14">
            <div className="contact-stagger flex items-start justify-between">
              <span className="flex items-center gap-3 text-[19px] text-black/55">
                <span className="h-2.5 w-2.5 rounded-full bg-ink/55" />
                {t("contactPanel.eyebrow")}
              </span>
              <button
                onClick={onClose}
                aria-label={t("contactPanel.ariaClose")}
                className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full border border-black/20 text-black/60 transition-colors hover:bg-black/5 hover:text-ink"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M1 1l16 16M17 1L1 17"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </button>
            </div>

            <h2 className="contact-stagger mt-8 max-w-[12ch] text-[clamp(2.1rem,4.5vw,3.4rem)] leading-[1.04] font-medium tracking-tight">
              {t("contactPanel.title")}
            </h2>

            <div className="contact-stagger mt-8 h-px w-full bg-black/15" />

            <p className="contact-stagger mt-8 max-w-[40ch] text-[15px] text-black/55">
              {t("contactPanel.subtitle")}
            </p>

            <div className="mt-8 flex flex-col gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.key}
                  href={link.href}
                  target={link.key === "email" ? undefined : "_blank"}
                  rel={link.key === "email" ? undefined : "noopener noreferrer"}
                  className="contact-stagger group flex items-center justify-between rounded-2xl border border-black/15 px-6 py-5 transition-colors hover:border-flame hover:bg-flame/5"
                >
                  <span className="flex items-center gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/15 text-black/60 transition-colors group-hover:border-flame group-hover:text-flame">
                      {icons[link.key]}
                    </span>
                    <span className="flex flex-col">
                      <span className="text-[17px] font-medium text-ink">
                        {t(`contactPanel.links.${link.key}`)}
                      </span>
                      <span className="text-[14px] text-black/45">{link.handle}</span>
                    </span>
                  </span>
                  <span className="text-black/30 transition-colors group-hover:text-flame">
                    ↗
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
