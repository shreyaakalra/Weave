import { OnboardingState } from "./OnboardingFlow";

const genreOptions = [
  { value: "coming-of-age", emoji: "🌱", title: "Coming of age", desc: "Still figuring it out" },
  { value: "thriller", emoji: "🌀", title: "Thriller", desc: "Chaotic, fast, intense" },
  { value: "indie-drama", emoji: "🎭", title: "Indie drama", desc: "Quiet and complicated" },
  { value: "romcom", emoji: "💛", title: "Rom-com", desc: "Messy but loveable" },
  { value: "documentary", emoji: "🎙️", title: "Documentary", desc: "Obsessed with real things" },
  { value: "sci-fi", emoji: "🛸", title: "Sci-fi", desc: "Thinking too far ahead" },
];

export default function StepGenre({
  state,
  update,
}: {
  state: OnboardingState;
  update: (s: Partial<OnboardingState>) => void;
}) {
  return (
    <div>
      <div className="text-xs tracking-widest text-[#F7F4D5]/50 mb-2">YOUR STORY</div>
      <h1 className="text-4xl font-bold leading-none mb-3">If your life was a film genre, what would it be?</h1>
      <p className="text-[#F7F4D5]/70 mb-8">Pick one. The one that actually fits.</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {genreOptions.map((g) => (
          <button
            key={g.value}
            onClick={() => update({ genre: g.value })}
            className={`p-5 rounded-3xl border text-center transition-all ${
              state.genre === g.value
                ? "bg-[#F7F4D5] text-[#0A3323] border-[#F7F4D5]"
                : "border-[#1a5c38] bg-[#112e1e] hover:border-[#F7F4D5]/40"
            }`}
          >
            <span className="text-4xl block mb-3">{g.emoji}</span>
            <div className="font-medium">{g.title}</div>
            <div className="text-xs opacity-75 mt-1">{g.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}