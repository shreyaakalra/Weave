"use client";

import { motion } from "framer-motion";

export default function InterestMarquee() {
  const interests = [
    "Hiking & Trail Running",
    "Film Photography",
    "Board Games Nights",
    "Indie Music",
    "Rock Climbing",
    "Vintage Markets",
    "Philosophy Talks",
    "Pottery & Ceramics",
    "Cooking Club",
    "Tech & Startups",
  ];

  return (
    <div className="py-8 border-t border-b border-[#F7F4D5]/10 bg-[#0A3323] overflow-hidden">
      <motion.div
        className="flex whitespace-nowrap gap-12"
        animate={{ x: ["0%", "-50%"] }}           // This makes it slide left
        transition={{
          duration: 35,                           // speed (higher = slower)
          repeat: Infinity,
          ease: "linear",                         // smooth infinite scroll
        }}
      >
        {[...interests, ...interests].map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-4 text-[#F7F4D5]/60 font-serif text-2xl italic flex-shrink-0"
          >
            {item}
            <span className="w-2 h-2 bg-[#F7F4D5]/40 rounded-full flex-shrink-0" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}