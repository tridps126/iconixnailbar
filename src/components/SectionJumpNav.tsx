"use client";

import { useEffect, useRef, useState } from "react";

interface NavSection {
  id: string;
  label: string;
}

interface Props {
  sections: NavSection[];
  activeSection: string;
  onJump: (id: string) => void;
}

export default function SectionJumpNav({
  sections,
  activeSection,
  onJump,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      ro.disconnect();
    };
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const activeBtn = el.querySelector<HTMLElement>("[data-active='true']");
    if (!activeBtn) return;
    const navLeft = el.scrollLeft;
    const navRight = navLeft + el.clientWidth;
    const btnLeft = activeBtn.offsetLeft;
    const btnRight = btnLeft + activeBtn.offsetWidth;
    if (btnLeft < navLeft + 16) {
      el.scrollTo({ left: Math.max(btnLeft - 16, 0), behavior: "smooth" });
    } else if (btnRight > navRight - 16) {
      el.scrollTo({ left: Math.min(btnRight - el.clientWidth + 16, el.scrollWidth - el.clientWidth), behavior: "smooth" });
    }
  }, [activeSection]);

  return (
    <div className="bg-warm-cream/95 backdrop-blur-sm border-b border-almond">
      <div className="max-w-3xl mx-auto px-2 md:px-4 flex items-center gap-1">
        {/* Left button — outside the scroll area */}
        <button
          aria-label="Scroll left"
          onClick={() =>
            scrollRef.current?.scrollBy({ left: -160, behavior: "smooth" })
          }
          className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-full border border-almond bg-white text-charcoal hover:text-deep-berry hover:border-deep-berry/40 transition-all duration-200 ${
            canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Scrollable pills with fade edges */}
        <div className="relative flex-1 min-w-0">
          {/* Left fade */}
          <div
            className={`absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-warm-cream/95 to-transparent z-10 pointer-events-none transition-opacity duration-200 ${
              canScrollLeft ? "opacity-100" : "opacity-0"
            }`}
          />
          {/* Right fade */}
          <div
            className={`absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-warm-cream/95 to-transparent z-10 pointer-events-none transition-opacity duration-200 ${
              canScrollRight ? "opacity-100" : "opacity-0"
            }`}
          />

          <div
            ref={scrollRef}
            className="flex gap-2 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {sections.map((s) => (
              <button
                key={s.id}
                data-active={activeSection === s.id ? "true" : "false"}
                onClick={() => onJump(s.id)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                  activeSection === s.id
                    ? "bg-deep-berry text-white shadow-sm"
                    : "bg-white text-muted border border-almond hover:text-deep-berry hover:border-deep-berry/40"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right button — outside the scroll area */}
        <button
          aria-label="Scroll right"
          onClick={() =>
            scrollRef.current?.scrollBy({ left: 160, behavior: "smooth" })
          }
          className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-full border border-almond bg-white text-charcoal hover:text-deep-berry hover:border-deep-berry/40 transition-all duration-200 ${
            canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
