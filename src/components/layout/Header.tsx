import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { nav as navItems, type NavItem } from "../../content/site";
import ContactPanel from "../ui/ContactPanel";
import { useContactPanelStore } from "../../store/useContactPanelStore";

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

const LANGUAGES = ["en", "ru"] as const;

export default function Header() {
  const { t, i18n } = useTranslation();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [pill, setPill] = useState<Pill>({ ...HOME_PILL, opacity: 0 });
  const [mobileOpen, setMobileOpen] = useState(false);
  const { open: contactOpen, openContact: openContactStore, closeContact } =
    useContactPanelStore();

  const navRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const navLockRef = useRef(false);
  const lockTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const remeasureRef = useRef<() => void>(() => {});

  const armNavLock = useCallback(() => {
    navLockRef.current = true;
    clearTimeout(lockTimerRef.current);
    lockTimerRef.current = setTimeout(() => {
      navLockRef.current = false;
      remeasureRef.current();
    }, 150);
  }, []);

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

  useEffect(() => {
    const TRIGGER = 120;
    let targets: { i: number; el: Element }[] = [];
    let tops: number[] = [];
    const measure = () => {
      targets = navItems
        .map((item, i) => ({
          i,
          el: item.href ? document.querySelector(item.href) : null,
        }))
        .filter((t): t is { i: number; el: Element } => t.el !== null);
      const scrollY = window.scrollY;
      tops = targets.map((t) => t.el.getBoundingClientRect().top + scrollY);
    };
    measure();

    const onScroll = () => {
      if (navLockRef.current) {
        armNavLock();
        return;
      }
      const scrollY = window.scrollY;
      let current: number | null = null;
      targets.forEach((t, idx) => {
        if (tops[idx] - scrollY <= TRIGGER) current = t.i;
      });
      setActiveIndex(current);
    };
    const remeasure = () => {
      measure();
      onScroll();
    };
    remeasureRef.current = remeasure;
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", remeasure);
    window.addEventListener("app:layout-ready", remeasure);
    window.addEventListener("app:sections-ready", remeasure);
    document.fonts?.ready.then(remeasure);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", remeasure);
      window.removeEventListener("app:layout-ready", remeasure);
      window.removeEventListener("app:sections-ready", remeasure);
    };
  }, []);

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

  const goTo = (href: string, index: number) => {
    setMobileOpen(false);
    setActiveIndex(index);
    armNavLock();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };
  const openContact = () => {
    setMobileOpen(false);
    openContactStore();
  };
  const scrollTop = () => {
    setActiveIndex(null);
    armNavLock();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const itemTone = (active: boolean, key: NavItem["key"]) => {
    if (active) return "text-white";
    if (key === "contact")
      return "bg-black/[0.06] text-ink hover:bg-black/[0.1]";
    return "text-ink/75 hover:text-ink";
  };

  const currentLang = i18n.language.split("-")[0];
  const setLang = (lng: string) => {
    if (lng === currentLang) return;
    i18n.changeLanguage(lng).then(() => window.location.reload());
  };

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-center px-6 pt-5">
        <div className="pointer-events-auto hidden md:block">
          <div
            ref={navRef}
            className="relative flex h-14 items-center overflow-visible rounded-full px-2"
          >
            <div className="nav-glass pointer-events-none absolute inset-0 rounded-full shadow-[0_10px_34px_rgba(0,0,0,0.20)] ring-1 ring-black/5" />

            <button
              onClick={scrollTop}
              aria-label="Back to top"
              className="absolute top-1/2 -translate-y-1/2 cursor-pointer rounded-full"
              style={{ left: HOME_LEFT, width: DOT_SIZE, height: DOT_SIZE }}
            />

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
              const label = t(`nav.${item.key}`);
              return (
                <button
                  key={item.key}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  onClick={() =>
                    isContact ? openContact() : goTo(item.href!, i)
                  }
                  className={`relative z-10 mx-0.5 flex h-10 cursor-pointer items-center rounded-full px-5 text-[0.9375rem] font-medium whitespace-nowrap transition-colors duration-200 ${itemTone(active, item.key)}`}
                >
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
                        {label}
                      </span>
                      <span className="block h-6 leading-6 text-flame">
                        {label}
                      </span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="pointer-events-auto ml-auto md:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="nav-glass flex cursor-pointer items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-ink shadow-[0_8px_24px_rgba(0,0,0,0.18)] ring-1 ring-black/5"
          >
            <span className="h-2 w-2 rounded-full bg-flame" />
            {t("header.menu")}
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-end"
          onClick={() => setMobileOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="nav-glass relative m-4 w-64 rounded-3xl shadow-2xl shadow-black/30 ring-1 ring-black/5"
            style={{ animation: "slideDown 0.28s ease-out both" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <span className="flex items-center gap-2 text-sm font-semibold text-ink">
                <span className="h-2.5 w-2.5 rounded-full bg-flame" />
                {t("header.menu")}
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="cursor-pointer text-sm font-medium text-ink/50 hover:text-ink"
              >
                {t("header.close")}
              </button>
            </div>
            <div className="mx-5 h-px bg-black/5" />
            <nav className="flex flex-col px-3 py-3">
              {navItems.map((item, i) => {
                const mobileTone =
                  activeIndex === i
                    ? "bg-flame text-white"
                    : "text-ink/80 hover:bg-black/5";
                return (
                  <button
                    key={item.key}
                    onClick={() =>
                      item.panel === "contact"
                        ? openContact()
                        : goTo(item.href!, i)
                    }
                    className={`cursor-pointer rounded-2xl px-4 py-3 text-left text-base font-medium transition-colors ${mobileTone}`}
                  >
                    {t(`nav.${item.key}`)}
                  </button>
                );
              })}
            </nav>
            <div className="mx-5 h-px bg-black/5" />
            <div className="flex items-center gap-1 px-3 py-3">
              {LANGUAGES.map((lng) => (
                <button
                  key={lng}
                  type="button"
                  onClick={() => setLang(lng)}
                  aria-pressed={currentLang === lng}
                  className={`flex-1 cursor-pointer rounded-2xl px-4 py-2 text-center text-sm font-medium uppercase transition-colors ${
                    currentLang === lng
                      ? "bg-flame text-white"
                      : "text-ink/70 hover:bg-black/5"
                  }`}
                >
                  {lng}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <ContactPanel open={contactOpen} onClose={closeContact} />
    </>
  );
}
