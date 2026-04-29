"use client";

import { useState, useEffect, useRef } from "react";

const navItems = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Approach", href: "#approach" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

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

  const getNavRect = () => navRef.current?.getBoundingClientRect();

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
    const size = dotRect.height; // same size as red dot
    // position: to the left of the nav, aligned with the dot
    // We'll place it just after the dot (dot is outside nav, so left will be negative)
    const left = dotRect.right - navRect.left - 35;
    setPillStyle({
      left,
      width: size,
      height: size,
      borderRadius: "999px",
      opacity: 1,
    });
  };

  // Scroll spy + initial
  useEffect(() => {
    const handleScroll = () => {
      const atTop = window.scrollY < 60;
      if (atTop) {
        setActiveIndex(null);
        return;
      }
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
          {/* Red dot */}
          <div
            ref={dotRef}
            className="w-9 h-9 rounded-full shadow-md flex-shrink-0"
          />

          {/* Nav pill container — pill lives INSIDE here but visually can overflow left */}
          <div
            ref={navRef}
            className="relative flex items-center bg-white rounded-full px-2 py-2 overflow-visible"
            style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.10)" }}
          >
            {/* THE MOVING PILL */}
            <span
              className="absolute top-2 bottom-2 bg-[#e8423c] pointer-events-none"
              style={{
                left: pillStyle.left,
                width: pillStyle.width,
                height: pillStyle.height,
                borderRadius: pillStyle.borderRadius,
                opacity: pillStyle.opacity,
                transition: [
                  "left 0.55s cubic-bezier(0.34,1.35,0.64,1)",
                  "width 0.50s cubic-bezier(0.34,1.35,0.64,1)",
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
                className="relative z-10 px-5 py-2 rounded-full text-sm font-medium text-[#1a1a1a] hover:text-black transition-colors duration-150 whitespace-nowrap"
              >
                {item.label}
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
              animation: "slideDown 0.28s cubic-bezier(0.34,1.4,0.64,1) both",
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
