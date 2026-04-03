import { OnboardingState } from "./OnboardingFlow";

const pairs = [
  ["Road trip", "City break"],
  ["Late night texts", "Morning coffee calls"],
  ["House party", "Dinner for four"],
  ["Impulsive plans", "Scheduled hangouts"],
];

export default function StepThisOrThat({ state, update }: { state: OnboardingState; update: (s: Partial<OnboardingState>) => void }) {
  return (
    <div>
      <div className="text-xs tracking-widest text-[#F7F4D5]/50 mb-2">THIS OR THAT</div>
      <h1 className="text-4xl font-bold leading-none mb-3">This or that — fast answers only.</h1>
      <p className="text-[#F7F4D5]/70 mb-8">Go with your gut. No overthinking.</p>

      <div className="space-y-4">
        {pairs.map((pair, i) => (
          <div key={i} className="grid grid-cols-[1fr_auto_1fr] border border-[#1a5c38] rounded-3xl overflow-hidden">
            <button
              onClick={() => update({ totAnswers: { ...state.totAnswers, [i]: "a" } })}
              className={`p-5 text-center transition-colors ${
                state.totAnswers[i] === "a" ? "bg-[#F7F4D5] text-[#0A3323]" : "hover:bg-[#112e1e]"
              }`}
            >
              {pair[0]}
            </button>
            <div className="bg-[#1a5c38] w-px flex items-center justify-center text-xs text-[#F7F4D5]/40 font-medium">OR</div>
            <button
              onClick={() => update({ totAnswers: { ...state.totAnswers, [i]: "b" } })}
              className={`p-5 text-center transition-colors ${
                state.totAnswers[i] === "b" ? "bg-[#F7F4D5] text-[#0A3323]" : "hover:bg-[#112e1e]"
              }`}
            >
              {pair[1]}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}