import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { OnboardingState } from "./OnboardingFlow";

// Import your new shiny components!
import MatchRevealCard, { MatchResponse } from "./MatchRevealCard";
import LoadingGraph from "./LoadingGraph";
import AuthWall from "./AuthWall";

export default function DoneScreen({ state }: { state: OnboardingState }) {
  const hasAttempted = useRef(false);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matchResult, setMatchResult] = useState<MatchResponse | null>(null);
  const [showSignUp, setShowSignUp] = useState(false);

  const { isSignedIn, user, isLoaded } = useUser();

  // Watch for the user to finish signing up
  useEffect(() => {
    if (isLoaded && isSignedIn && user && showSignUp && !matchResult && !isAnalyzing && !hasAttempted.current) {
      hasAttempted.current = true; 
      handleFindMatch(user.id);
    }
    // Also trigger if they refresh the page and are ALREADY signed in
    if (isLoaded && isSignedIn && user && !matchResult && !isAnalyzing && !hasAttempted.current) {
        hasAttempted.current = true;
        handleFindMatch(user.id);
    }
  }, [isLoaded, isSignedIn, user, showSignUp, matchResult, isAnalyzing]);

  const handleFindMatch = async (clerkId: string) => {
    setIsAnalyzing(true);
    try {
      const payload = { ...state, clerkId };
      const [res] = await Promise.all([
        fetch("/api/match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
        new Promise(resolve => setTimeout(resolve, 5000)), 
      ]);
      
      const data = await res.json();
      
      // If we got a match, show it!
      if (data.success && data.match && data.match.length > 0) {
        setMatchResult(data.match[0]);
      } else {
        // If it was successful but returned NO data:
        alert("We searched the graph, but couldn't find a match right now. Ensure you have other users in your database!");
      }
    } catch (error) {
      // If the API crashed entirely:
      console.error("Match failed", error);
      alert("API Error: Check your terminal to see why TigerGraph failed.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // --- THE TRAFFIC COP ROUTING --- //

  // 1. If we have a match, show the card
  if (matchResult) {
    return <MatchRevealCard matchResult={matchResult} onPass={() => setMatchResult(null)} />;
  }

  // 2. If we are waiting for the API/Timer, show the animation
  if (isAnalyzing) {
    return <LoadingGraph />;
  }

  // 3. If they clicked the button but haven't signed up, show Clerk
  // NOTE: Ensure <AuthWall /> uses <SignUp forceRedirectUrl="/onboarding" routing="hash" />
  if (showSignUp && !isSignedIn) {
    return <AuthWall />;
  }

  // 4. Default state: The "Find my match" screen
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center text-center py-8"
    >
      <div className="text-5xl font-black mb-4 text-[#F7F4D5] leading-tight">
        You&apos;re in,<br />
        <span className="text-[#F7F4D5]/60">{state.nickname || state.name || "friend"}.</span>
      </div>
      <p className="text-[#F7F4D5]/55 mb-3 text-base leading-relaxed">
        Your profile is built.<br />Now let the graph find your person.
      </p>
      <p className="text-xs text-[#F7F4D5]/25 mb-12 uppercase tracking-widest">
        Powered by TigerGraph &mdash; traversing{" "}
        {(800 + (state.interests?.length || 0) * 47).toLocaleString()} interest nodes
      </p>

      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setShowSignUp(true)}
        className="px-14 py-5 bg-[#F7F4D5] text-[#0A3323] font-bold rounded-full text-lg tracking-wide"
      >
        Find my match →
      </motion.button>
    </motion.div>
  );
}