"use client";

import { useState, useCallback, useEffect } from "react";
import type { ContactRow, ReservationRow, SubscriberRow } from "./page";

type Audience = "contacts" | "reservations" | "newsletter";
type ComposeState = "closed" | "open" | "minimized";

type SendStatus =
  | { state: "idle" }
  | { state: "sending" }
  | { state: "success"; sentCount: number }
  | { state: "partial"; sentCount: number; failedCount: number; failedEmails: string[] }
  | { state: "error"; message: string }
  | { state: "rate_limited" };

interface Props {
  contacts: ContactRow[];
  reservations: ReservationRow[];
  subscribers: SubscriberRow[];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const STATUS_STYLES: Record<string, string> = {
  new: "bg-blue-100 text-blue-700 border-blue-200",
  in_progress: "bg-amber-100 text-amber-700 border-amber-200",
  resolved: "bg-green-100 text-green-700 border-green-200",
  spam: "bg-red-100 text-red-700 border-red-200",
};

export default function NotificationsClient({ contacts, reservations, subscribers }: Props) {
  const [audience, setAudience] = useState<Audience>("contacts");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<SendStatus>({ state: "idle" });
  const [composeState, setComposeState] = useState<ComposeState>("closed");
  const [composeHeight, setComposeHeight] = useState(480);
  const [composeWidth, setComposeWidth] = useState(420);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const startVerticalResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = composeHeight;
    function onMouseMove(ev: MouseEvent) {
      const delta = startY - ev.clientY;
      setComposeHeight(Math.max(280, Math.min(window.innerHeight * 0.88, startHeight + delta)));
    }
    function onMouseUp() {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    }
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }, [composeHeight]);

  const startHorizontalResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = composeWidth;
    function onMouseMove(ev: MouseEvent) {
      const delta = startX - ev.clientX;
      setComposeWidth(Math.max(320, Math.min(window.innerWidth * 0.8, startWidth + delta)));
    }
    function onMouseUp() {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    }
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }, [composeWidth]);

  function switchAudience(next: Audience) {
    setAudience(next);
    setSelected(new Set());
    setStatus({ state: "idle" });
  }

  const currentRows =
    audience === "contacts" ? contacts : audience === "reservations" ? reservations : subscribers;
  const allIds = currentRows.map((r) => r.id);
  const allSelected = allIds.length > 0 && allIds.every((id) => selected.has(id));

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(allIds));
  }

  function toggleOne(id: string) {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  }

  function openCompose() {
    setComposeState("open");
  }

  function closeCompose() {
    setComposeState("closed");
    setStatus({ state: "idle" });
  }

  function toggleMinimize() {
    setComposeState((s) => (s === "minimized" ? "open" : "minimized"));
  }

  const selectedCount = selected.size;
  const canSend =
    selectedCount > 0 &&
    subject.trim().length > 0 &&
    body.trim().length >= 10 &&
    status.state !== "sending";

  async function handleSend() {
    setStatus({ state: "sending" });
    try {
      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audience,
          recipientIds: [...selected],
          subject: subject.trim(),
          body: body.trim(),
        }),
      });

      const data = await res.json();

      if (res.status === 401) {
        setStatus({ state: "error", message: "Session expired. Please log in again." });
        return;
      }
      if (res.status === 429) {
        setStatus({ state: "rate_limited" });
        return;
      }
      if (!res.ok) {
        setStatus({ state: "error", message: data.message ?? data.error ?? "Unknown error" });
        return;
      }

      if (data.failedCount > 0 && data.sentCount > 0) {
        setStatus({ state: "partial", sentCount: data.sentCount, failedCount: data.failedCount, failedEmails: data.failedEmails ?? [] });
      } else if (data.failedCount > 0) {
        setStatus({ state: "error", message: `All ${data.failedCount} sends failed.` });
      } else {
        setStatus({ state: "success", sentCount: data.sentCount });
      }
    } catch {
      setStatus({ state: "error", message: "Network error. Please try again." });
    }
  }

  const tabs: { key: Audience; label: string; count: number }[] = [
    { key: "contacts", label: "Contacts", count: contacts.length },
    { key: "reservations", label: "Reservations", count: reservations.length },
    { key: "newsletter", label: "Newsletter", count: subscribers.length },
  ];

  const headerTitle = subject.trim()
    ? subject.trim()
    : selectedCount > 0
    ? `New message · ${selectedCount} recipient${selectedCount !== 1 ? "s" : ""}`
    : "New Message";

  return (
    <div>
      {/* ── PAGE HEADER ── */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-lg font-semibold text-charcoal">Notifications</h1>
          <p className="text-xs text-muted mt-0.5">Select recipients, then compose a message.</p>
        </div>
        {composeState === "closed" && (
          <button
            onClick={openCompose}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-deep-berry text-white text-sm font-medium hover:bg-deep-berry/90 transition-colors shadow-sm"
          >
            {/* Pencil icon */}
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 2l2 2-8 8H3v-2z" />
            </svg>
            Compose
          </button>
        )}
        {composeState !== "closed" && (
          <span className="text-xs text-muted italic">Composing…</span>
        )}
      </div>

      {/* ── AUDIENCE TABLE ── */}
      <div className="bg-white border border-almond rounded-2xl overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-almond">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => switchAudience(tab.key)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                audience === tab.key
                  ? "bg-almond text-deep-berry border-b-2 border-deep-berry"
                  : "text-muted hover:text-charcoal hover:bg-almond/30"
              }`}
            >
              {tab.label}
              <span className="ml-1.5 text-xs opacity-60">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-almond bg-almond/20">
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="rounded border-almond accent-deep-berry"
                    aria-label="Select all"
                  />
                </th>
                {audience === "contacts" && (
                  <>
                    <th className="text-left px-4 py-3 font-semibold text-charcoal">Name</th>
                    <th className="text-left px-4 py-3 font-semibold text-charcoal">Email</th>
                    <th className="text-left px-4 py-3 font-semibold text-charcoal">Date</th>
                    <th className="text-left px-4 py-3 font-semibold text-charcoal">Status</th>
                  </>
                )}
                {audience === "reservations" && (
                  <>
                    <th className="text-left px-4 py-3 font-semibold text-charcoal">Name</th>
                    <th className="text-left px-4 py-3 font-semibold text-charcoal">Email</th>
                    <th className="text-left px-4 py-3 font-semibold text-charcoal">Date</th>
                    <th className="text-left px-4 py-3 font-semibold text-charcoal">Confirmed</th>
                  </>
                )}
                {audience === "newsletter" && (
                  <>
                    <th className="text-left px-4 py-3 font-semibold text-charcoal">Email</th>
                    <th className="text-left px-4 py-3 font-semibold text-charcoal">Date</th>
                    <th className="text-left px-4 py-3 font-semibold text-charcoal">Source</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-almond/60">
              {audience === "contacts" &&
                contacts.map((c) => (
                  <tr key={c.id} onClick={() => toggleOne(c.id)} className="hover:bg-almond/10 transition-colors cursor-pointer">
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selected.has(c.id)} onChange={() => toggleOne(c.id)} onClick={(e) => e.stopPropagation()} className="rounded border-almond accent-deep-berry" />
                    </td>
                    <td className="px-4 py-3 font-medium text-charcoal whitespace-nowrap">{c.name}</td>
                    <td className="px-4 py-3 text-charcoal">{c.email}</td>
                    <td className="px-4 py-3 text-muted whitespace-nowrap">{formatDate(c.created_at)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center text-xs font-medium px-2 py-1 rounded-full border ${STATUS_STYLES[c.status] ?? "bg-almond/50 text-muted border-almond"} capitalize`}>
                        {c.status.replace("_", " ")}
                      </span>
                    </td>
                  </tr>
                ))}

              {audience === "reservations" &&
                reservations.map((r) => (
                  <tr key={r.id} onClick={() => toggleOne(r.id)} className="hover:bg-almond/10 transition-colors cursor-pointer">
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selected.has(r.id)} onChange={() => toggleOne(r.id)} onClick={(e) => e.stopPropagation()} className="rounded border-almond accent-deep-berry" />
                    </td>
                    <td className="px-4 py-3 font-medium text-charcoal whitespace-nowrap">{r.name}</td>
                    <td className="px-4 py-3 text-charcoal">{r.email}</td>
                    <td className="px-4 py-3 text-muted whitespace-nowrap">{formatDate(r.created_at)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center text-xs font-medium px-2 py-1 rounded-full border ${r.confirmed ? "bg-green-100 text-green-700 border-green-200" : "bg-almond text-muted border-almond"}`}>
                        {r.confirmed ? "Yes" : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}

              {audience === "newsletter" &&
                subscribers.map((s) => (
                  <tr key={s.id} onClick={() => toggleOne(s.id)} className="hover:bg-almond/10 transition-colors cursor-pointer">
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selected.has(s.id)} onChange={() => toggleOne(s.id)} onClick={(e) => e.stopPropagation()} className="rounded border-almond accent-deep-berry" />
                    </td>
                    <td className="px-4 py-3 text-charcoal">{s.email}</td>
                    <td className="px-4 py-3 text-muted whitespace-nowrap">{formatDate(s.created_at)}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center text-xs font-medium px-2 py-1 rounded-full border bg-almond/50 text-muted border-almond capitalize">
                        {s.source}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {currentRows.length === 0 && (
          <div className="py-12 text-center text-muted text-sm">No records yet.</div>
        )}

        <div className="px-4 py-2.5 border-t border-almond bg-almond/10 text-xs text-muted">
          {selectedCount === 0
            ? "No recipients selected"
            : `${selectedCount} recipient${selectedCount !== 1 ? "s" : ""} selected`}
        </div>
      </div>

      {/* ── GMAIL-STYLE COMPOSE OVERLAY ── */}
      {composeState !== "closed" && (
        <>
          {/* Mobile backdrop — only when fully open */}
          {composeState === "open" && (
            <div
              className="fixed inset-0 z-40 bg-black/30 md:hidden"
              onClick={closeCompose}
            />
          )}

          {/* Compose window — flex-row so left handle sits beside content */}
          <div
            className={`fixed z-50 flex bg-white shadow-2xl overflow-hidden md:rounded-t-xl md:inset-auto md:bottom-0 md:right-8 ${
              composeState === "minimized"
                ? "bottom-0 left-0 right-0"   // mobile minimized: full-width bar at bottom
                : "inset-0"                    // mobile open: full screen
            }`}
            style={isDesktop && composeState !== "minimized"
              ? { height: composeHeight, width: composeWidth }
              : isDesktop
              ? { width: composeWidth }
              : {}}
          >
            {/* Left drag handle — desktop only */}
            <div
              className="hidden md:flex items-center justify-center w-3 bg-charcoal cursor-col-resize shrink-0 group"
              onMouseDown={startHorizontalResize}
            >
              <div className="w-0.5 h-10 bg-white/30 rounded-full group-hover:bg-white/60 transition-colors" />
            </div>

            {/* Content column */}
            <div className="flex-1 flex flex-col min-w-0">

            {/* Top drag-to-resize handle — desktop only */}
            <div
              className="hidden md:flex items-center justify-center h-3 bg-charcoal shrink-0 cursor-row-resize group"
              onMouseDown={startVerticalResize}
            >
              <div className="w-10 h-0.5 bg-white/30 rounded-full group-hover:bg-white/60 transition-colors" />
            </div>

            {/* Header bar — click to toggle minimize */}
            <div
              className="bg-charcoal text-white px-4 py-3 flex items-center justify-between shrink-0 cursor-pointer select-none"
              onClick={toggleMinimize}
            >
              <span className="text-sm font-medium truncate flex-1 mr-3">{headerTitle}</span>
              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                {/* Minimize */}
                <button
                  onClick={toggleMinimize}
                  className="flex items-center justify-center w-6 h-6 rounded hover:bg-white/20 transition-colors"
                  aria-label={composeState === "minimized" ? "Expand" : "Minimize"}
                >
                  {composeState === "minimized" ? (
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <polyline points="2 8 6 4 10 8" />
                    </svg>
                  ) : (
                    <svg width="12" height="12" fill="currentColor">
                      <rect x="1" y="9" width="10" height="2" rx="1" />
                    </svg>
                  )}
                </button>
                {/* Close */}
                <button
                  onClick={closeCompose}
                  className="flex items-center justify-center w-6 h-6 rounded hover:bg-white/20 transition-colors"
                  aria-label="Close"
                >
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="1" y1="1" x2="11" y2="11" />
                    <line x1="11" y1="1" x2="1" y2="11" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Body — hidden on desktop when minimized, always shown on mobile */}
            <div className={`flex-1 flex flex-col overflow-y-auto p-5 gap-4 bg-warm-cream ${composeState === "minimized" ? "hidden" : ""}`}>
              <div>
                <label className="block text-xs font-medium text-muted mb-1">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  maxLength={200}
                  placeholder="e.g. We're now open!"
                  className="w-full px-3 py-2 text-sm border border-almond rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-berry/30 focus:border-deep-berry transition-colors"
                />
              </div>

              <div className="flex-1 flex flex-col">
                <label className="block text-xs font-medium text-muted mb-1">Body</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Write your message here…"
                  className="flex-1 min-h-[180px] w-full px-3 py-2 text-sm border border-almond rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-berry/30 focus:border-deep-berry transition-colors resize-none"
                />
              </div>

              {/* Send row */}
              <div className="flex items-center justify-between gap-3 pt-1">
                <span className="text-xs text-muted">
                  {selectedCount === 0
                    ? "No recipients selected"
                    : `${selectedCount} recipient${selectedCount !== 1 ? "s" : ""}`}
                </span>
                <button
                  onClick={handleSend}
                  disabled={!canSend}
                  className="px-5 py-2 rounded-lg text-sm font-medium bg-deep-berry text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-deep-berry/90 transition-colors"
                >
                  {status.state === "sending" ? "Sending…" : "Send"}
                </button>
              </div>

              {/* Feedback */}
              {status.state === "success" && (
                <div className="rounded-lg px-3 py-2.5 bg-green-50 border border-green-200 text-xs text-green-700">
                  Sent to {status.sentCount} recipient{status.sentCount !== 1 ? "s" : ""} successfully.
                </div>
              )}
              {status.state === "partial" && (
                <div className="rounded-lg px-3 py-2.5 bg-amber-50 border border-amber-200 text-xs text-amber-700">
                  <p className="font-medium">Sent to {status.sentCount} of {status.sentCount + status.failedCount}. {status.failedCount} failed.</p>
                  {status.failedEmails.length > 0 && (
                    <ul className="mt-1.5 space-y-0.5">
                      {status.failedEmails.map((e) => <li key={e} className="truncate">{e}</li>)}
                    </ul>
                  )}
                </div>
              )}
              {status.state === "rate_limited" && (
                <div className="rounded-lg px-3 py-2.5 bg-red-50 border border-red-200 text-xs text-red-700">
                  Rate limit reached. Try again shortly.
                </div>
              )}
              {status.state === "error" && (
                <div className="rounded-lg px-3 py-2.5 bg-red-50 border border-red-200 text-xs text-red-700">
                  {status.message}
                </div>
              )}
            </div>
            </div> {/* end content column */}
          </div>
        </>
      )}
    </div>
  );
}
