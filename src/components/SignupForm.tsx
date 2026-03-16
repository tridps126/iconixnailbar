"use client";

import { useState } from "react";

export default function SignupForm() {
  const [fields, setFields] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "full" | "duplicate">("idle");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: fields.firstName,
        lastName: fields.lastName,
        email: fields.email || undefined,
        phone: fields.phone,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setStatus("success");
    } else if (data.error === "spots_full") {
      setStatus("full");
    } else if (data.error === "already_registered") {
      setStatus("duplicate");
    } else {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="text-center py-6">
        <p className="font-display text-2xl text-white font-semibold mb-2">You&apos;re entered!</p>
        <p className="text-white/60 text-sm">We&apos;ll notify you when we open and announce the winner.</p>
      </div>
    );
  }

  if (status === "full") {
    return (
      <div className="text-center py-6">
        <p className="font-display text-2xl text-white font-semibold mb-2">All spots are taken!</p>
        <p className="text-white/60 text-sm">Follow us on Instagram for future updates.</p>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>

      {/* First Name + Last Name side by side */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="firstName" className="block text-xs uppercase tracking-[0.1em] text-white/50 font-semibold mb-2">
            First Name <span className="text-gold">*</span>
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            placeholder="Jane"
            required
            value={fields.firstName}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all duration-200 text-sm"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-xs uppercase tracking-[0.1em] text-white/50 font-semibold mb-2">
            Last Name <span className="text-gold">*</span>
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Smith"
            required
            value={fields.lastName}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all duration-200 text-sm"
          />
        </div>
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="sp-phone" className="block text-xs uppercase tracking-[0.1em] text-white/50 font-semibold mb-2">
          Phone Number <span className="text-gold">*</span>
        </label>
        <input
          id="sp-phone"
          name="phone"
          type="tel"
          placeholder="(555) 000-0000"
          required
          value={fields.phone}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all duration-200 text-sm"
        />
      </div>

      {/* Email (optional) */}
      <div>
        <label htmlFor="sp-email" className="block text-xs uppercase tracking-[0.1em] text-white/50 font-semibold mb-2">
          Email Address <span className="text-white/30">(optional)</span>
        </label>
        <input
          id="sp-email"
          name="email"
          type="email"
          placeholder="jane@email.com"
          value={fields.email}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all duration-200 text-sm"
        />
      </div>

      {status === "duplicate" && (
        <p className="text-gold text-xs text-center">This entry is already registered.</p>
      )}
      {status === "error" && (
        <p className="text-red-400 text-xs text-center">Something went wrong. Please try again.</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-4 rounded-full bg-gold text-charcoal font-semibold text-sm uppercase tracking-widest hover:scale-105 hover:brightness-105 transition-all duration-200 mt-2 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "loading" ? "Submitting..." : "Enter to Win"}
      </button>

      <p className="text-center text-white/30 text-xs">
        By submitting, you agree to receive SMS updates. Reply STOP to unsubscribe.
      </p>
    </form>
  );
}
