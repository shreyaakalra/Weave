import { motion, AnimatePresence } from "framer-motion";
import { OnboardingState } from "./OnboardingFlow";

export type MatchResponse = {
  v_id: string;
  attributes?: {
    nickname?: string;
    city?: string;
    bio?: string;
    score?: number;
    energy?: string;
    mood?: string;
    depth?: string;
    schedule?: string;
    genre?: string;
    friendship_type?: string;
    [key: string]: string | number | boolean | null | undefined; 
  };
};

export default function MatchRevealCard({ 
  matchResult, 
  state, 
  onPass,
  onChat
}: { 
  matchResult: MatchResponse;
  state: OnboardingState;
  onPass: () => void;
  onChat: () => void;
}) {

  // --- 1. Basic Profile Info ---
  const matchAttrs = matchResult.attributes || {};
  const nickname = matchAttrs.nickname || matchResult.v_id || "Someone special";
  const city = matchAttrs.city || "";
  const bio = matchAttrs.bio || "";

  // --- 2. Calculate Energy ---
  let energyScore = 50;
  if (state.energy === matchAttrs.energy) {
    energyScore = 98; 
  } else if (state.energy === "both" || matchAttrs.energy === "both") {
    energyScore = 78; 
  } else {
    energyScore = 45; 
  }

  // --- 3. Calculate Vibe ---
  const vibeTraits = ['mood', 'depth', 'schedule', 'genre', 'friendship_type'];
  let matchingTraits = 0;
  vibeTraits.forEach(trait => {
    const myTrait = trait === 'friendship_type' ? state.friendship : state[trait as keyof typeof state];
    if (myTrait === matchAttrs[trait]) matchingTraits++;
  });
  const vibeScore = Math.round(40 + (matchingTraits / vibeTraits.length) * 60);

  // --- 4. Calculate Interests ---
  const rawScore = matchAttrs.score || 72;
  const interestScore = Math.min(99, Math.round((rawScore / 130) * 100));

  return (
    <AnimatePresence>
      {/* FULL BLEED BACKGROUND TAKEOVER */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[90] flex flex-col items-center justify-center w-full h-[100dvh] bg-[#0A3323] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0d3d29] to-[#0A3323] overflow-y-auto px-4 py-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="flex flex-col items-center text-center w-full max-w-md mx-auto"
        >
          {/* Header Text */}
          <div className="text-xs md:text-sm tracking-[.2em] text-[#F7F4D5]/40 uppercase mb-3 font-medium">
            Match found
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-3 text-[#F7F4D5] leading-tight drop-shadow-lg">
            Meet your person.
          </h1>
          <p className="text-[#F7F4D5]/50 text-sm md:text-base mb-12">
            TigerGraph found your strongest overlap.
          </p>

          {/* Match card */}
          <div className="w-full relative mt-4">
            {/* Score ring - Pops out the top */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6, ease: [0.17, 1.1, 0.4, 1.2] }}
              className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-[#0d3d29] border-[3px] border-[#F7F4D5]/20 flex flex-col items-center justify-center z-10 shadow-[0_0_30px_rgba(247,244,213,0.1)]"
            >
              <span className="text-xl md:text-2xl font-black text-[#F7F4D5] leading-none">{interestScore}%</span>
              <span className="text-[10px] text-[#F7F4D5]/50 uppercase tracking-widest leading-none mt-1">match</span>
            </motion.div>

            {/* Main Card Body */}
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#0A291C]/80 backdrop-blur-xl border border-[#1a5c38] rounded-[2rem] pt-14 pb-8 px-6 md:px-8 shadow-2xl w-full"
            >
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#F7F4D5]/20 to-[#F7F4D5]/5 border border-[#F7F4D5]/30 flex items-center justify-center mx-auto mb-5 shadow-inner">
                <span className="text-2xl md:text-3xl font-black text-[#F7F4D5]">
                  {nickname.charAt(0).toUpperCase()}
                </span>
              </div>

              <div className="text-3xl font-black text-[#F7F4D5] mb-1">{nickname}</div>
              {city && (
                <div className="text-sm font-medium tracking-wide text-[#F7F4D5]/40 mb-5">{city}</div>
              )}
              {bio && (
                <p className="text-sm md:text-base text-[#F7F4D5]/70 leading-relaxed mb-8 border-t border-[#F7F4D5]/10 pt-5">
                  {bio}
                </p>
              )}

              {/* Compatibility breakdown */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                {[
                  { label: "Interests", val: interestScore },
                  { label: "Energy", val: energyScore },
                  { label: "Vibe", val: vibeScore },
                ].map((d, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + (i * 0.1) }}
                    key={d.label} 
                    className="bg-[#081F15] border border-[#F7F4D5]/5 rounded-2xl p-3 md:p-4 text-center"
                  >
                    <div className="text-lg md:text-xl font-black text-[#F7F4D5]">{d.val}%</div>
                    <div className="text-[9px] md:text-[10px] text-[#F7F4D5]/40 uppercase tracking-widest mt-1">{d.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onChat}
                  className="w-full py-4 md:py-5 bg-[#F7F4D5] text-[#0A3323] font-black rounded-2xl text-base md:text-lg tracking-wide shadow-[0_0_20px_rgba(247,244,213,0.3)] hover:shadow-[0_0_30px_rgba(247,244,213,0.5)] transition-shadow"
                >
                  Start chatting →
                </motion.button>

                <button
                  onClick={onPass}
                  className="w-full py-3 text-[#F7F4D5]/40 text-sm md:text-base font-medium hover:text-[#F7F4D5] transition-colors rounded-xl hover:bg-[#F7F4D5]/5"
                >
                  Pass
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}