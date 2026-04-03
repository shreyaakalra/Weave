import { OnboardingState } from "./OnboardingFlow";

export default function StepBio({ state, update }: { state: OnboardingState; update: (s: Partial<OnboardingState>) => void }) {
  return (
    <div>
      <div className="text-xs tracking-widest text-[#F7F4D5]/50 mb-2">IN YOUR OWN WORDS</div>
      <h1 className="text-4xl font-bold leading-none mb-3">Say something true about yourself.</h1>
      <p className="text-[#F7F4D5]/70 mb-8">3 sentences. Write like you&apos;re texting someone you already trust.</p>

      <textarea
        rows={5}
        value={state.bio}
        onChange={(e) => update({ bio: e.target.value })}
        placeholder="e.g. I make terrible decisions about TV shows and excellent ones about snacks..."
        className="w-full bg-[#112e1e] border border-[#1a5c38] focus:border-[#F7F4D5]/40 rounded-3xl p-5 text-[#F7F4D5] outline-none resize-none"
      />

      <div className="mt-8 space-y-6">
        <div>
          <label className="block text-sm text-[#F7F4D5]/70 mb-2">Your comfort show or film</label>
          <input
            type="text"
            value={state.comfort}
            onChange={(e) => update({ comfort: e.target.value })}
            placeholder="e.g. The Office, Spirited Away..."
            className="w-full bg-[#112e1e] border border-[#1a5c38] focus:border-[#F7F4D5]/40 rounded-2xl px-5 py-4"
          />
        </div>
        <div>
          <label className="block text-sm text-[#F7F4D5]/70 mb-2">One thing you&apos;ll never do</label>
          <input
            type="text"
            value={state.neverdothis}
            onChange={(e) => update({ neverdothis: e.target.value })}
            placeholder="e.g. Go to a networking event voluntarily"
            className="w-full bg-[#112e1e] border border-[#1a5c38] focus:border-[#F7F4D5]/40 rounded-2xl px-5 py-4"
          />
        </div>
      </div>
    </div>
  );
}