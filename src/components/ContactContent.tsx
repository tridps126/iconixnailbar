"use client";

import { motion, type Variants } from "framer-motion";
import SectionLabel from "@/components/SectionLabel";
import ContactForm from "@/components/ContactForm";
import {
  ADDRESS_LINE1,
  ADDRESS_LINE2,
  PHONE,
  EMAIL,
  HOURS,
  SOCIALS,
} from "@/lib/config";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function ContactContent() {
  return (
    <div className="min-h-screen bg-warm-cream pt-40 pb-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="mb-14"
        >
          <motion.div variants={fadeUp}>
            <SectionLabel text="Get In Touch" />
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="font-display text-5xl md:text-6xl text-charcoal font-semibold mt-2 mb-4"
          >
            Contact Us
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-muted leading-relaxed max-w-lg"
          >
            Questions, bookings, or just want to say hello — we&apos;d love to
            hear from you.
          </motion.p>
        </motion.div>

        {/* Info + Map Row */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.1, delayChildren: 0.2 },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16"
        >
          {/* Contact Details */}
          <motion.div variants={fadeUp} className="space-y-8">
            <div>
              <h2 className="font-semibold text-charcoal mb-3 text-sm uppercase tracking-[0.1em]">
                Location
              </h2>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${ADDRESS_LINE1}, ${ADDRESS_LINE2}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted leading-relaxed hover:text-deep-berry transition-colors duration-200"
              >
                {ADDRESS_LINE1}
                <br />
                {ADDRESS_LINE2}
              </a>
              <p className="text-xs text-muted/60 mt-1">Copperfield • Houston Nail Salon</p>
            </div>
            <div>
              <h2 className="font-semibold text-charcoal mb-3 text-sm uppercase tracking-[0.1em]">
                Phone & Email
              </h2>
              <div>
                <a
                  href={`tel:${PHONE.replace(/[^+\d]/g, "")}`}
                  className="text-muted hover:text-deep-berry transition-colors duration-200"
                >
                  {PHONE}
                </a>
              </div>
              <div>
                <a
                  href={`mailto:${EMAIL}`}
                  className="text-muted hover:text-deep-berry transition-colors duration-200"
                >
                  {EMAIL}
                </a>
              </div>
            </div>
            <div>
              <h2 className="font-semibold text-charcoal mb-3 text-sm uppercase tracking-[0.1em]">
                Hours
              </h2>
              <ul className="space-y-1.5">
                {HOURS.map((h) => (
                  <li
                    key={h.day}
                    className="flex justify-between text-sm gap-8"
                  >
                    <span className="text-charcoal/80">{h.day}</span>
                    <span className="text-muted">{h.time}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-semibold text-charcoal mb-3 text-sm uppercase tracking-[0.1em]">
                Follow Us
              </h2>
              <div className="flex gap-4">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted hover:text-deep-berry transition-colors duration-200 border-b border-muted/30 pb-0.5"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Map Placeholder */}
          <motion.div
            variants={fadeUp}
            className="rounded-2xl overflow-hidden min-h-64 md:min-h-auto"
          >
            <iframe
              src={`https://www.google.com/maps?q=${encodeURIComponent(`${ADDRESS_LINE1}, ${ADDRESS_LINE2}`)}&output=embed`}
              className="w-full h-full min-h-64"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Location"
            />
          </motion.div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4, ease: "easeOut" }}
          className="bg-white rounded-2xl border border-almond shadow-sm p-8 md:p-10 max-w-2xl"
        >
          <h2 className="font-display text-2xl text-charcoal font-semibold mb-6">
            Send Us a Message
          </h2>
          <ContactForm />
        </motion.div>
      </div>
    </div>
  );
}
