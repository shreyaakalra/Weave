"use client";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, UserPlus, Zap, Sparkles, Users, CalendarCheck, Layers } from "lucide-react";
import { useRouter } from "next/navigation";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Build your profile",
    subtitle: "No filters. No posturing.",
    body: "Tell us what actually moves you — the obscure podcasts, the 6 AM runs, the niche subreddits. Weave builds a living map of your interests, not a highlight reel.",
    tags: ["Interests", "Passions", "Vibes"],
    accent: "from-[#F7F4D5]/10 to-transparent",
  },
  {
    number: "02",
    icon: Zap,
    title: "Get matched",
    subtitle: "Graph-powered, not algorithm-gamed.",
    body: "Our interest graph finds people with real overlap — not just mutual followers. The more specific your interests, the better your matches. Niche is a feature, not a bug.",
    tags: ["Graph Engine", "Real Overlap", "No Bots"],
    accent: "from-[#2a6e4a]/20 to-transparent",
  },
  {
    number: "03",
    icon: Sparkles,
    title: "Do things together",
    subtitle: "Activities, not just DMs.",
    body: "Weave surfaces things to actually do — hikes, book clubs, jam sessions, coworking — based on what you both care about. Connections form around shared experience.",
    tags: ["IRL Events", "Shared Hobbies", "Small Groups"],
    accent: "from-[#F7F4D5]/8 to-transparent",
  },
];

const stats = [
  { value: "94%", label: "say their first Weave meetup felt natural" },
  { value: "3.2×", label: "more likely to stay in touch vs apps" },
  { value: "48h", label: "average time from match to first plan" },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function GrainOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 opacity-[0.035]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "128px 128px",
      }}
    />
  );
}

function ScrollLine() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={ref} className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-px -translate-x-1/2 overflow-hidden">
      <div className="absolute inset-0 bg-[#F7F4D5]/8" />
      <motion.div
        style={{ scaleY, transformOrigin: "top" }}
        className="absolute inset-0 bg-gradient-to-b from-[#F7F4D5]/60 via-[#F7F4D5]/30 to-transparent"
      />
    </div>
  );
}

