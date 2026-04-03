"use client";

import { motion } from "framer-motion";
import { ArrowRight, UserPlus, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";   // ← Added this

import InterestMarquee from "@/components/InterestMarquee";
import FeaturesBento from "@/components/BentoFeatures";
import Testimonials from "@/components/Testimonials";
import Navbar from "@/components/Navbar";

export default function Home() {
  const router = useRouter();

  const goToOnboarding = () => {
    router.push("/onboarding");
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 pt-20 bg-[#0A3323] text-[#F7F4D5]">
      {/* Background: Grid + Orbs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-pattern-grid" />
        <div className="absolute inset-0 opacity-30 mix-blend-screen">
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 45, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-[#F7F4D5]/10 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, -45, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-[#F7F4D5]/5 rounded-full blur-[100px]"
          />
        </div>
      </div>

      <Navbar /> 

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center mt-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <h1 className="text-7xl md:text-[140px] font-black tracking-tighter mb-4 text-[#F7F4D5] leading-none">
            Find your people.
          </h1>
          <p className="text-2xl md:text-4xl font-medium text-[#F7F4D5]/80 mb-16 tracking-tight max-w-2xl">
            Stop scrolling. <br />
            <span className="text-[#F7F4D5] italic font-serif">Start connecting.</span>
          </p>
        </motion.div>

        {/* 3-Step Visual Explainer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-16"
        >
          <StepCard
            icon={<UserPlus className="w-8 h-8 text-[#0A3323]" />}
            title="1. Build your profile"
            desc="Tell us what you care about. No filters, no posturing."
          />
          <StepCard
            icon={<Zap className="w-8 h-8 text-[#0A3323]" />}
            title="2. Get matched"
            desc="Our graph engine finds your exact interest overlap."
          />
          <StepCard
            icon={<Sparkles className="w-8 h-8 text-[#0A3323]" />}
            title="3. Do things together"
            desc="Real activities, based on the passions you share."
          />
        </motion.div>

        {/* BIG CTA BUTTON - NOW NAVIGATES TO ONBOARDING */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
        >
          <Button
            size="lg"
            onClick={goToOnboarding}                     
            className="group px-10 py-8 text-2xl font-bold bg-[#F7F4D5] text-[#0A3323] hover:bg-[#F7F4D5]/90 rounded-full border-2 border-[#F7F4D5] transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(247,244,213,0.3)] mt-10"
          >
            Get Started
            <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>

        <div className="mt-30">
          <InterestMarquee />
        </div>
        <div>
          <FeaturesBento />
        </div>
        <div className="mb-10">
          <Testimonials />
        </div>
      </div>
    </main>
  );
}

function StepCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center text-center p-8 bg-[#0A3323] border-2 border-[#F7F4D5] rounded-3xl shadow-lg transition-transform hover:-translate-y-1">
      <div className="p-4 bg-[#F7F4D5] rounded-2xl mb-6 shadow-[4px_4px_0px_0px_rgba(247,244,213,0.4)]">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-[#F7F4D5] mb-3">{title}</h3>
      <p className="text-base text-[#F7F4D5]/80 leading-relaxed">{desc}</p>
    </div>
  );
}