"use client";

import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useRef, useEffect } from "react";
import {
  ArrowRight,
  MessageCircle,
  Users,
  Map,
  Compass,
  Flame,
  Heart,
  Sparkles,
  Coffee,
  Music,
  BookOpen,
  Bike,
  Camera,
  Utensils,
} from "lucide-react";
import { useRouter } from "next/navigation";

const features = [
  {
    id: "match",
    icon: MessageCircle,
    eyebrow: "Deep Matching",
    title: "Talk to people who actually get it.",
    body: "Weave's interest graph doesn't just look at what you follow — it maps what you're genuinely obsessed with. Every match is someone who already shares your frequency.",
    bullets: [
      "Matched on 10+ interest dimensions",
      "No cold openers — you already have something to talk about",
      "Filters for vibe, not just location",
    ],
    visual: <MatchVisual />,
    flip: false,
  },
  {
    id: "friends",
    icon: Heart,
    eyebrow: "Real Friendship",
    title: "From strangers to your people.",
    body: "Most apps stop at the match. Weave is built for what comes next — turning that first spark into an actual friendship. We make it easy to keep showing up for each other.",
    bullets: [
      "Friendship score that grows over time",
      "Nudges to check in when you've gone quiet",
      "Shared memory board for your best moments",
    ],
    visual: <FriendVisual />,
    flip: true,
  },
  {
    id: "activities",
    icon: Map,
    eyebrow: "Activity Engine",
    title: "A bucket list you'll actually do.",
    body: "We surface personalised activities for you and your matches — curated based on your shared interests, your city, and how well you know each other. Friendship as a practice.",
    bullets: [
      "100s of activities across 20+ interest categories",
      "Scales from first hangout to lifelong ritual",
      "Local events, IRL spots, and online experiences",
    ],
    visual: <ActivityVisual />,
    flip: false,
  },
  {
    id: "discover",
    icon: Compass,
    eyebrow: "Discovery Feed",
    title: "Your world, expanded.",
    body: "Beyond your matches, Weave surfaces communities, micro-events, and interest circles you'd never stumble on alone. The algorithm works for serendipity, not addiction.",
    bullets: [
      "Curated events in your city every week",
      "Interest circles of 5–12 people",
      "Zero doomscrolling — intentional discovery only",
    ],
    visual: <DiscoverVisual />,
    flip: true,
  },
];

const interestPills = [
  { label: "Specialty Coffee", icon: Coffee },
  { label: "Indie Music", icon: Music },
  { label: "Book Clubs", icon: BookOpen },
  { label: "Urban Cycling", icon: Bike },
  { label: "Film Photography", icon: Camera },
  { label: "Supper Clubs", icon: Utensils },
  { label: "Bonfires", icon: Flame },
  { label: "Deep Talks", icon: Sparkles },
];


