"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import {
  menuSections,
  type PriceRowItem,
  type NamedCardItem,
  type SpaCardItem,
} from "@/lib/services-data";
import SectionJumpNav from "@/components/SectionJumpNav";
import SectionLabel from "@/components/SectionLabel";

export default function ServicesPage() {
  const allIds = menuSections.map((s) => s.id);
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(["nail-enhancements"]),
  );
  const [activeSection, setActiveSection] = useState(allIds[0]);
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());
  const isJumping = useRef(false);
  const rafRef = useRef<number | null>(null);

  // Scroll spy — positional: "last section whose top has passed the trigger line"
  useEffect(() => {
    const TRIGGER = 160; // px from viewport top, matches the jumpTo offset

    const onScroll = () => {
      if (isJumping.current) return;
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        let active = allIds[0];
        for (const id of allIds) {
          const el = sectionRefs.current.get(id);
          if (!el) continue;
          if (el.getBoundingClientRect().top <= TRIGGER) active = id;
        }
        setActiveSection(active);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // set correct highlight on mount
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [allIds]);

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const jumpTo = (id: string) => {
    setActiveSection(id);
    setOpenSections((prev) => new Set([...prev, id]));
    isJumping.current = true;
    setTimeout(() => {
      const el = sectionRefs.current.get(id);
      if (!el) return;
      const offset = 140;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
      setTimeout(() => {
        isJumping.current = false;
      }, 1500);
    }, 50);
  };

  return (
    <div className="min-h-screen bg-warm-cream">
      {/* Page Header */}
      <motion.div
        className="pt-40 pb-8 px-6 md:px-12 max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <SectionLabel text="Full Menu" />
        <h1 className="font-display text-5xl md:text-6xl text-charcoal font-semibold mt-2 mb-3">
          Our Services
        </h1>
        <p className="text-muted leading-relaxed max-w-lg">
          Every service is performed with premium products, careful technique,
          and genuine attention to detail.
        </p>
      </motion.div>

      {/* Sticky Jump Nav */}
      <motion.div
        className="sticky top-16 z-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
      >
        <SectionJumpNav
          sections={menuSections.map((s) => ({ id: s.id, label: s.label }))}
          activeSection={activeSection}
          onJump={jumpTo}
        />
      </motion.div>

      {/* Sections */}
      <motion.div
        className="max-w-3xl mx-auto px-6 md:px-12 pb-24 pt-4 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {menuSections.map((section) => {
          const isOpen = openSections.has(section.id);
          return (
            <div
              key={section.id}
              ref={(el) => {
                if (el) sectionRefs.current.set(section.id, el);
              }}
              className="rounded-2xl border border-almond overflow-hidden bg-white shadow-sm"
            >
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-almond/40 transition-colors duration-200"
              >
                <h2 className="font-display text-xl font-bold tracking-wide text-deep-berry">
                  {section.heading}
                </h2>
                <motion.div
                  animate={{ rotate: isOpen ? 0 : -90 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <FiChevronDown className="text-deep-berry w-5 h-5" />
                </motion.div>
              </button>

              {/* Collapsible Content */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 border-t border-almond">
                      {/* Section note */}
                      {section.note && (
                        <p className="text-sm text-muted italic mt-4 mb-2">
                          {section.note}
                        </p>
                      )}

                      {/* Add-on callouts */}
                      {section.addOns && (
                        <div className="flex flex-wrap gap-2 mt-3 mb-5">
                          {section.addOns.map((ao) => (
                            <span
                              key={ao}
                              className="text-xs bg-almond text-charcoal px-3 py-1.5 rounded-full"
                            >
                              {ao}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Sub-groups */}
                      {section.groups.map((group, gi) => (
                        <div key={gi} className={gi > 0 ? "mt-7" : "mt-4"}>
                          {group.heading && (
                            <p className="text-xs font-bold uppercase tracking-[0.15em] text-gold mb-3 pb-2 border-b border-almond">
                              {group.heading}
                            </p>
                          )}
                          <div>
                            {group.items.map((item, ii) => {
                              const isLast = ii === group.items.length - 1;
                              if (item.type === "price-row")
                                return renderPriceRow(item, ii, isLast);
                              if (item.type === "named-card")
                                return renderNamedCard(item, ii);
                              if (item.type === "spa-card")
                                return renderSpaCard(item, ii);
                              return null;
                            })}
                          </div>
                        </div>
                      ))}

                      {/* Footnote */}
                      {section.footnote && (
                        <p className="text-xs text-muted/70 italic mt-5 pt-4 border-t border-almond">
                          *** {section.footnote} ***
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {/* Book CTA */}
        <div className="mt-10 text-center">
          <p className="text-muted mb-4">Ready to treat yourself?</p>
          <a
            href="/special"
            className="inline-block px-10 py-4 rounded-full bg-gold text-charcoal font-semibold text-sm uppercase tracking-widest hover:scale-105 transition-transform duration-200 shadow-sm"
          >
            Book an Appointment
          </a>
        </div>
      </motion.div>
    </div>
  );
}

function renderPriceRow(item: PriceRowItem, index: number, isLast: boolean) {
  return (
    <div
      key={item.name + index}
      className={`flex items-start justify-between gap-4 py-3 ${!isLast ? "border-b border-almond" : ""}`}
    >
      <div>
        <span className="text-sm text-charcoal font-medium">{item.name}</span>
        {item.note && (
          <p className="text-xs text-muted/70 mt-0.5">{item.note}</p>
        )}
      </div>
      <div className="text-right shrink-0">
        <span className="text-sm font-semibold text-deep-berry">
          {item.price}
        </span>
        {item.priceAlt && (
          <span className="text-sm text-muted"> | {item.priceAlt}</span>
        )}
      </div>
    </div>
  );
}

function renderNamedCard(item: NamedCardItem, index: number) {
  return (
    <div
      key={item.name + index}
      className="py-4 border-b border-almond last:border-0"
    >
      <div className="flex items-start justify-between gap-4 mb-1.5">
        <p className="font-display italic text-deep-berry font-semibold text-base">
          {item.name}
        </p>
        <div className="text-right shrink-0">
          <span className="font-semibold text-charcoal text-base">
            {item.price}
          </span>
          <p className="text-xs text-muted/70 mt-0.5">{item.duration}</p>
        </div>
      </div>
      <p className="text-sm text-muted leading-relaxed">{item.description}</p>
    </div>
  );
}

function renderSpaCard(item: SpaCardItem, index: number) {
  return (
    <div
      key={item.name + index}
      className="py-5 border-b border-almond last:border-0"
    >
      <div className="flex items-start justify-between gap-4 mb-2">
        <div>
          <p className="font-display italic text-deep-berry font-semibold text-base">
            {item.name}
          </p>
          <p className="text-xs text-muted/70 mt-0.5">{item.duration}</p>
        </div>
        <span className="font-semibold text-charcoal text-lg shrink-0">
          {item.price}
        </span>
      </div>
      <p className="text-sm text-muted italic leading-relaxed mb-3">
        {item.intro}
      </p>
      <ul className="space-y-1.5">
        {item.bullets.map((bullet, bi) => (
          <li key={bi} className="flex gap-2 text-sm text-charcoal/80">
            <span className="text-gold mt-0.5 shrink-0">•</span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
