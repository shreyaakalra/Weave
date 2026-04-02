import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="relative px-6 py-32 text-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1E7A55]/30 to-transparent pointer-events-none" />
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="font-serif text-7xl md:text-8xl font-black tracking-tighter leading-none mb-6"
      >
        Your people<br />are out there.
      </motion.h2>
      <p className="text-2xl text-[#F7F4D5]/70 mb-12">Stop waiting. Start weaving.</p>
      
      <Button
        size="lg"
        className="text-2xl px-16 py-9 rounded-3xl bg-[#F7F4D5] text-[#0A3323] hover:scale-105 transition-transform"
      >
        Find your people
        <ArrowRight className="ml-4" />
      </Button>
    </section>
  );
}