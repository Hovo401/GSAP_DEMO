"use client";

import { useState, useEffect, useRef } from "react";
import { nav as navItems } from "../../content/site";

export default function Header() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null); // null = top of page
  const [pillStyle, setPillStyle] = useState({
    left: 0,
    width: 0,
    height: 0,
    borderRadius: "999px",
    opacity: 0,
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  // Position of the red dot (circle home position)
  const dotRef = useRef<HTMLDivElement>(null);

  // const getNavRect = () => navRef.current?.getBoundingClientRect();

  // Move pill to a nav item
  const movePillToItem = (index: number) => {
    const el = itemRefs.current[index];
    const nav = navRef.current;
    if (!el || !nav) return;
    const navRect = nav.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    setPillStyle({
      left: elRect.left - navRect.left,
      width: elRect.width,
      height: elRect.height,
      borderRadius: "999px",
      opacity: 1,
    });
  };

  // Shrink pill back to circle near red dot (outside nav, left side)
  const movePillToDot = () => {
    const dot = dotRef.current;
    const nav = navRef.current;
    if (!dot || !nav) return;
    const navRect = nav.getBoundingClientRect();
    const dotRect = dot.getBoundingClientRect();
    // center the circle vertically inside nav height
    // position: to the left of the nav, aligned with the dot
    // We'll place it just after the dot (dot is outside nav, so left will be negative)
    const left = dotRect.right - navRect.left - 25;
    setPillStyle({
      left,
      width: 20,
      height: 20,
      borderRadius: "999px",
      opacity: 1,
    });
  };

  // Scroll spy + initial
  useEffect(() => {
    const handleScroll = () => {
      const offsets = navItems.map((item) => {
        const el = document.querySelector(item.href);
        if (!el) return Infinity;
        return Math.abs(el.getBoundingClientRect().top - 100);
      });
      const closest = offsets.indexOf(Math.min(...offsets));
      if (offsets[closest] < window.innerHeight) {
        setActiveIndex(closest);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animate pill on activeIndex change
  useEffect(() => {
    const t = setTimeout(() => {
      if (activeIndex === null) {
        movePillToDot();
      } else {
        movePillToItem(activeIndex);
      }
    }, 30);
    return () => clearTimeout(t);
  }, [activeIndex]);

  // Also recalc on mount after refs ready
  useEffect(() => {
    const t = setTimeout(() => movePillToDot(), 80);
    return () => clearTimeout(t);
  }, []);

  const handleNavClick = (index: number, href: string) => {
    setActiveIndex(index);
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-start justify-center px-6 pt-5 pointer-events-none">
        {/* ── DESKTOP NAV ── */}
        <div className="hidden md:flex items-center gap-3 pointer-events-auto">
          {/* Brand dot */}
          <div
            ref={dotRef}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgb(245,84,56)] text-sm font-black text-white"
            style={{ boxShadow: "0 0px 6px rgba(0,0,0,0.50)" }}
          >
            M
          </div>

          {/* Nav pill container — pill lives INSIDE here but visually can overflow left */}
          <div
            ref={navRef}
            className="relative flex h-[56px] justify-center items-center rounded-full px-2 py-2 overflow-visible
              "
            style={{ boxShadow: "0 0px 6px rgba(0,0,0,0.50)" }}
          >
            <div className="absolute inset-0 rounded-full backdrop-blur-xl bg-[rgba(177,177,179,0.60)] pointer-events-none" />

            <span
              className="absolute mx-0 top-2 bottom-2 backdrop-blur-md bg-[rgba(245,84,56,0.95)] pointer-events-none"
              style={{
                boxShadow: "0 0px 6px rgba(0,0,0,0.50)",
                left: pillStyle.left,
                width: pillStyle.width,
                height: pillStyle.height,
                borderRadius: pillStyle.borderRadius,
                opacity: pillStyle.opacity,
                margin: "auto",
                transition: [
                  "left 0.5s ease-in-out",
                  "width 0.5s ease-in-out",
                  "height 0.5s ease-in-out",
                  "border-radius 0.3s ease",
                  "opacity 0.2s ease",
                ].join(", "),
              }}
            />

            {navItems.map((item, i) => (
              <button
                key={item.label}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                onClick={() => handleNavClick(i, item.href)}
                className="relative z-10 px-5 rounded-full text-sm font-medium text-[#111] transition-colors duration-150 whitespace-nowrap"
              >
                <div
                  className={`h-[25px] overflow-hidden text-[16px] ${activeIndex !== i ? "group" : ""}`}
                >
                  <div className="grid">
                    <div
                      className={`col-start-1 row-start-1 transition-transform duration-300 ease-in-out ${activeIndex !== i ? "group-hover:-translate-y-[23px]" : ""}`}
                    >
                      <p className={activeIndex === i ? "text-white" : ""}>
                        {item.label}
                      </p>
                      <p className="text-[rgb(245,84,56)]">{item.label}</p>
                    </div>

                    <div
                      className={`col-start-1 row-start-1 relative flex -translate-y-[23px] transition-transform duration-300 ease-in-out ${activeIndex !== i ? "group-hover:translate-y-0" : ""}`}
                    >
                      <p className="text-[rgb(245,84,56)] flex">
                        (<p className="opacity-0">{item.label}</p>)
                      </p>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── MOBILE MENU BUTTON ── */}
        <div className="md:hidden ml-auto pointer-events-auto">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="bg-white rounded-2xl px-6 py-3 text-sm font-medium text-[#1a1a1a]"
            style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.10)" }}
          >
            Menu
          </button>
        </div>
      </header>

      {/* ── MOBILE DRAWER ── */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-end"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60" />
          <div
            className="relative bg-white rounded-3xl m-4 w-64 shadow-2xl"
            style={{
              animation: "slideDown 0.28s ease-out both",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-gray-200" />
            </div>
            <div className="flex justify-end px-5 py-3">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-[#1a1a1a]"
              >
                Close
              </button>
            </div>
            <div className="h-px bg-gray-100 mx-5 mb-2" />
            <nav className="flex flex-col items-end px-6 pb-8">
              {navItems.map((item, i) => (
                <button
                  key={item.label}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  onClick={() => handleNavClick(i, item.href)}
                  // Добавлена очистка фокуса и выделения текста
                  className="relative z-10 px-5 py-2 rounded-full  text-sm font-medium text-[#1a1a1a] hover:text-black transition-colors duration-150 whitespace-nowrap focus:outline-none select-none"
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-14px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
}
