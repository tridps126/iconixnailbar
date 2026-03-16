"use client";

import { motion } from "framer-motion";
import SignupForm from "@/components/SignupForm";
import { SOFT_OPENING_SPOTS } from "@/lib/config";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" as const, delay },
});

export default function SpecialPageContent() {
  return (
    <>
      {/* Badge + Heading + Location */}
      <motion.div className="flex flex-col items-center" {...fadeUp(0)}>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/40 bg-gold/10 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
          <span className="text-xs uppercase tracking-[0.2em] text-gold font-semibold">
            Limited Time
          </span>
        </div>

        <h1 className="font-display text-5xl md:text-7xl text-white font-semibold text-center mb-4 leading-tight">
          COMING SOON
        </h1>
        <p className="mb-6 text-center text-sm md:text-base uppercase tracking-[0.28em] text-white/60">
          to Copperfield, TX
        </p>
      </motion.div>

      {/* Prize Card + Perks */}
      <motion.div className="flex flex-col items-center" {...fadeUp(0.15)}>
        <div className="relative mb-10 flex flex-col items-center">
          <div className="absolute inset-x-0 top-10 mx-auto h-28 w-56 rounded-full bg-gold/20 blur-3xl" />
          <div className="relative z-10 mt-4 rounded-[2rem] border border-white/10 bg-white/5 px-8 py-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-md">
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-10 bg-gradient-to-r from-transparent to-gold/60" />
              <span className="text-[1rem] uppercase tracking-[0.4em] text-white/45">
                WIN
              </span>
              <div className="h-px w-10 bg-gradient-to-l from-transparent to-gold/60" />
            </div>
            <span className="mt-3 block text-center font-display text-7xl md:text-[7rem] font-bold leading-none text-[#E6C98A] drop-shadow-[0_10px_28px_rgba(230,201,138,0.35)]">
              $500
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center mb-12">
          {["Free Pedicure", "VIP Grand Opening Discounts"].map((perk) => (
            <span
              key={perk}
              className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm"
            >
              ✦ {perk}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Form */}
      <motion.div className="w-full max-w-md" {...fadeUp(0.3)}>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="font-display text-2xl text-white font-semibold mb-1">
            JOIN THE VIP LIST
          </h2>
          <p className="text-white/40 text-sm mb-6">
            First {SOFT_OPENING_SPOTS} VIP Members Receive Exclusive Opening
            Offers
          </p>
          <SignupForm />
        </div>
      </motion.div>
    </>
  );
}
