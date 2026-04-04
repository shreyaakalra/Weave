import { OnboardingState } from "./OnboardingFlow";

export default function DoneScreen({ state }: { state: OnboardingState }) {
  // const displayedInterests = state.interests.slice(0, 6);

  return (
    <div className="text-center py-8">
      <div className="text-5xl font-black mb-4">You&apos;re in, {state.nickname || state.name || "friend"}.</div>
      <p className="text-[#F7F4D5]/70 mb-8">
        Your profile is built.<br />
        Now let the graph find your person.
      </p>

      {/* <div className="flex flex-wrap justify-center gap-2 mb-8">
        {displayedInterests.map((tag) => (
          <div key={tag} className="px-5 py-2 bg-[#112e1e] border border-[#1a5c38] rounded-3xl text-sm">
            {tag}
          </div>
        ))}
      </div> */}

      <p className="text-xs text-[#F7F4D5]/40 mb-8">
        Powered by TigerGraph — traversing{" "}
        {(800 + state.interests.length * 47).toLocaleString()} interest nodes
      </p>

      <button
        onClick={() => alert("🎉 Next: Match engine would open here")}
        className="px-12 py-5 bg-[#F7F4D5] text-[#0A3323] font-semibold rounded-3xl text-lg hover:scale-105 transition-transform"
      >
        Find my match →
      </button>
    </div>
  );
}