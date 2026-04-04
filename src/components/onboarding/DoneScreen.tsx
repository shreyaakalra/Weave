import { useState } from "react";
import { OnboardingState } from "./OnboardingFlow";

type MatchResponse = {
  Top?: Array<{
    v_id: string;
    attributes?: {
      score?: number;
    };
  }>;
};

export default function DoneScreen({ state }: { state: OnboardingState }) {
  // Add state to handle the API request and the result
  const [isLoading, setIsLoading] = useState(false);
  const [matchResult, setMatchResult] = useState<MatchResponse | null>(null);
  
  // The function that hits your new Next.js API route
  const handleFindMatch = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });

      const data = await res.json();

      // If successful, save the match data to state to trigger the UI update
      if (data.success && data.match && data.match.length > 0) {
        setMatchResult(data.match[0]);
      }
    } catch (error) {
      console.error("Failed to fetch match", error);
    } finally {
      setIsLoading(false);
    }
  };

  // IF WE HAVE A MATCH: Render the success screen
  if (matchResult) {
    // Note: TigerGraph usually wraps output arrays in an object. 
    // We try to pull the ID from `matchResult.Top?.[0]?.v_id`. 
    // If your specific query returns a different shape, you may need to tweak this path!
    const matchedUserId = matchResult.Top?.[0]?.v_id || "A mysterious stranger";

    return (
      <div className="text-center py-8 animate-in fade-in zoom-in duration-500">
        <div className="text-xs tracking-widest text-[#F7F4D5]/50 mb-2">WE FOUND THEM</div>
        <div className="text-5xl font-black mb-4">Meet your match.</div>

        <div className="bg-[#112e1e] border border-[#1a5c38] rounded-3xl p-8 mt-8 text-left max-w-md mx-auto">
          <div className="text-3xl font-bold mb-2 text-[#F7F4D5]">
            {matchedUserId}
          </div>
          <p className="text-[#F7F4D5]/70 mb-6">
            The graph calculated a high compatibility score based on your shared interests and vibe!
          </p>
          <button
            onClick={() => alert("Chat feature coming soon!")}
            className="w-full py-4 bg-[#F7F4D5] text-[#0A3323] font-semibold rounded-2xl hover:scale-[1.02] transition-transform"
          >
            Say Hello →
          </button>
        </div>
      </div>
    );
  }

  // DEFAULT SCREEN: Before they click the button
  return (
    <div className="text-center py-8">
      <div className="text-5xl font-black mb-4">You&apos;re in, {state.nickname || state.name || "friend"}.</div>
      <p className="text-[#F7F4D5]/70 mb-8">
        Your profile is built.<br />
        Now let the graph find your person.
      </p>

      <p className="text-xs text-[#F7F4D5]/40 mb-8">
        Powered by TigerGraph — traversing{" "}
        {(800 + (state.interests?.length || 0) * 47).toLocaleString()} interest nodes
      </p>

      <button
        onClick={handleFindMatch}
        disabled={isLoading}
        className="px-12 py-5 bg-[#F7F4D5] text-[#0A3323] font-semibold rounded-3xl text-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
      >
        {isLoading ? "Consulting the Graph..." : "Find my match →"}
      </button>
    </div>
  );
}