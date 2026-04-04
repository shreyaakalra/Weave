import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { OnboardingState } from "./OnboardingFlow";

// Import your components
import MatchRevealCard, { MatchResponse } from "./MatchRevealCard";
import LoadingGraph from "./LoadingGraph";
import AuthWall from "./AuthWall";
import ChatScreen from "../ChatScreen";

export default function DoneScreen({ state }: { state: OnboardingState }) {
  const hasAttempted = useRef(false);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  
  // 1. NEXT.JS HYDRATION LOCK (Prevents visual glitches)
  const [isRestored, setIsRestored] = useState(false);

  // 2. MEMORY STATES (Initialized as null)
  const [matchResult, setMatchResult] = useState<MatchResponse | null>(null);
  const [activeChat, setActiveChat] = useState<MatchResponse | null>(null);
  const [seenIds, setSeenIds] = useState<string[]>([]);

  const { isSignedIn, user, isLoaded } = useUser();

  // 3. PULL FROM MEMORY ON MOUNT
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedMatch = localStorage.getItem("weaveMatchResult");
      const savedChat = localStorage.getItem("weaveActiveChat");
      const savedSeen = localStorage.getItem("weaveSeenIds");

      if (savedMatch) setMatchResult(JSON.parse(savedMatch));
      if (savedChat) setActiveChat(JSON.parse(savedChat));
      if (savedSeen) setSeenIds(JSON.parse(savedSeen));
    }
    setIsRestored(true);
  }, []);

  // 4. SAVE TO MEMORY EVERY TIME SOMETHING CHANGES
  useEffect(() => {
    if (isRestored && typeof window !== "undefined") {
      if (matchResult) localStorage.setItem("weaveMatchResult", JSON.stringify(matchResult));
      else localStorage.removeItem("weaveMatchResult");

      if (activeChat) localStorage.setItem("weaveActiveChat", JSON.stringify(activeChat));
      else localStorage.removeItem("weaveActiveChat");

      localStorage.setItem("weaveSeenIds", JSON.stringify(seenIds));
    }
  }, [matchResult, activeChat, seenIds, isRestored]);

  // Watch for the user to finish signing up via Clerk
  useEffect(() => {
    // Only auto-trigger the match if they literally JUST clicked sign up 
    if (isLoaded && isSignedIn && user && showSignUp && !matchResult && !activeChat && !isAnalyzing && !hasAttempted.current) {
      hasAttempted.current = true; 
      handleFindMatch(user.id);
    }
  }, [isLoaded, isSignedIn, user, showSignUp, matchResult, activeChat, isAnalyzing]);

  const handleFindMatch = async (clerkId: string) => {
    setIsAnalyzing(true);
    try {
      const payload = { ...state, clerkId, seenIds };
      const [res] = await Promise.all([
        fetch("/api/match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
        new Promise(resolve => setTimeout(resolve, 4000)), 
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

  // Wait until memory is fully loaded before showing anything!
  if (!isRestored) return null; 

  // 1. If we are in an active chat, show the Chat Screen
  if (activeChat) {
    return (
      <ChatScreen 
        match={activeChat} 
        onClose={() => setActiveChat(null)} 
      />
    );
  }

  // 2. If we have a match, show the card
  if (matchResult) {
    return (
      <MatchRevealCard 
        matchResult={matchResult} 
        state={state}
        onPass={() => {
          setSeenIds((prev) => [...prev, matchResult.v_id]);
          setMatchResult(null); // This automatically deletes it from memory too!
        }} 
        onChat={() => {
          setActiveChat(matchResult);
        }}
      />
    );
  }

  // 3. If we are waiting for the API/Timer, show the animation
  if (isAnalyzing) {
    return <LoadingGraph />;
  }

  // 4. If they clicked the button but haven't signed up, show Clerk
  if (showSignUp && !isSignedIn) {
    return <AuthWall />;
  }

  // 5. Default state: The "Find my match" / "Find next match" screen
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