function MatchVisual() {
  const profiles = [
    { name: "asha.reads", tag: "Books · Chai · Rooftops", offset: "-translate-y-2" },
    { name: "nocturnaldev", tag: "Code · Jazz · Night runs", offset: "translate-y-2" },
  ];
  return (
    <div className="relative flex flex-col gap-4 items-center justify-center py-6">
      <motion.div
        animate={{ scale: [1, 1.12, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 rounded-full bg-[#F7F4D5]/5 blur-2xl pointer-events-none"
      />
      {profiles.map((p, i) => (
        <motion.div
          key={p.name}
          initial={{ opacity: 0, x: i === 0 ? -30 : 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 * i }}
          className={`flex items-center gap-3 bg-[#0f2a1c] border border-[#F7F4D5]/12 rounded-2xl px-4 md:px-5 py-3 md:py-3.5 w-full ${p.offset}`}
        >
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#F7F4D5]/10 border border-[#F7F4D5]/15 flex items-center justify-center text-xs font-bold text-[#F7F4D5]/60 shrink-0">
            {p.name[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-[#F7F4D5]/80 truncate">{p.name}</div>
            <div className="text-[11px] md:text-xs text-[#F7F4D5]/35 truncate">{p.tag}</div>
          </div>
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
            className="ml-auto w-2 h-2 rounded-full bg-[#F7F4D5]/40 shrink-0"
          />
        </motion.div>
      ))}
      <motion.div
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="flex items-center gap-2 bg-[#F7F4D5]/10 border border-[#F7F4D5]/20 rounded-full px-4 py-2 text-[11px] md:text-xs font-semibold text-[#F7F4D5]/70 whitespace-nowrap"
      >
        <Sparkles className="w-3 h-3 shrink-0" />
        87% interest overlap
      </motion.div>
    </div>
  );
}

function FriendVisual() {
  const milestones = [
    { label: "First chat", done: true },
    { label: "Coffee meetup", done: true },
    { label: "Weekend hike", done: false },
    { label: "Introduce to crew", done: false },
  ];
  return (
    <div className="flex flex-col gap-3 py-4">
      {milestones.map((m, i) => (
        <motion.div
          key={m.label}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: i * 0.12 }}
          className={`flex items-center gap-3 rounded-xl px-4 py-3 border transition-all ${
            m.done
              ? "bg-[#F7F4D5]/8 border-[#F7F4D5]/15"
              : "bg-transparent border-[#F7F4D5]/6"
          }`}
        >
          <motion.div
            animate={m.done ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
            className={`w-4 h-4 md:w-5 md:h-5 rounded-full border flex items-center justify-center shrink-0 ${
              m.done
                ? "bg-[#F7F4D5]/20 border-[#F7F4D5]/30"
                : "border-[#F7F4D5]/15"
            }`}
          >
            {m.done && <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#F7F4D5]/60" />}
          </motion.div>
          <span className={`text-sm ${m.done ? "text-[#F7F4D5]/70" : "text-[#F7F4D5]/25"}`}>
            {m.label}
          </span>
          {m.done && (
            <span className="ml-auto text-[10px] tracking-wide text-[#F7F4D5]/30 uppercase hidden sm:block">Done</span>
          )}
        </motion.div>
      ))}
      <div className="mt-1 h-1.5 rounded-full bg-[#F7F4D5]/8 overflow-hidden">
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "50%" }}
          transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-[#F7F4D5]/40 to-[#F7F4D5]/20"
        />
      </div>
      <div className="text-xs text-[#F7F4D5]/25 text-right">Friendship level · 2 of 4</div>
    </div>
  );
}

function ActivityVisual() {
  const activities = [
    { emoji: "🌄", title: "Sunrise hike", tag: "Outdoors · 2h" },
    { emoji: "📖", title: "Bookshop crawl", tag: "Culture · 3h" },
    { emoji: "🎸", title: "Open mic night", tag: "Music · Evening" },
  ];
  return (
    <div className="flex flex-col gap-3 py-4">
      {activities.map((a, i) => (
        <motion.div
          key={a.title}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.14 }}
          whileHover={{ x: 4 }}
          className="flex items-center gap-3 md:gap-4 bg-[#0f2a1c] border border-[#F7F4D5]/10 rounded-2xl px-4 py-3.5 cursor-pointer group hover:border-[#F7F4D5]/20 transition-all"
        >
          <span className="text-xl md:text-2xl">{a.emoji}</span>
          <div>
            <div className="text-sm font-semibold text-[#F7F4D5]/80 group-hover:text-[#F7F4D5] transition-colors">
              {a.title}
            </div>
            <div className="text-[11px] md:text-xs text-[#F7F4D5]/30">{a.tag}</div>
          </div>
          <ArrowRight className="ml-auto w-4 h-4 text-[#F7F4D5]/20 group-hover:text-[#F7F4D5]/50 group-hover:translate-x-1 transition-all" />
        </motion.div>
      ))}
    </div>
  );
}

function DiscoverVisual() {
  return (
    <div className="flex flex-wrap gap-2 md:gap-2.5 py-4 justify-center">
      {interestPills.map((p, i) => {
        const Icon = p.icon;
        return (
          <motion.div
            key={p.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
            whileHover={{ scale: 1.06, y: -2 }}
            className="flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-[#0f2a1c] border border-[#F7F4D5]/12 text-[13px] md:text-sm text-[#F7F4D5]/55 hover:text-[#F7F4D5]/80 hover:border-[#F7F4D5]/25 cursor-pointer transition-all"
          >
            <Icon className="w-3 h-3 md:w-3.5 md:h-3.5" strokeWidth={1.6} />
            {p.label}
          </motion.div>
        );
      })}
    </div>
  );
}


function MouseGlow() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 55, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 55, damping: 20 });
  useEffect(() => {
    const move = (e: MouseEvent) => { mouseX.set(e.clientX); mouseY.set(e.clientY); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [mouseX, mouseY]);
  return (
    // Hidden on smaller screens to prevent weird behavior on touch devices
    <motion.div
      className="hidden md:block fixed pointer-events-none z-0 rounded-full"
      style={{
        width: 700, height: 700,
        x: springX, y: springY,
        translateX: "-50%", translateY: "-50%",
        background: "radial-gradient(circle, rgba(247,244,213,0.04) 0%, transparent 65%)",
      }}
    />
  );
}

function ParticleField() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i, x: `${(i * 41 + 13) % 100}%`, y: `${(i * 57 + 9) % 100}%`,
    delay: (i * 0.37) % 9, duration: 5 + (i % 6) * 1.4,
    size: i % 3 === 0 ? 2 : 1.5, opacity: 0.06 + (i % 5) * 0.03,
  }));
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-[#F7F4D5]"
          style={{ left: p.x, top: p.y, width: p.size, height: p.size, opacity: p.opacity }}
          animate={{ opacity: [p.opacity, p.opacity * 5, p.opacity], scale: [1, 2, 1] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function FloatingOrbs() {
  const orbs = [
    { x: "-8%", y: "8%",  size: "50vw", delay: 0,   dur: 22, opacity: 0.22 },
    { x: "55%", y: "5%",  size: "38vw", delay: 3,   dur: 18, opacity: 0.13 },
    { x: "5%",  y: "55%", size: "42vw", delay: 6,   dur: 24, opacity: 0.18 },
    { x: "62%", y: "58%", size: "46vw", delay: 1.5, dur: 20, opacity: 0.10 },
  ];
  return (
    <>
      {orbs.map((o, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{ left: o.x, top: o.y, width: o.size, height: o.size, opacity: o.opacity }}
          animate={{ y: [0, -35, 18, -18, 0], x: [0, 18, -12, 8, 0], scale: [1, 1.07, 0.96, 1.03, 1] }}
          transition={{ duration: o.dur, delay: o.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-full h-full rounded-full" style={{ background: "radial-gradient(circle at 40% 40%, rgba(247,244,213,0.18) 0%, rgba(247,244,213,0.04) 50%, transparent 70%)", filter: "blur(40px)" }} />
        </motion.div>
      ))}
    </>
  );
}

function RingPulse({ cx, cy, delay }: { cx: string; cy: string; delay: number }) {
  return (
    <div className="absolute pointer-events-none" style={{ left: cx, top: cy, transform: "translate(-50%,-50%)" }}>
      {[0, 1].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-[#F7F4D5]/8"
          style={{ left: "50%", top: "50%", translateX: "-50%", translateY: "-50%" }}
          animate={{ width: [30, 200], height: [30, 200], opacity: [0.4, 0] }}
          transition={{ duration: 5.5, delay: delay + i * 1.7, repeat: Infinity, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

function GrainOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 opacity-[0.035] mix-blend-overlay"
      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`, backgroundRepeat: "repeat", backgroundSize: "128px 128px" }}
    />
  );
}



function FeatureRow({ feature, index }: { feature: (typeof features)[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const Icon = feature.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48, filter: "blur(8px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
      className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center ${feature.flip ? "lg:[&>*:first-child]:order-2" : ""}`}
    >
      {/* Text side */}
      <div className="flex flex-col gap-4 md:gap-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-xl bg-[#F7F4D5]/8 border border-[#F7F4D5]/12">
            <Icon className="w-4 h-4 md:w-4.5 md:h-4.5 text-[#F7F4D5]/60" strokeWidth={1.6} />
          </div>
          <span className="text-[10px] tracking-[3px] uppercase text-[#F7F4D5]/35 font-medium">{feature.eyebrow}</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.1] md:leading-[1.08] tracking-tight text-[#F7F4D5]">
          {feature.title}
        </h2>

        <p className="text-[#F7F4D5]/55 text-base md:text-lg leading-relaxed max-w-md">{feature.body}</p>

        <ul className="flex flex-col gap-2.5 md:gap-3 mt-2">
          {feature.bullets.map((b, i) => (
            <motion.li
              key={b}
              initial={{ opacity: 0, x: -16 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.25 + i * 0.1 }}
              className="flex items-start gap-3 text-sm text-[#F7F4D5]/50"
            >
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#F7F4D5]/30 shrink-0" />
              {b}
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Visual side */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        className="relative rounded-[24px] md:rounded-[28px] border border-[#F7F4D5]/10 bg-[#0c2318] p-5 md:p-8 overflow-hidden group hover:border-[#F7F4D5]/18 transition-all duration-500"
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ background: "radial-gradient(circle at 60% 30%, rgba(247,244,213,0.05) 0%, transparent 65%)" }} />
        <span className="absolute -bottom-4 -right-2 text-[100px] md:text-[140px] font-black text-[#F7F4D5]/[0.035] leading-none select-none font-serif pointer-events-none">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="relative z-10">{feature.visual}</div>
      </motion.div>
    </motion.div>
  );
}


function PillMarquee() {
  const pills = [...interestPills, ...interestPills];
  return (
    <div className="relative w-full overflow-hidden mt-8 md:mt-10 mb-2">
      <div className="absolute left-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-r from-[#0A3323] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-l from-[#0A3323] to-transparent z-10 pointer-events-none" />
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        className="flex gap-2.5 md:gap-3 w-max"
      >
        {pills.map((p, i) => {
          const Icon = p.icon;
          return (
            <div key={i} className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-[#F7F4D5]/6 border border-[#F7F4D5]/10 text-[13px] md:text-sm text-[#F7F4D5]/40 whitespace-nowrap">
              <Icon className="w-3.5 h-3.5" strokeWidth={1.6} />
              {p.label}
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}


function CTASection({ router }: { router: ReturnType<typeof useRouter> }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-[28px] md:rounded-[36px] border border-[#F7F4D5]/10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f2e1e] via-[#0A3323] to-[#081f15]" />
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-[#F7F4D5]/[0.05] rounded-full blur-[80px] md:blur-[100px] pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, -30, 0], y: [0, 25, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 left-0 w-56 md:w-80 h-56 md:h-80 bg-[#F7F4D5]/[0.03] rounded-full blur-[60px] md:blur-[80px] pointer-events-none"
      />

      <div className="relative z-10 flex flex-col items-center text-center px-6 py-16 md:py-28 gap-6 md:gap-8">
        <motion.div
          animate={{ rotate: [0, 12, -8, 4, 0], scale: [1, 1.12, 0.96, 1.05, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-[#F7F4D5]/30" strokeWidth={1.5} />
        </motion.div>

        <h2 className="font-serif text-[clamp(2.3rem,8vw,6rem)] font-bold tracking-tight text-[#F7F4D5] leading-[1.05] md:leading-[1.0]">
          Your people are
          <br />
          <span className="italic text-[#F7F4D5]/45">already waiting.</span>
        </h2>

        <p className="text-[#F7F4D5]/40 text-base md:text-lg max-w-xs md:max-w-sm leading-relaxed">
          Three minutes to set up. A lifetime to benefit from.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/onboarding")}
            className="group relative flex items-center gap-3 px-8 py-4 md:px-10 md:py-5 bg-[#F7F4D5] text-[#0A3323] text-base md:text-lg font-bold rounded-full shadow-[0_0_60px_-10px_rgba(247,244,213,0.45)] hover:shadow-[0_0_100px_-10px_rgba(247,244,213,0.6)] transition-shadow duration-300 overflow-hidden w-full sm:w-auto justify-center"
          >
            <motion.span className="absolute inset-0 bg-white/10 rounded-full" initial={{ scale: 0, opacity: 0.5 }} whileHover={{ scale: 2.5, opacity: 0 }} transition={{ duration: 0.5 }} />
            Get Started — it&apos;s free
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </motion.button>

          <button
            onClick={() => router.push("/how-it-works")}
            className="text-sm text-[#F7F4D5]/35 hover:text-[#F7F4D5]/60 transition-colors underline underline-offset-4 mt-2 sm:mt-0"
          >
            See how it works
          </button>
        </div>
      </div>
    </motion.div>
  );
}


export default function FeaturesPage() {
  const router = useRouter();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <main className="relative min-h-screen bg-[#0A3323] text-[#F7F4D5] overflow-x-hidden">
      <GrainOverlay />
      <MouseGlow />

      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, #F7F4D5 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        <FloatingOrbs />
        <ParticleField />
        <RingPulse cx="10%"  cy="20%" delay={0} />
        <RingPulse cx="85%"  cy="55%" delay={3} />
        {/* Removed one RingPulse on mobile to improve performance */}
        <div className="hidden md:block">
          <RingPulse cx="45%"  cy="80%" delay={6} />
        </div>
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "repeating-linear-gradient(135deg, #F7F4D5 0px, #F7F4D5 1px, transparent 1px, transparent 80px)" }} />
      </div>

      {/* ── Hero ── */}
      <section ref={heroRef} className="relative min-h-[85vh] md:min-h-[88vh] flex flex-col items-center justify-center px-4 sm:px-6 pt-24 pb-12 md:pb-16 z-10 overflow-hidden">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="flex flex-col items-center text-center max-w-5xl mx-auto w-full">

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-6 md:mb-8"
          >
            <div className="h-px w-6 md:w-10 bg-[#F7F4D5]/20" />
            <span className="text-[9px] md:text-[10px] tracking-[4px] uppercase text-[#F7F4D5]/35 font-medium whitespace-nowrap">What Weave gives you</span>
            <div className="h-px w-6 md:w-10 bg-[#F7F4D5]/20" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 36, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-[clamp(2.5rem,11vw,9rem)] font-bold leading-[1.05] md:leading-[0.97] tracking-tight text-[#F7F4D5] mb-5 md:mb-6"
          >
            Everything you need
            <br className="hidden sm:block" />
            {" "}
            <span className="italic text-[#F7F4D5]/40">to stop being lonely.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28 }}
            className="text-base md:text-xl text-[#F7F4D5]/45 leading-relaxed max-w-xl px-2"
          >
            Built from the ground up for people who want real connection — not followers, not vanity metrics, not another feed to scroll.
          </motion.p>

          <PillMarquee />

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.9 }} className="flex flex-col items-center gap-2 mt-10 md:mt-12">
            <span className="text-[9px] md:text-[10px] tracking-[3px] uppercase text-[#F7F4D5]/18">Explore features</span>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }} className="w-px h-8 md:h-10 bg-gradient-to-b from-[#F7F4D5]/25 to-transparent" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Feature Rows ── */}
      <section className="relative px-4 sm:px-6 pb-24 md:pb-32 max-w-6xl mx-auto z-10 flex flex-col gap-20 md:gap-40">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#F7F4D5]/10 to-transparent -mt-4 mb-0 md:mb-4" />

        {features.map((f, i) => (
          <FeatureRow key={f.id} feature={f} index={i} />
        ))}
      </section>

      {/* ── CTA ── */}
      <section className="relative px-4 sm:px-6 pb-16 md:pb-24 max-w-5xl mx-auto z-10">
        <CTASection router={router} />
      </section>
    </main>
  );
}