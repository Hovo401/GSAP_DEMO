import { useState, useEffect, useRef, useCallback } from "react";
import { nav as navItems } from "../../content/site";
import ContactPanel from "../ui/ContactPanel";

// Home position of the flame indicator: a lone dot sitting just left of the pill.
const HOME_LEFT = -46;
const DOT_SIZE = 34;

type Pill = {
  left: number;
  width: number;
  height: number;
  radius: number;
  opacity: number;
};

const HOME_PILL: Pill = {
  left: HOME_LEFT,
  width: DOT_SIZE,
  height: DOT_SIZE,
  radius: 999,
  opacity: 1,
};

export default function Header() {
  // null = at the very top → flame is just a dot to the left of the menu.
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [pill, setPill] = useState<Pill>({ ...HOME_PILL, opacity: 0 });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  const navRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Place the flame indicator: a left dot when idle, a pill behind the active item.
  const updateIndicator = useCallback(() => {
    const nav = navRef.current;
    if (!nav) return;

    if (activeIndex === null) {
      setPill(HOME_PILL);
      return;
    }

    const el = itemRefs.current[activeIndex];
    if (!el) return;
    const navRect = nav.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    setPill({
      left: r.left - navRect.left,
      width: r.width,
      height: r.height,
      radius: 999,
      opacity: 1,
    });
  }, [activeIndex]);

  // Scroll spy: the active item is the last section whose top has crossed the
  // trigger line. Above the first section we stay null → lone dot at the top.
  useEffect(() => {
    const TRIGGER = 120;
    const onScroll = () => {
      let current: number | null = null;
      navItems.forEach((item, i) => {
        if (!item.href) return; // Contact opens a panel, not a scroll target.
        const el = document.querySelector(item.href);
        if (el && el.getBoundingClientRect().top <= TRIGGER) current = i;
      });
      setActiveIndex(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Reposition whenever the target changes, on resize, and once fonts settle.
  useEffect(() => {
    const id = requestAnimationFrame(updateIndicator);
    return () => cancelAnimationFrame(id);
  }, [updateIndicator]);

  useEffect(() => {
    const onResize = () => updateIndicator();
    window.addEventListener("resize", onResize);
    document.fonts?.ready.then(updateIndicator);
    return () => window.removeEventListener("resize", onResize);
  }, [updateIndicator]);

  const goTo = (href: string) => {
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };
  const openContact = () => {
    setMobileOpen(false);
    setContactOpen(true);
  };
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // Colour treatment per item: active (on flame) > Contact CTA > default.
  const itemTone = (active: boolean, isContact: boolean) => {
    if (active) return "text-white";
    if (isContact) return "bg-black/[0.06] text-ink hover:bg-black/[0.1]";
    return "text-ink/75 hover:text-ink";
  };

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-center px-6 pt-5">
        {/* ── DESKTOP NAV ── */}
        <div className="pointer-events-auto hidden md:block">
          <div
            ref={navRef}
            className="relative flex h-14 items-center overflow-visible rounded-full px-2"
          >
            {/* Frosted white pill */}
            <div className="pointer-events-none absolute inset-0 rounded-full bg-white/90 shadow-[0_10px_34px_rgba(0,0,0,0.20)] ring-1 ring-black/5 backdrop-blur-xl" />

            {/* Invisible home hit-area under the flame dot */}
            <button
              onClick={scrollTop}
              aria-label="Back to top"
              className="absolute top-1/2 -translate-y-1/2 cursor-pointer rounded-full"
              style={{ left: HOME_LEFT, width: DOT_SIZE, height: DOT_SIZE }}
            />

            {/* The single flame element: dot at the top, active-pill on scroll */}
            <span
              aria-hidden
              className="pointer-events-none absolute top-1/2 -translate-y-1/2 bg-flame shadow-[0_6px_18px_rgba(245,84,56,0.45)]"
              style={{
                left: pill.left,
                width: pill.width,
                height: pill.height,
                borderRadius: pill.radius,
                opacity: pill.opacity,
                transition:
                  "left .55s cubic-bezier(.65,.05,.36,1), width .55s cubic-bezier(.65,.05,.36,1), height .4s ease, border-radius .3s ease, opacity .25s ease",
              }}
            />

            {navItems.map((item, i) => {
              const active = activeIndex === i;
              const isContact = item.panel === "contact";
              return (
                <button
                  key={item.label}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  onClick={() => (isContact ? openContact() : goTo(item.href!))}
                  className={`relative z-10 mx-0.5 flex h-10 cursor-pointer items-center rounded-full px-5 text-[15px] font-medium whitespace-nowrap transition-colors duration-200 ${itemTone(active, isContact)}`}
                >
                  {/* Roll-up label: hovering reveals a flame-colored copy */}
                  <span
                    className={`block h-6 overflow-hidden ${active ? "" : "group/label"}`}
                  >
                    <span
                      className={`block transition-transform duration-300 ease-out ${
                        active ? "" : "group-hover/label:-translate-y-6"
                      }`}
                    >
                      <span
                        className={`block h-6 leading-6 ${active ? "text-white" : ""}`}
                      >
                        {item.label}
                      </span>
                      <span className="block h-6 leading-6 text-flame">
                        {item.label}
                      </span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── MOBILE MENU BUTTON ── */}
        <div className="pointer-events-auto ml-auto md:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="flex cursor-pointer items-center gap-2 rounded-full bg-white/90 px-5 py-3 text-sm font-medium text-ink shadow-[0_8px_24px_rgba(0,0,0,0.18)] ring-1 ring-black/5 backdrop-blur-xl"
          >
            <span className="h-2 w-2 rounded-full bg-flame" />
            Menu
          </button>
        </div>
      </header>

      {/* ── MOBILE DRAWER ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-end"
          onClick={() => setMobileOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative m-4 w-64 rounded-3xl bg-white shadow-2xl"
            style={{ animation: "slideDown 0.28s ease-out both" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <span className="flex items-center gap-2 text-sm font-semibold text-ink">
                <span className="h-2.5 w-2.5 rounded-full bg-flame" />
                Menu
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="cursor-pointer text-sm font-medium text-ink/50 hover:text-ink"
              >
                Close
              </button>
            </div>
            <div className="mx-5 h-px bg-black/5" />
            <nav className="flex flex-col px-3 py-3">
              {navItems.map((item, i) => (
                <button
                  key={item.label}
                  onClick={() =>
                    item.panel === "contact" ? openContact() : goTo(item.href!)
                  }
                  className={`cursor-pointer rounded-2xl px-4 py-3 text-left text-base font-medium transition-colors ${
                    activeIndex === i
                      ? "bg-flame text-white"
                      : "text-ink/80 hover:bg-black/5"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* ── CONTACT PANEL (layered slide-in) ── */}
      <ContactPanel open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}
