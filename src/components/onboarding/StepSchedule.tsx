import { OnboardingState } from "./OnboardingFlow";

const scheduleOptions = [
  { value: "morning", emoji: "🌅", title: "Morning person", desc: "Up early, free before noon" },
  { value: "daytime", emoji: "🏙️", title: "Daytime human", desc: "Most alive between 10am–6pm" },
  { value: "evening", emoji: "🌆", title: "Evening person", desc: "Come alive after 6pm" },
  { value: "night", emoji: "🌃", title: "Night owl", desc: "Best conversations happen past midnight" },
];

export default function StepSchedule({
  state,
  update,
}: {
  state: OnboardingState;
  update: (s: Partial<OnboardingState>) => void;
}) {
  return (
    <div>
      <div className="text-xs tracking-widest text-[#F7F4D5]/50 mb-2">YOUR RHYTHM</div>
      <h1 className="text-4xl font-bold leading-none mb-3">When do you actually exist?</h1>
      <p className="text-[#F7F4D5]/70 mb-8">Availability matters. We’ll match you with someone in a similar time zone of life.</p>

      <div className="grid grid-cols-2 gap-3">
        {scheduleOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => update({ schedule: opt.value })}
            className={`p-6 rounded-3xl border text-center transition-all ${
              state.schedule === opt.value
                ? "bg-[#F7F4D5] text-[#0A3323] border-[#F7F4D5]"
                : "border-[#1a5c38] bg-[#112e1e] hover:border-[#F7F4D5]/40"
            }`}
          >
            <span className="text-4xl block mb-3">{opt.emoji}</span>
            <div className="font-medium">{opt.title}</div>
            <div className="text-sm opacity-75 mt-2">{opt.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}