function StepCard({ step, index }: { step: (typeof steps)[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const isEven = index % 2 === 0;
  const Icon = step.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isEven ? -40 : 40, filter: "blur(6px)" }}
      animate={inView ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      className={`relative flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-16 
        ${isEven ? "md:flex-row" : "md:flex-row-reverse"}`}
    >
      {/* Timeline node */}
      <div className="absolute left-[28px] md:left-1/2 top-0 -translate-x-1/2 z-10">
        <motion.div
          animate={inView ? { scale: [0, 1.3, 1] } : { scale: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-4 h-4 rounded-full bg-[#F7F4D5] shadow-[0_0_20px_4px_rgba(247,244,213,0.25)]"
        />
      </div>

      {/* Card — full width on mobile, half on desktop */}
      <div className={`pl-16 md:pl-0 w-full md:w-[calc(50%-3rem)] ${isEven ? "md:text-right" : "md:text-left"}`}>
        <div
          className={`relative rounded-[28px] border border-[#F7F4D5]/10 bg-gradient-to-br ${step.accent} 
            backdrop-blur-sm p-7 md:p-9 overflow-hidden group 
            hover:border-[#F7F4D5]/20 transition-all duration-500 hover:shadow-[0_0_60px_-20px_rgba(247,244,213,0.15)]`}
        >
          {/* Big step number watermark */}
          <span
            className="absolute -top-4 -right-2 text-[120px] font-black text-[#F7F4D5]/[0.04] 
              leading-none select-none font-serif pointer-events-none"
          >
            {step.number}
          </span>

          {/* Icon */}
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#F7F4D5]/8 border border-[#F7F4D5]/10 mb-5 group-hover:bg-[#F7F4D5]/12 transition-colors duration-300">
            <Icon className="w-5 h-5 text-[#F7F4D5]/70" strokeWidth={1.6} />
          </div>

          {/* Step label */}
          <div className="text-[10px] tracking-[3px] uppercase text-[#F7F4D5]/35 font-medium mb-2">
            Step {step.number}
          </div>

          {/* Title */}
          <h3 className="font-serif text-3xl md:text-4xl font-bold text-[#F7F4D5] leading-tight mb-1">
            {step.title}
          </h3>
          <p className="text-[#F7F4D5]/40 text-sm italic mb-4">{step.subtitle}</p>

          {/* Body */}
          <p className="text-[#F7F4D5]/65 text-base leading-relaxed mb-6">{step.body}</p>

          {/* Tags */}
          <div className={`flex flex-wrap gap-2 ${isEven ? "md:justify-end" : "justify-start"}`}>
            {step.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs font-medium bg-[#F7F4D5]/6 border border-[#F7F4D5]/10 text-[#F7F4D5]/50"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Spacer for opposite side on desktop */}
      <div className="hidden md:block w-[calc(50%-3rem)]" />
    </motion.div>
  );
}

function StatBar() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-[#F7F4D5]/8 rounded-[28px] overflow-hidden border border-[#F7F4D5]/8"
    >
      {stats.map((s, i) => (
        <div
          key={i}
          className="flex flex-col items-center justify-center text-center px-8 py-10 bg-[#0A3323] gap-2"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.15 * i, ease: "easeOut" }}
            className="font-serif text-5xl md:text-6xl font-bold text-[#F7F4D5]"
          >
            {s.value}
          </motion.span>
          <span className="text-sm text-[#F7F4D5]/40 leading-snug max-w-[160px]">{s.label}</span>
        </div>
      ))}
    </motion.div>
  );
}


export default function HowItWorksPage() {
  const router = useRouter();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <main className="relative min-h-screen bg-[#0A3323] text-[#F7F4D5] overflow-x-hidden">
      <GrainOverlay />

      {/* ── Hero ── */}
      <section ref={heroRef} className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 pt-24 pb-16 overflow-hidden">
        {/* Radial glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[900px] max-h-[900px] rounded-full bg-[#F7F4D5]/[0.04] blur-[120px]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent to-[#F7F4D5]/20" />
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "linear-gradient(#F7F4D5 1px, transparent 1px), linear-gradient(90deg, #F7F4D5 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto"
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="h-px w-10 bg-[#F7F4D5]/25" />
            <span className="text-[10px] tracking-[4px] uppercase text-[#F7F4D5]/40 font-medium">
              How Weave Works
            </span>
            <div className="h-px w-10 bg-[#F7F4D5]/25" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-[clamp(3rem,10vw,8rem)] font-bold leading-[1.0] tracking-tight text-[#F7F4D5] mb-6"
          >
            Three steps to{" "}
            <span className="italic text-[#F7F4D5]/50">real</span>
            <br />
            connection.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="text-lg md:text-xl text-[#F7F4D5]/50 leading-relaxed max-w-lg"
          >
            No swiping. No cold DMs. No algorithm deciding who you should know.
            Just people, interests, and things worth doing together.
          </motion.p>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-col items-center gap-2 mt-16"
          >
            <span className="text-[10px] tracking-[3px] uppercase text-[#F7F4D5]/20">Scroll</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-px h-10 bg-gradient-to-b from-[#F7F4D5]/30 to-transparent"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Steps Timeline ── */}
      <section className="relative px-6 pb-32 max-w-5xl mx-auto">
        {/* Vertical line */}
        <div className="relative">
          <ScrollLine />

          <div className="flex flex-col gap-24 md:gap-36 pt-8">
            {steps.map((step, i) => (
              <StepCard key={step.number} step={step} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="px-6 pb-24 max-w-4xl mx-auto">
        <StatBar />
      </section>

      {/* ── Why we built this ── */}
      <section className="px-6 pb-32 max-w-3xl mx-auto">
        <WhySection />
      </section>

      {/* ── CTA ── */}
      <section className="px-6 pb-32">
        <CTASection router={router} />
      </section>
    </main>
  );
}

function WhySection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-[32px] border border-[#F7F4D5]/10 p-10 md:p-14 overflow-hidden"
    >
      {/* bg texture */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f2e1e] to-[#0A3323]" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#F7F4D5]/[0.03] rounded-full blur-[80px]" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <Layers className="w-4 h-4 text-[#F7F4D5]/30" strokeWidth={1.5} />
          <span className="text-[10px] tracking-[3px] uppercase text-[#F7F4D5]/30">Why we built this</span>
        </div>

        <blockquote className="font-serif text-3xl md:text-4xl font-bold text-[#F7F4D5] leading-[1.2] tracking-tight mb-6">
          Most apps optimise for engagement.{" "}
          <span className="text-[#F7F4D5]/40 italic">
            We optimise for the moment you find your people.
          </span>
          
        </blockquote>

        <div className="flex flex-wrap gap-6 mt-8">
          {[
            { icon: Users, text: "Built for small, intentional groups" },
            { icon: CalendarCheck, text: "Events that actually happen" },
            { icon: Zap, text: "Interest graph, not engagement loop" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2.5 text-sm text-[#F7F4D5]/45">
              <Icon className="w-4 h-4 text-[#F7F4D5]/30" strokeWidth={1.5} />
              {text}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function CTASection({ router }: { router: ReturnType<typeof useRouter> }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center text-center gap-8"
    >
      <div className="w-px h-16 bg-gradient-to-b from-[#F7F4D5]/20 to-transparent" />

      <h2 className="font-serif text-[clamp(2.5rem,7vw,5.5rem)] font-bold tracking-tight text-[#F7F4D5] leading-[1.05]">
        Ready to find{" "}
        <span className="italic text-[#F7F4D5]/50">your people?</span>
      </h2>

      <p className="text-[#F7F4D5]/45 text-lg max-w-md">
        It takes 3 minutes. No credit card. No endless scrolling.
      </p>

      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => router.push("/onboarding")}
        className="group flex items-center gap-3 px-10 py-5 bg-[#F7F4D5] text-[#0A3323] text-lg font-bold rounded-full border-2 border-[#F7F4D5] shadow-[0_0_60px_-10px_rgba(247,244,213,0.4)] hover:shadow-[0_0_80px_-10px_rgba(247,244,213,0.5)] transition-shadow duration-300"
      >
        Get Started
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
      </motion.button>

      <span className="text-xs text-[#F7F4D5]/20 tracking-wide">
        Already on Weave?{" "}
        <button
          onClick={() => router.push("/login")}
          className="underline underline-offset-4 hover:text-[#F7F4D5]/40 transition-colors"
        >
          Sign in
        </button>
      </span>
    </motion.div>
  );
}