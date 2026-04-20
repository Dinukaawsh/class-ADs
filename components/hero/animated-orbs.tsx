"use client";

import { motion } from "framer-motion";

export function AnimatedOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-[#8cb5dd]/70 blur-3xl"
        animate={{ x: [0, 55, 0], y: [0, 35, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-0 top-24 h-72 w-72 rounded-full bg-[#4f89c8]/65 blur-3xl"
        animate={{ x: [0, -45, 0], y: [0, -35, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-[#dbe9f9]/60 blur-3xl"
        animate={{ y: [0, -28, 0], scale: [1, 1.06, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/3 top-16 h-24 w-24 rounded-full border border-primary/40"
        animate={{ y: [0, 18, 0], opacity: [0.25, 0.55, 0.25] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-1/3 bottom-12 h-16 w-16 rounded-full border border-[#4f89c8]/50"
        animate={{ y: [0, -14, 0], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
