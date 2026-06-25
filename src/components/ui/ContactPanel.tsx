import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { gsap, useGSAP } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";

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

  const Field = ({
    label,
    placeholder,
    type = "text",
  }: {
    label: string;
    placeholder: string;
    type?: string;
  }) => (
    <label className="contact-stagger block">
      <span className="mb-2 block text-[15px] text-black/55">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-black/15 bg-transparent px-5 py-4 text-[17px] text-ink outline-none transition-colors placeholder:text-black/35 focus:border-black/45"
      />
    </label>
  );

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

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onClose();
              }}
              className="mt-8 flex flex-col gap-7"
            >
              <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
                <Field
                  label={t("contactPanel.fields.name.label")}
                  placeholder={t("contactPanel.fields.name.placeholder")}
                />
                <Field
                  label={t("contactPanel.fields.email.label")}
                  placeholder={t("contactPanel.fields.email.placeholder")}
                  type="email"
                />
              </div>

              <Field
                label={t("contactPanel.fields.company.label")}
                placeholder={t("contactPanel.fields.company.placeholder")}
              />

              <label className="contact-stagger block">
                <span className="mb-2 block text-[15px] text-black/55">
                  {t("contactPanel.fields.message.label")}
                </span>
                <textarea
                  rows={5}
                  placeholder={t("contactPanel.fields.message.placeholder")}
                  className="w-full resize-none rounded-2xl border border-black/15 bg-transparent px-5 py-4 text-[17px] text-ink outline-none transition-colors placeholder:text-black/35 focus:border-black/45"
                />
              </label>

              <button
                type="submit"
                className="contact-stagger group mt-1 inline-flex w-fit cursor-pointer items-center gap-3 rounded-full border border-flame px-7 py-4 text-[17px] font-medium text-flame transition-colors hover:bg-flame hover:text-white"
              >
                <span className="h-3 w-3 rounded-full bg-flame transition-colors group-hover:bg-white" />
                {t("contactPanel.submit")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
