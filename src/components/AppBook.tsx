"use client";

import { motion } from "framer-motion";
import SignupForm from "@/components/SignupForm";
import { SOFT_OPENING_SPOTS } from "@/lib/config";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" as const, delay },
});

export default function AppBookContent() {
  return (
    <>
      {/* Badge + Heading + Location */}
      <motion.div className="flex flex-col items-center m-auto" {...fadeUp(0)}>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/40 bg-gold/10 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
          <span className="text-xs uppercase tracking-[0.2em] text-gold font-semibold">
            Book Appointment
          </span>
        </div>

        <h1 className="font-display text-5xl md:text-7xl text-white font-semibold text-center mb-4 leading-tight">
          COMING SOON
        </h1>
        <p className="mb-6 text-center text-sm md:text-base uppercase tracking-[0.28em] text-white/60">
          to Copperfield • Houston, Texas
        </p>
      </motion.div>
    </>
  );
}
