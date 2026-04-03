import { OnboardingState } from "./OnboardingFlow";

export default function StepBasics({
  state,
  update,
}: {
  state: OnboardingState;
  update: (s: Partial<OnboardingState>) => void;
}) {
  return (
    <div>
      <div className="text-xs tracking-widest text-[#F7F4D5]/50 mb-2">LET&apos;S START</div>
      <h1 className="text-4xl font-bold leading-none mb-3">First, what do we call you?</h1>
      <p className="text-[#F7F4D5]/70 mb-8">No pressure — you&apos;ll use a nickname publicly.</p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm text-[#F7F4D5]/70 mb-2">Your real name</label>
          <input
            type="text"
            value={state?.name || ""}
            onChange={(e) => update({ name: e.target.value })}
            placeholder="e.g. Priya"
            className="w-full bg-[#112e1e] border border-[#1a5c38] focus:border-[#F7F4D5]/40 rounded-2xl px-5 py-4 text-[#F7F4D5] outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-[#F7F4D5]/70 mb-2">
            Your nickname on Weave <span className="text-[#F7F4D5]/40 text-xs">(what others see)</span>
          </label>
          <input
            type="text"
            value={state?.nickname || ""}
            onChange={(e) => update({ nickname: e.target.value })}
            placeholder="e.g. sunflower, chai.person"
            className="w-full bg-[#112e1e] border border-[#1a5c38] focus:border-[#F7F4D5]/40 rounded-2xl px-5 py-4 text-[#F7F4D5] outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-[#F7F4D5]/70 mb-2">Your city</label>
          <input
            type="text"
            value={state?.city || ""}
            onChange={(e) => update({ city: e.target.value })}
            placeholder="e.g. Delhi, Mumbai, Bangalore"
            className="w-full bg-[#112e1e] border border-[#1a5c38] focus:border-[#F7F4D5]/40 rounded-2xl px-5 py-4 text-[#F7F4D5] outline-none"
          />
        </div>
      </div>
    </div>
  );
}