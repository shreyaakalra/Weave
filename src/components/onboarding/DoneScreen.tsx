import { useState, useEffect } from "react";
import { OnboardingState } from "./OnboardingFlow";
import { SignUp, useUser } from "@clerk/nextjs";

type MatchResponse = {
  Top?: Array<{
    v_id: string;
    attributes?: {
      score?: number;
    };
  }>;
};

export default function DoneScreen({ state }: { state: OnboardingState }) {
  // 1. All our state variables
  const [isLoading, setIsLoading] = useState(false);
  const [matchResult, setMatchResult] = useState<MatchResponse | null>(null);
  const [showSignUp, setShowSignUp] = useState(false);
  
  // 2. Clerk's hooks to check auth status
  const { isSignedIn, user, isLoaded } = useUser();

  // 3. THE LISTENER: Watch for the exact moment they finish signing up
  useEffect(() => {
    // If they just created an account, and we haven't matched them yet:
    if (isLoaded && isSignedIn && user && showSignUp && !matchResult) {
      handleFindMatch(user.id); // Pass their real, secure Clerk ID!
    }
  }, [isLoaded, isSignedIn, user, showSignUp, matchResult]);

  // 4. The API call (now accepts the clerkId)
  const handleFindMatch = async (clerkId: string) => {
    setIsLoading(true);
    try {
      // Add the clerkId to the payload we send to your backend
      const payload = { ...state, clerkId };

      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success && data.match && data.match.length > 0) {
        setMatchResult(data.match[0]);
      }
    } catch (error) {
      console.error("Failed to fetch match", error);
    } finally {
      setIsLoading(false);
    }
  };

  // UI STATE 1: WE HAVE A MATCH (The Reveal)
  if (matchResult) {
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

  // UI STATE 2: THEY CLICKED THE BUTTON (The Auth Wall)
  if (showSignUp && !isSignedIn) {
    return (
      <div className="text-center py-8 animate-in fade-in zoom-in duration-500 flex flex-col items-center">
        <div className="text-xs tracking-widest text-[#F7F4D5]/50 mb-2">LAST STEP</div>
        <div className="text-4xl font-black mb-4">Save your profile.</div>
        <p className="text-[#F7F4D5]/70 mb-8">
          Create a quick account to permanently save your Weave profile and see who you matched with.
        </p>
        
        {/* Clerk's drop-in UI. The hash routing keeps them right on this page! */}
        <div className="shadow-2xl rounded-2xl overflow-hidden">
            <SignUp routing="hash" />
        </div>
      </div>
    );
  }

  // UI STATE 3: DEFAULT SCREEN (Before clicking)
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
        // CHANGED: Instead of calling the API, it reveals the Signup form!
        onClick={() => setShowSignUp(true)}
        disabled={isLoading || (showSignUp && isSignedIn)}
        className="px-12 py-5 bg-[#F7F4D5] text-[#0A3323] font-semibold rounded-3xl text-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
      >
        {isLoading || (showSignUp && isSignedIn) ? "Consulting the Graph..." : "Find my match →"}
      </button>
    </div>
  );
}