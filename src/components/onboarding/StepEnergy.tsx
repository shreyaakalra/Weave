import { OnboardingState } from "./OnboardingFlow";

const energyOptions = [
  { value: "recharge-alone", icon: "🌙", title: "Solo recharger", desc: "Need quiet time to feel like myself again" },
  { value: "both", icon: "☁️", title: "Depends on the day", desc: "Some days I want people, some days not" },
  { value: "energised-people", icon: "☀️", title: "People fuel me", desc: "I light up around others" },
];

export default function StepEnergy({ state, update }: { state: OnboardingState; update: (s: Partial<OnboardingState>) => void }) {
  return (
    <div>
      <div className="text-xs tracking-widest text-[#F7F4D5]/50 mb-2">YOUR ENERGY</div>
      <h1 className="text-4xl font-bold leading-none mb-3">How would you describe your social energy?</h1>
      <p className="text-[#F7F4D5]/70 mb-8">Not a personality test. Just helps us find your kind of people.</p>

      <div className="space-y-3">
        {energyOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => update({ energy: opt.value })}
            className={`w-full flex items-start gap-4 p-5 rounded-3xl border transition-all text-left ${
              state.energy === opt.value
                ? "bg-[#F7F4D5] text-[#0A3323] border-[#F7F4D5]"
                : "border-[#1a5c38] bg-[#112e1e] hover:border-[#F7F4D5]/40"
            }`}
          >
            <span className="text-3xl">{opt.icon}</span>
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