import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { OnboardingState } from "./OnboardingFlow";
import MatchRevealCard, { MatchResponse } from "./MatchRevealCard";
import LoadingGraph from "./LoadingGraph";
import AuthWall from "./AuthWall";
import ChatScreen from "../ChatScreen";

export default function DoneScreen({ state }: { state: OnboardingState }) {
  const hasAttempted = useRef(false);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  // 1. NEXT.JS HYDRATION LOCK
  const [isRestored, setIsRestored] = useState(false);

  // 2. MEMORY STATES
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

  // 4. SAVE TO MEMORY
  useEffect(() => {
    if (isRestored && typeof window !== "undefined") {
      if (matchResult) {
        localStorage.setItem("weaveMatchResult", JSON.stringify(matchResult));
      } else {
        localStorage.removeItem("weaveMatchResult");
      }

      if (activeChat) {
        localStorage.setItem("weaveActiveChat", JSON.stringify(activeChat));
      } else {
        localStorage.removeItem("weaveActiveChat");
      }

      localStorage.setItem("weaveSeenIds", JSON.stringify(seenIds));
    }
  }, [matchResult, activeChat, seenIds, isRestored]);

  // Watch for sign-up completion
  useEffect(() => {
    if (
      isLoaded &&
      isSignedIn &&
      user &&
      showSignUp &&
      !matchResult &&
      !activeChat &&
      !isAnalyzing &&
      !hasAttempted.current
    ) {
      hasAttempted.current = true;
      handleFindMatch(user.id);
    }
  }, [isLoaded, isSignedIn, user, showSignUp, matchResult, activeChat, isAnalyzing]);

  const handleFindMatch = async (
    clerkId: string,
    currentSeenIds: string[] = seenIds,
  ) => {
    setIsAnalyzing(true);
    try {
      const payload = { ...state, clerkId, seenIds: currentSeenIds };
      const [res] = await Promise.all([
        fetch("/api/match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
        new Promise((resolve) => setTimeout(resolve, 4000)),
      ]);

      const data = await res.json();
      console.log("API RESPONSE from /api/match:", JSON.stringify(data, null, 2)); 

      if (data.success && data.match && data.match.length > 0) {
        setMatchResult(data.match[0]);
      } else {
        console.warn("No match returned (should not happen)");
      }
    } catch (error) {
      console.error("Match failed", error);
      alert("API Error: Check your terminal.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!isRestored) return null;

  if (activeChat) {
    return <ChatScreen match={activeChat} onClose={() => setActiveChat(null)} />;
  }

    if (matchResult) {
    return (
      <MatchRevealCard
        matchResult={matchResult}
        state={state}
        onPass={() => {
          const newSeenIds = [...seenIds, matchResult.v_id];
          setSeenIds(newSeenIds);
          setMatchResult(null);
          // Removed auto handleFindMatch → now goes straight back to button screen
        }}
        onChat={() => {
          setActiveChat(matchResult);
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

  // Default "Find my/next match" screen
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center text-center py-8"
    >
      <div className="text-5xl font-black mb-4 text-[#F7F4D5] leading-tight">
        You&apos;re in,
        <br />
        <span className="text-[#F7F4D5]/60">
          {state.nickname || state.name || "friend"}.
        </span>
      </div>
      <p className="text-[#F7F4D5]/55 mb-3 text-base leading-relaxed">
        {seenIds.length > 0
          ? "Ready for your next best match?"
          : "Your profile is built.\nNow let the graph find your person."}
      </p>
      <p className="text-xs text-[#F7F4D5]/25 mb-12 uppercase tracking-widest">
        Powered by TigerGraph &mdash; traversing{" "}
        {(800 + (state.interests?.length || 0) * 47).toLocaleString()} interest
        nodes
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