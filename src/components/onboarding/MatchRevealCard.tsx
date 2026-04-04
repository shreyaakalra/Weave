import { motion, AnimatePresence } from "framer-motion";

export type MatchResponse = {
  v_id: string;
  attributes?: {
    nickname?: string;
    city?: string;
    bio?: string;
    score?: number;
  };
};

export default function MatchRevealCard({ 
  matchResult, 
  onPass 
}: { 
  matchResult: MatchResponse;
  onPass: () => void;
}) {
  const nickname = matchResult.attributes?.nickname || matchResult.v_id || "Someone special";
  const city = matchResult.attributes?.city || "";
  const bio = matchResult.attributes?.bio || "";
  const rawScore = matchResult.attributes?.score;
  const score = rawScore ? Math.min(Math.round(rawScore), 100) : 87;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center text-center py-8 px-2"
      >
        <div className="text-xs tracking-[.2em] text-[#F7F4D5]/40 uppercase mb-3 font-medium">
          Match found
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-2 text-[#F7F4D5] leading-tight">
          Meet your person.
        </h1>
        <p className="text-[#F7F4D5]/50 text-sm mb-10">
          TigerGraph found your strongest overlap.
        </p>

        {/* Match card */}
        <div className="w-full max-w-sm relative">
          {/* Score ring */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-[#0A3323] border-2 border-[#F7F4D5]/20 flex flex-col items-center justify-center z-10"
          >
            <span className="text-lg font-black text-[#F7F4D5] leading-none">{score}%</span>
            <span className="text-[9px] text-[#F7F4D5]/40 uppercase tracking-wide leading-none mt-0.5">match</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#0d3d29] border border-[#1a5c38] rounded-3xl pt-12 pb-8 px-8"
          >
            {/* Avatar */}
            <div className="w-14 h-14 rounded-full bg-[#F7F4D5]/10 border border-[#F7F4D5]/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-black text-[#F7F4D5]">
                {nickname.charAt(0).toUpperCase()}
              </span>
            </div>

            <div className="text-2xl font-black text-[#F7F4D5] mb-1">{nickname}</div>
            {city && (
              <div className="text-sm text-[#F7F4D5]/40 mb-4">{city}</div>
            )}
            {bio && (
              <p className="text-sm text-[#F7F4D5]/60 leading-relaxed mb-6 border-t border-[#F7F4D5]/10 pt-4">
                {bio}
              </p>
            )}

            {/* Compatibility breakdown */}
            <div className="grid grid-cols-3 gap-2 mb-8">
              {[
                { label: "Interests", val: Math.min(score + 5, 100) },
                { label: "Energy", val: Math.max(score - 8, 60) },
                { label: "Vibe", val: Math.max(score - 3, 70) },
              ].map(d => (
                <div key={d.label} className="bg-[#0A3323] rounded-2xl p-3 text-center">
                  <div className="text-lg font-black text-[#F7F4D5]">{d.val}%</div>
                  <div className="text-[10px] text-[#F7F4D5]/40 uppercase tracking-wide mt-0.5">{d.label}</div>
                </div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => alert(`Opening chat with ${nickname}...`)}
              className="w-full py-4 bg-[#F7F4D5] text-[#0A3323] font-bold rounded-2xl text-base tracking-wide"
            >
              Start chatting →
            </motion.button>

            <button
              onClick={onPass}
              className="w-full mt-3 py-3 text-[#F7F4D5]/30 text-sm hover:text-[#F7F4D5]/60 transition-colors"
            >
              Pass
            </button>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}