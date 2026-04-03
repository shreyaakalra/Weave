import { OnboardingState } from "./OnboardingFlow";

const friendshipOptions = [
  { value: "show-up", emoji: "🫶", title: "Someone who shows up", desc: "Consistent, reliable, checks in on you" },
  { value: "adventures", emoji: "🧭", title: "An adventure buddy", desc: "For the random plans and spontaneous trips" },
  { value: "intellectual", emoji: "🧠", title: "A thinking partner", desc: "To debate, question, and obsess over ideas" },
  { value: "soft-landing", emoji: "🌿", title: "A safe space person", desc: "No judgment, no performance, just honesty" },
];

export default function StepFriendship({
  state,
  update,
}: {
  state: OnboardingState;
  update: (s: Partial<OnboardingState>) => void;
}) {
  return (
    <div>
      <div className="text-xs tracking-widest text-[#F7F4D5]/50 mb-2">WHAT YOU’RE HERE FOR</div>
      <h1 className="text-4xl font-bold leading-none mb-3">What kind of friendship are you hoping to find?</h1>
      <p className="text-[#F7F4D5]/70 mb-8">Be specific. It makes a real difference in who we match you with.</p>

      <div className="space-y-3">
        {friendshipOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => update({ friendship: opt.value })}
            className={`w-full flex items-start gap-4 p-5 rounded-3xl border transition-all text-left ${
              state.friendship === opt.value
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