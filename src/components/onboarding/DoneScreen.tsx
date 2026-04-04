import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { OnboardingState } from "./OnboardingFlow";

// Import your components
import MatchRevealCard, { MatchResponse } from "./MatchRevealCard";
import LoadingGraph from "./LoadingGraph";
import AuthWall from "./AuthWall";

export default function DoneScreen({ state }: { state: OnboardingState }) {
  const hasAttempted = useRef(false);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matchResult, setMatchResult] = useState<MatchResponse | null>(null);
  const [showSignUp, setShowSignUp] = useState(false);
  
  // THE FIX: Memory for people we have already seen/passed!
  const [seenIds, setSeenIds] = useState<string[]>([]);

  const { isSignedIn, user, isLoaded } = useUser();

  // Watch for the user to finish signing up via Clerk
  useEffect(() => {
    if (isLoaded && isSignedIn && user && showSignUp && !matchResult && !isAnalyzing && !hasAttempted.current) {
      hasAttempted.current = true; 
      handleFindMatch(user.id);
    }
    // Also trigger if they refresh the page and are ALREADY signed in, but haven't searched yet
    if (isLoaded && isSignedIn && user && !matchResult && !isAnalyzing && !hasAttempted.current) {
        hasAttempted.current = true;
        handleFindMatch(user.id);
    }
  }, [isLoaded, isSignedIn, user, showSignUp, matchResult, isAnalyzing]);

  const handleFindMatch = async (clerkId: string) => {
    setIsAnalyzing(true);
    try {
      // THE FIX: Send the seenIds to the backend!
      const payload = { ...state, clerkId, seenIds };
      const [res] = await Promise.all([
        fetch("/api/match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
        new Promise(resolve => setTimeout(resolve, 5000)), 
      ]);
      
      const data = await res.json();
      
      if (data.success && data.match && data.match.length > 0) {
        setMatchResult(data.match[0]);
      } else {
        alert("You've swiped through everyone in the graph! Invite more friends to find new matches.");
      }
    } catch (error) {
      console.error("Match failed", error);
      alert("API Error: Check your terminal to see why TigerGraph failed.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // --- THE TRAFFIC COP ROUTING --- //

  if (matchResult) {
    return (
      <MatchRevealCard 
        matchResult={matchResult} 
        state={state}
        onPass={() => {
          // THE FIX: When they pass, add this person's ID to the seen list, then clear the screen
          setSeenIds((prev) => [...prev, matchResult.v_id]);
          setMatchResult(null);
        }} 
      />
    );
  }

  if (isAnalyzing) {
    return <LoadingGraph />;
  }

  if (showSignUp && !isSignedIn) {
    return <AuthWall />;
  }

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
        {seenIds.length > 0 
          ? "Ready for your next best match?" 
          : "Your profile is built.\nNow let the graph find your person."}
      </p>
      <p className="text-xs text-[#F7F4D5]/25 mb-12 uppercase tracking-widest">
        Powered by TigerGraph &mdash; traversing{" "}
        {(800 + (state.interests?.length || 0) * 47).toLocaleString()} interest nodes
      </p>

      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => {
          // THE FIX: If they are already logged in, just run the search!
          if (isSignedIn && user) {
            handleFindMatch(user.id);
          } else {
            setShowSignUp(true);
          }
        }}
        className="px-14 py-5 bg-[#F7F4D5] text-[#0A3323] font-bold rounded-full text-lg tracking-wide"
      >
        {seenIds.length > 0 ? "Find next match →" : "Find my match →"}
      </motion.button>
    </motion.div>
  );
}