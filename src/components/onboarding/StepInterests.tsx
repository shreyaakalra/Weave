import { OnboardingState } from "./OnboardingFlow";

const interestsList = [
  "Indie films", "Hiking", "Live music", "Reading", "Gaming", "Cooking",
  "Art", "Travel", "Coffee runs", "Tech", "Photography", "Writing",
  "Theatre", "Yoga", "Cycling", "Climbing", "Architecture", "Podcasts",
  "Astronomy", "Surfing", "Dancing", "Birdwatching", "Chess", "Volunteering",
  "Language learning", "Raving", "Thrifting", "Sketching", "Fashion", "Spirituality"
];

export default function StepInterests({
  state,
  update,
}: {
  state: OnboardingState;
  update: (s: Partial<OnboardingState>) => void;
}) {
  const toggle = (tag: string) => {
    if (state.interests.includes(tag)) {
      update({ interests: state.interests.filter((t) => t !== tag) });
    } else if (state.interests.length < 8) {
      update({ interests: [...state.interests, tag] });
    }
  };

  return (
    <div>
      <div className="text-xs tracking-widest text-[#F7F4D5]/50 mb-2">YOUR WORLD</div>
      <h1 className="text-4xl font-bold leading-none mb-3">What&apos;s your world made of?</h1>
      <p className="text-[#F7F4D5]/70 mb-6">Pick the things that actually fill your time. Be honest, not impressive.</p>

      <div className="text-xs text-[#F7F4D5]/50 mb-4">
        {state.interests.length}/8 selected
      </div>

      <div className="flex flex-wrap gap-2">
        {interestsList.map((tag) => (
          <button
            key={tag}
            onClick={() => toggle(tag)}
            className={`px-6 py-3 text-sm rounded-3xl border transition-all ${
              state.interests.includes(tag)
                ? "bg-[#F7F4D5] text-[#0A3323] border-[#F7F4D5]"
                : "border-[#1a5c38] bg-[#112e1e] hover:border-[#F7F4D5]/40"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}