"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdSpa } from "react-icons/md";

const SUBSCRIBED_KEY = "iconix_subscribed";

export default function EmailPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Auto-show after 2s if not already subscribed
    if (!localStorage.getItem(SUBSCRIBED_KEY)) {
      const timer = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    // Force-open when triggered from the footer button
    function handleOpen() {
      setSuccess(false);
      setEmail("");
      setVisible(true);
    }
    window.addEventListener("open-email-popup", handleOpen);
    return () => window.removeEventListener("open-email-popup", handleOpen);
  }, []);

  function dismiss() {
    setVisible(false);
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      // Silently ignore network errors — dismiss anyway
    }

    // Mark subscribed so popup never shows again
    localStorage.setItem(SUBSCRIBED_KEY, "1");
    setSuccess(true);
    setTimeout(() => setVisible(false), 2000);
  }

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={dismiss}
            className="fixed inset-0 z-[60] bg-charcoal/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="fixed inset-0 z-[61] flex items-center justify-center px-4 pointer-events-none"
          >
            <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-8 relative pointer-events-auto">
              {/* Close */}
              <button
                onClick={dismiss}
                aria-label="Close"
                className="absolute top-4 right-4 text-muted hover:text-charcoal transition-colors duration-200 text-xl leading-none"
              >
                ×
              </button>

              {/* Icon */}
              <div className="flex justify-center mb-4">
                <MdSpa className="text-4xl text-gold" />
              </div>

              {success ? (
                <>
                  <h2 className="font-display text-2xl text-charcoal font-semibold text-center mb-2">
                    You&apos;re on the list!
                  </h2>
                  <p className="text-muted text-sm text-center leading-relaxed">
                    We&apos;ll be in touch with your exclusive welcome discount.
                  </p>
                </>
              ) : (
                <>
                  {/* Copy */}
                  <h2 className="font-display text-2xl text-charcoal font-semibold text-center mb-2">
                    Get 10% Off Your First Visit
                  </h2>
                  <p className="text-muted text-sm text-center leading-relaxed mb-6">
                    Join our mailing list and receive an exclusive welcome discount, plus early access to new services and seasonal offers.
                  </p>

                  {/* Form */}
                  <form className="space-y-3" onSubmit={handleSubmit}>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-almond bg-warm-cream text-charcoal placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all duration-200 text-sm"
                    />
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3 rounded-full bg-deep-berry text-white font-semibold text-sm uppercase tracking-widest hover:scale-105 hover:bg-deep-berry/90 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {submitting ? "Saving…" : "Claim My Discount"}
                    </button>
                  </form>

                  <p className="text-center text-muted/60 text-xs mt-4">No spam. Unsubscribe anytime.</p>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
