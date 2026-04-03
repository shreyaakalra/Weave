import { OnboardingState } from "./OnboardingFlow";

const moodOptions = [
  { value: "deep", emoji: "🌊", title: "Deep dives", desc: "I want someone to actually talk to" },
  { value: "chill", emoji: "☕", title: "Easy company", desc: "No pressure, just vibes" },
  { value: "explore", emoji: "🗺️", title: "Do things together", desc: "I want a partner in activity" },
  { value: "bored", emoji: "🎲", title: "Surprise me", desc: "I’m open to anything, match me randomly" },
];

export default function StepMood({
  state,
  update,
}: {
  state: OnboardingState;
  update: (s: Partial<OnboardingState>) => void;
}) {
  return (
    <div>
      <div className="text-xs tracking-widest text-[#F7F4D5]/50 mb-2">RIGHT NOW</div>
      <h1 className="text-4xl font-bold leading-none mb-3">What kind of connection are you looking for right now?</h1>
      <p className="text-[#F7F4D5]/70 mb-8">Your mood changes. This isn’t forever — it just shapes your next match.</p>

      <div className="grid grid-cols-2 gap-3">
        {moodOptions.map((m) => (
          <button
            key={m.value}
            onClick={() => update({ mood: m.value })}
            className={`p-6 rounded-3xl border text-left transition-all ${
              state.mood === m.value
                ? "bg-[#F7F4D5] text-[#0A3323] border-[#F7F4D5]"
                : "border-[#1a5c38] bg-[#112e1e] hover:border-[#F7F4D5]/40"
            }`}
          >
            <span className="text-4xl block mb-3">{m.emoji}</span>
            <div className="font-medium text-lg">{m.title}</div>
            <div className="text-sm opacity-75 mt-1">{m.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}