"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import SectionLabel from "@/components/SectionLabel";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

export default function GalleryContent() {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/gallery")
      .then((res) => res.json())
      .then(setImages);
  }, []);

  return (
    <div className="min-h-screen bg-warm-cream pt-40 pb-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="text-center mb-14"
        >
          <motion.div variants={fadeUp}>
            <SectionLabel text="Our Work" />
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="font-display text-5xl md:text-6xl text-charcoal font-semibold mt-2 mb-4"
          >
            Nail Art Gallery
          </motion.h1>
        </motion.div>

        {/* Masonry Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.04, delayChildren: 0.2 },
            },
          }}
          className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4"
        >
          {images.map((src, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="break-inside-avoid rounded-2xl overflow-hidden relative h-64 w-full group cursor-pointer hover:opacity-90 transition-opacity duration-200"
            >
              <Image
                src={src}
                alt={`Nail art ${i + 1}`}
                fill
                className="object-cover"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
