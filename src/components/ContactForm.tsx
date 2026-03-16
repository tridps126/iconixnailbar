"use client";

import { useState } from "react";

export default function ContactForm() {
  const [fields, setFields] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });
    if (res.ok) {
      setStatus("success");
    } else {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="py-10 text-center">
        <p className="font-display text-2xl text-charcoal font-semibold mb-2">Message sent!</p>
        <p className="text-muted text-sm">We'll get back to you as soon as possible.</p>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="name"
            className="block text-xs uppercase tracking-[0.1em] text-charcoal/70 font-semibold mb-2"
          >
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Jane Smith"
            required
            value={fields.name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-almond bg-warm-cream text-charcoal placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all duration-200 text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-xs uppercase tracking-[0.1em] text-charcoal/70 font-semibold mb-2"
          >
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="jane@email.com"
            required
            value={fields.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-almond bg-warm-cream text-charcoal placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all duration-200 text-sm"
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="phone"
          className="block text-xs uppercase tracking-[0.1em] text-charcoal/70 font-semibold mb-2"
        >
          Phone Number
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          placeholder="(555) 000-0000"
          value={fields.phone}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-almond bg-warm-cream text-charcoal placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all duration-200 text-sm"
        />
      </div>
      <div>
        <label
          htmlFor="message"
          className="block text-xs uppercase tracking-[0.1em] text-charcoal/70 font-semibold mb-2"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="Tell us how we can help..."
          required
          value={fields.message}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-almond bg-warm-cream text-charcoal placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all duration-200 text-sm resize-none"
        />
      </div>
      {status === "error" && (
        <p className="text-red-500 text-xs">Something went wrong. Please try again.</p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full sm:w-auto px-10 py-3.5 rounded-full bg-deep-berry text-white font-semibold text-sm uppercase tracking-widest hover:scale-105 hover:bg-deep-berry/90 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "loading" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
