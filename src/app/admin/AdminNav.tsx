"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Contacts", href: "/admin/contacts" },
  { label: "Reservations", href: "/admin/reservations" },
  { label: "Newsletter", href: "/admin/newsletter" },
  { label: "Notifications", href: "/admin/notifications" },
];

function NavLinks({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <>
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {navLinks.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onLinkClick}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? "bg-almond text-deep-berry"
                  : "text-charcoal hover:bg-almond/50"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t border-almond">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted hover:bg-almond/50 hover:text-charcoal transition-colors duration-150"
        >
          Logout
        </button>
      </div>
    </>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousOverscroll = document.body.style.overscrollBehavior;

    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.overscrollBehavior = previousOverscroll;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-warm-cream flex overflow-hidden">

      {/* ── DESKTOP SIDEBAR ── */}
      <aside
        className={`hidden md:flex flex-col bg-white border-r border-almond h-full shrink-0 transition-all duration-300 overflow-hidden ${
          desktopCollapsed ? "w-0 border-r-0" : "w-56"
        }`}
      >
        <div className="px-6 py-5 border-b border-almond shrink-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted whitespace-nowrap">
            Iconix Admin
          </p>
        </div>
        <NavLinks />
      </aside>

      {/* ── MAIN COLUMN ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-almond bg-white shrink-0">

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-1.5 rounded-lg hover:bg-almond/50 transition-colors text-charcoal"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="1" y1="4" x2="17" y2="4" />
              <line x1="1" y1="9" x2="17" y2="9" />
              <line x1="1" y1="14" x2="17" y2="14" />
            </svg>
          </button>

          {/* Desktop collapse toggle */}
          <button
            className="hidden md:flex items-center justify-center p-1.5 rounded-lg hover:bg-almond/50 transition-colors text-muted hover:text-charcoal"
            onClick={() => setDesktopCollapsed((v) => !v)}
            aria-label={desktopCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {desktopCollapsed ? (
                <polyline points="6 3 14 9 6 15" />
              ) : (
                <polyline points="12 3 4 9 12 15" />
              )}
            </svg>
          </button>

          <p className="text-xs font-semibold uppercase tracking-widest text-muted">
            Iconix Admin
          </p>
        </div>

        <main className="flex-1 overflow-y-auto p-6 md:p-8">{children}</main>
      </div>

      {/* ── MOBILE OVERLAY BACKDROP ── */}
      <div
        className={`fixed inset-0 z-[10000] bg-black/40 transition-opacity duration-300 md:hidden ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* ── MOBILE FULL-SCREEN PANEL ── */}
      <div
        className={`fixed inset-0 z-[10001] bg-white flex flex-col transition-transform duration-300 md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-almond">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">
            Iconix Admin
          </p>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg hover:bg-almond/50 transition-colors text-muted hover:text-charcoal"
            aria-label="Close menu"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="3" x2="15" y2="15" />
              <line x1="15" y1="3" x2="3" y2="15" />
            </svg>
          </button>
        </div>
        <NavLinks onLinkClick={() => setMobileOpen(false)} />
      </div>

    </div>
  );
}
