import { OnboardingState } from "./OnboardingFlow";

const depthOptions = [
  { value: "philosopher", emoji: "🪐", title: "Rabbit holes only", desc: "2am conversations about the universe" },
  { value: "witty", emoji: "⚡", title: "Fast and funny", desc: "Banter, memes, zero effort" },
  { value: "storyteller", emoji: "📖", title: "Long stories and tangents", desc: "Every answer becomes a 20-minute tale" },
  { value: "listener", emoji: "🫂", title: "I mostly listen", desc: "I’m better at making people feel heard" },
];

export default function StepDepth({
  state,
  update,
}: {
  state: OnboardingState;
  update: (s: Partial<OnboardingState>) => void;
}) {
  return (
    <div>
      <div className="text-xs tracking-widest text-[#F7F4D5]/50 mb-2">CONVERSATION STYLE</div>
      <h1 className="text-4xl font-bold leading-none mb-3">How do you talk to people you like?</h1>
      <p className="text-[#F7F4D5]/70 mb-8">There’s no wrong answer. We just match you with someone who talks the same way.</p>

      <div className="space-y-3">
        {depthOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => update({ depth: opt.value })}
            className={`w-full flex items-start gap-4 p-5 rounded-3xl border transition-all text-left ${
              state.depth === opt.value
                ? "bg-[#F7F4D5] text-[#0A3323] border-[#F7F4D5]"
                : "border-[#1a5c38] bg-[#112e1e] hover:border-[#F7F4D5]/40"
            }`}
          >
            <span className="text-3xl">{opt.emoji}</span>
            <div>
              <div className="font-medium">{opt.title}</div>
              <div className="text-sm opacity-75 mt-1">{opt.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}